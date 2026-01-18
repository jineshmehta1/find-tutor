"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Phone, 
  CheckCircle2, 
  Sparkles,
  Calendar
} from "lucide-react";

export default function CTASection() {
  const benefits = [
    "Free Assessment Report",
    "1-on-1 Expert Interaction",
    "Personalized Roadmap"
  ];

  return (
    <section className="relative py-12 md:py-20 lg:py-24 bg-white px-4">
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* --- Main Card --- */}
        <div className="relative bg-slate-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
          
          {/* Background Decorative Blurs */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-amber-500/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500/10 blur-[120px] pointer-events-none" />
          
          <div className="grid lg:grid-cols-12 items-stretch">
            
            {/* --- LEFT: Content --- */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-16 flex flex-col justify-center text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 self-center lg:self-start px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-amber-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Limited Slots Available</span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-white leading-tight mb-6">
                Unlock Your Child's <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
                  True Potential.
                </span>
              </h2>

              {/* Subtext */}
              <p className="text-slate-400 text-sm md:text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Take the first step towards holistic excellence. Experience the Aacharya difference through our specialized skill programs.
              </p>

              {/* Benefits List */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 mb-10">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 justify-center lg:justify-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300 text-xs md:text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
                <Link href="/bookdemo" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 py-4 bg-amber-500 text-slate-900 rounded-xl font-bold text-base hover:bg-amber-400 transition-all shadow-lg active:scale-95">
                    Book Free Demo
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                
                <Link href="tel:+918074103400" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-slate-700 text-white rounded-xl font-bold text-base hover:bg-slate-800 transition-all active:scale-95">
                    <Phone className="w-5 h-5 text-amber-500" />
                    Call Us
                  </button>
                </Link>
              </div>

            </div>

            {/* --- RIGHT: Visual Mockup --- */}
            <div className="lg:col-span-5 relative min-h-[250px] sm:min-h-[350px] lg:min-h-full bg-slate-800/30 flex items-center justify-center">
              {/* Pattern Background */}
              <div className="absolute inset-0 opacity-20" 
                   style={{ backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              
              {/* Floating UI Mockup */}
              <div className="relative group p-4 w-full flex justify-center">
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl transform lg:rotate-6 lg:group-hover:rotate-0 transition-all duration-700 max-w-[280px] md:max-w-[320px]">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shrink-0">
                         <Calendar className="w-6 h-6 text-slate-900" />
                      </div>
                      <div>
                         <p className="text-white font-bold text-base md:text-lg">Trial Session</p>
                         <p className="text-amber-400 text-xs md:text-sm font-semibold tracking-wide uppercase">Free of Cost</p>
                      </div>
                   </div>
                   
                   <div className="space-y-3 mb-6">
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-amber-500/50" />
                      </div>
                      <div className="h-2 w-4/5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-amber-500/50" />
                      </div>
                   </div>

                   <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                         {[1,2,3].map(i => <div key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-700 border-2 border-slate-800 shadow-sm" />)}
                      </div>
                      <span className="text-[10px] md:text-xs text-slate-400 font-medium">Join 200+ students</span>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}