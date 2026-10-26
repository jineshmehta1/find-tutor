"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    Phone, Mail, MapPin, Award, BookOpen, Clock,
    CheckCircle2, AlertCircle, ExternalLink, Compass, Navigation
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Fix broken Leaflet default icon in Next.js / webpack
   ───────────────────────────────────────────────────────────── */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* ─────────────────────────────────────────────────────────────
   Custom SVG pin icons with pulsing ring and distinct types
   ───────────────────────────────────────────────────────────── */
const makePinIcon = (color: string, emoji: string, badgeText?: string, badgeColor?: string) =>
    L.divIcon({
        className: "custom-map-pin",
        html: `
      <div style="position:relative;width:44px;height:54px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <div style="
          position:absolute;top:5px;left:5px;
          width:34px;height:34px;
          background:${color};
          border-radius:50%;
          opacity:0.35;
          animation:pin-pulse 2s ease-out infinite;
        "></div>
        <div style="
          position:absolute;top:0;left:2px;
          width:40px;height:40px;
          background:${color};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:2.5px solid #ffffff;
          box-shadow:0 6px 18px rgba(0,0,0,0.32);
          display:flex;align-items:center;justify-content:center;
          transition:transform 0.2s ease;
        ">
          <span style="transform:rotate(45deg);font-size:16px;line-height:1;user-select:none;">${emoji}</span>
        </div>
        ${badgeText ? `
          <div style="
            position:absolute;top:-6px;right:-4px;
            background:${badgeColor || '#0f172a'};color:white;
            font-size:9px;font-weight:900;
            padding:1px 5px;border-radius:999px;
            border:1.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25);
            letter-spacing:0.3px;white-space:nowrap;
          ">${badgeText}</div>
        ` : ''}
      </div>
      <style>
        @keyframes pin-pulse {
          0%   { transform:scale(0.85); opacity:0.5; }
          60%  { transform:scale(2.1);   opacity:0; }
          100% { transform:scale(2.3);   opacity:0; }
        }
      </style>
    `,
        iconSize: [44, 54],
        iconAnchor: [22, 54],
        popupAnchor: [0, -56],
    });

const ICON_TUTOR_APPROVED = makePinIcon("#10b981", "🎓", "Verified", "#059669"); // Emerald Green
const ICON_TUTOR_PENDING  = makePinIcon("#f59e0b", "🎓", "Pending", "#d97706");  // Amber
const ICON_STUDENT        = makePinIcon("#3b82f6", "📚", "Student", "#2563eb");  // Blue
const ICON_LEAD_PENDING   = makePinIcon("#ef4444", "📍", "Hotspot", "#dc2626");  // Crimson Red
const ICON_LEAD_CONVERTED = makePinIcon("#8b5cf6", "🎯", "Matched", "#7c3aed");  // Purple

/* ─────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────── */
export interface TutorMarker {
    id: string;
    type: "tutor";
    name: string;
    email?: string;
    phone?: string;
    address: string;
    profilePhoto: string | null;
    isApproved: boolean;
    approvalStatus: "approved" | "pending";
    expectedFee: number | null;
    feeType: string;
    teachingMode: string | null;
    subjects: string;
    experience: string;
    education: string;
    leadCount: number;
    subscriptionStatus: string;
    lat: number;
    lng: number;
}

export interface StudentMarker {
    id: string;
    type: "student";
    name: string;
    email?: string;
    phone?: string;
    address: string;
    subjects?: string;
    leadCount?: number;
    lat: number;
    lng: number;
}

export interface LeadMarker {
    id: string;
    type: "lead";
    studentName: string;
    studentPhone?: string;
    studentEmail?: string;
    teacherName?: string | null;
    subject: string;
    classLevel: string;
    mode?: string;
    status: "PENDING" | "CONTACTED" | "CONVERTED" | "REJECTED";
    location: string;
    createdAt?: string | Date;
    lat: number;
    lng: number;
}

interface AdminMapViewProps {
    tutors: TutorMarker[];
    students: StudentMarker[];
    leads: LeadMarker[];
    showTutors: boolean;
    showStudents: boolean;
    showLeads: boolean;
    tutorFilter?: "all" | "approved" | "pending";
    leadFilter?: "all" | "unmatched" | "converted";
    selectedId?: string | null;
}

