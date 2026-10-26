"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
    Map, MapPin, Users, BookOpen, AlertTriangle,
    Loader2, RefreshCw, GraduationCap, Eye, EyeOff,
    Search, CheckCircle2, Clock, Target, Compass, Sparkles,
    ChevronDown, ChevronUp, Phone, Mail, ExternalLink, Filter
} from "lucide-react";
import { toast } from "sonner";
import type { TutorMarker, StudentMarker, LeadMarker } from "@/components/admin/AdminMapView";

/* ─── Load the Leaflet map without SSR (Leaflet requires window) ─── */
const AdminMapView = dynamic(() => import("@/components/admin/AdminMapView"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 rounded-3xl space-y-3">
            <Loader2 className="w-10 h-10 text-[#ffb800] animate-spin" />
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Rendering geo layers...</p>
        </div>
    ),
});

interface MapStats {
    totalTutors: number;
    approvedTutors: number;
    pendingTutors: number;
    totalStudents: number;
    totalLeads: number;
    unmatchedLeads: number;
    convertedLeads: number;
    tutorsWithNoGeo: number;
    studentsWithNoGeo: number;
    tutorsOnMap: number;
    studentsOnMap: number;
    leadsOnMap: number;
}

interface MapData {
    tutors: TutorMarker[];
    students: StudentMarker[];
    leads: LeadMarker[];
    stats: MapStats;
}

