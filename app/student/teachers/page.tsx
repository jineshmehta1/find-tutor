"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Search, MapPin, BookOpen, Star, Phone,
    User, GraduationCap, Award, X, Loader2,
    Sparkles, ShieldCheck, CheckCircle2, ArrowRight,
    MessageSquare, Users, Locate, RotateCcw, Clock,
    Laptop, Briefcase
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MapLocationPicker from "@/components/ui/DynamicMapPicker";
import {
    smartReverseGeocode,
    getBrowserCoordinates,
    getPublicLocality,
    calculateHaversineDistance,
    matchesTeachingMode,
    geocodeAddressToCoords,
    KNOWN_LOCALITIES
} from "@/lib/geoUtils";
import {
    STANDARD_CLASSES,
    ACADEMIC_SUBJECTS,
    ACTIVITY_SUBJECTS,
    ALL_STANDARD_SUBJECTS,
    STANDARD_TEACHING_MODES,
    matchesClassLevel
} from "@/lib/classConstants";
import TutorCard from "@/components/TutorCard";

interface Teacher {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    profilePhoto: string | null;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    education: string;
    experience: string;
    subjects: string[];
    teachingMode?: string;
    expectedFee?: number | null;
    feeType?: string | null;
    classesOrAgeGroup?: any;
    qualificationLevel?: string | null;
    qualificationName?: string | null;
    isApproved?: boolean;
    distanceKm?: number | null;
}

// Clean subjects list (strip raw class breakdown suffix e.g. "Mathematics (Class 1-10)" -> "Mathematics")
const cleanSubjectName = (sub: string): string => {
    return (sub || "").replace(/\s*\(.*?\)$/, "").trim();
};

const isActivityTutor = (subjects: string[]): boolean => {
    return (subjects || []).some(sub => {
        const lower = (sub || "").toLowerCase();
        return (
            lower.includes("chess") ||
            lower.includes("yoga") ||
            lower.includes("abacus") ||
            lower.includes("music") ||
            lower.includes("dance") ||
            lower.includes("cricket") ||
            lower.includes("coach") ||
            lower.includes("drawing") ||
            lower.includes("art") ||
            lower.includes("sports") ||
            lower.includes("coding") ||
            lower.includes("robotics") ||
            ACTIVITY_SUBJECTS.some(act => lower.includes(act.toLowerCase()))
        );
    });
};

