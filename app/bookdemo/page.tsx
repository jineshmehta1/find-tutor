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
  // Form State
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    email: "",
    phone: "",
    age: "",
    course: "Chess", // Added course selection
    experience: "beginner",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  // Form Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbwPBxWXpnQ4ywqrdfmKvfFi7g5Uu6hjmaTFVDE5EiMI0YEyqjRNTCxionf65Q5Zqlg/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, timestamp: new Date().toISOString() }),
        }
      );
      setSubmitStatus("success");
      // Optional: Reset form after delay
      setTimeout(() => {
         setSubmitStatus(null);
         setFormData({
            studentName: "",
            parentName: "",
            email: "",
            phone: "",
            age: "",
            course: "Chess",
            experience: "beginner",
          });
      }, 3000);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-100">
      
      {/* =======================
          HERO SECTION (Split Layout)
         ======================= */}
      <section className="relative pt-12 pb-20 lg:pt-11 lg:pb-32 overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-50/50 -skew-x-12 translate-x-20 z-0 pointer-events-none"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100/40 rounded-full blur-[80px] z-0 pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* --- LEFT COLUMN: Value Proposition --- */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm animate-fade-in-up">
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
                Join 5,000+ students mastering Chess, Robotics, and Academics. 
                Book a <strong>free 30-minute assessment</strong> session with our expert mentors today.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row gap-6 border-t border-slate-200 pt-8">
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                           <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Student" className="w-full h-full object-cover" />
                        </div>
                      ))}
                   </div>
                   <div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-slate-900">4.9/5</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">from 2000+ Parents</p>
                   </div>
                </div>
                
                <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>

                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-amber-600" />
                   </div>
                   <div>
                      <p className="font-bold text-slate-900">National Winners</p>
                      <p className="text-xs text-slate-500 font-medium">Produced yearly</p>
                   </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {[
                  "1-on-1 Skill Assessment",
                  "Personalized Learning Roadmap",
                  "Live Interaction with Coaches"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* --- RIGHT COLUMN: Embedded Form --- */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8 relative overflow-hidden">
                
                {/* Form Header */}
                <div className="text-center mb-6">
                   <h3 className="text-2xl font-bold text-slate-900">Book Free Demo</h3>
                   <p className="text-slate-500 text-sm mt-1">No credit card required. 100% Free.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Student & Parent Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-700 uppercase">Student Name</label>
                       <input 
                         type="text" 
                         name="studentName"
                         value={formData.studentName}
                         onChange={handleChange}
                         required
                         placeholder="Enter Name"
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm font-medium"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-700 uppercase">Parent Name</label>
                       <input 
                         type="text" 
                         name="parentName"
                         value={formData.parentName}
                         onChange={handleChange}
                         required
                         placeholder="Enter Name"
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm font-medium"
                       />
                    </div>
                  </div>

                  {/* Contacts */}
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
                     <input 
                       type="email" 
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       required
                       placeholder="parent@example.com"
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm font-medium"
                     />
                  </div>

                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-700 uppercase">Phone Number</label>
                     <input 
                       type="tel" 
                       name="phone"
                       value={formData.phone}
                       onChange={handleChange}
                       required
                       placeholder="+91 8074103400"
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm font-medium"
                     />
                  </div>

                  {/* Course Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-700 uppercase">Interested In</label>
                       <select 
                         name="course"
                         value={formData.course}
                         onChange={handleChange}
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm font-medium text-slate-700"
                       >
                         <option value="Chess">Chess</option>
                         <option value="Robotics">Robotics</option>
                         <option value="Abacus">Abacus</option>
                         <option value="Academics">Academics</option>
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-700 uppercase">Skill Level</label>
                       <select 
                         name="experience"
                         value={formData.experience}
                         onChange={handleChange}
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm font-medium text-slate-700"
                       >
                         <option value="beginner">Beginner</option>
                         <option value="intermediate">Intermediate</option>
                         <option value="advanced">Advanced</option>
                       </select>
                    </div>
                  </div>

                  {/* Messages */}
                  {submitStatus === "success" && (
                    <div className="p-3 bg-green-50 text-green-700 text-sm font-bold rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Request Received! We'll call you shortly.
                    </div>
                  )}
                  {submitStatus === "error" && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm font-bold rounded-lg">
                      Something went wrong. Please try again.
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {isSubmitting ? (
                      "Booking Slot..."
                    ) : (
                      <>
                        Confirm Free Booking <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-slate-400 mt-4">
                    By booking, you agree to our Terms & Privacy Policy.
                  </p>

                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =======================
          PROCESS SECTION (What Happens Next?)
         ======================= */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
              <p className="text-slate-500">Your journey to excellence starts in 3 simple steps</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 z-0"></div>

              {[
                { 
                  icon: <Calendar className="w-6 h-6" />, 
                  title: "Book a Slot", 
                  desc: "Fill the form and choose your preferred learning area." 
                },
                { 
                  icon: <Users className="w-6 h-6" />, 
                  title: "Meet the Expert", 
                  desc: "Join a 30-min live session for skill assessment." 
                },
                { 
                  icon: <PlayCircle className="w-6 h-6" />, 
                  title: "Start Journey", 
                  desc: "Get a customized roadmap and start your first class." 
                }
              ].map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                   <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-50 shadow-xl flex items-center justify-center mb-6 group hover:scale-110 transition-transform duration-300">
                      <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-inner">
                         {step.icon}
                      </div>
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                   <p className="text-slate-500 text-sm px-4">{step.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* =======================
          REASSURANCE SECTION
         ======================= */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-4">Why is the Demo Free?</h3>
                 <p className="text-slate-600 mb-6 leading-relaxed">
                    We believe in our teaching quality. The demo session is an opportunity for us to understand your child's current level and for you to experience our pedagogy risk-free.
                 </p>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                       <ShieldCheck className="w-5 h-5 text-green-500" /> No Obligation
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                       <ShieldCheck className="w-5 h-5 text-green-500" /> Zero Cost
                    </div>
                 </div>
              </div>
              <div className="flex justify-center">
                 <div className="relative w-full max-w-sm bg-slate-900 text-white p-6 rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-2xl font-bold">A</div>
                       <div>
                          <p className="font-bold">Aacharya Promise</p>
                          <p className="text-xs text-slate-400">Official Guarantee</p>
                       </div>
                    </div>
                    <p className="text-sm text-slate-300 italic">
                       "If you don't find value in our assessment, we will provide a free resource kit worth ₹2000 as a thank you for your time."
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
}