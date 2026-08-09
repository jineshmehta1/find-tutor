"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Star, GraduationCap, Users, ShieldCheck, 
  Sparkles, BookOpen, Music, Code, Beaker, Swords, ArrowRight,
  CheckCircle, MessageSquare, Laptop, Home, School, DollarSign, HelpCircle,
  PhoneCall, Zap, Calculator, Award, ChevronDown, Check, Play, UserCheck, Calendar
} from "lucide-react";

import { FeeEstimator } from "@/components/FeeEstimator";
import { TutorSpotlight } from "@/components/TutorSpotlight";
import { ComparisonSection } from "@/components/ComparisonSection";
import { QuickDemoModal } from "@/components/QuickDemoModal";

const CATEGORIES = [
  {
    id: "school",
    title: "School Tuitions (CBSE, ICSE, State)",
    subtitle: "Class 1 to 12 - Math, Physics, Chemistry & Biology",
    subjects: [
      { name: "Mathematics", tag: "Class 1-12", icon: BookOpen },
      { name: "Physics", tag: "Class 9-12 Prep", icon: Beaker },
      { name: "Chemistry", tag: "Class 9-12 Prep", icon: Beaker },
      { name: "Biology", tag: "Class 9-12 Prep", icon: Beaker },
      { name: "English & Social", tag: "Class 1-10 Combo", icon: BookOpen }
    ],
    icon: BookOpen,
    badge: "Most Popular",
    iconColor: "text-blue-600",
    bg: "bg-blue-50/50"
  },
  {
    id: "coding",
    title: "Coding, Python & AI Skills",
    subtitle: "Future-ready tech courses for kids & young adults",
    subjects: [
      { name: "Python Programming", tag: "Beginner to Adv", icon: Code },
      { name: "AI & Robotics", tag: "Hands-on Kits", icon: Laptop },
      { name: "Web Development", tag: "HTML, CSS, JS", icon: Code },
      { name: "Scratch & Block Coding", tag: "Kids 6-12 Yrs", icon: Code },
      { name: "Java Programming", tag: "ICSE & Tech", icon: Code }
    ],
    icon: Code,
    badge: "High Demand",
    iconColor: "text-emerald-600",
    bg: "bg-emerald-50/50"
  },
  {
    id: "abacus",
    title: "Abacus & Mental Mathematics",
    subtitle: "Boost concentration, calculation speed & memory",
    subjects: [
      { name: "Abacus Foundation", tag: "Level 1-3", icon: Zap },
      { name: "Mental Math Speed", tag: "Level 4-8", icon: Zap },
      { name: "Vedic Mathematics", tag: "Speed Shortcuts", icon: BookOpen },
      { name: "Olympiad Math Prep", tag: "Competition Ready", icon: GraduationCap }
    ],
    icon: Zap,
    badge: "Speed Booster",
    iconColor: "text-amber-600",
    bg: "bg-amber-50/50"
  },
  {
    id: "chess",
    title: "Grandmaster Chess Coaching",
    subtitle: "Tactics, strategy & FIDE tournament training",
    subjects: [
      { name: "Beginner Chess", tag: "Rules & Tactics", icon: Swords },
      { name: "Intermediate Strategy", tag: "Openings & Endgames", icon: Swords },
      { name: "Advanced Tournament", tag: "FIDE Rating Prep", icon: Award }
    ],
    icon: Swords,
    badge: "FIDE Trainers",
    iconColor: "text-purple-600",
    bg: "bg-purple-50/50"
  },
  {
    id: "competitive",
    title: "Competitive Exams (JEE & NEET)",
    subtitle: "Top rank guidance by IIT & Medical graduates",
    subjects: [
      { name: "JEE Main & Advanced", tag: "Maths & Physics", icon: GraduationCap },
      { name: "NEET Medical Prep", tag: "Biology & Chemistry", icon: GraduationCap },
      { name: "NTSE & Olympiads", tag: "Class 8-10 Prep", icon: GraduationCap }
    ],
    icon: GraduationCap,
    badge: "Top Ranks",
    iconColor: "text-rose-600",
    bg: "bg-rose-50/50"
  }
];

