"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
   Custom SVG pin icons with pulsing ring effect
   ───────────────────────────────────────────────────────────── */
const makePinIcon = (color: string, emoji: string) =>
    L.divIcon({
        className: "",
        html: `
      <div style="position:relative;width:42px;height:52px;">
        <div style="
          position:absolute;top:4px;left:4px;
          width:34px;height:34px;
          background:${color};
          border-radius:50%;
          opacity:0.35;
          animation:pulse-ring 2s ease-out infinite;
        "></div>
        <div style="
          position:absolute;top:0;left:0;
          width:42px;height:42px;
          background:${color};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:3px solid white;
          box-shadow:0 4px 16px rgba(0,0,0,0.28);
          display:flex;align-items:center;justify-content:center;
        ">
          <span style="transform:rotate(45deg);font-size:16px;line-height:1;">${emoji}</span>
        </div>
      </div>
      <style>
        @keyframes pulse-ring {
          0%   { transform:scale(0.8); opacity:0.4; }
          60%  { transform:scale(2);   opacity:0; }
          100% { transform:scale(2.2); opacity:0; }
        }
      </style>
    `,
        iconSize: [42, 52],
        iconAnchor: [21, 52],
        popupAnchor: [0, -54],
    });

const TUTOR_ICON   = makePinIcon("#10b981", "🎓"); // green
const STUDENT_ICON = makePinIcon("#3b82f6", "📚"); // blue
const LEAD_ICON    = makePinIcon("#ef4444", "📍"); // red

/* ─────────────────────────────────────────────────────────────
   Sub-component that smoothly fits the map to marker bounds
   ───────────────────────────────────────────────────────────── */
function AutoFitBounds({ markers }: { markers: { lat: number; lng: number }[] }) {
    const map = useMap();
    useEffect(() => {
        if (!markers.length) return;
        const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }, [markers, map]);
    return null;
}

/* ─────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────── */
export interface TutorMarker {
    id: string; type: "tutor";
    name: string; address: string;
    profilePhoto: string | null;
    leadCount: number; subscriptionStatus: string;
    lat: number; lng: number;
}

export interface StudentMarker {
    id: string; type: "student";
    name: string; address: string;
    lat: number; lng: number;
}

export interface LeadMarker {
    id: string; type: "lead";
    studentName: string; subject: string;
    classLevel: string; location: string;
    lat: number; lng: number;
}

interface AdminMapViewProps {
    tutors: TutorMarker[];
    students: StudentMarker[];
    leads: LeadMarker[];
    showTutors: boolean;
    showStudents: boolean;
    showLeads: boolean;
}

/* ─────────────────────────────────────────────────────────────
   Main Map Component
   ───────────────────────────────────────────────────────────── */
export default function AdminMapView({
    tutors, students, leads,
    showTutors, showStudents, showLeads,
}: AdminMapViewProps) {
    // Vijayawada default centre
    const center: [number, number] = [16.5062, 80.648];

    const allMarkers = [
        ...(showTutors ? tutors : []),
        ...(showStudents ? students : []),
        ...(showLeads ? leads : []),
    ];

    return (
        <MapContainer
            center={center}
            zoom={12}
            className="w-full h-full rounded-3xl z-0"
            style={{ minHeight: "100%" }}
        >
            {/* OpenStreetMap tiles — completely free, no API key */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Auto-fit to all visible markers */}
            {allMarkers.length > 0 && (
                <AutoFitBounds markers={allMarkers} />
            )}

            {/* ── Tutor Markers (green) ── */}
            {showTutors && tutors.map((t) => (
                <Marker key={`tutor-${t.id}`} position={[t.lat, t.lng]} icon={TUTOR_ICON}>
                    <Popup>
                        <div className="min-w-[180px] space-y-1.5 p-1">
                            {t.profilePhoto && (
                                <img src={t.profilePhoto} alt={t.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                            )}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-900">🎓 {t.name}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium">{t.address}</div>
                            <div className="flex gap-2 mt-1">
                                <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200">
                                    Tutor
                                </span>
                                <span className={`text-[9px] px-2 py-0.5 font-bold rounded-full border ${t.subscriptionStatus === "active"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                                    {t.subscriptionStatus}
                                </span>
                            </div>
                            <div className="text-[10px] text-slate-600 font-semibold mt-1">
                                📩 {t.leadCount} lead{t.leadCount !== 1 ? "s" : ""} received
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* ── Student Markers (blue) ── */}
            {showStudents && students.map((s) => (
                <Marker key={`student-${s.id}`} position={[s.lat, s.lng]} icon={STUDENT_ICON}>
                    <Popup>
                        <div className="min-w-[160px] space-y-1.5 p-1">
                            <div className="text-xs font-black text-slate-900">📚 {s.name}</div>
                            <div className="text-[10px] text-slate-500 font-medium">{s.address}</div>
                            <span className="text-[9px] px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-full border border-blue-200">
                                Student
                            </span>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* ── Lead Markers (red — unmatched demand) ── */}
            {showLeads && leads.map((l) => (
                <Marker key={`lead-${l.id}`} position={[l.lat, l.lng]} icon={LEAD_ICON}>
                    <Popup>
                        <div className="min-w-[180px] space-y-1.5 p-1">
                            <div className="text-xs font-black text-rose-700">⚠️ Unmatched Lead</div>
                            <div className="text-[10px] text-slate-600 font-semibold">{l.studentName}</div>
                            <div className="text-[10px] text-slate-500">{l.location}</div>
                            <div className="flex gap-1.5 flex-wrap mt-1">
                                <span className="text-[9px] px-2 py-0.5 bg-rose-50 text-rose-700 font-bold rounded-full border border-rose-200">
                                    {l.subject}
                                </span>
                                {l.classLevel !== "—" && (
                                    <span className="text-[9px] px-2 py-0.5 bg-slate-50 text-slate-500 font-bold rounded-full border border-slate-200">
                                        {l.classLevel}
                                    </span>
                                )}
                            </div>
                            <div className="text-[9px] text-slate-400 font-medium">No tutor assigned yet</div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
