"use client";

import { useState, useEffect } from "react";
import {
    MessageSquare, Send, Loader2, RefreshCw, AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface Ticket {
    id: string;
    subject: string;
    message: string;
    status: string;
    priority: string;
    adminNote: string | null;
    createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    OPEN:        { label: "Open",        color: "bg-rose-50 text-rose-700 border-rose-200" },
    IN_PROGRESS: { label: "In Progress", color: "bg-amber-50 text-amber-700 border-amber-200" },
    RESOLVED:    { label: "Resolved",    color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    CLOSED:      { label: "Closed",      color: "bg-slate-50 text-slate-500 border-slate-200" },
};

export default function TeacherSupportPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/support");
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch {
            // fallback
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async () => {
        if (!subject.trim() || !message.trim()) {
            toast.error("Please fill in the subject and message.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, message, priority })
            });
            if (!res.ok) throw new Error();
            toast.success("Support ticket submitted! Admins will respond shortly.");
            setSubject(""); setMessage(""); setPriority("MEDIUM");
            fetchTickets();
        } catch {
            toast.error("Failed to submit support ticket");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 pb-12 font-sans">
            {/* Header */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Helpdesk</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Support Helpdesk</h1>
                        <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                            Report issues with match credits, billing transactions, verification delay, or profile edits.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Form */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5 self-start">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">File a Ticket</h3>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Subject</label>
                            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Verification pending since 2 days"
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</label>
                            <select value={priority} onChange={e => setPriority(e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 appearance-none cursor-pointer">
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Explain the problem in detail..." rows={4}
                                className="w-full px-4 py-3 text-xs font-medium border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 resize-none" />
                        </div>

                        <button onClick={handleCreateTicket} disabled={submitting}
                            className="w-full py-3.5 bg-[#1f5961] hover:bg-[#163e44] disabled:opacity-50 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md">
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Submit Ticket
                        </button>
                    </div>
                </div>

                {/* History */}
                <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">My Support Logs</h3>
                        <button onClick={fetchTickets} className="text-slate-400 hover:text-slate-900 transition-colors">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 text-[#1f5961] animate-spin" />
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="text-center py-12 text-xs text-slate-400 font-bold uppercase tracking-wider">
                            No tickets filed
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tickets.map(ticket => {
                                const cfg = STATUS_CONFIG[ticket.status] || { label: ticket.status, color: "bg-slate-50 border-slate-200" };
                                return (
                                    <div key={ticket.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="text-xs font-black text-slate-900">{ticket.subject}</h4>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Filed: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black border ${cfg.color}`}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-650 font-medium">{ticket.message}</p>
                                        {ticket.adminNote && (
                                            <div className="bg-[#1f5961]/5 border border-[#1f5961]/15 rounded-xl p-3 space-y-1">
                                                <div className="text-[9px] font-black text-[#1f5961] uppercase tracking-wider">Admin Response</div>
                                                <p className="text-xs text-slate-750 font-semibold">{ticket.adminNote}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
