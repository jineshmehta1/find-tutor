"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
    Map, MapPin, Users, BookOpen, AlertTriangle,
    Loader2, RefreshCw, GraduationCap, Eye, EyeOff
} from "lucide-react";
import { toast } from "sonner";
import type { TutorMarker, StudentMarker, LeadMarker } from "@/components/admin/AdminMapView";

/* ─── Load the Leaflet map without SSR (Leaflet needs window) ─── */
const AdminMapView = dynamic(() => import("@/components/admin/AdminMapView"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 rounded-3xl space-y-3">
            <Loader2 className="w-8 h-8 text-[#1f5961] animate-spin" />
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Rendering map...</p>
        </div>
    ),
});

interface MapData {
    tutors: TutorMarker[];
    students: StudentMarker[];
    leads: LeadMarker[];
    stats: {
        totalTutors: number;
        totalStudents: number;
        unmatchedLeads: number;
        tutorsWithNoGeo: number;
        studentsWithNoGeo: number;
    };
}

export default function MapAnalytics() {
    const [data, setData] = useState<MapData | null>(null);
    const [loading, setLoading] = useState(true);

    // Layer visibility toggles
    const [showTutors, setShowTutors] = useState(true);
    const [showStudents, setShowStudents] = useState(true);
    const [showLeads, setShowLeads] = useState(true);

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

    const LayerToggle = ({
        active, onToggle, color, label, count, icon: Icon
    }: {
        active: boolean; onToggle: () => void;
        color: string; label: string; count: number; icon: any;
    }) => (
        <button
            onClick={onToggle}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
                active
                    ? `${color} text-white border-transparent shadow-md`
                    : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300"
            }`}
        >
            {active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
            <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                active ? "bg-white/20" : "bg-slate-200 text-slate-500"
            }`}>
                {count}
            </span>
        </button>
    );

    return (
        <div className="space-y-6 font-sans pb-12">
            {/* ── Header ── */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                            <Map className="w-3.5 h-3.5 text-amber-300" />
                            <span>Live Geo Intelligence</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                            Locality Coverage Map
                        </h1>
                        <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                            Real-time geographic distribution of tutors, students, and unmatched demand leads across the city.
                        </p>
                    </div>
                    <button
                        onClick={fetchMapData}
                        disabled={loading}
                        className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* ── KPI Stats Row ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                    { label: "Tutors on Map", value: data?.stats.totalTutors ?? "—", icon: GraduationCap, bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/60" },
                    { label: "Students on Map", value: data?.stats.totalStudents ?? "—", icon: BookOpen, bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200/60" },
                    { label: "Unmatched Leads", value: data?.stats.unmatchedLeads ?? "—", icon: AlertTriangle, bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200/60" },
                    { label: "Tutors No Geo", value: data?.stats.tutorsWithNoGeo ?? "—", icon: MapPin, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200/60" },
                    { label: "Students No Geo", value: data?.stats.studentsWithNoGeo ?? "—", icon: Users, bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200/60" },
                ].map(({ label, value, icon: Icon, bg, text, border }) => (
                    <div key={label} className={`${bg} border ${border} rounded-2xl p-4 flex items-center gap-3`}>
                        <div className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-4.5 h-4.5 ${text}`} />
                        </div>
                        <div>
                            <div className={`text-xl font-black ${text}`}>{value}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Legend / Layer Toggle Row ── */}
            <div className="bg-white border border-slate-200/80 rounded-2xl px-5 py-4 flex flex-wrap items-center gap-3 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Map Layers:</span>
                <LayerToggle
                    active={showTutors} onToggle={() => setShowTutors(!showTutors)}
                    color="bg-emerald-500" label="Tutors"
                    count={data?.stats.totalTutors ?? 0}
                    icon={GraduationCap}
                />
                <LayerToggle
                    active={showStudents} onToggle={() => setShowStudents(!showStudents)}
                    color="bg-blue-500" label="Students"
                    count={data?.stats.totalStudents ?? 0}
                    icon={BookOpen}
                />
                <LayerToggle
                    active={showLeads} onToggle={() => setShowLeads(!showLeads)}
                    color="bg-rose-500" label="Unmatched Leads"
                    count={data?.stats.unmatchedLeads ?? 0}
                    icon={AlertTriangle}
                />
                <div className="ml-auto flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Tutor
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Student
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Unmatched Lead
                    </span>
                </div>
            </div>

            {/* ── Map Container ── */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl" style={{ height: "65vh" }}>
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 space-y-3">
                        <Loader2 className="w-10 h-10 text-[#1f5961] animate-spin" />
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Loading live map data...</p>
                    </div>
                ) : !data || (data.tutors.length + data.students.length + data.leads.length === 0) ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 space-y-4 p-8">
                        <div className="text-6xl">🗺️</div>
                        <div className="text-center space-y-2">
                            <h3 className="font-black text-slate-800 text-lg">No map data yet</h3>
                            <p className="text-slate-500 text-sm font-medium max-w-sm">
                                Users need to have their address or GPS coordinates saved in their profile to appear on the map.
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
                    />
                )}
            </div>

            {/* ── Info Note ── */}
            {data && (data.stats.tutorsWithNoGeo > 0 || data.stats.studentsWithNoGeo > 0) && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200/60 rounded-2xl p-4 text-xs font-semibold text-amber-700">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>
                        <strong>{data.stats.tutorsWithNoGeo} tutor(s)</strong> and{" "}
                        <strong>{data.stats.studentsWithNoGeo} student(s)</strong> could not be placed on the map because their address could not be geocoded. Ask them to update their profile with a more specific address.
                    </p>
                </div>
            )}
        </div>
    );
}
