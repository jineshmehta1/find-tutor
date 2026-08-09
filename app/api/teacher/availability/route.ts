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
            include: { teacher: true }
        });

        if (!user || user.role !== "TEACHER" || !user.teacher) {
            return NextResponse.json({ error: "Only teachers can view availability settings" }, { status: 403 });
        }

        const availabilities = await prisma.tutorAvailability.findMany({
            where: { teacherId: user.teacher.id },
            orderBy: { dayOfWeek: "asc" }
        });

        return NextResponse.json(availabilities);
    } catch (error) {
        console.error("Error fetching availability:", error);
        return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
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
            return NextResponse.json({ error: "Only teachers can update availability" }, { status: 403 });
        }

        const body = await request.json();
        const { slots } = body; // Array of { dayOfWeek: number, startTime: string, endTime: string }

        if (!Array.isArray(slots)) {
            return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
        }

        // Clean existing availability slots for this teacher
        await prisma.tutorAvailability.deleteMany({
            where: { teacherId: user.teacher.id }
        });

        // Insert new slots
        const newSlots = await prisma.tutorAvailability.createMany({
            data: slots.map((s: any) => ({
                teacherId: user.teacher!.id,
                dayOfWeek: parseInt(s.dayOfWeek),
                startTime: s.startTime,
                endTime: s.endTime
            }))
        });

        return NextResponse.json({ message: "Availability updated successfully", count: newSlots.count });
    } catch (error) {
        console.error("Error updating availability:", error);
        return NextResponse.json({ error: "Failed to update availability" }, { status: 500 });
    }
}
