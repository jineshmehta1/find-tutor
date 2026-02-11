"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { LayoutDashboard, Users, User, LogOut, Menu, X, FileText, AlertCircle, Crown, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { label: "Student Leads", href: "/teacher/leads", icon: FileText },
    { label: "My Students", href: "/teacher/students", icon: Users },
    { label: "My Profile", href: "/teacher/profile", icon: User },
    { label: "Subscription", href: "/teacher/subscription", icon: Crown },
]

interface SubscriptionData {
    hasAccess: boolean;
    status: string;
    isApproved: boolean;
    subscriptionEnd: string | null;
    daysRemaining: number;
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const { data: session } = useSession()
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
    const [loading, setLoading] = useState(true)

    const isApproved = session?.user?.isApproved

    useEffect(() => {
        fetchSubscription()
    }, [])

    const fetchSubscription = async () => {
        try {
            const res = await fetch("/api/teacher/subscription")
            if (res.ok) {
                const data = await res.json()
                setSubscription(data)
            }
        } catch (error) {
            console.error("Failed to check subscription")
        } finally {
            setLoading(false)
        }
    }

    // Pages accessible without subscription
    const freePages = ["/teacher/subscription", "/teacher/profile"]
    const isFreePage = freePages.some(p => pathname.startsWith(p))
    const isGated = !loading && subscription && !subscription.hasAccess && subscription.isApproved && !isFreePage

    return (
        <div className="min-h-screen bg-slate-100 flex">

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 bg-amber-600 text-white p-2 rounded-md"
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-900 to-slate-950 text-white transform transition-transform duration-200 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Teacher Portal</h1>
                            <p className="text-xs text-slate-400 truncate">{session?.user?.name || "Welcome"}</p>
                        </div>
                    </div>
                </div>

                {/* Pending Approval Banner */}
                {!isApproved && (
                    <div className="mx-4 mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                        <div className="flex items-center gap-2 text-amber-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span className="font-medium">Pending Approval</span>
                        </div>
                        <p className="text-xs text-amber-300/70 mt-1">
                            Your account is awaiting admin approval.
                        </p>
                    </div>
                )}

                {/* Subscription Status Banner */}
                {subscription && subscription.isApproved && (
                    <div className={cn(
                        "mx-4 mt-4 p-3 border rounded-xl",
                        subscription.hasAccess
                            ? subscription.status === "trial"
                                ? "bg-blue-500/10 border-blue-500/30"
                                : "bg-green-500/10 border-green-500/30"
                            : "bg-red-500/10 border-red-500/30"
                    )}>
                        <div className={cn(
                            "flex items-center gap-2 text-sm",
                            subscription.hasAccess
                                ? subscription.status === "trial"
                                    ? "text-blue-400"
                                    : "text-green-400"
                                : "text-red-400"
                        )}>
                            {subscription.hasAccess ? <Clock className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
                            <span className="font-medium">
                                {subscription.status === "trial"
                                    ? `Free Trial: ${subscription.daysRemaining} days left`
                                    : subscription.status === "active"
                                        ? `Premium: ${subscription.daysRemaining} days left`
                                        : "Subscription Expired"}
                            </span>
                        </div>
                        {!subscription.hasAccess && (
                            <Link href="/teacher/subscription" className="text-xs text-red-300/70 mt-1 hover:text-red-200 underline block">
                                Upgrade to Premium →
                            </Link>
                        )}
                    </div>
                )}

                <nav className="p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                    isActive
                                        ? "bg-amber-500 text-white font-medium shadow-lg shadow-amber-900/50"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-10 overflow-y-auto h-screen">
                {isGated ? (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center max-w-md">
                            <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Crown className="w-10 h-10 text-amber-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">Subscription Required</h2>
                            <p className="text-slate-500 mb-6">
                                Your free trial has expired. Upgrade to Premium to continue accessing the dashboard, manage student leads, and browse students.
                            </p>
                            <Link
                                href="/teacher/subscription"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/25"
                            >
                                <Crown className="w-5 h-5" />
                                Upgrade to Premium
                            </Link>
                        </div>
                    </div>
                ) : (
                    children
                )}
            </main>
        </div>
    )
}
