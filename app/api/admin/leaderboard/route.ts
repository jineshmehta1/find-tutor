import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const teachers = await prisma.teacher.findMany({
            where: { isApproved: true },
            include: {
                user: {
                    select: { name: true, profilePhoto: true }
                },
                leads: { select: { id: true } }
            }
        });

        const allReviews = await prisma.review.findMany();

        const leaderboard = teachers.map((t) => {
            const tutorReviews = allReviews.filter(r => r.pageKey === t.id);
            const totalRating = tutorReviews.reduce((sum, r) => sum + r.rating, 0);
            const avgRating = tutorReviews.length
                ? parseFloat((totalRating / tutorReviews.length).toFixed(1))
                : null;

            const leadCount   = t.leads.length;
            const reviewCount = tutorReviews.length;

            // Composite score: leads × 10 + avgRating × 20 + reviews × 5
            const ratingPoints  = avgRating ? avgRating * 20 : 0;
            const score = Math.round(leadCount * 10 + ratingPoints + reviewCount * 5);

            let subjects: string[] = [];
            try { subjects = JSON.parse(t.subjects); } catch {}

            return {
                id: t.id,
                name: t.user.name,
                profilePhoto: t.user.profilePhoto,
                subjects,
                leadCount,
                avgRating,
                reviewCount,
                subscriptionStatus: t.subscriptionStatus,
                score,
            };
        }).sort((a, b) => b.score - a.score);

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}