const SUCCESS_STORIES = [
  {
    studentName: "Meera Krishnan",
    location: "Bhavanipuram, Vijayawada",
    subject: "Class 10 CBSE Physics & Math",
    tutorName: "Dr. Sandeep Kumar",
    improvement: "+22% Score Boost (72% -> 94%)",
    text: "The lead search was fast and straightforward! Within a couple of hours, we booked a free demo with Dr. Sandeep. His problem-solving techniques transformed my score in pre-boards.",
    rating: 5,
    mode: "Home Tuition"
  },
  {
    studentName: "Aditya Verma",
    location: "Vijayawada (Online 1-on-1)",
    subject: "Python & AI Robotics",
    tutorName: "Priya Sharma",
    improvement: "Built 3 Live Projects in 60 Days",
    text: "UrbanPro style lead system gave us quotes from top coders. Priya took a 30-min free demo class first. My son completed his first AI game within 2 months!",
    rating: 5,
    mode: "Live Online"
  },
  {
    studentName: "Kavya & Rohan's Parent",
    location: "Bhavanipuram, Vijayawada",
    subject: "Abacus & Mental Math Level 3",
    tutorName: "Master Ramesh Verma",
    improvement: "1st Rank in Regional Olympiad",
    text: "Finding a verified Abacus tutor at home was difficult until we tried Aacharya Academy. The fee is transparent, and progress reports keep us updated every fortnight.",
    rating: 5,
    mode: "Home Class"
  }
];

