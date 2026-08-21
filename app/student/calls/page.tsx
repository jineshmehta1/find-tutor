"use client";

import React, { useState, useEffect } from "react";
import { Phone, PhoneCall, Calendar, MapPin, User, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Lead {
    id: string;
    subject: string | null;
    status: string;
    createdAt: string;
    teacher?: {
        user: {
            name: string;
            phone: string;
            email: string;
            profilePhoto?: string;
        }
    } | null;
}

export default function StudentCallsPage() {
    const [calls, setCalls] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCalls();
    }, []);

    const fetchCalls = async () => {
        try {
            const res = await fetch("/api/leads");
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Show enquiries that reached contacted status or have a linked teacher phone
                    const connected = data.filter((l: Lead) => l.teacher !== null);
                    setCalls(connected);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCallClick = (name: string, phone: string) => {
        toast.info(`Dialing ${name} at ${phone}...`);
        window.open(`tel:${phone}`);
    };

    return (
        <div className="space-y-6 pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)]">
            <div>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Call History</h1>
                <p className="text-xs font-bold text-slate-400">Direct contact phone numbers of matched instructors</p>
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#ffb800] border-t-transparent" />
                </div>
            ) : calls.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/50 p-12 text-center text-slate-400 font-semibold text-xs space-y-4 max-w-lg mx-auto">
                    <Phone className="w-12 h-12 text-slate-350 mx-auto" />
                    <h3 className="font-extrabold text-slate-950 text-sm">No Contact Records Yet</h3>
                    <p>When teachers match or respond to your enquiries, their phone contact history will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 space-y-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                                    <th className="pb-3">Tutor / Coach</th>
                                    <th className="pb-3">Subject / Requirement</th>
                                    <th className="pb-3">Contact Number</th>
                                    <th className="pb-3">Connected Date</th>
                                    <th className="pb-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/60">
                                {calls.map((c) => (
                                    <tr key={c.id} className="text-xs font-bold text-slate-700 hover:bg-slate-50/20 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shrink-0 border">
                                                    <img src={c.teacher?.user.profilePhoto || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"} alt="Tutor" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-black text-slate-900">{c.teacher?.user.name}</h4>
                                                    <span className="text-[9px] text-emerald-600 font-extrabold uppercase">Verified Match</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div>
                                                <div className="font-extrabold text-slate-850">{c.subject}</div>
                                                <div className="text-[10px] text-slate-400 font-bold mt-0.5">{c.status}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-slate-800 font-extrabold">{c.teacher?.user.phone}</td>
                                        <td className="py-4 text-slate-500">{new Date(c.createdAt).toLocaleDateString("en-GB")}</td>
                                        <td className="py-4 text-right">
                                            <button
                                                onClick={() => handleCallClick(c.teacher!.user.name, c.teacher!.user.phone)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ffb800] hover:bg-[#ffa000] text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer border border-none shadow-sm"
                                            >
                                                <PhoneCall className="w-3.5 h-3.5" /> Call Now
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
