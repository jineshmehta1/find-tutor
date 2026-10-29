"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Star, Users, Zap, BookOpen, Clock, HeartHandshake,
  MapPin, Loader2, Phone, Mail, User, GraduationCap, Send, Search, X, Check, Brain, Palette, Music, Cpu, MessageSquare,
  Lock, LogIn, UserPlus
} from "lucide-react";
import { toast } from "sonner";
import { smartReverseGeocode, getBrowserCoordinates } from "@/lib/geoUtils";
import StructuredAddressForm from "@/components/ui/DynamicStructuredAddressForm";
import { 
  ALL_STANDARD_SUBJECTS, 
  ALL_SUBJECT_SECTIONS 
} from "@/lib/classConstants";

export default function RequestTutorPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    subject: "",
    classLevel: "",
    mode: "Home Tuition",
    location: "",
    parentName: "",
    studentName: "",
    phone: "",
    email: "",
    goals: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);
  const subjectContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (subjectContainerRef.current && !subjectContainerRef.current.contains(event.target as Node)) {
        setShowSubjectSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prefill details if user is signed in as student
  useEffect(() => {
    if (session?.user) {
      if (session.user.role === "STUDENT") {
        setFormData(prev => ({
          ...prev,
          parentName: prev.parentName || session.user.name || "",
          email: prev.email || session.user.email || "",
        }));
      } else {
        // For teachers/admins, keep parentName blank so teacher name is not used as student/parent
        setFormData(prev => ({
          ...prev,
          email: prev.email || session.user.email || "",
        }));
      }
    }
  }, [session]);

  // Restore saved draft from session storage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("pending_tutor_request");
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
        if (session?.user) {
          toast.success("Welcome back! Your saved requirement details were restored.");
        }
      }
    } catch (err) {
      console.error("Error restoring pending tutor request:", err);
    }
  }, [session]);

  const POPULAR_SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology",
    "Spoken English", "Chess", "Coding", "Abacus",
    "Keyboard", "Drawing"
  ];

  const filteredSubjects = useMemo(() => {
    const query = formData.subject.trim().toLowerCase();
    if (!query) {
      return ALL_STANDARD_SUBJECTS;
    }
    return ALL_STANDARD_SUBJECTS.filter(s => 
      s.toLowerCase().includes(query)
    );
  }, [formData.subject]);

  const getSubjectMeta = (subjectName: string) => {
    for (const group of ALL_SUBJECT_SECTIONS) {
      if (group.subjects.some(s => s.toLowerCase() === subjectName.toLowerCase())) {
        return {
          category: group.name,
          badge: group.badge,
          iconName: group.iconName,
        };
      }
    }
    return {
      category: "Academic & Skill",
      badge: "Curriculum",
      iconName: "book",
    };
  };

  const renderSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case "brain": return <Brain className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case "palette": return <Palette className="w-3.5 h-3.5 text-pink-500 shrink-0" />;
      case "music": return <Music className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
      case "sparkles": return <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />;
      case "message": return <MessageSquare className="w-3.5 h-3.5 text-sky-500 shrink-0" />;
      case "cpu": return <Cpu className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      default: return <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
    }
  };

  const handleSelectSubject = (selectedSubject: string) => {
    setFormData(prev => ({ ...prev, subject: selectedSubject }));
    setShowSubjectSuggestions(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    try {
      const { latitude, longitude } = await getBrowserCoordinates(8000);
      const locationName = await smartReverseGeocode(latitude, longitude);
      setFormData(prev => ({ ...prev, location: locationName }));
      toast.success(`Location detected: ${locationName}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Unable to retrieve location. Please type manually.");
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.parentName || !formData.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Require signup or login
    if (!session) {
      try {
        sessionStorage.setItem("pending_tutor_request", JSON.stringify(formData));
      } catch (err) {}
      setShowAuthModal(true);
      toast.error("Account required. Please sign up or log in to post your requirement.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    // Map to /api/send schema
    const contactHeader = formData.studentName && formData.studentName !== formData.parentName
      ? `Parent: ${formData.parentName} | Student: ${formData.studentName}`
      : `Parent / Contact: ${formData.parentName}`;
    const payload = {
      parentName: formData.parentName,
      studentName: formData.studentName || formData.parentName,
      email: formData.email,
      phone: formData.phone,
      course: formData.subject,
      experience: formData.classLevel || "General",
      age: formData.mode, // Send teaching mode in place of age/experience
      message: `${contactHeader} | Location: ${formData.location}. Learning Goals: ${formData.goals || "Not specified"}`
    };

    try {
      // 1. Create lead record in database linked to student
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: formData.location,
          subject: formData.subject,
          classLevel: formData.classLevel || "General",
          mode: formData.mode || "Home Tuition",
          message: payload.message,
          name: formData.parentName,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      // 2. Dispatch notification email
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStatus("success");
        try {
          sessionStorage.removeItem("pending_tutor_request");
        } catch (err) {}
        toast.success("Tutor Request Submitted! Our coordinator will call you within 2 hours.");
        setFormData({
          subject: "",
          classLevel: "",
          mode: "Home Tuition",
          location: "",
          parentName: session?.user?.name || "",
          studentName: "",
          email: session?.user?.email || "",
          phone: "",
          goals: ""
        });
        setTimeout(() => setSubmitStatus(null), 8000);
      } else {
        setSubmitStatus("error");
        toast.error("Failed to send request. Please try again.");
      }
    } catch (error) {
      setSubmitStatus("error");
      toast.error("Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 font-sans pb-20 pt-6 sm:pt-10">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* HERO BANNER */}
        <div className="bg-[#ffb800] p-5 sm:p-8 md:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold tracking-wider uppercase border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Aacharya Learning Network</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Request a Private Home or Online Tutor
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
              We match your child with verified local instructors for CBSE, ICSE, JEE/NEET, Coding, Abacus & Chess. Zero agency markup cuts.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* PRIMARY FORM CARD (Given Top Priority) */}
          <div className="lg:col-span-7">
            <div className="bg-gradient-to-b from-[#fffef8] via-amber-50/40 to-[#fffdf5] rounded-3xl p-4 sm:p-8 md:p-10 shadow-2xl border-2 border-amber-200/90 relative">
              <div className="flex items-center justify-between border-b border-amber-200/70 pb-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider mb-2 border border-amber-300">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Tutor Requirement Form</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Post Your Requirement</h3>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">Get matched with top tutors nearby within 2 hours</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Free Matching
                </div>
              </div>

              {/* AUTHENTICATION STATUS BANNER */}
              {session?.user ? (
                <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">
                        Posting as <span className="text-emerald-700 font-extrabold">{session.user.name || session.user.email}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">Verified Account • Requirement will be linked to your student dashboard</p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider shrink-0">
                    Logged In
                  </span>
                </div>
              ) : (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                        Account Required to Post Requirements
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900">
                          Signup Needed
                        </span>
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
                        Please sign in or create a student account so verified tutors can connect with you directly.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          sessionStorage.setItem("pending_tutor_request", JSON.stringify(formData));
                        } catch (err) {}
                        router.push("/login?callbackUrl=/request-tutor");
                      }}
                      className="flex-1 sm:flex-none text-center px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs transition-all shadow-xs cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          sessionStorage.setItem("pending_tutor_request", JSON.stringify(formData));
                        } catch (err) {}
                        router.push("/signup/student?redirect=/request-tutor");
                      }}
                      className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl bg-[#ffb800] hover:bg-[#ffa000] text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Sign Up</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Subject with Auto-suggestions */}
                <div ref={subjectContainerRef} className="relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-[#ffb800] text-slate-950 font-black text-[10px] inline-flex items-center justify-center shrink-0 shadow-2xs">1</span>
                      <span>Subject or Skill Required</span>
                      <span className="text-amber-600 font-black">*</span>
                    </label>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                      Academics & Activities
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={(e) => {
                        handleChange(e);
                        setShowSubjectSuggestions(true);
                      }}
                      onFocus={() => setShowSubjectSuggestions(true)}
                      placeholder="Type or select (e.g. Chess, Coding, Mathematics, Music, Spoken English)"
                      required
                      autoComplete="off"
                      className="w-full pl-4 pr-10 py-3 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-amber-500/15 focus:border-amber-500 text-xs font-bold text-slate-900 placeholder:text-slate-400 shadow-xs transition-all"
                    />

                    {formData.subject ? (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, subject: "" }));
                          setShowSubjectSuggestions(true);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        title="Clear subject"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    )}
                  </div>

                  {/* Quick Select Popular Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {POPULAR_SUBJECTS.map((pop) => (
                      <button
                        key={pop}
                        type="button"
                        onClick={() => handleSelectSubject(pop)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                          formData.subject.toLowerCase() === pop.toLowerCase()
                            ? "bg-[#ffb800] text-slate-950 border-amber-500 shadow-xs font-black"
                            : "bg-white hover:bg-amber-100 hover:border-amber-300 text-slate-700 border-slate-200 shadow-2xs font-bold"
                        }`}
                      >
                        {pop === "Chess" ? "♟️ " : pop === "Coding" ? "💻 " : pop === "Keyboard" ? "🎹 " : ""}
                        {pop}
                      </button>
                    ))}
                  </div>

                  {/* Auto-suggest dropdown */}
                  {showSubjectSuggestions && (
                    <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-72 overflow-y-auto p-2 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-2.5 py-1.5 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/80 rounded-xl mb-1">
                        <span>
                          {formData.subject.trim() 
                            ? `Matching Subjects & Activities (${filteredSubjects.length})` 
                            : "All Available Subjects & Activities"}
                        </span>
                        <span className="text-amber-600 font-extrabold">Tap to select</span>
                      </div>

                      <div className="space-y-0.5 pt-1">
                        {filteredSubjects.length > 0 ? (
                          filteredSubjects.slice(0, 30).map((subj) => {
                            const meta = getSubjectMeta(subj);
                            const isSelected = formData.subject.toLowerCase() === subj.toLowerCase();
                            return (
                              <button
                                key={subj}
                                type="button"
                                onClick={() => handleSelectSubject(subj)}
                                className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                                  isSelected 
                                    ? "bg-amber-500 text-slate-950 font-black" 
                                    : "hover:bg-amber-50 text-slate-800 hover:text-slate-950"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {renderSubjectIcon(meta.iconName)}
                                  <span className="truncate">{subj}</span>
                                </div>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 ${
                                  isSelected 
                                    ? "bg-slate-950 text-amber-300" 
                                    : "bg-slate-100 text-slate-500"
                                }`}>
                                  {meta.category}
                                </span>
                              </button>
                            );
                          })
                        ) : (
                          <div className="p-3 text-center">
                            <p className="text-xs text-slate-500 font-medium">No exact match in dictionary.</p>
                            <button
                              type="button"
                              onClick={() => setShowSubjectSuggestions(false)}
                              className="mt-2 text-xs font-black text-amber-600 hover:underline cursor-pointer"
                            >
                              Use custom: &quot;{formData.subject}&quot;
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Class Level */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-[#ffb800] text-slate-950 font-black text-[10px] inline-flex items-center justify-center shrink-0 shadow-2xs">2</span>
                      <span>Grade / Class Level</span>
                      <span className="text-amber-600 font-black">*</span>
                    </label>
                    <select
                      name="classLevel"
                      value={formData.classLevel}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-3 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-amber-500/15 focus:border-amber-500 text-xs font-bold text-slate-900 shadow-xs transition-all cursor-pointer"
                    >
                      <option value="">Select Level</option>
                      <option value="Nursery">Nursery</option>
                      <option value="LKG">LKG</option>
                      <option value="UKG">UKG</option>
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

                  {/* Mode */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-[#ffb800] text-slate-950 font-black text-[10px] inline-flex items-center justify-center shrink-0 shadow-2xs">3</span>
                      <span>Tuition Mode</span>
                      <span className="text-amber-600 font-black">*</span>
                    </label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-3 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-amber-500/15 focus:border-amber-500 text-xs font-bold text-slate-900 shadow-xs transition-all cursor-pointer"
                    >
                      <option value="Home Tuition">At Student Home</option>
                      <option value="Online Tutor">Online mode</option>
                      <option value="At Centre">At Teacher Home</option>
                    </select>
                  </div>
                </div>

                {/* Location with Map & Area Selection (Street/Area Only) */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-[#ffb800] text-slate-950 font-black text-[10px] inline-flex items-center justify-center shrink-0 shadow-2xs">4</span>
                    <span>Location & Area (Street / Area / Landmark)</span>
                    <span className="text-amber-600 font-black">*</span>
                  </label>
                  <StructuredAddressForm
                    onAddressChange={(data) => setFormData(prev => ({ ...prev, location: data.fullAddress }))}
                    initialAddress={formData.location}
                    accentColor="amber"
                    height="200px"
                    required={true}
                    hideDoorAndHouse={true}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 5. Parent Name */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-[#ffb800] text-slate-950 font-black text-[10px] inline-flex items-center justify-center shrink-0 shadow-2xs">5</span>
                      <span>Parent / Contact Name</span>
                      <span className="text-amber-600 font-black">*</span>
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="e.g. Rajesh Kumar"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-amber-500/15 focus:border-amber-500 text-xs font-bold text-slate-900 placeholder:text-slate-400 shadow-xs transition-all"
                    />
                  </div>

                  {/* 6. Phone */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-[#ffb800] text-slate-950 font-black text-[10px] inline-flex items-center justify-center shrink-0 shadow-2xs">6</span>
                      <span>Mobile Number</span>
                      <span className="text-amber-600 font-black">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 98765 43210"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-amber-500/15 focus:border-amber-500 text-xs font-bold text-slate-900 placeholder:text-slate-400 shadow-xs transition-all"
                    />
                  </div>
                </div>

                {/* 7. Additional Goals */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 font-black text-[10px] inline-flex items-center justify-center shrink-0">7</span>
                    <span>Learning Goals & Timing Notes (Optional)</span>
                  </label>
                  <textarea
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Specify preferred timing, days per week, or academic goals..."
                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-amber-500/15 focus:border-amber-500 text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-xs transition-all"
                  />
                </div>

                {submitStatus === "success" && (
                  <div className="p-4 bg-emerald-50 text-emerald-900 text-xs font-bold rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-emerald-200">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-black text-slate-900">Request received successfully!</p>
                        <p className="text-[11px] text-emerald-700 font-medium">Our coordinator will call you within 2 hours. You can also view matching tutors in your dashboard.</p>
                      </div>
                    </div>
                    <Link
                      href="/student/leads"
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[11px] shrink-0 transition-all flex items-center gap-1 shadow-xs"
                    >
                      <span>View Leads</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                    Submission failed. Please check connection and try again.
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#ffb800] hover:bg-[#ffa000] text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-xs uppercase tracking-wider cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : !session ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Sign In / Sign Up to Submit Requirement &rarr;</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Request & Get Matched &rarr;</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* TRUST GUARANTEES & FEATURES (Brought Down / Secondary) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-5 sm:p-8 rounded-3xl border-2 border-slate-200/90 shadow-md space-y-6">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Why Parents Choose Aacharya</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">Physically Audited Credentials</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                      Identity proofs and academic marksheets are audited in person by our Bhavanipuram center team.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#ffb800] flex items-center justify-center font-bold shrink-0">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">0% Commission Cut</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                      No middleman agency fees. You directly settle tuition billing with your assigned instructor.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">Direct Contact with Tutors</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                      Assess the tutor&apos;s teaching style and student compatibility before scheduling monthly slots.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Helpline Info Card */}
            <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                <Phone className="w-3 h-3" />
                <span>Instant Support</span>
              </div>
              <h4 className="text-base font-black text-white">Prefer to speak directly?</h4>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Call our Vijayawada desk at <strong className="text-white">+91 80741 03400</strong> for instant tutor matching within 2 hours.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* AUTH REQUIRED MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-5 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Account Required</h3>
              <p className="text-xs text-slate-500 font-medium">
                To post a tuition requirement and get matched with verified tutors, you must sign up or sign in.
              </p>
            </div>

            {/* Preserved details indicator */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-700">Requirement Preserved:</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Draft Saved
                </span>
              </div>
              <p className="text-slate-600 font-bold truncate">
                {formData.subject || "Subject not picked"} • {formData.classLevel || "General"} • {formData.mode}
              </p>
              {formData.location && (
                <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0 text-amber-500" />
                  <span>{formData.location}</span>
                </p>
              )}
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.setItem("pending_tutor_request", JSON.stringify(formData));
                  } catch (err) {}
                  router.push("/signup/student?redirect=/request-tutor");
                }}
                className="w-full py-3.5 bg-[#ffb800] hover:bg-[#ffa000] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Student / Parent Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.setItem("pending_tutor_request", JSON.stringify(formData));
                  } catch (err) {}
                  router.push("/login?callbackUrl=/request-tutor");
                }}
                className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-amber-500" />
                <span>Sign In to Existing Account</span>
              </button>
            </div>

            <p className="text-center text-[10px] text-slate-400 font-semibold">
              ✨ Your requirement details are automatically restored right after you sign in.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}