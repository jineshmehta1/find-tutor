import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            include: {
                student: true,
                teacher: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Don't return password
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, phone, address, profilePhoto, subjects, education, experience, certifications } = body;

        // Update user basic info
        const updateData: any = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;

        const user = await prisma.user.update({
            where: { email: session.user.email! },
            data: updateData,
            include: {
                student: true,
                teacher: true,
            },
        });

        // Update role-specific data
        if (user.role === "STUDENT" && subjects && user.student) {
            await prisma.student.update({
                where: { id: user.student.id },
                data: {
                    subjects: JSON.stringify(subjects),
                },
            });
        }

        if (user.role === "TEACHER" && user.teacher) {
            const teacherUpdateData: any = {};
            if (subjects) teacherUpdateData.subjects = JSON.stringify(subjects);
            if (education) teacherUpdateData.education = education;
            if (experience) teacherUpdateData.experience = experience;
            if (certifications) teacherUpdateData.certifications = JSON.stringify(certifications);

            if (Object.keys(teacherUpdateData).length > 0) {
                await prisma.teacher.update({
                    where: { id: user.teacher.id },
                    data: teacherUpdateData,
                });
            }
        }

        // Fetch updated user
        const updatedUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            include: {
                student: true,
                teacher: true,
            },
        });

        const { password, ...userWithoutPassword } = updatedUser!;

        return NextResponse.json({
            message: "Profile updated successfully",
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
