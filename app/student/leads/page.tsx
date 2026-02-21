"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Users, Clock, Loader2, Mail, Phone,
    CheckCircle, XCircle, MessageSquare, Send, Plus, X
} from "lucide-react";
import { toast } from "sonner";

interface LeadData {
    id: string;
    message: string | null;
    status: string;
    createdAt: string;
    teacher?: {
        id: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    } | null;
}

export default function StudentLeadsPage() {
    const { data: session } = useSession();
    const [leads, setLeads] = useState<LeadData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    // Create lead modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [leadMessage, setLeadMessage] = useState("");
    const [submittingLead, setSubmittingLead] = useState(false);

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

    const handleCreateLead = async () => {
        if (!leadMessage.trim()) {
            toast.error("Please write a message describing what you need");
            return;
        }

        setSubmittingLead(true);
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: leadMessage.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to create lead");
                return;
            }

            toast.success("Lead created successfully! Teachers will be able to see your request.");
            setShowCreateModal(false);
            setLeadMessage("");
            fetchLeads();
        } catch {
            toast.error("Failed to create lead");
        } finally {
            setSubmittingLead(false);
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
                    <p className="text-slate-500 mt-1">Post inquiries for teachers to see and respond</p>
                </div>
                <button
                    onClick={() => { setShowCreateModal(true); setLeadMessage(""); }}
                    className="px-5 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Create Lead
                </button>
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
                            ? "Create your first lead — all teachers will be able to see it and reach out to you."
                            : "Try a different filter."}
                    </p>
                    {filter === "all" && (
                        <button
                            onClick={() => { setShowCreateModal(true); setLeadMessage(""); }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Create Lead
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredLeads.map((lead) => (
                        <div key={lead.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">
                                            {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric", month: "short", year: "numeric",
                                                hour: "2-digit", minute: "2-digit"
                                            })}
                                        </p>
                                    </div>
                                </div>
                                {getStatusBadge(lead.status)}
                            </div>

                            {/* Message */}
                            {lead.message && (
                                <div className="bg-slate-50 rounded-xl p-4 mb-3">
                                    <p className="text-sm text-slate-700">{lead.message}</p>
                                </div>
                            )}

                            {/* Teacher response info */}
                            {lead.teacher && lead.status !== "PENDING" && (
                                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-500">
                                    <Mail className="w-4 h-4 text-blue-500" />
                                    <span>Responded by <strong className="text-slate-700">{lead.teacher.user.name}</strong></span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Create Lead Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Create New Lead</h2>
                                <p className="text-sm text-slate-500">All teachers will see your inquiry</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <p className="text-sm text-blue-700">
                                    <strong>How it works:</strong> Your lead will be visible to all teachers on the platform.
                                    Any interested teacher can then contact you directly.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Message *</label>
                                <textarea
                                    value={leadMessage}
                                    onChange={(e) => setLeadMessage(e.target.value)}
                                    rows={4}
                                    placeholder="Describe what you're looking for — e.g. subjects, preferred timing, learning goals..."
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-4 py-3 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateLead}
                                disabled={!leadMessage.trim() || submittingLead}
                                className="flex-1 px-4 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submittingLead ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</>
                                ) : (
                                    <><Send className="w-4 h-4" /> Post Lead</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
