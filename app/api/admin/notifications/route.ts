import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, body, audience, channel } = await request.json();

        if (!title || !body) {
            return NextResponse.json({ error: "Title and body required" }, { status: 400 });
        }

        // Count recipients by audience
        let recipientCount = 0;
        if (audience === "ALL") {
            recipientCount = await prisma.user.count();
        } else if (audience === "TEACHER") {
            recipientCount = await prisma.user.count({ where: { role: "TEACHER" } });
        } else if (audience === "STUDENT") {
            recipientCount = await prisma.user.count({ where: { role: "STUDENT" } });
        }

        // TODO: integrate with a real push/email service (e.g. Firebase FCM, OneSignal, or Resend)
        // For now, we log it and return the count
        console.log(`[Admin Notification] "${title}" → ${audience} (${channel}) — ${recipientCount} recipients`);

        return NextResponse.json({
            success: true,
            title,
            body,
            audience,
            channel,
            recipientCount,
        });
    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }
}
