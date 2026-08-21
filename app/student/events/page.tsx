"use client";

import { useState, useEffect } from "react";
import {
    Calendar, Clock, MapPin, Trophy, Loader2, Eye,
    CheckCircle, XCircle, AlertCircle, Ticket, Sparkles, CheckCircle2, ArrowRight
} from "lucide-react";
import { toast } from "sonner";

interface Registration {
    id: number;
    eventId: number;
    status: string;
    amount: number;
    paymentId: string | null;
    createdAt: string;
    event: {
        id: number;
        slug: string;
        title: string;
        category: string;
        date: string;
        time: string;
        location: string;
        image: string;
        status: string;
        prize: string;
        registrationFeeDisplay: string;
    };
}

export default function StudentEventsPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/events/register");
            if (!res.ok) throw new Error();
            const data = await res.json();
            if (Array.isArray(data)) {
                setRegistrations(data);
            }
        } catch {
            toast.error("Failed to load event registrations");
        } finally {
            setLoading(false);
        }
    };

    const filtered = registrations.filter(r => {
        if (filter === "confirmed") return r.status === "CONFIRMED";
        if (filter === "pending") return r.status === "PENDING";
        return true;
    });

    return (
        <div className="space-y-8 pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)] font-sans">
            {/* Header banner */}
            <div className="bg-[#ffb800] p-6 sm:p-10 rounded-3xl text-slate-950 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-bold rounded-full border border-slate-950/10">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>My Bookings</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Events & Camps</h1>
                        <p className="text-xs sm:text-sm text-slate-900/85 font-medium max-w-xl">
                            Manage your registrations for tournaments, workshops, and educational camps.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter chips */}
            <div className="flex gap-2">
                {[
                    { key: "all",       label: `All Bookings (${registrations.length})` },
                    { key: "confirmed", label: `Confirmed (${registrations.filter(r => r.status === "CONFIRMED").length})` },
                    { key: "pending",   label: `Pending (${registrations.filter(r => r.status === "PENDING").length})` },
                ].map(opt => (
                    <button key={opt.key} onClick={() => setFilter(opt.key)}
                        className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                            filter === opt.key
                                ? "bg-[#ffb800] text-white border-transparent shadow-sm"
                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                        }`}>
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Bookings List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3">
                    <Loader2 className="w-8 h-8 text-[#ffb800] animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Loading bookings...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center space-y-4 shadow-sm">
                    <div className="text-5xl">🎪</div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-800">No events booked yet</h3>
                        <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">Browse upcoming camps, chess tournaments, and robotics labs on our main portal.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map(reg => (
                        <div key={reg.id} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row">
                            <div className="w-full sm:w-40 h-40 shrink-0 bg-slate-100 relative">
                                {reg.event.image ? (
                                    <img src={reg.event.image} alt={reg.event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl">🎪</div>
                                )}
                                <span className="absolute top-3 left-3 bg-[#ffb800] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                                    {reg.event.category}
                                </span>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h3 className="font-black text-sm text-slate-900 line-clamp-1 leading-snug">{reg.event.title}</h3>
                                        <span className={`shrink-0 text-[9px] px-2 py-0.5 rounded-full font-black border ${
                                            reg.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                                        }`}>{reg.status}</span>
                                    </div>
                                    <div className="space-y-1.5 text-[11px] font-bold text-slate-400 mt-2">
                                        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#ffb800]" /> {new Date(reg.event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-500" /> {reg.event.time}</div>
                                        <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-500" /> {reg.event.location}</div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] font-black text-slate-600">
                                    <span>Fee: ₹{reg.amount}</span>
                                    {reg.paymentId && <span className="text-[10px] text-slate-400 font-medium">Txn ID: {reg.paymentId.slice(0, 10)}...</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
