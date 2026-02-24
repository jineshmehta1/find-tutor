import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const subject = searchParams.get("subject");
        const area = searchParams.get("area");
        const mode = searchParams.get("mode");
        const classLevel = searchParams.get("classLevel");
        const approvedOnly = searchParams.get("approved") !== "false";

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

        // Filter by area if specified
        if (area) {
            filteredTeachers = filteredTeachers.filter((teacher) =>
                teacher.user.address.toLowerCase().includes(area.toLowerCase())
            );
        }

        // Filter by class level if specified
        if (classLevel) {
            filteredTeachers = filteredTeachers.filter((teacher) => {
                if (!teacher.classesOrAgeGroup) return false;
                try {
                    const classes = JSON.parse(teacher.classesOrAgeGroup);
                    return classes.some((c: string) =>
                        c.toLowerCase().includes(classLevel.toLowerCase())
                    );
                } catch {
                    return teacher.classesOrAgeGroup.toLowerCase().includes(classLevel.toLowerCase());
                }
            });
        }

        // Transform response
        const response = filteredTeachers.map((teacher) => ({
            id: teacher.id,
            userId: teacher.userId,
            name: teacher.user.name,
            email: teacher.user.email,
            phone: teacher.user.phone,
            profilePhoto: teacher.user.profilePhoto,
            address: teacher.user.address,
            latitude: teacher.user.latitude,
            longitude: teacher.user.longitude,
            education: teacher.education,
            experience: teacher.experience,
            certifications: JSON.parse(teacher.certifications || "[]"),
            subjects: JSON.parse(teacher.subjects || "[]"),
            teachingMode: teacher.teachingMode,
            classesOrAgeGroup: teacher.classesOrAgeGroup ? (() => { try { return JSON.parse(teacher.classesOrAgeGroup); } catch { return teacher.classesOrAgeGroup; } })() : null,
            qualificationLevel: teacher.qualificationLevel,
            qualificationName: teacher.qualificationName,
            achievements: teacher.achievements,
            isApproved: teacher.isApproved,
            createdAt: teacher.createdAt,
        }));

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return NextResponse.json(
            { error: "Failed to fetch teachers" },
            { status: 500 }
        );
    }
}

