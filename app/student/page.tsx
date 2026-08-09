"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    BookOpen, Users, Send, Calendar, Star,
    ArrowRight, Sparkles, GraduationCap, MapPin,
    Award, Phone, ChevronRight, Clock, TrendingUp,
    Bell, Loader2, ShieldCheck, RefreshCw, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { QuickDemoModal } from "@/components/QuickDemoModal";

interface Teacher {
    id: string; name: string; email: string; phone: string;
    profilePhoto?: string; address: string; education: string;
    experience: string; subjects: string[]; teachingMode?: string;
}

interface Lead {
    id: string; subject: string | null; status: string; createdAt: string;
    teacher?: { user: { name: string } } | null;
}

interface EventRegistration {
    id: number; status: string;
    event: { title: string; date: string; category: string; image: string; };
}

interface ScheduledClass {
    id: string;
    subject: string;
    date: string;
    time: string;
    duration: string;
    meetLink?: string | null;
    teacher: {
        user: { name: string }
    }
}

export default function StudentDashboard() {
    const { data: session } = useSession();
    const [studentSubjects, setStudentSubjects] = useState<string[]>([]);
    const [teachers, setTeachers]               = useState<Teacher[]>([]);
    const [leads, setLeads]                     = useState<Lead[]>([]);
    const [events, setEvents]                   = useState<EventRegistration[]>([]);
    const [classes, setClasses]                 = useState<ScheduledClass[]>([]);
    const [reports, setReports]                 = useState<any[]>([]);
    const [loading, setLoading]                 = useState(true);
    const [selectedSubject, setSelectedSubject] = useState("ALL");

    const [isDemoOpen, setIsDemoOpen]     = useState(false);
    const [demoTutor, setDemoTutor]       = useState("");
    const [demoSubject, setDemoSubject]   = useState("");

    const openDemo = (tutor = "", subject = "") => {
        setDemoTutor(tutor);
        setDemoSubject(subject || studentSubjects[0] || "");
        setIsDemoOpen(true);
    };

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [profileRes, teachersRes, leadsRes, eventsRes, classesRes, reportsRes] = await Promise.all([
                fetch("/api/students"),
                fetch("/api/teachers"),
                fetch("/api/leads"),
                fetch("/api/events/register"),
                fetch("/api/teacher/classes"),
                fetch("/api/teacher/progress"),
            ]);

            if (profileRes.ok) {
                const p = await profileRes.json();
                const raw = p?.student?.subjects;
                if (raw) {
                    try {
                        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
                        if (Array.isArray(parsed) && parsed.length > 0) setStudentSubjects(parsed);
                    } catch {}
                }
            }

            if (teachersRes.ok) {
                const d = await teachersRes.json();
                if (Array.isArray(d)) setTeachers(d);
            }

            if (leadsRes.ok) {
                const d = await leadsRes.json();
                if (Array.isArray(d)) setLeads(d);
            }

            if (eventsRes.ok) {
                const d = await eventsRes.json();
                if (Array.isArray(d)) setEvents(d.slice(0, 3));
            }

            if (classesRes.ok) {
                const d = await classesRes.json();
                if (Array.isArray(d)) setClasses(d.slice(0, 4));
            }

            if (reportsRes.ok) {
                const d = await reportsRes.json();
                if (Array.isArray(d)) setReports(d.slice(0, 3));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const matchedTutors = teachers.filter(t => {
        if (selectedSubject === "ALL") {
            return studentSubjects.length === 0 || t.subjects.some(s =>
                studentSubjects.some(ss => s.toLowerCase().includes(ss.toLowerCase()) || ss.toLowerCase().includes(s.toLowerCase()))
            );
        }
        return t.subjects.some(s => s.toLowerCase().includes(selectedSubject.toLowerCase()));
    });

    const displayTutors = (matchedTutors.length > 0 ? matchedTutors : teachers).slice(0, 6);

    const pendingLeads   = leads.filter(l => l.status === "PENDING").length;
    const convertedLeads = leads.filter(l => l.status === "CONVERTED").length;

    const STATUS_COLOR: Record<string, string> = {
        PENDING:   "bg-amber-50 text-amber-700 border-amber-200",
        CONTACTED: "bg-blue-50 text-blue-700 border-blue-200",
        CONVERTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        REJECTED:  "bg-rose-50 text-rose-700 border-rose-200",
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-3">
                <Loader2 className="w-8 h-8 text-[#1f5961] animate-spin" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 font-sans">

            {/* ── HERO HEADER ── */}
            <div className="relative bg-gradient-to-br from-[#1f5961] to-[#0f3237] rounded-3xl p-6 sm:p-10 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold tracking-wider uppercase border border-white/15">
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            <span>Welcome Back</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                            Hey, {session?.user?.name?.split(" ")[0] || "Student"}! 👋
                        </h1>
                        <p className="text-sm text-teal-100/90 font-medium max-w-lg leading-relaxed">
                            Your personalized learning hub — browse matched tutors, track your requests, and register for events.
                        </p>

                        {/* Subject badges */}
                        {studentSubjects.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="text-[10px] font-bold text-teal-300 uppercase tracking-widest">Your Subjects:</span>
                                {studentSubjects.slice(0, 5).map(sub => (
                                    <span key={sub} className="px-3 py-1 bg-white/10 text-white text-[11px] font-bold rounded-lg border border-white/15 flex items-center gap-1.5">
                                        <BookOpen className="w-3 h-3 text-amber-300" />{sub}
                                    </span>
                                ))}
                                {studentSubjects.length > 5 && (
                                    <span className="text-[10px] text-teal-300 font-bold">+{studentSubjects.length - 5} more</span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 shrink-0">
                        <button onClick={() => openDemo()}
                            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl shadow-lg transition-all text-xs uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Book Free Demo
                        </button>
                        <Link href="/student/leads"
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                            Post a Request <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── KPI CARDS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { value: teachers.length,      label: "Verified Tutors",  sub: "on platform", icon: Users,       iconBg: "bg-teal-50 text-[#1f5961]" },
                    { value: studentSubjects.length,label: "My Subjects",     sub: "enrolled",    icon: BookOpen,    iconBg: "bg-amber-50 text-amber-600" },
                    { value: leads.length,          label: "My Requests",     sub: `${pendingLeads} pending`, icon: Send, iconBg: "bg-blue-50 text-blue-600" },
                    { value: convertedLeads,        label: "Matched",         sub: "with a tutor", icon: CheckCircle2, iconBg: "bg-emerald-50 text-emerald-600" },
                ].map(({ value, label, sub, icon: Icon, iconBg }) => (
                    <div key={label} className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900">{value}</div>
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-tight">{label}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── MATCHED TUTORS ── */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-[#1f5961]" />
                            Recommended Tutors
                        </h2>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Matched to your enrolled subjects</p>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                        {["ALL", ...studentSubjects.slice(0, 4)].map(sub => (
                            <button key={sub} onClick={() => setSelectedSubject(sub)}
                                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    selectedSubject === sub
                                        ? "bg-[#1f5961] text-white shadow-sm"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}>
                                {sub === "ALL" ? `All (${teachers.length})` : sub}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {displayTutors.length === 0 ? (
                        <div className="text-center py-16 space-y-3">
                            <div className="text-5xl">🎓</div>
                            <p className="font-black text-slate-700">No tutors found for this subject</p>
                            <p className="text-xs text-slate-400 font-medium">Post a custom request and we'll match you.</p>
                            <Link href="/student/leads" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1f5961] text-white text-xs font-bold rounded-2xl mt-2">
                                Post Request <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {displayTutors.map(tutor => (
                                <div key={tutor.id} className="group relative bg-slate-50 rounded-2xl border border-slate-200/80 p-5 hover:border-[#1f5961]/30 hover:shadow-lg transition-all duration-300">
                                    {/* Top accent */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1f5961] to-teal-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 shrink-0">
                                            {tutor.profilePhoto ? (
                                                <img src={tutor.profilePhoto} alt={tutor.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-[#1f5961]/10 flex items-center justify-center text-[#1f5961] font-black text-xl">
                                                    {tutor.name[0]}
                                                </div>
                                            )}
                                            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-slate-900 text-sm truncate group-hover:text-[#1f5961] transition-colors">{tutor.name}</h3>
                                            <p className="text-[11px] text-slate-500 font-medium truncate">{tutor.education}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                <span className="text-[11px] font-bold text-slate-700">Verified Expert</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 mb-4 text-[11px] font-medium text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                            <span className="truncate">{tutor.experience || "Verified Educator"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-[#1f5961] shrink-0" />
                                            <span className="truncate">{tutor.address?.split(",")[0] || "Vijayawada"}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {tutor.subjects.slice(0, 3).map(s => {
                                            const isMatch = studentSubjects.some(ss =>
                                                s.toLowerCase().includes(ss.toLowerCase()) || ss.toLowerCase().includes(s.toLowerCase())
                                            );
                                            return (
                                                <span key={s} className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                                                    isMatch ? "bg-teal-50 text-[#1f5961] border border-teal-200" : "bg-slate-100 text-slate-500"
                                                }`}>{s}</span>
                                            );
                                        })}
                                        {tutor.subjects.length > 3 && <span className="text-[10px] text-slate-400 font-bold self-center">+{tutor.subjects.length - 3}</span>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => openDemo(tutor.name, tutor.subjects[0])}
                                            className="py-2 bg-[#1f5961] hover:bg-[#163e44] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors">
                                            <Sparkles className="w-3 h-3 text-amber-300" /> Free Demo
                                        </button>
                                        <a href={`tel:${tutor.phone}`}
                                            className="py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors">
                                            <Phone className="w-3 h-3 text-[#1f5961]" /> Call
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {teachers.length > 6 && (
                        <div className="text-center mt-6">
                            <Link href="/student/teachers"
                                className="inline-flex items-center gap-2 px-6 py-2.5 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                                View All {teachers.length} Tutors <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* ── BOTTOM GRID: My Requests + Events + Quick Links ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* My Requests */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                            <Send className="w-4 h-4 text-[#1f5961]" /> My Requests
                        </h3>
                        <Link href="/student/leads" className="text-[10px] font-black text-[#1f5961] hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {leads.length === 0 ? (
                        <div className="text-center py-8 space-y-2">
                            <div className="text-4xl">📋</div>
                            <p className="text-xs font-bold text-slate-500">No requests posted yet</p>
                            <Link href="/student/leads" className="text-[10px] text-[#1f5961] font-black hover:underline">Post your first request →</Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {leads.slice(0, 4).map(lead => (
                                <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">{lead.subject || "General Tuition"}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                        </p>
                                    </div>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase border ${STATUS_COLOR[lead.status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
                                        {lead.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upcoming Classes */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#1f5961]" /> Upcoming Classes
                        </h3>
                        <Link href="/student/schedule" className="text-[10px] font-black text-[#1f5961] hover:underline flex items-center gap-1">
                            Full Calendar <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {classes.length === 0 ? (
                        <div className="text-center py-8 space-y-2">
                            <div className="text-4xl">📅</div>
                            <p className="text-xs font-bold text-slate-500">No classes scheduled yet</p>
                            <p className="text-[10px] text-slate-400">Coaches will schedule classes for you</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {classes.map(cls => (
                                <div key={cls.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">{cls.subject}</p>
                                        <p className="text-[9px] text-slate-400 font-bold">Tutor: {cls.teacher.user.name}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">
                                            {cls.date} at {cls.time}
                                        </p>
                                    </div>
                                    {cls.meetLink && (
                                        <button onClick={() => window.open(cls.meetLink!, "_blank")}
                                            className="text-[9px] px-2.5 py-1 bg-teal-50 text-[#1f5961] border border-teal-150 rounded-lg font-black transition-all">
                                            Join Meeting
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#1f5961]" /> My Events
                        </h3>
                        <Link href="/student/events" className="text-[10px] font-black text-[#1f5961] hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {events.length === 0 ? (
                        <div className="text-center py-8 space-y-2">
                            <div className="text-4xl">🎪</div>
                            <p className="text-xs font-bold text-slate-500">No events registered yet</p>
                            <Link href="/events" className="text-[10px] text-[#1f5961] font-black hover:underline">Browse events →</Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {events.map(reg => (
                                <div key={reg.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                                        {reg.event.image ? <img src={reg.event.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg">🎪</div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-900 truncate">{reg.event.title}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            {new Date(reg.event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                        </p>
                                    </div>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black border ${
                                        reg.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}>{reg.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Latest Progress Report */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                            <Award className="w-4 h-4 text-[#1f5961]" /> Latest Progress
                        </h3>
                        <Link href="/student/progress" className="text-[10px] font-black text-[#1f5961] hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {reports.length === 0 ? (
                        <div className="text-center py-8 space-y-2">
                            <div className="text-4xl">🏆</div>
                            <p className="text-xs font-bold text-slate-500">No report cards yet</p>
                            <p className="text-[10px] text-slate-400">Your tutor will post updates here</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {reports.slice(0, 1).map(r => (
                                <div key={r.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-black text-slate-900">{r.subject}</p>
                                            <p className="text-[9px] text-slate-400 font-bold">Tutor: {r.teacher.user.name}</p>
                                        </div>
                                        <span className="text-base font-black text-amber-500 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/50">
                                            {r.grade}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-650 italic font-medium line-clamp-2">"{r.comments}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-[#1f5961] to-[#0f3237] rounded-3xl p-6 text-white shadow-xl space-y-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-white/15 mb-3">
                            <ShieldCheck className="w-3 h-3" /> Quick Actions
                        </div>
                        <h3 className="font-black text-white text-base">What do you need?</h3>
                        <p className="text-xs text-teal-200 font-medium mt-1">Get started with any of these</p>
                    </div>
                    <div className="space-y-2">
                        {[
                            { label: "Book a Free Demo",      href: null,               action: () => openDemo(), icon: Sparkles },
                            { label: "Find Tutors Near Me",   href: "/student/teachers",                          icon: Users },
                            { label: "Post Custom Request",   href: "/student/leads",                             icon: Send },
                            { label: "View My Progress",      href: "/student/progress",                          icon: TrendingUp },
                            { label: "Browse Events",         href: "/events",                                    icon: Calendar },
                        ].map(({ label, href, action, icon: Icon }) =>
                            href ? (
                                <Link key={label} href={href}
                                    className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 text-xs font-bold text-white transition-all">
                                    <div className="flex items-center gap-2.5">
                                        <Icon className="w-3.5 h-3.5 text-amber-300 shrink-0" />{label}
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                                </Link>
                            ) : (
                                <button key={label} onClick={action}
                                    className="w-full flex items-center justify-between p-3 bg-amber-400/20 hover:bg-amber-400/30 rounded-2xl border border-amber-400/30 text-xs font-bold text-amber-300 transition-all">
                                    <div className="flex items-center gap-2.5">
                                        <Icon className="w-3.5 h-3.5 shrink-0" />{label}
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>

            <QuickDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} defaultSubject={demoSubject} defaultTutor={demoTutor} />
        </div>
    );
}
