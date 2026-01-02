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
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER (Kept from previous version) --- */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-sm font-bold uppercase tracking-wider mb-6">
            <CheckCircle2 size={18} />
            The Aacharya Advantage
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Why Parents Trust <span className="text-amber-500">Aacharya</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-slate-600 text-lg md:text-xl font-medium">
            Providing a secure, holistic, and high-growth environment for the next generation of leaders.
          </p>
        </div>

        {/* --- GRID LAYOUT (2 in a row) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
          {benefits.map((benefit, idx) => {
            // Logic: Even indices (0, 2, 4) number on left. Odd (1, 3, 5) number on right.
            const isRightAligned = idx % 2 !== 0;
            const style = colorStyles[benefit.color as keyof typeof colorStyles];
            
            return (
              <div 
                key={idx} 
                className={`relative flex items-center w-full ${isRightAligned ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Decorative Backplate Tab */}
                <div className={`absolute ${isRightAligned ? '-right-2 rounded-l-3xl' : '-left-2 rounded-r-3xl'} w-20 h-[85%] ${style.bg} opacity-30 hidden sm:block`} />

                {/* Main Content Card */}
                <div className={`relative z-10 w-full bg-white border-2 ${style.border} rounded-[2rem] p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6 ${isRightAligned ? 'sm:flex-row-reverse' : ''}`}>
                  
                  {/* Number Circle */}
                  <div className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full ${style.bg} flex items-center justify-center text-white text-2xl md:text-3xl font-black shadow-lg`}>
                    {idx + 1}
                  </div>

                  {/* Text Content */}
                  <div className={`flex-1 ${isRightAligned ? 'text-center sm:text-right' : 'text-center sm:text-left'}`}>
                    <h3 className="text-lg md:text-xl font-black text-slate-800 mb-2 tracking-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- FOOTER ACTION --- */}
        <div className="mt-24 text-center">
          <Link 
            href="/contact"
            className="group inline-flex items-center gap-4 bg-slate-900 hover:bg-amber-500 text-white px-10 py-5 rounded-2xl font-black text-sm md:text-base uppercase tracking-widest transition-all duration-300 shadow-xl"
          >
            Enroll Your Child Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}