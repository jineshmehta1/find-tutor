"use client";

import { useState, useEffect } from "react";
import {
    Users, Search, Mail, Phone, MapPin, User, Loader2,
    CheckCircle2, Clock, X, MessageCircle
} from "lucide-react";
import { toast } from "sonner";

interface Lead {
    id: string;
    message: string | null;
    status: string;
    createdAt: string;
    student: {
        id: string;
        subjects: string;
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

export default function TeacherLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [updating, setUpdating] = useState(false);

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
            toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    };

    const updateLeadStatus = async (leadId: string, status: string) => {
        setUpdating(true);
        try {
            const res = await fetch("/api/leads", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, status }),
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Status updated successfully!");
            await fetchLeads();
            setSelectedLead(null);
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const filteredLeads = leads.filter((lead) => {
        const matchesSearch = lead.student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.student.user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-amber-100 text-amber-700";
            case "CONTACTED": return "bg-blue-100 text-blue-700";
            case "CONVERTED": return "bg-green-100 text-green-700";
            case "REJECTED": return "bg-red-100 text-red-700";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Student Leads</h1>
                <p className="text-slate-500 mt-1">Manage inquiries from interested students</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                            placeholder="Search by name or email..."
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none appearance-none bg-white"
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="CONVERTED">Converted</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-slate-500">
                    Showing <span className="font-semibold text-slate-900">{filteredLeads.length}</span> leads
                </p>
            </div>

            {/* Leads List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
            ) : filteredLeads.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No Leads Found</h3>
                    <p className="text-slate-500">
                        {leads.length === 0
                            ? "When students contact you, their inquiries will appear here."
                            : "No leads match your current filters."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredLeads.map((lead) => (
                        <div
                            key={lead.id}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedLead(lead)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center overflow-hidden">
                                        {lead.student.user.profilePhoto ? (
                                            <img src={lead.student.user.profilePhoto} alt={lead.student.user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-7 h-7 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">{lead.student.user.name}</h3>
                                        <p className="text-slate-500 text-sm flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {lead.student.user.email}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                                    {lead.status}
                                </span>
                            </div>

                            {lead.message && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                                    <p className="text-slate-600 text-sm">
                                        <MessageCircle className="w-4 h-4 inline mr-2 text-slate-400" />
                                        {lead.message}
                                    </p>
                                </div>
                            )}

                            <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {lead.student.user.address.split(",")[0]}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lead Detail Modal */}
            {selectedLead && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white relative">
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center overflow-hidden">
                                    {selectedLead.student.user.profilePhoto ? (
                                        <img src={selectedLead.student.user.profilePhoto} alt={selectedLead.student.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedLead.student.user.name}</h2>
                                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLead.status)}`}>
                                        {selectedLead.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-4">
                            {/* Contact Info */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <Mail className="w-5 h-5 text-amber-500" />
                                    <div>
                                        <p className="text-xs text-slate-400">Email</p>
                                        <p className="font-medium text-slate-900">{selectedLead.student.user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <Phone className="w-5 h-5 text-amber-500" />
                                    <div>
                                        <p className="text-xs text-slate-400">Phone</p>
                                        <p className="font-medium text-slate-900">{selectedLead.student.user.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <MapPin className="w-5 h-5 text-amber-500" />
                                    <div>
                                        <p className="text-xs text-slate-400">Address</p>
                                        <p className="font-medium text-slate-900">{selectedLead.student.user.address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            {selectedLead.message && (
                                <div>
                                    <p className="text-sm font-medium text-slate-700 mb-2">Message</p>
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                        <p className="text-slate-700">{selectedLead.message}</p>
                                    </div>
                                </div>
                            )}

                            {/* Status Update */}
                            <div>
                                <p className="text-sm font-medium text-slate-700 mb-2">Update Status</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {["CONTACTED", "CONVERTED", "REJECTED"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => updateLeadStatus(selectedLead.id, status)}
                                            disabled={updating || selectedLead.status === status}
                                            className={`px-4 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 ${status === "CONTACTED" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" :
                                                    status === "CONVERTED" ? "bg-green-100 text-green-700 hover:bg-green-200" :
                                                        "bg-red-100 text-red-700 hover:bg-red-200"
                                                }`}
                                        >
                                            {updating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
