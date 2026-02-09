"use client";

import { useState, useEffect } from "react";
import { Users, Search, Mail, Phone, MapPin, User, Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface Lead {
    id: string;
    status: string;
    createdAt: string;
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
            toast.error("Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = leads.filter((lead) => {
        return lead.student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.student.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">My Students</h1>
                <p className="text-slate-500 mt-1">Students you&apos;ve connected with</p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        placeholder="Search by name or email..."
                    />
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-slate-500">
                    Showing <span className="font-semibold text-slate-900">{filteredLeads.length}</span> students
                </p>
            </div>

            {/* Students Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
            ) : filteredLeads.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No Students Yet</h3>
                    <p className="text-slate-500">
                        Students you&apos;ve contacted or converted will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLeads.map((lead) => {
                        const subjects = JSON.parse(lead.student.subjects || "[]");
                        return (
                            <div
                                key={lead.id}
                                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all"
                            >
                                {/* Profile Header */}
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden">
                                            {lead.student.user.profilePhoto ? (
                                                <img src={lead.student.user.profilePhoto} alt={lead.student.user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-7 h-7 text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">{lead.student.user.name}</h3>
                                            <p className="text-blue-100 text-sm flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {lead.student.user.address.split(",")[0]}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    {/* Contact Info */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <span className="truncate">{lead.student.user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <span>{lead.student.user.phone}</span>
                                        </div>
                                    </div>

                                    {/* Subjects */}
                                    {subjects.length > 0 && (
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Interested In</p>
                                            <div className="flex flex-wrap gap-1">
                                                {subjects.slice(0, 3).map((subject: string) => (
                                                    <span key={subject} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                                                        {subject}
                                                    </span>
                                                ))}
                                                {subjects.length > 3 && (
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs">
                                                        +{subjects.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="pt-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${lead.status === "CONVERTED" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                            }`}>
                                            {lead.status === "CONVERTED" ? "Active Student" : "In Contact"}
                                        </span>
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
