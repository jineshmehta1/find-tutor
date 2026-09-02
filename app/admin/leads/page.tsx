"use client";

import { useEffect, useState } from "react";
import { 
    Layers, Search, Loader2, ArrowRight, UserPlus, Phone, Mail, 
    MapPin, CheckCircle, RefreshCw, BookOpen, AlertCircle, X, ShieldAlert, Award
} from "lucide-react";
import { toast } from "sonner";

interface LeadData {
    id: string;
    studentId: string;
    teacherId: string | null;
    message: string | null;
    location: string | null;
    subject: string | null;
    classLevel: string | null;
    mode: string | null;
    status: "PENDING" | "ASSIGNED" | "DEMO_BOOKED" | "CONVERTED" | "LOST";
    createdAt: string;
    student: {
        user: {
            name: string;
            email: string;
            phone: string;
        }
    };
    teacher: {
        id: string;
        user: {
            name: string;
            phone: string;
        }
    } | null;
}

interface Tutor {
    id: string;
    user: {
        name: string;
    }
}

const STATUS_COLUMNS = [
    { key: "PENDING", label: "New Inquiry", color: "border-amber-400 bg-amber-50/50 text-amber-800" },
    { key: "ASSIGNED", label: "Tutor Assigned", color: "border-blue-400 bg-blue-50/50 text-blue-800" },
    { key: "DEMO_BOOKED", label: "Demo Scheduled", color: "border-indigo-400 bg-indigo-50/50 text-indigo-800" },
    { key: "CONVERTED", label: "Converted / Paid", color: "border-emerald-400 bg-emerald-50/50 text-emerald-800" },
    { key: "LOST", label: "Closed / Lost", color: "border-slate-300 bg-slate-50/50 text-slate-700" }
];

