"use client";

import { useState, useEffect } from "react";
import {
    Search, MapPin, BookOpen, Filter, Star, Phone,
    User, GraduationCap, Briefcase, Award, X, Loader2,
    Sparkles, ShieldCheck, CheckCircle2, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { QuickDemoModal } from "@/components/QuickDemoModal";

interface Teacher {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    profilePhoto: string | null;
    address: string;
    education: string;
    experience: string;
    subjects: string[];
    teachingMode?: string;
}

const SUBJECTS = [
    "All Subjects", "Mathematics", "Physics", "Chemistry", "Biology", "English",
    "Hindi", "History", "Geography", "Computer Science", "Economics", "Abacus", "Chess", "Coding"
];

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("All Subjects");
    const [areaFilter, setAreaFilter] = useState("");
    const [isDemoOpen, setIsDemoOpen] = useState(false);
    const [demoTutorName, setDemoTutorName] = useState("");
    const [demoSubject, setDemoSubject] = useState("");

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/teachers");
            if (!res.ok) throw new Error();
            const data = await res.json();
            if (Array.isArray(data)) {
                setTeachers(data);
            }
        } catch {
            toast.error("Failed to load tutors directory");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDemo = (tutorName: string, subject: string) => {
        setDemoTutorName(tutorName);
        setDemoSubject(subject);
        setIsDemoOpen(true);
    };

    const filteredTeachers = teachers.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.education.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = selectedSubject === "All Subjects" ||
            t.subjects.some(s => s.toLowerCase().includes(selectedSubject.toLowerCase()));
        const matchesArea = !areaFilter || t.address.toLowerCase().includes(areaFilter.toLowerCase());
        return matchesSearch && matchesSubject && matchesArea;
    });

    return (
        <div className="space-y-8 pb-12 font-sans">
            {/* Header banner */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Educator Directory</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Verified Mentors & Tutors</h1>
                    <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                        Directly connect with top-rated tutors near Vijayawada. Book a free 30-minute demo session.
                    </p>
                </div>
            </div>

            {/* Filters panel */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search name */}
                    <div className="relative flex items-center">
                        <Search className="absolute left-4 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tutor name or education..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50"
                        />
                    </div>
                    {/* Area filter */}
                    <div className="relative flex items-center">
                        <MapPin className="absolute left-4 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter by locality (e.g. Benz Circle)..."
                            value={areaFilter}
                            onChange={(e) => setAreaFilter(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50"
                        />
                    </div>
                    {/* Select subject */}
                    <div className="relative flex items-center">
                        <BookOpen className="absolute left-4 w-4 h-4 text-slate-400" />
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 appearance-none cursor-pointer"
                        >
                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Tutors Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3">
                    <Loader2 className="w-8 h-8 text-[#1f5961] animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Loading tutors...</p>
                </div>
            ) : filteredTeachers.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center space-y-4 shadow-sm">
                    <div className="text-5xl">🔍</div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-800">No matching tutors found</h3>
                        <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">Try clearing search filters or broadening your area check.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeachers.map(tutor => (
                        <div key={tutor.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative">
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                        {tutor.profilePhoto ? (
                                            <img src={tutor.profilePhoto} alt={tutor.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-[#1f5961]/10 flex items-center justify-center text-[#1f5961] font-black text-lg">
                                                {tutor.name[0]}
                                            </div>
                                        )}
                                        <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            <span className="text-xs font-black text-slate-800">4.9</span>
                                        </div>
                                        <h3 className="font-black text-sm text-slate-900 truncate leading-snug group-hover:text-[#1f5961] transition-colors">{tutor.name}</h3>
                                        <p className="text-[11px] font-bold text-slate-400 truncate mt-0.5">{tutor.education}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-[11px] font-bold text-slate-500">
                                    <div className="flex items-center gap-2 truncate">
                                        <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                        <span>{tutor.experience || "Verified Educator"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 truncate">
                                        <MapPin className="w-3.5 h-3.5 text-[#1f5961] shrink-0" />
                                        <span className="truncate">{tutor.address || "Vijayawada"}</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Subjects Taught</div>
                                    <div className="flex flex-wrap gap-1">
                                        {tutor.subjects.map(sub => (
                                            <span key={sub} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold">
                                                {sub}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                                <button onClick={() => handleOpenDemo(tutor.name, tutor.subjects[0])}
                                    className="w-full py-2.5 bg-[#1f5961] hover:bg-[#163e44] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Free Demo
                                </button>
                                <a href={`tel:${tutor.phone}`}
                                    className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors">
                                    <Phone className="w-3.5 h-3.5 text-teal-600" /> Call Tutor
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <QuickDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} defaultSubject={demoSubject} defaultTutor={demoTutorName} />
        </div>
    );
}
