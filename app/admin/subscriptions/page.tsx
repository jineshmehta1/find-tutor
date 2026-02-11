"use client";

import { useState, useEffect } from "react";
import {
    Crown, Search, Loader2, CheckCircle, XCircle, AlertCircle, Clock,
    Mail, Phone, MapPin, Users, GraduationCap
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
            toast.error("Failed to load data");
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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                    <AlertCircle className="w-3.5 h-3.5" /> Not Approved
                </span>
            );
        }
        if (t.subscriptionStatus === "active" && !t.isExpired) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    <CheckCircle className="w-3.5 h-3.5" /> Premium
                </span>
            );
        }
        if (t.subscriptionStatus === "trial" && !t.isExpired) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    <Clock className="w-3.5 h-3.5" /> Trial
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                <XCircle className="w-3.5 h-3.5" /> Expired
            </span>
        );
    };

    const parseSubjects = (subjects: string): string[] => {
        try { return JSON.parse(subjects); } catch { return [subjects]; }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Teacher Subscriptions</h1>
                <p className="text-slate-500 mt-1">View all teachers and their subscription status</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Total Teachers</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-slate-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">On Trial</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.trial}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Premium Active</p>
                            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Crown className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Expired</p>
                            <p className="text-3xl font-bold text-red-600">{stats.expired}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        placeholder="Search by name or email..."
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                >
                    <option value="all">All Statuses</option>
                    <option value="trial">Trial</option>
                    <option value="active">Premium</option>
                    <option value="expired">Expired</option>
                    <option value="none">Not Approved</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No Teachers Found</h3>
                    <p className="text-slate-500">No teachers match your current filters.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Teacher</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subjects</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Expires</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                        {/* Teacher */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                    {t.user.profilePhoto ? (
                                                        <img src={t.user.profilePhoto} alt="" className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        t.user.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 text-sm">{t.user.name}</p>
                                                    <p className="text-xs text-slate-400">{t.education} • {t.experience}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="text-sm text-slate-700 flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                    {t.user.email}
                                                </p>
                                                <p className="text-sm text-slate-700 flex items-center gap-1.5">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                    {t.user.phone || "—"}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Subjects */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                                                {parseSubjects(t.subjects).slice(0, 3).map((s, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full font-medium">{s}</span>
                                                ))}
                                                {parseSubjects(t.subjects).length > 3 && (
                                                    <span className="text-xs text-slate-400">+{parseSubjects(t.subjects).length - 3}</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            {getStatusBadge(t)}
                                        </td>

                                        {/* Expires */}
                                        <td className="px-6 py-4">
                                            {t.subscriptionEnd ? (
                                                <div>
                                                    <p className="text-sm text-slate-700">
                                                        {new Date(t.subscriptionEnd).toLocaleDateString("en-IN", {
                                                            day: "numeric", month: "short", year: "numeric"
                                                        })}
                                                    </p>
                                                    {!t.isExpired && (
                                                        <p className="text-xs text-slate-400">{t.daysRemaining} days left</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400">—</span>
                                            )}
                                        </td>

                                        {/* Payment ID */}
                                        <td className="px-6 py-4">
                                            {t.subscriptionPaymentId ? (
                                                <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded">{t.subscriptionPaymentId}</span>
                                            ) : (
                                                <span className="text-sm text-slate-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
