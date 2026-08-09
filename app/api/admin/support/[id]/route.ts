import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { status, adminNote } = body;

        const ticket = await prisma.supportTicket.update({
            where: { id: params.id },
            data: {
                ...(status && { status }),
                ...(adminNote !== undefined && { adminNote })
            }
        });

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("Error updating support ticket:", error);
        return NextResponse.json({ error: "Failed to update support ticket" }, { status: 500 });
    }
}
