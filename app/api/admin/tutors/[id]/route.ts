import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/tutors/[id] - Fetch full teacher profile with all user & proof details
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        // Try finding by teacherId first, then by userId
        let teacher = await prisma.teacher.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        dob: true,
                        gender: true,
                        preferredLanguage: true,
                        profilePhoto: true,
                        address: true,
                        latitude: true,
                        longitude: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });

        if (!teacher) {
            teacher = await prisma.teacher.findUnique({
                where: { userId: id },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            dob: true,
                            gender: true,
                            preferredLanguage: true,
                            profilePhoto: true,
                            address: true,
                            latitude: true,
                            longitude: true,
                            role: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
            });
        }

        if (!teacher) {
            return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
        }

        return NextResponse.json(teacher);
    } catch (error) {
        console.error("Error fetching admin teacher profile:", error);
        return NextResponse.json({ error: "Failed to fetch teacher profile" }, { status: 500 });
    }
}

// PATCH /api/admin/tutors/[id] - Admin update teacher profile or verification status
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();

        // Locate teacher record
        let teacher = await prisma.teacher.findUnique({ where: { id } });
        if (!teacher) {
            teacher = await prisma.teacher.findUnique({ where: { userId: id } });
        }

        if (!teacher) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
        }

        const {
            name,
            phone,
            address,
            dob,
            gender,
            preferredLanguage,
            profilePhoto,
            education,
            experience,
            qualificationLevel,
            qualificationName,
            subjects,
            teachingMode,
            expectedFee,
            feeType,
            classesOrAgeGroup,
            achievements,
            certifications,
            qualificationCertificate,
            identityProof,
            achievementCertificate,
            isApproved,
        } = body;

        // 1. Update User basic info
        const userUpdateData: any = {};
        if (name !== undefined) userUpdateData.name = name;
        if (phone !== undefined) userUpdateData.phone = phone;
        if (address !== undefined) userUpdateData.address = address;
        if (dob !== undefined && dob) userUpdateData.dob = new Date(dob);
        if (gender !== undefined) userUpdateData.gender = gender;
        if (preferredLanguage !== undefined) userUpdateData.preferredLanguage = preferredLanguage;
        if (profilePhoto !== undefined) userUpdateData.profilePhoto = profilePhoto;

        if (Object.keys(userUpdateData).length > 0) {
            await prisma.user.update({
                where: { id: teacher.userId },
                data: userUpdateData,
            });
        }

        // 2. Update Teacher profile data
        const teacherUpdateData: any = {};
        if (education !== undefined) teacherUpdateData.education = education;
        if (experience !== undefined) teacherUpdateData.experience = experience;
        if (qualificationLevel !== undefined) teacherUpdateData.qualificationLevel = qualificationLevel;
        if (qualificationName !== undefined) teacherUpdateData.qualificationName = qualificationName;
        if (subjects !== undefined) teacherUpdateData.subjects = typeof subjects === "string" ? subjects : JSON.stringify(subjects || []);
        if (teachingMode !== undefined) teacherUpdateData.teachingMode = teachingMode;
        if (expectedFee !== undefined) teacherUpdateData.expectedFee = expectedFee ? parseInt(String(expectedFee)) : null;
        if (feeType !== undefined) teacherUpdateData.feeType = feeType;
        if (classesOrAgeGroup !== undefined) teacherUpdateData.classesOrAgeGroup = typeof classesOrAgeGroup === "string" ? classesOrAgeGroup : JSON.stringify(classesOrAgeGroup || []);
        if (achievements !== undefined) teacherUpdateData.achievements = achievements;
        if (certifications !== undefined) teacherUpdateData.certifications = typeof certifications === "string" ? certifications : JSON.stringify(certifications || []);
        if (qualificationCertificate !== undefined) teacherUpdateData.qualificationCertificate = qualificationCertificate;
        if (identityProof !== undefined) teacherUpdateData.identityProof = identityProof;
        if (achievementCertificate !== undefined) teacherUpdateData.achievementCertificate = achievementCertificate;

        if (isApproved !== undefined) {
            teacherUpdateData.isApproved = isApproved;
            if (isApproved) {
                teacherUpdateData.approvedAt = new Date();
                if (teacher.subscriptionStatus === "none") {
                    const trialEnd = new Date();
                    trialEnd.setDate(trialEnd.getDate() + 30);
                    teacherUpdateData.subscriptionStatus = "trial";
                    teacherUpdateData.subscriptionEnd = trialEnd;
                }
            } else {
                teacherUpdateData.approvedAt = null;
            }
        }

        if (Object.keys(teacherUpdateData).length > 0) {
            await prisma.teacher.update({
                where: { id: teacher.id },
                data: teacherUpdateData,
            });
        }

        // Fetch refreshed record
        const updatedTeacher = await prisma.teacher.findUnique({
            where: { id: teacher.id },
            include: { user: true },
        });

        return NextResponse.json({
            message: "Teacher profile updated successfully",
            teacher: updatedTeacher,
        });
    } catch (error) {
        console.error("Error updating admin teacher profile:", error);
        return NextResponse.json({ error: "Failed to update teacher profile" }, { status: 500 });
    }
}
