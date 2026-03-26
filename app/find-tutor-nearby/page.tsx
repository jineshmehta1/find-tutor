"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import MapLocationPicker from "@/components/ui/DynamicMapPicker";
import {
    Search, MapPin, ChevronRight,
    Beaker, Mic2, Languages, Music, Swords,
    Accessibility, Car, Code, BookOpen, GraduationCap,
    Heart, Star, Award, Zap, Clock, CheckCircle2, X,
    MessageSquare, Rocket, BrainCircuit, Target,
    ShieldCheck, Users, TrendingUp, Lightbulb,
    HelpCircle, PhoneCall, Mail, Facebook, Twitter, 
    Instagram, Linkedin, ArrowUpRight, Filter,
    CheckCircle, UserCheck, Timer, Smile, Laptop, 
    Home, School, BookMarked, Sparkles
} from "lucide-react";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SECTION 1: CONSTANTS & MASSIVE DATA ARRAYS (For Depth & Completeness)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi",
    "History", "Geography", "Computer Science", "Economics", "Accountancy",
    "Business Studies", "Political Science", "Psychology", "Sociology",
    "Sanskrit", "French", "German", "Music", "Art", "Chess", "Abacus", 
    "Robotics", "Coding", "Spoken English", "Aptitude", "Environmental Science",
    "Home Science", "Physical Education", "Statistics", "Calculus", "Trigonometry",
    "Organic Chemistry", "Inorganic Chemistry", "Mechanics", "Thermodynamics",
    "Civics", "Social Studies", "General Knowledge", "Vedic Maths", "Spanish",
    "Japanese", "Chinese", "Yoga", "Guitar", "Violin", "Drums", "Keyboard",
    "Bharatnatyam", "Kathak", "Contemporary Dance", "Zumba", "Calligraphy"
];

const CLASSES = [
    "Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12",
    "Age 3-5", "Age 5-8", "Age 8-12", "Age 12-16", "Age 16+", "Undergraduate", 
    "Postgraduate", "PhD Prep", "Competitive Exams", "IELTS/TOEFL", "GRE/GMAT",
    "JEE/NEET Prep", "UPSC/SSC", "Banking Exams", "CAT/MAT", "CA Foundation"
];

const MODES = ["Home Tutor", "Online Tutor", "At Centre", "Group Classes", "Weekend Workshop"];

const POPULAR_CITIES = [
    "Delhi NCR", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune", 
    "Jaipur", "Ahmedabad", "Kolkata", "Lucknow", "Chandigarh", "Indore",
    "Bhopal", "Patna", "Ranchi", "Surat", "Kanpur", "Nagpur", "Dehradun"
];

const TESTIMONIALS = [
    { name: "Ananya Iyer", role: "Parent", text: "Found a brilliant Physics tutor for my son within 20 minutes. The verification process is top-notch.", rating: 5 },
    { name: "Rajesh Verma", role: "Student", text: "The coding classes are excellent. My tutor is very patient and knowledgeable.", rating: 5 },
    { name: "Suman Rao", role: "Parent", text: "Finding a home tutor in Mumbai was a headache until I used Aacharya. Highly recommended.", rating: 5 },
    { name: "Vikram Singh", role: "Student", text: "I cleared my JEE Advanced thanks to the chemistry mentor I found here.", rating: 4 },
    { name: "Pooja Mehta", role: "Parent", text: "The musical instruments tutors are very professional. My daughter loves her violin classes.", rating: 5 }
];

