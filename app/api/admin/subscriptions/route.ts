import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all teachers with subscription info
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        const where: any = {};
        if (status && status !== "all") {
            where.subscriptionStatus = status;
        }

        const teachers = await prisma.teacher.findMany({
            where,
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
            orderBy: { updatedAt: "desc" },
        });

        // Add computed fields
        const now = new Date();
        const enriched = teachers.map((t) => {
            const isExpired = t.subscriptionEnd ? new Date(t.subscriptionEnd) < now : false;
            const daysRemaining = t.subscriptionEnd
                ? Math.max(0, Math.ceil((new Date(t.subscriptionEnd).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
                : 0;
            return { ...t, isExpired, daysRemaining };
        });

        return NextResponse.json(enriched);
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