function TeachersDirectory() {
    const searchParams = useSearchParams();

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);

    // Search Tabs: "all" | "academics" | "activities"
    const [activeSearchTab, setActiveSearchTab] = useState<"all" | "academics" | "activities">("all");

    // Search Fields matching homepage
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const [searchSubject, setSearchSubject] = useState(searchParams.get("subject") || "");
    const [searchClass, setSearchClass] = useState(searchParams.get("classLevel") || "");
    const [searchLocation, setSearchLocation] = useState(searchParams.get("location") || "");
    const [searchLat, setSearchLat] = useState<number | null>(
        searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null
    );
    const [searchLng, setSearchLng] = useState<number | null>(
        searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null
    );
    const [searchMode, setSearchMode] = useState(searchParams.get("mode") || "");
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    useEffect(() => {
        fetchTeachers();

        // If no location in search params, prefill logged-in student's location
        if (!searchParams.get("location") && !searchParams.get("lat")) {
            fetch("/api/students")
                .then(r => r.ok ? r.json() : null)
                .then(async (profile) => {
                    if (profile?.address) {
                        setSearchLocation(profile.address);
                        if (profile.latitude && profile.longitude) {
                            setSearchLat(profile.latitude);
                            setSearchLng(profile.longitude);
                        } else {
                            const coords = await geocodeAddressToCoords(profile.address);
                            if (coords) {
                                setSearchLat(coords.latitude);
                                setSearchLng(coords.longitude);
                            }
                        }
                    }
                })
                .catch(() => {});
        }
    }, []);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            // Fetch all approved and registered teachers
            const res = await fetch("/api/teachers?approved=false", { cache: "no-store" });
            if (!res.ok) throw new Error();
            const data = await res.json();
            if (Array.isArray(data)) {
                // Prioritize approved teachers first
                const sorted = [...data].sort((a: any, b: any) => (b.isApproved ? 1 : 0) - (a.isApproved ? 1 : 0));
                setTeachers(sorted);
            }
        } catch {
            toast.error("Failed to load tutors directory");
        } finally {
            setLoading(false);
        }
    };

    // Location detection via browser GPS
    const handleDetectLocation = async () => {
        const loadingToast = toast.loading("Detecting your location...");
        try {
            const { latitude, longitude } = await getBrowserCoordinates(8000);
            setSearchLat(latitude);
            setSearchLng(longitude);
            const cleanAddress = await smartReverseGeocode(latitude, longitude);
            setSearchLocation(cleanAddress);
            toast.success(`Location detected: ${cleanAddress}`, { id: loadingToast });
        } catch {
            toast.error("Unable to detect GPS location. Please select on map.", { id: loadingToast });
        }
    };

    // Quick select popular search pill
    const selectPopularSearch = (subjectName: string, isCoach = false) => {
        setSearchSubject(subjectName);
        if (isCoach) {
            setActiveSearchTab("activities");
        } else {
            setActiveSearchTab("academics");
        }
    };

    // Reset filters
    const handleResetFilters = () => {
        setSearchTerm("");
        setSearchSubject("");
        setSearchClass("");
        setSearchLocation("");
        setSearchLat(null);
        setSearchLng(null);
        setSearchMode("");
        setActiveSearchTab("all");
        toast.info("Filters reset");
    };

    // Current subjects list according to active tab
    const currentSubjectOptions = useMemo(() => {
        if (activeSearchTab === "academics") return ACADEMIC_SUBJECTS;
        if (activeSearchTab === "activities") return ACTIVITY_SUBJECTS;
        return ALL_STANDARD_SUBJECTS;
    }, [activeSearchTab]);

    // Robust client-side filter
    const filteredTeachers = useMemo(() => {
        const withDist = teachers.map((tutor) => {
            let distanceKm: number | null = tutor.distanceKm ?? null;
            let tLat = tutor.latitude;
            let tLng = tutor.longitude;

            // If coordinates not directly on tutor, look up known locality
            if ((tLat === null || tLat === undefined || tLng === null || tLng === undefined) && tutor.address) {
                const cleanAddr = tutor.address.toLowerCase().trim();
                for (const [key, coords] of Object.entries(KNOWN_LOCALITIES)) {
                    if (cleanAddr.includes(key)) {
                        tLat = coords.lat;
                        tLng = coords.lng;
                        break;
                    }
                }
            }

            if (searchLat !== null && searchLng !== null && tLat && tLng) {
                distanceKm = calculateHaversineDistance(searchLat, searchLng, tLat, tLng);
            }
            return { ...tutor, latitude: tLat, longitude: tLng, distanceKm };
        });

        const list = withDist.filter((tutor) => {
            const subjectsList = Array.isArray(tutor.subjects) ? tutor.subjects : [];
            const isCoach = isActivityTutor(subjectsList);

            // Tab filter
            if (activeSearchTab === "academics") {
                const teachesAcademic = subjectsList.some(s =>
                    ACADEMIC_SUBJECTS.some(ac => s.toLowerCase().includes(ac.toLowerCase()))
                );
                if (!teachesAcademic && isCoach) return false;
            } else if (activeSearchTab === "activities") {
                if (!isCoach) return false;
            }

            // Search by Tutor Name / Keyword / Education
            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase().trim();
                const nameMatch = (tutor.name || "").toLowerCase().includes(term);
                const eduMatch = (tutor.education || "").toLowerCase().includes(term);
                const qualMatch = (tutor.qualificationName || "").toLowerCase().includes(term);
                const subMatch = subjectsList.some(s => (s || "").toLowerCase().includes(term));
                if (!nameMatch && !eduMatch && !qualMatch && !subMatch) {
                    return false;
                }
            }

            // Subject Filter
            if (searchSubject && searchSubject !== "All Subjects") {
                const subTerm = searchSubject.toLowerCase().trim();
                const matchesSub = subjectsList.some(s => (s || "").toLowerCase().includes(subTerm));
                if (!matchesSub) return false;
            }

            // Class Level Filter
            if (searchClass && searchClass !== "All" && searchClass !== "") {
                if (!matchesClassLevel(tutor.classesOrAgeGroup, searchClass, tutor.subjects)) {
                    return false;
                }
            }

            // Mode Filter
            if (searchMode && searchMode !== "All" && searchMode !== "") {
                if (!matchesTeachingMode(tutor.teachingMode, searchMode)) {
                    return false;
                }
            }

            // Location Filter
            if (searchLat !== null && searchLng !== null && tutor.latitude && tutor.longitude) {
                if (tutor.distanceKm !== null && tutor.distanceKm > 50) return false;
            } else if (searchLocation.trim()) {
                const terms = searchLocation.toLowerCase().split(/[\s,]+/).filter(Boolean);
                const addr = (tutor.address || "").toLowerCase();
                const matchesLoc = terms.some(term => addr.includes(term));
                if (!matchesLoc) return false;
            }

            return true;
        });

        if (searchLat !== null && searchLng !== null) {
            list.sort((a, b) => {
                if (a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm;
                if (a.distanceKm !== null) return -1;
                if (b.distanceKm !== null) return 1;
                return 0;
            });
        }

        return list;
    }, [teachers, activeSearchTab, searchTerm, searchSubject, searchClass, searchMode, searchLocation, searchLat, searchLng]);

    const activeFilterCount = [
        searchTerm,
        searchSubject,
        searchClass,
        searchLocation,
        searchMode,
        activeSearchTab !== "all" ? activeSearchTab : ""
    ].filter(Boolean).length;

    return (
        <div className="space-y-6 pb-12 p-4 sm:p-6 md:p-8 bg-slate-50 min-h-[calc(100vh-70px)] font-sans">
            
            {/* Header banner */}
            <div className="bg-[#ffb800] p-6 sm:p-8 rounded-3xl text-slate-950 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-bold rounded-full border border-slate-950/10">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Educator Directory</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">Verified Mentors & Tutors</h1>
                    <p className="text-xs sm:text-sm text-slate-900/85 font-medium max-w-xl">
                        Directly connect with top-rated tutors and coaches near your area via message or call.
                    </p>
                </div>
            </div>

            {/* HOMEPAGE-PARITY SEARCH BAR WIDGET */}
            <div className="bg-white rounded-3xl shadow-md border border-slate-200/80 p-4 sm:p-6 space-y-4">
                
                <div className="flex items-center justify-between">
                    <h3 className="text-slate-900 font-extrabold text-sm md:text-base text-left">
                        What are you looking for?
                    </h3>
                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Filters ({activeFilterCount})</span>
                        </button>
                    )}
                </div>

                {/* Tab Toggles (Matching Homepage) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 border-b border-slate-100 pb-3.5">
                    
                    {/* Tab 0: All Mentors */}
                    <button
                        type="button"
                        onClick={() => {
                            setActiveSearchTab("all");
                            setSearchSubject("");
                        }}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl transition-all text-left border cursor-pointer ${
                            activeSearchTab === "all"
                                ? "bg-amber-50/70 border-amber-300 text-slate-900 shadow-xs"
                                : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                        }`}
                    >
                        <div className={`p-2 rounded-xl shrink-0 ${activeSearchTab === "all" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400"}`}>
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="leading-tight">
                            <span className="block font-black text-xs">All Mentors</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Teachers & Coaches</span>
                        </div>
                    </button>

                    {/* Tab 1: Academics */}
                    <button
                        type="button"
                        onClick={() => {
                            setActiveSearchTab("academics");
                            setSearchSubject("");
                        }}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl transition-all text-left border cursor-pointer ${
                            activeSearchTab === "academics"
                                ? "bg-[#fef9eb] border-[#fbebc6] text-slate-900 shadow-xs"
                                : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                        }`}
                    >
                        <div className={`p-2 rounded-xl shrink-0 ${activeSearchTab === "academics" ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"}`}>
                            <GraduationCap className="w-4 h-4" />
                        </div>
                        <div className="leading-tight">
                            <span className="block font-black text-xs">Find a Teacher (Academics)</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">For Classes 1 to 12 Subjects</span>
                        </div>
                    </button>

                    {/* Tab 2: Activities */}
                    <button
                        type="button"
                        onClick={() => {
                            setActiveSearchTab("activities");
                            setSearchSubject("");
                        }}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl transition-all text-left border cursor-pointer ${
                            activeSearchTab === "activities"
                                ? "bg-[#f5f5ff] border-[#e0e0ff] text-slate-900 shadow-xs"
                                : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                        }`}
                    >
                        <div className={`p-2 rounded-xl shrink-0 ${activeSearchTab === "activities" ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"}`}>
                            <Users className="w-4 h-4" />
                        </div>
                        <div className="leading-tight">
                            <span className="block font-black text-xs">Find a Coach (Activities)</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Curricular & Co-curricular</span>
                        </div>
                    </button>

                </div>

                {/* Search Input Row Form (Matching Homepage 5-column grid) */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-3 items-center">
                        
                        {/* 1. Tutor Name / Keyword Search */}
                        <div className="text-left lg:col-span-3">
                            <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 transition-colors focus-within:border-amber-500 shadow-xs">
                                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search tutor name, education..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-transparent border-none text-[12px] font-bold outline-none text-slate-800 py-1"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchTerm("")}
                                        className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 2. Subject Dropdown */}
                        <div className="text-left lg:col-span-3">
                            <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 transition-colors focus-within:border-amber-500 shadow-xs">
                                <BookOpen className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                                <select
                                    value={searchSubject}
                                    onChange={(e) => setSearchSubject(e.target.value)}
                                    className="w-full bg-transparent border-none text-[12px] font-bold outline-none text-slate-800 py-1 cursor-pointer"
                                >
                                    <option value="">All Subjects & Activities</option>
                                    {currentSubjectOptions.map((sub) => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 3. Class Level Dropdown */}
                        <div className="text-left lg:col-span-2">
                            <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 transition-colors focus-within:border-amber-500 shadow-xs">
                                <GraduationCap className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                                <select
                                    value={searchClass}
                                    onChange={(e) => setSearchClass(e.target.value)}
                                    className="w-full bg-transparent border-none text-[12px] font-bold outline-none text-slate-800 py-1 cursor-pointer"
                                >
                                    <option value="">Select Level</option>
                                    <option value="All">All Grades</option>
                                    {STANDARD_CLASSES.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 4. Location with Autocomplete Modal & GPS Detect */}
                        <div className="text-left lg:col-span-2">
                            <div
                                className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 transition-colors hover:border-amber-500 cursor-pointer shadow-xs"
                                onClick={() => setIsLocationModalOpen(true)}
                            >
                                <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Select Location"
                                    value={searchLocation}
                                    readOnly
                                    className="w-full bg-transparent border-none text-[12px] font-bold outline-none text-slate-800 py-1 cursor-pointer pointer-events-none truncate pr-6 placeholder:text-slate-800 placeholder:font-bold"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDetectLocation();
                                    }}
                                    title="Detect Current Location"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-amber-500 transition-colors cursor-pointer flex items-center justify-center border-none bg-transparent"
                                >
                                    <Locate className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* 5. Mode of Teaching Dropdown */}
                        <div className="text-left lg:col-span-2">
                            <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 transition-colors focus-within:border-amber-500 shadow-xs">
                                <Users className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                                <select
                                    value={searchMode}
                                    onChange={(e) => setSearchMode(e.target.value)}
                                    className="w-full bg-transparent border-none text-[12px] font-bold outline-none text-slate-800 py-1 cursor-pointer"
                                >
                                    <option value="">All Learning Modes</option>
                                    {STANDARD_TEACHING_MODES.map((m) => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>
                </form>

                {/* Popular Searches Row (Matching Homepage) */}
                <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-2 items-center text-[11px] text-slate-500 font-bold">
                    <span className="text-slate-400">Popular Searches:</span>
                    <button type="button" onClick={() => selectPopularSearch("Mathematics")} className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-700 border border-slate-150 transition-colors cursor-pointer">Maths Teacher</button>
                    <button type="button" onClick={() => selectPopularSearch("Physics")} className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-700 border border-slate-150 transition-colors cursor-pointer">Physics Teacher</button>
                    <button type="button" onClick={() => selectPopularSearch("Chemistry")} className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-700 border border-slate-150 transition-colors cursor-pointer">Chemistry Teacher</button>
                    <button type="button" onClick={() => selectPopularSearch("English")} className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-700 border border-slate-150 transition-colors cursor-pointer">English Teacher</button>
                    <button type="button" onClick={() => selectPopularSearch("Yoga", true)} className="px-2.5 py-1 bg-[#fff9eb] border border-[#ffe082] rounded-lg text-amber-900 transition-colors cursor-pointer">Yoga Coach</button>
                    <button type="button" onClick={() => selectPopularSearch("Abacus", true)} className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-700 border border-slate-150 transition-colors cursor-pointer">Abacus Teacher</button>
                    <button type="button" onClick={() => selectPopularSearch("Chess", true)} className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-700 border border-slate-150 transition-colors cursor-pointer">Chess Coach</button>
                    <button type="button" onClick={() => selectPopularSearch("Coding", true)} className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-700 border border-slate-150 transition-colors cursor-pointer">Coding Coach</button>
                </div>

            </div>

            {/* Results Counter Header */}
            <div className="flex items-center justify-between px-1">
                <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        {filteredTeachers.length} {filteredTeachers.length === 1 ? "Educator" : "Educators"} Available
                    </h2>
                    <p className="text-[11px] text-slate-400 font-bold">
                        {activeFilterCount > 0 ? "Showing filtered mentors matching your criteria" : "Showing all verified teachers and coaches"}
                    </p>
                </div>
            </div>

            {/* Tutors Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
                    <Loader2 className="w-8 h-8 text-[#ffb800] animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Loading tutors directory...</p>
                </div>
            ) : filteredTeachers.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-12 sm:p-16 text-center space-y-4 shadow-sm">
                    <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto text-2xl">
                        🔍
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-black text-slate-800">No matching tutors found</h3>
                        <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
                            We couldn't find any educators matching your current search filters. Try clearing your filters or broadening your locality search.
                        </p>
                    </div>
                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="px-5 py-2.5 bg-[#0a1829] hover:bg-amber-500 hover:text-slate-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-1.5"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Clear All Filters</span>
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeachers.map((tutor) => (
                        <TutorCard key={tutor.id} tutor={tutor} />
                    ))}
                </div>
            )}

            {/* Location Selection Modal (Interactive Map & Autocomplete) */}
            <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 bg-white rounded-2xl shadow-2xl">
                    <DialogHeader className="p-5 pb-0">
                        <DialogTitle className="text-sm font-extrabold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                            Select Location
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-5 pt-4">
                        <MapLocationPicker
                            initialAddress={searchLocation}
                            onLocationSelect={(loc) => {
                                setSearchLocation(loc.address);
                                if (loc.latitude && loc.longitude) {
                                    setSearchLat(loc.latitude);
                                    setSearchLng(loc.longitude);
                                }
                                setIsLocationModalOpen(false);
                            }}
                            height="280px"
                            compact={false}
                        />
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}

export default function TeachersPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
                <Loader2 className="w-8 h-8 text-[#ffb800] animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Loading Directory...</p>
            </div>
        }>
            <TeachersDirectory />
        </Suspense>
    );
}
