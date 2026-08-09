import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role");
        const approved = searchParams.get("approved");

        const where: any = {};

        if (role && role !== "ALL") {
            where.role = role;
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                profilePhoto: true,
                role: true,
                createdAt: true,
                teacher: {
                    select: {
                        id: true,
                        isApproved: true,
                        education: true,
                        experience: true,
                        subjects: true,
                        certifications: true,
                    },
                },
                student: {
                    select: {
                        id: true,
                        subjects: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Filter by approval status if specified
        let filteredUsers = users;
        if (approved !== null && approved !== "ALL") {
            if (approved === "pending") {
                filteredUsers = users.filter(
                    (u) => u.role === "TEACHER" && u.teacher && !u.teacher.isApproved
                );
            } else if (approved === "approved") {
                filteredUsers = users.filter(
                    (u) => u.role === "TEACHER" && u.teacher && u.teacher.isApproved
                );
            }
        }

        return NextResponse.json(filteredUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { action } = body;

        if (!action) {
            return NextResponse.json(
                { error: "Action is required" },
                { status: 400 }
            );
        }

        if (action === "update_profile") {
            const { userId, name, phone, address, teacher } = body;
            if (!userId) {
                return NextResponse.json({ error: "User ID is required" }, { status: 400 });
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    name,
                    phone,
                    address,
                }
            });

            if (updatedUser.role === "TEACHER" && teacher) {
                await prisma.teacher.update({
                    where: { userId },
                    data: {
                        education: teacher.education,
                        experience: teacher.experience,
                        subjects: JSON.stringify(teacher.subjects || []),
                        certifications: JSON.stringify(teacher.certifications || []),
                    }
                });
            }

            return NextResponse.json({ message: "Profile updated successfully" });
        }

        if (action === "approve_certificate" || action === "reject_certificate") {
            const { teacherId, certIndex } = body;
            if (!teacherId || certIndex === undefined) {
                return NextResponse.json({ error: "Teacher ID and Certificate Index are required" }, { status: 400 });
            }

            const teacherRecord = await prisma.teacher.findUnique({
                where: { id: teacherId }
            });
            if (!teacherRecord) {
                return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
            }

            let certs = [];
            try {
                certs = JSON.parse(teacherRecord.certifications || "[]");
            } catch (e) {
                certs = [];
            }

            if (certs[certIndex]) {
                if (typeof certs[certIndex] === "string") {
                    certs[certIndex] = { text: certs[certIndex], isApproved: action === "approve_certificate" };
                } else {
                    certs[certIndex].isApproved = action === "approve_certificate";
                }
            }

            await prisma.teacher.update({
                where: { id: teacherId },
                data: {
                    certifications: JSON.stringify(certs)
                }
            });

            return NextResponse.json({ message: `Certificate ${action === "approve_certificate" ? "approved" : "rejected"} successfully` });
        }

        if (action === "approve") {
            const { teacherId } = body;
            if (!teacherId) {
                return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 });
            }
            const trialEnd = new Date();
            trialEnd.setDate(trialEnd.getDate() + 30); // 30-day free trial

            await prisma.teacher.update({
                where: { id: teacherId },
                data: {
                    isApproved: true,
                    approvedAt: new Date(),
                    subscriptionStatus: "trial",
                    subscriptionEnd: trialEnd,
                },
            });
            return NextResponse.json({ message: "Teacher approved with 30-day free trial" });
        } else if (action === "reject") {
            const { teacherId } = body;
            if (!teacherId) {
                return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 });
            }
            await prisma.teacher.update({
                where: { id: teacherId },
                data: {
                    isApproved: false,
                    subscriptionStatus: "none",
                    subscriptionEnd: null,
                },
            });
            return NextResponse.json({ message: "Teacher approval revoked" });
        }

        return NextResponse.json(
            { error: "Invalid action" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        // Delete user (cascading will handle related records)
        await prisma.user.delete({
            where: { id: userId },
        });

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
