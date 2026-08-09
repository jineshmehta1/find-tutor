"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ─── Fix Leaflet default marker icon (broken in Next.js/webpack) ─── */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* ─── Custom animated pin icon ─── */
const createPinIcon = (color: string) =>
    L.divIcon({
        className: "custom-map-pin",
        html: `<div style="
            width: 36px; height: 36px;
            background: ${color};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
        ">
            <div style="
                width: 10px; height: 10px;
                background: white;
                border-radius: 50%;
                transform: rotate(45deg);
            "></div>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
    });

/* ─── Types ─── */
export interface LocationData {
    address: string;
    latitude: number;
    longitude: number;
}

interface MapLocationPickerProps {
    onLocationSelect: (location: LocationData) => void;
    initialAddress?: string;
    initialLat?: number;
    initialLng?: number;
    height?: string;
    accentColor?: "amber" | "blue";
    compact?: boolean;
}

/* ─── Nominatim reverse geocode ─── */
async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch {
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
}

/* ─── Nominatim search ─── */
interface NominatimResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

async function searchPlaces(query: string): Promise<NominatimResult[]> {
    if (!query.trim() || query.length < 3) return [];
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`,
            { headers: { "Accept-Language": "en" } }
        );
        return await res.json();
    } catch {
        return [];
    }
}

/* ─── Sub-component: handles map click events ─── */
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

/* ─── Sub-component: fly to position ─── */
function FlyToPosition({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], 16, { duration: 1.2 });
    }, [lat, lng, map]);
    return null;
}

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */
export default function MapLocationPicker({
    onLocationSelect,
    initialAddress = "",
    initialLat,
    initialLng,
    height = "300px",
    accentColor = "amber",
    compact = false,
}: MapLocationPickerProps) {
    const DEFAULT_LAT = 20.5937; // Center of India
    const DEFAULT_LNG = 78.9629;
    const DEFAULT_ZOOM = 5;

    const [markerPos, setMarkerPos] = useState<[number, number] | null>(
        initialLat && initialLng ? [initialLat, initialLng] : null
    );
    const [flyTo, setFlyTo] = useState<[number, number] | null>(
        initialLat && initialLng ? [initialLat, initialLng] : null
    );
    const [address, setAddress] = useState(initialAddress);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const colors = {
        amber: {
            primary: "#f59e0b",
            gradient: "from-yellow-400 to-amber-500",
            ring: "ring-amber-400",
            bg: "bg-amber-50",
            text: "text-amber-700",
            border: "border-amber-200",
            hoverBg: "hover:bg-amber-100",
            pin: "#f59e0b",
        },
        blue: {
            primary: "#3b82f6",
            gradient: "from-blue-400 to-blue-500",
            ring: "ring-blue-400",
            bg: "bg-blue-50",
            text: "text-blue-700",
            border: "border-blue-200",
            hoverBg: "hover:bg-blue-100",
            pin: "#3b82f6",
        },
        teal: {
            primary: "#1f5961",
            gradient: "from-[#1f5961] to-[#19484e]",
            ring: "ring-[#1f5961]",
            bg: "bg-teal-50",
            text: "text-[#1f5961]",
            border: "border-teal-200",
            hoverBg: "hover:bg-teal-100",
            pin: "#1f5961",
        },
    };
    const theme = colors[accentColor] || colors.amber;

    const pinIcon = createPinIcon(theme.pin);

    /* ─── Place marker + reverse geocode ─── */
    const handlePlaceMarker = useCallback(
        async (lat: number, lng: number) => {
            setMarkerPos([lat, lng]);
            setFlyTo([lat, lng]);
            const addr = await reverseGeocode(lat, lng);
            setAddress(addr);
            setSearchQuery("");
            setShowResults(false);
            onLocationSelect({ address: addr, latitude: lat, longitude: lng });
        },
        [onLocationSelect]
    );

    /* ─── GPS: Use My Location ─── */
    const handleUseMyLocation = useCallback(() => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                handlePlaceMarker(pos.coords.latitude, pos.coords.longitude);
                setIsLocating(false);
            },
            () => {
                alert("Unable to retrieve your location. Please allow location access.");
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, [handlePlaceMarker]);

    /* ─── Search debounce ─── */
    useEffect(() => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        if (!searchQuery.trim() || searchQuery.length < 3) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }
        setIsSearching(true);
        searchTimeoutRef.current = setTimeout(async () => {
            const results = await searchPlaces(searchQuery);
            setSearchResults(results);
            setShowResults(results.length > 0);
            setIsSearching(false);
        }, 400);
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, [searchQuery]);

    /* ─── Close dropdown on outside click ─── */
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ─── Select a search result ─── */
    const handleSelectResult = (result: NominatimResult) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        handlePlaceMarker(lat, lng);
        setSearchQuery("");
    };

    return (
        <div ref={containerRef} className="space-y-3">
            {/* Search Bar + GPS Button */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a place or address..."
                        className={`w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:${theme.ring} focus:border-transparent outline-none bg-white text-sm`}
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Search Results Dropdown */}
                    {showResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-[1000] max-h-48 overflow-y-auto">
                            {searchResults.map((result) => (
                                <button
                                    key={result.place_id}
                                    onClick={() => handleSelectResult(result)}
                                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-start gap-2"
                                >
                                    <span className="text-slate-400 mt-0.5 shrink-0">📍</span>
                                    <span className="text-sm text-slate-700 line-clamp-2">{result.display_name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Use My Location Button */}
                <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={isLocating}
                    className={`px-3 py-2.5 ${theme.bg} ${theme.text} rounded-xl ${theme.hoverBg} transition-all border ${theme.border} flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap disabled:opacity-50 shrink-0`}
                    title="Use my current location"
                >
                    {isLocating ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                        </svg>
                    )}
                    {!compact && <span>{isLocating ? "Locating..." : "My Location"}</span>}
                </button>
            </div>

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
                <MapContainer
                    center={markerPos || [DEFAULT_LAT, DEFAULT_LNG]}
                    zoom={markerPos ? 16 : DEFAULT_ZOOM}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={true}
                    attributionControl={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapClickHandler onMapClick={handlePlaceMarker} />
                    {flyTo && <FlyToPosition lat={flyTo[0]} lng={flyTo[1]} />}
                    {markerPos && (
                        <Marker
                            position={markerPos}
                            icon={pinIcon}
                            draggable={true}
                            eventHandlers={{
                                dragend: (e) => {
                                    const latlng = e.target.getLatLng();
                                    handlePlaceMarker(latlng.lat, latlng.lng);
                                },
                            }}
                        />
                    )}
                </MapContainer>
            </div>

            {/* Selected Address Display */}
            {address && (
                <div className={`flex items-start gap-2 p-3 ${theme.bg} rounded-xl border ${theme.border}`}>
                    <span className="text-lg mt-0.5 shrink-0">📍</span>
                    <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${theme.text} uppercase tracking-wide mb-0.5`}>Selected Location</p>
                        <p className="text-sm text-slate-700 leading-snug">{address}</p>
                    </div>
                    {markerPos && (
                        <span className="text-[10px] text-slate-400 shrink-0 mt-1">
                            {markerPos[0].toFixed(4)}, {markerPos[1].toFixed(4)}
                        </span>
                    )}
                </div>
            )}

            {/* Hint */}
            {!address && !compact && (
                <p className="text-xs text-slate-400 text-center">
                    📌 Click on the map to pin your location, or use the search / GPS button above
                </p>
            )}
        </div>
    );
}
