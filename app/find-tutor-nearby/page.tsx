"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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
    Home, School, BookMarked, Sparkles, Loader2, Phone
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
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-slate-950 text-[10px] font-extrabold uppercase tracking-[0.2em] shadow-lg shadow-primary/20 border border-primary/20 rounded-full">
        {Icon && <Icon className="w-3 h-3" />}
        {text}
    </div>
);

const SectionTitle = ({ title, subTitle, centered = false }: { title: string; subTitle: string; centered?: boolean }) => (
    <div className={`space-y-4 ${centered ? 'text-center flex flex-col items-center' : 'text-left'}`}>
        <h2 className={`text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight uppercase tracking-tighter`}>
            {title}
        </h2>
        <div className={`w-20 h-2 bg-primary rounded-full ${centered ? 'mx-auto' : ''}`} />
        <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.25em]">{subTitle}</p>
    </div>
);

const StatCard = ({ icon: Icon, value, label }: { icon: any, value: string, label: string }) => (
    <div className="flex flex-col items-center text-center p-8 bg-white rounded-[3rem] shadow-xl border border-slate-50 transition-all hover:shadow-primary/10 group">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
            <Icon className="w-8 h-8" />
        </div>
        <h4 className="text-4xl font-extrabold text-slate-900 tracking-tighter leading-none mb-2">{value}</h4>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SECTION 4: MAIN PAGE COMPONENT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function FindTutorNearbyPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen space-y-3 bg-white">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Loading Orbit...</p>
            </div>
        }>
            <FindTutorNearbyPageContent />
        </Suspense>
    );
}

