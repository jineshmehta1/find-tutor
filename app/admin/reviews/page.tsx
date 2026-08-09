"use client";

import { useState, useEffect } from "react";
import { Trash2, Star, User, MessageSquare, Plus, Loader2, Sparkles, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Review {
  id: number;
  pageKey: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tutors, setTutors] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const initialForm = {
    pageKey: "",
    name: "",
    role: "Parent",
    content: "",
    rating: 5,
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [revRes, tutRes] = await Promise.all([
        fetch("/api/review", { cache: "no-store" }),
        fetch("/api/admin/users?role=TEACHER"),
      ]);

      if (revRes.ok) {
        const revData = await revRes.json();
        setReviews(Array.isArray(revData) ? revData : []);
      }

      if (tutRes.ok) {
        const tutData = await tutRes.json();
        setTutors(Array.isArray(tutData) ? tutData : []);
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pageKey) return toast.error("Please select a Tutor!");

    setLoading(true);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();
      toast.success("Tutor review published!");
      await loadData();
      setForm(initialForm);
    } catch {
      toast.error("Failed to publish review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/review/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Review deleted!");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Header Banner */}
      <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Tutor Ratings & Reviews</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Instructor Reviews Manager</h1>
          <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
            Select a verified tutor from the database, attach parent or student testimonials, and assign star ratings.
          </p>
        </div>
      </div>

      {/* Add Review Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-black text-slate-900">Publish Tutor Testimonial</h2>
          <p className="text-xs text-slate-500 font-medium">Assign parent rating to registered instructors</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Select Registered Tutor</label>
              <select
                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none bg-slate-50/50 cursor-pointer"
                value={form.pageKey}
                onChange={(e) => setForm({ ...form, pageKey: e.target.value })}
                required
              >
                <option value="">-- Choose Instructor --</option>
                {tutors.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name} ({t.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Author Name (Parent/Student)</label>
              <input
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Role / Relation</label>
              <input
                placeholder="e.g. Class 10 Parent"
                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Star Rating</label>
              <select
                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none bg-slate-50/50 cursor-pointer"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Review Content</label>
              <input
                placeholder="Write parent feedback about this instructor's teaching performance..."
                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-3.5 bg-[#1f5961] hover:bg-[#1a4a51] text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 stroke-[3]" />}
            <span>Publish Tutor Review</span>
          </button>
        </form>
      </div>

      {/* Published Reviews Feed */}
      <div className="space-y-4">
        <h2 className="text-base font-black text-slate-900">Published Tutor Reviews ({reviews.length})</h2>

        {fetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-slate-200/60 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-extrabold text-slate-900">No Tutor Reviews Published</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">Select a tutor from the dropdown above to add instructor feedback.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-50 text-[#1f5961] border border-teal-200/60 flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      <span>Instructor: {rev.pageKey}</span>
                    </span>
                    <div className="flex text-amber-400 text-xs">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium italic">"{rev.content}"</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <p className="text-xs font-black text-slate-900">{rev.name}</p>
                    <p className="text-[10px] font-bold text-slate-400">{rev.role}</p>
                  </div>
                  <button onClick={() => handleDelete(rev.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
