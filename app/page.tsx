"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { 
  Search, MapPin, Star, GraduationCap, Users, ShieldCheck, 
  Sparkles, BookOpen, Music, Code, Beaker, Swords, ArrowRight,
  MessageSquare, Laptop, ChevronRight, Palette, Activity,
  BrainCircuit, Clock, Locate
} from "lucide-react";

import { QuickDemoModal } from "@/components/QuickDemoModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MapLocationPicker from "@/components/ui/DynamicMapPicker";

const ACADEMIC_SUBJECTS = [
  "Mathematics", "Science", "Physics", "Chemistry", "Biology", "English", "Social Studies", "Computer Science"
];

const ACTIVITY_SUBJECTS = [
  "Chess", "Yoga", "Abacus", "Music", "Drawing", "Dance"
];

// Static constants TEACHERS and COACHES removed to force real database content only.

const POPULAR_ACTIVITIES = [
  { name: "Mathematics", icon: BookOpen, image: "/math.jpeg" },
  { name: "Science", icon: Beaker, image: "/science.avif" },
  { name: "English", icon: BookOpen, image: "/english.jpeg" },
  { name: "Social Studies", icon: BookOpen, image: "/social.jpeg" },
  { name: "Computer Science", icon: Laptop, image: "/computer.jpeg" },
  { name: "Chess", icon: Swords, image: "/chess1.jpeg" },
  { name: "Yoga", icon: Activity, image: "/yoga.jpeg" },
  { name: "Abacus", icon: BrainCircuit, image: "/abacus1.jpeg" },
  { name: "Music", icon: Music, image: "/music.jpeg" },
  { name: "Drawing", icon: Palette, image: "/drawing.jpeg" },
  { name: "Dance", icon: Activity, image: "/dance.jpg" },
];

const TESTIMONIALS = [
  {
    name: "Anita R.",
    role: "Parent",
    rating: 5,
    text: "We found a wonderful Maths teacher for my son through AACHARYA. He explains concepts so well and is very patient.",
    avatar: "/g1.avif"
  },
  {
    name: "Vijay M.",
    role: "Parent",
    rating: 5,
    text: "The yoga classes are excellent! My daughter is more active and confident now. Thank you AACHARYA!",
    avatar: "/boy.webp"
  },
  {
    name: "Karthik S.",
    role: "Parent",
    rating: 5,
    text: "My daughter improved a lot in English and Science. Great platform to find the right teacher nearby.",
    avatar: "/karthik.avif"
  }
];

// Helper to assign a premium banner image matching the tutor's subject
const getSubjectCover = (subject: string): string => {
  const sub = (subject || "").toLowerCase();
  if (sub.includes("chess")) return "/kidchess.jpg";
  if (sub.includes("abacus")) return "/kidabacus.jpg";
  if (sub.includes("robot") || sub.includes("code") || sub.includes("computer")) return "/kidrobot.jpg";
  if (sub.includes("math")) return "/kidcoaching.jpg";
  if (sub.includes("science") || sub.includes("physic") || sub.includes("chemist") || sub.includes("biolog")) return "/tutor_teaching_card.png";
  return "/coaching.jpg"; // Default banner
};

