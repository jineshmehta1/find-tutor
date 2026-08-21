"use client";

import { useState, useEffect } from "react";
import { DollarSign, Award, ArrowUpRight, History, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Earning {
    id: string;
    amount: number;
    status: string;
    description: string;
    payoutDate: string | null;
    createdAt: string;
}

export default function TeacherEarningsPage() {
    const [earnings, setEarnings] = useState<Earning[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/teacher/earnings");
            if (res.ok) {
                const data = await res.json();
                setEarnings(data);
            }
        } catch {
            toast.error("Failed to load earnings history");
        } finally {
            setLoading(false);
        }
    };

    const totalEarned = earnings.reduce((acc, curr) => acc + curr.amount, 0);
    const pendingPayout = earnings.filter(e => e.status === "PENDING").reduce((acc, curr) => acc + curr.amount, 0);
    const completedPayouts = earnings.filter(e => e.status === "PAID").reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-8 pb-12 font-sans p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)]">
            {/* Header */}
            <div className="bg-[#ffb800] p-6 sm:p-8 rounded-3xl text-slate-950 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-black rounded-full border border-slate-950/10">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Financials</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Earnings & Payouts</h1>
                        <p className="text-xs sm:text-sm text-slate-800 font-medium max-w-xl">
                            Track your class completion revenue, pending payouts, and historical direct deposit ledger.
                        </p>
                    </div>
                    <button onClick={fetchEarnings} disabled={loading}
                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/15 transition-all disabled:opacity-50 self-start sm:self-auto">
                        <RefreshCw className={`w-4.5 h-4.5 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#ffb800] flex items-center justify-center font-bold">
                        ₹
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Earnings</p>
                        <h4 className="text-2xl font-black text-slate-800">₹{totalEarned.toLocaleString("en-IN")}</h4>
                    </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        ₹
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pending Payout</p>
                        <h4 className="text-2xl font-black text-slate-800">₹{pendingPayout.toLocaleString("en-IN")}</h4>
                    </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        ✓
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Cleared & Settled</p>
                        <h4 className="text-2xl font-black text-slate-800">₹{completedPayouts.toLocaleString("en-IN")}</h4>
                    </div>
                </div>
            </div>

            {/* Earnings History */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <History className="w-5 h-5 text-[#ffb800]" />
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Transaction Ledger</h3>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 text-[#ffb800] animate-spin" />
                    </div>
                ) : earnings.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-400 font-bold uppercase tracking-wider">
                        No transactions recorded. Complete a class to receive payouts.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {earnings.map((e) => (
                            <div key={e.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-xs font-black text-slate-900">{e.description}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                                        Date: {new Date(e.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-black text-slate-900">₹{e.amount}</div>
                                    <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-black border ${
                                        e.status === "PAID" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}>
                                        {e.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
