"use client";

import { useState, useEffect } from "react";
import { 
    BarChart3, Users, Star, MessageSquare, TrendingUp, Loader2
} from "lucide-react";
import { 
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, BarChart as RechartBar, Bar, Cell
} from "recharts";
import { toast } from "sonner";

interface EngagementTutor {
    name: string;
    contacts: number;
    reviewCount: number;
    rating: number | null;
}

interface SignupTrend {
    month: string;
    tutors: number;
}

interface RatingDist {
    stars: string;
    count: number;
    color: string;
}

export default function TutorAnalytics() {
    const [engagementData, setEngagementData] = useState<EngagementTutor[]>([]);
    const [signupsTrend, setSignupsTrend] = useState<SignupTrend[]>([]);
    const [ratingDistribution, setRatingDistribution] = useState<RatingDist[]>([]);
    const [totalTutors, setTotalTutors] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/tutor-analytics");
            if (!res.ok) throw new Error("Failed to fetch analytics");
            const data = await res.json();
            setEngagementData(data.engagementData || []);
            setSignupsTrend(data.signupsTrend || []);
            setRatingDistribution(data.ratingDistribution || []);
            setTotalTutors(data.totalTutors || 0);
            setTotalReviews(data.totalReviews || 0);
        } catch (e) {
            toast.error("Failed to load tutor engagement metrics");
        } finally {
            setLoading(false);
        }
    };

    // Compute average rating from distribution
    const avgRating = (() => {
        const total = ratingDistribution.reduce((sum, r) => sum + r.count, 0);
        if (total === 0) return null;
        const weighted = ratingDistribution.reduce((sum, r) => {
            const stars = parseInt(r.stars);
            return sum + stars * r.count;
        }, 0);
        return (weighted / total).toFixed(1);
    })();

    const totalLeadContacts = engagementData.reduce((sum, t) => sum + t.contacts, 0);

    return (
        <div className="space-y-8 font-sans pb-12">
            {/* Header Banner */}
            <div className="bg-[#ffb800] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                        <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
                        <span>Tutor Engagement Stats</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Tutor Engagement Analytics</h1>
                    <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-xl">
                        Monitor tutor signups growth curve, average rating distributions, and lead contact counts — all from live database.
                    </p>
                </div>
            </div>

            {/* Metrics cards — real data only */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                    <Loader2 className="w-8 h-8 text-[#ffb800] animate-spin" />
                    <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Loading analytics data...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Tutors</div>
                                <div className="text-2xl font-black text-slate-900 mt-1">{totalTutors}</div>
                                <p className="text-[9px] font-bold text-emerald-600 mt-1">Registered in system</p>
                            </div>
                            <div className="w-10 h-10 bg-amber-50 text-[#ffb800] rounded-xl flex items-center justify-center shrink-0">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Rating</div>
                                <div className="text-2xl font-black text-slate-900 mt-1">
                                    {avgRating ? `${avgRating} / 5` : "No reviews"}
                                </div>
                                <p className="text-[9px] font-bold text-amber-600 mt-1 flex items-center gap-0.5">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>{totalReviews} total reviews</span>
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Lead Contacts</div>
                                <div className="text-2xl font-black text-slate-900 mt-1">{totalLeadContacts}</div>
                                <p className="text-[9px] font-bold text-[#ffb800] mt-1">Across all tutors</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Months Tracked</div>
                                <div className="text-2xl font-black text-[#ffb800] mt-1">{signupsTrend.length}</div>
                                <p className="text-[9px] font-bold text-slate-400 mt-1">This calendar year</p>
                            </div>
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Tutor Signups curve */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                            <div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Instructor Registrations Curve</h3>
                                <p className="text-xs text-slate-500 font-medium">Cumulative tutor registrations by month (current year)</p>
                            </div>
                            {signupsTrend.length === 0 ? (
                                <div className="h-64 flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">No signup data yet</div>
                            ) : (
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={signupsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="tutorsGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ffb800" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#ffb800" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="tutors" stroke="#ffb800" strokeWidth={2.5} fillOpacity={1} fill="url(#tutorsGrad)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>

                        {/* Rating Distribution */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                            <div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Tutor Review Ratings Breakdown</h3>
                                <p className="text-xs text-slate-500 font-medium">Review rating distribution across all tutors</p>
                            </div>
                            {ratingDistribution.every(r => r.count === 0) ? (
                                <div className="h-64 flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">No reviews yet</div>
                            ) : (
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartBar data={ratingDistribution} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                            <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                                            <YAxis dataKey="stars" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} />
                                            <Tooltip />
                                            <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={16}>
                                                {ratingDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </RechartBar>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top performing tutors table list */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                        <div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Instructor Lead Engagement Index</h3>
                            <p className="text-xs text-slate-500 font-medium">Tutors ranked by lead contacts received</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        <th className="p-4">#</th>
                                        <th className="p-4">Tutor Name</th>
                                        <th className="p-4">Lead Enquiries</th>
                                        <th className="p-4">Reviews</th>
                                        <th className="p-4 text-right">Avg Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                                    {engagementData.map((t, index) => (
                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 text-slate-400 font-bold">{index + 1}</td>
                                            <td className="p-4 text-slate-900 font-extrabold">{t.name || "—"}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    <span>{t.contacts} inquiries</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-500">{t.reviewCount} reviews</td>
                                            <td className="p-4 text-right">
                                                {t.rating !== null ? (
                                                    <span className="inline-flex items-center gap-1 text-amber-500 font-black">
                                                        <Star className="w-3.5 h-3.5 fill-current" />
                                                        {t.rating}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 font-medium">No reviews</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {engagementData.length === 0 && (
                                <div className="text-center py-12 text-slate-400 font-bold uppercase text-[10px] tracking-widest">No instructor data available</div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
