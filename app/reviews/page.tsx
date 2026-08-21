"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Quote, Sparkles, UserCheck, ShieldCheck, Heart, Award } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Review {
    id: number;
    pageKey: string;
    name: string;
    role: string;
    content: string;
    rating: number;
}

const CARD_STYLES = [
    { bg: "bg-gradient-to-br from-teal-900 to-[#ffb800]", text: "text-white", badge: "bg-white/15 text-amber-300 border-white/20", quote: "text-amber-200/50", subtext: "text-amber-100", border: "border-teal-700/50 shadow-xl" },
    { bg: "bg-white", text: "text-slate-900", badge: "bg-amber-50 text-[#ffb800] border-amber-200/80", quote: "text-amber-200", subtext: "text-slate-500", border: "border-amber-200/80 shadow-md ring-1 ring-teal-500/10" },
    { bg: "bg-gradient-to-br from-amber-500 to-amber-600", text: "text-slate-950", badge: "bg-slate-950/15 text-slate-950 border-slate-950/20 font-black", quote: "text-amber-900/40", subtext: "text-slate-900", border: "border-amber-400 shadow-xl" },
];

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/review", { cache: "no-store" })
            .then((res) => res.json())
            .then((data) => {
                setReviews(Array.isArray(data) ? data : []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
            

            <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 w-full space-y-12 flex-1">
                {/* Hero Banner */}
                <div className="bg-[#ffb800] p-8 sm:p-14 rounded-3xl text-white shadow-2xl relative overflow-hidden text-center sm:text-left">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 space-y-4 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-amber-300 text-xs font-black rounded-full border border-white/15 shadow-sm">
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>Parent & Student Testimonials</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">What Parents & Students Say About Aacharya</h1>
                        <p className="text-xs sm:text-base text-amber-100 font-medium leading-relaxed">
                            Verified reviews and testimonials from families in Bhavanipuram & Vijayawada taking home tuitions and academy coaching.
                        </p>
                    </div>
                </div>

                {/* Reviews Feed */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-56 bg-slate-200/60 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3 shadow-sm">
                        <MessageSquare className="w-14 h-14 text-slate-300 mx-auto" />
                        <h3 className="text-xl font-extrabold text-slate-900">No Reviews Published Yet</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">Check back soon as parents share their learning experiences with Aacharya Academy.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {reviews.map((rev, index) => {
                            const style = CARD_STYLES[index % CARD_STYLES.length];
                            const isDark = style.bg.includes("teal-900");
                            const isAmber = style.bg.includes("amber-500");

                            return (
                                <div
                                    key={rev.id}
                                    className={`${style.bg} ${style.border} rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden`}
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex text-amber-400 gap-1 bg-black/10 backdrop-blur-md px-3 py-1 rounded-full">
                                                {Array.from({ length: rev.rating || 5 }).map((_, idx) => (
                                                    <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                                                ))}
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${style.badge}`}>
                                                Instructor: {rev.pageKey || "Tuition"}
                                            </span>
                                        </div>

                                        <div className="relative pt-2">
                                            <Quote className={`w-8 h-8 ${style.quote} absolute -top-3 -left-2 rotate-180 pointer-events-none`} />
                                            <p className={`text-xs sm:text-sm font-semibold leading-relaxed pl-5 relative z-10 ${isDark ? "text-amber-50" : isAmber ? "text-slate-950 font-bold" : "text-slate-800"}`}>
                                                "{rev.content}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`flex items-center gap-3 border-t pt-4 ${isDark ? "border-white/10" : isAmber ? "border-slate-950/15" : "border-slate-100"}`}>
                                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-md ${isDark ? "bg-white/15 text-white" : isAmber ? "bg-slate-950 text-amber-400" : "bg-[#ffb800] text-white"}`}>
                                            {rev.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className={`text-xs sm:text-sm font-black flex items-center gap-1.5 ${isDark ? "text-white" : isAmber ? "text-slate-950" : "text-slate-900"}`}>
                                                <span>{rev.name}</span>
                                                <ShieldCheck className={`w-4 h-4 inline ${isDark ? "text-amber-300" : isAmber ? "text-slate-950" : "text-emerald-600"}`} />
                                            </h4>
                                            <p className={`text-[11px] font-bold ${style.subtext}`}>{rev.role || "Verified Parent"}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
