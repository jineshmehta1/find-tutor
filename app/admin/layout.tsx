"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { LayoutDashboard, Star, LogOut, Menu, X, Users, Crown, UserCheck, ShieldCheck, Sparkles, Layers, CreditCard, BarChart3, Map, Bell, Trophy, MessageSquare, FileCheck } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const sidebarGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard",        href: "/admin",              icon: LayoutDashboard },
      { label: "Users & Approvals", href: "/admin/users",         icon: Users },
      { label: "Verification Queue",href: "/admin/verification",  icon: FileCheck },
    ]
  },
  {
    label: "Operations",
    items: [
      { label: "Leads Board",       href: "/admin/leads",         icon: Layers },
      { label: "Transactions",      href: "/admin/transactions",   icon: CreditCard },
      { label: "Support Tickets",   href: "/admin/support",        icon: MessageSquare },
      { label: "Notifications",     href: "/admin/notifications",  icon: Bell },
    ]
  },
  {
    label: "Analytics",
    items: [
      { label: "Tutor Stats",       href: "/admin/tutor-analytics",icon: BarChart3 },
      { label: "Leaderboard",       href: "/admin/leaderboard",    icon: Trophy },
      { label: "Locality Map",      href: "/admin/map-analytics",  icon: Map },
    ]
  },
  {
    label: "Content",
    items: [
      { label: "Subscription Plans",href: "/admin/plans",         icon: Crown },
      { label: "Subscriptions",     href: "/admin/subscriptions",  icon: UserCheck },
      { label: "Tutor Reviews",     href: "/admin/reviews",        icon: Star },
    ]
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">

      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a1829] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <Link href="/admin" className="flex items-center gap-2">
          <img src="/image.png" alt="Aacharya Logo" className="h-8 w-auto object-contain bg-white/90 p-1 rounded-lg" />
          <span className="font-black text-sm tracking-tight text-white">ADMIN PORTAL</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-xl"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a1829] text-white flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 shadow-2xl shrink-0 h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand Header */}
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-xl shadow-md shrink-0">
                <img src="/image.png" alt="Aacharya Academy" className="h-7 w-auto object-contain" />
              </div>
              <div>
                <h1 className="text-base font-black text-white leading-tight tracking-tight">Aacharya</h1>
                <p className="text-[10px] text-amber-200 uppercase tracking-widest font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-300" />
                  Admin Panel
                </p>
              </div>
            </Link>
          </div>

          {/* Admin User Card */}
          <div className="p-4 mx-4 mt-4 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-md flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-md">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-white truncate">{session?.user?.name || "System Admin"}</p>
              <p className="text-[10px] text-amber-200 truncate">{session?.user?.email || "admin@aacharya.net"}</p>
            </div>
          </div>

          {/* Navigation Items — Grouped */}
          <nav className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 mt-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
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
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all",
                          isActive
                            ? "bg-amber-500 text-slate-950 shadow-md font-black"
                            : "text-amber-100 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 w-full px-4 py-3 text-rose-300 hover:bg-rose-500/20 rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto h-screen pt-16 lg:pt-10">
        {children}
      </main>
    </div>
  )
}

