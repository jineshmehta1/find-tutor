import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch tickets
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isAdmin = user.role === "ADMIN";

        const tickets = await prisma.supportTicket.findMany({
            where: isAdmin ? undefined : { userId: user.id },
            include: {
                user: {
                    select: { name: true, email: true, role: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        const formatted = tickets.map(t => ({
            id: t.id,
            subject: t.subject,
            message: t.message,
            userType: t.user.role,
            userName: t.user.name,
            userEmail: t.user.email,
            status: t.status,
            priority: t.priority,
            createdAt: t.createdAt.toISOString(),
            adminNote: t.adminNote || undefined
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Error fetching support tickets:", error);
        return NextResponse.json({ error: "Failed to fetch support tickets" }, { status: 500 });
    }
}

// POST - Create a new support ticket (for Student/Teacher)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { subject, message, priority } = await request.json();
        if (!subject || !message) {
            return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
        }

        const ticket = await prisma.supportTicket.create({
            data: {
                userId: user.id,
                subject,
                message,
                priority: priority || "MEDIUM",
                status: "OPEN"
            }
        });

        return NextResponse.json(ticket, { status: 201 });
    } catch (error) {
        console.error("Error creating support ticket:", error);
        return NextResponse.json({ error: "Failed to create support ticket" }, { status: 500 });
    }
}
