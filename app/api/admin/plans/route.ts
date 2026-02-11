import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all subscription plans
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const activeOnly = searchParams.get("active");

        const where: any = {};
        if (activeOnly === "true") where.isActive = true;

        const plans = await prisma.subscriptionPlan.findMany({
            where,
            orderBy: { price: "asc" },
        });

        return NextResponse.json(plans);
    } catch (error) {
        console.error("Error fetching plans:", error);
        return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
    }
}

// POST - Create plan
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const plan = await prisma.subscriptionPlan.create({
            data: {
                name: body.name,
                price: parseInt(body.price),
                duration: parseInt(body.duration),
                description: body.description,
                features: typeof body.features === "string" ? body.features : JSON.stringify(body.features || []),
                isActive: body.isActive ?? true,
            },
        });

        return NextResponse.json(plan, { status: 201 });
    } catch (error) {
        console.error("Error creating plan:", error);
        return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
    }
}

// PATCH - Update plan
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (!id) return NextResponse.json({ error: "Plan ID required" }, { status: 400 });

        if (data.price) data.price = parseInt(data.price);
        if (data.duration) data.duration = parseInt(data.duration);
        if (data.features && typeof data.features !== "string") {
            data.features = JSON.stringify(data.features);
        }

        const plan = await prisma.subscriptionPlan.update({
            where: { id: parseInt(id) },
            data,
        });

        return NextResponse.json(plan);
    } catch (error) {
        console.error("Error updating plan:", error);
        return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
    }
}

// DELETE - Delete plan
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Plan ID required" }, { status: 400 });

        await prisma.subscriptionPlan.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ message: "Plan deleted" });
    } catch (error) {
        console.error("Error deleting plan:", error);
        return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
    }
}
