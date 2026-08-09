"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  MapPin, Star, GraduationCap, Users, ShieldCheck, 
  Sparkles, BookOpen, Music, Code, Beaker, Swords, ArrowRight,
  CheckCircle, MessageSquare, Laptop, Home, School, Clock, 
  UserCheck, Award, Briefcase, ChevronRight, X, AlertCircle, Loader2 
} from "lucide-react";
import { toast } from "sonner";

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
  classesOrAgeGroup: string[] | null;
  qualificationLevel: string | null;
  qualificationName: string | null;
  achievements: string | null;
  isApproved: boolean;
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

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSubject, setBookingSubject] = useState("");
  const [bookingClass, setBookingClass] = useState("");
  const [bookingMode, setBookingMode] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingLocation, setBookingLocation] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

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
        setBookingSubject(data.subjects[0]);
      }
      setBookingLocation(data.address || "");
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

  const handleBookDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please login to book a demo session");
      router.push("/signup");
      return;
    }

    setBookingSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: tutorId,
          subject: bookingSubject,
          classLevel: bookingClass,
          mode: bookingMode,
          location: bookingLocation,
          message: bookingMessage || `Booking request for ${bookingSubject} with ${tutor?.name}`,
        }),
      });

      if (!res.ok) throw new Error("Booking failed");
      toast.success(`Demo session request sent to ${tutor?.name}!`);
      setShowBookingModal(false);
      setBookingMessage("");
    } catch (err) {
      toast.error("Booking request failed. Please try again.");
    } finally {
      setBookingSubmitting(false);
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
      <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row gap-8 items-center">
          
          {/* Avatar */}
          <div className="relative shrink-0">
            {tutor.profilePhoto ? (
              <img src={tutor.profilePhoto} alt={tutor.name} className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border-4 border-slate-800 shadow-2xl" />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 bg-primary text-white rounded-3xl flex items-center justify-center font-black text-5xl">
                {tutor.name[0]}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl shadow-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Info */}
          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
              Verified Private Instructor
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">{tutor.name}</h1>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {tutor.address?.split(",")[0]}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-primary" /> {tutor.experience} Experience</span>
              <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-primary" /> {tutor.qualificationLevel} ({tutor.qualificationName})</span>
            </div>
          </div>
        </div>
      </section>

      {/* BODY COLUMNS */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ABOUT & CERTIFICATIONS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* About / Achievements */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" /> Overview & Philosophy
            </h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              {tutor.achievements || "Dedicated to building strong foundational concepts and helping students excel in academics."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div className="flex gap-3">
                <GraduationCap className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Education</p>
                  <p className="text-sm font-semibold text-slate-800">{tutor.education}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Briefcase className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Experience</p>
                  <p className="text-sm font-semibold text-slate-800">{tutor.experience}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          {tutor.certifications && tutor.certifications.length > 0 && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" /> Certifications & Audits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tutor.certifications.map((cert, index) => (
                  <div key={index} className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Award className="w-8 h-8 text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{cert.text}</h4>
                      {cert.image && (
                        <a href={cert.image} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-bold hover:underline block mt-1">
                          View Certificate
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews List & Write Review */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-slate-50 pb-6">
              <h3 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" /> Student Reviews ({reviews.length})
              </h3>
              <div className="flex items-center gap-1.5 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                <Star className="w-4 h-4 text-primary fill-current" />
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
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{rev.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{rev.date}</p>
                      </div>
                      <div className="flex items-center gap-0.5 text-primary">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
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
              <h4 className="font-extrabold text-slate-950">Add a Review</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl text-sm font-semibold transition-all"
                />
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl text-sm font-semibold transition-all"
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl text-xs font-semibold resize-none transition-all"
              />
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="px-6 py-3 bg-slate-900 hover:bg-primary hover:text-white text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: BOOKING & SIDE-INFO */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Rate / Booking Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-6 text-center">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hourly Fee Rate</p>
              <p className="text-4xl font-[1000] text-slate-950 tracking-tighter">₹1,200<span className="text-xs font-bold text-slate-400 tracking-normal ml-1">/hr</span></p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="flex justify-between">
                <span>Class Mode:</span>
                <span className="text-slate-900 font-black">{tutor.teachingMode || "Online"}</span>
              </div>
              <div className="flex justify-between">
                <span>Rating:</span>
                <span className="text-slate-900 font-black flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" /> {averageRating}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Experience:</span>
                <span className="text-slate-900 font-black">{tutor.experience}</span>
              </div>
            </div>

            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full py-4 bg-primary hover:bg-primary/95 text-white font-black rounded-2xl shadow-lg shadow-primary/10 uppercase tracking-widest text-xs transition-all active:scale-95"
            >
              Book Free Trial
            </button>
          </div>

          {/* Subjects Tag List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-950 text-sm uppercase tracking-wider">Subjects Taught</h4>
            <div className="flex flex-wrap gap-2">
              {tutor.subjects.map((sub) => (
                <span key={sub} className="px-3 py-1.5 bg-primary/5 text-primary text-[10px] font-bold uppercase rounded-xl border border-primary/10 shadow-sm">
                  {sub}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowBookingModal(false)} />
          
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 text-slate-900 space-y-6">
            
            <button onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 text-center">
              <h3 className="text-2xl font-black text-slate-950 tracking-tight leading-none">Book Trial Lesson</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connect directly with {tutor.name}</p>
            </div>

            <form onSubmit={handleBookDemo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Learning Subject</label>
                <select 
                  value={bookingSubject} 
                  onChange={(e) => setBookingSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl text-sm font-semibold"
                >
                  {tutor.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Class / Level</label>
                  <select 
                    value={bookingClass} 
                    onChange={(e) => setBookingClass(e.target.value)}
                    required
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl text-xs font-semibold"
                  >
                    <option value="">Select Level</option>
                    <option value="Class 1-5">Class 1-5</option>
                    <option value="Class 6-8">Class 6-8</option>
                    <option value="Class 9-10">Class 9-10</option>
                    <option value="Class 11-12">Class 11-12</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Hobbyist">Hobbyist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mode</label>
                  <select 
                    value={bookingMode} 
                    onChange={(e) => setBookingMode(e.target.value)}
                    required
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl text-xs font-semibold"
                  >
                    <option value="">Select Mode</option>
                    <option value="Online Tutor">Online Class</option>
                    <option value="Home Tutor">Home Tuition</option>
                    <option value="At Centre">At Center</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your Location / City</label>
                <input
                  type="text"
                  required
                  value={bookingLocation}
                  onChange={(e) => setBookingLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Extra Info / Schedule Preferences</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Free after 5 PM on weekdays..."
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl text-xs font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={bookingSubmitting}
                className="w-full py-4 bg-primary hover:bg-primary/95 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black rounded-xl shadow-lg shadow-primary/20 uppercase tracking-wider text-xs transition-all"
              >
                {bookingSubmitting ? "Sending Request..." : "Confirm & Send"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
