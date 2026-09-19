"use client";

import React, { useState, useCallback } from "react";
import MapLocationPicker, { type LocationData } from "./DynamicMapPicker";
import { combineStructuredAddress, parseStructuredAddress } from "@/lib/geoUtils";
import { MapPin, Building2, Hash } from "lucide-react";

export interface StructuredAddressData {
  fullAddress: string;
  doorNumber: string;
  houseName: string;
  streetLocation: string;
  latitude?: number;
  longitude?: number;
}

interface StructuredAddressFormProps {
  onAddressChange: (data: StructuredAddressData) => void;
  initialAddress?: string;
  initialDoorNumber?: string;
  initialHouseName?: string;
  initialLat?: number;
  initialLng?: number;
  accentColor?: "amber" | "blue" | "teal";
  height?: string;
  compact?: boolean;
  required?: boolean;
  showPreview?: boolean;
}

export default function StructuredAddressForm({
  onAddressChange,
  initialAddress = "",
  initialDoorNumber = "",
  initialHouseName = "",
  initialLat,
  initialLng,
  accentColor = "amber",
  height = "220px",
  compact = false,
  required = false,
  showPreview = true,
}: StructuredAddressFormProps) {
  // Parse initial address if doorNumber / houseName not explicitly given
  const parsed = parseStructuredAddress(initialAddress);
  const [doorNumber, setDoorNumber] = useState(initialDoorNumber || parsed.doorNumber);
  const [houseName, setHouseName] = useState(initialHouseName || parsed.houseName);
  const [streetLocation, setStreetLocation] = useState(parsed.streetLocation || initialAddress);
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({
    lat: initialLat,
    lng: initialLng,
  });

  const colors = {
    amber: {
      accent: "#f59e0b",
      ring: "focus:ring-amber-500/20 focus:border-amber-500",
      bg: "bg-amber-50/60",
      border: "border-amber-200/80",
      text: "text-amber-800",
    },
    blue: {
      accent: "#3b82f6",
      ring: "focus:ring-blue-500/20 focus:border-blue-500",
      bg: "bg-blue-50/60",
      border: "border-blue-200/80",
      text: "text-blue-800",
    },
    teal: {
      accent: "#1f5961",
      ring: "focus:ring-teal-500/20 focus:border-teal-500",
      bg: "bg-teal-50/60",
      border: "border-teal-200/80",
      text: "text-teal-800",
    },
  };

  const theme = colors[accentColor] || colors.amber;

  // Recalculate full address on changes
  const updateAddress = useCallback(
    (newDoor: string, newHouse: string, newStreet: string, lat?: number, lng?: number) => {
      const full = combineStructuredAddress(newDoor, newHouse, newStreet);
      onAddressChange({
        fullAddress: full,
        doorNumber: newDoor,
        houseName: newHouse,
        streetLocation: newStreet,
        latitude: lat ?? coords.lat,
        longitude: lng ?? coords.lng,
      });
    },
    [coords.lat, coords.lng, onAddressChange]
  );

  const handleDoorChange = (val: string) => {
    setDoorNumber(val);
    updateAddress(val, houseName, streetLocation);
  };

  const handleHouseChange = (val: string) => {
    setHouseName(val);
    updateAddress(doorNumber, val, streetLocation);
  };

  const handleLocationSelect = (loc: LocationData) => {
    setStreetLocation(loc.address);
    setCoords({ lat: loc.latitude, lng: loc.longitude });
    updateAddress(doorNumber, houseName, loc.address, loc.latitude, loc.longitude);
  };

  const fullCombined = combineStructuredAddress(doorNumber, houseName, streetLocation);

  return (
    <div className="space-y-4 text-left">
      {/* 2 Manual Input Fields: Door Number & House/Apartment Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Door Number */}
        <div className="space-y-1">
          <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-slate-400" />
            <span>Door / House No.</span>
          </label>
          <input
            type="text"
            value={doorNumber}
            onChange={(e) => handleDoorChange(e.target.value)}
            placeholder="e.g. 76-8/5-13A or D.No 12"
            className={`w-full px-3.5 py-2.5 text-xs font-bold border border-slate-200 rounded-xl outline-none bg-white transition-all ${theme.ring}`}
          />
        </div>

        {/* House / Apartment Name */}
        <div className="space-y-1">
          <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>House / Apartment Name</span>
          </label>
          <input
            type="text"
            value={houseName}
            onChange={(e) => handleHouseChange(e.target.value)}
            placeholder="e.g. Bommarillu Apartment, Surya Nilayam"
            className={`w-full px-3.5 py-2.5 text-xs font-bold border border-slate-200 rounded-xl outline-none bg-white transition-all ${theme.ring}`}
          />
        </div>
      </div>

      {/* Map Location Field (Street Level Onward) */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Select Street & Area on Map {required && "*"}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-normal">Street level onward</span>
        </label>
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <MapLocationPicker
            onLocationSelect={handleLocationSelect}
            initialAddress={streetLocation}
            initialLat={coords.lat}
            initialLng={coords.lng}
            accentColor={accentColor}
            height={height}
            compact={compact}
          />
        </div>
      </div>

      {/* Live Formatted Address Preview */}
      {showPreview && fullCombined && (
        <div className={`p-3.5 rounded-2xl ${theme.bg} border ${theme.border} flex items-start gap-2.5 transition-all`}>
          <span className="text-base mt-0.5 shrink-0">📍</span>
          <div className="min-w-0 flex-1">
            <p className={`text-[10px] font-black uppercase tracking-wider ${theme.text} mb-0.5`}>
              Complete Formatted Address
            </p>
            <p className="text-xs font-bold text-slate-800 leading-relaxed break-words">
              {fullCombined}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
