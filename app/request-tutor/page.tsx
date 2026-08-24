"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Star, Users, Zap, BookOpen, Clock, HeartHandshake,
  MapPin, Loader2, Phone, Mail, User, GraduationCap, Send
} from "lucide-react";
import { toast } from "sonner";

export default function RequestTutorPage() {
  const router = useRouter();

  // Form States
  const [formData, setFormData] = useState({
    subject: "",
    classLevel: "",
    mode: "Home Tuition",
    location: "",
    parentName: "",
    studentName: "",
    email: "",
    phone: "",
    goals: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const addr = data?.address;
          const locationName = addr 
            ? [addr.suburb || addr.neighbourhood || addr.residential, addr.city || addr.town || addr.state_district].filter(Boolean).join(", ") || data.display_name
            : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setFormData(prev => ({ ...prev, location: locationName }));
          toast.success("Location detected successfully!");
        } catch {
          setFormData(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          toast.success("GPS Location detected!");
        } finally {
          setDetectingLocation(false);
        }
      },
      (error) => {
        console.error(error);
        toast.error("Unable to retrieve location. Please type manually.");
        setDetectingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.parentName || !formData.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    // Map to /api/send schema
    const payload = {
      parentName: formData.parentName,
      studentName: formData.studentName || formData.parentName,
      email: formData.email,
      phone: formData.phone,
      course: formData.subject,
      experience: formData.classLevel || "General",
      age: formData.mode, // Send teaching mode in place of age/experience
      message: `Location: ${formData.location}. Learning Goals: ${formData.goals || "Not specified"}`
    };

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStatus("success");
        toast.success("Tutor Request Submitted! Our coordinator will call you within 2 hours.");
        setFormData({
          subject: "",
          classLevel: "",
          mode: "Home Tuition",
          location: "",
          parentName: "",
          studentName: "",
          email: "",
          phone: "",
          goals: ""
        });
        setTimeout(() => setSubmitStatus(null), 5000);
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
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-6 sm:pt-10">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* HERO BANNER */}
        <div className="bg-[#ffb800] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden mb-8">
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
          
          {/* LEFT SIDE PANEL: Trust Guarantees & Features */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
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
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">Complimentary 30-Min Trial Demo</h4>
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

          {/* RIGHT SIDE FORM CARD */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Post Your Requirement</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Get matched with top tutors nearby within 2 hours</p>
                </div>
                <div className="hidden sm:flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-extrabold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Free Trial
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    1. Subject or Skill Required *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Mathematics, Physics, Abacus, Chess, Coding"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ffb800]/20 focus:border-[#ffb800] focus:bg-white text-xs font-bold transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Class Level */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      2. Grade / Class Level *
                    </label>
                    <select
                      name="classLevel"
                      value={formData.classLevel}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ffb800]/20 focus:border-[#ffb800] focus:bg-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <option value="">Select Level</option>
                      <option value="Class 1-5">Class 1-5</option>
                      <option value="Class 6-8">Class 6-8</option>
                      <option value="Class 9-10">Class 9-10</option>
                      <option value="Class 11-12">Class 11-12</option>
                      <option value="JEE/NEET Prep">JEE / NEET Prep</option>
                      <option value="Tech & Coding">Tech & Coding</option>
                      <option value="Chess & Abacus">Chess & Abacus</option>
                    </select>
                  </div>

                  {/* Mode */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      3. Tuition Mode *
                    </label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ffb800]/20 focus:border-[#ffb800] focus:bg-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <option value="Home Tuition">At Student Home</option>
                      <option value="Online Tutor">Online mode</option>
                      <option value="At Centre">At Teacher Home</option>
                    </select>
                  </div>
                </div>

                {/* Location with Auto Detect GPS */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      4. Location / Pincode *
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={detectingLocation}
                      className="text-[11px] font-bold text-[#ffb800] hover:underline flex items-center gap-1"
                    >
                      {detectingLocation ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Detecting GPS...</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>Locate Me</span>
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Bhavanipuram, Vijayawada"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ffb800]/20 focus:border-[#ffb800] focus:bg-white text-xs font-bold transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Parent Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      5. Parent / Contact Name *
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="e.g. Rajesh Kumar"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ffb800]/20 focus:border-[#ffb800] focus:bg-white text-xs font-bold transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      6. Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 98765 43210"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ffb800]/20 focus:border-[#ffb800] focus:bg-white text-xs font-bold transition-all"
                    />
                  </div>
                </div>

                {/* Additional Goals */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    7. Learning Goals & Timing Notes (Optional)
                  </label>
                  <textarea
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Specify preferred timing, days per week, or academic goals..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ffb800]/20 focus:border-[#ffb800] focus:bg-white text-xs font-medium transition-all"
                  />
                </div>

                {submitStatus === "success" && (
                  <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Request received! We will contact you within 2 hours.
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
                  className="w-full bg-[#ffb800] hover:bg-[#ffa000] text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-xs uppercase tracking-wider"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
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

        </div>
      </div>
    </div>
  );
}