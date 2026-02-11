import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Check teacher subscription status
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { teacher: true },
        });

        if (!user?.teacher) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
        }

        const teacher = user.teacher;
        const now = new Date();

        let hasAccess = false;
        let daysRemaining = 0;
        let status = teacher.subscriptionStatus;

        if (status === "trial" || status === "active") {
            if (teacher.subscriptionEnd && new Date(teacher.subscriptionEnd) > now) {
                hasAccess = true;
                daysRemaining = Math.ceil(
                    (new Date(teacher.subscriptionEnd).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                );
            } else {
                // Trial/subscription expired — update status
                await prisma.teacher.update({
                    where: { id: teacher.id },
                    data: { subscriptionStatus: "expired" },
                });
                status = "expired";
                hasAccess = false;
            }
        }

        // Not approved yet = no access
        if (!teacher.isApproved) {
            hasAccess = false;
            status = "none";
        }

        return NextResponse.json({
            hasAccess,
            status,
            isApproved: teacher.isApproved,
            subscriptionEnd: teacher.subscriptionEnd,
            daysRemaining,
        });
    } catch (error) {
        console.error("Error checking subscription:", error);
        return NextResponse.json({ error: "Failed to check subscription" }, { status: 500 });
    }
}
