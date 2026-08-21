"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    LayoutDashboard, Users, User, LogOut, Menu, X, FileText,
    Crown, Clock, Sparkles, Home, Bell, Star, Calendar,
    MessageSquare, Upload, ChevronRight, Award, BarChart3, DollarSign,
    Phone, Settings, HelpCircle, BookMarked, BookOpen
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const sidebarGroups = [
    {
        label: "MAIN",
        items: [
            { label: "Dashboard",       href: "/teacher",              icon: LayoutDashboard },
            { label: "Leads",           href: "/teacher/leads",         icon: FileText },
            { label: "Messages",        href: "/teacher/messages",      icon: MessageSquare },
            { label: "Calls",           href: "/teacher/calls",         icon: Phone },
        ]
    },
    {
        label: "MANAGE",
        items: [
            { label: "Subjects & Classes", href: "/teacher/subjects",    icon: BookMarked },
            { label: "Location & Availability", href: "/teacher/availability", icon: Clock },
            { label: "Reviews & Ratings", href: "/teacher/reviews",     icon: Star },
            { label: "Students Taught", href: "/teacher/students",      icon: Users },
            { label: "Gallery & Videos", href: "/teacher/gallery",      icon: Upload },
            { label: "Documents",       href: "/teacher/documents",     icon: FileText },
        ]
    },
    {
        label: "BILLING & PLAN",
        items: [
            { label: "Subscription",    href: "/teacher/subscription",  icon: Crown },
            { label: "Payments & Invoices", href: "/teacher/payments",   icon: DollarSign },
            { label: "My Earnings",     href: "/teacher/earnings",      icon: DollarSign },
        ]
    },
    {
        label: "ACCOUNT",
        items: [
            { label: "Settings",        href: "/teacher/settings",      icon: Settings },
            { label: "Help & Support",  href: "/teacher/support",       icon: HelpCircle },
        ]
    }
];

interface SubscriptionData {
    hasAccess: boolean;
    status: string;
    isApproved: boolean;
    subscriptionEnd: string | null;
    daysRemaining: number;
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [leadsCount, setLeadsCount] = useState(0);

    useEffect(() => {
        const fetchProfilePhotoAndLeads = async () => {
            try {
                const res = await fetch("/api/students"); // queries user profile
                if (res.ok) {
                    const data = await res.json();
                    if (data.profilePhoto) setProfilePhoto(data.profilePhoto);
                }
            } catch { }

            try {
                const res = await fetch("/api/leads");
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) setLeadsCount(data.length);
                }
            } catch {}
        };
        
        fetchProfilePhotoAndLeads();
        fetchSubscription();

        const updateCounts = () => {
            // Load notifications from localStorage
            const savedNotifs = localStorage.getItem("teacher_notifications");
            if (savedNotifs) {
                try {
                    const list = JSON.parse(savedNotifs);
                    if (Array.isArray(list)) {
                        setUnreadNotificationsCount(list.filter((n: any) => !n.read).length);
                    }
                } catch {}
            } else {
                setUnreadNotificationsCount(0);
            }

            // Load chat history from localStorage
            const savedChats = localStorage.getItem("teacher_chat_history");
            if (savedChats) {
                try {
                    const list = JSON.parse(savedChats);
                    if (Array.isArray(list)) {
                        let unreadMessages = 0;
                        list.forEach((c: any) => {
                            const lastMsg = c.messages[c.messages.length - 1];
                            if (lastMsg && lastMsg.sender === "student") {
                                unreadMessages++;
                            }
                        });
                        setUnreadMessagesCount(unreadMessages);
                    }
                } catch {}
            } else {
                setUnreadMessagesCount(0);
            }
        };

        updateCounts();

