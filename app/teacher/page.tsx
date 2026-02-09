"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Users, FileText, TrendingUp, Clock, ArrowRight,
    AlertCircle, CheckCircle2, Loader2
} from "lucide-react";
import Link from "next/link";

interface Lead {
    id: string;
    message: string | null;
    status: string;
    createdAt: string;
    student: {
        user: {
            name: string;
            email: string;
        };
    };
}

export default function TeacherDashboard() {
    const { data: session } = useSession();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    const isApproved = session?.user?.isApproved;

    useEffect(() => {
        fetchLeads();
    }, []);

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

    const stats = [
        { label: "Total Leads", value: totalLeads.toString(), icon: FileText, color: "from-amber-500 to-amber-600" },
        { label: "Pending", value: pendingLeads.toString(), icon: Clock, color: "from-blue-500 to-blue-600" },
        { label: "Converted", value: leads.filter(l => l.status === "CONVERTED").length.toString(), icon: CheckCircle2, color: "from-green-500 to-green-600" },
        { label: "Response Rate", value: totalLeads ? `${Math.round((leads.filter(l => l.status !== "PENDING").length / totalLeads) * 100)}%` : "0%", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
    ];

    return (
        <div className="space-y-8">
            {/* Pending Approval Banner */}
            {!isApproved && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-amber-900">Account Pending Approval</h3>
                        <p className="text-amber-700 mt-1">
                            Your teacher account is currently under review. Once approved by an admin, you&apos;ll have full access to manage student leads and view your profile publicly.
                        </p>
                    </div>
                </div>
            )}

            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {session?.user?.name?.split(" ")[0] || "Teacher"}! 👋
                </h1>
                <p className="text-slate-300 text-lg">
                    Manage your student leads and grow your teaching practice.
                </p>
                <Link
                    href="/teacher/leads"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                >
                    View Leads
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                            </div>
                            <p className="text-slate-500 font-medium">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Leads */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Recent Leads</h2>
                    <Link href="/teacher/leads" className="text-amber-600 hover:text-amber-700 font-medium text-sm">
                        View All
                    </Link>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    </div>
                ) : leads.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Leads Yet</h3>
                        <p className="text-slate-500">
                            {isApproved
                                ? "When students contact you, their requests will appear here."
                                : "You'll start receiving leads once your account is approved."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {leads.slice(0, 5).map((lead) => (
                            <div key={lead.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-900">{lead.student.user.name}</p>
                                    <p className="text-sm text-slate-500 truncate">{lead.message || "No message provided"}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${lead.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                                        lead.status === "CONTACTED" ? "bg-blue-100 text-blue-700" :
                                            lead.status === "CONVERTED" ? "bg-green-100 text-green-700" :
                                                "bg-red-100 text-red-700"
                                    }`}>
                                    {lead.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
