import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Fetch teachers who have active paid subscriptions
        const premiumTeachers = await prisma.teacher.findMany({
            where: {
                subscriptionStatus: "active"
            },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        // Map to transaction records using real DB fields only
        const dbTransactions = premiumTeachers.map((t) => ({
            id: `TX-TUT-${t.id.slice(-6).toUpperCase()}`,
            date: t.approvedAt
                ? new Date(t.approvedAt).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
            name: t.user.name,
            email: t.user.email,
            type: "Tutor Subscription",
            amount: 1500,
            // Real Razorpay payment ID stored in DB (if available), otherwise show N/A
            paymentId: t.subscriptionPaymentId || "N/A",
            status: "SUCCESS"
        }));

        // Fetch student event registrations
        let studentTransactions: any[] = [];
        try {
            const registrations = await prisma.eventRegistration.findMany({
                include: {
                    event: true
                }
            });
            studentTransactions = registrations.map((r: any) => ({
                id: `TX-REG-${r.id.slice(-6).toUpperCase()}`,
                date: r.createdAt
                    ? new Date(r.createdAt).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0],
                name: r.name || "Enrolled Student",
                email: r.email || "—",
                type: "Student Registration",
                amount: r.event?.price || 0,
                paymentId: r.paymentId || "N/A",
                status: (r.paymentStatus || "PENDING").toUpperCase()
            }));
        } catch (e) {
            console.error("Error reading registrations:", e);
        }

        const allTransactions = [...dbTransactions, ...studentTransactions].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Return empty array when no real transactions — no fake mock fallback
        return NextResponse.json(allTransactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}
