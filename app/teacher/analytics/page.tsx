"use client";

import { useState, useEffect } from "react";
import { BarChart3, Users, Clock, Award, Star, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function TeacherAnalyticsPage() {
    const [stats, setStats] = useState({
        hoursTaught: 0,
        activeStudents: 0,
        averageRating: 0.0,
        completedClasses: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            // Fetch classes, students, and reviews to calculate real analytics
            const [classesRes, studentsRes, reviewsRes] = await Promise.all([
                fetch("/api/teacher/classes"),
                fetch("/api/teacher/classes?mode=students"),
                fetch("/api/reviews") // assuming reviews endpoint
            ]);

            let classesCount = 0;
            let totalHours = 0;
            let activeStus = 0;
            let avgRating = 5.0; // default to 5.0 if no reviews

            if (classesRes.ok) {
                const classesData = await classesRes.json();
                if (Array.isArray(classesData)) {
                    classesCount = classesData.length;
                    totalHours = classesData.reduce((acc, c) => {
                        const numeric = parseFloat(c.duration) || 1;
                        return acc + numeric;
                    }, 0);
                }
            }

            if (studentsRes.ok) {
                const studentsData = await studentsRes.json();
                if (Array.isArray(studentsData)) {
                    activeStus = studentsData.length;
                }
            }

            if (reviewsRes.ok) {
                const reviewsData = await reviewsRes.json();
                if (Array.isArray(reviewsData) && reviewsData.length > 0) {
                    const sum = reviewsData.reduce((acc, r) => acc + (r.rating || 0), 0);
                    avgRating = Number((sum / reviewsData.length).toFixed(1));
                }
            }

            setStats({
                hoursTaught: totalHours,
                activeStudents: activeStus,
                averageRating: avgRating,
                completedClasses: classesCount
            });

        } catch {
            toast.error("Failed to load performance metrics");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-12 font-sans">
            {/* Header */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>KPI Metrics</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Performance Analytics</h1>
                    <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                        Monitor your educational throughput, student retention, hours logged, and rating insights.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#1f5961] animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hours Logged</span>
                            <div className="p-2 bg-teal-50 text-[#1f5961] rounded-xl"><Clock className="w-4 h-4" /></div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800">{stats.hoursTaught} hrs</h2>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">Total teaching duration</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Students</span>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Users className="w-4 h-4" /></div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800">{stats.activeStudents}</h2>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">Enrolled & contacted leads</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Rating</span>
                            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl"><Star className="w-4 h-4 fill-amber-500" /></div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800">{stats.averageRating} / 5.0</h2>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">From student reviews</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Classes</span>
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><BookOpen className="w-4 h-4" /></div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800">{stats.completedClasses}</h2>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">Classes scheduled in system</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
