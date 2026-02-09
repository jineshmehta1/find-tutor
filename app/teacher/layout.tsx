"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { LayoutDashboard, Users, User, LogOut, Menu, X, FileText, AlertCircle } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { label: "Student Leads", href: "/teacher/leads", icon: FileText },
    { label: "My Students", href: "/teacher/students", icon: Users },
    { label: "My Profile", href: "/teacher/profile", icon: User },
]

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const { data: session } = useSession()

    const isApproved = session?.user?.isApproved

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
                {children}
            </main>
        </div>
    )
}
