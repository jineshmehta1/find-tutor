"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Users, Search, Mail, Phone, MapPin, User, Loader2,
    CheckCircle2, Clock, X, MessageCircle, BookOpen, GraduationCap, Home, Sparkles, Filter, CheckCircle, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

interface Lead {
    id: string;
    message: string | null;
    location: string | null;
    subject: string | null;
    classLevel: string | null;
    mode: string | null;
    status: string;
    createdAt: string;
    contactCount?: number;
    hasContacted?: boolean;
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
            role?: string;
        };
    };
    teacher?: {
        id: string;
        user?: {
            id: string;
            name: string;
            email: string;
        };
    } | null;
}

function getLeadDisplayInfo(lead: Lead, sessionUser?: { name?: string | null; email?: string | null }) {
    let parentName = "";
    let studentName = "";

    if (lead.message) {
        // Matches "Parent / Contact: Name", "Parent: Name", "Contact: Name"
        const pMatch = lead.message.match(/(?:Parent(?:\s*\/\s*Contact)?|Contact)\s*:\s*([^|.\n]+)/i);
        if (pMatch && pMatch[1]?.trim()) parentName = pMatch[1].trim();

        // Matches "Student: Name", "Student Name: Name"
        const sMatch = lead.message.match(/Student(?:\s*Name)?\s*:\s*([^|.\n]+)/i);
        if (sMatch && sMatch[1]?.trim()) studentName = sMatch[1].trim();
    }

    const teacherName = (lead.teacher?.user?.name || sessionUser?.name || "").trim().toLowerCase();
    const teacherEmail = (lead.teacher?.user?.email || sessionUser?.email || "").trim().toLowerCase();
    const studentUserName = (lead.student?.user?.name || "").trim();
    const isTeacherName = studentUserName && teacherName && (studentUserName.toLowerCase() === teacherName || teacherName.includes(studentUserName.toLowerCase()));

    let primaryName = studentName || parentName;
    if (!primaryName) {
        // Avoid showing teacher's name as student name
        if (studentUserName && !isTeacherName && !studentUserName.toLowerCase().startsWith("dr.") && !studentUserName.toLowerCase().includes("teacher")) {
            primaryName = studentUserName;
        } else {
            primaryName = "Student / Parent Contact";
        }
    }

    // Determine contact email safely (do NOT display teacher's email or dummy system email)
    const rawEmail = (lead.student?.user?.email || "").trim();
    const isTeacherEmail = teacherEmail && rawEmail.toLowerCase() === teacherEmail;
    const isDummyEmail = rawEmail.toLowerCase().includes("@aacharya.net") || rawEmail.toLowerCase().includes("anonymous");
    const displayEmail = (!isTeacherEmail && !isDummyEmail && rawEmail) ? rawEmail : "";

    // Contact phone
    const displayPhone = lead.student?.user?.phone && lead.student.user.phone !== "0000000000" ? lead.student.user.phone : "";

    return {
        displayName: primaryName,
        parentName: parentName || (primaryName !== studentName && primaryName !== "Student / Parent Contact" ? primaryName : ""),
        studentName: studentName || (primaryName !== "Student / Parent Contact" ? primaryName : ""),
        displayEmail,
        displayPhone,
    };
}

