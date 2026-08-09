"use client";

import { useState, useEffect } from "react";
import { Award, Send, Users, Loader2, RefreshCw, Star } from "lucide-react";
import { toast } from "sonner";

interface StudentLookup {
    id: string;
    name: string;
}

interface ProgressReport {
    id: string;
    student: {
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

export default function TeacherProgressReportsPage() {
    const [reports, setReports] = useState<ProgressReport[]>([]);
    const [students, setStudents] = useState<StudentLookup[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAdd, setShowAdd] = useState(false);
    const [studentId, setStudentId] = useState("");
    const [subject, setSubject] = useState("");
    const [grade, setGrade] = useState("A");
    const [attendance, setAttendance] = useState("100");
    const [testScore, setTestScore] = useState("");
    const [behavior, setBehavior] = useState("EXCELLENT");
    const [comments, setComments] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchReports();
        fetchMatchedStudents();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/teacher/progress");
            if (res.ok) {
                const data = await res.json();
                setReports(data);
            }
        } catch {
            toast.error("Failed to load progress reports");
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

    const handleCreateReport = async () => {
        if (!studentId || !subject.trim() || !comments.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch("/api/teacher/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId,
                    subject,
                    grade,
                    attendance: parseFloat(attendance) || 100,
                    testScore,
                    behavior,
                    comments
                })
            });
            if (!res.ok) throw new Error();
            toast.success("Progress report submitted to student!");
            setShowAdd(false);
            setStudentId(""); setSubject(""); setComments(""); setTestScore("");
            fetchReports();
        } catch {
            toast.error("Failed to submit progress report");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 pb-12 font-sans">
            {/* Header */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                            <Award className="w-3.5 h-3.5" />
                            <span>Progress Card</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Student Progress Reports</h1>
                        <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                            Send academic performance cards, graded evaluations, and teacher remarks directly to parents and students.
                        </p>
                    </div>
                    <button onClick={() => setShowAdd(!showAdd)}
                        className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md shrink-0 flex items-center gap-2 self-start sm:self-auto">
                        <Users className="w-4 h-4" /> {showAdd ? "View Report Logs" : "Write New Report"}
                    </button>
                </div>
            </div>

            {showAdd ? (
                /* Write Report Form */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-2xl mx-auto space-y-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Draft Evaluation Card</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Student</label>
                            <select value={studentId} onChange={e => setStudentId(e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 appearance-none cursor-pointer">
                                <option value="">Select a student</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</label>
                            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Mathematics"
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</label>
                            <select value={grade} onChange={e => setGrade(e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 appearance-none cursor-pointer">
                                <option value="A+">A+</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance (%)</label>
                            <input type="number" min="0" max="100" value={attendance} onChange={e => setAttendance(e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Behavior</label>
                            <select value={behavior} onChange={e => setBehavior(e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 appearance-none cursor-pointer">
                                <option value="EXCELLENT">Excellent</option>
                                <option value="GOOD">Good</option>
                                <option value="AVERAGE">Average</option>
                                <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Test Score / Marks (Optional)</label>
                        <input type="text" value={testScore} onChange={e => setTestScore(e.target.value)} placeholder="e.g. 94/100"
                            className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teacher Remarks</label>
                        <textarea value={comments} onChange={e => setComments(e.target.value)} placeholder="Provide feedback on conceptual clarity, homework submissions, and areas to improve..." rows={4}
                            className="w-full px-4 py-3 text-xs font-medium border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 resize-none" />
                    </div>

                    <button onClick={handleCreateReport} disabled={saving || students.length === 0}
                        className="w-full py-3.5 bg-[#1f5961] hover:bg-[#163e44] disabled:opacity-50 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Submit Report Card
                    </button>
                </div>
            ) : (
                /* Report Logs */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Report History</h3>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 text-[#1f5961] animate-spin" />
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="text-center py-12 text-xs text-slate-400 font-bold uppercase tracking-wider">
                            No progress reports filed yet
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reports.map((r) => (
                                <div key={r.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 relative overflow-hidden">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <h4 className="text-xs font-black text-[#1f5961]">{r.student.user.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{r.subject}</p>
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
                                    <div className="border-t border-slate-200/60 pt-3">
                                        <p className="text-xs text-slate-650 font-medium italic">"{r.comments}"</p>
                                    </div>
                                    <div className="text-[9px] text-slate-400 font-bold text-right">
                                        {new Date(r.reportDate).toLocaleDateString()}
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
