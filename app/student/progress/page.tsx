"use client";

import { useState, useEffect } from "react";
import {
    TrendingUp, Calendar, BookOpen, Clock, Plus, Loader2,
    CheckCircle2, Award, Sparkles, Send, Eye, UserCheck
} from "lucide-react";
import { toast } from "sonner";

interface JournalEntry {
    id: string;
    subject: string;
    date: string;
    hours: number;
    notes: string;
    rating: number;
}

interface ProgressReport {
    id: string;
    teacher: {
        user: { name: string }
    };
    subject: string;
    grade: string;
    attendance: number;
    testScore: string | null;
    behavior: string;
    comments: string;
    reportDate: string;
}

export default function StudentProgressPage() {
    const [reports, setReports] = useState<ProgressReport[]>([]);
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loadingReports, setLoadingReports] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [subject, setSubject] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [hours, setHours] = useState("1");
    const [notes, setNotes] = useState("");
    const [rating, setRating] = useState(4);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoadingReports(true);
        try {
            const res = await fetch("/api/teacher/progress");
            if (res.ok) {
                const data = await res.json();
                setReports(data);
            }
        } catch {
            toast.error("Failed to load progress reports");
        } finally {
            setLoadingReports(false);
        }
    };

    const handleAddEntry = async () => {
        if (!subject || !notes.trim()) {
            toast.error("Please fill in the subject and notes.");
            return;
        }
        setSaving(true);
        await new Promise(r => setTimeout(r, 600));

        const newEntry: JournalEntry = {
            id: Date.now().toString(),
            subject,
            date,
            hours: parseFloat(hours) || 1,
            notes,
            rating,
        };

        setEntries(prev => [newEntry, ...prev]);
        toast.success("Progress entry logged successfully!");
        setShowAdd(false);
        setSubject(""); setNotes(""); setHours("1"); setRating(4);
        setSaving(false);
    };

    const totalHours = entries.reduce((acc, curr) => acc + curr.hours, 0);

    return (
        <div className="space-y-8 pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)] font-sans">
            {/* Header banner */}
            <div className="bg-[#ffb800] p-6 sm:p-10 rounded-3xl text-slate-950 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-bold rounded-full border border-slate-950/10">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Academic Tracker</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Progress & Report Cards</h1>
                        <p className="text-xs sm:text-sm text-slate-900/85 font-medium max-w-xl">
                            View official tutor evaluations, grades, and record your private daily study hours.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Tabs/Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left: Tutor Report Cards */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Award className="w-5 h-5 text-[#ffb800]" />
                        Official Progress Reports
                    </h3>

                    {loadingReports ? (
                        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex justify-center py-12">
                            <Loader2 className="w-6 h-6 text-[#ffb800] animate-spin" />
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center py-12 text-xs text-slate-400 font-bold uppercase tracking-wider">
                            No report cards filed by your tutor yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reports.map((r) => (
                                <div key={r.id} className="bg-white rounded-3xl p-5 border border-slate-200/85 shadow-sm space-y-3 relative overflow-hidden">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                                                <UserCheck className="w-4 h-4 text-[#ffb800]" />
                                                Tutor: {r.teacher.user.name}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{r.subject}</p>
                                        </div>
                                        <span className="text-lg font-black text-amber-500 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200/60">
                                            {r.grade}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 pt-1">
                                        <div>Attendance: <span className="text-slate-800">{r.attendance}%</span></div>
                                        <div>Behavior: <span className="text-slate-800">{r.behavior}</span></div>
                                        {r.testScore && <div className="col-span-2">Test Score: <span className="text-slate-800">{r.testScore}</span></div>}
                                    </div>
                                    <div className="border-t border-slate-100 pt-3">
                                        <p className="text-xs text-slate-650 font-medium italic">"{r.comments}"</p>
                                    </div>
                                    <div className="text-[9px] text-slate-400 font-bold text-right pt-2 border-t border-slate-50">
                                        {new Date(r.reportDate).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Personal Study Journal */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#ffb800]" />
                            Study Journal
                        </h3>
                        <button onClick={() => setShowAdd(!showAdd)}
                            className="px-3 py-1.5 bg-[#ffb800] hover:bg-[#ffa000] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm">
                            {showAdd ? "Close" : "Add Entry"}
                        </button>
                    </div>

                    {showAdd ? (
                        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                            <h4 className="text-xs font-black text-slate-700 uppercase">Create Journal Entry</h4>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Subject</label>
                                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Science"
                                        className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl outline-none focus:border-[#ffb800] bg-slate-50/50" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Hours</label>
                                    <input type="number" step="0.5" value={hours} onChange={e => setHours(e.target.value)}
                                        className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl outline-none focus:border-[#ffb800] bg-slate-50/50" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Notes</label>
                                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="What did you study?" rows={3}
                                        className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-[#ffb800] bg-slate-50/50 resize-none" />
                                </div>
                                <button onClick={handleAddEntry} disabled={saving}
                                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Entry"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {entries.length === 0 ? (
                                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
                                    No self-logged study hours yet.
                                </div>
                            ) : (
                                entries.map(entry => (
                                    <div key={entry.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-xs font-black text-slate-900">{entry.subject}</h5>
                                            <span className="text-[10px] text-slate-400 font-bold">{entry.date}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{entry.notes}</p>
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                            <span className="text-[9px] font-black text-[#ffb800] bg-amber-50 px-2 py-0.5 rounded">{entry.hours} Hours</span>
                                            <span className="text-xs">{"⭐".repeat(entry.rating)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
