"use client";

import { useState, useEffect } from "react";
import {
    Calendar, Clock, Video, User, CheckCircle2,
    BookOpen, RefreshCw, Loader2
} from "lucide-react";
import { toast } from "sonner";

interface ClassSession {
    id: string;
    teacher: {
        user: {
            name: string;
        }
    };
    subject: string;
    date: string;
    time: string;
    duration: string;
    status: string;
    meetLink?: string | null;
}

export default function StudentSchedulePage() {
    const [sessions, setSessions] = useState<ClassSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/teacher/classes");
            if (!res.ok) throw new Error();
            const data = await res.json();
            setSessions(data);
        } catch {
            toast.error("Failed to load class timetable");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinClass = (link?: string | null) => {
        if (!link) {
            toast.error("Class link is not available yet.");
            return;
        }
        window.open(link, "_blank");
    };

    return (
        <div className="space-y-8 pb-12 font-sans">
            {/* Header */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Schedule</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Class Timetable</h1>
                        <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                            View upcoming live tutoring sessions, class links, and logs of completed courses.
                        </p>
                    </div>
                    <button onClick={fetchSchedule} disabled={loading}
                        className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all disabled:opacity-50">
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Sessions Schedule</h3>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 text-[#1f5961] animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sessions.length === 0 ? (
                            <div className="text-center py-12 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                No classes scheduled at this time
                            </div>
                        ) : sessions.map(s => (
                            <div key={s.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#1f5961] flex items-center justify-center font-bold text-xs shrink-0 self-start">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-xs font-black text-slate-900">{s.subject}</h4>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black border ${
                                                s.status === "CONFIRMED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                s.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                "bg-slate-50 text-slate-500 border-slate-200"
                                            }`}>{s.status}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                                            <User className="w-3 h-3 text-slate-400" /> Tutor: {s.teacher.user.name}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-x-3 text-[10px] text-slate-400 font-medium pt-1">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {s.date}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.time} ({s.duration})</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="shrink-0 flex items-center">
                                    {s.status === "CONFIRMED" && s.meetLink ? (
                                        <button onClick={() => handleJoinClass(s.meetLink)}
                                            className="w-full md:w-auto px-4 py-2 bg-[#1f5961] hover:bg-[#163e44] text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm">
                                            <Video className="w-4 h-4 text-amber-300" /> Join Live Room
                                        </button>
                                    ) : (
                                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> In-person / Completed
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
