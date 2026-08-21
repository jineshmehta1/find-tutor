"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, FileText, Download, CheckCircle2, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Invoice {
    id: string;
    date: string;
    amount: string;
    plan: string;
    status: "PAID" | "PENDING";
    transactionId: string;
}

export default function TeacherPaymentsPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBilling = async () => {
            try {
                const res = await fetch("/api/teacher/subscription");
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === "active" && data.subscriptionPaymentId) {
                        setInvoices([
                            {
                                id: `inv_${data.subscriptionPaymentId.slice(-4)}`,
                                date: data.subscriptionEnd ? new Date(data.subscriptionEnd).toLocaleDateString() : "Active",
                                amount: "₹1,999",
                                plan: "Premium Quarterly Plan",
                                status: "PAID",
                                transactionId: data.subscriptionPaymentId
                            }
                        ]);
                    }
                }
            } catch {}
            setLoading(false);
        };
        fetchBilling();
    }, []);

    const handleDownload = (id: string) => {
        toast.success(`Downloading Invoice PDF for ${id}!`);
    };

    return (
        <div className="pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)] font-sans">
            {/* Header Banner */}
            <div className="bg-[#ffb800] p-6 sm:p-8 rounded-3xl text-slate-950 shadow-md relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-black rounded-full border border-slate-950/10">
                        <DollarSign className="w-3.5 h-3.5 text-slate-950" />
                        <span>Finance Vault</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Payments & Invoices</h1>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium max-w-xl">
                        Monitor payment logs, billing transactions, and download invoices for subscription premiums.
                    </p>
                </div>
            </div>

            {/* Invoices List Card */}
            <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Transaction History</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/40">
                                <th className="px-6 py-3.5">Invoice ID</th>
                                <th className="px-6 py-3.5">Billing Date</th>
                                <th className="px-6 py-3.5">Plan Details</th>
                                <th className="px-6 py-3.5">Transaction ID</th>
                                <th className="px-6 py-3.5">Amount</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/60 text-xs font-bold text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-450 font-black">
                                        Loading billing entries...
                                    </td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-450 font-black uppercase tracking-wider text-[10px]">
                                        No billing transactions found. Upgrade to Premium to unlock direct lead contact privileges!
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-4 text-slate-900 font-extrabold">{inv.id.toUpperCase()}</td>
                                        <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                                        <td className="px-6 py-4 text-slate-900">{inv.plan}</td>
                                        <td className="px-6 py-4 text-slate-400 font-mono">{inv.transactionId}</td>
                                        <td className="px-6 py-4 text-slate-900 font-extrabold">{inv.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-wider">
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => handleDownload(inv.id)} className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:text-[#ffb800] hover:border-[#ffb800]/20 transition-all flex items-center justify-center cursor-pointer mx-auto">
                                                <Download className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
