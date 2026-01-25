"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  CheckCircle2, 
  Users, 
  Trophy, 
  Star, 
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
  PlayCircle
} from "lucide-react";

export default function BookDemoPage() {
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    email: "",
    phone: "",
    age: "",
    course: "Chess",
    experience: "beginner",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          studentName: "",
          parentName: "",
          email: "",
          phone: "",
          age: "",
          course: "Chess",
          experience: "beginner",
        });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-100 pb-20">
      <section className="relative pt-12 pb-20 lg:pt-11 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT CONTENT */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  Limited Free Slots Available
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.15]">
                Unlock Your Child's <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
                  Genius Potential.
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Join 5,000+ students mastering Chess and Academics. 
                Book a <strong>free 30-minute assessment</strong> session today.
              </p>
              
              <div className="space-y-3">
                {["1-on-1 Skill Assessment", "Personalized Roadmap", "Live Interaction"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FORM CARD */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 md:p-8">
                <div className="text-center mb-6">
                   <h3 className="text-2xl font-bold text-slate-900">Book Free Demo</h3>
                   <p className="text-slate-500 text-sm mt-1">Directly to our coaching team.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} required placeholder="Student Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                    <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} required placeholder="Parent Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                  </div>

                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email Address" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone Number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                  <input type="number" name="age" value={formData.age} onChange={handleChange} required placeholder="Student Age" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />

                  <div className="grid grid-cols-2 gap-4">
                    <select name="course" value={formData.course} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                      <option value="Chess">Chess</option>
                      <option value="Robotics">Robotics</option>
                      <option value="Abacus">Abacus</option>
                    </select>
                    <select name="experience" value={formData.experience} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  {submitStatus === "success" && (
                    <div className="p-3 bg-green-50 text-green-700 text-sm font-bold rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Email sent! We'll contact you shortly.
                    </div>
                  )}
                  {submitStatus === "error" && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm font-bold rounded-lg">
                      Failed to send. Please try again or WhatsApp us.
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? "Sending..." : <>Confirm Booking <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}