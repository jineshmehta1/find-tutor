"use client";

import React, { useState, useEffect } from "react";
import { Phone, Calendar, Clock, CheckCircle2, User, PhoneCall, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CallRecord {
    id: string;
    studentName: string;
    phone: string;
    subject: string;
    classLevel: string;
    requestedTime: string;
    status: "PENDING" | "COMPLETED";
}

export default function TeacherCallsPage() {
    const [calls, setCalls] = useState<CallRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCalls();
    }, []);

    const loadCalls = () => {
        const saved = localStorage.getItem("teacher_call_history");
        if (saved) {
            try {
                let list = JSON.parse(saved);
                if (Array.isArray(list)) {
                    // Purge legacy cached mock entries
                    list = list.filter((c: any) => c.id !== "call_1" && c.id !== "call_2" && c.id !== "call_3");
                    setCalls(list);
                    setLoading(false);
                    return;
                }
            } catch {}
        }
        setCalls([]);
        setLoading(false);
    };

    const handleCompleteCall = (id: string) => {
        const updated = calls.map(c => c.id === id ? { ...c, status: "COMPLETED" as const } : c);
        setCalls(updated);
        localStorage.setItem("teacher_call_history", JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
        toast.success("Call marked as completed!");
    };

    return (
        <div className="pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)] font-sans">
            {/* Header Banner */}
            <div className="bg-[#ffb800] p-6 sm:p-8 rounded-3xl text-slate-950 shadow-md relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-black rounded-full border border-slate-950/10">
                        <Phone className="w-3.5 h-3.5 text-slate-950" />
                        <span>Callback Center</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Call Requests</h1>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium max-w-xl">
                        View call requests initiated by parents/students seeking home or online tuitions.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#ffb800] border-t-transparent" />
                </div>
            ) : calls.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/50 p-12 text-center text-slate-400 font-semibold text-xs space-y-4 max-w-lg mx-auto">
                    <PhoneCall className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="font-extrabold text-slate-950 text-sm">No Call Requests</h3>
                    <p>All student callback matching actions will be tracked here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {calls.map((call) => (
                        <div key={call.id} className="bg-white rounded-3xl border border-slate-200/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="flex gap-3 items-start">
                                <div className="w-10 h-10 rounded-full bg-[#ffb800]/10 text-slate-950 flex items-center justify-center shrink-0 border">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-extrabold text-slate-900 text-sm">{call.studentName}</h3>
                                    <p className="text-xs font-bold text-slate-500">{call.classLevel}  •  {call.subject}</p>
                                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-extrabold mt-1">
                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {call.requestedTime}</span>
                                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {call.phone}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                                <span className={`px-2.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border leading-none ${
                                    call.status === "PENDING"
                                        ? "bg-amber-50 text-amber-600 border-amber-100"
                                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                }`}>
                                    {call.status}
                                </span>
                                {call.status === "PENDING" && (
                                    <button
                                        onClick={() => handleCompleteCall(call.id)}
                                        className="px-4 py-2 bg-slate-950 hover:bg-[#ffb800] hover:text-slate-950 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-sm border-none"
                                    >
                                        Mark Done
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