/* ─────────────────────────────────────────────────────────────
   Helper to parse JSON array strings safely
   ───────────────────────────────────────────────────────────── */
function parseJsonArray(str?: string | null): string[] {
    if (!str) return [];
    try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === "string") return [parsed];
    } catch {
        return str.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [];
}

/* ─────────────────────────────────────────────────────────────
   Coordinate Jitter:
   Prevents co-located pins (e.g. multiple tutors/students in
   Bhavanipuram) from completely overlapping and hiding each other.
   Arranges coincident markers in a radial offset circle.
   ───────────────────────────────────────────────────────────── */
interface PositionedItem<T> {
    item: T;
    displayLat: number;
    displayLng: number;
}

function applySpiderOffset<T extends { lat: number; lng: number; id: string }>(items: T[]): PositionedItem<T>[] {
    const threshold = 0.00045; // ~45 meters
    const clusters: { centerLat: number; centerLng: number; list: T[] }[] = [];

    for (const item of items) {
        let placed = false;
        for (const c of clusters) {
            const dLat = Math.abs(c.centerLat - item.lat);
            const dLng = Math.abs(c.centerLng - item.lng);
            if (dLat < threshold && dLng < threshold) {
                c.list.push(item);
                placed = true;
                break;
            }
        }
        if (!placed) {
            clusters.push({ centerLat: item.lat, centerLng: item.lng, list: [item] });
        }
    }

    const result: PositionedItem<T>[] = [];
    for (const c of clusters) {
        if (c.list.length === 1) {
            result.push({ item: c.list[0], displayLat: c.list[0].lat, displayLng: c.list[0].lng });
        } else {
            const radius = 0.00038; // ~38m spread
            c.list.forEach((item, index) => {
                const angle = (index / c.list.length) * 2 * Math.PI;
                const displayLat = c.centerLat + radius * Math.sin(angle);
                const displayLng = c.centerLng + radius * Math.cos(angle);
                result.push({ item, displayLat, displayLng });
            });
        }
    }

    return result;
}

/* ─────────────────────────────────────────────────────────────
   Map Controller: AutoFit & Focus Hotspots
   ───────────────────────────────────────────────────────────── */
function MapController({
    markers,
    selectedId,
}: {
    markers: { id: string; lat: number; lng: number }[];
    selectedId?: string | null;
}) {
    const map = useMap();
    const hasFittedRef = useRef(false);

    // If a specific item is selected, smoothly fly to it
    useEffect(() => {
        if (!selectedId) return;
        const target = markers.find((m) => m.id === selectedId);
        if (target) {
            map.flyTo([target.lat, target.lng], 16, { duration: 1.2 });
        }
    }, [selectedId, markers, map]);

    // Initial fit: center on Vijayawada hub if users exist, else fit bounds
    useEffect(() => {
        if (hasFittedRef.current || !markers.length) return;
        hasFittedRef.current = true;

        // Check if there are AP/Vijayawada markers
        const apMarkers = markers.filter(
            (m) => m.lat >= 16.0 && m.lat <= 17.5 && m.lng >= 80.0 && m.lng <= 81.5
        );

        if (apMarkers.length > 0) {
            const bounds = L.latLngBounds(apMarkers.map((m) => [m.lat, m.lng]));
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
        } else {
            const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
        }
    }, [markers, map]);

    return null;
}

/* ─────────────────────────────────────────────────────────────
   Main Map Component
   ───────────────────────────────────────────────────────────── */
