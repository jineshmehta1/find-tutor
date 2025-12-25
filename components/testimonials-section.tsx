"use client";

import React from "react";
import { Star, Quote, Sparkles } from "lucide-react";

// --- Demo Data (Based on your provided text) ---
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
    <section className="relative py-20 bg-slate-50 font-sans overflow-hidden">
      
      {/* --- Background Pattern --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5"
           style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* --- Centered Title --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Loved by Parents, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              Celebrated by Students
            </span>
          </h2>
          <div className="h-1 w-24 bg-amber-400 mx-auto rounded-full"></div>
        </div>

        {/* --- Grid Layout (Whole different UI) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item) => (
            <div 
              key={item.id} 
              className="relative bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 group"
            >
              
              {/* Decorative Quote Icon Background */}
              <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={60} className="fill-amber-500 text-amber-500" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-slate-600 text-lg leading-relaxed mb-8 relative z-10 font-medium">
                "{item.text}"
              </p>

              {/* Author Section */}
              <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                {/* Initials Avatar */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-slate-700 font-bold text-lg shadow-inner`}>
                  {item.initials}
                </div>
                
                <div>
                  <h4 className="text-slate-900 font-bold text-base">
                    {item.name}
                  </h4>
                  <p className="text-slate-400 text-sm font-medium">
                    {item.role}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* --- Bottom CTA --- */}
        <div className="text-center mt-12">
            <p className="text-slate-500 text-sm">
                Join 500+ happy families at Aacharya.
            </p>
        </div>

      </div>
    </section>
  );
}