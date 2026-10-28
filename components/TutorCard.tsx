"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Star, MapPin, GraduationCap, Briefcase, Phone,
    MessageSquare, ArrowRight, Check, CheckCircle2, ChevronRight,
    Wallet, Home, Laptop, Swords, BookOpen, Music, Code, ShieldCheck, Clock
} from "lucide-react";
import { getPublicLocality } from "@/lib/geoUtils";
import { formatClassSummary } from "@/lib/classConstants";

export interface TutorCardProps {
    tutor: {
        id: string;
        name: string;
        phone?: string | null;
        profilePhoto?: string | null;
        image?: string | null;
        education?: string | null;
        qualificationName?: string | null;
        experience?: string | null;
        address?: string | null;
        location?: string | null;
        subjects?: any;
        subjectsList?: string[];
        subject?: string;
        teachingMode?: any;
        modesList?: string[];
        classesOrAgeGroup?: any;
        classes?: string;
        hourlyRate?: number | string | null;
        expectedFee?: number | string | null;
        feeType?: string | null;
        isApproved?: boolean;
        rating?: number | string;
        reviewsCount?: number;
        distanceKm?: number | null;
    };
    onSelect?: () => void;
}

export default function TutorCard({ tutor, onSelect }: TutorCardProps) {
    const [imgError, setImgError] = useState(false);

    // Profile photo resolution: check tutor.profilePhoto, tutor.user.profilePhoto, tutor.image, tutor.avatar
    const rawPhoto =
        tutor.profilePhoto ||
        (tutor as any).user?.profilePhoto ||
        tutor.image ||
        (tutor as any).avatar ||
        (tutor as any).user?.image;
    const photoUrl = typeof rawPhoto === "string" && rawPhoto.trim().length > 0 ? rawPhoto.trim() : null;

    // Subjects list parsing
    let parsedSubjects: string[] = [];
    if (Array.isArray(tutor.subjectsList)) {
        parsedSubjects = tutor.subjectsList;
    } else if (Array.isArray(tutor.subjects)) {
        parsedSubjects = tutor.subjects;
    } else if (typeof tutor.subjects === "string") {
        try {
            const arr = JSON.parse(tutor.subjects);
            if (Array.isArray(arr)) parsedSubjects = arr;
            else parsedSubjects = [tutor.subjects];
        } catch {
            parsedSubjects = [tutor.subjects];
        }
    } else if (tutor.subject) {
        parsedSubjects = [tutor.subject];
    }

    // Clean subjects (strip parenthesis with class names e.g. "Mathematics (Class 1-10)" -> "Mathematics")
    const cleanSubjects = parsedSubjects.map((s) =>
        String(s).replace(/\s*\(.*?\)$/, "").trim()
    ).filter(Boolean);

    const primarySubject = cleanSubjects[0] || tutor.subject || "All Subjects";

    // Dynamic icon for primary subject
    const getSubjectIcon = (sub: string) => {
        const lower = sub.toLowerCase();
        if (lower.includes("chess")) return Swords;
        if (lower.includes("music") || lower.includes("violin") || lower.includes("guitar") || lower.includes("piano")) return Music;
        if (lower.includes("code") || lower.includes("robot") || lower.includes("computer")) return Code;
        return BookOpen;
    };
    const SubjectIcon = getSubjectIcon(primarySubject);

    // Parse teaching modes
    let modes: string[] = [];
    if (Array.isArray(tutor.modesList)) {
        modes = tutor.modesList;
    } else if (tutor.teachingMode) {
        try {
            const parsed = typeof tutor.teachingMode === "string" ? JSON.parse(tutor.teachingMode) : tutor.teachingMode;
            if (Array.isArray(parsed)) modes = parsed;
            else if (typeof parsed === "string") modes = [parsed];
        } catch {
            modes = String(tutor.teachingMode).split(",").map((s) => s.trim());
        }
    }

    const hasStudentHome = modes.some((m) => m.toLowerCase().includes("student") || m.toLowerCase().includes("home tutor"));
    const hasTeacherHome = modes.some((m) => m.toLowerCase().includes("teacher") || m.toLowerCase().includes("centre"));
    const hasOnline = modes.some((m) => m.toLowerCase().includes("online"));

    // Classes Taught summary: always sorted chronologically
    let rawClassesSummary = "";
    if (tutor.classesOrAgeGroup) {
        rawClassesSummary = formatClassSummary(tutor.classesOrAgeGroup);
    } else if (tutor.classes) {
        rawClassesSummary = formatClassSummary(tutor.classes);
    }
    if (!rawClassesSummary) rawClassesSummary = "All Grades";

    // Clean up long verbose strings into clean, sharp display
    const classesSummary = rawClassesSummary
        .replace(/Intermediate\s*\([^)]*\)/gi, "Class 11-12")
        .replace(/Intermediate/gi, "Class 11-12")
        .replace(/Kindergarten/gi, "KG")
        .replace(/\s+to\s+/gi, " - ")
        .replace(/\s+/g, " ")
        .trim();

    // Experience summary
    let experienceSummary = tutor.experience || "10+ years";
    if (!experienceSummary.toLowerCase().includes("exp") && !experienceSummary.toLowerCase().includes("year")) {
        experienceSummary = `${experienceSummary} Exp.`;
    }

    // Clean locality extraction
    const rawLocation = tutor.location || getPublicLocality(tutor.address || "") || "Vijayawada";
    const fullLocationDisplay = rawLocation;
    
    // Extract sharp, concise locality name (avoiding 8-line street directions)
    let locationDisplay = "Vijayawada";
    if (rawLocation && rawLocation.trim()) {
        const parts = rawLocation.split(",").map((p) => p.trim()).filter(Boolean);
        const nonStreetParts = parts.filter(
            (p) => !/^(near|opp|opposite|behind|beside|h\.?no|d\.?no|plot|flat|room|road)/i.test(p)
        );
        if (nonStreetParts.length >= 2) {
            locationDisplay = `${nonStreetParts[0]}, ${nonStreetParts[1]}`;
        } else if (nonStreetParts.length === 1) {
            locationDisplay = nonStreetParts[0];
        } else {
            locationDisplay = parts[0];
        }
    }

    // Distance from selected location resolution
    const hasDistance = tutor.distanceKm !== undefined && tutor.distanceKm !== null && !isNaN(Number(tutor.distanceKm)) && Number(tutor.distanceKm) < 999;
    const distanceKmNum = hasDistance ? Number(tutor.distanceKm) : null;
    const distanceAwayText = distanceKmNum !== null ? (distanceKmNum < 0.1 ? "Nearby (< 100m)" : distanceKmNum < 1 ? `${Math.round(distanceKmNum * 1000)}m away` : `${distanceKmNum.toFixed(1)} km away`) : null;

    // Properly map fee and feeType directly from the tutor's record
    const isMonthly = Boolean(
        tutor.feeType === "/month" ||
        tutor.feeType === "month" ||
        tutor.feeType === "per month" ||
        (typeof tutor.feeType === "string" && tutor.feeType.toLowerCase().includes("month")) ||
        (typeof tutor.expectedFee === "string" && tutor.expectedFee.toLowerCase().includes("month"))
    );

    let rawFee = tutor.expectedFee || tutor.hourlyRate || "500";
    if (typeof rawFee === "string") {
        rawFee = rawFee.replace(/[^\d]/g, "") || "500";
    }
    const feeNum = Number(rawFee) > 0 ? Number(rawFee) : 500;
    const feeUnit = isMonthly ? "/ month" : "/ hr";
    const feeLabel = isMonthly ? "Fee (Monthly)" : "Fee (Hourly)";
    const feeDisplay = `₹${feeNum.toLocaleString()} ${feeUnit}`;
    const feeSubtitle = isMonthly ? "Per month fee" : "Flexible timings available";

    // Real Review & Rating resolution
    const realReviewsCount = tutor.reviewsCount !== undefined && tutor.reviewsCount !== null && !isNaN(Number(tutor.reviewsCount))
        ? Number(tutor.reviewsCount)
        : null;

    const realRating = tutor.rating !== undefined && tutor.rating !== null && !isNaN(Number(tutor.rating)) && Number(tutor.rating) > 0
        ? Number(tutor.rating).toFixed(1)
        : null;

    return (
        <div className="relative bg-white rounded-[1.75rem] sm:rounded-[2rem] border border-slate-200/90 p-4 sm:p-5 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group h-full text-left">
            
            {/* Top-left decorative curved yellow arc matching mockup */}
            <div className="absolute top-0 left-0 w-36 sm:w-44 h-20 sm:h-24 overflow-hidden pointer-events-none -z-0">
                <svg viewBox="0 0 180 100" fill="none" className="w-full h-full">
                    <path d="M0 0 H 180 C 115 35, 45 68, 0 68 Z" fill="#ffb800" />
                </svg>
            </div>

            <div className="space-y-3 sm:space-y-3.5 relative z-10">
                
                {/* ──── TOP ROW: AVATAR + TITLES + VERIFIED & RATING ──── */}
                <div className="flex items-start justify-between gap-2.5 sm:gap-3 pt-1">
                    
                    {/* Avatar with Green Verified Badge ONLY if isApproved === true */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 sm:border-3 border-white shadow-md bg-white shrink-0 z-10">
                        {photoUrl && !imgError ? (
                            <img
                                src={photoUrl}
                                alt={tutor.name}
                                className="w-full h-full rounded-full object-cover"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-black text-lg sm:text-xl flex items-center justify-center">
                                {(tutor.name || "T")[0]}
                            </div>
                        )}
                        {/* Green Checkmark Circle Badge ONLY IF VERIFIED */}
                        {tutor.isApproved && (
                            <div className="absolute bottom-0 right-0 w-4.5 h-4.5 sm:w-5 sm:h-5 bg-[#00b074] text-white rounded-full flex items-center justify-center border-2 border-white shadow-xs z-20" title="Verified Tutor">
                                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                            </div>
                        )}
                    </div>

                    {/* Tutor Name & Headline */}
                    <div className="flex-1 min-w-0 pl-0.5">
                        <Link href={`/tutor/${tutor.id}`}>
                            <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-amber-500 transition-colors leading-snug break-normal line-clamp-2 cursor-pointer" title={tutor.name}>
                                {tutor.name}
                            </h3>
                        </Link>
                        <p className="text-[11px] sm:text-xs font-bold text-slate-700 mt-0.5 leading-tight break-normal line-clamp-1" title={tutor.qualificationName || ""}>
                            {tutor.qualificationName || (cleanSubjects[0] ? `${cleanSubjects[0]} Educator` : "Dedicated Mentor")}
                        </p>
                        <p className="text-[10px] sm:text-[10.5px] font-semibold text-slate-400 mt-0.5 leading-tight break-normal line-clamp-1" title={tutor.education || ""}>
                            {tutor.education || "Qualified Mentor"}
                        </p>
                    </div>

                    {/* Verification & Rating Badges (Top Right) */}
                    <div className="flex flex-col items-end gap-1 shrink-0 pt-0.5">
                        <div className="flex items-center gap-1">
                            {tutor.isApproved ? (
                                <div className="px-2.5 py-0.5 bg-[#ffdf78] text-slate-950 font-black rounded-full text-[10px] flex items-center gap-1 shadow-2xs border border-amber-300" title="Verified Tutor">
                                    <CheckCircle2 className="w-3 h-3 fill-slate-950 text-[#ffdf78]" />
                                    <span>Verified</span>
                                </div>
                            ) : (
                                <div className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold rounded-full text-[10px] flex items-center gap-1 border border-slate-200" title="Pending Admin Verification">
                                    <Clock className="w-2.5 h-2.5 text-slate-400" />
                                    <span>Pending</span>
                                </div>
                            )}
                        </div>

                        <Link
                            href={`/tutor/${tutor.id}`}
                            className="flex items-center gap-1 text-[11px] font-black text-slate-800 mt-0.5 hover:text-amber-600 transition-colors"
                            title={realReviewsCount !== null && realReviewsCount > 0 ? `${realReviewsCount} verified review(s)` : "New tutor on Aacharya"}
                        >
                            <Star className={`w-3.5 h-3.5 shrink-0 ${realReviewsCount !== null && realReviewsCount > 0 ? "fill-amber-400 text-amber-400" : "text-amber-400"}`} />
                            {realReviewsCount !== null && realReviewsCount > 0 ? (
                                <>
                                    <span>{realRating || "5.0"}</span>
                                    <span className="text-slate-400 font-bold">({realReviewsCount})</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-amber-600 font-black">New</span>
                                    <span className="text-slate-400 font-medium">(0)</span>
                                </>
                            )}
                            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                        </Link>
                    </div>

                </div>

                {/* ──── SUBJECT & PROFICIENCY ROW ──── */}
                <div className="bg-[#fffdf7] border border-amber-100/90 rounded-2xl p-2 sm:p-2.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 pl-0.5 sm:pl-1 pr-1.5 sm:pr-2">
                        <SubjectIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800 shrink-0" />
                        <span className="font-black text-xs sm:text-sm text-slate-900 truncate">
                            {primarySubject}
                        </span>
                    </div>

                    {/* Tags matching mockup */}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 ml-auto">
                        {cleanSubjects.length > 1 ? (
                            cleanSubjects.slice(1, 4).map((sub, i) => (
                                <span
                                    key={i}
                                    className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-amber-50/80 text-amber-900 rounded-xl text-[10px] sm:text-[11px] font-bold border border-amber-200/50"
                                >
                                    {sub}
                                </span>
                            ))
                        ) : (
                            <>
                                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-amber-50/80 text-amber-900 rounded-xl text-[10px] sm:text-[11px] font-bold border border-amber-200/50">
                                    Beginner
                                </span>
                                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-amber-50/80 text-amber-900 rounded-xl text-[10px] sm:text-[11px] font-bold border border-amber-200/50">
                                    Intermediate
                                </span>
                                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-amber-50/80 text-amber-900 rounded-xl text-[10px] sm:text-[11px] font-bold border border-amber-200/50">
                                    Advanced
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* ──── 3-COLUMN STATS GRID (Classes, Experience, Location) ──── */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-0.5 items-stretch">
                    
                    {/* Classes Taught */}
                    <div className="bg-[#fcfaf5] border border-amber-200/50 rounded-xl p-2 flex flex-col justify-between min-w-0" title={classesSummary}>
                        <div className="flex items-center gap-1 text-slate-500">
                            <GraduationCap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-wider truncate">
                                Classes
                            </span>
                        </div>
                        <div className="text-[11px] sm:text-[11.5px] font-black text-slate-900 leading-tight mt-1.5 break-normal line-clamp-2">
                            {classesSummary}
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="bg-[#fcfaf5] border border-amber-200/50 rounded-xl p-2 flex flex-col justify-between min-w-0" title={experienceSummary}>
                        <div className="flex items-center gap-1 text-slate-500">
                            <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-wider truncate">
                                Exp.
                            </span>
                        </div>
                        <div className="text-[11px] sm:text-[11.5px] font-black text-slate-900 leading-tight mt-1.5 break-normal line-clamp-2">
                            {experienceSummary}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-[#fcfaf5] border border-amber-200/50 rounded-xl p-2 flex flex-col justify-between min-w-0" title={`${fullLocationDisplay}${distanceAwayText ? ` • ${distanceAwayText}` : ""}`}>
                        <div className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-wider truncate">
                                Location
                            </span>
                        </div>
                        {distanceAwayText ? (
                            <div className="mt-1 min-w-0 leading-tight">
                                <div className="text-[11px] sm:text-[11.5px] font-black text-slate-900 truncate">
                                    {locationDisplay}
                                </div>
                                <div className="text-[9px] sm:text-[9.5px] font-extrabold text-amber-700 truncate mt-0.5 flex items-center gap-0.5">
                                    <span>📍 {distanceAwayText}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-[11px] sm:text-[11.5px] font-black text-slate-900 leading-tight mt-1.5 break-normal line-clamp-2">
                                {locationDisplay}
                            </div>
                        )}
                    </div>

                </div>

                {/* ──── TEACHING MODE ──── */}
                <div className="space-y-1 sm:space-y-1.5 pt-0.5">
                    <span className="text-[11px] sm:text-xs font-bold text-slate-600 block">Teaching Mode</span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                        <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-blue-50/80 text-blue-700 border border-blue-100 text-[10.5px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5">
                            <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                            <span>At Student Home</span>
                        </span>
                        <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-blue-50/80 text-blue-700 border border-blue-100 text-[10.5px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5">
                            <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                            <span>At Teacher Home</span>
                        </span>
                        <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-blue-50/80 text-blue-700 border border-blue-100 text-[10.5px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5">
                            <Laptop className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                            <span>Online</span>
                        </span>
                    </div>
                </div>

                {/* ──── FEE RATE CONTAINER ──── */}
                <div className="bg-[#fffcf4] border border-[#fdeec8] rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 sm:gap-3.5 shadow-2xs">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                        <Wallet className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                        <span className="text-[9.5px] sm:text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block leading-tight">
                            {feeLabel}
                        </span>
                        <span className="text-sm sm:text-base font-black text-amber-600 block mt-0.5 leading-tight">
                            {feeDisplay}
                        </span>
                        <span className="text-[9px] sm:text-[9.5px] text-slate-400 font-semibold block mt-0.5 truncate">
                            {feeSubtitle}
                        </span>
                    </div>
                </div>

            </div>

            {/* ──── ACTION BUTTONS (Message, Call, View Profile) ──── */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-3 sm:pt-3.5 mt-3 sm:mt-3.5 border-t border-slate-100">
                <button
                    type="button"
                    onClick={() => {
                        if (tutor.phone) {
                            const cleanPhone = tutor.phone.replace(/\D/g, "").slice(-10);
                            window.open(
                                `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                                    `Hi ${tutor.name}, I found your tutoring profile on Aacharya Academy and would like to inquire about classes.`
                                )}`,
                                "_blank"
                            );
                        } else {
                            window.location.href = `/tutor/${tutor.id}`;
                        }
                    }}
                    className="py-2.5 sm:py-3 px-1 sm:px-2 bg-[#ffb800] hover:bg-[#ffa000] text-slate-950 font-black text-[10.5px] sm:text-xs rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs cursor-pointer active:scale-95 border-none"
                    title="Message Tutor"
                >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>Message</span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        if (tutor.phone) {
                            window.open(`tel:${tutor.phone}`, "_self");
                        } else {
                            window.location.href = `/tutor/${tutor.id}`;
                        }
                    }}
                    className="py-2.5 sm:py-3 px-1 sm:px-2 bg-[#00b074] hover:bg-[#009c66] text-white font-black text-[10.5px] sm:text-xs rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs cursor-pointer active:scale-95 border-none"
                    title="Call Tutor"
                >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>Call</span>
                </button>

                <Link
                    href={`/tutor/${tutor.id}`}
                    className="py-2.5 sm:py-3 px-1 sm:px-2 bg-[#0f172a] hover:bg-slate-800 text-white font-black text-[10.5px] sm:text-xs rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs cursor-pointer active:scale-95 text-center"
                    title="View Full Profile"
                >
                    <span className="whitespace-nowrap">View Profile</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                </Link>
            </div>

        </div>
    );
}
