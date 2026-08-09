"use client";

import { useState, useEffect } from "react";
import {
    ShieldCheck, FileCheck, FileX, Eye, Clock,
    GraduationCap, Download, CheckCircle2, XCircle,
    Loader2, RefreshCw, AlertTriangle, ChevronRight
} from "lucide-react";
import { toast } from "sonner";

interface TeacherVerification {
    id: string;
    userId: string;
    name: string;
    email: string;
    profilePhoto: string | null;
    education: string;
    experience: string;
    subjects: string[];
    qualificationLevel: string | null;
    qualificationName: string | null;
    qualificationCertificate: string | null;
    achievementCertificate: string | null;
    achievements: string | null;
    isApproved: boolean;
    createdAt: string;
    approvedAt: string | null;
}

export default function VerificationQueuePage() {
    const [tutors, setTutors] = useState<TeacherVerification[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<TeacherVerification | null>(null);
    const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "ALL">("PENDING");
    const [processing, setProcessing] = useState<string | null>(null);
    const [previewImg, setPreviewImg] = useState<string | null>(null);

    useEffect(() => { fetchQueue(); }, []);

    const fetchQueue = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/users?role=TEACHER");
            if (!res.ok) throw new Error();
            const data = await res.json();
            setTutors(data);
        } catch {
            toast.error("Failed to load verification queue");
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async (tutorId: string, userId: string, approve: boolean) => {
        setProcessing(tutorId);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isApproved: approve }),
            });
            if (!res.ok) throw new Error();
            toast.success(approve ? "✅ Tutor approved and notified!" : "❌ Application rejected");
            setTutors(prev => prev.map(t =>
                t.id === tutorId ? { ...t, isApproved: approve, approvedAt: approve ? new Date().toISOString() : null } : t
            ));
            if (selected?.id === tutorId) setSelected(prev => prev ? { ...prev, isApproved: approve } : prev);
        } catch {
            toast.error("Failed to update tutor status");
        } finally {
            setProcessing(null);
        }
    };

    const filtered = tutors.filter(t => {
        if (filter === "PENDING")  return !t.isApproved;
        if (filter === "APPROVED") return t.isApproved;
        return true;
    });

    const pendingCount  = tutors.filter(t => !t.isApproved).length;
    const approvedCount = tutors.filter(t =>  t.isApproved).length;

    return (
        <div className="space-y-8 font-sans pb-12">
            {/* Header */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>KYC Review Queue</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Tutor Verification Queue</h1>
                        <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                            Review qualification certificates, achievement documents, and approve or reject tutor applications.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {pendingCount > 0 && (
                            <div className="flex items-center gap-2 bg-amber-400 text-slate-900 px-4 py-2 rounded-2xl font-black text-sm">
                                <AlertTriangle className="w-4 h-4" />
                                {pendingCount} pending
                            </div>
                        )}
                        <button onClick={fetchQueue} disabled={loading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all disabled:opacity-50">
                            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Stat chips */}
            <div className="flex gap-3 flex-wrap">
                {[
                    { key: "PENDING",  label: `Pending Review (${pendingCount})`,   color: "bg-amber-50 text-amber-700 border-amber-200" },
                    { key: "APPROVED", label: `Approved (${approvedCount})`,         color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                    { key: "ALL",      label: `All (${tutors.length})`,              color: "bg-slate-50 text-slate-600 border-slate-200" },
                ].map(opt => (
                    <button key={opt.key} onClick={() => setFilter(opt.key as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                            filter === opt.key
                                ? "bg-[#1f5961] text-white border-transparent shadow-md"
                                : opt.color
                        }`}>
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Image Preview Modal */}
            {previewImg && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    onClick={() => setPreviewImg(null)}>
                    <div className="max-w-3xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl">
                        <img src={previewImg} alt="Certificate" className="w-full h-full object-contain" />
                    </div>
                </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" style={{ minHeight: "60vh" }}>
                {/* Queue List */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {filtered.length} Application{filtered.length !== 1 ? "s" : ""}
                        </h3>
                    </div>
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-[#1f5961] animate-spin" />
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                            {filtered.map(t => (
                                <button key={t.id} onClick={() => setSelected(t)}
                                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${selected?.id === t.id ? "bg-teal-50/60 border-r-2 border-[#1f5961]" : ""}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#1f5961]/10 shrink-0">
                                            {t.profilePhoto ? (
                                                <img src={t.profilePhoto} alt={t.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-black text-sm text-[#1f5961]">{t.name[0]}</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-black text-slate-900 truncate">{t.name}</div>
                                            <div className="text-[10px] text-slate-400 truncate">{t.email}</div>
                                        </div>
                                        <div className="shrink-0">
                                            {t.isApproved ? (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <Clock className="w-4 h-4 text-amber-500" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-2 ml-13">
                                        {t.qualificationCertificate && (
                                            <span className="text-[9px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-bold border border-blue-100 flex items-center gap-1">
                                                <FileCheck className="w-2.5 h-2.5" /> Qual. Cert
                                            </span>
                                        )}
                                        {t.achievementCertificate && (
                                            <span className="text-[9px] px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md font-bold border border-purple-100 flex items-center gap-1">
                                                <FileCheck className="w-2.5 h-2.5" /> Achievement
                                            </span>
                                        )}
                                        {!t.qualificationCertificate && !t.achievementCertificate && (
                                            <span className="text-[9px] px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md font-bold border border-slate-100">No docs uploaded</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                            {filtered.length === 0 && (
                                <div className="text-center py-16 text-slate-300 text-xs font-bold uppercase tracking-widest">
                                    No applications in this view
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Detail Panel */}
                <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
                    {!selected ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3">
                            <GraduationCap className="w-12 h-12 text-slate-200" />
                            <p className="text-slate-400 font-bold text-sm">Select an application to review</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Profile Header */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#1f5961]/10 shrink-0">
                                    {selected.profilePhoto ? (
                                        <img src={selected.profilePhoto} alt={selected.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-black text-2xl text-[#1f5961]">{selected.name[0]}</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-black text-slate-900">{selected.name}</h2>
                                    <div className="text-xs text-slate-400 font-medium">{selected.email}</div>
                                    <div className="text-[10px] text-slate-400 font-bold mt-1">
                                        Applied: {new Date(selected.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </div>
                                </div>
                                <span className={`px-3 py-1.5 rounded-xl text-xs font-black border ${
                                    selected.isApproved
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}>
                                    {selected.isApproved ? "Approved" : "Pending"}
                                </span>
                            </div>

                            {/* Profile Info Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Education",   value: selected.education },
                                    { label: "Experience",  value: selected.experience },
                                    { label: "Qual. Level", value: selected.qualificationLevel || "—" },
                                    { label: "Qual. Name",  value: selected.qualificationName  || "—" },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
                                        <div className="text-xs font-bold text-slate-700">{value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Subjects */}
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subjects</div>
                                <div className="flex flex-wrap gap-2">
                                    {selected.subjects.map(s => (
                                        <span key={s} className="text-xs px-3 py-1 bg-teal-50 text-[#1f5961] rounded-xl font-bold border border-teal-100">{s}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Achievements */}
                            {selected.achievements && (
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Achievements</div>
                                    <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 rounded-2xl p-3 border border-slate-100">
                                        {selected.achievements}
                                    </p>
                                </div>
                            )}

                            {/* Documents */}
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Uploaded Documents</div>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Qualification Certificate", url: selected.qualificationCertificate },
                                        { label: "Achievement Certificate",   url: selected.achievementCertificate },
                                    ].map(({ label, url }) => (
                                        <div key={label} className={`rounded-2xl border p-3 space-y-2 ${url ? "bg-blue-50/50 border-blue-100" : "bg-slate-50 border-slate-100"}`}>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{label}</div>
                                            {url ? (
                                                <>
                                                    <div className="relative h-24 rounded-xl overflow-hidden bg-slate-200 cursor-pointer group" onClick={() => setPreviewImg(url)}>
                                                        <img src={url} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Eye className="w-5 h-5 text-white" />
                                                        </div>
                                                    </div>
                                                    <button onClick={() => setPreviewImg(url)}
                                                        className="w-full text-[10px] font-black text-blue-600 flex items-center justify-center gap-1 hover:underline">
                                                        <Eye className="w-3 h-3" /> View Full Size
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="h-24 flex flex-col items-center justify-center text-slate-300 space-y-1">
                                                    <FileX className="w-6 h-6" />
                                                    <span className="text-[9px] font-bold">Not uploaded</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => handleDecision(selected.id, selected.userId, true)}
                                    disabled={selected.isApproved || processing === selected.id}
                                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
                                >
                                    {processing === selected.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    {selected.isApproved ? "Already Approved" : "Approve Tutor"}
                                </button>
                                <button
                                    onClick={() => handleDecision(selected.id, selected.userId, false)}
                                    disabled={!selected.isApproved || processing === selected.id}
                                    className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
                                >
                                    {processing === selected.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                    {selected.isApproved ? "Revoke Approval" : "Not Yet Approved"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
