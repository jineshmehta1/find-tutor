"use client";

import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WhyChooseUsSection() {
  const benefits = [
    {
      title: 'All-in-One Learning Hub',
      desc: 'The only campus in Bhavanipuram offering Pre-school, Chess, Abacus, and Robotics under one secure roof.',
      color: 'sky',
    },
    {
      title: 'Child-Safe Campus',
      desc: 'Hygienic classrooms, CCTV-secured environment, and trained caregivers ensure 100% safety.',
      color: 'slate',
    },
    {
      title: 'Skill-Based Growth',
      desc: 'Specialized training in Chess and Abacus fosters logic, memory, and creativity from an early age.',
      color: 'rose',
    },
    {
      title: 'Experienced Staff',
      desc: 'Small batch sizes and trained teachers allow for focused individual attention and progress tracking.',
      color: 'amber',
    },
    {
      title: 'NEP 2020 Aligned',
      desc: 'Our modern preschool curriculum is designed to nurture curiosity through activity-based learning.',
      color: 'sky',
    },
    {
      title: 'Visible Progress',
      desc: 'Join 500+ happy families who have seen visible improvement in their child’s discipline and academics.',
      color: 'slate',
    },
  ];

  const colorStyles = {
    sky: { bg: 'bg-sky-400', border: 'border-sky-100' },
    slate: { bg: 'bg-slate-400', border: 'border-slate-100' },
    rose: { bg: 'bg-rose-400', border: 'border-rose-100' },
    amber: { bg: 'bg-amber-400', border: 'border-amber-100' },
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] md:text-sm font-bold uppercase tracking-wider mb-4 md:mb-6">
            <CheckCircle2 size={16} className="md:w-[18px] md:h-[18px]" />
            The Aacharya Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Why Parents Trust <span className="text-amber-500">Aacharya</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-slate-600 text-sm md:text-lg lg:text-xl font-medium">
            Providing a secure, holistic, and high-growth environment for the next generation of leaders.
          </p>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-x-12 lg:gap-y-16">
          {benefits.map((benefit, idx) => {
            // Logic: Even numbers on left, Odd numbers on right.
            const isRightAligned = idx % 2 !== 0;
            const style = colorStyles[benefit.color as keyof typeof colorStyles];
            
            return (
              <div 
                key={idx} 
                className={`relative flex items-center w-full ${isRightAligned ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Decorative Backplate Tab (Visible from SM upwards) */}
                <div className={`absolute ${isRightAligned ? '-right-1 md:-right-2 rounded-l-3xl' : '-left-1 md:-left-2 rounded-r-3xl'} w-16 md:w-20 h-[80%] ${style.bg} opacity-20 hidden sm:block`} />

                {/* Main Content Card */}
                <div className={`relative z-10 w-full bg-white border-2 ${style.border} rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-sm flex flex-row items-center gap-4 md:gap-6 ${isRightAligned ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Number Circle */}
                  <div className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full ${style.bg} flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl font-black shadow-lg`}>
                    {idx + 1}
                  </div>

                  {/* Text Content */}
                  <div className={`flex-1 ${isRightAligned ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-800 mb-1 tracking-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-500 text-[11px] sm:text-xs md:text-sm font-semibold leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- FOOTER ACTION --- */}
        <div className="mt-16 md:mt-24 text-center">
          <Link 
            href="/contact"
            className="group inline-flex items-center gap-3 md:gap-4 bg-slate-900 hover:bg-amber-500 text-white px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-sm md:text-base uppercase tracking-widest transition-all duration-300 shadow-xl active:scale-95 touch-manipulation"
          >
            Enroll Your Child Today
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="mt-6 md:mt-8 text-slate-400 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em]">
            Limited Slots for 2025-26 Session
          </p>
        </div>

      </div>
    </section>
  );
}