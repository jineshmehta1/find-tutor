import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all event registrations (admin)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const eventId = searchParams.get("eventId");
        const status = searchParams.get("status");

        const where: any = {};
        if (eventId) where.eventId = parseInt(eventId);
        if (status && status !== "all") where.status = status;

        const registrations = await prisma.eventRegistration.findMany({
            where,
            include: {
                event: {
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        category: true,
                        date: true,
                        status: true,
                        registrationFeeDisplay: true,
                    },
                },
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
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(registrations);
    } catch (error) {
        console.error("Error fetching registrations:", error);
        return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
    }
}

// PATCH - Update registration status (admin)
export async function PATCH(req: NextRequest) {
    try {
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: "ID and status required" }, { status: 400 });
        }

        const registration = await prisma.eventRegistration.update({
            where: { id: parseInt(id) },
            data: { status },
        });

        return NextResponse.json(registration);
    } catch (error) {
        console.error("Error updating registration:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