// Reusable card component to handle local image loading state cleanly
function ShowcaseCard({ item, isCoach, handleOpenDemo }: { item: any; isCoach: boolean; handleOpenDemo: any }) {
  const [imgError, setImgError] = useState(false);
  const coverUrl = getSubjectCover(item.subject);

  return (
    <div className="bg-white border border-slate-100/80 rounded-[2rem] shadow-sm hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group h-full text-left">
      
      {/* Cover Image Header */}
      <div className="relative h-28 w-full overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-slate-900/10 z-10" />
        <img 
          src={coverUrl} 
          alt={item.subject} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Rating Badge - overlay on top right of cover */}
        <span className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-amber-600 rounded-full text-[10px] font-black shadow-sm">
          <Star className="w-3 h-3 fill-current" />
          <span>{item.rating}</span>
        </span>
      </div>

      {/* Profile info overlay & details */}
      <div className="p-5 pt-0 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Profile Avatar overlapping cover */}
        <div className="flex items-end gap-3 -mt-8 relative z-20">
          <div className="relative w-16 h-16 shrink-0">
            <div className={`profile-fallback w-16 h-16 rounded-full flex items-center justify-center font-black text-xl border-4 border-white shadow-md ${
              isCoach 
                ? "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white" 
                : "bg-gradient-to-tr from-amber-400 to-orange-500 text-white"
            }`}>
              {item.name.charAt(0)}
            </div>
            {item.image && !imgError && (
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md absolute inset-0 z-10"
                onError={() => setImgError(true)}
              />
            )}
          </div>
          
          <div className="pb-1">
            <h4 className="font-extrabold text-sm text-[#0f223a] group-hover:text-amber-500 transition-colors line-clamp-1">
              {item.name}
            </h4>
            {item.qualificationName && (
              <p className="text-[10px] text-slate-400 font-bold line-clamp-1">
                {item.qualificationName}
              </p>
            )}
          </div>
        </div>

        {/* Details Area */}
        <div className="space-y-2.5 w-full pt-1">
          <div className="flex flex-wrap gap-1.5">
            {/* Subject Pill */}
            <span className="px-2.5 py-1 rounded-full text-[9px] font-black tracking-wide uppercase bg-slate-100 text-slate-600 group-hover:bg-amber-500/10 group-hover:text-amber-600 transition-all">
              {item.subject}
            </span>
            
            {/* Teaching Mode Badge */}
            {item.teachingMode && (
              <span className="px-2.5 py-1 rounded-full text-[9px] font-black tracking-wide uppercase bg-blue-50 text-blue-600">
                {item.teachingMode}
              </span>
            )}
          </div>

          {/* Classes taught */}
          <p className="text-[11px] text-slate-500 font-medium leading-tight">
            <span className="font-extrabold text-slate-700">Teaches:</span> {item.classes}
          </p>

          {/* Short bio/education */}
          {item.education && (
            <p className="text-[10px] text-slate-400 font-medium line-clamp-2 italic leading-normal border-l-2 border-slate-100 pl-2">
              "{item.education}"
            </p>
          )}
        </div>

        {/* Bottom Info Row */}
        <div className="w-full border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-bold">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 shrink-0 text-slate-300" />
            <span>{item.experience}</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-300" />
            <span className="line-clamp-1 max-w-[120px]">{item.location}</span>
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => handleOpenDemo(item.name, item.subject)}
          className="w-full py-2.5 bg-slate-50 group-hover:bg-amber-500 group-hover:text-slate-950 text-[#0f223a] font-black text-xs rounded-xl transition-all duration-300 border border-slate-100 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Connect & Book Demo</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </button>

      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Hero Tab: "academics" or "activities"
  const [activeSearchTab, setActiveSearchTab] = useState<"academics" | "activities">("academics");

  // Search Fields
  const [searchSubject, setSearchSubject] = useState("");
  const [searchClass, setSearchClass] = useState("");
  const [searchLocation, setSearchLocation] = useState("Bhavanipuram, Vijayawada");
  const [searchMode, setSearchMode] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Real Database Tutors State
  const [realTeachers, setRealTeachers] = useState<any[]>([]);
  const [realCoaches, setRealCoaches] = useState<any[]>([]);
  const [isLoadingTutors, setIsLoadingTutors] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchTutors = async () => {
      try {
        setIsLoadingTutors(true);
        setApiError(null);
        console.log("Fetching tutors from API...");
        const res = await fetch("/api/teachers?approved=false", { cache: "no-store" });
        console.log("API response status:", res.status);
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Server returned status ${res.status}: ${errText || "Internal Server Error"}`);
        }
        const data = await res.json();
        console.log("Fetched tutors successfully, count:", data.length, data);
        const teachersList: any[] = [];
        const coachesList: any[] = [];
        
        data.forEach((item: any) => {
          const subjects = item.subjects || [];
          const isActivity = subjects.some((sub: string) => {
            const lower = sub.toLowerCase();
            return (
              lower.includes("chess") || 
              lower.includes("yoga") || 
              lower.includes("abacus") || 
              lower.includes("music") || 
              lower.includes("dance") || 
              lower.includes("cricket") || 
              lower.includes("coach") || 
              lower.includes("drawing") || 
              lower.includes("art") ||
              lower.includes("sports") ||
              ACTIVITY_SUBJECTS.some(act => lower.includes(act.toLowerCase()))
            );
          });

          // Convert raw user / teacher record to display properties
          const formatted = {
            id: item.id,
            name: item.name,
            subject: subjects[0] || (isActivity ? "Co-curricular Coach" : "Academic Teacher"),
            classes: Array.isArray(item.classesOrAgeGroup) 
              ? item.classesOrAgeGroup.join(", ") 
              : item.classesOrAgeGroup || "All Levels",
            experience: item.experience ? `${item.experience} Exp.` : "Experienced",
            location: item.address ? item.address.split(",")[0] : "Vijayawada",
            rating: item.rating || 5.0,
            image: item.profilePhoto || null,
            education: item.education || "",
            qualificationName: item.qualificationName || item.qualificationLevel || "Qualified Mentor",
            teachingMode: item.teachingMode === "Home Tutor"
              ? "At Student Home"
              : item.teachingMode === "Online Tutor"
                ? "Online mode"
                : item.teachingMode === "At Centre"
                  ? "At Teacher Home"
                  : (item.teachingMode || "Any type of mode")
          };

          if (isActivity) {
            coachesList.push(formatted);
          } else {
            teachersList.push(formatted);
          }
        });

        if (active) {
          console.log("Categorized - Academic Teachers:", teachersList.length, "Activity Coaches:", coachesList.length);
          setRealTeachers(teachersList);
          setRealCoaches(coachesList);
        }
      } catch (err: any) {
        console.error("Error loading tutors for showcase:", err);
        if (active) {
          setApiError(err.message || String(err));
        }
      } finally {
        if (active) {
          setIsLoadingTutors(false);
        }
      }
    };
    fetchTutors();
    return () => {
      active = false;
    };
  }, []);

  // Demo Modal State
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [modalDefaultSubject, setModalDefaultSubject] = useState("");
  const [modalDefaultTutor, setModalDefaultTutor] = useState("");

  const handleOpenDemo = (tutorName = "", subjectName = "") => {
    setModalDefaultTutor(tutorName);
    setModalDefaultSubject(subjectName);
    setIsDemoModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchSubject) query.set("subject", searchSubject);
    if (searchLocation) query.set("location", searchLocation);
    if (searchClass) query.set("classLevel", searchClass);
    if (searchMode) query.set("mode", searchMode);
    
    // Pass active tab filter if not custom selected
    if (activeSearchTab === "activities" && !searchSubject) {
      query.set("type", "coach");
    }
    
    router.push(`/find-tutor-nearby?${query.toString()}#results`);
  };

  const selectPopularSearch = (subjectName: string, isCoach = false) => {
    setSearchSubject(subjectName);
    if (isCoach) setActiveSearchTab("activities");
    else setActiveSearchTab("academics");
    
    const query = new URLSearchParams();
    query.set("subject", subjectName);
    query.set("location", searchLocation);
    router.push(`/find-tutor-nearby?${query.toString()}#results`);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    const loadingToast = toast.loading("Detecting your location...");
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          
          const address = data.address;
          const city = address.city || address.town || address.village || address.county || "Vijayawada";
          const suburb = address.suburb || address.neighbourhood || address.residential || "";
          
          const cleanAddress = suburb ? `${suburb}, ${city}` : city;
          setSearchLocation(cleanAddress);
          toast.success(`Location detected: ${cleanAddress}`, { id: loadingToast });
        } catch (error) {
          setSearchLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          toast.success("Location coordinates detected!", { id: loadingToast });
        }
      },
      (error) => {
        toast.error("Unable to retrieve location. Please check your browser permissions.", { id: loadingToast });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Fallbacks if database is empty
  const displayTeachers = realTeachers;
  const displayCoaches = realCoaches;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-white pt-10 pb-20 md:pt-14 md:pb-24 border-b border-slate-100">
        
        {/* Dotted Grid Pattern in Top-Left */}
        <div className="absolute top-10 left-6 w-20 h-32 pointer-events-none opacity-40">
          <svg width="80" height="150" fill="currentColor" className="text-amber-500">
            <defs>
              <pattern id="heroDots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2.5" cy="2.5" r="2.5" />
              </pattern>
            </defs>
            <rect width="80" height="150" fill="url(#heroDots)" />
          </svg>
        </div>

        {/* Bottom curve decoration */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400 rounded-tr-[10rem] opacity-90 -z-10" />

        {/* DESKTOP BACKGROUND IMAGE: Placed absolutely on the right */}
        <div className="absolute -top-26 right-0 w-[76%] h-[calc(100%+4rem)] z-10 hidden lg:block select-none pointer-events-none">
          {/* Smooth curved shape background behind image */}
          <div className="absolute inset-0 bg-[#fcf4e2] rounded-bl-[14rem] -z-10" />
          
          <img
            src="/hero-bg.png"
            alt="Find Right Teacher Near You"
            className="w-full h-full object-cover object-left-bottom"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.parentElement?.querySelector(".fallback-graphic-desktop");
              if (fallback) fallback.classList.remove("hidden");
            }}
          />
          {/* Desktop Fallback placeholder covering the background space */}
          <div className="fallback-graphic-desktop hidden absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/10 flex flex-col items-center justify-center text-center p-12 border-l border-[#f5e2bf]/40">
            <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600 mb-3">
              <Users className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-slate-800 text-base">Mother & Daughter Study Image</h4>
            <p className="text-slate-500 text-xs max-w-[260px] mt-1 leading-normal">
              Save your image file as `hero-bg.png` in your `public/` directory to show the picture here.
            </p>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-y-0">
            
            {/* LEFT HEADER AREA: TITLE & TAGLINE */}
            <div className="lg:col-span-7 space-y-4 text-left self-center pb-6 lg:pb-12">
              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.12] text-[#0f223a]">
                Find the Right <br />
                Teacher <span className="text-[#ffb800]">Near You</span>
              </h1>
              
              <p className="text-slate-600 text-sm md:text-[15px] font-medium leading-relaxed max-w-xl">
                <strong className="font-extrabold text-[#0f223a]">AACHARYA</strong> connects students and parents with trusted teachers and coaches for Classes 1 to 12 – Academics, Activities & More.
              </p>
            </div>

            {/* MOBILE IMAGE AREA - Rendered only on mobile screens */}
            <div className="lg:hidden w-full relative h-[240px] rounded-3xl overflow-hidden bg-slate-100/50 flex items-center justify-center border border-slate-200 shadow-inner">
              <img
                src="/hero-bg.png"
                alt="Find Right Teacher Near You"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.parentElement?.querySelector(".fallback-graphic-mobile");
                  if (fallback) fallback.classList.remove("hidden");
                }}
              />
              <div className="fallback-graphic-mobile hidden absolute inset-0 bg-gradient-to-br from-amber-400/25 to-orange-500/10 flex flex-col items-center justify-center text-center p-4">
                <Users className="w-6 h-6 text-amber-600 mb-1" />
                <span className="font-bold text-slate-800 text-xs">Mother & Daughter Study Image</span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-medium">Place `hero-bg.png` in `public/` folder</span>
              </div>
            </div>

            {/* FULL-WIDTH CARD WIDGET: OVERLAPS BOTTOM ROW */}
            <div className="lg:col-span-12 bg-white rounded-3xl shadow-xl border border-slate-100 p-5 md:p-6 space-y-4">
              
              <h3 className="text-slate-900 font-extrabold text-sm md:text-base text-left">
                What are you looking for?
              </h3>

              {/* Tab Toggles */}
              <div className="flex flex-col sm:flex-row border-b border-slate-100 pb-3.5 gap-4">
                
                {/* Tab 1: Academics */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSearchTab("academics");
                    setSearchSubject("");
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-left border flex-1 cursor-pointer ${
                    activeSearchTab === "academics" 
                      ? "bg-[#fef9eb] border-[#fbebc6] text-slate-900 shadow-sm" 
                      : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50/50"
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                    activeSearchTab === "academics" ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"
                  }`}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="leading-tight">
                    <span className="block font-black text-xs md:text-sm">Find a Teacher (Academics)</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">For Classes 1 to 12 Subjects</span>
                  </div>
                </button>

                {/* Tab 2: Activities */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSearchTab("activities");
                    setSearchSubject("");
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-left border flex-1 cursor-pointer ${
                    activeSearchTab === "activities" 
                      ? "bg-[#f5f5ff] border-[#e0e0ff] text-slate-900 shadow-sm" 
                      : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50/50"
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                    activeSearchTab === "activities" ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"
                  }`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="leading-tight">
                    <span className="block font-black text-xs md:text-sm">Find a Coach (Activities)</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Curricular & Co-curricular Activities</span>
                  </div>
                </button>
              </div>

              {/* 5-Column Input Row Form */}
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-slate-700">
                  
                  {/* Subject Dropdown */}
                  <div className="space-y-1 text-left lg:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subject / Activity</label>
                    <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 transition-colors focus-within:border-amber-500">
                      <BookOpen className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <select
                        value={searchSubject}
                        onChange={(e) => setSearchSubject(e.target.value)}
                        className="w-full bg-transparent border-none text-[12px] font-bold outline-none text-slate-800 py-1 cursor-pointer"
                      >
                        <option value="">Select Subject / Activity</option>
                        {(activeSearchTab === "academics" ? ACADEMIC_SUBJECTS : ACTIVITY_SUBJECTS).map((sub) => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Class Dropdown */}
                  <div className="space-y-1 text-left lg:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Class / Grade</label>
                    <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 transition-colors focus-within:border-amber-500">
                      <GraduationCap className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <select
                        value={searchClass}
                        onChange={(e) => setSearchClass(e.target.value)}
                        className="w-full bg-transparent border-none text-[12px] font-bold outline-none text-slate-800 py-1 cursor-pointer"
                      >
                        <option value="">Select Class (1 - 12)</option>
                        <option value="All">All Grades</option>
                        <option value="Class 1">Class 1</option>
                        <option value="Class 2">Class 2</option>
                        <option value="Class 3">Class 3</option>
                        <option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option>
                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 12">Class 12</option>
                      </select>
                    </div>
                  </div>

                  {/* Location Input */}
                  <div className="space-y-1 text-left lg:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Location</label>
                    <div 
                      className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 transition-colors hover:border-amber-500 cursor-pointer"
                      onClick={() => setIsLocationModalOpen(true)}
                    >
                      <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search Area"
                        value={searchLocation}
                        readOnly
                        className="w-full bg-transparent border-none text-[12px] font-bold outline-none text-slate-800 py-1 cursor-pointer pointer-events-none truncate pr-8"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDetectLocation();
                        }}
                        title="Detect Current Location"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-amber-500 transition-colors cursor-pointer flex items-center justify-center border-none bg-transparent"
                      >
                        <Locate className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Mode of Teaching Dropdown */}
                  <div className="space-y-1 text-left lg:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mode of Teaching</label>
                    <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 transition-colors focus-within:border-amber-500">
                      <Users className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <select
                        value={searchMode}
                        onChange={(e) => setSearchMode(e.target.value)}
                        className="w-full bg-transparent border-none text-[12px] font-bold outline-none text-slate-800 py-1 cursor-pointer"
                      >
                        <option value="">Any type of mode</option>
                        <option value="Home Tutor">At Student Home</option>
                        <option value="Online Tutor">Online mode</option>
                        <option value="At Centre">At Teacher Home</option>
                      </select>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="space-y-1 lg:col-span-2">
                    <label className="block text-[11px] font-bold text-transparent select-none hidden lg:block">&nbsp;</label>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#ffb800] hover:bg-[#ffa000] text-slate-950 font-extrabold text-[13px] uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Search className="w-4 h-4 text-slate-950 shrink-0" />
                      <span>Search Now</span>
                    </button>
                  </div>

                </div>
              </form>

              {/* Popular Searches Row */}
              <div className="border-t border-slate-100 pt-3.5 flex flex-wrap gap-2 items-center text-[12px] text-slate-500 font-bold">
                <span className="text-slate-400">Popular Searches:</span>
                <button type="button" onClick={() => selectPopularSearch("Mathematics")} className="px-3 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 border border-slate-100 transition-colors cursor-pointer">Maths Teacher</button>
                <button type="button" onClick={() => selectPopularSearch("Physics")} className="px-3 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 border border-slate-100 transition-colors cursor-pointer">Science Teacher</button>
                <button type="button" onClick={() => selectPopularSearch("English")} className="px-3 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 border border-slate-100 transition-colors cursor-pointer">English Teacher</button>
                <button type="button" onClick={() => selectPopularSearch("Yoga", true)} className="px-3 py-1 bg-[#fff9eb] border border-[#ffe082] rounded-lg text-slate-700 transition-colors cursor-pointer">Yoga Coach</button>
                <button type="button" onClick={() => selectPopularSearch("Abacus", true)} className="px-3 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 border border-slate-100 transition-colors cursor-pointer">Abacus Teacher</button>
                <button type="button" onClick={() => selectPopularSearch("Chess", true)} className="px-3 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 border border-slate-100 transition-colors cursor-pointer">Chess Coach</button>
                <a href="/find-tutor-nearby" className="text-blue-600 hover:underline ml-auto font-extrabold">View All</a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. SUB-HERO SPLIT BANNERS */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Banner 1: For Students & Parents */}
            <div className="bg-[#fff9e6] rounded-3xl p-6 md:p-8 flex items-start gap-5 border border-[#ffeebf] hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center shrink-0 text-slate-950">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight">For Students & Parents</h3>
                  <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">
                    Find verified teachers and coaches nearby for the best learning experience.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/find-tutor-nearby")}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Browse Teachers & Coaches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Banner 2: Can't Find Right Teacher */}
            <div className="bg-[#eef4fc] rounded-3xl p-6 md:p-8 flex items-start gap-5 border border-[#d6e4f8] hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shrink-0 text-white">
                <Users className="w-7 h-7" />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight">Can't Find the Right Teacher?</h3>
                  <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">
                    Post your requirement and we'll help you find the perfect match.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/request-tutor")}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Post Requirement</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 md:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-12">
          
          <div className="space-y-2 text-center">
            <h2 className="text-2xl md:text-3.5xl font-extrabold text-slate-900 tracking-tight">How It Works</h2>
            <div className="w-12 h-1 bg-[#ffb800] mx-auto rounded-full" />
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-3 max-w-5xl mx-auto pt-4">
            
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3.5 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#f3e5f5] text-[#9c27b0] flex items-center justify-center border border-[#e1bee7] font-bold shadow-sm shrink-0">
                  <Search className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#ffb800] text-slate-900 font-extrabold text-[10px] flex items-center justify-center shrink-0">1</span>
                  <h4 className="font-extrabold text-sm text-[#0f223a] uppercase tracking-wider">Search</h4>
                </div>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed font-medium pl-0 lg:pl-4">
                Search by subject/activity, class, location and preferred mode.
              </p>
            </div>

            {/* Arrow 1 to 2 */}
            <div className="hidden lg:flex items-center justify-center text-slate-300 self-center pt-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>

            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3.5 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#fff3e0] text-[#f57c00] flex items-center justify-center border border-[#ffe0b2] font-bold shadow-sm shrink-0">
                  <Users className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#ffb800] text-slate-900 font-extrabold text-[10px] flex items-center justify-center shrink-0">2</span>
                  <h4 className="font-extrabold text-sm text-[#0f223a] uppercase tracking-wider">Connect</h4>
                </div>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed font-medium pl-0 lg:pl-4">
                View profiles, compare and connect with the best match.
              </p>
            </div>

            {/* Arrow 2 to 3 */}
            <div className="hidden lg:flex items-center justify-center text-slate-300 self-center pt-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3.5 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center border border-[#c8e6c9] font-bold shadow-sm shrink-0">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#ffb800] text-slate-900 font-extrabold text-[10px] flex items-center justify-center shrink-0">3</span>
                  <h4 className="font-extrabold text-sm text-[#0f223a] uppercase tracking-wider">Communicate</h4>
                </div>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed font-medium pl-0 lg:pl-4">
                Discuss requirements, schedule classes and finalize details.
              </p>
            </div>

            {/* Arrow 3 to 4 */}
            <div className="hidden lg:flex items-center justify-center text-slate-300 self-center pt-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>

            {/* Step 4 */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3.5 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#e3f2fd] text-[#1565c0] flex items-center justify-center border border-[#bbdefb] font-bold shadow-sm shrink-0">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#ffb800] text-slate-900 font-extrabold text-[10px] flex items-center justify-center shrink-0">4</span>
                  <h4 className="font-extrabold text-sm text-[#0f223a] uppercase tracking-wider">Start Learning</h4>
                </div>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed font-medium pl-0 lg:pl-4">
                Begin your learning journey with the right teacher or coach.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. TEACHERS & COACHES SIDE BY SIDE GRID (2-COLUMN GRID) */}
      <section className="py-16 md:py-20 bg-white border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* LEFT COLUMN: Top Academic Teachers */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
                <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-500" />
                  <span>Academic Teachers</span>
                </h3>
                <a href="/find-tutor-nearby" className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1">
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
              
              {/* Grid of Teachers - 2 per row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {apiError ? (
                  <div className="col-span-full py-10 text-center text-red-500 font-bold text-xs uppercase tracking-widest bg-red-50 border border-dashed border-red-200 rounded-[2rem] p-4">
                    Error: {apiError}
                  </div>
                ) : isLoadingTutors ? (
                  <div className="col-span-full py-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] animate-pulse">
                    Loading Teachers...
                  </div>
                ) : displayTeachers.length === 0 ? (
                  <div className="col-span-full py-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] min-h-[300px] flex flex-col items-center justify-center p-6">
                    <Users className="w-8 h-8 text-slate-300 mb-2" />
                    <span>No teachers registered</span>
                  </div>
                ) : (
                  displayTeachers.slice(0, 4).map((teacher, idx) => (
                    <ShowcaseCard 
                       key={idx} 
                       item={teacher} 
                       isCoach={false} 
                       handleOpenDemo={handleOpenDemo} 
                    />
                  ))
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Top Activity Coaches */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
                <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-500" />
                  <span>Activity Coaches</span>
                </h3>
                <a href="/find-tutor-nearby?type=coach" className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1">
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Grid of Coaches - 2 per row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {apiError ? (
                  <div className="col-span-full py-10 text-center text-red-500 font-bold text-xs uppercase tracking-widest bg-red-50 border border-dashed border-red-200 rounded-[2rem] p-4">
                    Error: {apiError}
                  </div>
                ) : isLoadingTutors ? (
                  <div className="col-span-full py-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] animate-pulse">
                    Loading Coaches...
                  </div>
                ) : displayCoaches.length === 0 ? (
                  <div className="col-span-full py-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] min-h-[300px] flex flex-col items-center justify-center p-6">
                    <Users className="w-8 h-8 text-slate-300 mb-2" />
                    <span className="text-slate-500 font-extrabold text-sm">No Coaches Registered</span>
                    <p className="text-[10px] text-slate-400 max-w-[200px] mt-1 font-medium leading-relaxed">
                      Activity tutors and coaches from your database will appear here.
                    </p>
                  </div>
                ) : (
                  displayCoaches.slice(0, 4).map((coach, idx) => (
                    <ShowcaseCard 
                      key={idx} 
                      item={coach} 
                      isCoach={true} 
                      handleOpenDemo={handleOpenDemo} 
                    />
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE AACHARYA? */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-center space-y-12">
          
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight">Why Choose AACHARYA?</h2>
            <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-[1200px] mx-auto">
            
            {/* Left Column: 3 Reasons */}
            <div className="space-y-6 flex flex-col justify-center">
              {/* Reason 1 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col lg:flex-row-reverse lg:text-right items-center lg:items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-100 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Trusted & Verified</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    All teachers & coaches are verified for quality and trust.
                  </p>
                </div>
              </div>

              {/* Reason 2 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col lg:flex-row-reverse lg:text-right items-center lg:items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center border border-pink-100 shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Trusted by Parents</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Loved by thousands of parents across your city.
                  </p>
                </div>
              </div>

              {/* Reason 3 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col lg:flex-row-reverse lg:text-right items-center lg:items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Safe & Secure</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Your information is protected and completely private.
                  </p>
                </div>
              </div>
            </div>

            {/* Center Column: Image */}
            <div className="flex justify-center items-center py-4 lg:py-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-xl opacity-20 group-hover:opacity-35 transition duration-1000 group-hover:duration-200" />
                <img 
                  src="/tutor-new-removebg-preview.png"
                  alt="Why Choose Aacharya"
                  className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right Column: 3 Reasons */}
            <div className="space-y-6 flex flex-col justify-center">
              {/* Reason 4 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col lg:flex-row lg:text-left items-center lg:items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center border border-orange-100 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Nearby Teachers</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Find the best teachers and coaches in your area.
                  </p>
                </div>
              </div>

              {/* Reason 5 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col lg:flex-row lg:text-left items-center lg:items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center border border-purple-100 shrink-0">
                  <Laptop className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Flexible Learning</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Choose Home Tutor, Online or At Tutor's Place.
                  </p>
                </div>
              </div>

              {/* Reason 6 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col lg:flex-row lg:text-left items-center lg:items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center border border-yellow-100 shrink-0">
                  <Star className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Better Results</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Personalized guidance that helps students excel.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. POPULAR ACTIVITIES & SUBJECTS */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-center space-y-12">
          
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight">Popular Activities & Subjects</h2>
            <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
            {POPULAR_ACTIVITIES.map((activity, idx) => {
              const IconComp = activity.icon;
              return (
                <button
                  key={idx}
                  onClick={() => selectPopularSearch(activity.name, ACTIVITY_SUBJECTS.includes(activity.name))}
                  className="relative h-36 rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer w-full text-left"
                >
                  {/* Background Image */}
                  <img 
                    src={activity.image} 
                    alt={activity.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent z-10" />
                  
                  {/* Content Container */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col space-y-1.5 text-white">
                    <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
                      <IconComp className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-extrabold text-[13px] tracking-tight leading-tight drop-shadow-md">
                      {activity.name}
                    </span>
                  </div>
                </button>
              );
            })}
            
            {/* "More" Card */}
            <button
              onClick={() => router.push("/find-tutor-nearby")}
              className="relative h-36 rounded-2xl overflow-hidden bg-slate-900 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer w-full text-left group border border-slate-800"
            >
              {/* Gradient Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/30 to-orange-600/30 opacity-40 group-hover:opacity-60 transition-opacity" />
              
              {/* Content Container */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col space-y-1.5 text-white">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-[13px] tracking-tight leading-tight">
                    Explore More
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold mt-0.5">
                    View all categories
                  </span>
                </div>
              </div>
            </button>
          </div>

        </div>
      </section>

      {/* 7. WHAT PARENTS & STUDENTS SAY */}
      <section className="py-16 md:py-20 bg-slate-50 border-b border-slate-100 font-sans">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-12">
          
          <div className="flex items-end justify-between border-b border-slate-200 pb-3">
            <div className="text-left space-y-1">
              <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight leading-none">What Parents & Students Say</h2>
              <div className="w-12 h-1 bg-amber-500 rounded-full" />
            </div>
            <a href="/reviews" className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 shrink-0">
              <span>View All Reviews</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((test, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow relative">
                
                {/* Custom Big Quote Icon */}
                <div className="absolute top-6 right-6 text-slate-100 pointer-events-none select-none font-serif text-8xl leading-none">
                  ”
                </div>

                <div className="space-y-4 font-sans">
                  
                  {/* Rating Stars */}
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed italic relative z-10">
                    "{test.text}"
                  </p>
                </div>

                {/* Avatar and name */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="relative w-10 h-10">
                    <div className="profile-fallback w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-extrabold text-sm border border-slate-100">
                      {test.name.charAt(0)}
                    </div>
                    <img
                      src={test.avatar}
                      alt={test.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-100 absolute inset-0 z-10"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="text-left font-sans">
                    <h5 className="font-extrabold text-sm text-slate-900 leading-tight">{test.name}</h5>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{test.role}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. ARE YOU A TEACHER OR COACH? CTA BANNER */}
      <section className="py-12 bg-white font-sans">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="bg-[#091a30] text-white rounded-[2.5rem] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 relative overflow-hidden shadow-2xl">
            
            {/* Background pattern */}
            <div className="absolute right-0 bottom-0 w-[40%] h-[150%] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] rotate-12 pointer-events-none" />

            <div className="space-y-4 max-w-xl text-left font-sans">
              <h3 className="text-2xl md:text-3.5xl font-black tracking-tight leading-tight">
                Are you a Teacher or Coach?
              </h3>
              <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
                Join AACHARYA and connect with thousands of students and parents looking for quality education and skill development.
              </p>
            </div>

            {/* Mid Feature Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 text-left border-y border-white/10 lg:border-y-0 py-6 lg:py-0">
              
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-2">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                </div>
                <h5 className="font-extrabold text-[11px] uppercase tracking-wider">Grow Your</h5>
                <p className="text-[10px] text-slate-400 font-bold">Teaching Career</p>
              </div>

              <div className="space-y-1">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                </div>
                <h5 className="font-extrabold text-[11px] uppercase tracking-wider">Get More</h5>
                <p className="text-[10px] text-slate-400 font-bold">Students Nearby</p>
              </div>

              <div className="space-y-1">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-2">
                  <Laptop className="w-4 h-4 text-amber-500" />
                </div>
                <h5 className="font-extrabold text-[11px] uppercase tracking-wider">Flexible</h5>
                <p className="text-[10px] text-slate-400 font-bold">Teaching Options</p>
              </div>

              <div className="space-y-1">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                </div>
                <h5 className="font-extrabold text-[11px] uppercase tracking-wider">Trusted</h5>
                <p className="text-[10px] text-slate-400 font-bold">Platform Support</p>
              </div>

            </div>

            <button
              onClick={() => router.push("/signup/teacher")}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-102 flex items-center gap-2 shrink-0 shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              <span>Join as a Teacher / Coach</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      </section>

      {/* Quick Demo Modal */}
      <QuickDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        defaultSubject={modalDefaultSubject}
        defaultTutor={modalDefaultTutor}
      />

      {/* Location Selection Modal */}
      <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 bg-white rounded-2xl shadow-2xl">
          <DialogHeader className="p-5 pb-0">
            <DialogTitle className="text-sm font-extrabold uppercase tracking-widest text-slate-900 flex items-center gap-2">
              Select Location
            </DialogTitle>
          </DialogHeader>
          <div className="p-5 pt-4">
            <MapLocationPicker
              initialAddress={searchLocation}
              onLocationSelect={(loc) => {
                setSearchLocation(loc.address);
                setIsLocationModalOpen(false);
              }}
              height="280px"
              compact={false}
            />
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
