import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

        let reports = [];
        if (user.role === "TEACHER" && user.teacher) {
            reports = await prisma.studentProgressReport.findMany({
                where: { teacherId: user.teacher.id },
                include: { student: { include: { user: { select: { name: true } } } } },
                orderBy: { reportDate: "desc" }
            });
        } else if (user.role === "STUDENT" && user.student) {
            reports = await prisma.studentProgressReport.findMany({
                where: { studentId: user.student.id },
                include: { teacher: { include: { user: { select: { name: true } } } } },
                orderBy: { reportDate: "desc" }
            });
        }

        return NextResponse.json(reports);
    } catch (error) {
        console.error("Error fetching progress reports:", error);
        return NextResponse.json({ error: "Failed to fetch progress reports" }, { status: 500 });
    }
}

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
            return NextResponse.json({ error: "Only teachers can create progress reports" }, { status: 403 });
        }

        const body = await request.json();
        const { studentId, subject, grade, attendance, testScore, behavior, comments } = body;

        if (!studentId || !subject || !grade || attendance === undefined || !behavior || !comments) {
            return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
        }

        const newReport = await prisma.studentProgressReport.create({
            data: {
                teacherId: user.teacher.id,
                studentId,
                subject,
                grade,
                attendance: parseFloat(attendance),
                testScore: testScore || null,
                behavior,
                comments
            }
        });

        return NextResponse.json(newReport, { status: 201 });
    } catch (error) {
        console.error("Error creating progress report:", error);
        return NextResponse.json({ error: "Failed to create progress report" }, { status: 500 });
    }
}
