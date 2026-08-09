import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ─────────────────────────────────────────────────────────────
   Nominatim geocoder — called only when User.latitude is null
   Rate-limits to 1 request/sec to comply with ToS
   ───────────────────────────────────────────────────────────── */
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const encoded = encodeURIComponent(address);
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
            { headers: { "User-Agent": "aacharya-admin-map/1.0" } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.length) return null;
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
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

        /* ── 1. Fetch all approved teachers with user lat/lng ── */
        const teachers = await prisma.teacher.findMany({
            where: { isApproved: true },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        latitude: true,
                        longitude: true,
                        profilePhoto: true,
                    }
                },
                leads: { select: { id: true } }
            }
        });

        /* ── 2. Fetch all students with user lat/lng ── */
        const students = await prisma.student.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        latitude: true,
                        longitude: true,
                    }
                }
            }
        });

        /* ── 3. Fetch all pending leads (unmatched) ── */
        const leads = await prisma.lead.findMany({
            where: { status: "PENDING", teacherId: null },
            include: {
                student: {
                    include: {
                        user: {
                            select: { name: true, latitude: true, longitude: true, address: true }
                        }
                    }
                }
            }
        });

        /* ─────────────────────────────────────────────────────────
           Helper: resolve coordinates — use stored lat/lng or
           geocode address text and save back to DB for next time
           ───────────────────────────────────────────────────────── */
        const resolveCoords = async (userId: string, storedLat: number | null, storedLng: number | null, address: string) => {
            if (storedLat !== null && storedLng !== null) {
                return { lat: storedLat, lng: storedLng };
            }
            if (!address) return null;
            const coords = await geocodeAddress(address);
            if (coords) {
                // Persist for next time — fire and forget
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
                        address: t.user.address,
                        profilePhoto: t.user.profilePhoto,
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
                        address: s.user.address,
                        lat: coords.lat,
                        lng: coords.lng,
                    };
                })
            )
        ).filter(Boolean);

        /* ── 6. Build lead markers (unmatched demand hotspots) ── */
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
                        } else if (u?.address) {
                            const coords = await geocodeAddress(l.location || u.address);
                            if (coords) { lat = coords.lat; lng = coords.lng; }
                        }
                    }

                    if (!lat || !lng) return null;

                    return {
                        id: l.id,
                        type: "lead" as const,
                        studentName: l.student?.user?.name || "Student",
                        subject: l.subject || "General",
                        classLevel: l.classLevel || "—",
                        location: l.location || l.student?.user?.address || "—",
                        lat,
                        lng,
                    };
                })
            )
        ).filter(Boolean);

        /* ── 7. Summary stats ── */
        const stats = {
            totalTutors: tutorMarkers.length,
            totalStudents: studentMarkers.length,
            unmatchedLeads: leadMarkers.length,
            tutorsWithNoGeo: teachers.length - tutorMarkers.length,
            studentsWithNoGeo: students.length - studentMarkers.length,
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
