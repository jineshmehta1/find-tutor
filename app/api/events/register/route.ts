import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Fetch registrations for current student
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { student: true },
        });

        if (!user?.student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const registrations = await prisma.eventRegistration.findMany({
            where: { studentId: user.student.id },
            include: {
                event: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(registrations);
    } catch (error) {
        console.error("Error fetching registrations:", error);
        return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
    }
}

// POST - Register for an event
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { student: true },
        });

        if (!user?.student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const { eventId, name, email, phone, age, paymentId, amount } = await req.json();

        if (!eventId || !name || !email || !phone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if already registered
        const existing = await prisma.eventRegistration.findUnique({
            where: {
                eventId_studentId: {
                    eventId: parseInt(eventId),
                    studentId: user.student.id,
                },
            },
        });

        if (existing) {
            return NextResponse.json({ error: "Already registered for this event" }, { status: 409 });
        }

        const registration = await prisma.eventRegistration.create({
            data: {
                eventId: parseInt(eventId),
                studentId: user.student.id,
                name,
                email,
                phone,
                age: age || null,
                paymentId: paymentId || null,
                amount: parseInt(amount) || 0,
                status: paymentId ? "confirmed" : "registered",
            },
            include: { event: true },
        });

        return NextResponse.json(registration, { status: 201 });
    } catch (error) {
        console.error("Error creating registration:", error);
        return NextResponse.json({ error: "Failed to register" }, { status: 500 });
    }
}