        window.addEventListener("storage", updateCounts);
        return () => {
            window.removeEventListener("storage", updateCounts);
        };
    }, [pathname]);

    const getBadgeCount = (label: string) => {
        if (label === "Leads") return leadsCount > 0 ? leadsCount : null;
        if (label === "Messages") return unreadMessagesCount > 0 ? unreadMessagesCount : null;
        return null;
    };

    const fetchSubscription = async () => {
        try {
            const res = await fetch("/api/teacher/subscription");
            if (res.ok) {
                const data = await res.json();
                setSubscription(data);
            }
        } catch (error) {
            console.error("Failed to check subscription");
        }
    };

    // Determine current subpage title for top bar
    const getPageTitle = () => {
        if (pathname === "/teacher") return "Dashboard";
        if (pathname.startsWith("/teacher/leads")) return "Leads";
        if (pathname.startsWith("/teacher/messages")) return "Messages";
        if (pathname.startsWith("/teacher/calls")) return "Calls";
        if (pathname.startsWith("/teacher/enquiries")) return "My Enquiries";
        if (pathname.startsWith("/teacher/profile")) return "My Profile";
        if (pathname.startsWith("/teacher/subjects")) return "Subjects & Classes";
        if (pathname.startsWith("/teacher/availability")) return "Location & Availability";
        if (pathname.startsWith("/teacher/reviews")) return "Reviews & Ratings";
        if (pathname.startsWith("/teacher/students")) return "Students Taught";
        if (pathname.startsWith("/teacher/gallery")) return "Gallery & Videos";
        if (pathname.startsWith("/teacher/documents")) return "Documents";
        if (pathname.startsWith("/teacher/subscription")) return "Subscription";
        if (pathname.startsWith("/teacher/payments")) return "Payments & Invoices";
        if (pathname.startsWith("/teacher/earnings")) return "My Earnings";
        if (pathname.startsWith("/teacher/settings")) return "Settings";
        if (pathname.startsWith("/teacher/support")) return "Help & Support";
        return "Teacher Portal";
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-800">
            {/* Mobile Header Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0c1e35] text-white px-4 py-3 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white p-0.5 shadow-md flex items-center justify-center shrink-0">
                        <img src="/image.png" alt="Aacharya Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-extrabold text-sm tracking-tight">Aacharya Teacher</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl border border-white/15 transition-all"
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Backdrop for mobile sidebar */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm"
                />
            )}

            {/* Sidebar (Matching Flipkart/E-commerce Dark Navy Aesthetics) */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0a1829] text-slate-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col justify-between shadow-2xl border-r border-slate-900/40 h-screen shrink-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col flex-1 min-h-0">
                    {/* Brand Header with yellow bird icon */}
                    <div className="px-6 py-5 border-b border-slate-900/60 shrink-0">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-white p-0.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                                <img src="/image.png" alt="Aacharya Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[15px] font-black text-white leading-none tracking-wider font-sans uppercase">
                                    Aacharya
                                </span>
                                <span className="text-[8px] font-black text-slate-400 leading-none tracking-widest mt-1 uppercase">
                                    Find Tutors Nearby
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Nav Menu */}
                    <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                        {sidebarGroups.map((group) => (
                            <div key={group.label} className="space-y-1.5">
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] px-3">
                                    {group.label}
                                </div>
                                <div className="space-y-0.5">
                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold transition-all group",
                                                    isActive
                                                        ? "bg-[#1c324e] text-white shadow-inner border border-slate-700/30"
                                                        : "hover:bg-[#122238] hover:text-white"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-amber-400" : "text-slate-400 group-hover:text-slate-300")} />
                                                    <span className="truncate">{item.label}</span>
                                                </div>
                                                 {getBadgeCount(item.label) !== null && (
                                                     <span className={cn(
                                                         "px-1.5 py-0.5 rounded-full text-[9px] font-black leading-none",
                                                         isActive ? "bg-amber-400 text-slate-900" : "bg-red-500/80 text-white"
                                                     )}>
                                                         {getBadgeCount(item.label)}
                                                     </span>
                                                 )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Bottom section */}
                <div className="p-4 border-t border-slate-900/60 space-y-1 shrink-0">
                    <Link
                        href="/"
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-[#122238] hover:text-white transition-all"
                    >
                        <div className="flex items-center gap-2.5">
                            <Home className="w-4 h-4 text-slate-400" />
                            <span>Return to Website</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-900/20 hover:text-rose-350 rounded-xl transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Pane */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto mt-14 lg:mt-0">
                {/* Desktop Top Header Bar */}
                <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <Menu className="w-5 h-5 text-slate-500 cursor-pointer lg:hidden" />
                        <h2 className="text-[15px] font-black text-slate-800 uppercase tracking-tight">{getPageTitle()}</h2>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        {/* Notification Bell */}
                        <Link href="/teacher/notifications" className="relative cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors block">
                            <Bell className="w-5 h-5 text-slate-600" />
                            {unreadNotificationsCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none">
                                    {unreadNotificationsCount}
                                </span>
                            )}
                        </Link>

                        {/* Chat Messages */}
                        <Link href="/teacher/messages" className="relative cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors block">
                            <MessageSquare className="w-5 h-5 text-slate-600" />
                            {unreadMessagesCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none">
                                    {unreadMessagesCount}
                                </span>
                            )}
                        </Link>

                        {/* Divider */}
                        <div className="w-[1px] h-6 bg-slate-200" />

                        {/* Profile Info */}
                        <Link href="/teacher/settings" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
                            <div className="text-right">
                                <p className="text-xs font-black text-slate-900 leading-none">{session?.user?.name || "Rajesh Kumar"}</p>
                                <p className="text-[10px] text-slate-400 font-extrabold mt-1">Teacher</p>
                            </div>
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                                {profilePhoto ? (
                                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-[#ffb800] text-slate-950 font-black flex items-center justify-center text-xs uppercase">
                                        {session?.user?.name ? session.user.name.slice(0, 2) : "T"}
                                    </div>
                                )}
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Subpage View Container */}
                <div className="flex-1 bg-slate-50/50">
                    {children}
                </div>
            </main>
        </div>
    );
}