const FAQS = [
    { q: "Is the demo class free?", a: "Most of our tutors provide a complimentary 30-minute demo session. However, some senior experts may charge a nominal fee which is adjusted in the first month." },
    { q: "How do I know the tutor is verified?", a: "Every tutor with a 'Verified' badge has undergone physical ID verification and academic certificate audits by our internal team." },
    { q: "What if the tutor doesn't show up?", a: "We have a strict attendance policy. If a tutor fails to attend, we provide an immediate replacement and refund any advance paid through the platform." },
    { q: "Can I choose between online and home tuition?", a: "Yes, you can toggle between 'Home Tutor' and 'Online' during your search or in the 'Post Requirement' form." },
    { q: "How are the fees calculated?", a: "Fees are usually hourly or monthly. You can negotiate directly with the tutor based on the number of sessions and the complexity of the subject." },
    { q: "Do you provide tutors for hobby classes?", a: "Absolutely! We have experts for Chess, Music, Dance, Yoga, and even Foreign Languages." },
    { q: "Is there a registration fee for students?", a: "No, the service is 100% free for students and parents to find and contact tutors." }
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SECTION 2: TYPES & INTERFACES
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface Teacher {
    id: string; userId: string; name: string; email: string; phone: string;
    profilePhoto: string | null; address: string; education: string;
    experience: string; certifications: any[]; subjects: string[];
    teachingMode: string | null; classesOrAgeGroup: string[] | null;
    qualificationLevel: string | null; qualificationName: string | null;
    achievements: string | null;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SECTION 3: GRANULAR SUB-COMPONENTS (For Modularity & Depth)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const YellowBadge = ({ text, icon: Icon }: { text: string; icon?: any }) => (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-yellow-400/20 border border-yellow-300 rounded-full">
        {Icon && <Icon className="w-3 h-3" />}
        {text}
    </div>
);

const SectionTitle = ({ title, subTitle, centered = false }: { title: string; subTitle: string; centered?: boolean }) => (
    <div className={`space-y-4 ${centered ? 'text-center flex flex-col items-center' : 'text-left'}`}>
        <h2 className={`text-3xl md:text-5xl font-[1000] text-slate-900 leading-tight uppercase tracking-tighter`}>
            {title}
        </h2>
        <div className={`w-20 h-2 bg-yellow-400 rounded-full ${centered ? 'mx-auto' : ''}`} />
        <p className="text-slate-400 font-black uppercase text-xs tracking-[0.25em]">{subTitle}</p>
    </div>
);

const StatCard = ({ icon: Icon, value, label }: { icon: any, value: string, label: string }) => (
    <div className="flex flex-col items-center text-center p-8 bg-white rounded-[3rem] shadow-xl border border-slate-50 transition-all hover:shadow-yellow-400/10 group">
        <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-slate-950 mb-6 group-hover:scale-110 transition-transform">
            <Icon className="w-8 h-8" />
        </div>
        <h4 className="text-4xl font-[1000] text-slate-900 tracking-tighter leading-none mb-2">{value}</h4>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SECTION 4: MAIN PAGE COMPONENT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function FindTutorNearbyPage() {
    const { data: session } = useSession();
    const router = useRouter();

    /* ── 4.1 Search & UI States ── */
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
    
    const [faqOpen, setFaqOpen] = useState<number | null>(null);

    /* ── 4.2 Form States ── */
    const [reqLocation, setReqLocation] = useState("");
    const [reqLat, setReqLat] = useState<number | undefined>();
    const [reqLng, setReqLng] = useState<number | undefined>();
    const [reqSubject, setReqSubject] = useState("");
    const [reqClass, setReqClass] = useState("");
    const [reqMode, setReqMode] = useState("");
    const [reqMessage, setReqMessage] = useState("");
    const [submittingReq, setSubmittingReq] = useState(false);

    /* ── 4.3 Refs ── */
    const heroMapRef = useRef<HTMLDivElement>(null);
    const subjectRef = useRef<HTMLDivElement>(null);
    const listingRef = useRef<HTMLDivElement>(null);

    /* ── 4.4 Click Outside ── */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (heroMapRef.current && !heroMapRef.current.contains(event.target as Node)) setShowHeroMap(false);
            if (subjectRef.current && !subjectRef.current.contains(event.target as Node)) setShowSubjectSuggestions(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ── 4.5 Data Fetching ── */
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await fetch("/api/teachers");
                if (!res.ok) throw new Error("Network response was not ok");
                const data = await res.json();
                setTeachers(data);
                setFiltered(data);
            } catch (err) {
                console.error("Failed to fetch tutors:", err);
                toast.error("Could not load tutors. Please try refreshing.");
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    /* ── 4.6 Search Logic ── */
    const performSearch = useCallback((overrideSub?: string, overrideLoc?: string) => {
        const s = overrideSub ?? subject;
        const l = overrideLoc ?? location;
        
        setLoading(true);
        let result = [...teachers];

        if (l.trim()) {
            const terms = l.toLowerCase().split(/[\s,]+/).filter(Boolean);
            result = result.filter(t => t.address && terms.some(term => t.address.toLowerCase().includes(term)));
        }

        if (s.trim()) {
            result = result.filter(t => t.subjects?.some(sub => sub.toLowerCase().includes(s.toLowerCase())));
        }

        // Simulate network delay for UX
        setTimeout(() => {
            setFiltered(result);
            setSearched(true);
            setLoading(false);
            if (overrideSub || overrideLoc) {
                listingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 300);
    }, [subject, location, teachers]);

    const handleSearchClick = () => performSearch();

    const handleClearFilters = () => {
        setSubject("");
        setLocation("");
        setFiltered(teachers);
        setSearched(false);
        toast.info("All search filters have been reset.");
    };

    const handlePostRequirement = async () => {
        if (!session) {
            toast.error("Please login first to post requirements.");
            router.push("/signup");
            return;
        }
        if (!reqSubject || !reqLocation) {
            toast.error("Please provide at least a subject and location.");
            return;
        }

        setSubmittingReq(true);
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location: reqLocation, latitude: reqLat, longitude: reqLng,
                    subject: reqSubject, classLevel: reqClass, mode: reqMode, message: reqMessage,
                }),
            });
            if (!res.ok) throw new Error("Submission failed");
            toast.success("Success! Verified tutors will reach out to you within 24 hours.");
            setReqLocation(""); setReqSubject(""); setReqMessage(""); setReqClass(""); setReqMode("");
        } catch (err) {
            toast.error("Failed to post requirement. Please try again later.");
        } finally {
            setSubmittingReq(false);
        }
    };

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       SECTION 5: RENDER LOGIC
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    return (
        <main className="min-h-screen bg-white">
            
            {/* ──── 5.1 HERO SECTION (SPLIT LAYOUT) ──── */}
            <section className="relative w-full overflow-hidden bg-white pt-16 pb-24 md:pt-14 md:pb-32">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[90%] bg-yellow-400/10 rounded-full blur-[140px]" />
                    <div className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] bg-yellow-200/20 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
                        
                        {/* LEFT: DIRECT IMAGE (NO FRAME) */}
                        <motion.div 
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className="w-full lg:w-1/2 flex justify-center lg:justify-start"
                        >
                            <div className="relative">
                                <img 
                                    src="/find-hero.png" 
                                    alt="Learning Students Illustration" 
                                    className="w-full max-w-[750px] h-auto object-contain drop-shadow-2xl"
                                />
                                {/* Floating Badges */}
                                <motion.div 
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-10 -right-4 bg-white p-5 rounded-3xl shadow-2xl border border-yellow-100 flex items-center gap-4 hidden sm:flex"
                                >
                                    
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* RIGHT: TEXT & TWO-FIELD SEARCH */}
                        <motion.div 
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className="w-full lg:w-1/2 space-y-8 text-center lg:text-left"
                        >
                            <YellowBadge text="India's Trusted Tutor Network" icon={Sparkles} />

                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl font-[1000] text-slate-900 leading-[1.1] tracking-tighter uppercase">
                                    Find <span className="text-yellow-500 underline decoration-yellow-500/20 underline-offset-8">Experienced</span> <br className="hidden md:block" />
                                    Mentors Today.
                                </h1>
                                <p className="text-slate-400 font-black uppercase text-xs tracking-[0.25em]">
                                    VERIFIED TUTORS <span className="text-slate-950 font-black">DELIVERED WITHIN 30 MINUTES</span>
                                </p>
                            </div>

                            {/* DUAL SEARCH CONSOLE */}
                            <div className="max-w-2xl mx-auto lg:mx-0 pt-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-100 rounded-[2.5rem] shadow-sm">
                                        
                                        {/* Field 1: Subject Suggestion */}
                                        <div className="relative group" ref={subjectRef}>
                                            <div className="flex items-center h-16 px-6 bg-white border border-slate-100 rounded-[2rem] focus-within:ring-4 ring-yellow-400/20 transition-all">
                                                <BookOpen className="w-6 h-6 text-yellow-500 mr-4 shrink-0" />
                                                <div className="flex-1 text-left">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">I want to learn</p>
                                                    <input 
                                                        type="text"
                                                        value={subject}
                                                        onChange={(e) => { setSubject(e.target.value); setShowSubjectSuggestions(true); }}
                                                        onFocus={() => setShowSubjectSuggestions(true)}
                                                        placeholder="Maths, Piano..."
                                                        className="w-full bg-transparent outline-none text-base font-[900] text-slate-800 placeholder:text-slate-300"
                                                    />
                                                </div>
                                            </div>
                                            <AnimatePresence>
                                                {showSubjectSuggestions && subject.length > 0 && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                                        className="absolute top-[110%] left-0 w-full bg-white rounded-3xl shadow-[0_30px_60px_-10px_rgba(0,0,0,0.15)] border border-slate-100 py-3 z-[150] max-h-64 overflow-y-auto"
                                                    >
                                                        {SUBJECTS.filter(s => s.toLowerCase().includes(subject.toLowerCase())).map(s => (
                                                            <button key={s} onClick={() => { setSubject(s); setShowSubjectSuggestions(false); performSearch(s); }}
                                                                className="w-full px-6 py-3 text-left hover:bg-yellow-50 text-sm font-black text-slate-700 transition-colors flex items-center justify-between">
                                                                {s} <ChevronRight className="w-4 h-4 text-slate-300" />
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Field 2: Location Suggestion */}
                                        <div className="relative group">
                                            <div className="flex items-center h-16 px-6 bg-white border border-slate-100 rounded-[2rem] focus-within:ring-4 ring-yellow-400/20 transition-all">
                                                <MapPin className="w-6 h-6 text-red-500 mr-4 shrink-0" />
                                                <div onClick={() => setShowHeroMap(!showHeroMap)} className="flex-1 text-left cursor-pointer">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">In my area</p>
                                                    <p className={`text-base font-[900] truncate ${location ? 'text-slate-900' : 'text-slate-300'}`}>
                                                        {location || "Search Area"}
                                                    </p>
                                                </div>
                                            </div>
                                            <AnimatePresence>
                                                {showHeroMap && (
                                                    <motion.div 
                                                        ref={heroMapRef}
                                                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                                        className="absolute top-[110%] right-0 w-[90vw] md:w-[450px] bg-white rounded-[2.5rem] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.2)] border border-slate-100 p-6 z-[150]"
                                                    >
                                                        <div className="flex items-center justify-between mb-5 px-2">
                                                            <span className="text-sm font-[1000] text-slate-900 uppercase">Select Location</span>
                                                            <X onClick={() => setShowHeroMap(false)} className="w-5 h-5 cursor-pointer text-slate-400 hover:text-slate-900" />
                                                        </div>
                                                        <div className="rounded-3xl overflow-hidden border border-slate-50 shadow-inner">
                                                            <MapLocationPicker
                                                                onLocationSelect={(loc) => {
                                                                    setLocation(loc.address); setLocationLat(loc.latitude); setLocationLng(loc.longitude);
                                                                    setShowHeroMap(false); performSearch(subject, loc.address);
                                                                }}
                                                                initialAddress={location} height="300px" compact={true} accentColor="amber"
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <button 
                                            onClick={handleSearchClick}
                                            className="w-full sm:w-auto flex-[1.5] h-16 bg-yellow-400 hover:bg-slate-950 text-slate-950 hover:text-white font-[1000] rounded-[2rem] transition-all duration-500 shadow-xl shadow-yellow-400/20 active:scale-95 flex items-center justify-center gap-3 uppercase text-sm tracking-widest"
                                        >
                                            <Search className="w-5 h-5" /> Start Search
                                        </button>
                                        {searched && (
                                            <button onClick={handleClearFilters} className="w-full sm:w-auto px-10 h-16 bg-white border border-slate-100 text-slate-400 hover:text-red-500 font-black rounded-[2rem] transition-all uppercase text-[10px] tracking-widest">
                                                Reset Filters
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-10">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Popular:</span>
                                    {POPULAR_CITIES.slice(0, 5).map(city => (
                                        <button 
                                            key={city} 
                                            onClick={() => { setLocation(city); performSearch(subject, city); }} 
                                            className="text-[10px] font-black text-slate-900 hover:text-yellow-600 underline underline-offset-8 decoration-yellow-400/40 uppercase tracking-tighter"
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ──── 5.2 STATS STRIP ──── */}
            <section className="bg-slate-50 py-16 border-y border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <StatCard icon={Award} value="100%" label="Verified Tutors" />
                        <StatCard icon={Heart} value="25,000+" label="Happy Learners" />
                        <StatCard icon={Timer} value="30 Min" label="Fast Response" />
                        <StatCard icon={School} value="500+" label="Subjects Covered" />
                    </div>
                </div>
            </section>

            {/* ──── 5.3 WHAT ARE YOU LOOKING FOR? (REPLICATED AS PER REQUEST) ──── */}
            <section className="py-24 bg-yellow-400 relative overflow-hidden">
                {/* Visual texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
                
                <div className="container mx-auto px-6">
                    <SectionTitle title="What Are You Looking For?" subTitle="CHOOSE YOUR PATH" centered={true} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto mt-20">
                        
                        {/* Tutor Persona */}
                        <motion.div 
                            whileHover={{ y: -12 }}
                            className="bg-white rounded-[4rem] p-10 flex flex-col sm:flex-row gap-10 items-start shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border-b-[12px] border-slate-900/5 relative overflow-hidden group"
                        >
                            <div className="w-40 h-32 shrink-0 bg-slate-50 rounded-[2rem] flex items-center justify-center p-6 transition-transform group-hover:scale-105">
                                <img src="https://cdn-icons-png.flaticon.com/512/3429/3429433.png" alt="Teacher Icon" className="w-full h-full object-contain" />
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-3xl font-[1000] text-slate-900 tracking-tighter uppercase leading-none">I'M A TUTOR</h3>
                                <p className="text-slate-500 font-bold leading-relaxed text-sm">
                                    Perfect Tutor connects Students with Home Tutors and Online Tutors. We provide full-time & part-time jobs for all classes from KG to XII, Competitive Exams, Hobbies & more.
                                </p>
                                <button 
                                    onClick={() => router.push("/signup/teacher")}
                                    className="px-10 py-4 bg-red-500 hover:bg-slate-950 text-white font-[1000] text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl active:scale-95"
                                >
                                    Sign Up Free
                                </button>
                            </div>
                        </motion.div>

                        {/* Student Persona */}
                        <motion.div 
                            whileHover={{ y: -12 }}
                            className="bg-white rounded-[4rem] p-10 flex flex-col sm:flex-row gap-10 items-start shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border-b-[12px] border-slate-900/5 relative overflow-hidden group"
                        >
                            <div className="w-40 h-32 shrink-0 bg-slate-50 rounded-[2rem] flex items-center justify-center p-6 transition-transform group-hover:scale-105">
                                <img src="https://cdn-icons-png.flaticon.com/512/2941/2941658.png" alt="Student Icon" className="w-full h-full object-contain" />
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-3xl font-[1000] text-slate-900 tracking-tighter uppercase leading-none">I'M A STUDENT</h3>
                                <p className="text-slate-500 font-bold leading-relaxed text-sm">
                                    Looking for top-qualified home or online tutors? Post your learning requirements for free and get an instant response from verified experts in your neighborhood.
                                </p>
                                <button 
                                    onClick={() => router.push("/signup")}
                                    className="px-10 py-4 bg-red-500 hover:bg-slate-950 text-white font-[1000] text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl active:scale-95"
                                >
                                    Hire a Tutor
                                </button>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* ──── 5.4 TUTOR DIRECTORY LISTING ──── */}
            <section ref={listingRef} className="container mx-auto px-6 py-28 scroll-mt-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
                    <SectionTitle 
                        title={searched ? "Results Found" : "Featured Mentors"} 
                        subTitle={`Explored ${filtered.length} verified profile(s) matching your orbit.`} 
                    />
                    
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 p-4 bg-slate-50 border border-slate-100 text-slate-400 hover:text-yellow-600 rounded-2xl transition-all">
                            <Filter className="w-5 h-5" /> <span className="text-[10px] font-black uppercase">Filter</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[550px] bg-slate-50 rounded-[3.5rem] animate-pulse border border-slate-100" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200"
                    >
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-7xl mx-auto mb-10 shadow-xl">🔭</div>
                        <h3 className="text-3xl font-[1000] text-slate-900 uppercase tracking-tighter">No tutors found in this area</h3>
                        <p className="text-slate-500 mt-4 font-bold max-w-sm mx-auto uppercase text-[10px] tracking-widest leading-loose">Try broadening your search or resetting the filters.</p>
                        <button onClick={handleClearFilters} className="mt-10 px-12 py-5 bg-yellow-400 text-slate-950 font-[1000] rounded-[2rem] shadow-xl uppercase text-xs tracking-widest">Show All Profiles</button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filtered.map((t, idx) => (
                            <motion.div 
                                layout
                                key={t.id} 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (idx % 3) * 0.1 }}
                                className="bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 group flex flex-col"
                            >
                                {/* Profile Header */}
                                <div className="relative h-72 overflow-hidden">
                                    <div className="absolute top-6 left-6 z-20">
                                        <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-white/30">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Verified Expert</span>
                                        </div>
                                    </div>
                                    
                                    {t.profilePhoto ? (
                                        <img src={t.profilePhoto} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={t.name} />
                                    ) : (
                                        <div className="w-full h-full bg-yellow-50 flex items-center justify-center text-7xl font-[1000] text-yellow-300 uppercase">
                                            {t.name?.[0]}
                                        </div>
                                    )}

                                    {/* Overlay Text */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <h3 className="text-3xl font-[1000] text-white tracking-tighter leading-none group-hover:text-yellow-400 transition-colors uppercase">{t.name}</h3>
                                        <div className="flex items-center gap-4 mt-4 text-[10px] font-black text-white/80 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-yellow-400" /> {t.address?.split(',')[0]}</span>
                                            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-400" /> {t.teachingMode || "Online"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Content */}
                                <div className="p-10 space-y-8 flex-1 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="flex flex-wrap gap-2.5">
                                            {t.subjects?.slice(0, 3).map(s => (
                                                <span key={s} className="px-4 py-2 bg-yellow-50 text-yellow-700 text-[9px] font-black uppercase rounded-xl border border-yellow-100 shadow-sm group-hover:bg-yellow-400 group-hover:text-slate-950 transition-all">{s}</span>
                                            ))}
                                            {t.subjects && t.subjects.length > 3 && (
                                                <span className="px-4 py-2 bg-slate-50 text-slate-400 text-[9px] font-black uppercase rounded-xl">+{t.subjects.length - 3} More</span>
                                            )}
                                        </div>
                                        <p className="text-slate-500 text-base font-bold leading-relaxed line-clamp-2 h-12 italic">
                                            "{t.achievements || "Dedicated to building strong foundational concepts and helping students excel in academics."}"
                                        </p>
                                    </div>

                                    {/* Price & Action */}
                                    <div className="flex items-center justify-between pt-10 border-t border-slate-50">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tuition Fees</p>
                                            <p className="text-3xl font-[1000] text-slate-900 tracking-tighter">₹1,200<span className="text-sm font-bold text-slate-400 tracking-normal ml-1">/hr</span></p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => { if (!session) { router.push("/signup"); return; } window.open(`https://wa.me/91${t.phone?.replace(/\D/g, "").slice(-10)}`) }}
                                                className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-xl shadow-emerald-900/10 active:scale-90"
                                            >
                                                <Zap className="w-6 h-6 fill-current" />
                                            </button>
                                            <button 
                                                onClick={() => router.push(`/tutor/${t.id}`)}
                                                className="px-8 py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] hover:bg-yellow-400 hover:text-slate-950 transition-all duration-300 shadow-2xl active:scale-95"
                                            >
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* ──── 5.5 "HOW IT WORKS" BENTO GRID ──── */}
            <section className="bg-slate-50 py-32 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <SectionTitle title="Simple Steps To Connect" subTitle="THE AACHARYA JOURNEY" centered={true} />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
                        {[
                            { title: "Search & Filter", desc: "Browse through verified mentors based on subject, location, and rating.", icon: Search, color: "bg-yellow-400" },
                            { title: "Check Profile", desc: "Read achievements, teaching methodology, and parent testimonials.", icon: BookMarked, color: "bg-slate-950 text-white" },
                            { title: "Demo Session", desc: "Book a free demonstration class to ensure the perfect student-teacher fit.", icon: UserCheck, color: "bg-white border-2 border-yellow-400" },
                            { title: "Start Learning", desc: "Begin your customized learning path and track academic progress.", icon: Rocket, color: "bg-yellow-400" }
                        ].map((step, i) => (
                            <motion.div 
                                whileHover={{ y: -10 }}
                                key={i} className={`p-12 rounded-[3.5rem] shadow-xl flex flex-col justify-between ${step.color} relative overflow-hidden`}
                            >
                                <div className="absolute top-8 right-8 text-7xl font-[1000] opacity-[0.05]">0{i + 1}</div>
                                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg ${step.color.includes('slate') ? 'bg-white/10' : 'bg-white shadow-inner'}`}>
                                    <step.icon className={`w-8 h-8 ${step.color.includes('slate') ? 'text-yellow-400' : 'text-slate-950'}`} />
                                </div>
                                <div className="space-y-4 mt-20">
                                    <h4 className="text-2xl font-[1000] uppercase tracking-tighter leading-none">{step.title}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-loose opacity-70">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── 5.6 POST REQUIREMENT MEGA FORM ──── */}
            <section className="py-32 bg-white relative z-10">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto bg-slate-50 rounded-[5rem] p-12 md:p-24 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col lg:flex-row gap-24">
                        
                        <div className=" space-y-12">
                            <SectionTitle title="Can't Find Your match?" subTitle="LET US HELP" />
                            
                            <ul className="space-y-8">
                                {[
                                    { text: "100% Free Consultation", icon: CheckCircle },
                                    { text: "Lead Matching Within 12hrs", icon: Timer },
                                    { text: "Verified Experts Only", icon: UserCheck },
                                    { text: "Personal Support Desk", icon: PhoneCall },
                                ].map((li, i) => (
                                    <li key={i} className="flex items-center gap-6 text-slate-800 font-[900] text-[11px] uppercase tracking-widest group cursor-default">
                                        <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-slate-950 shadow-lg group-hover:scale-110 transition-transform">
                                            <li.icon className="w-6 h-6" />
                                        </div>
                                        {li.text}
                                    </li>
                                ))}
                            </ul>

                            <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
                                <h4 className="text-xl font-[1000] text-slate-900 uppercase">Need a quick call?</h4>
                                <p className="text-xs font-bold text-slate-400">Our relationship managers are available from 10 AM to 7 PM.</p>
                                <button className="flex items-center gap-2 text-yellow-600 font-[1000] uppercase text-xs hover:gap-4 transition-all">Connect Now <ArrowUpRight className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <div className="lg:w-2/3">
                            <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl border border-slate-50 relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Learning Subject</label>
                                            <select value={reqSubject} onChange={e => setReqSubject(e.target.value)} className="w-full h-16 px-8 bg-slate-50 border-none rounded-[2rem] outline-none focus:ring-4 ring-yellow-400/20 font-black text-slate-700 appearance-none shadow-inner">
                                                <option value="">Select Subject</option>
                                                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Target Class</label>
                                            <select value={reqClass} onChange={e => setReqClass(e.target.value)} className="w-full h-16 px-8 bg-slate-50 border-none rounded-[2rem] outline-none focus:ring-4 ring-yellow-400/20 font-black text-slate-700 appearance-none shadow-inner">
                                                <option value="">Choose Class</option>
                                                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Learning Mode</label>
                                            <select value={reqMode} onChange={e => setReqMode(e.target.value)} className="w-full h-16 px-8 bg-slate-50 border-none rounded-[2rem] outline-none focus:ring-4 ring-yellow-400/20 font-black text-slate-700 appearance-none shadow-inner">
                                                <option value="">Home / Online</option>
                                                {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Exact Area / Pin</label>
                                        <div className="rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-inner">
                                            <MapLocationPicker
                                                onLocationSelect={(loc) => { setReqLocation(loc.address); setReqLat(loc.latitude); setReqLng(loc.longitude); }}
                                                initialAddress={reqLocation} height="245px" compact={true} accentColor="amber"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-12">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Additional Instructions (Optional)</label>
                                    <textarea 
                                        value={reqMessage} onChange={e => setReqMessage(e.target.value)} 
                                        placeholder="Specific goals, timing preferences, or teacher gender preference..."
                                        className="w-full p-8 bg-slate-50 border-none rounded-[2.5rem] min-h-[160px] outline-none focus:ring-4 ring-yellow-400/20 font-bold text-slate-700 shadow-inner resize-none"
                                    />
                                </div>

                                <button 
                                    onClick={handlePostRequirement} disabled={submittingReq}
                                    className="w-full h-20 bg-yellow-400 hover:bg-slate-950 text-slate-950 hover:text-white font-[1000] rounded-[2.5rem] transition-all duration-500 shadow-2xl shadow-yellow-400/20 active:scale-95 disabled:opacity-50 uppercase text-sm tracking-[0.25em]"
                                >
                                    {submittingReq ? "Submitting Request..." : "Submit Requirement Now"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

          {/* ──── 5.7 TESTIMONIALS STRIP (IMAGE STYLE) ──── */}
{/* ──── 5.7 TESTIMONIALS STRIP (MATCHING IMAGE STYLE) ──── */}
<section className="bg-[#fdf8f0] py-24 relative overflow-hidden">
    <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-[1000] text-slate-900 tracking-tighter uppercase leading-none">
                Client Feedback <span className="text-[#f7941d]">& Testimonial</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm font-bold leading-relaxed px-4">
                We take pride in the success of our students. Here is what parents and learners 
                have to say about their journey with Aacharya Tutors.
            </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {[
                { name: "Ananya Iyer", role: "Parent of Class 10th Student", color: "bg-[#8cc63f]" },
                { name: "Rajesh Verma", role: "Software Aspirant", color: "bg-[#00aeef]" },
                { name: "Suman Rao", role: "Hobby Learner (Violin)", color: "bg-[#f7941d]" }
            ].map((client, i) => (
                <motion.div 
                    key={i}
                    whileHover={{ y: -12 }}
                    className="relative bg-white p-10 pt-16 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.08)] transition-all duration-500
                               rounded-tl-[100px] rounded-br-[100px] rounded-tr-[40px] rounded-bl-[40px] flex flex-col"
                >
                    {/* Top Floating Quote Icon (Better Custom Icon) */}
                    <div className={`absolute -top-8 left-10 w-20 h-20 rounded-full ${client.color} 
                                    flex items-center justify-center text-white shadow-xl border-[6px] border-white`}>
                        <svg width="35" height="35" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.192 15.757c0 1.964-1.594 3.557-3.558 3.557-1.963 0-3.557-1.593-3.557-3.557 0-1.964 1.594-3.558 3.557-3.558h.721c-.347-1.545-1.127-2.659-2.339-3.344l.804-1.411c2.148 1.055 3.194 3.102 3.412 5.313h1.01zm9.25 0c0 1.964-1.594 3.557-3.558 3.557-1.963 0-3.557-1.593-3.557-3.557 0-1.964 1.594-3.558 3.557-3.558h.721c-.347-1.545-1.127-2.659-2.339-3.344l.804-1.411c2.148 1.055 3.194 3.102 3.412 5.313h1.01z" />
                        </svg>
                    </div>

                    {/* Client Info */}
                    <div className="mb-6 ml-4">
                        <h4 className="text-2xl font-[1000] text-slate-900 leading-tight">{client.name}</h4>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">{client.role}</p>
                        
                        {/* 5 Stars */}
                        <div className="flex text-[#fbb040] gap-1 mt-4">
                            {[...Array(5)].map((_, idx) => (
                                <Star key={idx} className="w-4 h-4 fill-current" />
                            ))}
                        </div>
                    </div>

                    {/* Demo Testimonial Text */}
                    <p className="text-slate-500 text-xs font-bold leading-relaxed mb-8 ml-4">
                        "The experience has been absolutely life-changing for my child. 
                        The tutors are not just teachers but mentors who truly care 
                        about the fundamental understanding of the subject. 
                        We saw an immediate improvement in grades and confidence 
                        within just two weeks of joining the platform."
                    </p>

                    {/* Bottom Subtle "Watermark" Quote */}
                    <div className="mt-auto self-end opacity-[0.05] text-slate-900">
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor" className="rotate-180">
                            <path d="M11.192 15.757c0 1.964-1.594 3.557-3.558 3.557-1.963 0-3.557-1.593-3.557-3.557 0-1.964 1.594-3.558 3.557-3.558h.721c-.347-1.545-1.127-2.659-2.339-3.344l.804-1.411c2.148 1.055 3.194 3.102 3.412 5.313h1.01zm9.25 0c0 1.964-1.594 3.557-3.558 3.557-1.963 0-3.557-1.593-3.557-3.557 0-1.964 1.594-3.558 3.557-3.558h.721c-.347-1.545-1.127-2.659-2.339-3.344l.804-1.411c2.148 1.055 3.194 3.102 3.412 5.313h1.01z" />
                        </svg>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Pagination Controls (Matching Image Style) */}
        <div className="flex justify-center items-center gap-3 mt-20">
            <button className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 hover:bg-yellow-400 hover:border-yellow-400 transition-all"></button>
            <button className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 hover:bg-yellow-400 hover:border-yellow-400 transition-all"></button>
            {/* The Active Pill shape from your image */}
            <div className="w-14 h-4 rounded-full bg-slate-200 border-2 border-slate-300 shadow-inner relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1/2 bg-yellow-400"></div>
            </div>
        </div>
    </div>
</section>

            {/* ──── 5.8 DETAILED FAQ SECTION ──── */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-4xl">
                    <SectionTitle title="Frequently Asked Questions" subTitle="YOUR CONCERNS ANSWERED" centered={true} />

                    <div className="space-y-6 mt-24">
                        {FAQS.map((f, i) => (
                            <motion.div 
                                layout
                                key={i} className={`rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${faqOpen === i ? "border-yellow-400 bg-white shadow-2xl shadow-yellow-400/5" : "border-slate-50 bg-white"}`}
                            >
                                <button 
                                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                                    className="w-full p-10 text-left flex justify-between items-center group"
                                >
                                    <span className={`text-xl font-[1000] tracking-tighter uppercase transition-colors ${faqOpen === i ? "text-yellow-600" : "text-slate-900"}`}>{f.q}</span>
                                    <div className={`p-3 rounded-2xl transition-all shadow-sm ${faqOpen === i ? "bg-yellow-400 text-slate-950 rotate-180 shadow-yellow-400/20" : "bg-slate-50 text-slate-300"}`}>
                                        <ChevronRight className="-rotate-90 w-6 h-6" />
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {faqOpen === i && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                            className="px-10 pb-10"
                                        >
                                            <div className="pt-6 border-t border-slate-50 text-slate-500 font-[900] leading-relaxed text-xs uppercase tracking-widest opacity-80">
                                                {f.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── 5.9 PREMIUM CHESS BANNER (PREVIEW) ──── */}
            <section className="container mx-auto px-6 pb-32">
                <div className="relative rounded-[5rem] bg-[#1e1b4b] p-16 md:p-28 overflow-hidden group shadow-[0_50px_100px_-20px_rgba(30,27,75,0.3)]">
                    <div className="absolute top-0 right-0 w-[60%] h-full bg-yellow-400/10 rounded-full blur-[120px] translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-20 text-center lg:text-left">
                        <div className="space-y-10">
                            <YellowBadge text="Exclusive Coaching Track" icon={Swords} />
                            <h2 className="text-3xl md:text-5xl font-[1000] text-white tracking-tighter uppercase leading-[0.85]">
                                Master Everything with <br />
                                <span className="text-yellow-400">Our Expert</span> {" "}
                                Tutors.
                            </h2>
                            <p className="text-indigo-200/60 font-black text-xs uppercase tracking-[0.4em] leading-relaxed max-w-lg mx-auto lg:mx-0">
                                Comprehensive training from board basics to international competitive strategies. Enrollment open for all ages.
                            </p>
                        </div>
                        <button 
                            onClick={() => router.push("/signup")}
                            className="px-16 py-8 bg-white hover:bg-yellow-400 text-slate-950 font-[1000] text-xl rounded-[2.5rem] transition-all duration-500 shadow-2xl active:scale-95 flex items-center gap-6 group uppercase tracking-widest"
                        >
                            Get Started Now <ArrowUpRight className="w-8 h-8 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

          

            {/* ──── 5.11 GLOBAL ANIMATIONS & OVERRIDES ──── */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
                
                body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    background-color: white;
                }

                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                ::selection {
                    background-color: #FACC15;
                    color: #000;
                }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                }

                .animate-float {
                    animation: float 5s ease-in-out infinite;
                }
            `}</style>

        </main>
    );
}