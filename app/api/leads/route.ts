import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();
        const { message, location, latitude, longitude, subject, classLevel, mode, teacherId, name, email, phone } = body;

        let studentId = "";

        const isStudentSession = session?.user?.role === "STUDENT";
        if (isStudentSession && session?.user?.email) {
            const student = await prisma.student.findFirst({
                where: {
                    user: {
                        email: session.user.email,
                        role: "STUDENT",
                    },
                },
            });
            if (student) {
                studentId = student.id;
            }
        }

        if (!studentId) {
            const targetEmail = (email || (isStudentSession && session?.user?.email ? session.user.email : "") || "").toLowerCase().trim();
            const targetPhone = (phone || "").trim();

            let student = await prisma.student.findFirst({
                where: {
                    user: {
                        role: "STUDENT",
                        OR: [
                            ...(targetEmail ? [{ email: { equals: targetEmail, mode: "insensitive" as const } }] : []),
                            ...(targetPhone ? [{ phone: targetPhone }] : []),
                        ],
                    },
                },
            });

            if (!student) {
                // Check if student user exists by email or phone before attempting user creation (exclude teachers)
                const existingUser = await prisma.user.findFirst({
                    where: {
                        role: "STUDENT",
                        OR: [
                            ...(targetEmail ? [{ email: { equals: targetEmail, mode: "insensitive" as const } }] : []),
                            ...(targetPhone ? [{ phone: targetPhone }] : []),
                        ],
                    },
                    include: { student: true },
                });

                if (existingUser) {
                    if (existingUser.student) {
                        student = existingUser.student;
                    } else {
                        // Create student relation for existing student user
                        const newStudentRel = await prisma.student.create({
                            data: {
                                userId: existingUser.id,
                                subjects: JSON.stringify([subject || "General"]),
                            },
                        });
                        student = newStudentRel;
                    }
                } else {
                    const fallbackEmail = targetEmail || `student_lead_${Date.now()}@aacharya.net`;
                    const fallbackPhone = targetPhone || "0000000000";
                    const randomPassword = Math.random().toString(36).slice(-8);
                    const passwordHash = await require("bcryptjs").hash(randomPassword, 10);

                    const newUser = await prisma.user.create({
                        data: {
                            name: name || "Student / Parent Contact",
                            email: fallbackEmail,
                            phone: fallbackPhone,
                            password: passwordHash,
                            role: "STUDENT",
                            dob: new Date(),
                            address: location || "Vijayawada",
                            student: {
                                create: {
                                    subjects: JSON.stringify([subject || "General"]),
                                },
                            },
                        },
                        include: {
                            student: true,
                        },
                    });
                    student = newUser.student as any;
                }
            }
            if (student) {
                studentId = student.id;
            }
        }

        if (!studentId) {
            return NextResponse.json(
                { error: "Could not create student profile" },
                { status: 500 }
            );
        }

        const contactHeader = name ? `Parent / Contact: ${name}` : "";
        const formattedMessage = contactHeader && !message?.includes("Parent / Contact:")
            ? `${contactHeader} | ${message || "Tuition Enquiry"}`
            : (message || null);

        const lead = await prisma.lead.create({
            data: {
                studentId: studentId,
                teacherId: teacherId || null,
                message: formattedMessage,
                location: location || null,
                latitude: latitude ? parseFloat(latitude.toString()) : null,
                longitude: longitude ? parseFloat(longitude.toString()) : null,
                subject: subject || null,
                classLevel: classLevel || null,
                mode: mode || null,
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
            const currentTeacher = await prisma.teacher.findFirst({
                where: { user: { email: session.user.email } },
                select: { id: true, createdAt: true }
            });

            // Show leads created on or after the teacher's profile registration date (so older historical leads are hidden)
            const dateFilter = currentTeacher?.createdAt ? {
                createdAt: {
                    gte: currentTeacher.createdAt
                }
            } : {};

            const rawLeads = await prisma.lead.findMany({
                where: dateFilter,
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
                    contacts: {
                        select: {
                            teacherId: true,
                            createdAt: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            leads = rawLeads.map((l) => ({
                ...l,
                contactCount: l.contacts?.length || 0,
                hasContacted: currentTeacher ? Boolean(l.contacts?.some((c) => c.teacherId === currentTeacher.id)) : false,
            }));
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

        const teacher = await prisma.teacher.findFirst({
            where: { user: { email: session.user.email } },
            select: { id: true }
        });

        if (!teacher) {
            return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
        }

        if (status === "CONTACTED") {
            // Record this tutor's contact in LeadContact table without flipping lead to dead/closed
            await prisma.leadContact.upsert({
                where: {
                    leadId_teacherId: {
                        leadId,
                        teacherId: teacher.id
                    }
                },
                create: {
                    leadId,
                    teacherId: teacher.id
                },
                update: {}
            });

            const contactCount = await prisma.leadContact.count({
                where: { leadId }
            });

            const lead = await prisma.lead.findUnique({
                where: { id: leadId },
            });

            return NextResponse.json({
                message: "Contact recorded successfully",
                lead,
                contactCount,
                hasContacted: true,
            });
        }

        // For CONVERTED, REJECTED, PENDING
        const lead = await prisma.lead.update({
            where: { id: leadId },
            data: { 
                status,
                teacherId: status === "CONVERTED" ? teacher.id : undefined
            },
        });

        const contactCount = await prisma.leadContact.count({
            where: { leadId }
        });

        return NextResponse.json({
            message: "Lead status updated",
            lead,
            contactCount,
            hasContacted: true,
        });
    } catch (error) {
        console.error("Error updating lead:", error);
        return NextResponse.json(
            { error: "Failed to update lead" },
            { status: 500 }
        );
    }
}
