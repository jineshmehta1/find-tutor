import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { teacher: true }
        });

        if (!user || user.role !== "TEACHER" || !user.teacher) {
            return NextResponse.json({ error: "Only teachers can view earnings" }, { status: 403 });
        }

        const earnings = await prisma.tutorEarning.findMany({
            where: { teacherId: user.teacher.id },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(earnings);
    } catch (error) {
        console.error("Error fetching earnings:", error);
        return NextResponse.json({ error: "Failed to fetch earnings" }, { status: 500 });
    }
}
