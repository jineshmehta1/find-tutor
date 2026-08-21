"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Users, FileText, TrendingUp, Clock, ArrowRight,
    AlertCircle, CheckCircle2, Loader2, Sparkles, BookOpen, ShieldCheck, Phone,
    MessageSquare, Eye, PhoneCall, ChevronRight, Star, Heart, Calendar, Play,
    User, Crown
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Lead {
    id: string;
    message: string | null;
    status: string;
    createdAt: string;
    subject?: string | null;
    classLevel?: string | null;
    location?: string | null;
    teacherId?: string | null;
    mode?: string | null;
    student: {
        user: {
            name: string;
            email: string;
            phone?: string;
        };
    };
}

export default function TeacherDashboard() {
    const { data: session } = useSession();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [isApproved, setIsApproved] = useState<boolean>(true);
    const [teacherId, setTeacherId] = useState<string | null>(null);

    const [messagesCount, setMessagesCount] = useState(0);
    const [callsCount, setCallsCount] = useState(0);
    const [profileViewsCount, setProfileViewsCount] = useState(0);
    const [reviewsCount, setReviewsCount] = useState(0);
    const [avgRating, setAvgRating] = useState(5.0);
    const [currentFormattedDate, setCurrentFormattedDate] = useState("");
    
    // Tab state
    const [activeTab, setActiveTab] = useState<"recent" | "open">("recent");

    useEffect(() => {
        const fetchAll = async () => {
            await Promise.all([
                fetchLeads(),
                fetchApprovalStatus(),
                fetchTeacherProfile()
            ]);
        };
        fetchAll();

        // Load messages from localStorage
        const savedChats = localStorage.getItem("teacher_chat_history");
        if (savedChats) {
            try {
                const list = JSON.parse(savedChats);
                if (Array.isArray(list)) {
                    let unreadCount = 0;
                    list.forEach((c: any) => {
                        const lastMsg = c.messages[c.messages.length - 1];
                        if (lastMsg && lastMsg.sender === "student") {
                            unreadCount++;
                        }
                    });
                    setMessagesCount(unreadCount);
                }
            } catch {}
        }

        // Load calls from localStorage
        const savedCalls = localStorage.getItem("teacher_call_history");
        if (savedCalls) {
            try {
                const list = JSON.parse(savedCalls);
                if (Array.isArray(list)) setCallsCount(list.length);
            } catch {}
        }

        // Profile views are database-backed and initialized to 0
        
        // Format current date dynamically
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        setCurrentFormattedDate(today.toLocaleDateString('en-GB', options));
    }, [session]);

    const fetchReviews = async (tId: string) => {
        try {
            const res = await fetch(`/api/review?pageKey=${tId}`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    const positive = data.filter((r: any) => r.rating >= 4).length;
                    setReviewsCount(positive);
                    
                    const sum = data.reduce((acc: number, r: any) => acc + r.rating, 0);
                    const avg = data.length ? sum / data.length : 5.0;
                    setAvgRating(parseFloat(avg.toFixed(1)));
                }
            }
        } catch {}
    };

    const fetchTeacherProfile = async () => {
        try {
            const res = await fetch("/api/students");
            if (res.ok) {
                const data = await res.json();
                if (data.teacher?.id) {
                    setTeacherId(data.teacher.id);
                    fetchReviews(data.teacher.id);
                    if (typeof data.teacher.views === "number") {
                        setProfileViewsCount(data.teacher.views);
                    }
                }
            }
        } catch {}
    };

    const fetchApprovalStatus = async () => {
        try {
            const res = await fetch("/api/teacher/subscription");
            if (res.ok) {
                const data = await res.json();
                if (typeof data.isApproved === "boolean") {
                    setIsApproved(data.isApproved);
                }
            }
        } catch { }
    };

    const fetchLeads = async () => {
        try {
            const res = await fetch("/api/leads?role=teacher");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setLeads(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter leads
    const directLeads = leads.filter(l => l.teacherId === teacherId);
    const openLeads = leads.filter(l => l.teacherId === null);

    // Fallback Mock data for leads as per screen mockup
    const mockRecentLeads = [
        {
            name: "Anita Mehta",
            role: "Parent",
            classLevel: "Class 8",
            subject: "Mathematics",
            board: "CBSE",
            type: "Home Tutor",
            initiated: "15 May, 10:30 AM",
            requestType: "Call Request",
            status: "New",
            statusColor: "bg-blue-50 text-blue-600 border-blue-100",
            icon: Phone
        },
        {
            name: "Rahul Kumar",
            role: "Parent",
            classLevel: "Class 10",
            subject: "Mathematics",
            board: "CBSE",
            type: "Online",
            initiated: "15 May, 09:15 AM",
            requestType: "Message",
            status: "Unread",
            statusColor: "bg-amber-50 text-amber-600 border-amber-100",
            icon: MessageSquare
        },
        {
            name: "Sneha Patel",
            role: "Student",
            classLevel: "Class 12",
            subject: "Maths (JEE)",
            board: "CBSE",
            type: "Home Tutor",
            initiated: "14 May, 08:45 PM",
            requestType: "Call Request",
            status: "Contacted",
            statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
            icon: Phone
        },
        {
            name: "Vijay Joseph",
            role: "Parent",
            classLevel: "Class 9",
            subject: "Mathematics",
            board: "ICSE",
            type: "Message",
            initiated: "14 May, 06:20 PM",
            requestType: "Message",
            status: "Replied",
            statusColor: "bg-purple-50 text-purple-600 border-purple-100",
            icon: MessageSquare
        },
        {
            name: "Neha Mishra",
            role: "Parent",
            classLevel: "Class 6",
            subject: "Mathematics",
            board: "State Board",
            type: "Home Tutor",
            initiated: "14 May, 04:10 PM",
            requestType: "Call Request",
            status: "New",
            statusColor: "bg-blue-50 text-blue-600 border-blue-100",
            icon: Phone
        }
    ];

    const mockOpenLeads = [
        {
            classLevel: "Class 11",
            subject: "Physics, Chemistry, Maths",
            board: "CBSE",
            type: "Home Tutor",
            schedule: "Weekdays Evening",
            location: "Gollapudi, Vijayawada",
            posted: "15 May, 11:20 AM",
            budget: "₹ 8,000 / month"
        },
        {
            classLevel: "Class 7",
            subject: "Mathematics & Science",
            board: "CBSE",
            type: "Online",
            schedule: "",
            location: "Vidyadharapuram, Vijayawada",
            posted: "15 May, 09:05 AM",
            budget: "₹ 4,000 / month"
        },
        {
            classLevel: "Class 9",
            subject: "Mathematics",
            board: "CBSE",
            type: "Home Tutor",
            schedule: "Saturday & Sunday",
            location: "Bhavanipuram, Vijayawada",
            posted: "14 May, 07:45 PM",
            budget: "₹ 3,500 / month"
        }
    ];

    const handleViewContact = () => {
        toast.info("Viewing lead details. Please subscribe to Premium to unlock direct contact numbers.");
    };

    return (
        <div className="space-y-6 pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)]">
            
            {/* Pending Approval Banner */}
            {!isApproved && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-5 flex items-start gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-amber-100/80 rounded-2xl flex items-center justify-center shrink-0">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-amber-900 text-sm">Account Pending Verification</h3>
                        <p className="text-xs text-amber-800/90 mt-1 font-medium leading-relaxed">
                            Your instructor profile is being reviewed by our Vijayawada center. Once verified, you will receive real-time notifications for nearby student tuition inquiries.
                        </p>
                    </div>
                </div>
            )}

            {/* Dashboard Welcome Header with Date Picker */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                        Welcome back, {session?.user?.name ? session.user.name.split(" ")[0] : "Rajesh"}! 👋
                    </h1>
                    <p className="text-xs text-slate-500 font-bold">
                        Here's what's happening with your profile today.
                    </p>
                </div>

                {/* Today Select Box */}
                <div className="relative shrink-0">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-black text-slate-700 cursor-default">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Today, {currentFormattedDate || "Loading..."}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT COLUMN: Stat row & Tables (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Stat Cards Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 lg:gap-4">
                        
                        {/* Card 1: Total Leads */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between h-[110px] hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="flex justify-between items-start">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Leads</div>
                                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <User className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="text-2xl font-black text-slate-900">{leads.length}</div>
                                <div className="text-[9px] text-emerald-500 font-extrabold flex items-center gap-0.5 mt-0.5">
                                    <span>↑ {leads.filter(l => l.status === "PENDING" || l.status === "NEW").length} new</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: New Leads */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between h-[110px] hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="flex justify-between items-start">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">New Leads</div>
                                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <FileText className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="text-2xl font-black text-slate-900">{leads.filter(l => l.status === "PENDING" || l.status === "NEW").length}</div>
                                <div className="text-[9px] text-emerald-500 font-extrabold flex items-center gap-0.5 mt-0.5">
                                    <span>active board queries</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Messages */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between h-[110px] hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="flex justify-between items-start">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Messages</div>
                                <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="text-2xl font-black text-slate-900">{messagesCount}</div>
                                <div className="text-[9px] text-amber-500 font-extrabold flex items-center gap-0.5 mt-0.5">
                                    <span>active chat threads</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 4: Call Requests */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between h-[110px] hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="flex justify-between items-start">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Call Requests</div>
                                <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                    <Phone className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="text-2xl font-black text-slate-900">{callsCount}</div>
                                <div className="text-[9px] text-emerald-500 font-extrabold flex items-center gap-0.5 mt-0.5">
                                    <span>calls scheduled</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 5: Profile Views */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between h-[110px] hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="flex justify-between items-start">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Profile Views</div>
                                <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center shrink-0">
                                    <Eye className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="text-2xl font-black text-slate-900">{profileViewsCount}</div>
                                <div className="text-[9px] text-emerald-500 font-extrabold flex items-center gap-0.5 mt-0.5">
                                    <span>total profile hits</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Table Card (Recent Leads) */}
                    <div className="bg-white rounded-3xl border border-slate-250/50 shadow-sm overflow-hidden">
                        
                        {/* Tab header toggles */}
                        <div className="flex items-center border-b border-slate-100 px-6 pt-4">
                            <button
                                onClick={() => setActiveTab("recent")}
                                className={cn(
                                    "px-4 pb-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer",
                                    activeTab === "recent"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-slate-400 hover:text-slate-600"
                                )}
                            >
                                Recent Leads
                            </button>
                            <button
                                onClick={() => setActiveTab("open")}
                                className={cn(
                                    "px-4 pb-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 cursor-pointer",
                                    activeTab === "open"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <span>Open Leads (Post Your Requirement)</span>
                                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center">{openLeads.length}</span>
                            </button>
                        </div>

                        {/* Recent Leads Tab Content */}
                        {activeTab === "recent" && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/40">
                                            <th className="px-6 py-3.5">Name & Details</th>
                                            <th className="px-6 py-3.5">Looking For</th>
                                            <th className="px-6 py-3.5">Initiated</th>
                                            <th className="px-6 py-3.5 text-center">Type</th>
                                            <th className="px-6 py-3.5">Status</th>
                                            <th className="px-6 py-3.5 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100/60">
                                        {directLeads.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-slate-450 font-black uppercase tracking-widest text-[10px]">
                                                    No direct lead enquiries yet. Update your location & availability settings to get matched!
                                                </td>
                                            </tr>
                                        ) : (
                                            directLeads.map((lead) => {
                                                const ReqIcon = lead.mode === "Online Tutor" ? MessageSquare : Phone;
                                                const initials = lead.student?.user?.name ? lead.student.user.name.split(" ").map(n => n[0]).join("") : "S";
                                                return (
                                                    <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors text-xs font-bold text-slate-700">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-[#ffb800]/10 text-slate-900 flex items-center justify-center text-[10px] font-black uppercase">
                                                                    {initials}
                                                                </div>
                                                                <div>
                                                                    <div className="font-extrabold text-slate-900">{lead.student?.user?.name || "Student"}</div>
                                                                    <div className="text-[10px] text-slate-400 font-bold mt-0.5">Parent</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <div className="text-slate-900">{lead.classLevel}  •  {lead.subject}</div>
                                                                <div className="text-[10px] text-slate-400 font-bold mt-0.5">CBSE  •  {lead.mode || "Home Tuition"}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <div className="text-slate-800">{new Date(lead.createdAt).toLocaleDateString()}</div>
                                                                <div className="text-[10px] text-slate-400 font-bold mt-0.5">{new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-slate-50 border border-slate-100 text-slate-500">
                                                                <ReqIcon className="w-3.5 h-3.5" />
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={cn(
                                                                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border leading-none",
                                                                lead.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                                lead.status === "CONTACTED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                                "bg-blue-50 text-blue-600 border-blue-100"
                                                            )}>
                                                                {lead.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button onClick={handleViewContact} className="px-3 py-1 bg-slate-100 hover:bg-[#ffb800] hover:text-slate-950 text-slate-700 font-black rounded-lg text-[10px] transition-colors uppercase tracking-wider cursor-pointer border border-none">
                                                                Contact
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Open Leads Tab Content */}
                        {activeTab === "open" && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/40">
                                            <th className="px-6 py-3.5">Requirement</th>
                                            <th className="px-6 py-3.5">Location</th>
                                            <th className="px-6 py-3.5">Posted On</th>
                                            <th className="px-6 py-3.5">Budget</th>
                                            <th className="px-6 py-3.5 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100/60">
                                        {openLeads.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-slate-450 font-black uppercase tracking-wider text-[10px]">
                                                    No open requirement leads posted yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            openLeads.slice(0, 4).map((lead) => (
                                                <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors text-xs font-bold text-slate-700">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="font-extrabold text-slate-900">{lead.classLevel}  •  {lead.subject}</div>
                                                            <div className="text-[10px] text-slate-400 font-bold mt-0.5">CBSE  •  {lead.mode || "Home Tuition"}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">{lead.location || "Vijayawada"}</td>
                                                    <td className="px-6 py-4 text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 text-slate-800 font-extrabold">{lead.message || "₹5,000/mo"}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button onClick={handleViewContact} className="px-4 py-1.5 bg-[#0a1829] hover:bg-amber-500 hover:text-slate-900 text-white font-extrabold rounded-lg text-[10px] transition-colors uppercase tracking-wider cursor-pointer border border-none">
                                                            View & Contact
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="p-4 border-t border-slate-100 text-center bg-slate-50/20">
                            <Link href="/teacher/leads" className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:underline uppercase tracking-wider">
                                <span>View All Leads</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                    </div>

                    {/* Open Leads (Post Your Requirement) Block */}
                    <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-wider">
                                    Open Leads (Post Your Requirement)
                                </h3>
                                <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[8px] font-black leading-none">{openLeads.length}</span>
                            </div>
                            <Link href="/teacher/leads" className="text-xs font-black text-blue-600 hover:underline uppercase tracking-wider flex items-center gap-1">
                                <span>View All Open Leads</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        <th className="pb-2">Requirement</th>
                                        <th className="pb-2">Location</th>
                                        <th className="pb-2">Posted On</th>
                                        <th className="pb-2">Budget</th>
                                        <th className="pb-2 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/60">
                                    {openLeads.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-6 text-center text-slate-450 font-black uppercase tracking-wider text-[10px]">
                                                No open requirement leads posted yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        openLeads.slice(0, 4).map((lead) => (
                                            <tr key={lead.id} className="text-xs font-bold text-slate-700">
                                                <td className="py-3.5 pr-4">
                                                    <div>
                                                        <div className="font-extrabold text-slate-900">{lead.classLevel}  •  {lead.subject}</div>
                                                        <div className="text-[10px] text-slate-450 mt-0.5">CBSE  •  {lead.mode || "Home Tuition"}</div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 text-slate-500 pr-4">{lead.location || "Vijayawada"}</td>
                                                <td className="py-3.5 text-slate-500 pr-4">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                                <td className="py-3.5 text-slate-800 font-extrabold pr-4">{lead.message || "₹5,000/mo"}</td>
                                                <td className="py-3.5 text-center">
                                                    <button onClick={handleViewContact} className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-extrabold rounded-xl text-[10px] transition-colors uppercase tracking-wider cursor-pointer">
                                                        View & Contact
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bottom banner details info */}
                    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-[11px] font-bold text-blue-700">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                        <span>Keep your profile updated and respond to leads quickly to get more students.</span>
                    </div>

                </div>

                {/* RIGHT COLUMN: Plan, Quick Actions & overview (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Subscription Plan Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 space-y-5 relative overflow-hidden">
                        
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                            <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                <Crown className="w-4 h-4 text-amber-500" /> Subscription Plan
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-extrabold text-slate-900">Premium Plan</h4>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1">Valid till 30 Jun 2026 (46 days left)</p>
                                </div>
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-wider leading-none">
                                    Active
                                </span>
                            </div>

                            <ul className="space-y-2.5 text-xs text-slate-600 font-bold">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>Unlimited Leads</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>Priority in Search Results</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>Direct Contact Access</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>Profile Boost</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>Post Requirement Access</span>
                                </li>
                            </ul>

                            <Link href="/teacher/subscription" className="block w-full py-3 bg-[#0a1829] hover:bg-[#122238] text-white font-extrabold text-center rounded-2xl text-[11px] transition-colors uppercase tracking-widest shadow-md">
                                View Plan Details
                            </Link>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 space-y-4">
                        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-3">
                            Quick Actions
                        </h3>
                        
                        <div className="space-y-2">
                            
                            {/* Action 1: Edit Profile */}
                            <Link href="/teacher/profile" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-900">Edit My Profile</h4>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">Update your profile & details</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </Link>

                            {/* Action 2: Manage Availability */}
                            <Link href="/teacher/availability" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-900">Manage Availability</h4>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">Set your available time slots</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </Link>

                            {/* Action 3: Boost Profile */}
                            <Link href="/teacher/subscription" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-900">Boost My Profile</h4>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">Get more visibility</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </Link>

                            {/* Action 4: View Profile */}
                            <Link href="/teacher/profile" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                        <Eye className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-900">View My Profile</h4>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">See how students see you</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </Link>

                        </div>
                    </div>

                    {/* This Month Overview Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 space-y-4">
                        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-3">
                            This Month Overview
                        </h3>

                        <div className="space-y-3">
                            
                            {/* Stats item 1 */}
                            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                        <Eye className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-450 font-bold">Profile Views</p>
                                        <p className="text-[12px] font-black text-slate-900 mt-0.5">{profileViewsCount}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-emerald-500 font-black">↑ 18%</span>
                            </div>

                            {/* Stats item 2 */}
                            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                                        <FileText className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-450 font-bold">Leads Received</p>
                                        <p className="text-[12px] font-black text-slate-900 mt-0.5">{leads.length}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-emerald-500 font-black">↑ 22%</span>
                            </div>

                            {/* Stats item 3 */}
                            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 bg-purple-50 text-purple-550 rounded-lg flex items-center justify-center shrink-0">
                                        <Phone className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-450 font-bold">Calls Received</p>
                                        <p className="text-[12px] font-black text-slate-900 mt-0.5">{callsCount}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-emerald-500 font-black">↑ 15%</span>
                            </div>

                            {/* Stats item 4 */}
                            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center shrink-0">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-450 font-bold">Messages Received</p>
                                        <p className="text-[12px] font-black text-slate-900 mt-0.5">{messagesCount}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-emerald-500 font-black">↑ 25%</span>
                            </div>

                            {/* Stats item 5 */}
                            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center shrink-0">
                                        <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500/10" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-450 font-bold">Positive Reviews</p>
                                        <p className="text-[12px] font-black text-slate-900 mt-0.5">{reviewsCount}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-orange-500 font-black flex items-center gap-0.5">
                                    ★ {avgRating}/5
                                </span>
                            </div>

                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}
