"use client";

import dynamic from "next/dynamic";
import type { LocationData } from "./MapLocationPicker";

/* ─── Dynamic import to avoid SSR (Leaflet needs `window`) ─── */
const MapLocationPicker = dynamic(() => import("./MapLocationPicker"), {
    ssr: false,
    loading: () => (
        <div className="space-y-3">
            <div className="flex gap-2">
                <div className="flex-1 h-[42px] bg-slate-100 rounded-xl animate-pulse" />
                <div className="w-32 h-[42px] bg-slate-100 rounded-xl animate-pulse" />
            </div>
            <div className="h-[300px] bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
                <div className="text-center">
                    <div className="text-3xl mb-2">🗺️</div>
                    <p className="text-sm text-slate-400 font-medium">Loading Map...</p>
                </div>
            </div>
        </div>
    ),
});

export default MapLocationPicker;
export type { LocationData };
