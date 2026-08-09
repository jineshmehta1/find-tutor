"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Star, MessageSquare, Clock, Trash2, Edit3, Loader2,
    CheckCircle2, AlertCircle, RefreshCw, GraduationCap
} from "lucide-react";
import { toast } from "sonner";

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    pageKey: string; // teacherId
}

export default function MyReviewsPage() {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/reviews");
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setReviews(data);
                }
            }
        } catch {
            toast.error("Failed to load reviews list");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Review deleted successfully!");
                setReviews(prev => prev.filter(r => r.id !== id));
            } else {
                throw new Error();
            }
        } catch {
            toast.error("Failed to delete review");
        }
    };

    return (
        <div className="space-y-8 pb-12 font-sans">
            {/* Header banner */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                            <Star className="w-3.5 h-3.5 animate-pulse" />
                            <span>My Feedback</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">My Tutor Reviews</h1>
                        <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                            All reviews, ratings, and comments you have posted for your verified mentors.
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3">
                    <Loader2 className="w-8 h-8 text-[#1f5961] animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Loading reviews...</p>
                </div>
            ) : reviews.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center space-y-4 shadow-sm">
                    <div className="text-5xl">⭐</div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-800">No reviews written yet</h3>
                        <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">You can submit reviews directly on teacher profile pages after taking lessons.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="flex text-amber-400">
                                        {"★".repeat(review.rating)}
                                        {"☆".repeat(5 - review.rating)}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                                    &quot;{review.comment}&quot;
                                </p>
                            </div>

                            <div className="shrink-0 flex items-center">
                                <button onClick={() => handleDelete(review.id)}
                                    className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100 flex items-center justify-center">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
