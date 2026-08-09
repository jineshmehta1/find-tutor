"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, ShieldCheck, MapPin, Award, CheckCircle2, Calendar, Sparkles, BookOpen } from "lucide-react";

interface TutorSpotlightProps {
  onBookDemo?: (tutorName: string, subject: string) => void;
}

const FEATURED_TUTORS = [
  {
    id: "t1",
    name: "Dr. Sandeep Kumar",
    qualification: "Ph.D. Physics (IIT Madras Alum)",
    experience: "12+ Years Exp",
    location: "Bhavanipuram, Vijayawada",
    subjects: ["Class 10-12 Physics", "JEE Main & Adv", "CBSE Board Prep"],
    rating: 4.95,
    reviewsCount: 142,
    studentsTaught: "450+",
    hourlyRate: "₹450/hr",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    badge: "Master Educator",
    verifiedStatus: "Physically Verified ID & Degree"
  },
  {
    id: "t2",
    name: "Priya Sharma",
    qualification: "M.Tech CSE & AI Specialist",
    experience: "8+ Years Exp",
    location: "Online 1-on-1 Specialist",
    subjects: ["Python Programming", "AI & Robotics", "Web Development"],
    rating: 4.98,
    reviewsCount: 189,
    studentsTaught: "600+",
    hourlyRate: "₹500/hr",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    badge: "Tech & Coding Mentor",
    verifiedStatus: "Gold Verified Instructor"
  },
  {
    id: "t3",
    name: "Master Ramesh Verma",
    qualification: "International FIDE Rated Coach",
    experience: "15+ Years Exp",
    location: "Vijayawada Center & Home",
    subjects: ["Abacus Mental Maths", "Chess Tactics & Strategy", "Olympiad Math"],
    rating: 4.92,
    reviewsCount: 210,
    studentsTaught: "1,200+",
    hourlyRate: "₹350/hr",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    badge: "Abacus & Chess Master",
    verifiedStatus: "FIDE Certified Trainer"
  },
  {
    id: "t4",
    name: "Ananya Rao",
    qualification: "M.Sc. Mathematics (Gold Medalist)",
    experience: "7+ Years Exp",
    location: "Bhavanipuram & Online",
    subjects: ["Class 9-10 Maths", "Class 11-12 Calculus", "ICSE Board Prep"],
    rating: 4.97,
    reviewsCount: 128,
    studentsTaught: "380+",
    hourlyRate: "₹400/hr",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    badge: "Board Exam Topper Coach",
    verifiedStatus: "Physically Verified"
  }
];

export function TutorSpotlight({ onBookDemo }: TutorSpotlightProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTutors() {
      try {
        const res = await fetch("/api/teachers?approved=true");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const tutorsWithDetails = await Promise.all(data.map(async (t: any) => {
              let rating = 5.0;
              let reviewsCount = 0;
              try {
                const revRes = await fetch(`/api/review?pageKey=${t.id}`);
                if (revRes.ok) {
                  const revs = await revRes.json();
                  reviewsCount = revs.length;
                  if (reviewsCount > 0) {
                    const sum = revs.reduce((acc: number, r: any) => acc + r.rating, 0);
                    rating = Math.round((sum / reviewsCount) * 100) / 100;
                  }
                }
              } catch (e) {
                console.error(e);
              }
              return {
                id: t.id,
                name: t.name,
                qualification: t.education || t.qualificationName || "Educator",
                experience: t.experience || "Verified Tutor",
                location: t.address || "Vijayawada",
                subjects: t.subjects || [],
                rating,
                reviewsCount,
                studentsTaught: "100+",
                hourlyRate: "Contact",
                avatar: t.profilePhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
                badge: t.qualificationLevel || "Verified Partner",
                verifiedStatus: "Physically Verified"
              };
            }));
            setTutors(tutorsWithDetails);
          } else {
            setTutors(FEATURED_TUTORS);
          }
        } else {
          setTutors(FEATURED_TUTORS);
        }
      } catch (err) {
        console.error("Error loading tutors:", err);
        setTutors(FEATURED_TUTORS);
      } finally {
        setLoading(false);
      }
    }
    loadTutors();
  }, []);

  const categories = ["All", "Science & Maths", "Coding & AI", "Abacus & Chess"];

  const filteredTutors = tutors.filter(t => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Science & Maths") return t.subjects.some((s: string) => s.toLowerCase().includes("physics") || s.toLowerCase().includes("maths") || s.toLowerCase().includes("science") || s.toLowerCase().includes("chemistry") || s.toLowerCase().includes("calculus") || s.toLowerCase().includes("biology"));
    if (selectedCategory === "Coding & AI") return t.subjects.some((s: string) => s.toLowerCase().includes("python") || s.toLowerCase().includes("coding") || s.toLowerCase().includes("web") || s.toLowerCase().includes("programming") || s.toLowerCase().includes("ai") || s.toLowerCase().includes("robotics"));
    if (selectedCategory === "Abacus & Chess") return t.subjects.some((s: string) => s.toLowerCase().includes("abacus") || s.toLowerCase().includes("chess") || s.toLowerCase().includes("tactics") || s.toLowerCase().includes("fide"));
    return true;
  });

  return (
    <div className="w-full space-y-10">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Top Rated & Background Checked</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">
            Meet Featured <span className="text-gradient-gold">Verified Tutors</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Hand-picked educators with verified credentials, high parent ratings, and proven student score growth.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tutor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTutors.map((tutor) => (
          <motion.div
            key={tutor.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
          >
            <div>
              {/* Badge & Avatar Header */}
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="relative shrink-0 cursor-pointer"
                  onClick={() => router.push(`/tutor/${tutor.id}`)}
                >
                  <img
                    src={tutor.avatar}
                    alt={tutor.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase text-primary tracking-wider bg-primary/10 px-2 py-0.5 rounded-md inline-block mb-1">
                    {tutor.badge}
                  </span>
                  <h3 
                    className="font-extrabold text-slate-950 text-base leading-tight group-hover:text-primary transition-colors cursor-pointer"
                    onClick={() => router.push(`/tutor/${tutor.id}`)}
                  >
                    {tutor.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5 line-clamp-1">
                    {tutor.qualification}
                  </p>
                </div>
              </div>

              {/* Rating & Stats */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/80 flex items-center justify-between text-xs mb-4">
                <div className="flex items-center gap-1 text-amber-500 font-black">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{tutor.rating}</span>
                  <span className="text-slate-400 text-[10px] font-semibold font-sans">({tutor.reviewsCount})</span>
                </div>
                <div className="text-slate-600 font-bold text-[11px]">
                  {tutor.experience}
                </div>
              </div>

              {/* Location Tag */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-4">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{tutor.location}</span>
              </div>

              {/* Subject Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {tutor.subjects.map((sub: string, i: number) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Footer & Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Starts from</span>
                <span className="text-base font-black text-slate-950">{tutor.hourlyRate}</span>
              </div>

              <button
                onClick={() => onBookDemo && onBookDemo(tutor.name, tutor.subjects[0] || "General")}
                className="px-4 py-2.5 bg-slate-950 hover:bg-primary text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 shrink-0"
              >
                Book Free Demo
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
