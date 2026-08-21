"use client";

import { useState, useEffect } from "react";
import {
    MessageSquare, Clock, CheckCircle2, AlertCircle,
    XCircle, Loader2, ChevronDown, User, GraduationCap,
    Send, RefreshCw, MailOpen, Filter
} from "lucide-react";
import { toast } from "sonner";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface SupportTicket {
    id: string;
    subject: string;
    message: string;
    userType: "STUDENT" | "TEACHER";
    userName: string;
    userEmail: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt: string;
    adminNote?: string;
}

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; icon: any }> = {
    OPEN:        { label: "Open",        color: "bg-rose-50 text-rose-700 border-rose-200",    icon: AlertCircle },
    IN_PROGRESS: { label: "In Progress", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
    RESOLVED:    { label: "Resolved",    color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    CLOSED:      { label: "Closed",      color: "bg-slate-50 text-slate-500 border-slate-200", icon: XCircle },
};

const PRIORITY_CONFIG: Record<TicketPriority, { color: string }> = {
    URGENT: { color: "bg-red-500 text-white" },
    HIGH:   { color: "bg-orange-500 text-white" },
    MEDIUM: { color: "bg-amber-400 text-slate-900" },
    LOW:    { color: "bg-slate-200 text-slate-600" },
};

// Tickets will be loaded from the database (API endpoint to be integrated)
// when a SupportTicket table is added to the Prisma schema.
const EMPTY_INITIAL: SupportTicket[] = [];

export default function SupportPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selected, setSelected] = useState<SupportTicket | null>(null);
    const [adminNote, setAdminNote] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/support");
            if (!res.ok) throw new Error();
            const data = await res.json();
            setTickets(data);
        } catch {
            toast.error("Failed to load tickets list");
        } finally {
            setLoading(false);
        }
    };

    const updateTicket = async (id: string, updates: Partial<SupportTicket>) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/support/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates)
            });
            if (!res.ok) throw new Error();
            toast.success("Ticket updated successfully");
            fetchTickets();
        } catch {
            toast.error("Failed to update ticket");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNote = async () => {
        if (!selected || !adminNote.trim()) return;
        await updateTicket(selected.id, { adminNote, status: "IN_PROGRESS" });
        setAdminNote("");
    };

    const filtered = statusFilter === "ALL"
        ? tickets
        : tickets.filter(t => t.status === statusFilter);

    const stats = {
        open: tickets.filter(t => t.status === "OPEN").length,
        inProgress: tickets.filter(t => t.status === "IN_PROGRESS").length,
        resolved: tickets.filter(t => t.status === "RESOLVED").length,
        urgent: tickets.filter(t => t.priority === "URGENT").length,
    };

    return (
        <div className="space-y-8 font-sans pb-12">
            {/* Header */}
            <div className="bg-[#ffb800] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>CRM Inbox</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Support Tickets</h1>
                    <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-xl">
                        Manage student and tutor support requests, disputes, and platform issues.
                    </p>
                    <button
                        onClick={fetchTickets}
                        disabled={loading}
                        className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Open",        value: stats.open,       icon: AlertCircle,  color: "text-rose-600",    bg: "bg-rose-50"    },
                    { label: "In Progress", value: stats.inProgress,  icon: Clock,        color: "text-amber-600",   bg: "bg-amber-50"   },
                    { label: "Resolved",    value: stats.resolved,    icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Urgent",      value: stats.urgent,      icon: AlertCircle,  color: "text-red-600",     bg: "bg-red-50"     },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className={`${bg} rounded-2xl p-4 flex items-center gap-3`}>
                        <Icon className={`w-5 h-5 ${color} shrink-0`} />
                        <div>
                            <div className={`text-2xl font-black ${color}`}>{value}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" style={{ minHeight: "60vh" }}>
                {/* Ticket List */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
                    {/* Filter bar */}
                    <div className="p-4 border-b border-slate-100 flex gap-2 overflow-x-auto shrink-0">
                        {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                className={`shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                                    statusFilter === s
                                        ? "bg-[#ffb800] text-white border-transparent"
                                        : "bg-slate-50 text-slate-400 border-slate-200"
                                }`}>
                                {s === "IN_PROGRESS" ? "In Progress" : s.charAt(0) + s.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    {/* Ticket items */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 text-[#ffb800] animate-spin" />
                            </div>
                        ) : filtered.map(ticket => {
                            const Cfg = STATUS_CONFIG[ticket.status];
                            return (
                                <button key={ticket.id} onClick={() => setSelected(ticket)}
                                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${selected?.id === ticket.id ? "bg-amber-50/60 border-r-2 border-[#ffb800]" : ""}`}>
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <span className="text-xs font-black text-slate-900 leading-tight line-clamp-1">{ticket.subject}</span>
                                        <span className={`shrink-0 text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase ${PRIORITY_CONFIG[ticket.priority].color}`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 line-clamp-1 mb-2">{ticket.message}</div>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                                            {ticket.userType === "TEACHER" ? <GraduationCap className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                            <span>{ticket.userName}</span>
                                        </div>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${Cfg.color}`}>
                                            {Cfg.label}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                        {!loading && filtered.length === 0 && (
                            <div className="text-center py-16 text-slate-300 text-xs font-bold uppercase tracking-widest">
                                No tickets in this category
                            </div>
                        )}
                    </div>
                </div>

                {/* Ticket Detail Panel */}
                <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
                    {!selected ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3">
                            <MailOpen className="w-12 h-12 text-slate-200" />
                            <p className="text-slate-400 font-bold text-sm">Select a ticket to view details</p>
                        </div>
                    ) : (
                        <>
                            {/* Detail Header */}
                            <div className="p-6 border-b border-slate-100 space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <h2 className="text-sm font-black text-slate-900 leading-tight">{selected.subject}</h2>
                                    <span className={`shrink-0 text-[9px] px-2.5 py-1 rounded-full font-black uppercase border ${STATUS_CONFIG[selected.status].color}`}>
                                        {STATUS_CONFIG[selected.status].label}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400">
                                    <span className="flex items-center gap-1">
                                        {selected.userType === "TEACHER" ? <GraduationCap className="w-3.5 h-3.5 text-[#ffb800]" /> : <User className="w-3.5 h-3.5 text-blue-500" />}
                                        {selected.userName} ({selected.userType})
                                    </span>
                                    <span>·</span>
                                    <span>{selected.userEmail}</span>
                                    <span>·</span>
                                    <span>{new Date(selected.createdAt).toLocaleString()}</span>
                                </div>
                                {/* Change Status */}
                                <div className="flex gap-2 flex-wrap">
                                    {(["OPEN","IN_PROGRESS","RESOLVED","CLOSED"] as TicketStatus[]).map(s => (
                                        <button key={s} onClick={() => updateTicket(selected.id, { status: s })}
                                            className={`text-[9px] px-3 py-1.5 rounded-xl font-black uppercase border transition-all ${
                                                selected.status === s
                                                    ? STATUS_CONFIG[s].color + " font-black"
                                                    : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300"
                                            }`}>
                                            {STATUS_CONFIG[s].label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message Thread */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {/* User message */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-black text-slate-500 shrink-0">
                                        {selected.userName[0]}
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4 flex-1 space-y-1">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{selected.userName}</div>
                                        <p className="text-sm text-slate-700 font-medium leading-relaxed">{selected.message}</p>
                                    </div>
                                </div>

                                {/* Admin note (if exists) */}
                                {selected.adminNote && (
                                    <div className="flex gap-3 justify-end">
                                        <div className="bg-[#ffb800] rounded-2xl rounded-tr-none p-4 max-w-sm space-y-1">
                                            <div className="text-[10px] font-black text-amber-200 uppercase tracking-wider">Admin Response</div>
                                            <p className="text-sm text-white font-medium leading-relaxed">{selected.adminNote}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-sm font-black text-slate-900 shrink-0">A</div>
                                    </div>
                                )}
                            </div>

                            {/* Reply Box */}
                            <div className="p-4 border-t border-slate-100 flex gap-3">
                                <textarea
                                    value={adminNote}
                                    onChange={e => setAdminNote(e.target.value)}
                                    placeholder="Type your admin response or internal note..."
                                    rows={2}
                                    className="flex-1 text-sm font-medium px-4 py-3 border border-slate-200 rounded-2xl outline-none focus:border-[#ffb800] resize-none bg-slate-50/50 placeholder:text-slate-300 placeholder:font-normal"
                                />
                                <button onClick={handleSaveNote} disabled={!adminNote.trim() || saving}
                                    className="px-4 py-2 bg-[#ffb800] hover:bg-[#ffa000] disabled:opacity-50 text-white rounded-2xl flex flex-col items-center gap-1 transition-all shrink-0">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    <span className="text-[9px] font-black">Send</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
