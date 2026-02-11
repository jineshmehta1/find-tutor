import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all events
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const status = searchParams.get("status");

        const where: any = {};
        if (category && category !== "all") where.category = category;
        if (status && status !== "all") where.status = status;

        const events = await prisma.event.findMany({
            where,
            orderBy: { date: "asc" },
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}

// POST - Create new event
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Generate slug from title
        const slug = body.slug || body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const event = await prisma.event.create({
            data: {
                slug,
                title: body.title,
                category: body.category,
                date: body.date,
                time: body.time,
                endDate: body.endDate || body.date,
                location: body.location,
                address: body.address,
                participants: body.participants,
                prize: body.prize,
                description: body.description,
                longDescription: body.longDescription || body.description,
                image: body.image || "/placeholder.svg",
                status: body.status || "upcoming",
                registrationFee: parseInt(body.registrationFee) || 0,
                registrationFeeDisplay: body.registrationFeeDisplay || `₹${body.registrationFee}`,
                features: typeof body.features === "string" ? body.features : JSON.stringify(body.features || []),
                organizer: body.organizer || "Aacharya Academy",
                contact: body.contact || "+91 98646 46481",
            },
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error: any) {
        console.error("Error creating event:", error);
        if (error.code === "P2002") {
            return NextResponse.json({ error: "An event with this slug already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }
}

// PATCH - Update event
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
        }

        if (data.features && typeof data.features !== "string") {
            data.features = JSON.stringify(data.features);
        }
        if (data.registrationFee) {
            data.registrationFee = parseInt(data.registrationFee);
        }

        const event = await prisma.event.update({
            where: { id: parseInt(id) },
            data,
        });

        return NextResponse.json(event);
    } catch (error) {
        console.error("Error updating event:", error);
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }
}

// DELETE - Delete event
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
        }

        await prisma.event.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: "Event deleted" });
    } catch (error) {
        console.error("Error deleting event:", error);
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
}
