"use client";

import React, { useState, useEffect } from "react";
import { Heart, MapPin, Star, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Teacher {
    id: string;
    user: {
        name: string;
        profilePhoto?: string;
        address: string;
    };
    education: string;
    experience: string;
    subjects: string; // JSON string
    hourlyRate?: number;
}

export default function StudentSavedPage() {
    const [tutors, setTutors] = useState<Teacher[]>([]);
    const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShortlistedTutors();
    }, []);

    const fetchShortlistedTutors = async () => {
        try {
            const saved = localStorage.getItem("shortlisted_tutors");
            let ids: string[] = [];
            if (saved) {
                try { ids = JSON.parse(saved); } catch {}
            }
            setShortlistedIds(ids);

            const res = await fetch("/api/teachers?approved=true");
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Filter matching shortlisted IDs
                    const filtered = data.filter((t: Teacher) => ids.includes(t.id));
                    setTutors(filtered);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = (id: string, name: string) => {
        const updatedIds = shortlistedIds.filter(x => x !== id);
        setShortlistedIds(updatedIds);
        localStorage.setItem("shortlisted_tutors", JSON.stringify(updatedIds));

        const updatedTutors = tutors.filter(t => t.id !== id);
        setTutors(updatedTutors);
        toast.success(`Removed ${name} from shortlisted tutors.`);
    };

    const formatSubjects = (subjectsStr: string) => {
        try {
            const arr = JSON.parse(subjectsStr);
            if (Array.isArray(arr)) return arr.join(", ");
        } catch {}
        return subjectsStr;
    };

    return (
        <div className="space-y-6 pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)]">
            <div>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Saved Tutors</h1>
                <p className="text-xs font-bold text-slate-400 font-sans">Manage your shortlisted tutors and coaches</p>
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#ffb800] border-t-transparent" />
                </div>
            ) : tutors.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/50 p-12 text-center text-slate-400 font-semibold text-xs space-y-4 max-w-lg mx-auto">
                    <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="font-extrabold text-slate-900 text-sm">No Saved Tutors</h3>
                    <p>You haven't shortlisted any tutor profiles yet. Browse tutors and click the heart icon to save them here.</p>
                    <Link href="/student/teachers" className="inline-block px-5 py-2.5 bg-[#0a1829] hover:bg-amber-500 hover:text-slate-950 text-white font-black text-xs uppercase rounded-xl transition-all shadow-md">
                        Find Tutors Now
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tutors.map((tutor) => (
                        <div key={tutor.id} className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative group">
                            
                            {/* Shortlist Red Heart Button */}
                            <button 
                                onClick={() => handleRemove(tutor.id, tutor.user.name)} 
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-50 border border-slate-100 hover:bg-white text-rose-500 transition-colors flex items-center justify-center cursor-pointer shadow-sm z-10 border-none"
                            >
                                <Heart className="w-4 h-4 fill-rose-500" />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shadow-md mb-4 border-2 border-slate-100">
                                    <img src={tutor.user.profilePhoto || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"} alt={tutor.user.name} className="w-full h-full object-cover" />
                                </div>
                                <h4 className="text-sm font-black text-slate-900">{tutor.user.name}</h4>
                                <p className="text-[10px] text-slate-400 font-black mt-0.5 leading-none uppercase">Verified Chess & Robotics Coach</p>

                                <div className="mt-4 space-y-2 text-xs font-bold text-slate-650 w-full text-left bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">
                                    <div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Subjects</span>
                                        <span className="text-slate-900 leading-snug block mt-0.5">{formatSubjects(tutor.subjects)}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/50">
                                        <div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Experience</span>
                                            <span className="text-slate-950 font-black block">{tutor.experience}</span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Location</span>
                                            <span className="text-slate-950 font-black block truncate">{tutor.user.address}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs font-black text-slate-900 mt-4 leading-none">
                                    Rate: ₹ {tutor.hourlyRate || "400"} / hour
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-2.5 mt-5 pt-3.5 border-t border-slate-100 w-full">
                                <Link href={`/tutor/${tutor.id}`} className="py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center shadow-sm">
                                    Profile
                                </Link>
                                <Link href={`/student/messages?tutor=${tutor.id}`} className="py-2 bg-[#0a1829] hover:bg-amber-500 hover:text-slate-950 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center border-none shadow-sm">
                                    Message
                                </Link>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
