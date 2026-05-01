"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Sparkles, ArrowRight, Send, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    id: 1,
    name: "Vihaan",
    role: "Student",
    text: "Humble, kind, and truly dedicated. My child loves his classes—clear explanations, great patience, and real passion for chess. Amazing progress in just weeks. Highly recommend Vivek! 👍",
    rating: 5,
    initials: "EG",
    color: "bg-[#4338ca]", 
    shadow: "shadow-indigo-200",
  },
  {
    id: 2,
    name: "Thandava krishna",
    role: "Parent",
    text: "Had a great experience with Coach Dr. Rajesh Sir. He's very passionate towards chess and Hardworking.",
    rating: 5,
    initials: "SK",
    color: "bg-[#047857]", 
    shadow: "shadow-emerald-200",
  },
  {
    id: 3,
    name: "Yegnesh",
    role: "Student",
    text: "Exceptional. If you want your child should grow fast in chess, you should consider this academy. Dr. Rajesh Sir is expert in teaching chess to kids.",
    rating: 5,
    initials: "TA",
    color: "bg-[#be185d]", 
    shadow: "shadow-pink-200",
  },
  {
    id: 4,
    name: "Supriya",
    role: "Mother of Student",
    text: "Well Planned Classes and Individual detailed attention for over all development of kid.",
    rating: 5,
    initials: "AP",
    color: "bg-[#b45309]", 
    shadow: "shadow-amber-200",
  },
];

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [isFlying, setIsFlying] = useState(false);

  const handleNext = () => {
    if (isFlying) return;
    setIsFlying(true);
    
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
      setIsFlying(false);
    }, 600);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[index];

  return (
    <section className="relative py-20 md:py-32 bg-white overflow-hidden font-sans">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- TOP HEADER ROW --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 md:mb-24">
          <div className="max-w-2xl">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
               <Sparkles size={14} className="fill-blue-600" />
               Testimonials
             </div>
             <h2 className="text-3xl md:text-5xl font-[1000] text-slate-900 tracking-tighter leading-[1.1]">
                Loved by Parents, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                  Celebrated by Students
                </span>
             </h2>
          </div>

          <Link 
            href="https://share.google/GDEYt6i3VkoWHczIu"
            target="_blank"
            className="group flex-shrink-0 inline-flex items-center gap-4 bg-slate-900 hover:bg-orange-500 text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95"
          >
            Check Our Google Reviews
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: REVIEWS (7 COLS) */}
          <div className="lg:col-span-7 relative">
            
            {/* THE FLYING PLANE */}
            <AnimatePresence>
              {isFlying && (
                <motion.div
                  initial={{ x: -50, y: 50, opacity: 0, rotate: -10 }}
                  animate={{ x: 1000, y: -600, opacity: 1, rotate: -40 }}
                  transition={{ duration: 0.8, ease: "easeIn" }}
                  className="absolute z-[100] pointer-events-none"
                >
                  <Send className="text-orange-500 w-14 h-14 fill-current shadow-2xl" />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative rounded-[3.5rem] p-8 md:p-16 text-white ${current.color} ${current.shadow} shadow-2xl min-h-[420px] flex flex-col justify-center overflow-hidden`}
            >
              <Quote className="absolute -top-6 -right-6 w-48 h-48 opacity-10 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-xl md:text-3xl font-black leading-tight mb-10 tracking-tight italic">
                  "{current.text}"
                </p>

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-lg border-2 border-white/30">
                    {current.initials}
                  </div>
                  <div>
                    <h4 className="text-xl font-black tracking-tight">{current.name}</h4>
                    <p className="text-white/60 font-bold uppercase tracking-widest text-[10px]">{current.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Controls positioned below the card */}
            <div className="flex gap-4 mt-8">
              <button onClick={handlePrev} className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center shadow-md">
                <ChevronLeft size={24} strokeWidth={3} />
              </button>
              <button onClick={handleNext} disabled={isFlying} className="w-14 h-14 rounded-2xl bg-orange-500 text-white transition-all flex items-center justify-center shadow-xl shadow-orange-100 active:scale-90">
                <ChevronRight size={24} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: IMAGE COLLAGE (5 COLS) --- */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 h-full relative">
            {/* Big Image */}
            <div className="col-span-2 relative h-64 md:h-80 rounded-[3rem] overflow-hidden shadow-xl border-8 border-white">
               <img src="/chess.jpeg" className="w-full h-full object-cover" alt="Student 1" />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                  Strategic Chess
               </div>
            </div>
            
            {/* Small Left Image */}
            <div className="h-44 md:h-56 rounded-[2.5rem] overflow-hidden shadow-lg border-8 border-white -mt-8 relative z-20">
               <img src="/chess-cen.jpeg" className="w-full h-full object-cover" alt="Student 2" />
            </div>

            {/* Small Right Image */}
            <div className="h-44 md:h-56 rounded-[2.5rem] overflow-hidden shadow-lg border-8 border-white -mt-16 bg-[#ffcc00] flex items-center justify-center relative z-20 group">
               <img src="/creative.jpeg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Student 3" />
               <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay"></div>
            </div>

            {/* Decorative colored blob */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-200 rounded-full blur-[80px] opacity-40 -z-10"></div>
          </div>

        </div>

        <p className="mt-16 text-center text-slate-400 font-black text-[10px] uppercase tracking-[0.4em]">
          YOUR TRUST, OUR PRIDE
        </p>
      </div>
    </section>
  );
}