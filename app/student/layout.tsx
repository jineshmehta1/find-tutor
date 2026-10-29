"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    LayoutDashboard, Users, User, LogOut, Menu, X, FileText,
    Crown, Clock, Sparkles, Home, Bell, Star, Calendar,
    MessageSquare, Upload, ChevronRight, Award, BarChart3, DollarSign,
    Phone, Settings, HelpCircle, BookMarked, BookOpen, Send, Heart, CreditCard, Gift, MapPin, Globe
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface StudentSidebarItem {
    label: string;
    href: string;
    icon: any;
    badge?: number;
    isLogout?: boolean;
}

const sidebarItems: StudentSidebarItem[] = [
    { label: "Visit Website",          href: "/",                        icon: Home },
    { label: "Dashboard",             href: "/student",                 icon: LayoutDashboard },
    { label: "Find Tutors / Coaches",  href: "/student/teachers",        icon: Users },
    { label: "Post Your Requirement", href: "/student/leads",           icon: Send },
    { label: "My Enquiries",          href: "/student/enquiries",       icon: FileText, badge: 8 },
    { label: "Messages",              href: "/student/messages",        icon: MessageSquare, badge: 12 },
    { label: "Call History",          href: "/student/calls",           icon: Phone },
    { label: "Saved Tutors / Coaches",href: "/student/saved",           icon: Heart, badge: 6 },
    { label: "Booked Classes",         href: "/student/schedule",        icon: Calendar },
    { label: "My Children",           href: "/student/children",        icon: User },
    { label: "Payments & Invoices",    href: "/student/billing",         icon: CreditCard },
    { label: "Reviews Given",          href: "/student/reviews",         icon: Star },
    { label: "Settings",              href: "/student/settings",        icon: Settings },
    { label: "Help & Support",        href: "/student/support",         icon: HelpCircle },
    { label: "Sign Out",              href: "#logout",                 icon: LogOut, isLogout: true }
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [leadsCount, setLeadsCount] = useState(0);
    const [shortlistCount, setShortlistCount] = useState(0);

    useEffect(() => {
        const fetchProfilePhotoAndLeads = async () => {
            try {
                const res = await fetch("/api/students");
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

        const updateCounts = () => {
            // Load notifications from localStorage
            const savedNotifs = localStorage.getItem("student_notifications");
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
            const savedChats = localStorage.getItem("student_chat_history");
            if (savedChats) {
                try {
                    const list = JSON.parse(savedChats);
                    if (Array.isArray(list)) {
                        // Let's count unread messages: messages from tutor
                        let unreadMessages = 0;
                        list.forEach((c: any) => {
                            // Simple logic: if the last message is from the tutor, mark as unread message thread
                            const lastMsg = c.messages[c.messages.length - 1];
                            if (lastMsg && lastMsg.sender === "tutor") {
                                unreadMessages++;
                            }
                        });
                        setUnreadMessagesCount(unreadMessages);
                    }
                } catch {}
            } else {
                setUnreadMessagesCount(0);
            }

            // Load shortlisted count
            const savedShortlist = localStorage.getItem("shortlisted_tutors");
            if (savedShortlist) {
                try {
                    const list = JSON.parse(savedShortlist);
                    if (Array.isArray(list)) setShortlistCount(list.length);
                } catch {}
            } else {
                setShortlistCount(0);
            }
        };

        updateCounts();

        // Listen for storage events to update counts reactively across components
        window.addEventListener("storage", updateCounts);
        return () => {
            window.removeEventListener("storage", updateCounts);
        };
    }, [pathname]);

    const getBadgeCount = (label: string) => {
        if (label === "My Enquiries") return leadsCount > 0 ? leadsCount : null;
        if (label === "Messages") return unreadMessagesCount > 0 ? unreadMessagesCount : null;
        if (label === "Saved Tutors / Coaches") return shortlistCount > 0 ? shortlistCount : null;
        return null;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-800">
            {/* Mobile Header Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0c1e35] text-white px-4 py-3 flex items-center justify-between shadow-md">
                <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-white p-0.5 shadow-md flex items-center justify-center shrink-0">
                        <img src="/image.png" alt="Aacharya Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-extrabold text-sm tracking-tight">Aacharya Academy</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-xl border border-white/15 flex items-center gap-1.5 transition-colors"
                        title="Go to Website"
                    >
                        <Globe className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-black uppercase tracking-wider">Website</span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-white hover:bg-white/10 p-2 rounded-xl border border-white/20 transition-all min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
                        aria-label="Toggle Navigation"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm"
                />
            )}

            {/* Sidebar (Matching Mockup Flipkart Navy Theme) */}
            <aside className={cn(
                "fixed lg:static top-14 lg:top-0 bottom-0 left-0 z-40 w-64 bg-[#0a1829] text-slate-350 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col justify-between shadow-2xl border-r border-slate-900/40 h-[calc(100dvh-3.5rem)] lg:h-screen shrink-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col flex-1 min-h-0">
                    {/* Brand Header */}
                    <div className="px-6 py-5 border-b border-slate-900/60 shrink-0 hidden lg:block">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-white p-0.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                                <img src="/image.png" alt="Aacharya Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[15px] font-black text-white leading-none tracking-wider font-sans uppercase">
                                    Aacharya Academy
                                </span>
                                <span className="text-[8px] font-black text-slate-400 leading-none tracking-widest mt-1 uppercase">
                                    Find Home Tutors Nearby
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* User Profile Bar for Mobile Sidebar */}
                    <div className="px-4 py-3 bg-[#0d2037] border-b border-slate-900/60 lg:hidden flex items-center gap-3 shrink-0">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                            {profilePhoto ? (
                                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-[#ffb800] text-slate-950 font-black flex items-center justify-center text-xs uppercase">
                                    {session?.user?.name ? session.user.name.slice(0, 2) : "S"}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-white truncate">{session?.user?.name || "Student"}</p>
                            <p className="text-[10px] text-slate-400 font-semibold truncate">Student Account</p>
                        </div>
                    </div>

                    {/* Nav Items list */}
                    <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            if (item.isLogout) {
                                return (
                                    <button
                                        key={item.label}
                                        type="button"
                                        onClick={() => {
                                            setIsOpen(false);
                                            signOut({ callbackUrl: "/login" });
                                        }}
                                        className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-[12px] font-bold text-rose-400 hover:bg-rose-500/15 hover:text-rose-350 transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-4 h-4 shrink-0 text-rose-400 group-hover:text-rose-300" />
                                            <span className="truncate">{item.label}</span>
                                        </div>
                                    </button>
                                );
                            }

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold transition-all group",
                                        isActive
                                            ? "bg-[#fffbeb] text-amber-900 border border-amber-200/40 shadow-sm"
                                            : "text-slate-200 hover:bg-[#122238] hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-amber-600" : "text-slate-400 group-hover:text-slate-350")} />
                                        <span className="truncate">{item.label}</span>
                                    </div>
                                    {getBadgeCount(item.label) !== null && (
                                        <span className={cn(
                                            "px-1.5 py-0.5 rounded-full text-[9px] font-black leading-none",
                                            isActive ? "bg-amber-600 text-white" : "bg-red-500 text-white"
                                        )}>
                                            {getBadgeCount(item.label)}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Invite & Earn card at sidebar bottom */}
                <div className="p-4 border-t border-slate-900/60 shrink-0 bg-[#0a1829]">
                    <div className="bg-[#122238]/60 border border-[#213550] rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden group shadow-md mb-3">
                        {/* Gift Illustration */}
                        <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mb-3 animate-pulse">
                            <Gift className="w-6 h-6" />
                        </div>
                        
                        <h4 className="text-[11px] font-black text-white uppercase tracking-wider">Invite & Earn</h4>
                        <p className="text-[9px] text-slate-400 font-bold mt-1 leading-relaxed">
                            Invite friends and earn exciting rewards!
                        </p>
                        
                        <button className="w-full mt-3 py-1.5 bg-white hover:bg-slate-50 text-slate-950 font-black rounded-xl text-[9px] transition-colors uppercase tracking-wider border border-none cursor-pointer">
                            Invite Now
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false);
                            signOut({ callbackUrl: "/login" });
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-900/20 hover:text-rose-350 rounded-xl transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main view container */}
            <main className="flex-1 flex flex-col min-w-0 h-[calc(100dvh-3.5rem)] lg:h-screen overflow-y-auto mt-14 lg:mt-0">
                {/* Desktop Top Header Bar (Matching mock) */}
                <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 shrink-0">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Menu className="w-5 h-5 text-slate-500 cursor-pointer lg:hidden" />
                            <h2 className="text-[16px] font-black text-slate-900 uppercase tracking-tight">Dashboard</h2>
                        </div>
                        <p className="text-[11px] text-slate-450 font-bold leading-none">
                            Welcome back, {session?.user?.name || "Priya Sharma"}! Find the best teachers and coaches for your child.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Go to Website Button */}
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-bold shadow-sm"
                        >
                            <Globe className="w-3.5 h-3.5 text-amber-500" />
                            <span>Go to Website</span>
                        </Link>

                        {/* Location picker */}
                        <div className="flex items-center gap-2 text-slate-700">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <div className="text-[11px] font-bold">
                                <span>Bhavanipuram, Vijayawada</span>
                                <button className="text-blue-500 hover:underline ml-1.5 cursor-pointer font-black border-none bg-transparent p-0">Change</button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-[1px] h-5 bg-slate-200" />

                        {/* Notification Bell */}
                        <Link href="/student/notifications" className="relative cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors block">
                            <Bell className="w-5 h-5 text-slate-600" />
                            {unreadNotificationsCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none">
                                    {unreadNotificationsCount}
                                </span>
                            )}
                        </Link>

                        {/* Chat Messages */}
                        <Link href="/student/messages" className="relative cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors block">
                            <MessageSquare className="w-5 h-5 text-slate-600" />
                            {unreadMessagesCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none">
                                    {unreadMessagesCount}
                                </span>
                            )}
                        </Link>

                        {/* Divider */}
                        <div className="w-[1px] h-5 bg-slate-200" />

                        {/* Profile Info */}
                        <Link href="/student/settings" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                                {profilePhoto ? (
                                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-[#ffb800] text-slate-950 font-black flex items-center justify-center text-xs uppercase">
                                        {session?.user?.name ? session.user.name.split(" ").map(n => n[0]).join("") : "S"}
                                    </div>
                                )}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-black text-slate-900 leading-none">{session?.user?.name || "Priya Sharma"}</p>
                                <p className="text-[10px] text-slate-400 font-extrabold mt-1">Parent</p>
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Content Pane */}
                <div className="flex-1 bg-slate-50/50">
                    {children}
                </div>
            </main>
        </div>
    );
}
