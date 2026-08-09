"use client";

import { useState, useEffect } from "react";
import {
    Calendar, Clock, Video, User, CheckCircle2,
    Plus, Loader2, BookOpen, Send, ShieldCheck, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface StudentLookup {
    id: string;
    name: string;
}

interface ClassSession {
    id: string;
    studentId: string;
    student: {
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

export default function TeacherSchedulePage() {
    const [sessions, setSessions] = useState<ClassSession[]>([]);
    const [students, setStudents] = useState<StudentLookup[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAdd, setShowAdd] = useState(false);
    const [studentId, setStudentId] = useState("");
    const [subject, setSubject] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [time, setTime] = useState("04:00 PM");
    const [duration, setDuration] = useState("1 hour");
    const [meetLink, setMeetLink] = useState("");
    const [classRate, setClassRate] = useState("500");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSchedule();
        fetchMatchedStudents();
    }, []);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/teacher/classes");
            if (!res.ok) throw new Error();
            const data = await res.json();
            setSessions(data);
        } catch {
            toast.error("Failed to load class sessions");
        } finally {
            setLoading(false);
        }
    };

    const fetchMatchedStudents = async () => {
        try {
            const res = await fetch("/api/teacher/classes?mode=students");
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
            }
        } catch {}
    };

    const handleCreateSession = async () => {
        if (!studentId || !subject.trim()) {
            toast.error("Please select a student and fill in the subject.");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch("/api/teacher/classes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId,
                    subject,
                    date,
                    time,
                    duration,
                    meetLink,
                    classRate: parseFloat(classRate) || 0
                })
            });
            if (!res.ok) throw new Error();
            toast.success("Class session scheduled!");
            setShowAdd(false);
            setStudentId(""); setSubject(""); setMeetLink(""); setClassRate("500");
            fetchSchedule();
        } catch {
            toast.error("Failed to schedule class session");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateStatus = async (classId: string, status: string) => {
        try {
            const res = await fetch("/api/teacher/classes", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classId, status })
            });
            if (res.ok) {
                toast.success(`Class marked as ${status.toLowerCase()}`);
                fetchSchedule();
            } else {
                throw new Error();
            }
        } catch {
            toast.error("Failed to update class status");
        }
    };

    const handleLaunch = (link?: string | null) => {
        if (!link) {
            toast.error("Google Meet link is not set for this session.");
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
                            <span>Academic Calendar</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Class Schedule Manager</h1>
                        <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                            Plan live tutoring classes, set time slots, and invite students to virtual classroom environments.
                        </p>
                    </div>
                    <div className="flex gap-2.5 self-start sm:self-auto">
                        <button onClick={fetchSchedule} disabled={loading}
                            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/15 transition-all disabled:opacity-50">
                            <RefreshCw className={`w-4.5 h-4.5 ${loading ? "animate-spin" : ""}`} />
                        </button>
                        <button onClick={() => setShowAdd(!showAdd)}
                            className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md shrink-0 flex items-center gap-2">
                            <Plus className="w-4 h-4" /> {showAdd ? "View Timetable" : "Add Session Slot"}
                        </button>
                    </div>
                </div>
            </div>

            {showAdd ? (
                /* Form Block */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-2xl mx-auto space-y-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Schedule Class Session</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Matched Student</label>
                            <select value={studentId} onChange={e => setStudentId(e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 appearance-none cursor-pointer">
                                <option value="">Select a student</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {students.length === 0 && (
                                <p className="text-[10px] text-amber-600 font-bold">You need matched students (converted leads) to schedule classes.</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</label>
                            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Physics"
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Slot</label>
                            <input type="text" value={time} onChange={e => setTime(e.target.value)} placeholder="e.g. 05:00 PM"
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</label>
                            <input type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 1.5 hours"
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Google Meet Link (Optional)</label>
                            <input type="text" value={meetLink} onChange={e => setMeetLink(e.target.value)} placeholder="https://meet.google.com/..."
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout Amount / Class Rate (₹)</label>
                            <input type="number" value={classRate} onChange={e => setClassRate(e.target.value)} placeholder="500"
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                        </div>
                    </div>

                    <button onClick={handleCreateSession} disabled={saving || students.length === 0}
                        className="w-full py-3.5 bg-[#1f5961] hover:bg-[#163e44] disabled:opacity-50 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Save Session Slot
                    </button>
                </div>
            ) : (
                /* List Block */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Scheduled Sessions</h3>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 text-[#1f5961] animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sessions.length === 0 ? (
                                <div className="text-center py-12 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                    No classes scheduled yet
                                </div>
                            ) : sessions.map(s => (
                                <div key={s.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#1f5961] flex items-center justify-center shrink-0">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="text-xs font-black text-slate-900">{s.subject}</h4>
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black border ${
                                                    s.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-250" :
                                                    s.status === "CANCELLED" ? "bg-rose-50 text-rose-700 border-rose-250" :
                                                    "bg-blue-50 text-blue-700 border-blue-200"
                                                }`}>
                                                    {s.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-3 text-[10px] text-slate-400 font-medium pt-1">
                                                <span>Student: {s.student.user.name}</span>
                                                <span>·</span>
                                                <span>Date: {s.date}</span>
                                                <span>·</span>
                                                <span>Time: {s.time} ({s.duration})</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex items-center gap-2.5 flex-wrap">
                                        {s.status === "CONFIRMED" && (
                                            <>
                                                <button onClick={() => handleUpdateStatus(s.id, "COMPLETED")}
                                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-750 text-white text-[10px] font-black rounded-lg transition-all shadow-sm">
                                                    Mark Completed
                                                </button>
                                                <button onClick={() => handleUpdateStatus(s.id, "CANCELLED")}
                                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-black rounded-lg transition-all shadow-sm">
                                                    Cancel Class
                                                </button>
                                            </>
                                        )}
                                        {s.meetLink && s.status === "CONFIRMED" && (
                                            <button onClick={() => handleLaunch(s.meetLink)}
                                                className="px-3 py-1.5 bg-[#1f5961] hover:bg-[#163e44] text-white text-[10px] font-black rounded-lg flex items-center gap-1 transition-all shadow-sm">
                                                <Video className="w-3.5 h-3.5 text-amber-300" /> Start Meet
                                            </button>
                                        )}
                                        {!s.meetLink && s.status === "CONFIRMED" && (
                                            <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> In-person
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

