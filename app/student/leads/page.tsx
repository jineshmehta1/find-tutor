"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    Users, Clock, MapPin, Loader2, Mail, Phone,
    CheckCircle, XCircle, AlertCircle, MessageSquare, Send
} from "lucide-react";
import { toast } from "sonner";

interface LeadData {
    id: string;
    message: string | null;
    status: string;
    createdAt: string;
    teacher: {
        id: string;
        education: string;
        experience: string;
        subjects: string;
        isApproved: boolean;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            address: string;
            profilePhoto: string | null;
        };
    };
}

export default function StudentLeadsPage() {
    const { data: session } = useSession();
    const [leads, setLeads] = useState<LeadData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await fetch("/api/leads");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setLeads(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = filter === "all"
        ? leads
        : leads.filter(l => l.status === filter);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "CONTACTED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Contacted
                    </span>
                );
            case "CONVERTED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Converted
                    </span>
                );
            case "REJECTED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                        <XCircle className="w-3.5 h-3.5" />
                        Rejected
                    </span>
                );
            case "PENDING":
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                    </span>
                );
        }
    };

    const parseSubjects = (subjects: string): string[] => {
        try { return JSON.parse(subjects); } catch { return [subjects]; }
    };

    const stats = {
        total: leads.length,
        pending: leads.filter(l => l.status === "PENDING").length,
        contacted: leads.filter(l => l.status === "CONTACTED").length,
        converted: leads.filter(l => l.status === "CONVERTED").length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Leads</h1>
                    <p className="text-slate-500 mt-1">Track your teacher contact requests</p>
                </div>
                <Link
                    href="/student/teachers"
                    className="px-5 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Send className="w-5 h-5" />
                    Contact a Teacher
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Total Leads</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Pending</p>
                            <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Contacted</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.contacted}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Converted</p>
                            <p className="text-3xl font-bold text-green-600">{stats.converted}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-100 w-fit">
                {[
                    { value: "all", label: "All" },
                    { value: "PENDING", label: "Pending" },
                    { value: "CONTACTED", label: "Contacted" },
                    { value: "CONVERTED", label: "Converted" },
                    { value: "REJECTED", label: "Rejected" },
                ].map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${filter === tab.value
                            ? "bg-blue-500 text-white shadow-sm"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Leads List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : filteredLeads.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {filter === "all" ? "No Leads Yet" : `No ${filter.toLowerCase()} leads`}
                    </h3>
                    <p className="text-slate-500 mb-6">
                        {filter === "all"
                            ? "Browse teachers and send your first contact request."
                            : "Try a different filter."}
                    </p>
                    {filter === "all" && (
                        <Link
                            href="/student/teachers"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
                        >
                            <Users className="w-5 h-5" />
                            Find Teachers
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredLeads.map((lead) => {
                        const subjects = parseSubjects(lead.teacher.subjects);
                        return (
                            <div key={lead.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    {/* Teacher Avatar */}
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
                                        {lead.teacher.user.profilePhoto ? (
                                            <img src={lead.teacher.user.profilePhoto} alt={lead.teacher.user.name} className="w-full h-full rounded-xl object-cover" />
                                        ) : (
                                            lead.teacher.user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg">{lead.teacher.user.name}</h3>
                                                <p className="text-slate-500 text-sm">{lead.teacher.education} • {lead.teacher.experience}</p>
                                            </div>
                                            {getStatusBadge(lead.status)}
                                        </div>

                                        {/* Subjects */}
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {subjects.map((subject, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Message */}
                                        {lead.message && (
                                            <div className="bg-slate-50 rounded-xl p-3 mb-3">
                                                <p className="text-sm text-slate-600 italic">"{lead.message}"</p>
                                            </div>
                                        )}

                                        {/* Contact Info & Date */}
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <Mail className="w-4 h-4 text-blue-500" />
                                                {lead.teacher.user.email}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Phone className="w-4 h-4 text-blue-500" />
                                                {lead.teacher.user.phone}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-blue-500" />
                                                {lead.teacher.user.address}
                                            </span>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-slate-100">
                                            <span className="text-xs text-slate-400">
                                                Sent on {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric", month: "short", year: "numeric"
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