export default function LeadsBoard() {
    const [leads, setLeads] = useState<LeadData[]>([]);
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
    const [assigningId, setAssigningId] = useState<string | null>(null);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/leads");
            if (!res.ok) throw new Error("Failed to fetch leads");
            const data = await res.json();
            setLeads(data.leads || []);
            setTutors(data.approvedTutors || []);
        } catch (e) {
            toast.error("Failed to load student leads");
        } finally {
            setLoading(false);
        }
    };

    const updateLeadStatus = async (leadId: string, status: string) => {
        try {
            const res = await fetch("/api/admin/leads", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, status })
            });
            if (!res.ok) throw new Error("Failed to update status");
            toast.success("Lead status updated!");
            fetchLeads();
            if (selectedLead?.id === leadId) {
                setSelectedLead(prev => prev ? { ...prev, status: status as any } : null);
            }
        } catch (e) {
            toast.error("Failed to update lead status");
        }
    };

    const assignTutor = async (leadId: string, teacherId: string | null) => {
        setAssigningId(leadId);
        try {
            const res = await fetch("/api/admin/leads", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, teacherId })
            });
            if (!res.ok) throw new Error("Failed to assign tutor");
            toast.success(teacherId ? "Tutor assigned to lead!" : "Tutor unassigned");
            fetchLeads();
            if (selectedLead?.id === leadId) {
                const assignedTutor = tutors.find(t => t.id === teacherId);
                setSelectedLead(prev => prev ? { 
                    ...prev, 
                    teacherId,
                    teacher: assignedTutor ? { id: assignedTutor.id, user: { name: assignedTutor.user.name, phone: "" } } : null
                } : null);
            }
        } catch (e) {
            toast.error("Failed to assign tutor");
        } finally {
            setAssigningId(null);
        }
    };

    const filteredLeads = leads.filter(l => 
        l.student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.subject || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 font-sans pb-12">
            {/* Header Banner */}
            <div className="bg-[#ffb800] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                        <Layers className="w-3.5 h-3.5 text-amber-300" />
                        <span>Sales Pipeline</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Leads Kanban & Assignments</h1>
                    <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-xl">
                        Track student requirements, match verified teachers, and manage the student conversions.
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
                <div className="relative">
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#ffb800] outline-none bg-slate-50/50"
                        placeholder="Search leads by student name or teaching subject..."
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 text-[#ffb800] animate-spin" />
                    <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Loading Leads Kanban board...</p>
                </div>
            ) : (
                /* Kanban Columns Layout */
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 overflow-x-auto pb-4">
                    {STATUS_COLUMNS.map((col) => {
                        const colLeads = filteredLeads.filter(l => l.status === col.key);
                        return (
                            <div key={col.key} className="flex flex-col space-y-4 min-w-[250px] bg-slate-100/50 p-4 rounded-3xl border border-slate-200/60 h-[70vh]">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{col.label}</span>
                                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-black rounded-lg">{colLeads.length}</span>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                                    {colLeads.map((lead) => (
                                        <div 
                                            key={lead.id} 
                                            onClick={() => setSelectedLead(lead)}
                                            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-3 group"
                                        >
                                            <div>
                                                <h4 className="text-xs font-black text-slate-900 group-hover:text-[#ffb800] transition-colors">{lead.student.user.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{lead.subject || "No Subject"}</p>
                                            </div>

                                            <div className="text-[10px] font-semibold text-slate-500 space-y-1">
                                                <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#ffb800]" /> {lead.location?.split(',')[0] || "Vijayawada"}</div>
                                                <div className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-amber-500" /> {lead.classLevel || "Any Class"}</div>
                                            </div>

                                            {/* Tutor Matcher Selector in card */}
                                            <div onClick={(e) => e.stopPropagation()} className="pt-2 border-t border-slate-50 flex items-center justify-between gap-2">
                                                <select
                                                    value={lead.teacherId || ""}
                                                    onChange={(e) => assignTutor(lead.id, e.target.value || null)}
                                                    className="w-full text-[10px] font-bold py-1 border border-slate-200 rounded-lg outline-none bg-slate-50 cursor-pointer"
                                                >
                                                    <option value="">No Tutor Assigned</option>
                                                    {tutors.map(t => (
                                                        <option key={t.id} value={t.id}>{t.user.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                    {colLeads.length === 0 && (
                                        <div className="text-center py-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">No Leads</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Lead Details Modal */}
            {selectedLead && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative">
                        <button onClick={() => setSelectedLead(null)} className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-xl">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        <div className="space-y-1 border-b border-slate-100 pb-3">
                            <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full uppercase tracking-wider">Tuition Inquiry Details</span>
                            <h3 className="text-lg font-black text-slate-900 mt-2">{selectedLead.student.user.name}</h3>
                            <p className="text-xs text-slate-400 font-semibold">{selectedLead.student.user.email} • {selectedLead.student.user.phone}</p>
                        </div>

                        <div className="space-y-3 text-xs font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Class/Level:</span>
                                <span>{selectedLead.classLevel || "Not provided"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Subject:</span>
                                <span>{selectedLead.subject || "Not provided"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Teaching Mode:</span>
                                <span>{selectedLead.mode || "Not provided"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Location:</span>
                                <span className="truncate max-w-[200px]">{selectedLead.location || "Not provided"}</span>
                            </div>
                        </div>

                        {selectedLead.message && (
                            <div className="space-y-1.5">
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Parent/Student Message</span>
                                <p className="text-xs text-slate-600 font-bold leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    "{selectedLead.message}"
                                </p>
                            </div>
                        )}

                        {/* Status Mover & Tutor Assigner */}
                        <div className="space-y-4 pt-3 border-t border-slate-100">
                            <div className="space-y-1.5">
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Move status stage</span>
                                <div className="grid grid-cols-3 gap-2">
                                    {STATUS_COLUMNS.map(col => (
                                        <button
                                            key={col.key}
                                            onClick={() => updateLeadStatus(selectedLead.id, col.key)}
                                            className={`py-2 px-1 text-[9px] font-black rounded-xl uppercase border tracking-wider transition-all text-center ${selectedLead.status === col.key ? "bg-[#ffb800] text-white border-[#ffb800]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                                        >
                                            {col.key.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button onClick={() => setSelectedLead(null)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all">
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
