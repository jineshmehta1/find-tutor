import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Retrieve scheduled classes or active student relationships
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { teacher: true, student: true }
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const mode = request.nextUrl.searchParams.get("mode");

        // Mode: students - Fetch matched students for the tutor to populate select dropdown
        if (mode === "students" && user.role === "TEACHER" && user.teacher) {
            const matchedLeads = await prisma.lead.findMany({
                where: {
                    teacherId: user.teacher.id,
                    status: { in: ["CONVERTED", "CONTACTED"] }
                },
                include: {
                    student: {
                        include: { user: { select: { name: true } } }
                    }
                }
            });
            const students = matchedLeads.map(l => ({
                id: l.student.id,
                name: l.student.user.name
            }));
            return NextResponse.json(students);
        }

        // Default: Fetch scheduled classes
        let classes: any[] = [];
        if (user.role === "TEACHER" && user.teacher) {
            classes = await prisma.scheduledClass.findMany({
                where: { teacherId: user.teacher.id },
                include: { student: { include: { user: { select: { name: true } } } } },
                orderBy: { date: "asc" }
            });
        } else if (user.role === "STUDENT" && user.student) {
            classes = await prisma.scheduledClass.findMany({
                where: { studentId: user.student.id },
                include: { teacher: { include: { user: { select: { name: true } } } } },
                orderBy: { date: "asc" }
            });
        }

        return NextResponse.json(classes);
    } catch (error: any) {
        console.error("Error retrieving scheduled classes:", error);
        return NextResponse.json({ error: "Failed to load classes", details: error?.message || error }, { status: 500 });
    }
}

// POST - Coach schedules a new class
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { teacher: true }
        });
        if (!user || user.role !== "TEACHER" || !user.teacher) {
            return NextResponse.json({ error: "Only verified teachers can schedule classes" }, { status: 403 });
        }

        const body = await request.json();
        const { studentId, subject, date, time, duration, meetLink, classRate } = body;

        if (!studentId || !subject || !date || !time) {
            return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
        }

        const newClass = await prisma.scheduledClass.create({
            data: {
                teacherId: user.teacher.id,
                studentId,
                subject,
                date,
                time,
                duration: duration || "1 hour",
                meetLink: meetLink || null,
                classRate: classRate ? parseFloat(classRate) : null,
                status: "CONFIRMED"
            }
        });

        return NextResponse.json(newClass, { status: 201 });
    } catch (error) {
        console.error("Error creating scheduled class:", error);
        return NextResponse.json({ error: "Failed to schedule class" }, { status: 500 });
    }
}

// PATCH - Update class status (e.g. mark as COMPLETED or CANCELLED)
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { teacher: true }
        });
        if (!user || user.role !== "TEACHER" || !user.teacher) {
            return NextResponse.json({ error: "Only verified teachers can modify classes" }, { status: 403 });
        }

        const body = await request.json();
        const { classId, status } = body;

        if (!classId || !status) {
            return NextResponse.json({ error: "Class ID and status are required" }, { status: 400 });
        }

        const existingClass = await prisma.scheduledClass.findUnique({
            where: { id: classId },
            include: { student: { include: { user: { select: { name: true } } } } }
        });

        if (!existingClass || existingClass.teacherId !== user.teacher.id) {
            return NextResponse.json({ error: "Class not found or not owned by you" }, { status: 404 });
        }

        const updatedClass = await prisma.scheduledClass.update({
            where: { id: classId },
            data: { status }
        });

        // If completed, calculate earnings and add record
        if (status === "COMPLETED" && existingClass.status !== "COMPLETED") {
            let amount = 0;
            if (existingClass.classRate !== null && existingClass.classRate !== undefined) {
                amount = existingClass.classRate;
            } else {
                // Parse duration to calculate earnings
                const durationMatch = existingClass.duration.match(/[\d.]+/);
                const hours = durationMatch ? parseFloat(durationMatch[0]) : 1;
                const hourlyRate = 500; // ₹500/hour default tutor rate
                amount = hours * hourlyRate;
            }

            await prisma.tutorEarning.create({
                data: {
                    teacherId: user.teacher.id,
                    amount,
                    status: "PENDING",
                    description: `Completed class: ${existingClass.subject} with ${existingClass.student.user.name} (${existingClass.duration})`
                }
            });
        }

        return NextResponse.json(updatedClass);
    } catch (error) {
        console.error("Error updating class status:", error);
        return NextResponse.json({ error: "Failed to update class" }, { status: 500 });
    }
}

