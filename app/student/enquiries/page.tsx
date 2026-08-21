"use client";

import React, { useState, useEffect } from "react";
import { Send, MapPin, Calendar, Clock, Search, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Lead {
    id: string;
    subject: string | null;
    classLevel: string | null;
    location: string | null;
    message: string | null;
    mode: string | null;
    status: string;
    createdAt: string;
    teacher?: {
        id: string;
        user: {
            name: string;
            email: string;
            phone: string;
            profilePhoto?: string;
        }
    } | null;
}

export default function MyEnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Lead[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const res = await fetch("/api/leads");
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) setEnquiries(data);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load enquiries.");
        } finally {
            setLoading(false);
        }
    };

    const filtered = enquiries.filter(enq => 
        (enq.subject?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (enq.location?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">My Enquiries</h1>
                    <p className="text-xs font-bold text-slate-400">Track responses and connections for your requirements</p>
                </div>
                <Link href="/student/leads" className="px-5 py-2.5 bg-[#0a1829] hover:bg-[#ffb800] hover:text-slate-950 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Post New Requirement
                </Link>
            </div>

            {/* Search filter bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/50 shadow-sm flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                    type="text"
                    placeholder="Search by subject or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent outline-none text-xs font-bold placeholder:text-slate-350"
                />
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#ffb800] border-t-transparent" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/50 p-12 text-center text-slate-400 font-semibold text-xs space-y-4">
                    <p>No active enquiries found matching your search.</p>
                    {enquiries.length === 0 && (
                        <Link href="/student/leads" className="inline-block px-5 py-2.5 bg-slate-100 hover:bg-[#ffb800] text-slate-700 font-black rounded-xl text-xs uppercase transition-colors">
                            Submit your first requirement
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map(enq => (
                        <div key={enq.id} className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between space-y-4">
                            
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border leading-none ${
                                        enq.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                        enq.status === "CONTACTED" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                        enq.status === "CONVERTED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                        "bg-rose-50 text-rose-600 border-rose-100"
                                    }`}>
                                        {enq.status}
                                    </span>
                                    <h3 className="text-sm font-black text-slate-900 mt-2">{enq.subject}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{enq.classLevel || "General Level"}</p>
                                </div>
                                <span className="text-[9px] text-slate-400 font-bold shrink-0">{new Date(enq.createdAt).toLocaleDateString("en-GB")}</span>
                            </div>

                            <div className="space-y-2 border-t border-b border-slate-50 py-3 text-xs font-bold text-slate-655">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>Preferred Location: {enq.location || "Online"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>Class Mode: {enq.mode || "Not specified"}</span>
                                </div>
                                {enq.message && (
                                    <p className="text-[11px] text-slate-400 font-medium italic mt-2">
                                        "{enq.message}"
                                    </p>
                                )}
                            </div>

                            {/* Assigned / Connected Teacher */}
                            {enq.teacher ? (
                                <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 shrink-0">
                                            <img src={enq.teacher.user.profilePhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"} alt="Tutor" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-slate-900">{enq.teacher.user.name}</h4>
                                            <p className="text-[9px] text-slate-400 font-bold mt-0.5">{enq.teacher.user.phone}</p>
                                        </div>
                                    </div>
                                    <Link href={`/student/messages?tutor=${enq.teacher.id}`} className="px-3 py-1.5 bg-[#0a1829] hover:bg-[#ffb800] hover:text-slate-950 text-white font-black text-[9px] uppercase tracking-wider rounded-lg transition-colors">
                                        Message
                                    </Link>
                                </div>
                            ) : (
                                <div className="p-3 text-center bg-amber-50/30 rounded-2xl border border-dashed border-amber-100 text-[10px] text-slate-450 font-bold">
                                    Awaiting teacher responses. We will match profiles shortly.
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