function FindTutorNearbyPageContent() {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    /* ── 4.1 Search & UI States ── */
    const [location, setLocation] = useState("");
    const [locationLat, setLocationLat] = useState<number | undefined>();
    const [locationLng, setLocationLng] = useState<number | undefined>();
    const [subject, setSubject] = useState("");
    const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);
    
    const [teachers, setTeachers] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searched, setSearched] = useState(false);
    const [showHeroMap, setShowHeroMap] = useState(false);
    
    // Advanced Filters & Sort States
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [selectedMode, setSelectedMode] = useState("All");
    const [selectedClass, setSelectedClass] = useState("All");
    const [sortBy, setSortBy] = useState("default");

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
                // Fetch both approved and pending teachers to facilitate visual testing in dev environment
                const res = await fetch("/api/teachers?approved=false");
                if (!res.ok) throw new Error("Network response was not ok");
                const data = await res.json();
                
                // Fetch reviews for each teacher to calculate rating and reviewsCount
                const teachersWithReviews = await Promise.all(data.map(async (t: any) => {
                    let rating = 5.0;
                    let reviewsCount = 0;
                    try {
                        const revRes = await fetch(`/api/review?pageKey=${t.id}`);
                        if (revRes.ok) {
                            const revs = await revRes.json();
                            reviewsCount = revs.length;
                            if (reviewsCount > 0) {
                                const sum = revs.reduce((acc: number, r: any) => acc + r.rating, 0);
                                rating = Math.round((sum / reviewsCount) * 100) / 100;
                            }
                        }
                    } catch (e) {
                        console.error(e);
                    }
                    return { ...t, rating, reviewsCount };
                }));

                setTeachers(teachersWithReviews);
                setFiltered(teachersWithReviews);
            } catch (err) {
                console.error("Failed to fetch tutors:", err);
                toast.error("Could not load tutors. Please try refreshing.");
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    // Read URL Search Parameters on Page Load
    useEffect(() => {
        if (teachers.length === 0) return;

        const urlSubject = searchParams.get("subject") || "";
        const urlLocation = searchParams.get("location") || "";
        const urlClass = searchParams.get("classLevel") || searchParams.get("class") || "";
        const urlMode = searchParams.get("mode") || "";
        const urlType = searchParams.get("type") || "";

        let hasParams = false;

        if (urlSubject) {
            setSubject(urlSubject);
            hasParams = true;
        }
        if (urlLocation) {
            setLocation(urlLocation);
            hasParams = true;
        }
        if (urlClass) {
            setSelectedClass(urlClass);
            hasParams = true;
        }
        if (urlMode) {
            setSelectedMode(urlMode);
            hasParams = true;
        } else if (urlType === "coach") {
            // For general coaches redirect, pre-set to general coaches or popular chess
            setSubject("Chess");
            hasParams = true;
        }

        if (hasParams) {
            setLoading(true);
            let result = [...teachers];

            if (urlLocation.trim()) {
                const terms = urlLocation.toLowerCase().split(/[\s,]+/).filter(Boolean);
                result = result.filter(t => t.address && terms.some(term => t.address.toLowerCase().includes(term)));
            }

            if (urlSubject.trim()) {
                result = result.filter(t => t.subjects?.some((sub: string) => sub.toLowerCase().includes(urlSubject.toLowerCase())));
            }

            setTimeout(() => {
                setFiltered(result);
                setSearched(true);
                setLoading(false);
            }, 100);
        }
    }, [teachers, searchParams]);

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
            result = result.filter(t => t.subjects?.some((sub: string) => sub.toLowerCase().includes(s.toLowerCase())));
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

    // Memoize the filtered and sorted list of teachers based on sidebar filters
    const processedTeachers = useMemo(() => {
        let result = [...filtered];

        if (selectedMode !== "All") {
            result = result.filter(t => t.teachingMode && t.teachingMode.toLowerCase().includes(selectedMode.toLowerCase()));
        }

        if (selectedClass !== "All") {
            result = result.filter(t => {
                if (!t.classesOrAgeGroup) return false;
                if (Array.isArray(t.classesOrAgeGroup)) {
                    return t.classesOrAgeGroup.some((c: string) => c.toLowerCase().includes(selectedClass.toLowerCase()));
                }
                return String(t.classesOrAgeGroup).toLowerCase().includes(selectedClass.toLowerCase());
            });
        }

        if (sortBy === "experience") {
            result.sort((a, b) => {
                const expA = parseInt(a.experience) || 0;
                const expB = parseInt(b.experience) || 0;
                return expB - expA;
            });
        } else if (sortBy === "rating") {
            result.sort((a, b) => (b.rating || 5) - (a.rating || 5));
        }

        return result;
    }, [filtered, selectedMode, selectedClass, sortBy]);

    const handleSearchClick = () => performSearch();

    const handleClearFilters = () => {
        setSubject("");
        setLocation("");
        setSelectedMode("All");
        setSelectedClass("All");
        setSortBy("default");
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
            <section className="relative w-full overflow-hidden bg-white pt-10 pb-16 md:pt-14 md:pb-24 lg:pb-32">
    {/* Background Decorative Blobs - Adjusted for mobile overflow */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[-15%] w-[70%] md:w-[60%] h-[90%] bg-primary/10 rounded-full blur-[80px] md:blur-[140px]" />
        <div className="absolute top-[20%] left-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-primary/5 rounded-full blur-[60px] md:blur-[100px]" />
    </div>

    <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-16 lg:gap-24">
            
            {/* LEFT: DIRECT IMAGE (Top on mobile, Left on Desktop) */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="w-full lg:w-1/2 flex justify-center lg:justify-start"
            >
                <div className="relative w-full max-w-[350px] md:max-w-[500px] lg:max-w-[750px]">
                    <img 
                        src="/find-hero.png" 
                        alt="Learning Students Illustration" 
                        className="w-full h-auto object-contain drop-shadow-2xl"
                    />
                    {/* Floating Badge - Hidden on very small screens to avoid clutter */}
                    <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-5 -right-2 md:-top-10 md:-right-4 bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-2xl border border-slate-100/50 hidden sm:flex"
                    >
                        {/* You can add an icon or stat here if needed later */}
                    </motion.div>
                </div>
            </motion.div>

            {/* RIGHT: TEXT & TWO-FIELD SEARCH */}
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left"
            >
                <div className="flex justify-center lg:justify-start">
                    <YellowBadge text="India's Trusted Tutor Network" icon={Sparkles} />
                </div>

                <div className="space-y-3 md:space-y-4">
                    {/* Mobile: 3xl, Desktop: 5xl */}
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight uppercase tracking-tighter">
                        Find <span className="text-primary underline decoration-primary/20 underline-offset-4 md:underline-offset-8">Experienced</span> <br className="hidden md:block" />
                        Mentors Today.
                    </h1>
                    <p className="text-slate-400 font-semibold uppercase text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.25em]">
                        VERIFIED TUTORS <span className="text-slate-950 font-bold">DELIVERED WITHIN 30 MINUTES</span>
                    </p>
                </div>

                {/* DUAL SEARCH CONSOLE */}
                <div className="max-w-2xl mx-auto lg:mx-0 pt-2 md:pt-6">
                    <div className="space-y-4">
                        {/* Search Input Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2 md:p-3 bg-slate-50 border border-slate-100 rounded-[2rem] md:rounded-[2.5rem] shadow-sm">
                            
                            {/* Field 1: Subject */}
                            <div className="relative group" ref={subjectRef}>
                                <div className="flex items-center h-14 md:h-16 px-4 md:px-6 bg-white border border-slate-100 rounded-2xl md:rounded-[2rem] focus-within:ring-4 ring-primary/20 transition-all">
                                    <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary mr-3 md:mr-4 shrink-0" />
                                    <div className="flex-1 text-left">
                                        <p className="text-[8px] md:text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Subject / Activity</p>
                                        <input 
                                            type="text"
                                            value={subject}
                                            onChange={(e) => { setSubject(e.target.value); setShowSubjectSuggestions(true); }}
                                            onFocus={() => setShowSubjectSuggestions(true)}
                                            placeholder="Maths, Piano..."
                                            className="w-full bg-transparent outline-none text-sm md:text-base font-semibold text-slate-800 placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {showSubjectSuggestions && subject.length > 0 && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-[110%] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[150] max-h-60 overflow-y-auto"
                                        >
                                            {SUBJECTS.filter(s => s.toLowerCase().includes(subject.toLowerCase())).map(s => (
                                                <button key={s} onClick={() => { setSubject(s); setShowSubjectSuggestions(false); performSearch(s); }}
                                                    className="w-full px-5 py-3 text-left hover:bg-primary/5 text-xs md:text-sm font-semibold text-slate-700 transition-colors flex items-center justify-between">
                                                    {s} <ChevronRight className="w-4 h-4 text-slate-300" />
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Field 2: Class / Grade */}
                            <div className="relative group">
                                <div className="flex items-center h-14 md:h-16 px-4 md:px-6 bg-white border border-slate-100 rounded-2xl md:rounded-[2rem] focus-within:ring-4 ring-primary/20 transition-all">
                                    <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-indigo-500 mr-3 md:mr-4 shrink-0" />
                                    <div className="flex-1 text-left">
                                        <p className="text-[8px] md:text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Class / Grade</p>
                                        <select
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                            className="w-full bg-transparent border-none text-sm md:text-base font-semibold outline-none text-slate-850 py-1 cursor-pointer"
                                        >
                                            <option value="All">All Grades</option>
                                            {CLASSES.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Field 3: Location */}
                            <div className="relative group">
                                <div className="flex items-center h-14 md:h-16 px-4 md:px-6 bg-white border border-slate-100 rounded-2xl md:rounded-[2rem] focus-within:ring-4 ring-primary/20 transition-all">
                                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-red-500 mr-3 md:mr-4 shrink-0" />
                                    <div onClick={() => setShowHeroMap(!showHeroMap)} className="flex-1 text-left cursor-pointer">
                                        <p className="text-[8px] md:text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                                        <p className={`text-sm md:text-base font-semibold truncate ${location ? 'text-slate-900' : 'text-slate-300'}`}>
                                            {location || "Search Area"}
                                        </p>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {showHeroMap && (
                                        <motion.div 
                                            ref={heroMapRef}
                                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                            className="absolute top-[110%] right-0 w-[92vw] sm:w-[400px] md:w-[450px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-4 md:p-6 z-[150]"
                                        >
                                            <div className="flex items-center justify-between mb-4 px-2">
                                                <span className="text-xs md:text-sm font-bold text-slate-900 uppercase tracking-wider">Select Location</span>
                                                <X onClick={() => setShowHeroMap(false)} className="w-5 h-5 cursor-pointer text-slate-400 hover:text-slate-900" />
                                            </div>
                                            <div className="rounded-2xl overflow-hidden border border-slate-50 shadow-inner">
                                                <MapLocationPicker
                                                    onLocationSelect={(loc) => {
                                                        setLocation(loc.address); setLocationLat(loc.latitude); setLocationLng(loc.longitude);
                                                        setShowHeroMap(false); performSearch(subject, loc.address);
                                                    }}
                                                    initialAddress={location} height="280px" compact={true} accentColor="amber"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Field 4: Mode of Teaching */}
                            <div className="relative group">
                                <div className="flex items-center h-14 md:h-16 px-4 md:px-6 bg-white border border-slate-100 rounded-2xl md:rounded-[2rem] focus-within:ring-4 ring-primary/20 transition-all">
                                    <Users className="w-5 h-5 md:w-6 md:h-6 text-amber-500 mr-3 md:mr-4 shrink-0" />
                                    <div className="flex-1 text-left">
                                        <p className="text-[8px] md:text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Mode of Teaching</p>
                                        <select
                                            value={selectedMode}
                                            onChange={(e) => setSelectedMode(e.target.value)}
                                            className="w-full bg-transparent border-none text-sm md:text-base font-semibold outline-none text-slate-850 py-1 cursor-pointer"
                                        >
                                            <option value="All">Any type of mode</option>
                                            {MODES.map(m => {
                                                let label = m;
                                                if (m === "Home Tutor") label = "At Student Home";
                                                else if (m === "Online Tutor") label = "Online mode";
                                                else if (m === "At Centre") label = "At Teacher Home";
                                                return <option key={m} value={m}>{label}</option>;
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search Buttons Container */}
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <button 
                                onClick={handleSearchClick}
                                className="w-full sm:flex-[1.5] h-14 md:h-16 bg-primary hover:bg-primary/90 text-slate-950 font-extrabold rounded-2xl md:rounded-[2rem] transition-all duration-500 shadow-xl shadow-primary/10 active:scale-95 flex items-center justify-center gap-3 uppercase text-xs md:text-sm tracking-widest"
                            >
                                <Search className="w-4 h-4 md:w-5 md:h-5" /> Start Search
                            </button>
                            {searched && (
                                <button onClick={handleClearFilters} className="w-full sm:w-auto px-8 h-14 md:h-16 bg-white border border-slate-100 text-slate-400 hover:text-red-500 font-bold rounded-2xl md:rounded-[2rem] transition-all uppercase text-[10px] tracking-widest">
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Popular Cities */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4 mt-8 md:mt-10">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Popular:</span>
                        {POPULAR_CITIES.slice(0, 4).map(city => (
                            <button 
                                key={city} 
                                onClick={() => { setLocation(city); performSearch(subject, city); }} 
                                className="text-[10px] font-bold text-slate-900 hover:text-primary underline underline-offset-4 md:underline-offset-8 decoration-primary/20 uppercase tracking-tighter"
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

            {/* ──── 5.2 TUTOR DIRECTORY LISTING (Search Results) ──── */}
            <section ref={listingRef} className="container mx-auto px-4 md:px-6 py-16 md:py-28 scroll-mt-24">
    {/* Header Area */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-20">
        <SectionTitle 
            title={searched ? "Results Found" : "Featured Mentors"} 
            subTitle={`Explored ${processedTeachers.length} verified profile(s) matching your orbit.`} 
        />
        
        <div className="flex items-center gap-3">
            {searched && (
                <button 
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-500 font-black rounded-2xl border border-red-100 hover:bg-red-500 hover:text-white transition-all text-[10px] uppercase"
                >
                    <X className="w-4 h-4" /> Reset
                </button>
            )}
            <button 
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`flex items-center gap-2 px-5 py-3 border rounded-2xl transition-all shadow-sm ${showFilterPanel ? 'bg-primary border-primary text-white shadow-primary/20' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20'}`}
            >
                <Filter className="w-4 h-4" /> <span className="text-[10px] font-black uppercase">Filter</span>
            </button>
        </div>
    </div>

    {/* Advanced Filters Panel */}
    <AnimatePresence>
        {showFilterPanel && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] overflow-hidden"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Teaching Mode Filter */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Teaching Mode</label>
                        <select 
                            value={selectedMode} 
                            onChange={(e) => setSelectedMode(e.target.value)}
                            className="w-full h-12 px-4 bg-white border border-slate-200/80 rounded-xl outline-none font-bold text-xs text-slate-700 shadow-sm"
                        >
                            <option value="All">Any type of mode</option>
                            {MODES.map(m => {
                                let label = m;
                                if (m === "Home Tutor") label = "At Student Home";
                                else if (m === "Online Tutor") label = "Online mode";
                                else if (m === "At Centre") label = "At Teacher Home";
                                return <option key={m} value={m}>{label}</option>;
                            })}
                        </select>
                    </div>

                    {/* Class/Grade level Filter */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Class / Grade Level</label>
                        <select 
                            value={selectedClass} 
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full h-12 px-4 bg-white border border-slate-200/80 rounded-xl outline-none font-bold text-xs text-slate-700 shadow-sm"
                        >
                            <option value="All">All Classes</option>
                            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Sorting Filter */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort By</label>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full h-12 px-4 bg-white border border-slate-200/80 rounded-xl outline-none font-bold text-xs text-slate-700 shadow-sm"
                        >
                            <option value="default">Default Sort</option>
                            <option value="rating">Rating (High to Low)</option>
                            <option value="experience">Experience (High to Low)</option>
                        </select>
                    </div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>

    {/* Dynamic Grid Results */}
    {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Syncing profiles...</p>
        </div>
    ) : processedTeachers.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 md:p-12 space-y-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mx-auto text-slate-300">
                <Search className="w-8 h-8" />
            </div>
            <div>
                <h4 className="text-lg md:text-xl font-extrabold text-slate-900 uppercase">No Matches Found</h4>
                <p className="text-xs text-slate-450 font-bold max-w-md mx-auto mt-2 leading-relaxed">
                    We couldn't find any verified mentors matching your exact filter combination. 
                    Try broadening your selection or post your custom requirement below.
                </p>
            </div>
        </div>
    ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {processedTeachers.map((t, idx) => (
                <motion.div 
                    key={t.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 3) * 0.1 }}
                    className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 group flex flex-col h-full"
                >
                    {/* Profile Header Image Area */}
                    <div 
                        onClick={() => router.push(`/tutor/${t.id}`)}
                        className="relative h-64 md:h-72 lg:h-80 overflow-hidden cursor-pointer"
                    >
                        <div className="absolute top-5 left-5 md:top-6 md:left-6 z-20">
                            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 shadow-lg border border-white/30">
                                <ShieldCheck className="w-3.5 h-3.5 md:w-4 h-4 text-emerald-500" />
                                <span className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-widest">Verified Expert</span>
                            </div>
                        </div>

                        {/* Top Right Rating Badge */}
                        <div className="absolute top-5 right-5 z-20">
                            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg border border-white/30 text-[10px] font-black text-amber-500">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span>{t.rating || 5.0}</span>
                                <span className="text-slate-400 font-sans">({t.reviewsCount || 0})</span>
                            </div>
                        </div>
                        
                        {t.profilePhoto ? (
                            <img src={t.profilePhoto} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={t.name} />
                        ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-6xl md:text-7xl font-[1000] text-primary/40 uppercase">
                                {t.name?.[0]}
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                            <h3 
                                onClick={(e) => { e.stopPropagation(); router.push(`/tutor/${t.id}`); }}
                                className="text-2xl md:text-3xl font-[1000] text-white tracking-tighter leading-none group-hover:text-primary transition-colors uppercase truncate cursor-pointer"
                            >
                                {t.name}
                            </h3>
                            <div className="flex items-center gap-4 mt-3 md:mt-4 text-[9px] md:text-[10px] font-black text-white/80 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" /> {t.address?.split(',')[0]}</span>
                                <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" /> {t.teachingMode === "Home Tutor" ? "At Student Home" : t.teachingMode === "Online Tutor" ? "Online mode" : t.teachingMode === "At Centre" ? "At Teacher Home" : (t.teachingMode || "Online mode")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content Area */}
                    <div className="p-6 md:p-10 space-y-6 md:space-y-8 flex-1 flex flex-col justify-between">
                        <div className="space-y-4 md:space-y-6">
                            <div className="flex flex-wrap gap-2 md:gap-2.5">
                                {t.subjects?.slice(0, 3).map((s: string) => (
                                    <span key={s} className="px-3 py-1.5 md:px-4 md:py-2 bg-primary/5 text-primary text-[8px] md:text-[9px] font-black uppercase rounded-xl border border-primary/10 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">{s}</span>
                                ))}
                                {t.subjects && t.subjects.length > 3 && (
                                    <span className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 text-slate-400 text-[8px] md:text-[9px] font-black uppercase rounded-xl">+{t.subjects.length - 3} More</span>
                                )}
                            </div>
                            <p className="text-slate-500 text-xs md:text-base font-bold leading-relaxed line-clamp-2 italic">
                                "{t.achievements || "Dedicated to building strong foundational concepts and helping students excel in academics."}"
                            </p>
                        </div>

                        {/* Price & Action Footer */}
                        <div className="flex items-center justify-between pt-6 md:pt-10 border-t border-slate-50">
                            <div>
                                <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Experience</p>
                                <p className="text-xl md:text-2xl font-[1000] text-slate-900 tracking-tighter">{t.experience || "Verified"}</p>
                            </div>

                            <div className="flex gap-2 items-center">
                                <button 
                                    onClick={() => { if (!session) { router.push("/signup"); return; } window.open(`https://wa.me/91${t.phone?.replace(/\D/g, "").slice(-10)}`) }}
                                    className="px-3 py-2 bg-[#e8f5e9] text-[#2e7d32] hover:bg-[#2e7d32] hover:text-white font-extrabold text-[9px] md:text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center gap-1 active:scale-95 border-none cursor-pointer"
                                >
                                    <MessageSquare className="w-3.5 h-3.5" /> Message
                                </button>
                                <button 
                                    onClick={() => { if (!session) { router.push("/signup"); return; } window.open(`tel:${t.phone}`, "_self") }}
                                    className="px-3 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-slate-950 font-extrabold text-[9px] md:text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center gap-1 active:scale-95 border-none cursor-pointer"
                                >
                                    <Phone className="w-3.5 h-3.5" /> Call
                                </button>
                                <button 
                                    onClick={() => router.push(`/tutor/${t.id}`)}
                                    className="px-3 py-2 bg-slate-950 text-white font-extrabold text-[9px] md:text-[10px] uppercase tracking-wider rounded-xl hover:bg-primary hover:text-slate-950 transition-all duration-300 shadow-md active:scale-95 border-none cursor-pointer"
                                >
                                    View Full Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )}
</section>

            {/* ──── 5.3 SUGGESTIONS WITH NEARBY LOCALITIES ──── */}
            <section className="py-12 bg-slate-50 border-y border-slate-100">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h3 className="text-xs md:text-sm font-extrabold text-slate-450 uppercase tracking-widest mb-6">
                        Suggestions with Nearby Localities
                    </h3>
                    <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
                        {[
                            "Bhavanipuram", "Patamata", "Gollapudi", "Vidyadharapuram", 
                            "Benz Circle", "Labbipet", "Gurunanak Colony", "Kanuru", 
                            "Moghalrajpuram", "Lalitha Nagar", "Swathi Road"
                        ].map((loc) => (
                            <button
                                key={loc}
                                onClick={() => {
                                    setLocation(loc);
                                    performSearch(subject, loc);
                                    if (listingRef.current) {
                                        listingRef.current.scrollIntoView({ behavior: "smooth" });
                                    }
                                }}
                                className="px-5 py-2.5 bg-white border border-slate-200 hover:border-primary hover:text-primary rounded-xl text-xs font-bold text-slate-600 transition-all duration-300 shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
                            >
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{loc}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── 5.4 POST REQUIREMENT MEGA FORM ──── */}
           <section className="py-16 md:py-24 lg:py-32 bg-white relative z-10">
    <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-7xl mx-auto bg-slate-50 rounded-[2.5rem] md:rounded-[4rem] lg:rounded-[5rem] p-6 md:p-12 lg:p-24 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            {/* LEFT SIDE: INFO & SUPPORT */}
            <div className="space-y-8 md:space-y-12 lg:w-1/3">
                <SectionTitle title="Can't Find Your match?" subTitle="LET US HELP" />
                
                <ul className="space-y-4 md:space-y-6 lg:space-y-8">
                    {[
                        { text: "100% Free Consultation", icon: CheckCircle },
                        { text: "Lead Matching Within 12hrs", icon: Timer },
                        { text: "Verified Experts Only", icon: UserCheck },
                        { text: "Personal Support Desk", icon: PhoneCall },
                    ].map((li, i) => (
                        <li key={i} className="flex items-center gap-4 md:gap-6 text-slate-800 font-[900] text-[10px] md:text-[11px] uppercase tracking-widest group cursor-default">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform shrink-0">
                                <li.icon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <span>{li.text}</span>
                        </li>
                    ))}
                </ul>

                {/* CALL SUPPORT CARD */}
                <div className="p-6 md:p-10 bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm space-y-3 md:space-y-4">
                    <h4 className="text-lg md:text-xl font-[1000] text-slate-900 uppercase">Need a quick call?</h4>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 leading-relaxed">
                        Our relationship managers are available from 10 AM to 7 PM.
                    </p>
                    <button className="flex items-center gap-2 text-primary font-[1000] uppercase text-[10px] md:text-xs hover:gap-4 transition-all">
                        Connect Now <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* RIGHT SIDE: THE FORM */}
            <div className="lg:w-2/3">
                <div className="bg-white rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] p-6 md:p-10 lg:p-16 shadow-2xl border border-slate-50 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-8 lg:mb-10">
                        {/* INPUTS COLUMN */}
                        <div className="space-y-6 lg:space-y-8">
                            <div className="space-y-2 md:space-y-3">
                                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Learning Subject</label>
                                <select value={reqSubject} onChange={e => setReqSubject(e.target.value)} className="w-full h-14 md:h-16 px-6 md:px-8 bg-slate-50 border-none rounded-2xl md:rounded-[2rem] outline-none focus:ring-4 ring-primary/20 font-black text-slate-700 appearance-none shadow-inner text-sm">
                                    <option value="">Select Subject</option>
                                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2 md:space-y-3">
                                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Target Class</label>
                                <select value={reqClass} onChange={e => setReqClass(e.target.value)} className="w-full h-14 md:h-16 px-6 md:px-8 bg-slate-50 border-none rounded-2xl md:rounded-[2rem] outline-none focus:ring-4 ring-primary/20 font-black text-slate-700 appearance-none shadow-inner text-sm">
                                    <option value="">Choose Class</option>
                                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2 md:space-y-3">
                                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Learning Mode</label>
                                <select value={reqMode} onChange={e => setReqMode(e.target.value)} className="w-full h-14 md:h-16 px-6 md:px-8 bg-slate-50 border-none rounded-2xl md:rounded-[2rem] outline-none focus:ring-4 ring-primary/20 font-black text-slate-700 appearance-none shadow-inner text-sm">
                                    <option value="">Home / Online</option>
                                    {MODES.map(m => {
                                        let label = m;
                                        if (m === "Home Tutor") label = "At Student Home";
                                        else if (m === "Online Tutor") label = "Online mode";
                                        else if (m === "At Centre") label = "At Teacher Home";
                                        return <option key={m} value={m}>{label}</option>;
                                    })}
                                </select>
                            </div>
                        </div>

                        {/* MAP COLUMN */}
                        <div className="space-y-2 md:space-y-3">
                            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Exact Area / Pin</label>
                            <div className="rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-2 md:border-4 border-slate-50 shadow-inner">
                                <MapLocationPicker
                                    onLocationSelect={(loc) => { setReqLocation(loc.address); setReqLat(loc.latitude); setReqLng(loc.longitude); }}
                                    initialAddress={reqLocation} height="220px md:245px" compact={true} accentColor="amber"
                                />
                            </div>
                        </div>
                    </div>

                    {/* TEXTAREA */}
                    <div className="space-y-2 md:space-y-3 mb-8 md:mb-12">
                        <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Additional Instructions (Optional)</label>
                        <textarea 
                            value={reqMessage} onChange={e => setReqMessage(e.target.value)} 
                            placeholder="Specific goals, timing preferences, or teacher gender preference..."
                            className="w-full p-6 md:p-8 bg-slate-50 border-none rounded-[1.5rem] md:rounded-[2.5rem] min-h-[120px] md:min-h-[160px] outline-none focus:ring-4 ring-primary/20 font-bold text-slate-700 shadow-inner resize-none text-sm"
                        />
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button 
                        onClick={handlePostRequirement} disabled={submittingReq}
                        className="w-full h-16 md:h-20 bg-primary hover:bg-primary/95 text-white font-[1000] rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-300 shadow-2xl shadow-primary/20 active:scale-95 disabled:opacity-50 uppercase text-xs md:text-sm tracking-[0.25em]"
                    >
                        {submittingReq ? "Submitting Request..." : "Submit Requirement Now"}
                    </button>
                </div>
            </div>
        </div>
    </div>
</section>

            {/* ──── 5.5 WHAT ARE YOU LOOKING FOR? (Persona Selection) ──── */}
            <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
    {/* Visual texture */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
    
    <div className="container mx-auto px-4 md:px-6">
        <div className="space-y-4 text-center flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-[1000] text-white leading-tight uppercase tracking-tighter">
                What Are You Looking For?
            </h2>
            <div className="w-20 h-2 bg-primary rounded-full" />
            <p className="text-slate-400 font-black uppercase text-xs tracking-[0.25em]">CHOOSE YOUR PATH</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 max-w-6xl mx-auto mt-12 md:mt-20">
            
            {/* Tutor Persona */}
            <motion.div 
                whileHover={{ y: -12 }}
                className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border-b-[8px] md:border-b-[12px] border-slate-900/5 relative overflow-hidden group"
            >
                <div className="w-24 h-24 md:w-40 md:h-32 shrink-0 bg-slate-50 rounded-2xl md:rounded-[2rem] flex items-center justify-center p-4 md:p-6 transition-transform group-hover:scale-105">
                    <img src="https://cdn-icons-png.flaticon.com/512/3429/3429433.png" alt="Teacher Icon" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-4 md:space-y-6 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-[1000] text-slate-900 tracking-tighter uppercase leading-none">I'M A TUTOR</h3>
                    <p className="text-slate-500 font-bold leading-relaxed text-xs md:text-sm">
                        Perfect Tutor connects Students with Home Tutors and Online Tutors. We provide full-time & part-time jobs for all classes from KG to XII, Competitive Exams, Hobbies & more.
                    </p>
                    <button 
                        onClick={() => router.push("/signup/teacher")}
                        className="px-8 md:px-10 py-3 md:py-4 bg-primary hover:bg-slate-950 text-white font-[1000] text-[10px] md:text-xs uppercase tracking-widest rounded-xl md:rounded-2xl transition-all shadow-xl active:scale-95"
                    >
                        Sign Up Free
                    </button>
                </div>
            </motion.div>

            {/* Student Persona */}
            <motion.div 
                whileHover={{ y: -12 }}
                className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border-b-[8px] md:border-b-[12px] border-slate-900/5 relative overflow-hidden group"
            >
                <div className="w-24 h-24 md:w-40 md:h-32 shrink-0 bg-slate-50 rounded-2xl md:rounded-[2rem] flex items-center justify-center p-4 md:p-6 transition-transform group-hover:scale-105">
                    <img src="https://cdn-icons-png.flaticon.com/512/2941/2941658.png" alt="Student Icon" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-4 md:space-y-6 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-[1000] text-slate-900 tracking-tighter uppercase leading-none">I'M A STUDENT</h3>
                    <p className="text-slate-500 font-bold leading-relaxed text-xs md:text-sm">
                        Looking for top-qualified home or online tutors? Post your learning requirements for free and get an instant response from verified experts in your neighborhood.
                    </p>
                    <button 
                        onClick={() => router.push("/signup")}
                        className="px-8 md:px-10 py-3 md:py-4 bg-primary hover:bg-slate-950 text-white font-[1000] text-[10px] md:text-xs uppercase tracking-widest rounded-xl md:rounded-2xl transition-all shadow-xl active:scale-95"
                    >
                        Hire a Tutor
                    </button>
                </div>
            </motion.div>

        </div>
    </div>
</section>

            {/* ──── 5.6 STATS STRIP ──── */}
            <section className="bg-slate-50 py-10 md:py-16 border-y border-slate-100">
    <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <StatCard icon={Award} value="100%" label="Verified Tutors" />
            <StatCard icon={Heart} value="25,000+" label="Happy Learners" />
            <StatCard icon={Timer} value="30 Min" label="Fast Response" />
            <StatCard icon={School} value="500+" label="Subjects Covered" />
        </div>
    </div>
</section>

            {/* ──── 5.7 "HOW IT WORKS" BENTO GRID ──── */}
            <section className="bg-slate-50 py-16 md:py-24 lg:py-32 relative overflow-hidden">
    <div className="container mx-auto px-4 md:px-6">
        <SectionTitle 
            title="Simple Steps To Connect" 
            subTitle="THE AACHARYA JOURNEY" 
            centered={true} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12 md:mt-20">
            {[
                { title: "Search & Filter", desc: "Browse through verified mentors based on subject, location, and rating.", icon: Search, color: "bg-primary text-white" },
                { title: "Check Profile", desc: "Read achievements, teaching methodology, and parent testimonials.", icon: BookMarked, color: "bg-slate-950 text-white" },
                { title: "Demo Session", desc: "Book a free demonstration class to ensure the perfect student-teacher fit.", icon: UserCheck, color: "bg-white border-2 border-primary" },
                { title: "Start Learning", desc: "Begin your customized learning path and track academic progress.", icon: Rocket, color: "bg-primary text-white" }
            ].map((step, i) => (
                <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    className={`
                        p-8 md:p-10 lg:p-12 
                        rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3.5rem] 
                        shadow-xl flex flex-col justify-between 
                        ${step.color} 
                        relative overflow-hidden
                    `}
                >
                    <div className="absolute top-6 right-6 md:top-8 md:right-8 text-5xl md:text-6xl lg:text-7xl font-[1000] opacity-[0.05] pointer-events-none">
                        0{i + 1}
                    </div>

                    <div className={`
                        w-14 h-14 md:w-16 md:h-16 
                        rounded-2xl md:rounded-3xl 
                        flex items-center justify-center 
                        shadow-lg 
                        ${step.color.includes('slate') || step.color.includes('primary') ? 'bg-white/10' : 'bg-white shadow-inner'}
                    `}>
                        <step.icon className={`w-6 h-6 md:w-8 md:h-8 ${step.color.includes('slate') || step.color.includes('primary') ? 'text-white' : 'text-slate-950'}`} />
                    </div>

                    <div className="space-y-3 md:space-y-4 mt-12 md:mt-16 lg:mt-20">
                        <h4 className="text-xl md:text-2xl font-[1000] uppercase tracking-tighter leading-none">
                            {step.title}
                        </h4>
                        <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] leading-relaxed opacity-70">
                            {step.desc}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
</section>

            {/* ──── 5.8 TESTIMONIALS STRIP (RESPONSIVE BLOB STYLE) ──── */}
<section className="bg-[#fcfdfa] py-16 md:py-24 relative overflow-hidden">
    <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 md:mb-20 space-y-4">
            <h2 className="text-2xl md:text-5xl font-[1000] text-slate-900 tracking-tighter uppercase leading-none">
                Client Feedback <span className="text-primary">& Testimonial</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-xs md:text-sm font-bold leading-relaxed px-2 md:px-4">
                We take pride in the success of our students. Here is what parents and learners 
                have to say about their journey with Aacharya Tutors.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-12 max-w-7xl mx-auto">
            {[
                { name: "Ananya Iyer", role: "Parent of Class 10th Student", color: "bg-[#8cc63f]" },
                { name: "Rajesh Verma", role: "Software Aspirant", color: "bg-[#00aeef]" },
                { name: "Suman Rao", role: "Hobby Learner (Violin)", color: "bg-primary" }
            ].map((client, i) => (
                <motion.div 
                    key={i}
                    whileHover={{ y: -12 }}
                    className="relative bg-white p-8 md:p-10 pt-16 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.08)] transition-all duration-500
                                rounded-tl-[60px] rounded-br-[60px] rounded-tr-[30px] rounded-bl-[30px] 
                                md:rounded-tl-[100px] md:rounded-br-[100px] md:rounded-tr-[40px] md:rounded-bl-[40px] 
                                flex flex-col h-full"
                >
                    <div className={`absolute -top-6 md:-top-8 left-8 md:left-10 w-16 h-16 md:w-20 md:h-20 rounded-full ${client.color} 
                                    flex items-center justify-center text-white shadow-xl border-[4px] md:border-[6px] border-white`}>
                        <svg width="24" height="24" className="md:w-[35px] md:h-[35px]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.192 15.757c0 1.964-1.594 3.557-3.558 3.557-1.963 0-3.557-1.593-3.557-3.557 0-1.964 1.594-3.558 3.557-3.558h.721c-.347-1.545-1.127-2.659-2.339-3.344l.804-1.411c2.148 1.055 3.194 3.102 3.412 5.313h1.01zm9.25 0c0 1.964-1.594 3.557-3.558 3.557-1.963 0-3.557-1.593-3.557-3.557 0-1.964 1.594-3.558 3.557-3.558h.721c-.347-1.545-1.127-2.659-2.339-3.344l.804-1.411c2.148 1.055 3.194 3.102 3.412 5.313h1.01z" />
                        </svg>
                    </div>

                    <div className="mb-4 md:mb-6 ml-2 md:ml-4">
                        <h4 className="text-xl md:text-2xl font-[1000] text-slate-900 leading-tight">{client.name}</h4>
                        <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1">{client.role}</p>
                        
                        <div className="flex text-[#fbb040] gap-1 mt-3 md:mt-4">
                            {[...Array(5)].map((_, idx) => (
                                <Star key={idx} className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                            ))}
                        </div>
                    </div>

                    <p className="text-slate-500 text-[11px] md:text-xs font-bold leading-relaxed mb-6 md:mb-8 ml-2 md:ml-4">
                        "The experience has been absolutely life-changing for my child. 
                        The tutors are not just teachers but mentors who truly care 
                        about the fundamental understanding of the subject."
                    </p>

                    <div className="mt-auto self-end opacity-[0.05] text-slate-900">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="md:w-[50px] md:h-[50px] rotate-180">
                            <path d="M11.192 15.757c0 1.964-1.594 3.557-3.558 3.557-1.963 0-3.557-1.593-3.557-3.557 0-1.964 1.594-3.558 3.557-3.558h.721c-.347-1.545-1.127-2.659-2.339-3.344l.804-1.411c2.148 1.055 3.194 3.102 3.412 5.313h1.01zm9.25 0c0 1.964-1.594 3.557-3.558 3.557-1.963 0-3.557-1.593-3.557-3.557 0-1.964 1.594-3.558 3.557-3.558h.721c-.347-1.545-1.127-2.659-2.339-3.344l.804-1.411c2.148 1.055 3.194 3.102 3.412 5.313h1.01z" />
                        </svg>
                    </div>
                </motion.div>
            ))}
        </div>

        <div className="flex justify-center items-center gap-3 mt-12 md:mt-20">
            <button className="w-3 h-3 rounded-full border-2 border-slate-300 hover:bg-primary hover:border-primary transition-all"></button>
            <button className="w-3 h-3 rounded-full border-2 border-slate-300 hover:bg-primary hover:border-primary transition-all"></button>
            <div className="w-12 h-3.5 md:w-14 md:h-4 rounded-full bg-slate-200 border-2 border-slate-300 shadow-inner relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1/2 bg-primary"></div>
            </div>
        </div>
    </div>
</section>

            {/* ──── 5.9 DETAILED FAQ SECTION ──── */}
            <section className="py-16 md:py-24 lg:py-32 bg-white relative overflow-hidden">
    <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <SectionTitle title="Frequently Asked Questions" subTitle="YOUR QUERIES RESOLVED" centered={true} />

        <div className="space-y-4 md:space-y-6 mt-12 md:mt-20 lg:mt-24">
            {FAQS.map((f, i) => (
                <motion.div 
                    layout
                    key={i} 
                    className={`rounded-3xl md:rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${
                        faqOpen === i 
                        ? "border-primary bg-white shadow-xl shadow-primary/5" 
                        : "border-slate-50 bg-slate-50/50 md:bg-white"
                    }`}
                >
                    <button 
                        onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                        className="w-full p-5 md:p-8 lg:p-10 text-left flex justify-between items-center group gap-4"
                    >
                        <span className={`text-sm md:text-lg lg:text-xl font-[1000] tracking-tighter uppercase transition-colors leading-tight ${
                            faqOpen === i ? "text-primary" : "text-slate-900"
                        }`}>
                            {f.q}
                        </span>
                        <div className={`shrink-0 p-2 md:p-3 rounded-xl transition-all shadow-sm ${
                            faqOpen === i 
                            ? "bg-primary text-white rotate-180 shadow-primary/20" 
                            : "bg-white text-slate-300 group-hover:text-slate-500"
                        }`}>
                            <ChevronRight className="-rotate-90 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                        </div>
                    </button>
                    
                    <AnimatePresence>
                        {faqOpen === i && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: "auto", opacity: 1 }} 
                                exit={{ height: 0, opacity: 0 }}
                                className="px-5 pb-5 md:px-8 md:pb-8 lg:px-10 lg:pb-10"
                            >
                                <div className="pt-4 md:pt-6 border-t border-slate-50 text-slate-500 font-[900] leading-relaxed text-[10px] md:text-xs lg:text-sm uppercase tracking-widest opacity-80">
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

            {/* ──── 5.10 PREMIUM CHESS BANNER (PREVIEW) ──── */}
            <section className="container mx-auto px-4 md:px-6 pb-16 md:pb-24">
                <div className="relative rounded-[2rem] md:rounded-[3.5rem] bg-[#1e1b4b] p-6 md:p-12 lg:p-16 overflow-hidden group shadow-xl">
                    {/* Animated Background Blobs */}
                    <div className="absolute top-0 right-0 w-[60%] h-full bg-primary/10 rounded-full blur-[80px] md:blur-[120px] translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[250px] md:w-[300px] h-[250px] md:h-[300px] bg-indigo-500/20 rounded-full blur-[60px] md:blur-[80px] -translate-x-1/2 translate-y-1/2" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16 text-center lg:text-left">
                        {/* Text Content Area */}
                        <div className="space-y-4 md:space-y-6">
                            <div className="flex justify-center lg:justify-start">
                                <YellowBadge text="Exclusive Coaching Track" icon={Swords} />
                            </div>
                            
                            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tighter uppercase leading-[1.1] md:leading-[0.85]">
                                Master Everything with <br className="hidden md:block" />
                                <span className="text-primary font-black">Our Expert</span>{" "}
                                Tutors.
                            </h2>
                            
                            <p className="text-indigo-200/60 font-medium text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] leading-relaxed max-w-lg mx-auto lg:mx-0">
                                Comprehensive training from board basics to international competitive strategies. Enrollment open for all ages.
                            </p>
                        </div>

                        {/* CTA Button */}
                        <button 
                            onClick={() => router.push("/signup")}
                            className="w-full sm:w-auto px-8 md:px-10 py-3.5 md:py-4 bg-white hover:bg-primary hover:text-white text-slate-950 font-extrabold text-xs md:text-sm rounded-xl md:rounded-2xl transition-all duration-500 shadow-xl active:scale-95 flex items-center justify-center gap-3 md:gap-4 group uppercase tracking-widest"
                        >
                            Get Started Now 
                            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
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
                    background-color: var(--primary);
                    color: #fff;
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