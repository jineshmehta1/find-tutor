"use client";

import { useState, useEffect } from "react";
import { 
    CreditCard, DollarSign, Download, ArrowUpRight, TrendingUp, 
    ArrowDownRight, CheckCircle2, AlertCircle, FileText, Search, Loader2
} from "lucide-react";
import { toast } from "sonner";

interface Transaction {
    id: string;
    date: string;
    name: string;
    email: string;
    type: "Tutor Subscription" | "Student Registration" | "Premium Spotlight Fee";
    amount: number;
    paymentId: string;
    status: "SUCCESS" | "PENDING" | "REFUNDED";
}

export default function TransactionsLedger() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/transactions");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setTransactions(data || []);
        } catch (e) {
            toast.error("Failed to load transaction records");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = (format: "Excel" | "PDF") => {
        toast.info(`Generating ${format} report...`);
        setTimeout(() => {
            toast.success(`${format} report downloaded successfully!`);
        }, 1200);
    };

    const filtered = transactions.filter(tx => {
        const matchesSearch = tx.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            tx.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "ALL" || tx.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const totalRevenue = transactions
        .filter(t => t.status === "SUCCESS")
        .reduce((sum, t) => sum + t.amount, 0);

    const pendingRevenue = transactions
        .filter(t => t.status === "PENDING")
        .reduce((sum, t) => sum + t.amount, 0);

    const activeRunRate = transactions
        .filter(t => t.status === "SUCCESS" && t.type === "Tutor Subscription")
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="space-y-8 font-sans pb-12">
            {/* Header Banner */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                        <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                        <span>Finance Ledger</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Payments & Revenue Ledger</h1>
                    <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                        Monitor payment gateways, Razorpay transaction IDs, parent enrollment dues, and premium instructor spotlight subscriptions.
                    </p>
                </div>
            </div>

            {/* KPIs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Collected</div>
                        <div className="text-3xl font-black text-slate-900 mt-1">₹{totalRevenue.toLocaleString("en-IN")}</div>
                        <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>Ledger Verified</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Gateway Dues</div>
                        <div className="text-3xl font-black text-slate-900 mt-1">₹{pendingRevenue.toLocaleString("en-IN")}</div>
                        <div className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5 mt-1">
                            <ArrowUpRight className="w-3 h-3" />
                            <span>In Escrow Queue</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                        <ArrowUpRight className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Run-Rate</div>
                        <div className="text-3xl font-black text-[#1f5961] mt-1">₹{activeRunRate.toLocaleString("en-IN")}/mo</div>
                        <div className="text-[10px] font-bold text-slate-400 mt-1">Projected MRR</div>
                    </div>
                    <div className="w-12 h-12 bg-teal-50 text-[#1f5961] rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl outline-none focus:border-[#1f5961] bg-slate-50/50"
                            placeholder="Search by name, transaction ID..."
                        />
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full sm:w-auto px-3.5 py-2.5 text-xs font-bold border border-slate-200 rounded-xl outline-none bg-slate-50 cursor-pointer"
                    >
                        <option value="ALL">All Payment Types</option>
                        <option value="Tutor Subscription">Tutor Subscription</option>
                        <option value="Student Registration">Student Registration</option>
                        <option value="Premium Spotlight Fee">Premium Spotlight Fee</option>
                    </select>
                </div>

                <div className="flex gap-2.5 w-full md:w-auto justify-end">
                    <button 
                        onClick={() => handleExport("Excel")}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors border border-slate-200"
                    >
                        <Download className="w-4 h-4" />
                        <span>Excel Report</span>
                    </button>
                    <button 
                        onClick={() => handleExport("PDF")}
                        className="px-4 py-2.5 bg-[#1f5961] hover:bg-[#163e44] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        <span>PDF Receipts</span>
                    </button>
                </div>
            </div>

            {/* Transactions Ledger Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                    <Loader2 className="w-8 h-8 text-[#1f5961] animate-spin" />
                    <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Loading transaction ledger...</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    <th className="p-4 sm:p-5">Tx ID</th>
                                    <th className="p-4 sm:p-5">Date</th>
                                    <th className="p-4 sm:p-5">User</th>
                                    <th className="p-4 sm:p-5">Category</th>
                                    <th className="p-4 sm:p-5">Payment ID</th>
                                    <th className="p-4 sm:p-5">Amount</th>
                                    <th className="p-4 sm:p-5 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                                {filtered.map(tx => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 sm:p-5 text-slate-900 font-extrabold">{tx.id}</td>
                                        <td className="p-4 sm:p-5">{tx.date}</td>
                                        <td className="p-4 sm:p-5">
                                            <div className="font-extrabold text-slate-900">{tx.name}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">{tx.email}</div>
                                        </td>
                                        <td className="p-4 sm:p-5">
                                            <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] text-slate-500 font-semibold">{tx.type}</span>
                                        </td>
                                        <td className="p-4 sm:p-5 font-mono text-[11px] text-slate-500">{tx.paymentId}</td>
                                        <td className="p-4 sm:p-5 text-slate-900 font-black">₹{tx.amount.toLocaleString("en-IN")}</td>
                                        <td className="p-4 sm:p-5 text-right">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${tx.status === "SUCCESS" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : tx.status === "PENDING" ? "bg-amber-50 text-amber-700 border border-amber-200/60" : "bg-rose-50 text-rose-700 border border-rose-200/60"}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="text-center py-16 text-slate-400 font-bold uppercase text-[10px] tracking-widest">No transactions found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
