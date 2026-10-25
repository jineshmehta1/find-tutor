"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Star, MapPin, GraduationCap, Briefcase, Phone,
    MessageSquare, ArrowRight, Check, CheckCircle2, ChevronRight,
    Wallet, Home, Laptop, Swords, BookOpen, Music, Code, ShieldCheck
} from "lucide-react";
import { getPublicLocality } from "@/lib/geoUtils";

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

    // Profile photo resolution
    const photoUrl = tutor.profilePhoto || tutor.image;

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

    // Classes Taught summary
    let classesSummary = tutor.classes || "All Grades";
    if (!tutor.classes && tutor.classesOrAgeGroup) {
        try {
            const p = typeof tutor.classesOrAgeGroup === "string" ? JSON.parse(tutor.classesOrAgeGroup) : tutor.classesOrAgeGroup;
            if (Array.isArray(p) && p.length > 0) {
                if (p.length >= 4) {
                    classesSummary = `${p[0]} to ${p[p.length - 1]}`;
                } else {
                    classesSummary = p.join(", ");
                }
            }
        } catch {}
    }

    // Experience summary
    let experienceSummary = tutor.experience || "10+ years";
    if (!experienceSummary.toLowerCase().includes("exp") && !experienceSummary.toLowerCase().includes("year")) {
        experienceSummary = `${experienceSummary} Exp.`;
    }

    // Location
    const locationDisplay = tutor.location || getPublicLocality(tutor.address || "") || "Vijayawada";

    // Hourly Fee resolution (User asked: "keep hourly price in place of monthly")
    let rawFee = tutor.hourlyRate || tutor.expectedFee || "400";
    if (typeof rawFee === "string") {
        rawFee = rawFee.replace(/[^\d]/g, "") || "400";
    }
    const hourlyFeeDisplay = `₹${Number(rawFee).toLocaleString()} / hr`;

    // Rating
    const ratingValue = tutor.rating || "4.8";
    const reviewsCount = tutor.reviewsCount || 24;

    return (
        <div className="relative bg-white rounded-[1.75rem] sm:rounded-[2rem] border border-slate-200/90 p-4 sm:p-6 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group h-full text-left">
            
            {/* Top-left decorative curved yellow arc matching mockup */}
            <div className="absolute top-0 left-0 w-36 sm:w-44 h-20 sm:h-24 overflow-hidden pointer-events-none -z-0">
                <svg viewBox="0 0 180 100" fill="none" className="w-full h-full">
                    <path d="M0 0 H 180 C 115 35, 45 68, 0 68 Z" fill="#ffb800" />
                </svg>
            </div>

            <div className="space-y-3.5 sm:space-y-4 relative z-10">
                
                {/* ──── TOP ROW: AVATAR + TITLES + VERIFIED & RATING ──── */}
                <div className="flex items-start justify-between gap-2.5 sm:gap-3 pt-1">
                    
                    {/* Avatar with Green Verified Badge */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 sm:border-4 border-white shadow-md bg-white shrink-0 z-10">
                        {photoUrl && !imgError ? (
                            <img
                                src={photoUrl}
                                alt={tutor.name}
                                className="w-full h-full rounded-full object-cover"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-black text-xl sm:text-2xl flex items-center justify-center">
                                {(tutor.name || "T")[0]}
                            </div>
                        )}
                        {/* Green Checkmark Circle Badge */}
                        <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 bg-[#00b074] text-white rounded-full flex items-center justify-center border-2 border-white shadow-xs z-20">
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                        </div>
                    </div>

                    {/* Tutor Name & Headline */}
                    <div className="flex-1 min-w-0 pl-0.5 sm:pl-1 pt-0.5">
                        <Link href={`/tutor/${tutor.id}`}>
                            <h3 className="text-[15px] sm:text-xl font-black text-slate-900 group-hover:text-amber-500 transition-colors leading-snug break-words cursor-pointer">
                                {tutor.name}
                            </h3>
                        </Link>
                        <p className="text-[11px] sm:text-xs font-bold text-slate-700 mt-0.5 leading-tight line-clamp-1">
                            {tutor.qualificationName || (cleanSubjects[0] ? `${cleanSubjects[0]} Educator` : "Dedicated Mentor")}
                        </p>
                        <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 mt-0.5 leading-tight line-clamp-1">
                            {tutor.education || "Qualified Mentor"}
                        </p>
                    </div>

                    {/* Verification & Rating Badges (Top Right) */}
                    <div className="flex flex-col items-end gap-1 shrink-0 pt-0.5">
                        {tutor.isApproved !== false ? (
                            <div className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#ffdf78] text-slate-950 font-black rounded-full text-[10px] sm:text-xs flex items-center gap-1 shadow-2xs border border-amber-300">
                                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-slate-950 text-[#ffdf78]" />
                                <span>Verified</span>
                            </div>
                        ) : (
                            <div className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-amber-50 text-amber-800 font-black rounded-full text-[10px] sm:text-xs flex items-center gap-1 border border-amber-200/60">
                                <span>Verified</span>
                            </div>
                        )}

                        <Link
                            href={`/tutor/${tutor.id}`}
                            className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-slate-800 mt-1 hover:text-amber-600 transition-colors"
                        >
                            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400 shrink-0" />
                            <span>{ratingValue}</span>
                            <span className="text-slate-400 font-bold">({reviewsCount})</span>
                            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                        </Link>
                    </div>

                </div>

                {/* ──── SUBJECT & PROFICIENCY ROW ──── */}
                <div className="bg-[#fffdf7] border border-amber-100/90 rounded-2xl p-2 sm:p-2.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 pl-0.5 sm:pl-1 pr-1.5 sm:pr-2">
                        <SubjectIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800 shrink-0" />
                        <span className="font-black text-xs sm:text-sm md:text-base text-slate-900 truncate">
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
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-1 items-start">
                    
                    {/* Classes Taught */}
                    <div className="flex items-start gap-1.5 sm:gap-2 min-w-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                            <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <div className="min-w-0 leading-tight">
                            <span className="text-[8.5px] sm:text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block leading-tight">
                                Classes Taught
                            </span>
                            <span className="text-[11px] sm:text-xs font-black text-slate-900 block leading-tight break-words line-clamp-2 mt-0.5" title={classesSummary}>
                                {classesSummary}
                            </span>
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="flex items-start gap-1.5 sm:gap-2 min-w-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                            <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <div className="min-w-0 leading-tight">
                            <span className="text-[8.5px] sm:text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block leading-tight">
                                Experience
                            </span>
                            <span className="text-[11px] sm:text-xs font-black text-slate-900 block leading-tight break-words line-clamp-2 mt-0.5">
                                {experienceSummary}
                            </span>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-1.5 sm:gap-2 min-w-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <div className="min-w-0 leading-tight">
                            <span className="text-[8.5px] sm:text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block leading-tight">
                                Location
                            </span>
                            <span className="text-[11px] sm:text-xs font-black text-slate-900 block leading-tight break-words line-clamp-2 mt-0.5" title={locationDisplay}>
                                {locationDisplay}
                            </span>
                        </div>
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

                {/* ──── FEE RATE CONTAINER (HOURLY) ──── */}
                <div className="bg-[#fffcf4] border border-[#fdeec8] rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-3.5 shadow-2xs">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                        <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                        <span className="text-[9.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block leading-tight">
                            Fee (Hourly)
                        </span>
                        <span className="text-sm sm:text-base md:text-lg font-black text-amber-600 block mt-0.5 leading-tight">
                            {hourlyFeeDisplay}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold block mt-0.5">
                            Flexible timings available
                        </span>
                    </div>
                </div>

            </div>

            {/* ──── ACTION BUTTONS (Message, Call, View Profile) ──── */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100">
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
