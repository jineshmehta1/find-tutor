"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { toast } from "sonner";

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
            <main className="min-h-screen bg-slate-50">

                {/* ════════════ HERO ════════════ */}
                <section className="relative w-full bg-[#FFFBF0] overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20">
                    {/* Background dot grid */}
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                    {/* Soft warm blobs */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-200 rounded-full blur-[120px] opacity-40 pointer-events-none -translate-y-1/3 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100 rounded-full blur-[100px] opacity-50 pointer-events-none translate-y-1/4 -translate-x-1/4" />

                    {/* Floating decorative icons */}
                    <div className="absolute top-24 left-10 md:left-20 opacity-20 text-amber-500" style={{ animation: 'floatBounce 6s ease-in-out infinite' }}>
                        <span className="text-5xl">🎓</span>
                    </div>
                    <div className="absolute top-1/3 right-10 md:right-32 opacity-10 text-slate-400 rotate-12 hidden md:block">
                        <span className="text-7xl">📘</span>
                    </div>
                    <div className="absolute bottom-10 right-1/4 text-orange-400 opacity-20 hidden md:block">
                        <span className="text-5xl">🏠</span>
                    </div>

                    {/* Main content */}
                    <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
                        {/* Title */}
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight max-w-5xl leading-[1.1]">
                            Find Verified <span className="text-amber-600">Tutors</span> Near You – Home, Online &{' '}
                            <span className="relative inline-block text-orange-500">
                                At Centre
                                <svg className="absolute w-full h-3 -bottom-2 left-0 text-yellow-300 -z-10 opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
                                </svg>
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl md:text-2xl text-slate-800 font-bold mb-4 max-w-3xl">
                            Personalised tutors for academics and skill development.
                        </p>
                        <p className="text-md md:text-lg text-slate-600 max-w-4xl mb-10 leading-relaxed font-medium">
                            Search from <span className="text-slate-900 font-semibold">verified and experienced</span> tutors in your area – whether you need a Home Tutor, Online Tutor or At-Centre coaching for Maths, Science, Chess, Robotics, Abacus and more.
                        </p>

                        {/* Feature chips */}
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {[
                                { label: "Search by Location", icon: "�" },
                                { label: "Pick Subject / Skill", icon: "📘" },
                                { label: "Choose Class / Age", icon: "�" },
                                { label: "Home / Online / Centre", icon: "🏠" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-700 font-semibold text-sm">
                                    <span>{item.icon}</span>
                                    {item.label}
                                </div>
                            ))}
                        </div>

                        {/* Breadcrumb */}
                        <nav className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-amber-100 shadow-lg shadow-amber-200/20">
                            <a href="/" className="text-slate-500 hover:text-amber-600 transition-colors flex items-center gap-1.5 text-sm font-semibold">
                                🏠 <span>Home</span>
                            </a>
                            <span className="text-slate-300 font-bold">›</span>
                            <span className="text-slate-900 font-bold text-sm">Find Tutor Nearby</span>
                        </nav>
                    </div>

                    {/* Animations */}
                    <style jsx>{`
                        @keyframes floatBounce {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-20px); }
                        }
                        @keyframes fadeInUp {
                            from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                </section>

                {/* ════════════ SEARCH FILTERS ════════════ */}
                <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">📍 Location / Pincode</label>
                                <input value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none bg-slate-50/50" placeholder="Area, City or Pincode" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">📘 Subject / Skill</label>
                                <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none bg-slate-50/50 appearance-none">
                                    <option value="">All Subjects</option>
                                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">🎓 Class / Age Group</label>
                                <select value={classLevel} onChange={e => setClassLevel(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none bg-slate-50/50 appearance-none">
                                    <option value="">All Classes</option>
                                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">🏠 Mode</label>
                                <select value={mode} onChange={e => setMode(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none bg-slate-50/50 appearance-none">
                                    <option value="">All Modes</option>
                                    {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>
                        <button onClick={handleSearch} className="w-full md:w-auto px-10 py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-bold rounded-xl hover:from-yellow-300 hover:to-amber-400 transition-all shadow-lg shadow-yellow-400/30 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                            🔍 Find Tutor
                        </button>
                    </div>
                </section>

                {/* ════════════ TOP TUTOR CATEGORIES ════════════ */}
                <section className="max-w-6xl mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-bold mb-4">
                            ✨ Browse by Category
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900">Top Tutor Categories</h2>
                        <p className="text-slate-500 mt-3 max-w-xl mx-auto">Find the perfect tutor by subject, skill, or preferred mode of learning</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: "📘", title: "Academic Tutors", desc: "Core subjects for all classes", items: ACADEMIC_SUBJECTS, type: "subject" as const },
                            { icon: "♟️", title: "Skill Tutors", desc: "Beyond academics — build real skills", items: SKILL_SUBJECTS, type: "subject" as const },
                            { icon: "🏠", title: "Mode of Learning", desc: "Choose how you want to learn", items: MODES, type: "mode" as const },
                        ].map((cat, i) => (
                            <div key={i} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/60">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">{cat.icon}</div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">{cat.title}</h3>
                                            <p className="text-slate-500 text-xs">{cat.desc}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex flex-wrap gap-2">
                                        {cat.items.map(item => (
                                            <button key={item} onClick={() => { cat.type === "mode" ? setMode(item) : setSubject(item); handleSearch(); }}
                                                className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium hover:bg-amber-50 hover:text-amber-700 border border-slate-200 hover:border-amber-200 transition-all duration-200">
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
                <section ref={listingRef} className="max-w-6xl mx-auto px-4 pb-16">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">
                        {searched ? "Search Results" : "Available Tutors"}
                    </h2>
                    <p className="text-slate-500 mb-8">
                        Showing <span className="font-semibold text-slate-900">{filtered.length}</span> verified tutors
                    </p>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Tutors Found</h3>
                            <p className="text-slate-500">Try adjusting your filters or search in a different area</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map(t => (
                                <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden border-2 border-white/30">
                                                {t.profilePhoto ? (
                                                    <img src={t.profilePhoto} alt={t.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl font-bold text-white">{t.name?.[0]}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-white truncate">{t.name}</h3>
                                                <p className="text-amber-100 text-sm flex items-center gap-1 truncate">📍 {t.address?.split(",")[0]}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <div className="flex flex-wrap gap-1.5">
                                            {t.subjects?.slice(0, 3).map(s => (
                                                <span key={s} className="px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-semibold">{s}</span>
                                            ))}
                                            {t.subjects?.length > 3 && <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs">+{t.subjects.length - 3}</span>}
                                        </div>
                                        <div className="text-sm space-y-1.5 text-slate-600">
                                            <p>🎓 <span className="font-medium">Experience:</span> {t.experience || "N/A"}</p>
                                            <p>🏠 <span className="font-medium">Mode:</span> {t.teachingMode || "N/A"}</p>
                                            <p>⭐ <span className="font-medium">Rating:</span> ★★★★☆</p>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button onClick={() => { if (!requireLogin("call tutor")) window.open(`tel:${t.phone}`); }}
                                                className="flex-1 px-3 py-2.5 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-colors">
                                                📞 Call
                                            </button>
                                            <button onClick={() => { if (!requireLogin("WhatsApp tutor")) window.open(`https://wa.me/91${t.phone?.replace(/\D/g, "").slice(-10)}`); }}
                                                className="flex-1 px-3 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors">
                                                💬 WhatsApp
                                            </button>
                                            <button onClick={() => { if (!requireLogin("request demo")) router.push("/bookdemo"); }}
                                                className="flex-1 px-3 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors">
                                                📝 Demo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ════════════ POST REQUIREMENT CTA ════════════ */}
                <section className="relative bg-gradient-to-br from-amber-50 via-white to-orange-50 py-16 overflow-hidden">
                    {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-yellow-200 rounded-full blur-[100px] opacity-30 pointer-events-none -translate-y-1/3 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-orange-100 rounded-full blur-[80px] opacity-40 pointer-events-none translate-y-1/4 -translate-x-1/4" />

                    <div className="max-w-4xl mx-auto px-4 relative z-10">
                        <div className="text-center mb-10">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-bold mb-4">
                                📬 Post Your Requirement
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Could not find tutor?</h2>
                            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                                Post your requirement here and verified tutors will contact you directly.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">📍 Location / Area / Pincode</label>
                                    <input value={reqLocation} onChange={e => setReqLocation(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-slate-50/50" placeholder="Enter your area, city or pincode" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">📘 Subject / Skill</label>
                                    <select value={reqSubject} onChange={e => setReqSubject(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-slate-50/50 appearance-none">
                                        <option value="">Select Subject</option>
                                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">🎓 Class / Age Group</label>
                                    <select value={reqClass} onChange={e => setReqClass(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-slate-50/50 appearance-none">
                                        <option value="">Select Class / Age Group</option>
                                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">🏠 Mode</label>
                                    <select value={reqMode} onChange={e => setReqMode(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-slate-50/50 appearance-none">
                                        <option value="">Home Tutor / Online Tutor</option>
                                        {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">💬 Additional Details (Optional)</label>
                                <textarea value={reqMessage} onChange={e => setReqMessage(e.target.value)} rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-slate-50/50 resize-none" placeholder="Any specific requirements — timing, budget, learning goals..." />
                            </div>
                            <button onClick={handlePostRequirement} disabled={submittingReq}
                                className="w-full md:w-auto px-10 py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-bold rounded-xl hover:from-yellow-300 hover:to-amber-400 transition-all shadow-lg shadow-yellow-400/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50">
                                {submittingReq ? (
                                    <><span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> Posting...</>
                                ) : (
                                    <>📝 Post Requirement</>
                                )}
                            </button>
                        </div>
                    </div>
                </section>

                {/* ════════════ BECOME A TUTOR CTA ════════════ */}
                <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16">
                    <div className="max-w-6xl mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Are You a Tutor? Join <span className="text-yellow-400">Aacharya</span>
                        </h2>
                        <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                            Get students near your location & grow your teaching career.
                        </p>
                        <button onClick={() => router.push("/signup/teacher")}
                            className="px-10 py-4 bg-yellow-400 text-slate-900 font-black rounded-xl hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/30 text-lg hover:-translate-y-0.5">
                            Register as Tutor
                        </button>
                    </div>
                </section>


                {/* ════════════ WHY AACHARYA TUTORS ════════════ */}
                <section className="bg-[#FFFBF0] py-20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                    <div className="max-w-6xl mx-auto px-4 relative z-10">
                        <div className="text-center mb-14">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-bold mb-4">
                                🏆 Why Choose Us
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Why Aacharya Tutors?</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                            {[
                                { icon: "✅", text: "Verified & experienced tutors", bg: "bg-green-100" },
                                { icon: "🎓", text: "Demo class available", bg: "bg-blue-100" },
                                { icon: "🛡️", text: "Safe & child-friendly approach", bg: "bg-rose-100" },
                                { icon: "📝", text: "Personalised learning", bg: "bg-amber-100" },
                                { icon: "⭐", text: "Trusted by parents", bg: "bg-yellow-100" },
                            ].map((item, i) => (
                                <div key={i} className="text-center p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                                    <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center text-2xl mx-auto mb-4`}>{item.icon}</div>
                                    <p className="text-sm font-semibold text-slate-700 leading-snug">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════ FAQ ════════════ */}
                <section className="max-w-3xl mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-bold mb-4">
                            ❓ FAQs
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((f, i) => (
                            <div key={i} className={`rounded-2xl border overflow-hidden transition-all duration-300 ${faqOpen === i ? "border-amber-200 bg-amber-50/40 shadow-sm" : "border-slate-200 bg-white"}`}>
                                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                                    className="w-full p-5 text-left flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${faqOpen === i ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"}`}>{i + 1}</span>
                                    <span className="flex-1 font-semibold text-slate-900 text-[15px]">{f.q}</span>
                                    <span className={`text-slate-400 transition-transform duration-300 ${faqOpen === i ? "rotate-180" : ""}`}>▾</span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${faqOpen === i ? "max-h-40 pb-5 px-5 pl-[4.25rem]" : "max-h-0"}`}>
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
