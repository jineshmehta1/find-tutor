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

        /* ─── 1. Summary counts ─── */
        const [
            totalTutors,
            approvedTutors,
            pendingTutors,
            totalStudents,
            totalLeads,
            pendingLeads,
            contactedLeads,
            convertedLeads,
            rejectedLeads,
            activeSubscriptions,
        ] = await Promise.all([
            prisma.teacher.count(),
            prisma.teacher.count({ where: { isApproved: true } }),
            prisma.teacher.count({ where: { isApproved: false } }),
            prisma.student.count(),
            prisma.lead.count(),
            prisma.lead.count({ where: { status: "PENDING" } }),
            prisma.lead.count({ where: { status: "CONTACTED" } }),
            prisma.lead.count({ where: { status: "CONVERTED" } }),
            prisma.lead.count({ where: { status: "REJECTED" } }),
            prisma.teacher.count({
                where: { subscriptionStatus: { in: ["active", "trial"] } }
            }),
        ]);

        /* ─── 2. Recent leads (activity feed) ─── */
        const recentLeads = await prisma.lead.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                student: {
                    include: { user: { select: { name: true, email: true } } }
                },
                teacher: {
                    include: { user: { select: { name: true } } }
                }
            }
        });

        /* ─── 3. Recent registered users ─── */
        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        });

        /* ─── 4. Monthly user signups (line chart) — current year ─── */
        const now = new Date();
        const yearStart = new Date(now.getFullYear(), 0, 1);
        const allUsers = await prisma.user.findMany({
            where: { createdAt: { gte: yearStart } },
            select: { createdAt: true, role: true }
        });

        const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const monthlySignups: Record<string, { tutors: number; students: number }> = {};
        MONTHS.forEach(m => { monthlySignups[m] = { tutors: 0, students: 0 }; });

        allUsers.forEach(u => {
            const m = MONTHS[new Date(u.createdAt).getMonth()];
            if (u.role === "TEACHER") monthlySignups[m].tutors++;
            else if (u.role === "STUDENT") monthlySignups[m].students++;
        });

        const currentMonthIdx = now.getMonth();
        const monthlyChart = MONTHS.slice(0, currentMonthIdx + 1).map(m => ({
            month: m,
            tutors: monthlySignups[m].tutors,
            students: monthlySignups[m].students,
        }));

        /* ─── 5. Lead status distribution (donut chart) ─── */
        const leadsDonut = [
            { name: "Pending",   value: pendingLeads,   color: "#f59e0b" },
            { name: "Contacted", value: contactedLeads, color: "#3b82f6" },
            { name: "Converted", value: convertedLeads, color: "#10b981" },
            { name: "Rejected",  value: rejectedLeads,  color: "#6b7280" },
        ].filter(d => d.value > 0); // only show slices with real data

        /* ─── 6. Locality breakdown (bar chart) — group leads by location ─── */
        const leads = await prisma.lead.findMany({
            select: { location: true },
            where: { location: { not: null } }
        });

        const teachersByLocation = await prisma.teacher.findMany({
            where: { isApproved: true },
            include: { user: { select: { address: true } } }
        });

        const locationGroups: Record<string, { students: number; tutors: number }> = {};
        leads.forEach(l => {
            const loc = (l.location || "").trim();
            if (!loc) return;
            if (!locationGroups[loc]) locationGroups[loc] = { students: 0, tutors: 0 };
            locationGroups[loc].students++;
        });

        // Count tutors per locality
        Object.keys(locationGroups).forEach(loc => {
            locationGroups[loc].tutors = teachersByLocation.filter(t =>
                t.user?.address?.toLowerCase().includes(loc.toLowerCase())
            ).length;
        });

        const localityChart = Object.entries(locationGroups)
            .sort((a, b) => b[1].students - a[1].students)
            .slice(0, 8) // top 8 localities
            .map(([name, data]) => ({ name, students: data.students, tutors: data.tutors }));

        return NextResponse.json({
            stats: {
                totalTutors,
                approvedTutors,
                pendingTutors,
                totalStudents,
                totalLeads,
                pendingLeads,
                convertedLeads,
                activeSubscriptions,
            },
            recentLeads,
            recentUsers,
            charts: {
                monthly: monthlyChart,
                leadsDonut,
                locality: localityChart,
            }
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard stats" },
            { status: 500 }
        );
    }
}
