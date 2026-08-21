"use client";

import { useState, useEffect } from "react";
import {
    Crown, Search, Loader2, CheckCircle, XCircle, AlertCircle, Clock,
    Mail, Phone, MapPin, Users, GraduationCap, Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface TeacherSub {
    id: string;
    isApproved: boolean;
    approvedAt: string | null;
    subscriptionStatus: string;
    subscriptionEnd: string | null;
    subscriptionPaymentId: string | null;
    education: string;
    experience: string;
    subjects: string;
    daysRemaining: number;
    isExpired: boolean;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        profilePhoto: string | null;
    };
}

export default function AdminSubscriptionsPage() {
    const [teachers, setTeachers] = useState<TeacherSub[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const res = await fetch("/api/admin/subscriptions");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setTeachers(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load subscription activity");
        } finally {
            setLoading(false);
        }
    };

    const filtered = teachers.filter((t) => {
        const matchesSearch =
            t.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            t.subscriptionStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: teachers.length,
        trial: teachers.filter(t => t.subscriptionStatus === "trial" && !t.isExpired).length,
        active: teachers.filter(t => t.subscriptionStatus === "active" && !t.isExpired).length,
        expired: teachers.filter(t => t.subscriptionStatus === "expired" || t.isExpired).length,
    };

    const getStatusBadge = (t: TeacherSub) => {
        if (!t.isApproved) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                    <AlertCircle className="w-3.5 h-3.5" /> Pending Approval
                </span>
            );
        }
        if (t.subscriptionStatus === "active" && !t.isExpired) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <CheckCircle className="w-3.5 h-3.5" /> Premium Active
                </span>
            );
        }
        if (t.subscriptionStatus === "trial" && !t.isExpired) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60">
                    <Clock className="w-3.5 h-3.5" /> Free Trial
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/60">
                <XCircle className="w-3.5 h-3.5" /> Plan Expired
            </span>
        );
    };

    const parseSubjects = (subjects: string): string[] => {
        try { return JSON.parse(subjects); } catch { return [subjects]; }
    };

    return (
        <div className="space-y-8 font-sans pb-12">
            {/* Header Banner */}
            <div className="bg-[#ffb800] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Membership Activity</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Active Instructor Subscriptions</h1>
                    <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-xl">
                        Monitor active tutor memberships, Razorpay payment reference IDs, trial durations, and expiration dates.
                    </p>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-black text-slate-900">{stats.total}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tutors</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                        <Users className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-black text-blue-600">{stats.trial}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">On Free Trial</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Clock className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-black text-emerald-600">{stats.active}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Premium Paid</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <Crown className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-black text-rose-600">{stats.expired}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expired Tiers</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                        <XCircle className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#ffb800] outline-none bg-slate-50/50"
                        placeholder="Filter tutors by name or email address..."
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#ffb800] outline-none bg-slate-50/50 cursor-pointer"
                >
                    <option value="all">All Subscription Tiers</option>
                    <option value="trial">Free Trial</option>
                    <option value="active">Premium Active</option>
                    <option value="expired">Expired</option>
                </select>
            </div>

            {/* Teachers Subscriptions Feed */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-28 bg-slate-200/60 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                    <Crown className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="text-lg font-extrabold text-slate-900">No Subscriptions Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">No instructor subscriptions match your search filter.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((t) => (
                        <div key={t.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#ffb800] flex items-center justify-center font-bold overflow-hidden border border-amber-200/60 shrink-0">
                                        {t.user.profilePhoto ? (
                                            <img src={t.user.profilePhoto} alt={t.user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Users className="w-6 h-6 text-[#ffb800]" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-base text-slate-900">{t.user.name}</h3>
                                        <p className="text-xs text-slate-500 font-medium">{t.user.email} • {t.user.phone || "No Phone"}</p>
                                    </div>
                                </div>
                                {getStatusBadge(t)}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div>
                                    <span className="text-slate-400 block text-[10px] uppercase font-black">Days Remaining</span>
                                    <span className="text-slate-900">{t.daysRemaining > 0 ? `${t.daysRemaining} Days` : "Expired"}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] uppercase font-black">Expiration Date</span>
                                    <span className="text-slate-900">{t.subscriptionEnd ? new Date(t.subscriptionEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] uppercase font-black">Payment Ref / Order ID</span>
                                    <span className="text-slate-900 truncate block font-mono text-[11px]">{t.subscriptionPaymentId || "Free Trial Access"}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
