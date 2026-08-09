"use client";

import { useState, useEffect } from "react";
import {
    Users, Clock, Loader2, Mail, Phone,
    CheckCircle, XCircle, MessageSquare, Send, Plus, X, MapPin, BookOpen, GraduationCap,
    Sparkles, ShieldCheck, CheckCircle2, ArrowRight
} from "lucide-react";
import { toast } from "sonner";

const SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi",
    "History", "Geography", "Computer Science", "Economics", "Abacus", "Chess", "Coding"
];
const CLASSES = [
    "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"
];
const MODES = ["Home Tutor", "Online Tutor", "At Centre"];

interface LeadData {
    id: string;
    message: string | null;
    location: string | null;
    subject: string | null;
    classLevel: string | null;
    mode: string | null;
    status: string;
    createdAt: string;
    teacher?: {
        user: {
            name: string;
            email: string;
            phone?: string;
        };
    } | null;
}

export default function StudentLeadsPage() {
    const [leads, setLeads] = useState<LeadData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [leadLocation, setLeadLocation] = useState("");
    const [leadSubject, setLeadSubject] = useState("");
    const [leadClass, setLeadClass] = useState("");
    const [leadMode, setLeadMode] = useState("");
    const [leadMessage, setLeadMessage] = useState("");
    const [submittingLead, setSubmittingLead] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/leads");
            if (!res.ok) throw new Error();
            const data = await res.json();
            if (Array.isArray(data)) {
                setLeads(data);
            }
        } catch {
            toast.error("Failed to load requests timeline");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLead = async () => {
        if (!leadSubject || !leadLocation || !leadClass || !leadMode) {
            toast.error("Please fill in all required fields.");
            return;
        }
        setSubmittingLead(true);
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location: leadLocation,
                    subject: leadSubject,
                    classLevel: leadClass,
                    mode: leadMode,
                    message: leadMessage
                }),
            });
            if (!res.ok) throw new Error();
            toast.success("Tutor request posted successfully! Tutors will be matched shortly.");
            setShowCreateModal(false);
            setLeadLocation(""); setLeadSubject(""); setLeadClass(""); setLeadMode(""); setLeadMessage("");
            fetchLeads();
        } catch {
            toast.error("Failed to post tutor request");
        } finally {
            setSubmittingLead(false);
        }
    };

    const STATUS_COLOR: Record<string, string> = {
        PENDING:   "bg-amber-50 text-amber-700 border-amber-200",
        CONTACTED: "bg-blue-50 text-blue-700 border-blue-200",
        CONVERTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        REJECTED:  "bg-rose-50 text-rose-700 border-rose-200",
    };

    return (
        <div className="space-y-8 pb-12 font-sans">
            {/* Header banner */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                            <Send className="w-3.5 h-3.5" />
                            <span>Requests Timeline</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Tutor Requests Board</h1>
                        <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                            Track the status of your teaching requirements. Receive matches and communicate with tutors directly.
                        </p>
                    </div>
                    <button onClick={() => setShowCreateModal(true)}
                        className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md shrink-0 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Request
                    </button>
                </div>
            </div>

            {/* Leads List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3">
                    <Loader2 className="w-8 h-8 text-[#1f5961] animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Loading timeline...</p>
                </div>
            ) : leads.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center space-y-4 shadow-sm">
                    <div className="text-5xl">📋</div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-800">No requests submitted yet</h3>
                        <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">Create a tutor request to get matched with verified teachers in Vijayawada.</p>
                    </div>
                    <button onClick={() => setShowCreateModal(true)}
                        className="px-5 py-2.5 bg-[#1f5961] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#163e44] transition-all">
                        Create Request
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {leads.map(lead => (
                        <div key={lead.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-black text-slate-900">{lead.subject}</h3>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase border ${STATUS_COLOR[lead.status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
                                        {lead.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-bold text-slate-400">
                                    <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-[#1f5961]" /> {lead.classLevel}</span>
                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-500" /> {lead.location}</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-500" /> {lead.mode}</span>
                                </div>
                                {lead.message && (
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50 rounded-2xl p-3 border border-slate-100/50">
                                        &quot;{lead.message}&quot;
                                    </p>
                                )}
                            </div>

                            <div className="shrink-0 flex flex-col items-start md:items-end gap-2 border-t md:border-t-0 border-slate-50 pt-4 md:pt-0">
                                {lead.teacher ? (
                                    <div className="space-y-1.5 text-left md:text-right">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matched Tutor</div>
                                        <div className="text-xs font-black text-slate-900">{lead.teacher.user.name}</div>
                                        <div className="text-[10px] font-medium text-slate-500">{lead.teacher.user.email}</div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                                        <span>Matching tutor...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Box */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
                        <button onClick={() => setShowCreateModal(false)} className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-900 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">Post Tuition Requirement</h2>
                            <p className="text-xs text-slate-400 font-medium">Verified tutors will contact you after review</p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</label>
                                    <select value={leadSubject} onChange={e => setLeadSubject(e.target.value)}
                                        className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 appearance-none cursor-pointer">
                                        <option value="">Select subject</option>
                                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Level</label>
                                    <select value={leadClass} onChange={e => setLeadClass(e.target.value)}
                                        className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 appearance-none cursor-pointer">
                                        <option value="">Select class</option>
                                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teaching Mode</label>
                                    <select value={leadMode} onChange={e => setLeadMode(e.target.value)}
                                        className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 appearance-none cursor-pointer">
                                        <option value="">Select mode</option>
                                        {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location / Area</label>
                                    <input type="text" value={leadLocation} onChange={e => setLeadLocation(e.target.value)} placeholder="e.g. Patamata, Vijayawada"
                                        className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Additional Notes</label>
                                <textarea value={leadMessage} onChange={e => setLeadMessage(e.target.value)} placeholder="Specify days, timings, or any custom goals..." rows={3}
                                    className="w-full px-4 py-3 text-xs font-medium border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 resize-none" />
                            </div>
                        </div>

                        <button onClick={handleCreateLead} disabled={submittingLead}
                            className="w-full py-3.5 bg-[#1f5961] hover:bg-[#163e44] disabled:opacity-50 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md">
                            {submittingLead ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Post Requirement
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
