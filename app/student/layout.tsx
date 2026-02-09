"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { LayoutDashboard, Users, User, LogOut, Menu, X, GraduationCap } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
    { label: "Find Teachers", href: "/student/teachers", icon: Users },
    { label: "My Profile", href: "/student/profile", icon: User },
]

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const { data: session } = useSession()

    return (
        <div className="min-h-screen bg-slate-100 flex">

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-md"
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-900 to-blue-950 text-white transform transition-transform duration-200 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-blue-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Student Portal</h1>
                            <p className="text-xs text-blue-300 truncate">{session?.user?.name || "Welcome"}</p>
                        </div>
                    </div>
                </div>

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
                                        ? "bg-blue-500 text-white font-medium shadow-lg shadow-blue-900/50"
                                        : "text-blue-200 hover:bg-blue-800 hover:text-white"
                                )}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-blue-800">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-red-950/30 hover:text-red-200 rounded-lg transition-colors"
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