export default function AdminMapView({
    tutors,
    students,
    leads,
    showTutors,
    showStudents,
    showLeads,
    tutorFilter = "all",
    leadFilter = "all",
    selectedId,
}: AdminMapViewProps) {
    // Vijayawada default center
    const defaultCenter: [number, number] = [16.5162, 80.6280];

    // Filter tutors based on approval status
    const filteredTutors = useMemo(() => {
        if (!showTutors) return [];
        if (tutorFilter === "approved") return tutors.filter((t) => t.isApproved);
        if (tutorFilter === "pending") return tutors.filter((t) => !t.isApproved);
        return tutors;
    }, [tutors, showTutors, tutorFilter]);

    // Filter leads based on match status
    const filteredLeads = useMemo(() => {
        if (!showLeads) return [];
        if (leadFilter === "unmatched") return leads.filter((l) => l.status === "PENDING" || !l.teacherName);
        if (leadFilter === "converted") return leads.filter((l) => l.status === "CONVERTED" || !!l.teacherName);
        return leads;
    }, [leads, showLeads, leadFilter]);

    const activeStudents = showStudents ? students : [];

    // Apply radial spider offset to eliminate overlapping pins
    const positionedTutors = useMemo(() => applySpiderOffset(filteredTutors), [filteredTutors]);
    const positionedStudents = useMemo(() => applySpiderOffset(activeStudents), [activeStudents]);
    const positionedLeads = useMemo(() => applySpiderOffset(filteredLeads), [filteredLeads]);

    const allPositioned = useMemo(() => [
        ...positionedTutors.map((p) => ({ id: p.item.id, lat: p.displayLat, lng: p.displayLng })),
        ...positionedStudents.map((p) => ({ id: p.item.id, lat: p.displayLat, lng: p.displayLng })),
        ...positionedLeads.map((p) => ({ id: p.item.id, lat: p.displayLat, lng: p.displayLng })),
    ], [positionedTutors, positionedStudents, positionedLeads]);

    return (
        <div className="relative w-full h-full">
            <MapContainer
                center={defaultCenter}
                zoom={12}
                className="w-full h-full rounded-3xl z-0"
                style={{ minHeight: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController markers={allPositioned} selectedId={selectedId} />

                {/* ── 1. Tutor Markers ── */}
                {positionedTutors.map(({ item: t, displayLat, displayLng }) => {
                    const subjects = parseJsonArray(t.subjects);
                    const teachingModes = parseJsonArray(t.teachingMode);
                    const isMonthly = t.feeType === "/month" || t.feeType === "per month";
                    const isHourly = t.feeType === "/hr" || t.feeType === "hourly";

                    return (
                        <Marker
                            key={`tutor-${t.id}`}
                            position={[displayLat, displayLng]}
                            icon={t.isApproved ? ICON_TUTOR_APPROVED : ICON_TUTOR_PENDING}
                        >
                            <Popup minWidth={260} maxWidth={320} className="custom-admin-popup">
                                <div className="space-y-3 p-1 font-sans">
                                    {/* Header with Photo & Status */}
                                    <div className="flex items-start gap-3">
                                        {t.profilePhoto ? (
                                            <img
                                                src={t.profilePhoto}
                                                alt={t.name}
                                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-[#ffb800] text-slate-900 font-black text-base flex items-center justify-center shrink-0 shadow-sm">
                                                {t.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <h4 className="font-black text-sm text-slate-900 truncate">{t.name}</h4>
                                                {t.isApproved ? (
                                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                                        <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                                                        <Clock className="w-2.5 h-2.5" /> Pending
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-500 font-medium truncate">{t.education || "Tutor"}</p>
                                        </div>
                                    </div>

                                    {/* Subjects Tags */}
                                    {subjects.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {subjects.slice(0, 4).map((sub, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-0.5 bg-amber-50 text-amber-900 text-[10px] font-bold rounded-md border border-amber-200/70"
                                                >
                                                    {sub}
                                                </span>
                                            ))}
                                            {subjects.length > 4 && (
                                                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded-md">
                                                    +{subjects.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Fee & Experience Row */}
                                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/80 text-[11px]">
                                        <div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Fee</div>
                                            <div className="font-black text-emerald-700">
                                                {t.expectedFee
                                                    ? isMonthly
                                                        ? `₹${t.expectedFee.toLocaleString()} / mo`
                                                        : `₹${t.expectedFee.toLocaleString()} / hr`
                                                    : "Negotiable"}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Experience</div>
                                            <div className="font-bold text-slate-700 truncate">{t.experience || "—"}</div>
                                        </div>
                                    </div>

                                    {/* Modes */}
                                    {teachingModes.length > 0 && (
                                        <div className="flex flex-wrap gap-1 text-[10px]">
                                            {teachingModes.map((m, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-md border border-blue-200">
                                                    {m}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Address & Leads */}
                                    <div className="space-y-1 text-[11px] text-slate-600">
                                        <div className="flex items-start gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                            <span className="leading-tight line-clamp-2">{t.address}</span>
                                        </div>
                                    </div>

                                    {/* Contact & Actions */}
                                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5">
                                            {t.phone && (
                                                <a
                                                    href={`tel:${t.phone}`}
                                                    className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                                                    title={`Call ${t.phone}`}
                                                >
                                                    <Phone className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                            {t.email && (
                                                <a
                                                    href={`mailto:${t.email}`}
                                                    className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                                                    title={`Email ${t.email}`}
                                                >
                                                    <Mail className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                        </div>
                                        <a
                                            href={`/tutor/${t.id}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-all"
                                        >
                                            <span>Profile</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* ── 2. Student Markers ── */}
                {positionedStudents.map(({ item: s, displayLat, displayLng }) => {
                    const subjects = parseJsonArray(s.subjects);

                    return (
                        <Marker key={`student-${s.id}`} position={[displayLat, displayLng]} icon={ICON_STUDENT}>
                            <Popup minWidth={240} maxWidth={300} className="custom-admin-popup">
                                <div className="space-y-2.5 p-1 font-sans">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="font-black text-sm text-slate-900">{s.name}</h4>
                                                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-blue-100 text-blue-800 border border-blue-300">
                                                    Student
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 font-medium">Registered Learner</p>
                                        </div>
                                    </div>

                                    {subjects.length > 0 && (
                                        <div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Interested Subjects</div>
                                            <div className="flex flex-wrap gap-1">
                                                {subjects.map((sub, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-semibold rounded-md border border-blue-200">
                                                        {sub}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-1.5 text-[11px] text-slate-600">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                        <span className="leading-tight line-clamp-2">{s.address}</span>
                                    </div>

                                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                                        <span className="text-slate-400 font-semibold">
                                            {s.leadCount ? `${s.leadCount} lead(s) posted` : "Active student"}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            {s.phone && (
                                                <a
                                                    href={`tel:${s.phone}`}
                                                    className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-200"
                                                    title={`Call ${s.phone}`}
                                                >
                                                    <Phone className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                            {s.email && (
                                                <a
                                                    href={`mailto:${s.email}`}
                                                    className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg"
                                                    title={`Email ${s.email}`}
                                                >
                                                    <Mail className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* ── 3. Lead Markers ── */}
                {positionedLeads.map(({ item: l, displayLat, displayLng }) => {
                    const isMatched = l.status === "CONVERTED" || !!l.teacherName;

                    return (
                        <Marker
                            key={`lead-${l.id}`}
                            position={[displayLat, displayLng]}
                            icon={isMatched ? ICON_LEAD_CONVERTED : ICON_LEAD_PENDING}
                        >
                            <Popup minWidth={250} maxWidth={320} className="custom-admin-popup">
                                <div className="space-y-2.5 p-1 font-sans">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="font-black text-sm text-slate-900">{l.subject}</h4>
                                                <span
                                                    className={`px-1.5 py-0.5 rounded-full text-[9px] font-black border ${
                                                        isMatched
                                                            ? "bg-purple-100 text-purple-800 border-purple-300"
                                                            : "bg-rose-100 text-rose-800 border-rose-300"
                                                    }`}
                                                >
                                                    {isMatched ? "Matched" : "Unmatched Demand"}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 font-medium">
                                                {l.classLevel} • {l.mode || "Tuition"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                                        <div className="text-slate-700 font-bold">
                                            Student: <span className="font-black text-slate-900">{l.studentName}</span>
                                        </div>
                                        {l.teacherName && (
                                            <div className="text-purple-700 font-bold">
                                                Assigned Tutor: <span className="font-black">{l.teacherName}</span>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-1 text-slate-500 pt-1 border-t border-slate-200/60">
                                            <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                                            <span className="truncate">{l.location}</span>
                                        </div>
                                    </div>

                                    <div className="pt-1 flex items-center justify-between text-[11px]">
                                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                                            Status: {l.status}
                                        </span>
                                        {l.studentPhone && (
                                            <a
                                                href={`tel:${l.studentPhone}`}
                                                className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200"
                                            >
                                                <Phone className="w-3 h-3" />
                                                <span>Call Student</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
