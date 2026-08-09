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

        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                student: {
                    include: {
                        user: {
                            select: { name: true, email: true, phone: true }
                        }
                    }
                },
                teacher: {
                    include: {
                        user: {
                            select: { name: true, phone: true }
                        }
                    }
                }
            }
        });

        // Also fetch all approved tutors to allow assignment
        const approvedTutors = await prisma.teacher.findMany({
            where: { isApproved: true },
            include: {
                user: {
                    select: { name: true }
                }
            }
        });

        return NextResponse.json({ leads, approvedTutors });
    } catch (error) {
        console.error("Error fetching admin leads:", error);
        return NextResponse.json(
            { error: "Failed to fetch leads" },
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
        const { leadId, status, teacherId } = body;

        if (!leadId) {
            return NextResponse.json(
                { error: "Lead ID is required" },
                { status: 400 }
            );
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (teacherId !== undefined) updateData.teacherId = teacherId;

        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: updateData,
            include: {
                student: {
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                },
                teacher: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                }
            }
        });

        return NextResponse.json(updatedLead);
    } catch (error) {
        console.error("Error updating lead:", error);
        return NextResponse.json(
            { error: "Failed to update lead" },
            { status: 500 }
        );
    }
}
