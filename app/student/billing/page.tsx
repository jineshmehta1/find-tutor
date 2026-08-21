"use client";

import { useState } from "react";
import {
    CreditCard, Calendar, CheckCircle2, AlertCircle,
    ArrowUpRight, Download, RefreshCw, Layers
} from "lucide-react";
import { toast } from "sonner";

interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    status: "PAID" | "PENDING" | "FAILED";
    method: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [];

export default function StudentBillingPage() {
    const [txns, setTxns] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

    const handleReceipt = (id: string) => {
        toast.success(`Generating PDF invoice for transaction ${id}...`);
    };

    return (
        <div className="space-y-8 pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)] font-sans">
            {/* Header */}
            <div className="bg-[#ffb800] p-6 sm:p-10 rounded-3xl text-slate-950 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-bold rounded-full border border-slate-950/10">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Billing & Ledgers</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Payments & Invoices</h1>
                    <p className="text-xs sm:text-sm text-slate-900/85 font-medium max-w-xl">
                        Monitor payment transactions, enrollment receipts, and download class pack invoices.
                    </p>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Payment History</h3>
                <div className="space-y-4">
                    {txns.length === 0 ? (
                        <div className="text-center py-12 text-xs text-slate-400 font-bold uppercase tracking-wider">
                            No billing transactions found
                        </div>
                    ) : txns.map(t => (
                        <div key={t.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#ffb800] flex items-center justify-center shrink-0">
                                    <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="text-xs font-black text-slate-900">{t.description}</h4>
                                        <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-full font-black">
                                            {t.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-3 text-[10px] text-slate-400 font-medium pt-1">
                                        <span>Txn ID: {t.id}</span>
                                        <span>·</span>
                                        <span>Method: {t.method}</span>
                                        <span>·</span>
                                        <span>Date: {t.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 flex items-center justify-between sm:justify-start gap-6 border-t sm:border-t-0 border-slate-150 pt-3 sm:pt-0">
                                <span className="text-sm font-black text-slate-900">₹{t.amount}</span>
                                <button onClick={() => handleReceipt(t.id)}
                                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all border border-slate-200 flex items-center justify-center">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