const FAQS = [
  {
    q: "How does Aacharya Academy connect me with tutors in Bhavanipuram?",
    a: "When you post a requirement or search for a subject, our system matches you with verified tutors near Bhavanipuram and Vijayawada. Tutors reach out with transparent fee quotes and offer a free 30-minute demo session."
  },
  {
    q: "Are demo classes really 100% free?",
    a: "Yes! Every listed tutor offers a complimentary 30-minute trial demo session so parent and student can assess compatibility, teaching methodology, and communication before committing."
  },
  {
    q: "Does Aacharya Academy charge any middleman commission from parents?",
    a: "No! We operate on a 0% hidden markup policy for parents. You negotiate and agree on billing directly with your assigned instructor."
  },
  {
    q: "How are tutor profiles physically verified?",
    a: "We verify identity documents (Aadhaar/PAN), academic qualification certificates, degree marksheets, and address proof before granting verified instructor status."
  },
  {
    q: "Can we switch between Home Tuition and Online Classes?",
    a: "Yes! You can choose home visits, live 1-on-1 online interactive classes, or center-based batches based on convenience."
  }
];

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Search States
  const [searchSubject, setSearchSubject] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Requirement Form States
  const [reqSubject, setReqSubject] = useState("");
  const [reqClass, setReqClass] = useState("");
  const [reqMode, setReqMode] = useState("");
  const [reqLocation, setReqLocation] = useState("");
  const [reqMessage, setReqMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category Active Tab State
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

  // FAQ Search & Accordion State
  const [faqQuery, setFaqQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Quick Demo Modal State
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [modalDefaultSubject, setModalDefaultSubject] = useState("");
  const [modalDefaultTutor, setModalDefaultTutor] = useState("");

  const handleOpenDemo = (tutorName = "", subjectName = "") => {
    setModalDefaultTutor(tutorName);
    setModalDefaultSubject(subjectName);
    setIsDemoModalOpen(true);
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchSubject) query.set("subject", searchSubject);
    if (searchLocation) query.set("location", searchLocation);
    router.push(`/find-tutor-nearby?${query.toString()}`);
  };

  const handlePostRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please sign up or log in to post your tutor requirements.");
      router.push("/signup");
      return;
    }
    if (!reqSubject || !reqLocation) {
      toast.error("Please fill out both Subject and Location fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: reqSubject,
          classLevel: reqClass,
          mode: reqMode,
          location: reqLocation,
          message: reqMessage || `Looking for ${reqSubject} tutor for ${reqClass || 'any level'}`
        }),
      });

      if (!res.ok) throw new Error("Failed to post");
      toast.success("Success! Matching tutors near you will reach out within 24 hours.");
      
      setReqSubject("");
      setReqClass("");
      setReqMode("");
      setReqLocation("");
      setReqMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Could not post requirement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeeEstimateSelect = (subject: string, level: string, mode: string) => {
    setReqSubject(subject);
    setReqClass(level);
    setReqMode(mode);
    setReqLocation("Bhavanipuram, Vijayawada");
    // Scroll smoothly to lead form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info("Pre-filled requirement form with your fee estimate parameters!");
  };

  const filteredFaqs = FAQS.filter(f => 
    f.q.toLowerCase().includes(faqQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(faqQuery.toLowerCase())
  );

  const selectedCategoryObj = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. HERO SECTION WITH GLASSMORPHISM & REAL-TIME MATCH WIDGET */}
      <section className="relative bg-gradient-premium text-white overflow-hidden pt-6 pb-12 lg:pt-8 lg:pb-16">
        {/* Animated ambient light globes */}
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT HERO COLUMN */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 lg:pr-4"
            >
              {/* Badge Pills */}
              <div className="inline-flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider rounded-full border border-white/15 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>India's Most Trusted Local & Online Tutor Finder</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider rounded-full border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Bhavanipuram, Vijayawada</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Connect with Top <span className="text-gradient-gold">Verified Tutors</span> & Trainers Near You
              </h1>
              
              <p className="text-base md:text-lg text-slate-300 font-medium leading-relaxed max-w-xl">
                Compare custom fee quotes, credentials, and parent reviews for Home Tuitions, Online 1-on-1 Classes, Abacus, Chess & JEE/NEET Prep.
              </p>
              
              {/* QUICK SEARCH WIDGET */}
              <form onSubmit={handleQuickSearch} className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-2 max-w-xl shadow-2xl">
                <div className="w-full flex items-center gap-2.5 px-3.5 py-2 text-white">
                  <Search className="w-5 h-5 text-amber-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Subject (e.g. Mathematics, Physics, Chess)"
                    value={searchSubject}
                    onChange={(e) => setSearchSubject(e.target.value)}
                    className="w-full bg-transparent focus:outline-none placeholder:text-slate-400 text-sm font-medium text-white"
                  />
                </div>
                <div className="w-full flex items-center gap-2.5 px-3.5 py-2 text-white sm:border-l border-white/15">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Location / Pincode"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full bg-transparent focus:outline-none placeholder:text-slate-400 text-sm font-medium text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-102 shrink-0 text-xs uppercase tracking-wider"
                >
                  Find Tutors
                </button>
              </form>

              {/* Quick Tag Pills */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-300 items-center pt-1">
                <span className="text-slate-400 text-[11px] font-bold">Popular:</span>
                {["Class 10 CBSE", "Class 12 Physics", "Python & AI", "Abacus Level 1", "Chess Coaching"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchSubject(tag);
                      setReqSubject(tag);
                    }}
                    className="px-3 py-1 bg-white/5 hover:bg-white/15 rounded-lg border border-white/10 transition-colors text-slate-200 text-[11px]"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-extrabold shrink-0">
                    4.9★
                  </div>
                  <div>
                    <div className="font-extrabold text-white">1,200+</div>
                    <div className="text-[10px] text-slate-400">Parent Reviews</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-extrabold shrink-0">
                    100%
                  </div>
                  <div>
                    <div className="font-extrabold text-white">ID Audited</div>
                    <div className="text-[10px] text-slate-400">Physical Check</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-extrabold shrink-0">
                    Free
                  </div>
                  <div>
                    <div className="font-extrabold text-white">30-Min Demo</div>
                    <div className="text-[10px] text-slate-400">No Commitment</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT HERO COLUMN: REQUIREMENT FORM */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="bg-white rounded-3xl p-6 md:p-8 text-slate-900 shadow-2xl border border-slate-100 relative">
                <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Matches in 24h
                </div>

                <h3 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight leading-none mb-1">
                  Post Tutor Request
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                  Get custom quotes from top tutors
                </p>

                <form onSubmit={handlePostRequirement} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      1. Subject or Course Required
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Class 10 Physics, Abacus, Python"
                      required
                      value={reqSubject}
                      onChange={(e) => setReqSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-sm font-semibold transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        2. Student Level
                      </label>
                      <select
                        value={reqClass}
                        onChange={(e) => setReqClass(e.target.value)}
                        className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-xs font-semibold transition-all"
                      >
                        <option value="">Select Level</option>
                        <option value="Class 1-5">Class 1-5</option>
                        <option value="Class 6-8">Class 6-8</option>
                        <option value="Class 9-10">Class 9-10</option>
                        <option value="Class 11-12">Class 11-12</option>
                        <option value="Undergraduate">Undergraduate / Tech</option>
                        <option value="Hobbyist / Adult">Hobbyist / Adult</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        3. Mode
                      </label>
                      <select
                        value={reqMode}
                        onChange={(e) => setReqMode(e.target.value)}
                        className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-xs font-semibold transition-all"
                      >
                        <option value="">Select Mode</option>
                        <option value="Home Tutor">Home Tuition (We Visit)</option>
                        <option value="Online Tutor">Online Class (1-on-1)</option>
                        <option value="At Centre">At Center / Institute</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      4. Pincode or City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bhavanipuram, Vijayawada"
                      required
                      value={reqLocation}
                      onChange={(e) => setReqLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-sm font-semibold transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      5. Learning Goals / Preferred Timing (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Mention exam dates, target score goals..."
                      value={reqMessage}
                      onChange={(e) => setReqMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-xs font-semibold resize-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary hover:bg-primary/95 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-lg shadow-primary/20 uppercase tracking-wider transition-all text-xs active:scale-98"
                  >
                    {isSubmitting ? "Posting Requirement..." : "Post Request & Match Tutors"}
                  </button>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verified Profiles
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenDemo()}
                      className="text-primary font-bold hover:underline"
                    >
                      Book 30-Min Free Demo Directly &rarr;
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. THREE-STEP PROCESS & TRUST BAR */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-extrabold uppercase tracking-wider">
              <span>Hassle-Free Experience</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-950 tracking-tight">
              Hire Top Tutors in 3 Simple Steps
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Zero risk, 100% transparent process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex gap-5 items-start p-6 rounded-3xl bg-slate-50/70 border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-slate-950 text-white font-black text-lg flex items-center justify-center rounded-2xl shrink-0 shadow-md">
                1
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-slate-950 mb-1">Post Learning Requirement</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Specify your subject, grade level, home or online preference, and goal timeline in seconds.
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="flex gap-5 items-start p-6 rounded-3xl bg-slate-50/70 border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-primary text-white font-black text-lg flex items-center justify-center rounded-2xl shrink-0 shadow-md">
                2
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-slate-950 mb-1">Receive & Compare Quotes</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Verified background-checked tutors near Bhavanipuram contact you directly with fee quotations.
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="flex gap-5 items-start p-6 rounded-3xl bg-slate-50/70 border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-amber-500 text-white font-black text-lg flex items-center justify-center rounded-2xl shrink-0 shadow-md">
                3
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-slate-950 mb-1">Book Free Demo & Hire</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Take a 30-minute trial session. Agree on schedule and lock in your favorite educator.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE TUITION FEE ESTIMATOR */}
      <section className="py-20 max-w-[1400px] mx-auto px-4 md:px-8">
        <FeeEstimator onSelectEstimate={handleFeeEstimateSelect} />
      </section>

      {/* 4. DYNAMIC SUBJECT & COURSE EXPLORER MATRIX */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Comprehensive Subject Catalog</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">
              Explore Popular <span className="text-gradient-gold">Learning Categories</span>
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Over 50+ specialized subjects taught daily by verified home and online instructors.
            </p>
          </div>

          {/* Interactive Category Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4">
            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-2.5 transition-all ${
                    isActive
                      ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20 scale-102"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? "text-amber-400" : cat.iconColor}`} />
                  <span>{cat.title.split("(")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Category Display Box */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategoryObj.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-50/80 rounded-3xl p-8 border border-slate-100 space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                    {selectedCategoryObj.badge}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-950 mt-2">
                    {selectedCategoryObj.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-1">
                    {selectedCategoryObj.subtitle}
                  </p>
                </div>

                <button
                  onClick={() => router.push(`/find-tutor-nearby?category=${encodeURIComponent(selectedCategoryObj.title)}`)}
                  className="px-6 py-3 bg-slate-950 hover:bg-primary text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shrink-0 self-start md:self-auto"
                >
                  <span>Find {selectedCategoryObj.title.split("(")[0]} Tutors</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Subjects Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCategoryObj.subjects.map((sub, sIdx) => {
                  const SubIcon = sub.icon;
                  return (
                    <div
                      key={sIdx}
                      className="bg-white rounded-2xl p-5 border border-slate-200/70 hover:border-primary/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="p-2.5 rounded-xl bg-slate-50 text-slate-800 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                            <SubIcon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {sub.tag}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-slate-950 text-base group-hover:text-primary transition-colors">
                            {sub.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                            Verified Instructors in Bhavanipuram & Online
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => handleOpenDemo("", sub.name)}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          Book Free Demo &rarr;
                        </button>
                        <button
                          onClick={() => router.push(`/find-tutor-nearby?subject=${encodeURIComponent(sub.name)}`)}
                          className="text-[11px] font-bold text-slate-400 hover:text-slate-900"
                        >
                          View Tutors
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* 5. VERIFIED TUTOR SPOTLIGHT */}
      <section className="py-20 max-w-[1400px] mx-auto px-4 md:px-8">
        <TutorSpotlight onBookDemo={handleOpenDemo} />
      </section>

      {/* 6. COMPARISON MATRIX SECTION */}
      <section className="py-20 max-w-[1400px] mx-auto px-4 md:px-8">
        <ComparisonSection />
      </section>

      {/* 7. STUDENT & PARENT SUCCESS TESTIMONIALS */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Star className="w-4 h-4 fill-current text-amber-400" />
              <span>Real Student Results</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Success Stories from <span className="text-gradient-gold">Bhavanipuram Parents</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Over thousands of verified learning connections facilitating grade improvement and skill building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUCCESS_STORIES.map((story, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-amber-500/50 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                      {story.improvement}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs font-medium leading-relaxed italic">
                    "{story.text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-extrabold text-white text-sm">{story.studentName}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{story.location}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-amber-400 font-bold text-[11px] block">{story.subject}</span>
                    <span className="text-[10px] text-slate-400">Tutor: {story.tutorName}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. SEARCHABLE FAQS ACCORDION */}
      <section className="py-20 max-w-[1400px] mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Everything you need to know about booking demo classes, fee structures, and tutor verification.
          </p>

          {/* FAQ Search Filter */}
          <div className="relative max-w-md mx-auto pt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-5" />
            <input
              type="text"
              placeholder="Search FAQs (e.g. demo, fees, verification)..."
              value={faqQuery}
              onChange={(e) => setFaqQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-primary shadow-sm"
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-extrabold text-slate-950 text-sm hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180 text-primary" : ""}`} />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 pb-5 text-xs text-slate-500 font-medium leading-relaxed border-t border-slate-100 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. DUAL CALL TO ACTION BANNER */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Student CTA */}
            <div className="space-y-4 border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-8">
              <span className="text-amber-400 text-xs font-black uppercase tracking-widest">For Students & Parents</span>
              <h3 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
                Ready to Boost Your Academic Score?
              </h3>
              <p className="text-xs md:text-sm font-medium text-slate-300">
                Book a 100% free 30-minute trial demo session with verified home or online tutors in Bhavanipuram & Vijayawada today.
              </p>
              <button
                onClick={() => handleOpenDemo()}
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-102 uppercase tracking-wider inline-flex items-center gap-2"
              >
                <span>Book Free Demo Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Tutor CTA */}
            <div className="space-y-4">
              <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">For Expert Educators</span>
              <h3 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
                Are You an Expert Tutor or Institute?
              </h3>
              <p className="text-xs md:text-sm font-medium text-slate-300">
                Join our premium network of verified educators. Receive local home tuition lead requests and online student opportunities daily.
              </p>
              <button
                onClick={() => router.push("/signup")}
                className="px-8 py-4 bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-lg transition-all hover:scale-102 uppercase tracking-wider inline-flex items-center gap-2"
              >
                <span>Sign Up as a Tutor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

 

      <QuickDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        defaultSubject={modalDefaultSubject}
        defaultTutor={modalDefaultTutor}
      />

    </div>
  );
}
