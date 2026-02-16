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
        console.log("Register API Hit");
        const session = await getServerSession(authOptions);
        let studentId = null;

        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                include: { student: true },
            });
            if (user?.student) {
                studentId = user.student.id;
            }
        }

        const body = await req.json();
        console.log("Registration Payload:", body);
        const { eventId, name, email, phone, age, paymentId, amount } = body;

        if (!eventId || !name || !email || !phone) {
            console.error("Missing fields:", { eventId, name, email, phone });
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const parsedEventId = parseInt(eventId);
        if (isNaN(parsedEventId)) {
            console.error("Invalid Event ID:", eventId);
            return NextResponse.json({ error: "Invalid Event ID" }, { status: 400 });
        }

        // Check if already registered (only for logged-in students)
        if (studentId) {
            const existing = await prisma.eventRegistration.findUnique({
                where: {
                    eventId_studentId: {
                        eventId: parsedEventId,
                        studentId: studentId,
                    },
                },
            });

            if (existing) {
                return NextResponse.json({ error: "Already registered for this event" }, { status: 409 });
            }
        }

        console.log("Creating registration with studentId:", studentId);

        const registration = await prisma.eventRegistration.create({
            data: {
                eventId: parsedEventId,
                studentId: studentId || null, // Explicitly null if undefined/falsey
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

        console.log("Registration Success:", registration.id);
        return NextResponse.json(registration, { status: 201 });
    } catch (error) {
        console.error("Registration Create Error:", error);
        return NextResponse.json({ error: "Failed to register", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
