import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Only students can create leads
        if (session.user.role !== "STUDENT") {
            return NextResponse.json(
                { error: "Only students can contact teachers" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { message } = body;

        // Get the student record
        const student = await prisma.student.findFirst({
            where: {
                user: {
                    email: session.user.email,
                },
            },
        });

        if (!student) {
            return NextResponse.json(
                { error: "Student profile not found" },
                { status: 404 }
            );
        }

        // Create broadcast lead (visible to all teachers)
        const lead = await prisma.lead.create({
            data: {
                studentId: student.id,
                message: message || null,
                status: "PENDING",
            },
        });

        return NextResponse.json({
            message: "Lead created successfully",
            lead: {
                id: lead.id,
                status: lead.status,
                createdAt: lead.createdAt,
            },
        });
    } catch (error) {
        console.error("Error creating lead:", error);
        return NextResponse.json(
            { error: "Failed to send contact request" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role");

        let leads;

        if (session.user.role === "TEACHER" || role === "teacher") {
            // Show all student leads to all teachers
            leads = await prisma.lead.findMany({
                include: {
                    student: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    phone: true,
                                    address: true,
                                    profilePhoto: true,
                                },
                            },
                        },
                    },
                    teacher: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else if (session.user.role === "STUDENT") {
            // Get leads from this student
            const student = await prisma.student.findFirst({
                where: {
                    user: {
                        email: session.user.email,
                    },
                },
            });

            if (!student) {
                return NextResponse.json([]);
            }

            leads = await prisma.lead.findMany({
                where: {
                    studentId: student.id,
                },
                include: {
                    teacher: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    phone: true,
                                    address: true,
                                    profilePhoto: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else {
            return NextResponse.json([]);
        }

        return NextResponse.json(leads);
    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json(
            { error: "Failed to fetch leads" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "TEACHER") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { leadId, status } = body;

        if (!leadId || !status) {
            return NextResponse.json(
                { error: "Lead ID and status are required" },
                { status: 400 }
            );
        }

        const validStatuses = ["PENDING", "CONTACTED", "CONVERTED", "REJECTED"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        const lead = await prisma.lead.update({
            where: { id: leadId },
            data: { status },
        });

        return NextResponse.json({
            message: "Lead status updated",
            lead,
        });
    } catch (error) {
        console.error("Error updating lead:", error);
        return NextResponse.json(
            { error: "Failed to update lead" },
            { status: 500 }
        );
    }
}
