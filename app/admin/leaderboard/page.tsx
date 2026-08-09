"use client";

import { useState, useEffect } from "react";
import {
    Trophy, Star, MessageSquare, TrendingUp,
    Medal, Crown, Loader2, GraduationCap, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface LeaderboardTutor {
    rank: number;
    id: string;
    name: string;
    profilePhoto: string | null;
    subjects: string[];
    leadCount: number;
    avgRating: number | null;
    reviewCount: number;
    subscriptionStatus: string;
    score: number;
}

const MEDAL_COLORS = [
    "from-amber-400 to-yellow-500",   // 1st
    "from-slate-300 to-slate-400",    // 2nd
    "from-amber-600 to-orange-700",   // 3rd
];
const MEDAL_ICONS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
    const [tutors, setTutors] = useState<LeaderboardTutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<"score" | "leads" | "rating" | "reviews">("score");

    useEffect(() => { fetchLeaderboard(); }, []);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/leaderboard");
            if (!res.ok) throw new Error();
            const data = await res.json();
            setTutors(data);
        } catch {
            toast.error("Failed to load leaderboard data");
        } finally {
            setLoading(false);
        }
    };

    const sorted = [...tutors].sort((a, b) => {
        if (sortBy === "leads")   return b.leadCount - a.leadCount;
        if (sortBy === "rating")  return (b.avgRating ?? 0) - (a.avgRating ?? 0);
        if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
        return b.score - a.score;
    }).map((t, i) => ({ ...t, rank: i + 1 }));

    return (
        <div className="space-y-8 font-sans pb-12">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#1f5961] to-[#0f3237] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30">
                            <Trophy className="w-3.5 h-3.5" />
                            <span>Platform Rankings</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Tutor Leaderboard</h1>
                        <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                            Top tutors ranked by composite score — based on leads, ratings, and reviews from real students.
                        </p>
                    </div>
                    <button onClick={fetchLeaderboard} disabled={loading}
                        className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all disabled:opacity-50">
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Sort Controls */}
            <div className="bg-white border border-slate-200/80 rounded-2xl px-5 py-4 flex flex-wrap items-center gap-3 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Rank by:</span>
                {([
                    { key: "score",   label: "Overall Score" },
                    { key: "leads",   label: "Most Leads" },
                    { key: "rating",  label: "Highest Rating" },
                    { key: "reviews", label: "Most Reviews" },
                ] as const).map(opt => (
                    <button key={opt.key} onClick={() => setSortBy(opt.key)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            sortBy === opt.key
                                ? "bg-[#1f5961] text-white border-transparent shadow-md"
                                : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                        }`}>
                        {opt.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                    <Loader2 className="w-8 h-8 text-[#1f5961] animate-spin" />
                    <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Loading leaderboard...</p>
                </div>
            ) : (
                <>
                    {/* Top 3 Podium */}
                    {sorted.length >= 3 && (
                        <div className="grid grid-cols-3 gap-4">
                            {[sorted[1], sorted[0], sorted[2]].map((t, podiumIdx) => {
                                const realRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
                                const medalIdx = realRank - 1;
                                const heights = ["h-40", "h-52", "h-36"];
                                const podiumHeight = heights[podiumIdx];
                                return (
                                    <div key={t.id} className="flex flex-col items-center gap-3 text-center">
                                        <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 ${medalIdx === 0 ? "border-amber-400" : medalIdx === 1 ? "border-slate-300" : "border-amber-600"} overflow-hidden shadow-xl`}>
                                            {t.profilePhoto ? (
                                                <img src={t.profilePhoto} alt={t.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-[#1f5961]/10 flex items-center justify-center text-2xl font-black text-[#1f5961]">
                                                    {t.name?.[0]}
                                                </div>
                                            )}
                                            <div className="absolute -bottom-1 -right-1 text-lg">{MEDAL_ICONS[medalIdx]}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-black text-slate-900 truncate max-w-[100px]">{t.name}</div>
                                            <div className="text-[10px] text-slate-400 font-bold">{t.score} pts</div>
                                        </div>
                                        <div className={`w-full bg-gradient-to-t ${MEDAL_COLORS[medalIdx]} rounded-t-2xl ${podiumHeight} flex items-start justify-center pt-3`}>
                                            <span className="text-white font-black text-xl">#{realRank}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Full Rankings Table */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        <th className="p-4 sm:p-5">Rank</th>
                                        <th className="p-4 sm:p-5">Tutor</th>
                                        <th className="p-4 sm:p-5">Subjects</th>
                                        <th className="p-4 sm:p-5">Leads</th>
                                        <th className="p-4 sm:p-5">Avg Rating</th>
                                        <th className="p-4 sm:p-5">Reviews</th>
                                        <th className="p-4 sm:p-5">Subscription</th>
                                        <th className="p-4 sm:p-5 text-right">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                                    {sorted.map((t) => (
                                        <tr key={t.id} className={`hover:bg-slate-50/50 transition-colors ${t.rank <= 3 ? "bg-amber-50/30" : ""}`}>
                                            <td className="p-4 sm:p-5">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl font-black text-sm ${
                                                    t.rank === 1 ? "bg-amber-100 text-amber-700" :
                                                    t.rank === 2 ? "bg-slate-100 text-slate-600" :
                                                    t.rank === 3 ? "bg-orange-100 text-orange-700" :
                                                    "bg-slate-50 text-slate-500"
                                                }`}>
                                                    {t.rank <= 3 ? MEDAL_ICONS[t.rank - 1] : `#${t.rank}`}
                                                </span>
                                            </td>
                                            <td className="p-4 sm:p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#1f5961]/10 shrink-0">
                                                        {t.profilePhoto ? (
                                                            <img src={t.profilePhoto} alt={t.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-sm font-black text-[#1f5961]">{t.name?.[0]}</div>
                                                        )}
                                                    </div>
                                                    <div className="font-extrabold text-slate-900">{t.name}</div>
                                                </div>
                                            </td>
                                            <td className="p-4 sm:p-5">
                                                <div className="flex flex-wrap gap-1">
                                                    {t.subjects.slice(0, 2).map(s => (
                                                        <span key={s} className="text-[9px] px-2 py-0.5 bg-teal-50 text-[#1f5961] rounded-md font-bold border border-teal-100">{s}</span>
                                                    ))}
                                                    {t.subjects.length > 2 && <span className="text-[9px] text-slate-400 font-bold">+{t.subjects.length - 2}</span>}
                                                </div>
                                            </td>
                                            <td className="p-4 sm:p-5">{t.leadCount}</td>
                                            <td className="p-4 sm:p-5">
                                                {t.avgRating !== null ? (
                                                    <span className="flex items-center gap-1 text-amber-500 font-black">
                                                        <Star className="w-3.5 h-3.5 fill-current" /> {t.avgRating}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300">—</span>
                                                )}
                                            </td>
                                            <td className="p-4 sm:p-5">
                                                <span className="flex items-center gap-1 text-slate-600">
                                                    <MessageSquare className="w-3.5 h-3.5" /> {t.reviewCount}
                                                </span>
                                            </td>
                                            <td className="p-4 sm:p-5">
                                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-extrabold border ${
                                                    t.subscriptionStatus === "active"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : t.subscriptionStatus === "trial"
                                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                                        : "bg-slate-50 text-slate-500 border-slate-200"
                                                }`}>{t.subscriptionStatus}</span>
                                            </td>
                                            <td className="p-4 sm:p-5 text-right">
                                                <span className="font-black text-[#1f5961] text-sm">{t.score}</span>
                                                <span className="text-[10px] text-slate-400 font-medium ml-1">pts</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {sorted.length === 0 && (
                                <div className="text-center py-16 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                    No tutor data available yet
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
