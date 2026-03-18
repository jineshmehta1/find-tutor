"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { toast } from "sonner";
import MapLocationPicker from "@/components/ui/DynamicMapPicker";

/* ───────── constants ───────── */
const SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi",
    "History", "Geography", "Computer Science", "Economics", "Accountancy",
    "Business Studies", "Political Science", "Psychology", "Sociology",
    "Sanskrit", "French", "German", "Music", "Art",
    "Chess", "Abacus", "Robotics", "Coding", "Spoken English", "Aptitude"
];
const SKILL_SUBJECTS = ["Chess", "Abacus", "Robotics", "Coding", "Spoken English", "Aptitude"];
const ACADEMIC_SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English"];
const CLASSES = [
    "Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12",
    "Age 3-5", "Age 5-8", "Age 8-12", "Age 12-16", "Age 16+"
];
const MODES = ["Home Tutor", "Online Tutor", "At Centre"];
const QUAL_LEVELS = ["Degree", "PG", "M.Phil", "PhD", "PostDoc"];
const QUAL_NAMES = [
    "BSc", "BA", "B.Com", "B.Tech", "BE", "BBA", "BCA",
    "MSc", "MA", "M.Com", "M.Tech", "ME", "MBA", "MCA",
    "MPhil", "PhD", "Other"
];
const CLOUDINARY_CLOUD_NAME = "dx2o9yq2t";
const CLOUDINARY_UPLOAD_PRESET = "gallery";

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
    const [classLevel, setClassLevel] = useState("");
    const [mode, setMode] = useState("");
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [filtered, setFiltered] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searched, setSearched] = useState(false);

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

    /* ── listing ref ── */
    const listingRef = useRef<HTMLDivElement>(null);

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

    /* ───────── search handler ───────── */
    const handleSearch = () => {
        let result = [...teachers];
        if (location.trim()) result = result.filter(t => t.address?.toLowerCase().includes(location.toLowerCase()));
        if (subject.trim()) result = result.filter(t => t.subjects?.some(s => s.toLowerCase().includes(subject.toLowerCase())));
        if (classLevel) result = result.filter(t => {
            if (!t.classesOrAgeGroup) return false;
            return t.classesOrAgeGroup.some(c => c.toLowerCase().includes(classLevel.toLowerCase()));
        });
        if (mode) result = result.filter(t => t.teachingMode?.toLowerCase().includes(mode.toLowerCase()));
        setFiltered(result);
        setSearched(true);
        listingRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    /* ───────── login gate ───────── */
    const requireLogin = (action: string) => {
        if (!session) { toast.error(`Please sign up or login to ${action}`); router.push("/signup"); return true; }
        return false;
    };

    /* ───────── post requirement handler ───────── */
    const handlePostRequirement = async () => {
        if (!session) {
            toast.error("Please sign up or login to post your requirement");
            router.push("/signup");
            return;
        }

        if (!reqSubject && !reqLocation && !reqClass && !reqMode) {
            toast.error("Please fill in at least one field");
            return;
        }

        setSubmittingReq(true);
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location: reqLocation.trim(),
                    latitude: reqLat,
                    longitude: reqLng,
                    subject: reqSubject,
                    classLevel: reqClass,
                    mode: reqMode,
                    message: reqMessage.trim(),
                }),
            });
            const data = await res.json();
            if (!res.ok) { toast.error(data.error || "Failed to post requirement"); return; }
            toast.success("Requirement posted successfully! Tutors will contact you soon.");
            setReqLocation(""); setReqSubject(""); setReqClass(""); setReqMode(""); setReqMessage("");
            setReqLat(undefined); setReqLng(undefined);
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
        { q: "How soon can I get a tutor response?", a: "Usually within 24–48 hours or you have the option to call the tutor directly." },
    ];

    /* ═══════════════════════════ RENDER ═══════════════════════════ */
    return (
        <>
            <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">

                {/* ════════════ HERO ════════════ */}
                <section className="relative w-full overflow-hidden pt-16 pb-24 md:pt-20 md:pb-28" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4c1d95 50%, #78350f 85%, #92400e 100%)' }}>
                    {/* Animated mesh gradient overlay */}
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(251,191,36,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.4) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(245,158,11,0.3) 0%, transparent 50%)' }} />

                    {/* Floating geometric shapes */}
                    <div className="absolute top-16 left-[8%] w-20 h-20 border-2 border-white/10 rounded-2xl rotate-12 hidden md:block" style={{ animation: 'floatBounce 8s ease-in-out infinite' }} />
                    <div className="absolute top-1/3 right-[12%] w-14 h-14 bg-amber-400/10 rounded-full hidden md:block" style={{ animation: 'floatBounce 6s ease-in-out infinite 1s' }} />
                    <div className="absolute bottom-20 left-[15%] w-10 h-10 border border-yellow-300/20 rounded-lg rotate-45 hidden md:block" style={{ animation: 'floatBounce 7s ease-in-out infinite 0.5s' }} />
                    <div className="absolute top-1/4 left-[45%] w-6 h-6 bg-violet-400/15 rounded-full" style={{ animation: 'floatBounce 5s ease-in-out infinite 2s' }} />
                    <div className="absolute bottom-32 right-[20%] w-16 h-16 border border-amber-300/10 rounded-full hidden md:block" style={{ animation: 'floatBounce 9s ease-in-out infinite 1.5s' }} />

                    {/* Main content */}
                    <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-amber-200 text-sm font-semibold mb-8" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
                            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                            Trusted by 1000+ Parents & Students
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight max-w-5xl leading-[1.08]" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
                            Find Verified{' '}
                            <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent">Tutors</span>{' '}
                            Near You
                            <br className="hidden md:block" />
                            <span className="text-white/90"> – Home, Online & </span>
                            <span className="relative inline-block bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
                                At Centre
                                <svg className="absolute w-full h-3 -bottom-1.5 left-0 text-amber-400/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                                </svg>
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-white/80 font-medium mb-3 max-w-3xl" style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
                            Personalised tutors for academics and skill development.
                        </p>
                        <p className="text-sm md:text-base text-white/55 max-w-3xl mb-10 leading-relaxed" style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>
                            Search from <span className="text-white/80 font-semibold">verified and experienced</span> tutors in your area – Home Tutor, Online Tutor or At-Centre coaching for Maths, Science, Chess, Robotics, Abacus and more.
                        </p>

                        {/* Feature chips */}
                        <div className="flex flex-wrap justify-center gap-3 mb-10" style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
                            {[
                                { label: "Search by Location", icon: "📍" },
                                { label: "Pick Subject / Skill", icon: "📘" },
                                { label: "Choose Class / Age", icon: "🎓" },
                                { label: "Home / Online / Centre", icon: "🏠" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl text-white/90 font-medium text-sm hover:bg-white/20 hover:border-white/25 transition-all duration-300 cursor-default">
                                    <span>{item.icon}</span>
                                    {item.label}
                                </div>
                            ))}
                        </div>

                        {/* Breadcrumb */}
                        <nav className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15" style={{ animation: 'fadeInUp 0.6s ease-out 0.5s both' }}>
                            <a href="/" className="text-white/60 hover:text-amber-300 transition-colors flex items-center gap-1.5 text-sm font-medium">
                                🏠 <span>Home</span>
                            </a>
                            <span className="text-white/30">›</span>
                            <span className="text-amber-300 font-semibold text-sm">Find Tutor Nearby</span>
                        </nav>
                    </div>

                    {/* Animations */}
                    <style jsx>{`
                        @keyframes floatBounce {
                            0%, 100% { transform: translateY(0) rotate(0deg); }
                            50% { transform: translateY(-20px) rotate(3deg); }
                        }
                        @keyframes fadeInUp {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                </section>

                {/* ════════════ SEARCH FILTERS ════════════ */}
                <section className="max-w-6xl mx-auto px-4 -mt-14 relative z-20">
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-white/60 p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white text-sm">🔍</div>
                            <h3 className="text-lg font-bold text-slate-800">Search Tutors</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                            <div className="md:col-span-2 lg:col-span-4">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">📍 Location / Pincode</label>
                                <MapLocationPicker
                                    onLocationSelect={(loc) => {
                                        setLocation(loc.address);
                                        setLocationLat(loc.latitude);
                                        setLocationLng(loc.longitude);
                                    }}
                                    initialAddress={location}
                                    accentColor="amber"
                                    height="220px"
                                    compact={true}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">📘 Subject / Skill</label>
                                <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none bg-white hover:border-slate-300 transition-colors appearance-none text-slate-700 font-medium">
                                    <option value="">All Subjects</option>
                                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">🎓 Class / Age Group</label>
                                <select value={classLevel} onChange={e => setClassLevel(e.target.value)} className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none bg-white hover:border-slate-300 transition-colors appearance-none text-slate-700 font-medium">
                                    <option value="">All Classes</option>
                                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">🏠 Mode</label>
                                <select value={mode} onChange={e => setMode(e.target.value)} className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none bg-white hover:border-slate-300 transition-colors appearance-none text-slate-700 font-medium">
                                    <option value="">All Modes</option>
                                    {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>
                        <button onClick={handleSearch} className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base">
                            🔍 Find Tutor
                        </button>
                    </div>
                </section>

                {/* ════════════ TOP TUTOR CATEGORIES ════════════ */}
                <section className="max-w-6xl mx-auto px-4 py-20">
                    <div className="text-center mb-14">
                        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 text-sm font-bold mb-4 border border-amber-100/50">
                            ✨ Browse by Category
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">Top Tutor Categories</h2>
                        <p className="text-slate-500 mt-3 max-w-xl mx-auto text-base">Find the perfect tutor by subject, skill, or preferred mode of learning</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: "📘", title: "Academic Tutors", desc: "Core subjects for all classes", items: ACADEMIC_SUBJECTS, type: "subject" as const, gradient: "from-blue-500 to-indigo-600" },
                            { icon: "♟️", title: "Skill Tutors", desc: "Beyond academics — build real skills", items: SKILL_SUBJECTS, type: "subject" as const, gradient: "from-violet-500 to-purple-600" },
                            { icon: "🏠", title: "Mode of Learning", desc: "Choose how you want to learn", items: MODES, type: "mode" as const, gradient: "from-amber-500 to-orange-600" },
                        ].map((cat, i) => (
                            <div key={i} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-400">
                                <div className={`h-1.5 bg-gradient-to-r ${cat.gradient}`} />
                                <div className="p-6 pb-4">
                                    <div className="flex items-center gap-3.5 mb-3">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${cat.gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-slate-900/5`}>{cat.icon}</div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">{cat.title}</h3>
                                            <p className="text-slate-400 text-xs">{cat.desc}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 pb-6">
                                    <div className="flex flex-wrap gap-2">
                                        {cat.items.map(item => (
                                            <button key={item} onClick={() => { cat.type === "mode" ? setMode(item) : setSubject(item); handleSearch(); }}
                                                className="px-3.5 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-700 border border-slate-150 hover:border-amber-200 transition-all duration-200 hover:scale-[1.03]">
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ════════════ TUTOR LISTING ════════════ */}
                <section ref={listingRef} className="max-w-6xl mx-auto px-4 pb-20">
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
                            <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your filters or search in a different area</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map(t => (
                                <div key={t.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-900/8 hover:-translate-y-1 transition-all duration-400 group">
                                    <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-2 border-white/40 shadow-lg">
                                                    {t.profilePhoto ? (
                                                        <img src={t.profilePhoto} alt={t.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-2xl font-bold text-white">{t.name?.[0]}</span>
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                                                    <span className="text-[8px] text-white">✓</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-white truncate">{t.name}</h3>
                                                <p className="text-white/70 text-sm flex items-center gap-1 truncate">📍 {t.address?.split(",")[0]}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {t.subjects?.slice(0, 3).map(s => (
                                                <span key={s} className="px-2.5 py-1 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-lg text-xs font-semibold border border-amber-100/50">{s}</span>
                                            ))}
                                            {t.subjects?.length > 3 && <span className="px-2.5 py-1 bg-slate-50 text-slate-400 rounded-lg text-xs font-medium">+{t.subjects.length - 3}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <span className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-xs">🎓</span>
                                                <span className="font-medium text-slate-500">Experience:</span>
                                                <span className="font-semibold text-slate-800">{t.experience || "N/A"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <span className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center text-xs">🏠</span>
                                                <span className="font-medium text-slate-500">Mode:</span>
                                                <span className="font-semibold text-slate-800">{t.teachingMode || "N/A"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <span className="w-7 h-7 bg-yellow-50 rounded-lg flex items-center justify-center text-xs">⭐</span>
                                                <span className="font-medium text-slate-500">Rating:</span>
                                                <span className="font-semibold text-amber-600">★★★★☆</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-1 border-t border-slate-100">
                                            <button onClick={() => { if (!requireLogin("call tutor")) window.open(`tel:${t.phone}`); }}
                                                className="flex-1 px-3 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:-translate-y-0.5">
                                                📞 Call
                                            </button>
                                            <button onClick={() => { if (!requireLogin("WhatsApp tutor")) window.open(`https://wa.me/91${t.phone?.replace(/\D/g, "").slice(-10)}`); }}
                                                className="flex-1 px-3 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5">
                                                💬 WhatsApp
                                            </button>
                                            <button onClick={() => { if (!requireLogin("request demo")) router.push("/bookdemo"); }}
                                                className="flex-1 px-3 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5">
                                                📝 Demo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>


                {/* ════════════ BECOME A TUTOR CTA ════════════ */}
                <section className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #581c87 100%)' }}>
                    <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-amber-400/10 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3" />
                    <div className="absolute top-10 right-[20%] w-16 h-16 border border-white/10 rounded-xl rotate-12 hidden md:block" />
                    <div className="absolute bottom-10 left-[15%] w-12 h-12 border border-white/10 rounded-full hidden md:block" />
                    <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-amber-200 text-sm font-semibold mb-6">
                            <span className="text-lg">🌟</span> Join Our Growing Network
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-5 max-w-2xl mx-auto leading-tight">
                            Are You a Tutor? Join{' '}
                            <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">Aacharya</span>
                        </h2>
                        <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">
                            Get students near your location & grow your teaching career.
                        </p>
                        <button onClick={() => router.push("/signup/teacher")}
                            className="px-12 py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-slate-900 font-black rounded-xl hover:shadow-2xl hover:shadow-amber-400/30 transition-all duration-300 text-lg hover:-translate-y-1">
                            Register as Tutor →
                        </button>
                    </div>
                </section>

                {/* ════════════ POST REQUIREMENT CTA ════════════ */}
                <section className="relative bg-gradient-to-br from-slate-50 via-white to-amber-50/30 py-20 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-amber-100 rounded-full blur-[120px] opacity-30 pointer-events-none -translate-y-1/3 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-amber-100 rounded-full blur-[100px] opacity-30 pointer-events-none translate-y-1/4 -translate-x-1/4" />

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
                                    <select value={reqSubject} onChange={e => setReqSubject(e.target.value)} className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none bg-white hover:border-slate-300 transition-colors appearance-none text-slate-700 font-medium">
                                        <option value="">Select Subject</option>
                                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">🎓 Class / Age Group</label>
                                    <select value={reqClass} onChange={e => setReqClass(e.target.value)} className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none bg-white hover:border-slate-300 transition-colors appearance-none text-slate-700 font-medium">
                                        <option value="">Select Class / Age Group</option>
                                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">🏠 Mode</label>
                                    <select value={reqMode} onChange={e => setReqMode(e.target.value)} className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none bg-white hover:border-slate-300 transition-colors appearance-none text-slate-700 font-medium">
                                        <option value="">Home Tutor / Online Tutor</option>
                                        {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-5">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">💬 Additional Details (Optional)</label>
                                <textarea value={reqMessage} onChange={e => setReqMessage(e.target.value)} rows={3} className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none bg-white hover:border-slate-300 transition-colors resize-none text-slate-700 font-medium" placeholder="Any specific requirements — timing, budget, learning goals..." />
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


                {/* ════════════ WHY AACHARYA TUTORS ════════════ */}
                <section className="bg-gradient-to-b from-white to-slate-50 py-24 relative overflow-hidden">
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

                {/* ════════════ FAQ ════════════ */}
                <section className="max-w-3xl mx-auto px-4 py-20">
                    <div className="text-center mb-14">
                        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 text-sm font-bold mb-4 border border-amber-100/50">
                            ❓ FAQs
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((f, i) => (
                            <div key={i} className={`rounded-2xl border overflow-hidden transition-all duration-400 ${faqOpen === i ? "border-amber-200 bg-gradient-to-r from-amber-50/50 to-orange-50/50 shadow-md shadow-amber-100/50" : "border-slate-100 bg-white hover:border-slate-200"}`}>
                                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                                    className="w-full p-5 text-left flex items-center gap-4 transition-colors">
                                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300 ${faqOpen === i ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25" : "bg-slate-50 text-slate-400"}`}>{i + 1}</span>
                                    <span className="flex-1 font-semibold text-slate-900 text-[15px]">{f.q}</span>
                                    <span className={`text-slate-400 transition-transform duration-400 text-sm ${faqOpen === i ? "rotate-180" : ""}`}>▾</span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-400 ${faqOpen === i ? "max-h-40 pb-5 px-5 pl-[4.5rem]" : "max-h-0"}`}>
                                    <p className="text-slate-600 text-sm leading-relaxed">{f.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </>
    );
}
