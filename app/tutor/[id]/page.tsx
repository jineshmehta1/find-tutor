"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  MapPin, Star, GraduationCap, Users, ShieldCheck, 
  Sparkles, BookOpen, Music, Code, Beaker, Swords, ArrowRight,
  CheckCircle, MessageSquare, Laptop, Home, School, Clock, 
  UserCheck, Award, Briefcase, ChevronRight, X, AlertCircle, Loader2, Phone 
} from "lucide-react";
import { toast } from "sonner";
import { getPublicLocality } from "@/lib/geoUtils";


interface Tutor {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
  address: string;
  education: string;
  experience: string;
  certifications: { text: string; image?: string }[];
  subjects: string[];
  teachingMode: string | null;
  expectedFee?: number;
  feeType?: string;
  classesOrAgeGroup: string[] | null;
  qualificationLevel: string | null;
  qualificationName: string | null;
  achievements: string | null;
  isApproved: boolean;
  dob: string;
  gender: string | null;
  preferredLanguage: string | null;
  achievementCertificate: string | null;
  qualificationCertificate: string | null;
}

interface Review {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  date: string;
}

export default function TutorDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const tutorId = params.id;

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    fetchTutorData();
    fetchReviews();
  }, [tutorId]);

  const fetchTutorData = async () => {
    try {
      const res = await fetch(`/api/teachers/${tutorId}`);
      if (!res.ok) throw new Error("Failed to fetch tutor details");
      const data = await res.json();
      setTutor(data);
      if (data.subjects && data.subjects.length > 0) {
      }
    } catch (err) {
      toast.error("Could not load tutor details");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/review?pageKey=${tutorId}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWriteReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewContent.trim()) {
      toast.error("Please fill in your name and review details");
      return;
    }

    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageKey: tutorId,
          name: reviewName,
          role: "Student",
          content: reviewContent,
          rating: reviewRating,
        }),
      });

      if (!res.ok) throw new Error("Failed to post review");
      toast.success("Review posted successfully!");
      setReviewName("");
      setReviewContent("");
      setReviewRating(5);
      fetchReviews();
    } catch (err) {
      toast.error("Could not post review. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Loading Tutor Profile...</p>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center space-y-6">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tutor Profile Not Found</h2>
        <p className="text-slate-500">The profile you are trying to view does not exist or has been disabled.</p>
        <button onClick={() => router.push("/find-tutor-nearby")} className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl">
          Back to Directory
        </button>
      </div>
    );
  }

  const averageRating = reviews.length 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* HEADER SECTION */}
      <section className="bg-slate-900 text-white py-14 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
          
          {/* Avatar */}
          <div className="relative shrink-0">
            {tutor.profilePhoto ? (
              <img src={tutor.profilePhoto} alt={tutor.name} className="w-28 h-28 md:w-36 md:h-36 rounded-3xl object-cover border-4 border-slate-800 shadow-2xl" />
            ) : (
              <div className="w-28 h-28 md:w-36 md:h-36 bg-amber-400 text-slate-950 rounded-3xl flex items-center justify-center font-black text-4xl md:text-5xl">
                {tutor.name[0]}
              </div>
            )}
            <div className={`absolute -bottom-2 -right-2 p-2 rounded-2xl shadow-xl ${tutor.isApproved ? "bg-emerald-500 text-white" : "bg-amber-500 text-slate-950"}`}>
              {tutor.isApproved ? <ShieldCheck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            </div>
          </div>

          {/* Info */}
          <div className="text-center md:text-left space-y-3">
            {tutor.isApproved ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider rounded-full border border-emerald-400/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Private Instructor</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider rounded-full border border-amber-400/30">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Unverified Profile (Pending Verification)</span>
              </div>
            )}
            
            <h1 className="text-2xl md:text-4xl font-black tracking-tight">{tutor.name}</h1>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-xs md:text-sm text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-amber-400" /> {getPublicLocality(tutor.address)}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-amber-400" /> {tutor.experience} Experience</span>
              <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-amber-400" /> {tutor.qualificationName || tutor.qualificationLevel || tutor.education}</span>
              {tutor.gender && (
                <span className="flex items-center gap-1.5 capitalize"><UserCheck className="w-4 h-4 text-amber-400" /> {tutor.gender}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BODY COLUMNS */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ABOUT, SUBJECTS, CERTIFICATIONS */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          
          {/* Overview & Philosophy */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-5">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-950 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-500" /> Overview & Philosophy
            </h3>
            <p className="text-slate-600 font-medium leading-relaxed italic text-sm md:text-base">
              "{tutor.achievements || "Dedicated to building strong foundational concepts and helping students excel in academics."}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div className="flex gap-3 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100/60">
                <GraduationCap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Highest Qualification</p>
                  <p className="text-sm font-extrabold text-slate-800">{tutor.qualificationName || tutor.education}</p>
                  {tutor.qualificationLevel && <p className="text-xs text-slate-500 font-medium">{tutor.qualificationLevel}</p>}
                </div>
              </div>
              <div className="flex gap-3 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100/60">
                <Briefcase className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teaching Experience</p>
                  <p className="text-sm font-extrabold text-slate-800">{tutor.experience}</p>
                  <p className="text-xs text-slate-500 font-medium">Classroom & Private Mentoring</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Profile Info */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Teaching Preferences & Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-slate-700 text-sm">
              {/* Teaching Modes */}
              <div className="space-y-1.5 sm:col-span-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Teaching Modes</p>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    let modes: string[] = [];
                    if (tutor.teachingMode) {
                      try {
                        const parsed = JSON.parse(tutor.teachingMode);
                        if (Array.isArray(parsed)) modes = parsed;
                        else if (typeof parsed === "string") modes = [parsed];
                      } catch {
                        modes = tutor.teachingMode.split(",").map(s => s.trim());
                      }
                    }
                    if (modes.length === 0) modes = ["Online mode"];
                    return modes.map((m, i) => {
                      const clean = String(m).replace(/^["'\[\]]+|["'\[\]]+$/g, '').trim();
                      const upper = clean.toUpperCase();
                      let label = clean;
                      let icon = "✨";
                      if (upper.includes("STUDENT") || upper.includes("HOME TUTOR")) { label = "At Student Home"; icon = "🏠"; }
                      else if (upper.includes("TEACHER") || upper.includes("CENTRE")) { label = "At Teacher Home / Center"; icon = "🏢"; }
                      else if (upper.includes("ONLINE")) { label = "Online Mode"; icon = "💻"; }
                      return (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-900 font-extrabold text-xs rounded-xl border border-blue-100 shadow-xs">
                          <span>{icon}</span> {label}
                        </span>
                      );
                    });
                  })()}
                </div>
              </div>

              {tutor.preferredLanguage && (
                <div className="space-y-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Preferred Language</p>
                  <p className="font-extrabold text-slate-800 text-sm">{tutor.preferredLanguage}</p>
                </div>
              )}

              {tutor.dob && (
                <div className="space-y-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Age</p>
                  <p className="font-extrabold text-slate-800 text-sm">
                    {(() => {
                      const birth = new Date(tutor.dob);
                      const ageDiffMs = Date.now() - birth.getTime();
                      const ageDate = new Date(ageDiffMs);
                      return `${Math.abs(ageDate.getUTCFullYear() - 1970)} years old`;
                    })()}
                  </p>
                </div>
              )}

              {tutor.address && (
                <div className="space-y-1 sm:col-span-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Teaching Locality & City</p>
                  <p className="font-extrabold text-slate-800 text-sm">{getPublicLocality(tutor.address)}</p>
                </div>
              )}
            </div>

            {/* Classes/Ages taught list */}
            {tutor.classesOrAgeGroup && tutor.classesOrAgeGroup.length > 0 && (
              <div className="pt-4 border-t border-slate-50 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Classes & Grades Taught</p>
                <div className="flex flex-wrap gap-2">
                  {tutor.classesOrAgeGroup.map((cls) => (
                    <span key={cls} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100 shadow-xs">
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Subjects Offered with Class Breakdown */}
          {tutor.subjects && tutor.subjects.length > 0 && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg md:text-xl font-extrabold text-slate-950 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" /> Subjects Offered
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tutor.subjects.map((sub, idx) => {
                  const match = sub.match(/^(.*?)\s*\((.*?)\)$/);
                  const title = match ? match[1] : sub;
                  const levels = match ? match[2].split(",").map(x => x.trim()) : [];
                  return (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        {title}
                      </h4>
                      {levels.length > 0 ? (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {levels.map(l => (
                            <span key={l} className="px-2 py-0.5 bg-white text-slate-600 text-[10px] font-bold rounded-md border border-slate-200 shadow-2xs">
                              {l}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 font-semibold">All offered grade levels</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Certifications & Verified Proof Documents */}
          {((tutor.certifications && tutor.certifications.length > 0) || tutor.qualificationCertificate || tutor.achievementCertificate) && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg md:text-xl font-extrabold text-slate-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Achievements & Verified Audit Proofs
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Specific Certifications with proof */}
                {tutor.certifications?.map((cert, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-amber-500 shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{cert.text}</h4>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">✓ Verified Proof</span>
                      </div>
                    </div>
                    {cert.image && (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white p-2">
                        <img 
                          src={cert.image} 
                          alt={cert.text} 
                          className="w-full h-auto max-h-48 object-contain rounded-lg pointer-events-none select-none"
                          onContextMenu={(e) => e.preventDefault()}
                          draggable="false"
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* Main Qualification Certificate Proof */}
                {tutor.qualificationCertificate && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-6 h-6 text-indigo-500 shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">Academic Degree Certificate</h4>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">✓ Audited Document</span>
                      </div>
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white p-2">
                      <img 
                        src={tutor.qualificationCertificate} 
                        alt="Academic Degree Certificate" 
                        className="w-full h-auto max-h-48 object-contain rounded-lg pointer-events-none select-none"
                        onContextMenu={(e) => e.preventDefault()}
                        draggable="false"
                      />
                    </div>
                  </div>
                )}

                {/* Achievement Award Certificate Proof */}
                {tutor.achievementCertificate && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-amber-500 shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">Award & Recognition Certificate</h4>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">✓ Verified Document</span>
                      </div>
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white p-2">
                      <img 
                        src={tutor.achievementCertificate} 
                        alt="Award Certificate" 
                        className="w-full h-auto max-h-48 object-contain rounded-lg pointer-events-none select-none"
                        onContextMenu={(e) => e.preventDefault()}
                        draggable="false"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Student Reviews & Write Review */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-slate-50 pb-6">
              <h3 className="text-lg md:text-xl font-extrabold text-slate-950 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" /> Student Reviews ({reviews.length})
              </h3>
              <div className="flex items-center gap-1.5 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="font-black text-sm text-slate-900">{averageRating}</span>
              </div>
            </div>

            {/* List */}
            {reviews.length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <MessageSquare className="w-12 h-12 mx-auto text-slate-300" />
                <p className="font-bold text-sm uppercase">No reviews yet</p>
                <p className="text-xs font-semibold">Be the first student to review this tutor!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{rev.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{rev.date}</p>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                      "{rev.content}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Write Review Form */}
            <form onSubmit={handleWriteReview} className="border-t border-slate-50 pt-8 space-y-4">
              <h4 className="font-extrabold text-slate-950 text-sm">Add a Student Review</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 rounded-xl text-sm font-semibold transition-all"
                />
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 rounded-xl text-sm font-semibold transition-all"
                >
                  <option value={5}>5 Stars (Excellent)</option>
                  <option value={4}>4 Stars (Good)</option>
                  <option value={3}>3 Stars (Average)</option>
                  <option value={2}>2 Stars (Poor)</option>
                  <option value={1}>1 Star (Terrible)</option>
                </select>
              </div>
              <textarea
                rows={3}
                placeholder="Share your learning experience with this tutor..."
                required
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 rounded-xl text-xs font-semibold resize-none transition-all"
              />
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="px-6 py-3 bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: FEE & DIRECT CONTACT */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          
          {/* Rate / Booking Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-6 text-center sticky top-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                {tutor.feeType === "/month" ? "Monthly Fee Rate" : "Hourly Fee Rate"}
              </p>
              <p className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
                {tutor.expectedFee ? `₹${tutor.expectedFee.toLocaleString()}` : "Contact for Fee"}
                {tutor.expectedFee && <span className="text-xs font-bold text-slate-400 tracking-normal ml-1">{tutor.feeType || "/hr"}</span>}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="flex justify-between items-center">
                <span>Rating:</span>
                <span className="text-slate-900 font-black flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {averageRating}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Experience:</span>
                <span className="text-slate-900 font-black">{tutor.experience}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Verification:</span>
                <span className={`font-black ${tutor.isApproved ? "text-emerald-600" : "text-amber-600"}`}>
                  {tutor.isApproved ? "Verified ID" : "Pending"}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  if (!session) {
                    toast.error("Please login to message the tutor");
                    router.push("/signup");
                    return;
                  }
                  window.open(`https://wa.me/91${tutor.phone?.replace(/\D/g, "").slice(-10)}`, "_blank");
                }}
                className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-md shadow-emerald-500/10 uppercase tracking-wider text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                <MessageSquare className="w-4 h-4 shrink-0" /> WhatsApp
              </button>
              <button
                onClick={() => {
                  if (!session) {
                    toast.error("Please login to call the tutor");
                    router.push("/signup");
                    return;
                  }
                  window.open(`tel:${tutor.phone}`, "_self");
                }}
                className="flex-1 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl shadow-md shadow-amber-400/10 uppercase tracking-wider text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                <Phone className="w-4 h-4 shrink-0" /> Call
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
