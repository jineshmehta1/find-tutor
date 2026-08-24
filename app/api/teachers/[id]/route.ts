import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        // Atomically increment views count when profile is fetched
        let teacher;
        try {
            teacher = await prisma.teacher.update({
                where: { id },
                data: {
                    views: {
                        increment: 1
                    }
                },
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
                            dob: true,
                            gender: true,
                            preferredLanguage: true,
                        },
                    },
                },
            });
        } catch {
            teacher = await prisma.teacher.findUnique({
                where: { id },
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
                            dob: true,
                            gender: true,
                            preferredLanguage: true,
                        },
                    },
                },
            });
        }

        if (!teacher) {
            return NextResponse.json(
                { error: "Tutor not found" },
                { status: 404 }
            );
        }

        // Transform response
        const response = {
            id: teacher.id,
            userId: teacher.userId,
            name: teacher.user.name,
            email: teacher.user.email,
            phone: teacher.user.phone,
            profilePhoto: teacher.user.profilePhoto,
            address: teacher.user.address,
            latitude: teacher.user.latitude,
            longitude: teacher.user.longitude,
            dob: teacher.user.dob,
            gender: teacher.user.gender,
            preferredLanguage: teacher.user.preferredLanguage,
            education: teacher.education,
            experience: teacher.experience,
            certifications: (() => { try { return JSON.parse(teacher.certifications || "[]"); } catch { return []; } })(),
            subjects: (() => { try { return JSON.parse(teacher.subjects || "[]"); } catch { return []; } })(),
            teachingMode: teacher.teachingMode,
            classesOrAgeGroup: teacher.classesOrAgeGroup ? (() => { try { return JSON.parse(teacher.classesOrAgeGroup); } catch { return teacher.classesOrAgeGroup; } })() : null,
            qualificationLevel: teacher.qualificationLevel,
            qualificationName: teacher.qualificationName,
            achievements: teacher.achievements,
            isApproved: teacher.isApproved,
            createdAt: teacher.createdAt,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching tutor detail:", error);
        return NextResponse.json(
            { error: "Failed to fetch tutor details" },
            { status: 500 }
        );
    }
}
