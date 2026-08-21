"use client";

import React, { useState, useEffect } from "react";
import { BookMarked, Settings, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function TeacherSubjectsPage() {
    const [subjects, setSubjects] = useState<string[]>([]);
    const [classes, setClasses] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const res = await fetch("/api/students");
                if (res.ok) {
                    const data = await res.json();
                    if (data.teacher) {
                        try { setSubjects(JSON.parse(data.teacher.subjects || "[]")); } catch {}
                        try { setClasses(JSON.parse(data.teacher.classesOrAgeGroup || "[]")); } catch {}
                    }
                }
            } catch {}
            setLoading(false);
        };
        fetchProfileData();
    }, []);

    return (
        <div className="pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)] font-sans">
            {/* Header Banner */}
            <div className="bg-[#ffb800] p-6 sm:p-8 rounded-3xl text-slate-950 shadow-md relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-black rounded-full border border-slate-950/10">
                        <BookMarked className="w-3.5 h-3.5 text-slate-950" />
                        <span>Curriculum Manager</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Subjects & Classes</h1>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium max-w-xl">
                        Manage the educational programs, class levels, and academic subjects you offer to students.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#ffb800] border-t-transparent" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    
                    {/* Left Card: Subjects */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Offered Subjects</h3>
                            <Link href="/teacher/settings" className="text-xs font-black text-blue-600 hover:underline flex items-center gap-0.5">
                                <Settings className="w-3.5 h-3.5" /> Edit
                            </Link>
                        </div>
                        {subjects.length === 0 ? (
                            <p className="text-xs text-slate-400 font-medium">No subjects added yet. Update settings to configure.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {subjects.map((sub, idx) => (
                                    <span key={idx} className="px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-extrabold border border-blue-100">
                                        {sub}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Card: Classes / Grade Levels */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Grade Levels</h3>
                            <Link href="/teacher/settings" className="text-xs font-black text-blue-600 hover:underline flex items-center gap-0.5">
                                <Settings className="w-3.5 h-3.5" /> Edit
                            </Link>
                        </div>
                        {classes.length === 0 ? (
                            <p className="text-xs text-slate-400 font-medium">No grade levels selected yet. Update settings to configure.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {classes.map((cls, idx) => (
                                    <span key={idx} className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-extrabold border border-emerald-100">
                                        {cls}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}