export default function TeacherLeadsPage() {
    const { data: session } = useSession();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await fetch("/api/leads?role=teacher");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setLeads(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    };

    const handleContactLead = async (leadId: string) => {
        // Optimistic UI update
        setLeads((prev) =>
            prev.map((l) => {
                if (l.id !== leadId) return l;
                const nextCount = l.hasContacted ? (l.contactCount ?? 0) : (l.contactCount ?? 0) + 1;
                return {
                    ...l,
                    hasContacted: true,
                    contactCount: nextCount,
                };
            })
        );

        if (selectedLead && selectedLead.id === leadId) {
            setSelectedLead((prev) =>
                prev
                    ? {
                          ...prev,
                          hasContacted: true,
                          contactCount: prev.hasContacted ? (prev.contactCount ?? 0) : (prev.contactCount ?? 0) + 1,
                      }
                    : null
            );
        }

        try {
            const res = await fetch("/api/leads", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, status: "CONTACTED" }),
            });
            if (res.ok) {
                const data = await res.json();
                if (typeof data.contactCount === "number") {
                    setLeads((prev) =>
                        prev.map((l) =>
                            l.id === leadId
                                ? { ...l, contactCount: data.contactCount, hasContacted: true }
                                : l
                        )
                    );
                    if (selectedLead && selectedLead.id === leadId) {
                        setSelectedLead((prev) =>
                            prev ? { ...prev, contactCount: data.contactCount, hasContacted: true } : null
                        );
                    }
                }
            }
        } catch (error) {
            console.error("Error recording lead contact:", error);
        }
    };

    const updateLeadStatus = async (leadId: string, status: string) => {
        setUpdating(true);
        try {
            const res = await fetch("/api/leads", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, status }),
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Lead status updated successfully!");
            await fetchLeads();
            setSelectedLead(null);
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const filteredLeads = leads.filter((lead) => {
        const contact = getLeadDisplayInfo(lead, session?.user);
        const matchesSearch = contact.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (contact.displayEmail && contact.displayEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (lead.subject && lead.subject.toLowerCase().includes(searchTerm.toLowerCase()));

        let matchesStatus = true;
        if (statusFilter === "ACTIVE") {
            matchesStatus = lead.status !== "CONVERTED" && lead.status !== "REJECTED";
        } else if (statusFilter === "MY_CONTACTED") {
            matchesStatus = Boolean(lead.hasContacted);
        } else if (statusFilter !== "ALL") {
            matchesStatus = lead.status === statusFilter;
        }

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 font-sans pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)]">
            {/* Header Banner */}
            <div className="bg-[#ffb800] p-6 sm:p-8 rounded-3xl text-slate-950 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-black rounded-full border border-slate-950/10">
                        <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                        <span>Student Inquiries Desk</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Student Tuition Leads</h1>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium max-w-xl">
                        Review parent inquiries in Vijayawada, contact students directly, and update application status.
                    </p>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="relative md:col-span-8">
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#ffb800] outline-none bg-slate-50/50"
                        placeholder="Search leads by student name, email, or subject..."
                    />
                </div>

                <div className="md:col-span-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#ffb800] outline-none bg-slate-50/50 cursor-pointer"
                    >
                        <option value="ALL">All Application Status</option>
                        <option value="ACTIVE">Active Tuition Requests</option>
                        <option value="MY_CONTACTED">Leads I Contacted</option>
                        <option value="CONVERTED">Assigned Tutor</option>
                        <option value="REJECTED">Closed</option>
                    </select>
                </div>
            </div>

            {/* Leads Count Bar */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
                <span>Showing {filteredLeads.length} student leads</span>
                <span className="text-[#ffb800]">0% Commission Markup</span>
            </div>

            {/* Leads List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-slate-200/60 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : filteredLeads.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                    <Users className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="text-lg font-extrabold text-slate-900">No Student Leads Match</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                        {leads.length === 0
                            ? "Student tuition requests submitted for your subjects will appear here."
                            : "No leads match your current search query or filter selection."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredLeads.map((lead) => {
                        const contact = getLeadDisplayInfo(lead, session?.user);
                        return (
                        <div
                            key={lead.id}
                            onClick={() => setSelectedLead(lead)}
                            className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 hover:shadow-md transition-all cursor-pointer space-y-4"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#ffb800] flex items-center justify-center font-bold shrink-0 overflow-hidden border border-amber-200/60">
                                        {lead.student.user.profilePhoto ? (
                                            <img src={lead.student.user.profilePhoto} alt={contact.displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-6 h-6 text-[#ffb800]" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                                            {contact.displayName}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {contact.parentName && contact.parentName !== contact.displayName && (
                                                <span className="text-[11px] font-bold text-slate-500">
                                                    Parent: {contact.parentName}
                                                </span>
                                            )}
                                            <p className="text-xs font-bold text-[#ffb800]">
                                                Requested: {lead.subject || "General Tuition"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="self-start sm:self-auto flex items-center gap-2">
                                    {lead.status === "CONVERTED" ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Assigned Tutor
                                        </span>
                                    ) : lead.status === "REJECTED" ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-red-600 border border-red-200/60">
                                            <X className="w-3.5 h-3.5" />
                                            Closed
                                        </span>
                                    ) : (
                                        <>
                                            {contact.displayPhone ? (
                                                <a
                                                    href={`https://wa.me/91${contact.displayPhone.replace(/\D/g, "").slice(-10)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => { e.stopPropagation(); handleContactLead(lead.id); }}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-[#0a1829] text-white hover:bg-slate-800 transition-colors shadow-sm"
                                                >
                                                    <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                                                    Message
                                                </a>
                                            ) : null}
                                            {contact.displayPhone && (
                                                <a
                                                    href={`tel:${contact.displayPhone}`}
                                                    onClick={(e) => { e.stopPropagation(); handleContactLead(lead.id); }}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-400 text-slate-900 hover:bg-amber-500 transition-colors shadow-sm"
                                                >
                                                    <Phone className="w-3.5 h-3.5" />
                                                    Call
                                                </a>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Tutors Contacted Count Badge & You Contacted indicator */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50/90 text-slate-800 border border-amber-200">
                                    <Users className="w-3.5 h-3.5 text-amber-600" />
                                    <span>number of tutors contacted: <strong className="text-slate-950 font-black">{String(lead.contactCount ?? 0).padStart(2, "0")}</strong></span>
                                </span>
                                {lead.hasContacted && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
                                        <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                                        <span>You contacted</span>
                                    </span>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
                                {lead.classLevel && (
                                    <span className="px-3 py-1 bg-slate-100 rounded-lg flex items-center gap-1">
                                        <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                                        {lead.classLevel}
                                    </span>
                                )}
                                {lead.mode && (
                                    <span className="px-3 py-1 bg-amber-50 text-[#ffb800] border border-amber-200/60 rounded-lg flex items-center gap-1">
                                        <Home className="w-3.5 h-3.5" />
                                        {lead.mode}
                                    </span>
                                )}
                                {lead.location && (
                                    <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-lg flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                                        {lead.location}
                                    </span>
                                )}
                            </div>

                            {/* Message */}
                            {lead.message && (
                                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium">
                                    &ldquo;{lead.message}&rdquo;
                                </p>
                            )}

                            {/* Actions & Footer */}
                            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-4 text-slate-500 font-bold">
                                    <span className="flex items-center gap-1">
                                        Status: <span className="text-slate-700 uppercase">{lead.status === "CONVERTED" ? "ASSIGNED" : lead.status === "REJECTED" ? "CLOSED" : "ACTIVE"}</span>
                                    </span>
                                </div>
                                <span className="text-[11px] font-bold text-slate-400">
                                    Posted {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                            </div>
                        </div>
                    );})}
                </div>
            )}

            {/* Lead Detail & Status Modal */}
            {selectedLead && (() => {
                const contact = getLeadDisplayInfo(selectedLead, session?.user);
                return (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#ffb800] flex items-center justify-center font-bold shrink-0 overflow-hidden">
                                    {selectedLead.student.user.profilePhoto ? (
                                        <img src={selectedLead.student.user.profilePhoto} alt={contact.displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5 text-[#ffb800]" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-slate-900">{contact.displayName}</h3>
                                    <p className="text-xs text-slate-500 font-medium">
                                        {contact.parentName && contact.parentName !== contact.displayName ? `Parent: ${contact.parentName} • ` : ""}
                                        {contact.displayEmail ? contact.displayEmail : (contact.displayPhone ? `Ph: ${contact.displayPhone}` : "Parent Inquiry")}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedLead(null)} className="p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Contact Count & Status in Modal */}
                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-amber-50/70 border border-amber-200/70 rounded-2xl">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-amber-600" />
                                <span className="text-xs font-bold text-slate-800">
                                    number of tutors contacted: <strong className="text-slate-950 font-black text-sm">{String(selectedLead.contactCount ?? 0).padStart(2, "0")}</strong>
                                </span>
                            </div>
                            {selectedLead.hasContacted && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                                    <CheckCircle className="w-3 h-3 text-blue-600" />
                                    <span>You contacted</span>
                                </span>
                            )}
                        </div>

                        {/* Contact Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            {contact.displayPhone ? (
                                <a
                                    href={`tel:${contact.displayPhone}`}
                                    onClick={() => handleContactLead(selectedLead.id)}
                                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span>Call Parent</span>
                                </a>
                            ) : (
                                <div className="py-3 px-4 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl text-center">No Phone Provided</div>
                            )}

                            {contact.displayPhone ? (
                                <a
                                    href={`https://wa.me/91${contact.displayPhone.replace(/\D/g, "").slice(-10)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => handleContactLead(selectedLead.id)}
                                    className="py-3 px-4 bg-[#ffb800] hover:bg-[#ffa000] text-slate-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Message on WA</span>
                                </a>
                            ) : (
                                <div className="py-3 px-4 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl text-center">No WhatsApp Available</div>
                            )}
                        </div>

                        {/* Requirement Info */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs font-bold text-slate-700">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Subject:</span>
                                <span>{selectedLead.subject || "General Tuition"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Grade Level:</span>
                                <span>{selectedLead.classLevel || "Standard"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Tuition Mode:</span>
                                <span>{selectedLead.mode || "Home Tuition"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Location:</span>
                                <span className="truncate max-w-[200px]">{selectedLead.location || selectedLead.student.user.address}</span>
                            </div>
                        </div>

                        {/* Message */}
                        {selectedLead.message && (
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Student Notes</label>
                                <p className="text-xs text-slate-700 bg-amber-50/60 p-3 rounded-2xl border border-amber-200/60 font-medium">
                                    &ldquo;{selectedLead.message}&rdquo;
                                </p>
                            </div>
                        )}

                        {/* Update Status Buttons */}
                        <div className="pt-2 border-t border-slate-100">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Update Application Status</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => updateLeadStatus(selectedLead.id, "CONVERTED")}
                                    disabled={updating}
                                    className="py-2.5 px-3 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-xl text-xs font-extrabold hover:bg-emerald-100 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    Assigned Tutor
                                </button>
                                <button
                                    onClick={() => updateLeadStatus(selectedLead.id, "REJECTED")}
                                    disabled={updating}
                                    className="py-2.5 px-3 bg-rose-50 text-rose-700 border border-rose-200/60 rounded-xl text-xs font-extrabold hover:bg-rose-100 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    Close Lead
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );})()}
        </div>
    );
}
