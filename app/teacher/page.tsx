"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Users, FileText, TrendingUp, Clock, ArrowRight,
    AlertCircle, CheckCircle2, Loader2, Sparkles, BookOpen, ShieldCheck, Phone
} from "lucide-react";
import Link from "next/link";

interface Lead {
    id: string;
    message: string | null;
    status: string;
    createdAt: string;
    subject?: string | null;
    classLevel?: string | null;
    location?: string | null;
    student: {
        user: {
            name: string;
            email: string;
            phone?: string;
        };
    };
}

export default function TeacherDashboard() {
    const { data: session } = useSession();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    const [isApproved, setIsApproved] = useState<boolean>(session?.user?.isApproved ?? true);

    useEffect(() => {
        fetchLeads();
        fetchApprovalStatus();
    }, []);

    const fetchApprovalStatus = async () => {
        try {
            const res = await fetch("/api/teacher/subscription");
            if (res.ok) {
                const data = await res.json();
                if (typeof data.isApproved === "boolean") {
                    setIsApproved(data.isApproved);
                }
            }
        } catch { }
    };

    const fetchLeads = async () => {
        try {
            const res = await fetch("/api/leads?role=teacher");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setLeads(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setLoading(false);
        }
    };

    const pendingLeads = leads.filter(l => l.status === "PENDING").length;
    const totalLeads = leads.length;

    return (
        <div className="space-y-8 font-sans pb-12">
            {/* Pending Approval Banner */}
            {!isApproved && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-6 flex items-start gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-amber-100/80 rounded-2xl flex items-center justify-center shrink-0">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-amber-900 text-base">Account Pending Verification</h3>
                        <p className="text-xs text-amber-800/90 mt-1 font-medium leading-relaxed">
                            Your instructor profile is being reviewed by our Vijayawada center. Once verified, you will receive real-time notifications for nearby student tuition inquiries.
                        </p>
                    </div>
                </div>
            )}

            {/* Welcome Banner */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>Instructor Dashboard</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                            Welcome, {session?.user?.name || "Teacher"}! 👋
                        </h1>
                        <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                            Manage home and online student leads, respond to parent inquiries, and grow your tutoring practice.
                        </p>
                    </div>
                    <Link
                        href="/teacher/leads"
                        className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 self-start md:self-auto"
                    >
                        <span>Manage Student Leads</span>
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </Link>
                </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-black text-slate-900">{totalLeads}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Inquiries</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#1f5961] flex items-center justify-center font-bold shrink-0">
                        <FileText className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-black text-amber-600">{pendingLeads}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Action</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                        <Clock className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-black text-emerald-600">
                            {leads.filter(l => l.status === "CONVERTED").length}
                        </div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Converted Tutors</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-black text-purple-600">
                            {totalLeads ? `${Math.round((leads.filter(l => l.status !== "PENDING").length / totalLeads) * 100)}%` : "100%"}
                        </div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Response Rate</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">Recent Student Requirements</h2>
                        <p className="text-xs text-slate-500 font-medium">New student leads seeking private home & online tuition</p>
                    </div>
                    <Link href="/teacher/leads" className="text-xs font-black text-[#1f5961] hover:underline flex items-center gap-1">
                        <span>View All Leads</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : leads.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                        <Users className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="text-base font-extrabold text-slate-900">No Student Inquiries Yet</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                            {isApproved
                                ? "When students post requirements matching your subject profile in Vijayawada, they will show up here."
                                : "You will receive student requests once your teacher credentials are verified by our team."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {leads.slice(0, 5).map((lead) => (
                            <div key={lead.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#1f5961] flex items-center justify-center font-bold shrink-0">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-sm text-slate-900">
                                            {lead.student.user.name} <span className="text-xs font-normal text-slate-400">({lead.subject || "Tuition Request"})</span>
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium truncate max-w-md mt-0.5">
                                            {lead.message || "Looking for private tuition instructor"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 self-end sm:self-auto">
                                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${lead.status === "PENDING" ? "bg-amber-50 text-amber-700 border border-amber-200/60" :
                                        lead.status === "CONTACTED" ? "bg-blue-50 text-blue-700 border border-blue-200/60" :
                                            "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                        }`}>
                                        {lead.status}
                                    </span>
                                    <Link
                                        href="/teacher/leads"
                                        className="px-3.5 py-1.5 bg-[#1f5961] text-white text-xs font-bold rounded-xl hover:bg-[#1a4a51] transition-colors"
                                    >
                                        Respond
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
