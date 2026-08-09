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

        // Fetch teachers with their reviews and user profiles
        const teachers = await prisma.teacher.findMany({
            include: {
                user: {
                    select: { name: true, email: true, createdAt: true }
                },
                leads: true
            }
        });

        // Fetch all reviews to calculate aggregates
        const allReviews = await prisma.review.findMany();

        // 1. Calculate engagement metrics per teacher — real data only
        const engagementData = teachers.map((t) => {
            const tutorReviews = allReviews.filter(r => r.pageKey === t.id);
            const totalRating = tutorReviews.reduce((sum, r) => sum + r.rating, 0);
            const avgRating = tutorReviews.length
                ? parseFloat((totalRating / tutorReviews.length).toFixed(1))
                : null; // null = no reviews yet

            const contactsCount = t.leads?.length || 0;

            return {
                name: t.user.name,
                contacts: contactsCount,
                reviewCount: tutorReviews.length,
                rating: avgRating
            };
        }).sort((a, b) => b.contacts - a.contacts);

        // 2. Signup trends — real cumulative count, no artificial floor
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const signupsByMonth: { [key: string]: number } = {};
        months.forEach(m => { signupsByMonth[m] = 0; });

        teachers.forEach(t => {
            if (t.user?.createdAt) {
                const m = months[new Date(t.user.createdAt).getMonth()];
                signupsByMonth[m] += 1;
            }
        });

        let cumulative = 0;
        const currentMonth = new Date().getMonth(); // 0-indexed
        const signupsTrend = months.slice(0, currentMonth + 1).map(m => {
            cumulative += signupsByMonth[m];
            return { month: m, tutors: cumulative };
        });

        // 3. Rating distribution — real counts, no fallback numbers
        const ratingCounts = { "5 Stars": 0, "4 Stars": 0, "3 Stars": 0, "2 Stars": 0, "1 Star": 0 };
        allReviews.forEach(r => {
            const rate = Math.round(r.rating);
            if (rate >= 5) ratingCounts["5 Stars"]++;
            else if (rate === 4) ratingCounts["4 Stars"]++;
            else if (rate === 3) ratingCounts["3 Stars"]++;
            else if (rate === 2) ratingCounts["2 Stars"]++;
            else ratingCounts["1 Star"]++;
        });

        const ratingDistribution = [
            { stars: "5 Stars", count: ratingCounts["5 Stars"], color: "#10b981" },
            { stars: "4 Stars", count: ratingCounts["4 Stars"], color: "#3b82f6" },
            { stars: "3 Stars", count: ratingCounts["3 Stars"], color: "#f59e0b" },
            { stars: "2 Stars", count: ratingCounts["2 Stars"], color: "#ef4444" },
            { stars: "1 Star",  count: ratingCounts["1 Star"],  color: "#6b7280" }
        ];

        return NextResponse.json({
            engagementData,
            signupsTrend,
            ratingDistribution,
            totalTutors: teachers.length,
            totalReviews: allReviews.length
        });
    } catch (error) {
        console.error("Error fetching tutor analytics:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}
