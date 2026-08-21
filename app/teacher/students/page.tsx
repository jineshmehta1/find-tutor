"use client";

import { useState, useEffect } from "react";
import { Users, Search, Mail, Phone, MapPin, User, Loader2, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Lead {
    id: string;
    status: string;
    createdAt: string;
    subject?: string | null;
    classLevel?: string | null;
    student: {
        id: string;
        subjects: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            address: string;
            profilePhoto: string | null;
        };
    };
}

export default function TeacherStudentsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await fetch("/api/leads?role=teacher");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            // Only show converted/contacted students
            const students = (Array.isArray(data) ? data : []).filter(
                (l: Lead) => l.status === "CONVERTED" || l.status === "CONTACTED"
            );
            setLeads(students);
        } catch (error) {
            toast.error("Failed to load active students");
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = leads.filter((lead) => {
        return lead.student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.student.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-8 font-sans pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)]">
            {/* Header Banner */}
            <div className="bg-[#ffb800] p-6 sm:p-8 rounded-3xl text-slate-950 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-black rounded-full border border-slate-950/10">
                        <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                        <span>Enrolled & Contacted Students</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">My Active Students</h1>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium max-w-xl">
                        View contact details, enrolled subjects, and location info for students you are tutoring in Vijayawada.
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#ffb800] outline-none bg-slate-50/50"
                        placeholder="Search active students by name or email address..."
                    />
                </div>
                <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                    {filteredLeads.length} Students Active
                </span>
            </div>

            {/* Students Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-56 bg-slate-200/60 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : filteredLeads.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                    <Users className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="text-lg font-extrabold text-slate-900">No Connected Students Yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                        When you respond to tuition leads and mark them as &quot;Contacted&quot; or &quot;Assigned&quot;, students will show up here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLeads.map((lead) => {
                        let subjects: string[] = [];
                        try {
                            subjects = JSON.parse(lead.student.subjects || "[]");
                        } catch { }

                        return (
                            <div
                                key={lead.id}
                                className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                {/* Card Header */}
                                <div className="bg-[#ffb800] p-5 text-white relative">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                                            {lead.student.user.profilePhoto ? (
                                                <img src={lead.student.user.profilePhoto} alt={lead.student.user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-6 h-6 text-white" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-black text-white truncate">{lead.student.user.name}</h3>
                                            <p className="text-[11px] text-slate-800 flex items-center gap-1 font-medium truncate mt-0.5">
                                                <MapPin className="w-3 h-3 shrink-0 text-slate-950" />
                                                <span className="truncate">{lead.student.user.address.split(",")[0] || "Vijayawada"}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${lead.status === "CONVERTED" ? "bg-emerald-400 text-slate-950" : "bg-amber-300 text-slate-950"}`}>
                                        {lead.status === "CONVERTED" ? "Assigned" : "Contacted"}
                                    </span>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                            <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                                            <span className="truncate">{lead.student.user.email}</span>
                                        </div>

                                        {lead.student.user.phone && (
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>{lead.student.user.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Subjects Enrolled */}
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Requested Subjects</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {lead.subject ? (
                                                <span className="px-2.5 py-1 bg-amber-50 text-[#ffb800] border border-amber-200/60 rounded-lg text-xs font-extrabold">
                                                    {lead.subject}
                                                </span>
                                            ) : subjects.length > 0 ? (
                                                subjects.slice(0, 3).map((sub) => (
                                                    <span key={sub} className="px-2.5 py-1 bg-amber-50 text-[#ffb800] border border-amber-200/60 rounded-lg text-xs font-extrabold">
                                                        {sub}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-slate-400 font-medium">General Studies</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                                        {lead.student.user.phone ? (
                                            <a
                                                href={`tel:${lead.student.user.phone}`}
                                                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                            >
                                                <Phone className="w-3.5 h-3.5" />
                                                <span>Call</span>
                                            </a>
                                        ) : (
                                            <div className="py-2.5 px-3 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl text-center">No Phone</div>
                                        )}
                                        <a
                                            href={`mailto:${lead.student.user.email}?subject=Aacharya Academy - Class Follow-up`}
                                            className="py-2.5 px-3 bg-[#ffb800] hover:bg-[#ffa000] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                        >
                                            <Mail className="w-3.5 h-3.5" />
                                            <span>Email</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