export default function MapAnalytics() {
    const [data, setData] = useState<MapData | null>(null);
    const [loading, setLoading] = useState(true);

    // Layer visibility toggles
    const [showTutors, setShowTutors] = useState(true);
    const [showStudents, setShowStudents] = useState(true);
    const [showLeads, setShowLeads] = useState(true);

    // Sub-filters
    const [tutorFilter, setTutorFilter] = useState<"all" | "approved" | "pending">("all");
    const [leadFilter, setLeadFilter] = useState<"all" | "unmatched" | "converted">("all");

    // Search & Selection
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showEntityList, setShowEntityList] = useState(false);
    const [activeTab, setActiveTab] = useState<"all" | "tutors" | "students" | "leads">("all");

    useEffect(() => {
        fetchMapData();
    }, []);

    const fetchMapData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/map-analytics");
            if (!res.ok) throw new Error("Failed to fetch map data");
            const json = await res.json();
            setData(json);
        } catch (e) {
            toast.error("Failed to load map analytics data");
        } finally {
            setLoading(false);
        }
    };

    // Calculate localities summary
    const localityStats = useMemo(() => {
        if (!data) return [];
        const counts: Record<string, { name: string; tutors: number; students: number; leads: number }> = {};

        const cleanLoc = (addr: string) => {
            const lower = (addr || "").toLowerCase();
            if (lower.includes("bhavanipuram")) return "Bhavanipuram";
            if (lower.includes("kanchikacherla")) return "Kanchikacherla";
            if (lower.includes("mulapadu")) return "Mulapadu";
            if (lower.includes("ibrahimpatnam")) return "Ibrahimpatnam";
            if (lower.includes("gollapudi")) return "Gollapudi";
            if (lower.includes("bari sadri") || lower.includes("chittorgarh")) return "Rajasthan (Bari Sadri)";
            if (lower.includes("vijayawada")) return "Vijayawada Central";
            return "Other Localities";
        };

        data.tutors.forEach((t) => {
            const loc = cleanLoc(t.address);
            if (!counts[loc]) counts[loc] = { name: loc, tutors: 0, students: 0, leads: 0 };
            counts[loc].tutors++;
        });

        data.students.forEach((s) => {
            const loc = cleanLoc(s.address);
            if (!counts[loc]) counts[loc] = { name: loc, tutors: 0, students: 0, leads: 0 };
            counts[loc].students++;
        });

        data.leads.forEach((l) => {
            const loc = cleanLoc(l.location);
            if (!counts[loc]) counts[loc] = { name: loc, tutors: 0, students: 0, leads: 0 };
            counts[loc].leads++;
        });

        return Object.values(counts).sort((a, b) => (b.tutors + b.students + b.leads) - (a.tutors + a.students + a.leads));
    }, [data]);

    // Search results list
    const searchResults = useMemo(() => {
        if (!data) return [];
        const q = searchQuery.toLowerCase().trim();
        const results: Array<{ id: string; type: "tutor" | "student" | "lead"; title: string; subtitle: string; badge: string; lat: number; lng: number }> = [];

        if (showTutors && (activeTab === "all" || activeTab === "tutors")) {
            data.tutors
                .filter((t) => {
                    if (tutorFilter === "approved" && !t.isApproved) return false;
                    if (tutorFilter === "pending" && t.isApproved) return false;
                    if (!q) return true;
                    return (
                        t.name.toLowerCase().includes(q) ||
                        t.address.toLowerCase().includes(q) ||
                        (t.phone && t.phone.includes(q)) ||
                        t.subjects.toLowerCase().includes(q)
                    );
                })
                .forEach((t) => {
                    results.push({
                        id: t.id,
                        type: "tutor",
                        title: t.name,
                        subtitle: `${t.address} • ${t.isApproved ? "Verified" : "Pending"}`,
                        badge: t.isApproved ? "Verified Tutor" : "Pending Tutor",
                        lat: t.lat,
                        lng: t.lng,
                    });
                });
        }

        if (showStudents && (activeTab === "all" || activeTab === "students")) {
            data.students
                .filter((s) => {
                    if (!q) return true;
                    return (
                        s.name.toLowerCase().includes(q) ||
                        s.address.toLowerCase().includes(q) ||
                        (s.phone && s.phone.includes(q)) ||
                        (s.subjects && s.subjects.toLowerCase().includes(q))
                    );
                })
                .forEach((s) => {
                    results.push({
                        id: s.id,
                        type: "student",
                        title: s.name,
                        subtitle: s.address,
                        badge: "Student",
                        lat: s.lat,
                        lng: s.lng,
                    });
                });
        }

        if (showLeads && (activeTab === "all" || activeTab === "leads")) {
            data.leads
                .filter((l) => {
                    if (leadFilter === "unmatched" && (l.status === "CONVERTED" || l.teacherName)) return false;
                    if (leadFilter === "converted" && l.status !== "CONVERTED" && !l.teacherName) return false;
                    if (!q) return true;
                    return (
                        l.subject.toLowerCase().includes(q) ||
                        l.studentName.toLowerCase().includes(q) ||
                        l.location.toLowerCase().includes(q)
                    );
                })
                .forEach((l) => {
                    results.push({
                        id: l.id,
                        type: "lead",
                        title: `${l.subject} (${l.classLevel})`,
                        subtitle: `${l.studentName} • ${l.location}`,
                        badge: l.status === "CONVERTED" ? "Matched Lead" : "Unmatched Lead",
                        lat: l.lat,
                        lng: l.lng,
                    });
                });
        }

        return results;
    }, [data, searchQuery, showTutors, showStudents, showLeads, tutorFilter, leadFilter, activeTab]);

    return (
        <div className="space-y-6 font-sans pb-16">
            {/* ── 1. Hero Header ── */}
            <div className="bg-[#ffb800] p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-amber-600/20 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-slate-950 text-xs font-black rounded-full border border-white/25 shadow-sm">
                            <Compass className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
                            <span>Aacharya Geo Intelligence</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
                            Locality Coverage Map
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-900 font-bold max-w-2xl leading-relaxed">
                            Live geospatial distribution of verified tutors, registered students, and student demand hotspots across all regions.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={fetchMapData}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                            <span>Refresh Data</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── 2. KPI Stats Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {/* Tutors KPI */}
                <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Tutors Total</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                            <GraduationCap className="w-4.5 h-4.5" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="text-2xl font-black text-emerald-950">{data?.stats.totalTutors ?? "—"}</div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 mt-1">
                            <span className="flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> {data?.stats.approvedTutors ?? 0} Verified
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-amber-700">
                                <Clock className="w-2.5 h-2.5" /> {data?.stats.pendingTutors ?? 0} Pending
                            </span>
                        </div>
                    </div>
                </div>

                {/* Students KPI */}
                <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider">Students</span>
                        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                            <BookOpen className="w-4.5 h-4.5" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="text-2xl font-black text-blue-950">{data?.stats.totalStudents ?? "—"}</div>
                        <div className="text-[10px] font-bold text-blue-700 mt-1">
                            {data?.stats.studentsOnMap ?? 0} Mapped on GPS
                        </div>
                    </div>
                </div>

                {/* Leads / Demand KPI */}
                <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider">Demand Leads</span>
                        <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
                            <AlertTriangle className="w-4.5 h-4.5" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="text-2xl font-black text-rose-950">{data?.stats.totalLeads ?? "—"}</div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-rose-700 mt-1">
                            <span>{data?.stats.unmatchedLeads ?? 0} Unmatched</span>
                            <span>•</span>
                            <span className="text-purple-700">{data?.stats.convertedLeads ?? 0} Matched</span>
                        </div>
                    </div>
                </div>

                {/* Localities KPI */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">Hub Localities</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                            <MapPin className="w-4.5 h-4.5" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="text-2xl font-black text-amber-950">{localityStats.length}</div>
                        <div className="text-[10px] font-bold text-amber-700 mt-1">
                            Active Clusters
                        </div>
                    </div>
                </div>

                {/* GPS Quality KPI */}
                <div className="bg-slate-100/80 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">GPS Resolution</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                            <Sparkles className="w-4.5 h-4.5" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="text-2xl font-black text-emerald-700">
                            {data ? Math.round(((data.stats.tutorsOnMap + data.stats.studentsOnMap) / Math.max(1, data.stats.totalTutors + data.stats.totalStudents)) * 100) : 100}%
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 mt-1">
                            {data?.stats.tutorsWithNoGeo || data?.stats.studentsWithNoGeo ? `${(data?.stats.tutorsWithNoGeo ?? 0) + (data?.stats.studentsWithNoGeo ?? 0)} Need GPS` : "100% Geocoded"}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 3. Filters, Search & Layer Controls ── */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    {/* Layer Toggles */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Layers:</span>

                        {/* Tutors Toggle */}
                        <div className="inline-flex rounded-2xl border border-slate-200 p-0.5 bg-slate-50">
                            <button
                                onClick={() => setShowTutors(!showTutors)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    showTutors
                                        ? "bg-emerald-600 text-white shadow-sm"
                                        : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {showTutors ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                <GraduationCap className="w-3.5 h-3.5" />
                                <span>Tutors</span>
                                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-white/20">
                                    {data?.stats.totalTutors ?? 0}
                                </span>
                            </button>
                            {showTutors && (
                                <div className="flex items-center text-[10px] font-bold pl-1 pr-1.5">
                                    <button
                                        onClick={() => setTutorFilter("all")}
                                        className={`px-1.5 py-1 rounded-lg ${tutorFilter === "all" ? "bg-white font-black text-slate-900 shadow-xs" : "text-slate-500"}`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setTutorFilter("approved")}
                                        className={`px-1.5 py-1 rounded-lg ${tutorFilter === "approved" ? "bg-white font-black text-emerald-700 shadow-xs" : "text-slate-500"}`}
                                    >
                                        Verified ({data?.stats.approvedTutors ?? 0})
                                    </button>
                                    <button
                                        onClick={() => setTutorFilter("pending")}
                                        className={`px-1.5 py-1 rounded-lg ${tutorFilter === "pending" ? "bg-white font-black text-amber-700 shadow-xs" : "text-slate-500"}`}
                                    >
                                        Pending ({data?.stats.pendingTutors ?? 0})
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Students Toggle */}
                        <button
                            onClick={() => setShowStudents(!showStudents)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-bold transition-all ${
                                showStudents
                                    ? "bg-blue-600 text-white border-transparent shadow-sm"
                                    : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300"
                            }`}
                        >
                            {showStudents ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Students</span>
                            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-white/20">
                                {data?.stats.totalStudents ?? 0}
                            </span>
                        </button>

                        {/* Leads Toggle */}
                        <div className="inline-flex rounded-2xl border border-slate-200 p-0.5 bg-slate-50">
                            <button
                                onClick={() => setShowLeads(!showLeads)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    showLeads
                                        ? "bg-rose-600 text-white shadow-sm"
                                        : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {showLeads ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Demand Leads</span>
                                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-white/20">
                                    {data?.stats.totalLeads ?? 0}
                                </span>
                            </button>
                            {showLeads && (
                                <div className="flex items-center text-[10px] font-bold pl-1 pr-1.5">
                                    <button
                                        onClick={() => setLeadFilter("all")}
                                        className={`px-1.5 py-1 rounded-lg ${leadFilter === "all" ? "bg-white font-black text-slate-900 shadow-xs" : "text-slate-500"}`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setLeadFilter("unmatched")}
                                        className={`px-1.5 py-1 rounded-lg ${leadFilter === "unmatched" ? "bg-white font-black text-rose-700 shadow-xs" : "text-slate-500"}`}
                                    >
                                        Unmatched ({data?.stats.unmatchedLeads ?? 0})
                                    </button>
                                    <button
                                        onClick={() => setLeadFilter("converted")}
                                        className={`px-1.5 py-1 rounded-lg ${leadFilter === "converted" ? "bg-white font-black text-purple-700 shadow-xs" : "text-slate-500"}`}
                                    >
                                        Matched ({data?.stats.convertedLeads ?? 0})
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search & Selection */}
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search tutor, student, locality..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffb800] focus:bg-white"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => setShowEntityList(!showEntityList)}
                            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                                showEntityList
                                    ? "bg-slate-900 text-white border-transparent"
                                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                        >
                            <Filter className="w-3.5 h-3.5" />
                            <span>List ({searchResults.length})</span>
                            {showEntityList ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                    </div>
                </div>

                {/* Legend bar */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] font-bold text-slate-500 gap-3">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600" /> Verified Tutor (Green)
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600" /> Pending Tutor (Amber)
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-blue-500 border border-blue-600" /> Student (Blue)
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600" /> Unmatched Demand (Red)
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-purple-500 border border-purple-600" /> Matched Lead (Purple)
                        </span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-semibold">
                        💡 Click any marker for contact details & direct profile access.
                    </div>
                </div>
            </div>

            {/* ── 4. Main Interactive Map & Search List ── */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Map Container */}
                <div className={`${showEntityList ? "lg:col-span-3" : "lg:col-span-4"} relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl`} style={{ height: "68vh" }}>
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 space-y-3">
                            <Loader2 className="w-10 h-10 text-[#ffb800] animate-spin" />
                            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Loading live map coordinates...</p>
                        </div>
                    ) : !data || (data.tutors.length + data.students.length + data.leads.length === 0) ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 space-y-4 p-8">
                            <div className="text-6xl">🗺️</div>
                            <div className="text-center space-y-2">
                                <h3 className="font-black text-slate-800 text-lg">No map data available</h3>
                                <p className="text-slate-500 text-sm font-medium max-w-sm">
                                    Users need an address or GPS coordinates saved in their profile to appear on the map.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <AdminMapView
                            tutors={data.tutors}
                            students={data.students}
                            leads={data.leads}
                            showTutors={showTutors}
                            showStudents={showStudents}
                            showLeads={showLeads}
                            tutorFilter={tutorFilter}
                            leadFilter={leadFilter}
                            selectedId={selectedId}
                        />
                    )}
                </div>

                {/* Collapsible Search & Entity List Drawer */}
                {showEntityList && (
                    <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xl flex flex-col h-[68vh] overflow-hidden">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="font-black text-sm text-slate-900">Map Directory</h3>
                            <div className="flex gap-1 text-[10px] font-bold">
                                {(["all", "tutors", "students", "leads"] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-2 py-0.5 rounded-lg capitalize ${
                                            activeTab === tab
                                                ? "bg-slate-900 text-white"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1">
                            {searchResults.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                                    No records matching &quot;{searchQuery}&quot;
                                </div>
                            ) : (
                                searchResults.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedId(item.id)}
                                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                                            selectedId === item.id
                                                ? "border-[#ffb800] bg-amber-50/60 shadow-sm"
                                                : "border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-1.5">
                                            <h4 className="font-black text-xs text-slate-900 truncate">{item.title}</h4>
                                            <span
                                                className={`px-1.5 py-0.5 rounded-full text-[8px] font-black shrink-0 ${
                                                    item.type === "tutor"
                                                        ? item.badge.includes("Verified")
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : "bg-amber-100 text-amber-800"
                                                        : item.type === "student"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-rose-100 text-rose-800"
                                                }`}
                                            >
                                                {item.badge}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-medium line-clamp-2 mt-1">
                                            {item.subtitle}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── 5. Locality Breakdown Summary ── */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-black text-base text-slate-900">Locality Coverage Breakdown</h3>
                        <p className="text-xs text-slate-500 font-medium">
                            Distribution of tutors, students, and demand leads across active zones.
                        </p>
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                        {localityStats.length} Clusters
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {localityStats.map((loc) => (
                        <div
                            key={loc.name}
                            className="p-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-2 hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                                <span className="font-black text-xs text-slate-900 truncate">{loc.name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600">
                                <span className="text-emerald-700">🎓 {loc.tutors} Tutors</span>
                                <span className="text-blue-700">📚 {loc.students} Students</span>
                                {loc.leads > 0 && <span className="text-rose-700">📍 {loc.leads} Leads</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
