import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { KNOWN_LOCALITIES } from "@/lib/geoUtils";

/* ─────────────────────────────────────────────────────────────
   Multi-tier Geocoder:
   1. Fast instant lookup against KNOWN_LOCALITIES dictionary
   2. Cleaned street address Nominatim fallback
   3. Fallback to locality / city center
   ───────────────────────────────────────────────────────────── */
function matchKnownLocality(address: string): { lat: number; lng: number } | null {
    if (!address) return null;
    const norm = address.toLowerCase();
    for (const [key, val] of Object.entries(KNOWN_LOCALITIES)) {
        if (norm.includes(key.toLowerCase())) {
            return { lat: val.lat, lng: val.lng };
        }
    }
    return null;
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        if (!address || !address.trim()) return null;

        // 1. Direct local lookup (0ms)
        const localMatch = matchKnownLocality(address);
        if (localMatch) return localMatch;

        // 2. Strip apartment / door number tokens so Nominatim recognizes locality & city
        const cleaned = address
            .replace(/^(flat|d\.?\s*no|door|plot|#|\d+)[^,]+,/i, "")
            .replace(/(apartment|apt|nilayam|nivas|tower|residency|villa|complex)[^,]*,/i, "")
            .trim();

        const queryToUse = cleaned.length >= 3 ? cleaned : address;
        const encoded = encodeURIComponent(queryToUse);
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
            { headers: { "User-Agent": "aacharya-admin-map/1.0" } }
        );
        if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
                return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
            }
        }

        // 3. Last fallback if city is mentioned
        if (/bhavani\s*puram/i.test(address)) {
            return { lat: 16.5273, lng: 80.5960 };
        }
        if (/mulapadu/i.test(address)) {
            return { lat: 16.6116, lng: 80.4683 };
        }
        if (/kanchikacherla/i.test(address)) {
            return { lat: 16.6854, lng: 80.3920 };
        }
        if (/vijayawada/i.test(address)) {
            return { lat: 16.5062, lng: 80.6480 };
        }

        return null;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        /* ── 1. Fetch ALL teachers (approved & pending verification) ── */
        const teachers = await prisma.teacher.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true,
                        latitude: true,
                        longitude: true,
                        profilePhoto: true,
                    }
                },
                leads: { select: { id: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        /* ── 2. Fetch ALL students with details ── */
        const students = await prisma.student.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true,
                        latitude: true,
                        longitude: true,
                    }
                },
                leads: { select: { id: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        /* ── 3. Fetch ALL leads (pending demand & converted classes) ── */
        const leads = await prisma.lead.findMany({
            include: {
                student: {
                    include: {
                        user: {
                            select: { id: true, name: true, phone: true, email: true, latitude: true, longitude: true, address: true }
                        }
                    }
                },
                teacher: {
                    include: {
                        user: {
                            select: { id: true, name: true, phone: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        /* ─────────────────────────────────────────────────────────
           Helper: resolve coordinates — use stored lat/lng or
           geocode address text and persist back to DB for next time
           ───────────────────────────────────────────────────────── */
        const resolveCoords = async (userId: string, storedLat: number | null, storedLng: number | null, address: string) => {
            if (storedLat !== null && storedLng !== null && !isNaN(storedLat) && !isNaN(storedLng)) {
                return { lat: storedLat, lng: storedLng };
            }
            if (!address || !address.trim()) return null;
            const coords = await geocodeAddress(address);
            if (coords) {
                // Persist for future instant loading
                prisma.user.update({
                    where: { id: userId },
                    data: { latitude: coords.lat, longitude: coords.lng }
                }).catch(() => {});
            }
            return coords;
        };

        /* ── 4. Build tutor markers ── */
        const tutorMarkers = (
            await Promise.all(
                teachers.map(async (t) => {
                    const coords = await resolveCoords(
                        t.user.id,
                        t.user.latitude,
                        t.user.longitude,
                        t.user.address
                    );
                    if (!coords) return null;
                    return {
                        id: t.id,
                        type: "tutor" as const,
                        name: t.user.name,
                        email: t.user.email,
                        phone: t.user.phone,
                        address: t.user.address,
                        profilePhoto: t.user.profilePhoto,
                        isApproved: t.isApproved,
                        approvalStatus: t.isApproved ? ("approved" as const) : ("pending" as const),
                        expectedFee: t.expectedFee,
                        feeType: t.feeType || "/hr",
                        teachingMode: t.teachingMode,
                        subjects: t.subjects,
                        experience: t.experience,
                        education: t.education,
                        leadCount: t.leads.length,
                        subscriptionStatus: t.subscriptionStatus,
                        lat: coords.lat,
                        lng: coords.lng,
                    };
                })
            )
        ).filter(Boolean);

        /* ── 5. Build student markers ── */
        const studentMarkers = (
            await Promise.all(
                students.map(async (s) => {
                    const coords = await resolveCoords(
                        s.user.id,
                        s.user.latitude,
                        s.user.longitude,
                        s.user.address
                    );
                    if (!coords) return null;
                    return {
                        id: s.id,
                        type: "student" as const,
                        name: s.user.name,
                        email: s.user.email,
                        phone: s.user.phone,
                        address: s.user.address,
                        subjects: s.subjects,
                        leadCount: s.leads.length,
                        lat: coords.lat,
                        lng: coords.lng,
                    };
                })
            )
        ).filter(Boolean);

        /* ── 6. Build lead markers (both pending hotspots & converted leads) ── */
        const leadMarkers = (
            await Promise.all(
                leads.map(async (l) => {
                    // Use lead's own lat/lng first, else fall back to student's
                    let lat = l.latitude;
                    let lng = l.longitude;

                    if (!lat || !lng) {
                        const u = l.student?.user;
                        if (u?.latitude && u?.longitude) {
                            lat = u.latitude;
                            lng = u.longitude;
                        } else if (l.location || u?.address) {
                            const coords = await geocodeAddress(l.location || u?.address || "");
                            if (coords) {
                                lat = coords.lat;
                                lng = coords.lng;
                            }
                        }
                    }

                    if (!lat || !lng) return null;

                    return {
                        id: l.id,
                        type: "lead" as const,
                        studentName: l.student?.user?.name || "Student",
                        studentPhone: l.student?.user?.phone,
                        studentEmail: l.student?.user?.email,
                        teacherName: l.teacher?.user?.name || null,
                        subject: l.subject || "General",
                        classLevel: l.classLevel || "—",
                        mode: l.mode || "Online",
                        status: l.status,
                        location: l.location || l.student?.user?.address || "—",
                        createdAt: l.createdAt,
                        lat,
                        lng,
                    };
                })
            )
        ).filter(Boolean);

        /* ── 7. Summary stats ── */
        const stats = {
            totalTutors: teachers.length,
            approvedTutors: teachers.filter(t => t.isApproved).length,
            pendingTutors: teachers.filter(t => !t.isApproved).length,
            totalStudents: students.length,
            totalLeads: leads.length,
            unmatchedLeads: leads.filter(l => l.status === "PENDING" || !l.teacherId).length,
            convertedLeads: leads.filter(l => l.status === "CONVERTED" || !!l.teacherId).length,
            tutorsWithNoGeo: teachers.length - tutorMarkers.length,
            studentsWithNoGeo: students.length - studentMarkers.length,
            tutorsOnMap: tutorMarkers.length,
            studentsOnMap: studentMarkers.length,
            leadsOnMap: leadMarkers.length,
        };

        return NextResponse.json({
            tutors: tutorMarkers,
            students: studentMarkers,
            leads: leadMarkers,
            stats,
        });
    } catch (error) {
        console.error("Error fetching map analytics:", error);
        return NextResponse.json({ error: "Failed to fetch map analytics" }, { status: 500 });
    }
}
