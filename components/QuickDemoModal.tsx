"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle, Calendar, User, Phone, BookOpen, MapPin } from "lucide-react";
import { toast } from "sonner";

interface QuickDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
  defaultTutor?: string;
}

export function QuickDemoModal({ isOpen, onClose, defaultSubject = "", defaultTutor = "" }: QuickDemoModalProps) {
  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState(defaultSubject || "");
  const [grade, setGrade] = useState("");
  const [preferredMode, setPreferredMode] = useState("Home Tuition");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync defaultSubject if updated
  React.useEffect(() => {
    if (defaultSubject) setSubject(defaultSubject);
  }, [defaultSubject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !phone || !subject) {
      toast.error("Please fill in your Name, Phone Number, and Subject.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `${subject} ${defaultTutor ? `(Prefers ${defaultTutor})` : ""}`,
          classLevel: grade || "General",
          mode: preferredMode,
          location: location || "Bhavanipuram / Online",
          message: `Free Demo Request from Homepage for ${studentName}. Contact: ${phone}`
        }),
      });

      if (!res.ok) throw new Error("Failed to send demo request");

      toast.success("Success! Free Demo Request received. Our academic advisor will call you within 2 hours.");
      setStudentName("");
      setPhone("");
      setSubject("");
      setGrade("");
      setLocation("");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Could not schedule demo. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 z-10 overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Free Demo Session</span>
              </div>
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                Book a Free Demo Class
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {defaultTutor ? `Request a 30-min trial session with ${defaultTutor}` : "Lock in a trial session with verified expert tutors"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Parent / Student Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Mobile Number (For Call & WhatsApp)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Subject Required
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physics, Coding"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Class / Grade
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-primary focus:bg-white transition-all"
                  >
                    <option value="">Select Level</option>
                    <option value="Class 1-5">Class 1-5</option>
                    <option value="Class 6-8">Class 6-8</option>
                    <option value="Class 9-10">Class 9-10</option>
                    <option value="Class 11-12">Class 11-12</option>
                    <option value="Competitive/Tech">Competitive / Tech</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Preferred Mode
                  </label>
                  <select
                    value={preferredMode}
                    onChange={(e) => setPreferredMode(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-primary focus:bg-white transition-all"
                  >
                    <option value="Home Tuition">At Student Home</option>
                    <option value="Online 1-on-1">Online mode</option>
                    <option value="Center">At Teacher Home</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    City / Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bhavanipuram"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-lg shadow-primary/20 text-xs uppercase tracking-wider transition-all mt-2 active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? "Confirming Booking..." : "Confirm Free Demo Session"}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-semibold pt-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> No Payment Required for Trial Demo
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
