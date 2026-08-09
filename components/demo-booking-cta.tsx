"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Phone, Sparkles, Zap } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-12 md:py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        
        {/* --- COMPACT BENTO CARD --- */}
        <div className="relative bg-[#2D63ED] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl shadow-blue-200">
          
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

          <div className="grid lg:grid-cols-12 items-center">
            
            {/* --- LEFT: CONTENT (COMPACT) --- */}
            <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 relative z-10 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 font-black text-[10px] uppercase tracking-widest mb-6">
                <Zap size={12} className="fill-amber-300" />
                <span>Limited Slots Available</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                Unlock Your Child's <br className="hidden md:block" />
                <span className="text-amber-400">True Potential.</span>
              </h2>

              <p className="text-blue-100/80 text-sm md:text-base font-medium max-w-md mb-8 lg:mx-0 mx-auto">
                Take the first step towards excellence. Experience the Aacharya difference through our specialized skill programs.
              </p>

              {/* Compact Button Group */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/request-tutor" className="shrink-0">
                  <button className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2D63ED] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-400 hover:text-white transition-all shadow-lg active:scale-95">
                    Book Free Demo
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                
                <Link href="tel:+918074103400" className="shrink-0">
                  <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border-2 border-white/20 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                    <Phone size={18} className="text-amber-400" />
                    Call Us
                  </button>
                </Link>
              </div>
            </div>

            {/* --- RIGHT: IMAGE (CROPPED & COMPACT) --- */}
            <div className="lg:col-span-5 relative h-64 lg:h-full min-h-[300px] overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800" 
                 alt="Child Learning"
                 className="absolute inset-0 w-full h-full object-cover grayscale-[10%]"
               />
               {/* Vignette Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#2D63ED] via-transparent lg:bg-gradient-to-l" />

              
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}