"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    BookOpen, Users, Send, Calendar, Star,
    ArrowRight, Sparkles, GraduationCap, MapPin,
    Award, Phone, ChevronRight, Clock, TrendingUp,
    Bell, Loader2, ShieldCheck, RefreshCw, CheckCircle2,
    MessageSquare, Heart, Eye, Plus, Search, FileText, Target, Gift
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Teacher {
    id: string;
    name: string;
    email: string;
    phone: string;
    profilePhoto?: string;
    address: string;
    education: string;
    experience: string;
    subjects: any;
    teachingMode?: string;
    hourlyRate?: number;
    monthlyRate?: number;
}

interface Lead {
    id: string;
    subject: string | null;
    classLevel: string | null;
    location: string | null;
    status: string;
    createdAt: string;
    teacher?: {
        user: {
            name: string;
            profilePhoto?: string;
        }
    } | null;
}

export default function StudentDashboard() {
    const { data: session } = useSession();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    const [shortlistCount, setShortlistCount] = useState(0);
    const [messagesCount, setMessagesCount] = useState(0);
    const [children, setChildren] = useState<{ name: string; classLevel: string }[]>([]);
    const [classesCount, setClassesCount] = useState(0);

    const [showAddChildModal, setShowAddChildModal] = useState(false);
    const [newChildName, setNewChildName] = useState("");
    const [newChildClass, setNewChildClass] = useState("Class 6");

    useEffect(() => {
        fetchAll();
        loadLocalStorageData();
    }, []);

    const loadLocalStorageData = async () => {
        // Load localStorage data
        const savedShortlist = localStorage.getItem("shortlisted_tutors");
        if (savedShortlist) {
            try {
                const arr = JSON.parse(savedShortlist);
                if (Array.isArray(arr)) setShortlistCount(arr.length);
            } catch {}
        } else {
            setShortlistCount(0);
        }

        const savedChats = localStorage.getItem("student_chat_history");
        if (savedChats) {
            try {
                const arr = JSON.parse(savedChats);
                if (Array.isArray(arr)) setMessagesCount(arr.length);
            } catch {}
        } else {
            setMessagesCount(0);
        }

        try {
            const res = await fetch("/api/students");
            if (res.ok) {
                const data = await res.json();
                if (data.student?.children) {
                    try {
                        const arr = JSON.parse(data.student.children);
                        if (Array.isArray(arr)) {
                            setChildren(arr);
                            localStorage.setItem("student_children", JSON.stringify(arr));
                            return;
                        }
                    } catch {}
                }
            }
        } catch {}

        const savedChildren = localStorage.getItem("student_children");
        if (savedChildren) {
            try {
                const arr = JSON.parse(savedChildren);
                if (Array.isArray(arr)) setChildren(arr);
            } catch {}
        } else {
            const defaultChildren = [
                { name: "Aarav Sharma", classLevel: "Class 6" },
                { name: "Ananya Sharma", classLevel: "Class 3" }
            ];
            setChildren(defaultChildren);
            localStorage.setItem("student_children", JSON.stringify(defaultChildren));
        }
    };

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [teachersRes, leadsRes, classesRes] = await Promise.all([
                fetch("/api/teachers?approved=true"),
                fetch("/api/leads"),
                fetch("/api/teacher/classes"),
            ]);

            if (teachersRes.ok) {
                const d = await teachersRes.json();
                if (Array.isArray(d)) setTeachers(d);
            }

            if (leadsRes.ok) {
                const d = await leadsRes.json();
                if (Array.isArray(d)) setLeads(d);
            }

            if (classesRes.ok) {
                const d = await classesRes.json();
                if (Array.isArray(d)) setClassesCount(d.length);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddChildSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChildName.trim()) {
            toast.error("Please enter a name");
            return;
        }

        const updated = [...children, { name: newChildName, classLevel: newChildClass }];
        setChildren(updated);
        localStorage.setItem("student_children", JSON.stringify(updated));

        try {
            await fetch("/api/students", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ children: updated })
            });
            window.dispatchEvent(new Event("storage"));
        } catch (err) {
            console.error(err);
        }

        setNewChildName("");
        setShowAddChildModal(false);
        toast.success("Child profile added successfully!");
    };

    const handleShortlistToggle = (tutorId: string, name: string) => {
        const savedShortlist = localStorage.getItem("shortlisted_tutors");
        let list: string[] = [];
        if (savedShortlist) {
            try { list = JSON.parse(savedShortlist); } catch {}
        }

        if (list.includes(tutorId)) {
            list = list.filter(id => id !== tutorId);
            toast.success(`Removed ${name} from shortlist.`);
        } else {
            list.push(tutorId);
            toast.success(`Added ${name} to shortlist.`);
        }
        localStorage.setItem("shortlisted_tutors", JSON.stringify(list));
        setShortlistCount(list.length);
    };

    const isShortlisted = (tutorId: string) => {
        const savedShortlist = localStorage.getItem("shortlisted_tutors");
        if (savedShortlist) {
            try {
                const list = JSON.parse(savedShortlist);
                return Array.isArray(list) && list.includes(tutorId);
            } catch {}
        }
        return false;
    };

    const formatSubjects = (subjectsStr: string) => {
        try {
            const arr = JSON.parse(subjectsStr);
            if (Array.isArray(arr)) return arr.slice(0, 3).join(", ");
        } catch {}
        return subjectsStr;
    };

    // Format date utility
    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-GB", {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6 pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)]">
            
            {/* Main grid columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT MAIN AREA (8 Cols) */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Stats Metric Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 lg:gap-4">
                        
                        {/* Enquiries Sent */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                    <Send className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Enquiries Sent</span>
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <span className="text-2xl font-black text-slate-900">{leads.length}</span>
                                <Link href="/student/leads" className="text-[10px] font-black text-[#ffb800] hover:underline">View all</Link>
                            </div>
                        </div>

                        {/* Responses Received */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Responses</span>
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <span className="text-2xl font-black text-slate-900">
                                    {leads.filter(l => l.status !== "PENDING").length}
                                </span>
                                <Link href="/student/leads" className="text-[10px] font-black text-[#ffb800] hover:underline">View all</Link>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center shrink-0">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Messages</span>
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <span className="text-2xl font-black text-slate-900">{messagesCount}</span>
                                <Link href="/student/messages" className="text-[10px] font-black text-[#ffb800] hover:underline">View all</Link>
                            </div>
                        </div>

                        {/* Calls */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center shrink-0">
                                    <Phone className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Calls</span>
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <span className="text-2xl font-black text-slate-900">
                                    {leads.filter(l => l.status === "CONTACTED").length}
                                </span>
                                <Link href="/student/calls" className="text-[10px] font-black text-[#ffb800] hover:underline">View all</Link>
                            </div>
                        </div>

                        {/* Shortlisted */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center shrink-0">
                                    <Heart className="w-3.5 h-3.5 text-rose-550 fill-rose-550/10" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Shortlisted</span>
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <span className="text-2xl font-black text-slate-900">{shortlistCount}</span>
                                <Link href="/student/saved" className="text-[10px] font-black text-[#ffb800] hover:underline">View all</Link>
                            </div>
                        </div>

                    </div>

                    {/* Recent Enquiries table */}
                    <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-wider">
                                Recent Enquiries
                            </h3>
                            <Link href="/student/leads" className="text-xs font-black text-[#ffb800] hover:underline uppercase tracking-wider">
                                View All
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            {leads.length === 0 ? (
                                <div className="py-8 text-center text-slate-400 font-semibold text-xs space-y-2">
                                    <p>No active enquiries yet.</p>
                                    <Link href="/student/leads" className="text-blue-500 font-bold hover:underline">
                                        Post a Requirement Now
                                    </Link>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                                            <th className="pb-3">Subject / Activity</th>
                                            <th className="pb-3">Preferred Location</th>
                                            <th className="pb-3">Enquiry Date</th>
                                            <th className="pb-3">Status</th>
                                            <th className="pb-3">Assigned Tutor</th>
                                            <th className="pb-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100/60">
                                        {leads.slice(0, 4).map((enq) => (
                                            <tr key={enq.id} className="text-xs font-bold text-slate-700 hover:bg-slate-50/20 transition-colors">
                                                <td className="py-4 pr-4">
                                                    <div>
                                                        <div className="font-extrabold text-slate-900">{enq.subject}</div>
                                                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">{enq.classLevel || "General"}</div>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-slate-800 pr-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{enq.location || "Online"}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-slate-500 pr-4">{formatDate(enq.createdAt)}</td>
                                                <td className="py-4 pr-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border leading-none ${
                                                        enq.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                        enq.status === "CONTACTED" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                        enq.status === "CONVERTED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                        "bg-rose-50 text-rose-600 border-rose-100"
                                                    }`}>
                                                        {enq.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 pr-4">
                                                    {enq.teacher ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 shrink-0">
                                                                <img src={enq.teacher.user.profilePhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"} alt="Tutor avatar" className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="text-[10px] text-slate-900 font-black">{enq.teacher.user.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 text-[10px]">—</span>
                                                    )}
                                                </td>
                                                <td className="py-4 text-right">
                                                    <ChevronRight className="w-4 h-4 text-slate-300 inline" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Recommended for You tutor cards */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-wider">
                                    Recommended for You
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold leading-none">Based on your searches and preferences</p>
                            </div>
                            <Link href="/student/teachers" className="text-xs font-black text-[#ffb800] hover:underline uppercase tracking-wider">
                                View all
                            </Link>
                        </div>

                        {/* Grid: 4 columns for desktop */}
                        {teachers.length === 0 ? (
                            <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-8 text-center text-slate-400 font-semibold text-xs">
                                No tutors registered yet. Tutors will appear here once approved.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                {teachers.slice(0, 4).map((tutor) => (
                                    <div key={tutor.id} className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative group">
                                        
                                        {/* Unfilled heart icon on top right */}
                                        <button 
                                            onClick={() => handleShortlistToggle(tutor.id, tutor.name)} 
                                            className={`absolute top-3.5 right-3.5 w-6 h-6 rounded-full border border-slate-100 hover:bg-rose-50 hover:text-rose-500 transition-colors flex items-center justify-center cursor-pointer shadow-sm z-10 ${
                                                isShortlisted(tutor.id) ? "bg-rose-50 text-rose-500" : "bg-white/80 text-slate-400"
                                            }`}
                                        >
                                            <Heart className={`w-3.5 h-3.5 ${isShortlisted(tutor.id) ? "fill-rose-500" : ""}`} />
                                        </button>

                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shadow-sm mb-3">
                                                <img src={tutor.profilePhoto || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"} alt={tutor.name} className="w-full h-full object-cover" />
                                            </div>
                                            <h4 className="text-xs font-black text-slate-900">{tutor.name}</h4>
                                            <p className="text-[9px] text-slate-400 font-black mt-0.5 leading-none uppercase">Verified Tutor</p>

                                            <p className="text-[10px] text-slate-500 font-bold mt-3 leading-tight truncate w-full">
                                                {formatSubjects(tutor.subjects)}
                                            </p>
                                            
                                            <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold mt-2 leading-none">
                                                <MapPin className="w-3 h-3 text-slate-350 shrink-0" />
                                                <span className="truncate max-w-[120px]">{tutor.address}</span>
                                            </div>

                                            <p className="text-[10px] text-slate-500 font-black mt-2 leading-none">{tutor.experience} Experience</p>
                                            <p className="text-[10px] text-slate-850 font-black mt-2.5 leading-none">
                                                ₹ {tutor.hourlyRate || "400"} / hr
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-50">
                                            <Link href={`/tutor/${tutor.id}`} className="py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center">
                                                Profile
                                            </Link>
                                            <Link href={`/student/messages?tutor=${tutor.id}`} className="py-1.5 bg-[#0a1829] hover:bg-amber-500 hover:text-slate-900 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center">
                                                Message
                                            </Link>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CTA Post requirement Banner */}
                    <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
                        <div className="space-y-1 z-10">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Can't find the right tutor?</h4>
                            <p className="text-[10px] text-slate-500 font-bold">
                                Post your requirement and we will notify matching tutors and coaches.
                            </p>
                        </div>
                        <Link href="/student/leads" className="px-6 py-2.5 bg-[#0a1829] hover:bg-amber-500 hover:text-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 z-10">
                            <Plus className="w-3.5 h-3.5" /> Post Your Requirement
                        </Link>
                        {/* Illustration backdrop */}
                        <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none select-none">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-32 h-32 fill-current text-slate-650">
                                <circle cx="50" cy="50" r="40" />
                            </svg>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN SIDEBAR AREA (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Quick Actions Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 space-y-4">
                        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-3">
                            Quick Actions
                        </h3>

                        <div className="space-y-2">
                            
                            {/* Action 1: Find Tutors */}
                            <Link href="/student/teachers" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                        <Search className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-900">Find Tutors / Coaches</h4>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">Search by class, subject or activity</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </Link>

                            {/* Action 2: Post Requirement */}
                            <Link href="/student/leads" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                                        <Send className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-900">Post Your Requirement</h4>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">We'll notify matching tutors</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </Link>

                            {/* Action 3: Messages */}
                            <Link href="/student/messages" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-900">Message</h4>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">Chat with tutors / coaches</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </Link>

                            {/* Action 4: Demo Class */}
                            <Link href="/student/schedule" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-900">Booked Classes</h4>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">View scheduled sessions</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors font-bold" />
                            </Link>

                        </div>
                    </div>

                    {/* Recent Searches Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                            <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-slate-400" /> Recent Enquiries
                            </h3>
                        </div>

                        {leads.length === 0 ? (
                            <p className="text-[10px] text-slate-400 font-semibold text-center py-4">No recent queries found.</p>
                        ) : (
                            <div className="space-y-3">
                                {leads.slice(0, 4).map((enq) => (
                                    <div key={enq.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                                        <div className="w-6 h-6 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 border border-slate-100">
                                            <Clock className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-extrabold text-slate-850 leading-tight">{enq.subject}</h4>
                                            <p className="text-[9px] text-slate-400 font-bold mt-0.5">{enq.location || "Online"}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* My Children Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                            <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-wider">
                                My Children
                            </h3>
                            <Link href="/student/children" className="text-[10px] font-black text-[#ffb800] hover:underline uppercase tracking-wider">
                                Manage
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {children.map((child, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/20">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${
                                            idx % 2 === 0 ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
                                        }`}>
                                            {child.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-slate-900">{child.name}</h4>
                                            <p className="text-[9px] text-slate-400 font-bold mt-0.5">{child.classLevel}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => setShowAddChildModal(true)} className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-dashed border-slate-300 font-black rounded-xl text-[10px] transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer">
                            <Plus className="w-3.5 h-3.5" /> Add Child
                        </button>
                    </div>

                </div>

            </div>

            {/* Add Child Modal */}
            {showAddChildModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 relative">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Add Child Profile</h4>
                        <form onSubmit={handleAddChildSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-1.5">Child Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter full name"
                                    value={newChildName}
                                    onChange={(e) => setNewChildName(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-55 border border-slate-200 focus:outline-none focus:border-[#ffb800] rounded-xl text-xs font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-1.5">Class / Level</label>
                                <select
                                    value={newChildClass}
                                    onChange={(e) => setNewChildClass(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-55 border border-slate-200 focus:outline-none focus:border-[#ffb800] rounded-xl text-xs font-bold appearance-none cursor-pointer"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                                        <option key={n} value={`Class ${n}`}>Class {n}</option>
                                    ))}
                                    <option value="Pre-Primary">Pre-Primary</option>
                                    <option value="College">College / Professional</option>
                                    <option value="Hobby / Activity">Hobby / Activity</option>
                                </select>
                            </div>
                            <div className="flex gap-3 justify-end pt-2 border-t mt-4">
                                <button type="button" onClick={() => setShowAddChildModal(false)} className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-wider hover:bg-slate-50 rounded-lg">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 text-[10px] font-black text-white bg-[#0a1829] hover:bg-amber-500 hover:text-slate-900 rounded-xl uppercase tracking-wider">Save Child</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
