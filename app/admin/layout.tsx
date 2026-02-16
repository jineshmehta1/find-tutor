"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LayoutDashboard, Image, Star, Trophy, BookOpen, LogOut, Menu, X, Users, Calendar, Ticket, Crown, UserCheck } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Registrations", href: "/admin/registrations", icon: Ticket },
  { label: "Subscription Plans", href: "/admin/plans", icon: Crown },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: UserCheck },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Success Stories", href: "/admin/stories", icon: Trophy },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Banner", href: "/admin/banners", icon: BookOpen },
]


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-slate-900 text-white p-2 rounded-md"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-200 lg:translate-x-0 flex flex-col h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-slate-800 shrink-0">
          <h1 className="text-2xl font-bold text-amber-500">Admin Panel</h1>
          <p className="text-xs text-slate-400 mt-1">Chess Academy Manager</p>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
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
                    ? "bg-amber-500 text-white font-medium shadow-lg shadow-amber-900/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
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
