"use client";

import React from "react";
import { Star, Quote, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    id: 1,
    name: "Eshan Gupta",
    role: "Student",
    text: "Humble, kind, and truly dedicated. My child loves his classes—clear explanations, great patience, and real passion for chess. Amazing progress in just weeks. Highly recommend Vivek! 👍",
    rating: 5,
    initials: "EG",
    gradient: "from-amber-100 to-yellow-200"
  },
  {
    id: 2,
    name: "Shalini Kanth",
    role: "Parent of Lavith (Age 7)",
    text: "Had a great experience with Coach Mr. Vivek Singh sir. He's very passionate towards chess and Hardworking.",
    rating: 5,
    initials: "SK",
    gradient: "from-blue-100 to-indigo-200"
  },
  {
    id: 3,
    name: "Tarun Aggarwal",
    role: "Father of Student",
    text: "Exceptional. If you want your child should grow fast in chess, you should consider this academy. Vivek sir is expert in teaching chess to kids.",
    rating: 5,
    initials: "TA",
    gradient: "from-green-100 to-emerald-200"
  },
  {
    id: 4,
    name: "Aarti Parmar",
    role: "Mother of Student",
    text: "Well Planned Classes and Individual detailed attention for over all development of kid.",
    rating: 5,
    initials: "AP",
    gradient: "from-purple-100 to-violet-200"
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-12 md:py-20 bg-slate-50 font-sans overflow-hidden">
      
      {/* --- Background Pattern --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5"
           style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 md:mb-6 leading-tight">
            Loved by Parents, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              Celebrated by Students
            </span>
          </h2>
          <div className="h-1 w-16 md:w-24 bg-amber-400 mx-auto rounded-full"></div>
        </div>

        {/* --- Grid Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((item) => (
            <div 
              key={item.id} 
              className="relative bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group"
            >
              
              {/* Decorative Quote Icon Background */}
              <div className="absolute top-4 right-6 md:top-6 md:right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={40} className="md:size-[60px] fill-amber-500 text-amber-500" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4 md:mb-6">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 md:mb-8 relative z-10 font-medium">
                "{item.text}"
              </p>

              {/* Author Section */}
              <div className="flex items-center gap-3 md:gap-4 border-t border-slate-100 pt-4 md:pt-6">
                {/* Initials Avatar */}
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full shrink-0 bg-gradient-to-br ${item.gradient} flex items-center justify-center text-slate-700 font-bold text-sm md:text-lg shadow-inner`}>
                  {item.initials}
                </div>
                
                <div className="min-w-0">
                  <h4 className="text-slate-900 font-bold text-sm md:text-base truncate">
                    {item.name}
                  </h4>
                  <p className="text-slate-400 text-xs md:text-sm font-medium truncate">
                    {item.role}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-24 text-center">
          <Link 
            href="https://www.google.com/maps/place/Aacharya-Pre+School-Play+School-Chess-Abacus-Robotics-Tuition+Point-Bhavanipuram/@16.5301521,80.444078,12z/data=!4m12!1m2!2m1!1saacharya+pre+school+google+page!3m8!1s0x3a35efe8474cbea9:0xa3e687823766f2b2!8m2!3d16.5301521!4d80.5965133!9m1!1b1!15sCh9hYWNoYXJ5YSBwcmUgc2Nob29sIGdvb2dsZSBwYWdlIgOIAQFaISIfYWFjaGFyeWEgcHJlIHNjaG9vbCBnb29nbGUgcGFnZZIBF2VkdWNhdGlvbmFsX2luc3RpdHV0aW9u4AEA!16s%2Fg%2F11h7140n8v?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D"
            className="group inline-flex items-center gap-3 md:gap-4 bg-slate-900 hover:bg-amber-500 text-white px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-sm md:text-base uppercase tracking-widest transition-all duration-300 shadow-xl active:scale-95 touch-manipulation"
          >
            Check Our Google Reviews
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="mt-6 md:mt-8 text-slate-400 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em]">
            YOUR TRUST, OUR PRIDE
          </p>
        </div>

      </div>
    </section>
  );
}