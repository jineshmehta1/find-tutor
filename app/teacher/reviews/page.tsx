"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Star, MessageSquare, Clock, Loader2,
    CheckCircle2, RefreshCw, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    studentName: string;
}

export default function TeacherReviewsPage() {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ avgRating: 5.0, count: 0 });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            // Find current teacher id first
            const tRes = await fetch("/api/teachers");
            if (tRes.ok) {
                const tutors = await tRes.json();
                const matched = tutors.find((t: any) => t.email === session?.user?.email);
                if (matched?.id) {
                    const rRes = await fetch(`/api/review?pageKey=${matched.id}`);
                    if (rRes.ok) {
                        const data = await rRes.json();
                        if (Array.isArray(data)) {
                            const formatted = data.map((r: any) => ({
                                id: r.id,
                                rating: r.rating,
                                comment: r.comment,
                                createdAt: r.createdAt,
                                studentName: r.studentName || "Anonymous Student"
                            }));
                            setReviews(formatted);

                            const sum = formatted.reduce((acc, r) => acc + r.rating, 0);
                            const avg = formatted.length ? sum / formatted.length : 5.0;
                            setStats({ avgRating: parseFloat(avg.toFixed(1)), count: formatted.length });
                        }
                    }
                }
            }
        } catch {
            toast.error("Failed to load reviews logs");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-12 font-sans p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)]">
            {/* Header */}
            <div className="bg-[#ffb800] p-6 sm:p-8 rounded-3xl text-slate-950 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-black rounded-full border border-slate-950/10">
                            <Star className="w-3.5 h-3.5" />
                            <span>Tutor Ratings</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Student Feedback</h1>
                        <p className="text-xs sm:text-sm text-slate-800 font-medium max-w-xl">
                            Read reviews, see rating summaries, and monitor your educator score.
                        </p>
                    </div>
                    <button onClick={fetchReviews} disabled={loading}
                        className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all disabled:opacity-50">
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Summary cards */}
            <div className="grid grid-cols-2 gap-4 max-w-lg">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                        <Star className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <div className="text-xl font-black text-slate-900">{stats.avgRating} / 5</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Rating</div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#ffb800] flex items-center justify-center shrink-0">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xl font-black text-slate-900">{stats.count} reviews</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Reviews</div>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3">
                    <Loader2 className="w-8 h-8 text-[#ffb800] animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Loading feedback...</p>
                </div>
            ) : reviews.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center space-y-4 shadow-sm">
                    <div className="text-5xl">⭐</div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-800">No student reviews yet</h3>
                        <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">Tutor ratings will appear here as students leave feedback on your public profile card.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h4 className="text-xs font-black text-slate-900">{review.studentName}</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex text-slate-950">
                                    {"★".repeat(review.rating)}
                                    {"☆".repeat(5 - review.rating)}
                                </div>
                            </div>
                            <p className="text-xs text-slate-650 font-medium leading-relaxed italic">
                                &quot;{review.comment}&quot;
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
