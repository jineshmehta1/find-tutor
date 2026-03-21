"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { toast } from "sonner";
import MapLocationPicker from "@/components/ui/DynamicMapPicker";
import {
    Search, MapPin, ChevronLeft, ChevronRight,
    Beaker, Mic2, Languages, Music, Swords,
    Accessibility, Car, Code, BookOpen, GraduationCap,
    Heart, Star, Award, Zap, Clock, CheckCircle2, X
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ───────── constants ───────── */
const SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi",
    "History", "Geography", "Computer Science", "Economics", "Accountancy",
    "Business Studies", "Political Science", "Psychology", "Sociology",
    "Sanskrit", "French", "German", "Music", "Art",
    "Chess", "Abacus", "Robotics", "Coding", "Spoken English", "Aptitude"
];
const CLASSES = [
    "Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12",
    "Age 3-5", "Age 5-8", "Age 8-12", "Age 12-16", "Age 16+"
];
const MODES = ["Home Tutor", "Online Tutor", "At Centre"];

/* ───────── types ───────── */
interface Teacher {
    id: string; userId: string; name: string; email: string; phone: string;
    profilePhoto: string | null; address: string; education: string;
    experience: string; certifications: any[]; subjects: string[];
    teachingMode: string | null; classesOrAgeGroup: string[] | null;
    qualificationLevel: string | null; qualificationName: string | null;
    achievements: string | null;
}

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */
export default function FindTutorNearbyPage() {
    const { data: session } = useSession();
    const router = useRouter();

    /* ── search state ── */
    const [location, setLocation] = useState("");
    const [locationLat, setLocationLat] = useState<number | undefined>();
    const [locationLng, setLocationLng] = useState<number | undefined>();
    const [subject, setSubject] = useState("");
    const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);
    
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [filtered, setFiltered] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searched, setSearched] = useState(false);
    const [showHeroMap, setShowHeroMap] = useState(false);
    
    const heroMapRef = useRef<HTMLDivElement>(null);
    const subjectRef = useRef<HTMLDivElement>(null);
    const listingRef = useRef<HTMLDivElement>(null);

    /* ── FAQ state ── */
    const [faqOpen, setFaqOpen] = useState<number | null>(null);

    /* ── post requirement state ── */
    const [reqLocation, setReqLocation] = useState("");
    const [reqLat, setReqLat] = useState<number | undefined>();
    const [reqLng, setReqLng] = useState<number | undefined>();
    const [reqSubject, setReqSubject] = useState("");
    const [reqClass, setReqClass] = useState("");
    const [reqMode, setReqMode] = useState("");
    const [reqMessage, setReqMessage] = useState("");
    const [submittingReq, setSubmittingReq] = useState(false);

    /* ── Click Outside Logic ── */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (heroMapRef.current && !heroMapRef.current.contains(event.target as Node)) {
                setShowHeroMap(false);
            }
            if (subjectRef.current && !subjectRef.current.contains(event.target as Node)) {
                setShowSubjectSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ───────── fetch teachers ───────── */
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/teachers");
                if (!res.ok) throw new Error();
                const data = await res.json();
                setTeachers(data);
                setFiltered(data);
            } catch { /* empty */ } finally { setLoading(false); }
        })();
    }, []);

    /* ───────── search implementation ───────── */
    const performSearch = (overrideSubject?: string, overrideLocation?: string) => {
        const currentSub = overrideSubject !== undefined ? overrideSubject : subject;
        const currentLoc = overrideLocation !== undefined ? overrideLocation : location;

        let result = [...teachers];

        // 1. Improved Location Match (Term-based)
        // Fixes Sikar matching "Sikar, Rajasthan" correctly
        if (currentLoc.trim()) {
            const searchTerms = currentLoc.toLowerCase().split(/[\s,]+/).filter(Boolean);
            result = result.filter(t => {
                if (!t.address) return false;
                const tutorAddress = t.address.toLowerCase();
                return searchTerms.some(term => tutorAddress.includes(term));
            });
        }

        // 2. Subject match
        if (currentSub.trim()) {
            result = result.filter(t => 
                t.subjects?.some(s => s.toLowerCase().includes(currentSub.toLowerCase()))
            );
        }

        setFiltered(result);
        setSearched(true);
        
        // Auto-scroll to results if immediate action taken
        if (overrideSubject || overrideLocation) {
            setTimeout(() => {
                listingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }
    };

    const handleSearch = () => performSearch();

    const handleReset = () => {
        setSubject("");
        setLocation("");
        setLocationLat(undefined);
        setLocationLng(undefined);
        setFiltered(teachers);
        setSearched(false);
        toast.info("All filters cleared");
    };

    /* ───────── login gate ───────── */
    const requireLogin = (action: string) => {
        if (!session) { toast.error(`Please login to ${action}`); router.push("/signup"); return true; }
        return false;
    };

    /* ───────── post requirement ───────── */
    const handlePostRequirement = async () => {
        if (!session) { toast.error("Please login to post requirements"); router.push("/signup"); return; }
        if (!reqSubject && !reqLocation) { toast.error("Please fill in basic details"); return; }
        setSubmittingReq(true);
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location: reqLocation.trim(), latitude: reqLat, longitude: reqLng,
                    subject: reqSubject, classLevel: reqClass, mode: reqMode, message: reqMessage.trim(),
                }),
            });
            if (!res.ok) throw new Error();
            toast.success("Posted! Tutors will contact you soon.");
            setReqLocation(""); setReqSubject(""); setReqMessage("");
        } catch {
            toast.error("Failed to post requirement");
        } finally {
            setSubmittingReq(false);
        }
    };

    const faqs = [
        { q: "Is demo class available?", a: "Yes, demo class is available for most tutors." },
        { q: "Are tutors verified?", a: "Yes, tutors are screened by Aacharya team." },
        { q: "Home tutor or online tutor – which is better?", a: "Depends on child's comfort and subject requirement." },
        { q: "How soon can I get a tutor response?", a: "Usually within 24–48 hours." },
    ];

    const filteredSuggestions = SUBJECTS.filter(s => s.toLowerCase().includes(subject.toLowerCase()));

    /* ═══════════════════════════ RENDER ═══════════════════════════ */
    return (
        <>
            <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">

                {/* ════════════ HERO SECTION ════════════ */}
                <section className="relative w-full pt-20 pb-16 md:pt-28 md:pb-24 overflow-visible bg-gradient-to-b from-amber-50/50 to-white">
                    {/* Background Blobs */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100/40 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-orange-50/30 rounded-full blur-[80px]" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-8 tracking-tight text-center leading-[1.1]">
                            Find your <br />
                            <span className="text-amber-500">perfect teacher</span>
                        </h1>

                        {/* PILL SEARCH BAR (UPDATED) */}
                        <div className="w-full max-w-4xl bg-white rounded-3xl md:rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-100 p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 md:gap-0 relative z-[100]" style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
                            
                            {/* SUBJECT FILTER (TYPING) */}
                            <div className="flex-[1.2] w-full relative" ref={subjectRef}>
                                <div className="flex items-center w-full px-4 md:px-8 py-3 border-b md:border-b-0 md:border-r border-slate-100 min-w-0">
                                    <BookOpen className="w-5 h-5 text-amber-500 shrink-0 mr-4" />
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Subject</p>
                                        <input 
                                            type="text"
                                            value={subject}
                                            onChange={(e) => { setSubject(e.target.value); setShowSubjectSuggestions(true); }}
                                            onFocus={() => setShowSubjectSuggestions(true)}
                                            placeholder='Type "Mathematics"...'
                                            className="w-full bg-transparent outline-none text-slate-700 font-bold text-sm md:text-base placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                                
                                {showSubjectSuggestions && subject.length > 0 && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[110] max-h-60 overflow-y-auto">
                                        {filteredSuggestions.map(s => (
                                            <button 
                                                key={s} 
                                                onClick={() => { setSubject(s); setShowSubjectSuggestions(false); performSearch(s); }}
                                                className="w-full px-6 py-2.5 text-left hover:bg-amber-50 text-sm font-bold text-slate-700 transition-colors"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* LOCATION FILTER (TRUNCATION FIX) */}
                            <div className="flex-1 flex items-center w-full px-4 md:px-8 py-3 min-w-0 relative">
                                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mr-4" />
                                <div className="flex-1 cursor-pointer min-w-0" onClick={() => setShowHeroMap(!showHeroMap)}>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                                    <p className={`text-sm md:text-base font-bold truncate ${location ? 'text-slate-700' : 'text-slate-400'}`}>
                                        {location || "Select area"}
                                    </p>
                                </div>

                                {showHeroMap && (
                                    <div ref={heroMapRef} className="absolute top-full left-0 md:-left-24 mt-6 w-[90vw] md:w-[480px] bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 p-5 z-[120]" style={{ animation: 'fadeInScale 0.3s ease-out' }}>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                                Select Location
                                            </span>
                                            <button onClick={() => setShowHeroMap(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors font-bold">✕</button>
                                        </div>
                                        <div className="rounded-2xl overflow-hidden border border-slate-100">
                                            <MapLocationPicker
                                                onLocationSelect={(loc) => {
                                                    setLocation(loc.address);
                                                    setLocationLat(loc.latitude);
                                                    setLocationLng(loc.longitude);
                                                    setShowHeroMap(false);
                                                    performSearch(subject, loc.address);
                                                }}
                                                initialAddress={location}
                                                accentColor="amber"
                                                height="300px"
                                                compact={true}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* RESET & SEARCH BUTTONS */}
                            <div className="flex items-center gap-2 p-1 w-full md:w-auto">
                                {(subject || location) && (
                                    <button 
                                        onClick={handleReset}
                                        className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
                                        title="Reset Filters"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                )}
                                <button 
                                    onClick={handleSearch}
                                    className="w-full md:w-auto px-12 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl md:rounded-full transition-all duration-300 shadow-xl shadow-amber-500/25 active:scale-95 whitespace-nowrap text-sm md:text-base shrink-0"
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* CATEGORY SCROLLER (IMMEDIATE SEARCH) */}
                        <div className="w-full max-w-5xl mt-12 relative group" style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
                            <div className="bg-white rounded-full border border-slate-100 shadow-sm px-12 py-5 flex items-center gap-10 overflow-x-auto no-scrollbar scroll-smooth relative">
                                {[
                                    { name: "Chemistry", icon: Beaker },
                                    { name: "Singing", icon: Mic2 },
                                    { name: "French", icon: Languages },
                                    { name: "Piano", icon: Music },
                                    { name: "Chess", icon: Swords },
                                    { name: "Dance", icon: Accessibility },
                                    { name: "Driving", icon: Car },
                                    { name: "Coding", icon: Code },
                                    { name: "Maths", icon: GraduationCap },
                                    { name: "English", icon: Languages },
                                ].map((cat, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setSubject(cat.name); performSearch(cat.name); }}
                                        className="flex flex-col items-center gap-2 group/cat transition-all duration-300 hover:-translate-y-1 shrink-0"
                                    >
                                        <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 group-hover/cat:bg-amber-50 group-hover/cat:text-amber-500 transition-colors">
                                            <cat.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 group-hover/cat:text-slate-900 whitespace-nowrap tracking-wider uppercase">
                                            {cat.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <style jsx>{`
                        .no-scrollbar::-webkit-scrollbar { display: none; }
                        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                        @keyframes fadeInUp {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        @keyframes fadeInScale {
                            from { opacity: 0; transform: scale(0.95) translateY(10px); }
                            to { opacity: 1; transform: scale(1) translateY(0); }
                        }
                    `}</style>
                </section>



                {/* ════════════ TUTOR LISTING ════════════ */}
                <section ref={listingRef} className="max-w-6xl mx-auto px-4 pb-20 scroll-mt-24">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 mb-1">
                                {searched ? "Search Results" : "Available Tutors"}
                            </h2>
                            <p className="text-slate-500">
                                Showing <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">{filtered.length}</span> verified tutors
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-slate-400 text-sm font-medium">Loading tutors...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">🔍</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Tutors Found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your filters or resetting the search.</p>
                            <button onClick={handleReset} className="mt-4 text-amber-500 font-bold underline">Show all tutors</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filtered.map(t => (
                                <div key={t.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
                                    {/* Teacher Image Area */}
                                    <div className="relative h-[320px] overflow-hidden">
                                        {t.profilePhoto ? (
                                            <img src={t.profilePhoto} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-4xl font-bold text-amber-500">
                                                {t.name?.[0]}
                                            </div>
                                        )}
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                        {/* Name and Location Overlay */}
                                        <div className="absolute bottom-4 left-6 right-6">
                                            <h3 className="text-2xl font-black text-white leading-tight">{t.name}</h3>
                                            <p className="text-white/80 text-sm font-medium flex items-center gap-1.5 mt-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {t.address?.split(",")[0]} ({t.teachingMode || "Online"})
                                            </p>
                                        </div>
                                    </div>

                                    {/* Teacher Info Area */}
                                    <div className="p-6 pt-5 space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-800 line-clamp-1">
                                                {t.subjects?.[0]} — {t.experience || "Expert"} Educator
                                            </p>
                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                                {t.achievements || "Dedicated to helping students achieve their full potential through personalized learning strategies."}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black text-slate-900">₹1,200<span className="text-xs font-bold text-slate-400">/hr</span></span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { if (!requireLogin("WhatsApp tutor")) window.open(`https://wa.me/91${t.phone?.replace(/\D/g, "").slice(-10)}`); }}
                                                    className="w-10 h-10 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-full flex items-center justify-center transition-all duration-300 border border-slate-100">
                                                    <Zap className="w-5 h-5 fill-current" />
                                                </button>
                                                <button onClick={() => router.push(`/tutor/${t.id}`)}
                                                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-full shadow-lg shadow-amber-500/20 transition-all duration-300 active:scale-95">
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>


                {/* ════════════ BECOME A TUTOR CTA ════════════ */}
                <section className="relative overflow-hidden py-16 md:py-24">
                    <div className="absolute inset-0 bg-slate-950" />
                    <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-bold uppercase tracking-widest mb-8">
                            <Zap className="w-4 h-4 fill-amber-400" /> Join Our Growing Network
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 max-w-3xl mx-auto leading-tight">
                            Are You a Tutor? <br />
                            Join <span className="text-amber-500 underline decoration-amber-500/30 underline-offset-8">Aacharya</span> Network
                        </h2>
                        <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
                            Access thousands of students near your location and grow your teaching career with our verified platform.
                        </p>
                        <button onClick={() => router.push("/signup/teacher")}
                            className="px-12 py-5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-amber-500/40 transition-all duration-300 text-lg hover:-translate-y-1 flex items-center gap-3 mx-auto">
                            Register as Tutor Now
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </section>

                {/* ════════════ WHY AACHARYA TUTORS ════════════ */}
                <section className="bg-gradient-to-b from-white to-slate-50 py-16 md:py-24 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                    <div className="max-w-6xl mx-auto px-4 relative z-10">
                        <div className="text-center mb-16">
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 text-sm font-bold mb-4 border border-amber-100/50">
                                🏆 Why Choose Us
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">Why Aacharya Tutors?</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                            {[
                                { icon: "✅", text: "Verified & experienced tutors", bg: "bg-green-100" },
                                { icon: "🎓", text: "Demo class available", bg: "bg-amber-100" },
                                { icon: "🛡️", text: "Safe & child-friendly approach", bg: "bg-rose-100" },
                                { icon: "📝", text: "Personalised learning", bg: "bg-amber-50" },
                                { icon: "⭐", text: "Trusted by parents", bg: "bg-yellow-100" },
                            ].map((item, i) => (
                                <div key={i} className="text-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                                    <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>{item.icon}</div>
                                    <p className="text-sm font-semibold text-slate-700 leading-snug">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════ POST REQUIREMENT CTA ════════════ */}
                <section className="relative bg-gradient-to-br from-slate-50 via-white to-amber-50/30 py-20 overflow-hidden">
                    <div className="max-w-4xl mx-auto px-4 relative z-10">
                        <div className="text-center mb-10">
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 text-sm font-bold mb-4 border border-amber-100/50">
                                📬 Post Your Requirement
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 mt-2">Could not find tutor?</h2>
                            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                                Post your requirement here and verified tutors will contact you directly.
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/8 border border-white/60 p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">📍 Location / Area / Pincode</label>
                                    <MapLocationPicker
                                        onLocationSelect={(loc) => {
                                            setReqLocation(loc.address);
                                            setReqLat(loc.latitude);
                                            setReqLng(loc.longitude);
                                        }}
                                        initialAddress={reqLocation}
                                        accentColor="amber"
                                        height="200px"
                                        compact={true}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">📘 Subject / Skill</label>
                                    <select value={reqSubject} onChange={e => setReqSubject(e.target.value)} className="w-full px-4 py-3.5 border border-slate-200 rounded-xl outline-none bg-white hover:border-slate-300 transition-colors appearance-none text-slate-700 font-medium">
                                        <option value="">Select Subject</option>
                                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">🎓 Class / Age Group</label>
                                    <select value={reqClass} onChange={e => setReqClass(e.target.value)} className="w-full px-4 py-3.5 border border-slate-200 rounded-xl outline-none bg-white hover:border-slate-300 transition-colors appearance-none text-slate-700 font-medium">
                                        <option value="">Select Class / Age Group</option>
                                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">🏠 Mode</label>
                                    <select value={reqMode} onChange={e => setReqMode(e.target.value)} className="w-full px-4 py-3.5 border border-slate-200 rounded-xl outline-none bg-white hover:border-slate-300 transition-colors appearance-none text-slate-700 font-medium">
                                        <option value="">Home Tutor / Online Tutor</option>
                                        {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-5">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">💬 Additional Details (Optional)</label>
                                <textarea value={reqMessage} onChange={e => setReqMessage(e.target.value)} rows={3} className="w-full px-4 py-3.5 border border-slate-200 rounded-xl outline-none bg-white hover:border-slate-300 transition-colors resize-none text-slate-700 font-medium" placeholder="Any specific requirements — timing, budget, learning goals..." />
                            </div>
                            <button onClick={handlePostRequirement} disabled={submittingReq}
                                className="w-full md:w-auto px-12 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 text-base">
                                {submittingReq ? (
                                    <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Posting...</>
                                ) : (
                                    <>📝 Post Requirement</>
                                )}
                            </button>
                        </div>
                    </div>
                </section>

                {/* ════════════ FAQ ════════════ */}
                <section className="max-w-3xl mx-auto px-4 py-12 md:py-20">
                    <div className="text-center mb-14">
                        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 text-sm font-bold mb-4 border border-amber-100/50">
                            ❓ FAQs
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((f, i) => (
                            <div key={i} className={`rounded-2xl border overflow-hidden transition-all duration-400 shadow-sm ${faqOpen === i ? "border-amber-200 bg-white" : "border-slate-100 bg-white"}`}>
                                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                                    className="w-full p-6 text-left flex justify-between items-center transition-colors">
                                    <span className="font-bold text-slate-900 text-[16px]">{f.q}</span>
                                    <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${faqOpen === i ? "rotate-90" : ""}`} />
                                </button>
                                {faqOpen === i && (
                                    <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-4">
                                        {f.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ════════════ COACH BANNER ════════════ */}
                <section className="max-w-6xl mx-auto px-4 pb-24">
                    <div className="relative rounded-[2.5rem] overflow-hidden bg-[#1e1b4b] py-12 px-10 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="relative z-10 text-center md:text-left">
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                                Finding Your <br />
                                <span className="text-amber-400">Right Coach</span>
                            </h2>
                            <p className="text-lg text-indigo-100/70 mt-4">
                                Learn From FIDE-Rated Trainers Here!
                            </p>
                        </div>
                        <button onClick={() => router.push("/signup")}
                            className="relative z-10 px-10 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-xl hover:bg-amber-50 transition-all flex items-center gap-3">
                            GET STARTED
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}