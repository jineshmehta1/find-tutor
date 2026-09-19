import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateHaversineDistance } from "@/lib/geoUtils";
import { matchesClassLevel } from "@/lib/classConstants";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const subject = searchParams.get("subject");
        const area = searchParams.get("area");
        const mode = searchParams.get("mode");
        const classLevel = searchParams.get("classLevel");
        const approvedOnly = searchParams.get("approved") !== "false";
        
        const latParam = searchParams.get("lat");
        const lngParam = searchParams.get("lng");
        const radiusParam = searchParams.get("radius");

        const reqLat = latParam ? parseFloat(latParam) : null;
        const reqLng = lngParam ? parseFloat(lngParam) : null;
        const reqRadius = radiusParam ? parseFloat(radiusParam) : null;

        // Build where clause
        const where: any = {};

        if (approvedOnly) {
            where.isApproved = true;
        }

        if (mode) {
            where.teachingMode = { contains: mode, mode: "insensitive" };
        }

        // Get teachers with user data
        const teachers = await prisma.teacher.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        profilePhoto: true,
                        address: true,
                        latitude: true,
                        longitude: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Filter by subject if specified
        let filteredTeachers = teachers;
        if (subject) {
            filteredTeachers = teachers.filter((teacher) => {
                const subjects = JSON.parse(teacher.subjects || "[]");
                return subjects.some((s: string) =>
                    s.toLowerCase().includes(subject.toLowerCase())
                );
            });
        }

        // Filter by area if specified (flexible word matching or distance)
        if (area && (!reqLat || !reqLng)) {
            const terms = area.toLowerCase().split(/[\s,]+/).filter(Boolean);
            filteredTeachers = filteredTeachers.filter((teacher) => {
                if (!teacher.user.address) return false;
                const addrLower = teacher.user.address.toLowerCase();
                return terms.some((term) => addrLower.includes(term));
            });
        }

        // Filter by class level if specified (using matchesClassLevel)
        if (classLevel) {
            filteredTeachers = filteredTeachers.filter((teacher) =>
                matchesClassLevel(teacher.classesOrAgeGroup, classLevel, teacher.subjects)
            );
        }

        // Map teachers with distance calculation
        let mappedTeachers = filteredTeachers.map((teacher) => {
            let distanceKm: number | null = null;
            if (reqLat !== null && reqLng !== null && teacher.user.latitude && teacher.user.longitude) {
                distanceKm = calculateHaversineDistance(
                    reqLat,
                    reqLng,
                    teacher.user.latitude,
                    teacher.user.longitude
                );
            }

            return {
                id: teacher.id,
                userId: teacher.userId,
                name: teacher.user.name,
                email: teacher.user.email,
                phone: teacher.user.phone,
                profilePhoto: teacher.user.profilePhoto,
                address: teacher.user.address,
                latitude: teacher.user.latitude,
                longitude: teacher.user.longitude,
                distanceKm,
                education: teacher.education,
                experience: teacher.experience,
                certifications: JSON.parse(teacher.certifications || "[]"),
                subjects: JSON.parse(teacher.subjects || "[]"),
                teachingMode: teacher.teachingMode,
                expectedFee: teacher.expectedFee,
                feeType: teacher.feeType,
                classesOrAgeGroup: teacher.classesOrAgeGroup ? (() => { try { return JSON.parse(teacher.classesOrAgeGroup); } catch { return teacher.classesOrAgeGroup; } })() : null,
                qualificationLevel: teacher.qualificationLevel,
                qualificationName: teacher.qualificationName,
                achievements: teacher.achievements,
                isApproved: teacher.isApproved,
                createdAt: teacher.createdAt,
            };
        });

        // Filter by radius if coordinates and radius provided
        if (reqLat !== null && reqLng !== null && reqRadius !== null && reqRadius > 0) {
            mappedTeachers = mappedTeachers.filter((t) => {
                if (t.distanceKm !== null && t.distanceKm !== undefined) {
                    return t.distanceKm <= reqRadius;
                }
                return false;
            });
        }


        // Sort by distance if distanceKm is present
        if (reqLat !== null && reqLng !== null) {
            mappedTeachers.sort((a, b) => {
                if (a.distanceKm !== null && b.distanceKm !== null) {
                    return a.distanceKm - b.distanceKm;
                }
                if (a.distanceKm !== null) return -1;
                if (b.distanceKm !== null) return 1;
                return 0;
            });
        }

        return NextResponse.json(mappedTeachers);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return NextResponse.json(
            { error: "Failed to fetch teachers" },
            { status: 500 }
        );
    }
}


