"use client";

import { useEffect, useState } from "react";
import {
  Users, GraduationCap, FileText, Crown,
  TrendingUp, Loader2, ArrowRight, ShieldCheck,
  Sparkles, BookOpen, User, RefreshCw, BarChart2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ResponsiveContainer, BarChart as RechartBar, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, LineChart, Line, Legend, PieChart, Pie, Cell
} from "recharts";

/* ─── Types ─── */
interface Stats {
  totalTutors: number; approvedTutors: number; pendingTutors: number;
  totalStudents: number; totalLeads: number; pendingLeads: number;
  convertedLeads: number; activeSubscriptions: number;
}

interface Lead {
  id: string; subject: string | null; status: string; createdAt: string;
  student: { user: { name: string; email: string } };
  teacher?: { user: { name: string } } | null;
}

interface UserData {
  id: string; name: string; email: string; role: string; createdAt: string;
}

interface Charts {
  monthly:    { month: string; tutors: number; students: number }[];
  leadsDonut: { name: string; value: number; color: string }[];
  locality:   { name: string; students: number; tutors: number }[];
}

export default function AdminDashboard() {
  const [stats,       setStats]       = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [charts,      setCharts]      = useState<Charts | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [viewType,    setViewType]    = useState<"bar" | "line" | "pie">("bar");

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStats(data.stats);
      setRecentLeads(data.recentLeads);
      setRecentUsers(data.recentUsers);
      setCharts(data.charts);
    } catch {
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 text-[#ffb800] animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Loading Control Panel...</p>
      </div>
    );
  }

  const conversionRate = stats?.totalLeads
    ? Math.round((stats.convertedLeads / stats.totalLeads) * 100)
    : 0;

  /* ─── Choose active chart data ─── */
  const barData    = charts?.locality   ?? [];
  const lineData   = charts?.monthly    ?? [];
  const donutData  = charts?.leadsDonut ?? [];

  const chartTitle = viewType === "bar"
    ? "Student Leads by Locality"
    : viewType === "line"
    ? "Monthly Tutor & Student Signups"
    : "Lead Status Distribution";

  const chartEmpty = viewType === "bar" ? barData.length === 0
    : viewType === "line" ? lineData.length === 0
    : donutData.length === 0;

  return (
    <div className="space-y-8 font-sans pb-12">

      {/* ── Header ── */}
      <div className="bg-[#ffb800] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Platform Overview</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">System Control & Analytics</h1>
            <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-xl">
              Live database metrics — tutor approvals, student leads, subscriptions, and signups.
            </p>
          </div>
          <button onClick={fetchStats}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all shrink-0">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            value: stats?.totalTutors ?? 0,
            label: "Total Tutors",
            sub: `${stats?.pendingTutors ?? 0} pending approvals`,
            subColor: "text-amber-600",
            icon: Users,
            iconBg: "bg-amber-50 text-amber-600",
          },
          {
            value: stats?.totalStudents ?? 0,
            label: "Total Students",
            sub: "Enrolled accounts",
            subColor: "text-slate-400",
            icon: GraduationCap,
            iconBg: "bg-amber-50 text-[#ffb800]",
          },
          {
            value: stats?.totalLeads ?? 0,
            label: "Total Inquiries",
            sub: `${stats?.pendingLeads ?? 0} pending action`,
            subColor: "text-blue-600",
            icon: FileText,
            iconBg: "bg-blue-50 text-blue-600",
          },
          {
            value: stats?.activeSubscriptions ?? 0,
            label: "Active Memberships",
            sub: `${conversionRate}% lead conversion`,
            subColor: "text-amber-200",
            icon: Crown,
            iconBg: "bg-white/10 text-white",
            dark: true,
          },
        ].map(({ value, label, sub, subColor, icon: Icon, iconBg, dark }) => (
          <div key={label} className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${dark ? "bg-[#0a1829] border-transparent text-white" : "bg-white border-slate-200/80"}`}>
            <div>
              <div className={`text-2xl font-black ${dark ? "text-amber-400" : "text-slate-900"}`}>{value}</div>
              <div className={`text-xs font-bold uppercase tracking-wider ${dark ? "text-amber-200" : "text-slate-500"}`}>{label}</div>
              <div className={`text-[11px] font-bold mt-1 ${subColor}`}>{sub}</div>
            </div>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Analytics Chart ── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">{chartTitle}</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Live data from database</p>
          </div>
          {/* Chart type switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start">
            {(["bar", "line", "pie"] as const).map(t => (
              <button key={t} onClick={() => setViewType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${viewType === t ? "bg-[#ffb800] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
                {t === "pie" ? "Donut" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72">
          {chartEmpty ? (
            <div className="h-full flex flex-col items-center justify-center space-y-2 text-slate-300">
              <BarChart2 className="w-10 h-10" />
              <p className="text-xs font-bold uppercase tracking-widest">No data to display yet</p>
              <p className="text-[10px] text-slate-400">Data will appear as users sign up and post leads</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {viewType === "bar" ? (
                <RechartBar data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#ffb800" radius={[8,8,0,0]} name="Student Leads" />
                  <Bar dataKey="tutors"   fill="#f59e0b" radius={[8,8,0,0]} name="Tutors Available" />
                </RechartBar>
              ) : viewType === "line" ? (
                <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tutors"   stroke="#ffb800" strokeWidth={3} dot={{ fill: "#ffb800" }}   name="Tutors Joined" />
                  <Line type="monotone" dataKey="students" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b" }} name="Students Joined" />
                </LineChart>
              ) : (
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="value">
                    {donutData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [`${val} leads`, name]} />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Recent Activity Feeds ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Recent Student Requirements</h2>
              <p className="text-xs text-slate-500 font-medium">Latest inquiries posted</p>
            </div>
            <Link href="/admin/leads" className="text-xs font-black text-[#ffb800] hover:underline flex items-center gap-1">
              <span>View All</span><ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400 font-bold">No leads yet</div>
          ) : (
            <div className="space-y-3">
              {recentLeads.slice(0, 5).map(lead => (
                <div key={lead.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#ffb800] flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-slate-900">{lead.student.user.name}</p>
                      <p className="text-[11px] font-medium text-slate-500">{lead.subject || "General Tuition"}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    lead.status === "PENDING"   ? "bg-amber-50 text-amber-700 border-amber-200/60"   :
                    lead.status === "CONVERTED" ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" :
                    lead.status === "REJECTED"  ? "bg-rose-50 text-rose-700 border-rose-200/60"      :
                    "bg-blue-50 text-blue-700 border-blue-200/60"
                  }`}>{lead.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Recent Registrations</h2>
              <p className="text-xs text-slate-500 font-medium">Newest accounts on the platform</p>
            </div>
            <Link href="/admin/users" className="text-xs font-black text-[#ffb800] hover:underline flex items-center gap-1">
              <span>Manage</span><ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400 font-bold">No users yet</div>
          ) : (
            <div className="space-y-3">
              {recentUsers.slice(0, 5).map(u => (
                <div key={u.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-slate-900">{u.name}</p>
                      <p className="text-[11px] font-medium text-slate-500">{u.email}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                    u.role === "TEACHER" ? "bg-amber-50 text-[#ffb800] border-amber-200/60" :
                    u.role === "ADMIN"   ? "bg-amber-50 text-amber-700 border-amber-200/60" :
                    "bg-slate-100 text-slate-700 border-slate-200"
                  }`}>{u.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Links ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Verify Queue",    href: "/admin/verification",  icon: ShieldCheck, color: "bg-amber-50 text-amber-700 border-amber-200/60" },
          { label: "Leads Board",     href: "/admin/leads",          icon: FileText,    color: "bg-blue-50 text-blue-700 border-blue-200/60" },
          { label: "Leaderboard",     href: "/admin/leaderboard",    icon: TrendingUp,  color: "bg-emerald-50 text-emerald-700 border-emerald-200/60" },
          { label: "Notifications",   href: "/admin/notifications",  icon: Sparkles,    color: "bg-amber-50 text-[#ffb800] border-amber-200/60" },
        ].map(({ label, href, icon: Icon, color }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-3 p-4 rounded-2xl border font-bold text-xs transition-all hover:shadow-md ${color}`}>
            <Icon className="w-4 h-4 shrink-0" />
            <span>{label}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto" />
          </Link>
        ))}
      </div>
    </div>
  );
}