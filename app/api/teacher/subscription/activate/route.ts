import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST - Verify payment and activate subscription
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { paymentId, planId } = await req.json();

        if (!paymentId || !planId) {
            return NextResponse.json({ error: "Payment ID and Plan ID required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { teacher: true },
        });

        if (!user?.teacher) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
        }

        const plan = await prisma.subscriptionPlan.findUnique({
            where: { id: parseInt(planId) },
        });

        if (!plan) {
            return NextResponse.json({ error: "Plan not found" }, { status: 404 });
        }

        // Calculate new subscription end date
        const now = new Date();
        let subscriptionEnd = new Date();

        // If existing subscription is still active, extend from that date
        if (user.teacher.subscriptionEnd && new Date(user.teacher.subscriptionEnd) > now) {
            subscriptionEnd = new Date(user.teacher.subscriptionEnd);
        }

        subscriptionEnd.setDate(subscriptionEnd.getDate() + plan.duration);

        // Update teacher subscription
        await prisma.teacher.update({
            where: { id: user.teacher.id },
            data: {
                subscriptionStatus: "active",
                subscriptionEnd,
                subscriptionPaymentId: paymentId,
            },
        });

        return NextResponse.json({
            message: "Subscription activated!",
            subscriptionEnd,
            status: "active",
        });
    } catch (error) {
        console.error("Error activating subscription:", error);
        return NextResponse.json({ error: "Failed to activate subscription" }, { status: 500 });
    }
}
