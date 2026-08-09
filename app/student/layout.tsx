"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
    LayoutDashboard, Users, User, LogOut, Menu, X,
    Calendar, Send, Home, Bell, Star, TrendingUp, ChevronRight, MessageSquare,
    FileText, Target, BookOpen, CreditCard
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const sidebarGroups = [
    {
        label: "My Learning",
        items: [
            { label: "Dashboard",       href: "/student",               icon: LayoutDashboard, badge: "Home" },
            { label: "Find Tutors",     href: "/student/teachers",      icon: Users,           badge: "Live" },
            { label: "Tutor Requests",  href: "/student/leads",         icon: Send },
            { label: "Class Timetable", href: "/student/schedule",      icon: Calendar },
            { label: "Progress Log",    href: "/student/progress",      icon: TrendingUp },
        ]
    },
    {
        label: "Practice & Files",
        items: [
            { label: "Practice Hub",    href: "/student/practice",      icon: BookOpen },
            { label: "Study Files",     href: "/student/resources",     icon: FileText },
            { label: "My Goals",        href: "/student/goals",         icon: Target },
        ]
    },
    {
        label: "Activity",
        items: [
            { label: "Events & Camps",  href: "/student/events",        icon: Calendar },
            { label: "My Reviews",      href: "/student/reviews",       icon: Star },
            { label: "Notifications",   href: "/student/notifications", icon: Bell },
        ]
    },
    {
        label: "Help & Account",
        items: [
            { label: "My Profile",      href: "/student/profile",       icon: User },
            { label: "Payments Center", href: "/student/billing",       icon: CreditCard },
            { label: "Support Inbox",   href: "/student/support",       icon: MessageSquare },
        ]
    }
]

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const { data: session } = useSession()
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfilePhoto = async () => {
            try {
                const res = await fetch("/api/students")
                if (res.ok) {
                    const data = await res.json()
                    if (data.profilePhoto) setProfilePhoto(data.profilePhoto)
                }
            } catch { }
        }
        fetchProfilePhoto()
    }, [])

    return (
        <div className="min-h-screen bg-slate-100 flex font-sans">

            {/* Mobile Header Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#19484e] text-white px-4 py-3 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white p-0.5 shadow-md flex items-center justify-center shrink-0">
                        <img src="/image.png" alt="Aacharya Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-extrabold text-sm tracking-tight">Aacharya Student</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl border border-white/15 transition-all"
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm"
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#19484e] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col shadow-2xl border-r border-teal-800/40 h-screen",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Brand Header */}
                <div className="p-5 border-b border-teal-800/50 shrink-0">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                            <img src="/image.png" alt="Aacharya Academy Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-sm font-black tracking-tight text-white leading-none">Aacharya Academy</h1>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mt-0.5 block">
                                Student Portal
                            </span>
                        </div>
                    </Link>
                </div>

                {/* User Profile Card */}
                <div className="px-4 pt-4 shrink-0">
                    <div className="bg-white/10 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/20 border border-white/20 flex items-center justify-center shrink-0">
                            {profilePhoto ? (
                                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5 text-teal-100" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-white truncate">{session?.user?.name || "Student"}</p>
                            <p className="text-[10px] text-teal-200/80 truncate">{session?.user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation — Grouped & Scrollable */}
                <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-5">
                    {sidebarGroups.map((group) => (
                        <div key={group.label}>
                            <div className="text-[9px] font-black text-teal-300/50 uppercase tracking-[0.2em] px-2 mb-1.5">{group.label}</div>
                            <div className="space-y-0.5">
                                {group.items.map((item) => {
                                    const Icon = item.icon
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group",
                                                isActive
                                                    ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                                                    : "text-teal-100 hover:bg-white/10 hover:text-white"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-slate-950" : "text-amber-300")} />
                                                <span className="truncate">{item.label}</span>
                                            </div>
                                            {item.badge && (
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md",
                                                    isActive ? "bg-slate-950/20 text-slate-950" : "bg-white/10 text-teal-200"
                                                )}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-teal-800/50 space-y-1.5 shrink-0">
                    <Link
                        href="/"
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-teal-200 hover:bg-white/10 hover:text-white transition-all"
                    >
                        <div className="flex items-center gap-2.5">
                            <Home className="w-4 h-4 text-teal-300" />
                            <span>Return to Website</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 rounded-xl transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto h-screen mt-14 lg:mt-0">
                {children}
            </main>
        </div>
    )
}
