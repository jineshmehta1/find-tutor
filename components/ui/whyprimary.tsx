"use client";

import React from 'react';
import { Heart, Brain, ShieldCheck, GraduationCap } from 'lucide-react';

export default function WhyChooseUsSection() {
  const colors = {
    primaryAmber: '#d97706',
    textDark: '#0F172A',
    textMuted: '#475569',
    cardBg: '#FFFFFF',
    cardBorder: '#fcd34d',
  };

  const benefits = [
    {
      title: 'Caring Teachers',
      description: 'Mentors who nurture with patience.',
      icon: <Heart className="w-5 h-5 md:w-8 md:h-8 text-rose-500" />, 
      bgClass: 'bg-rose-50', 
      accentClass: 'bg-rose-500', 
    },
    {
      title: 'Creative Learning',
      description: 'Play-based methods beyond books.',
      icon: <Brain className="w-5 h-5 md:w-8 md:h-8 text-amber-600" />,
      bgClass: 'bg-amber-50',
      accentClass: 'bg-amber-500',
    },
    {
      title: 'Safe Campus',
      description: '24/7 CCTV and verified staff.',
      icon: <ShieldCheck className="w-5 h-5 md:w-8 md:h-8 text-green-600" />,
      bgClass: 'bg-green-50',
      accentClass: 'bg-green-500',
    },
    {
      title: 'Holistic Growth',
      description: 'Confidence and public speaking.',
      icon: <GraduationCap className="w-5 h-5 md:w-8 md:h-8 text-blue-600" />,
      bgClass: 'bg-blue-50',
      accentClass: 'bg-blue-500',
    },
  ];

  return (
    <section className="py-10 md:py-24 px-3 sm:px-6 lg:px-8 relative overflow-hidden bg-amber-50/30 font-sans">
      
      {/* Background Decor */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Why Parents <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Trust Us?</span>
          </h2>
          <p className="mt-2 text-slate-600 font-medium max-w-2xl mx-auto text-xs md:text-base px-4">
            A world-class environment where safety and happiness come first.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 md:gap-12">
          
          {/* Central Image: First on Mobile */}
          <div className="relative group">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl lg:blur-3xl" />
            <div className="relative w-32 h-32 sm:w-64 lg:w-80 sm:h-64 lg:h-80 rounded-full border-[5px] md:border-[8px] border-white shadow-xl overflow-hidden bg-white mx-auto">
              <img
                src="/school.jpeg" 
                alt="Happy Student"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white p-1 md:p-2 rounded-full shadow-lg border border-amber-100">
               <span className="text-sm md:text-2xl">🌟</span>
            </div>
          </div>

          {/* 2-Column Grid for Mobile, Flanking layout for Desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 w-full">
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} benefit={benefit} colors={colors} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit, colors }) {
  return (
    <div
      className={`
        group p-3 md:p-8 rounded-xl md:rounded-[2.5rem] shadow-sm md:shadow-lg shadow-amber-900/5 
        flex flex-row lg:flex-col items-start lg:items-center border transition-all duration-300 ease-out relative overflow-hidden bg-white
        hover:shadow-md md:hover:shadow-2xl hover:shadow-amber-900/10 md:hover:-translate-y-2 cursor-default
        gap-3 md:gap-6
      `}
      style={{ borderColor: colors.cardBorder }}
    >
      {/* Side Accent Line (Left on mobile, Top on desktop) */}
      <div className={`absolute left-0 lg:top-0 lg:left-0 h-full w-1 lg:w-full lg:h-1.5 ${benefit.accentClass}`} />

      {/* Icon Circle */}
      <div
        className={`
          shrink-0 flex items-center justify-center rounded-lg md:rounded-2xl 
          w-9 h-9 md:w-16 md:h-16 shadow-inner transition-transform duration-500 group-hover:rotate-[360deg] 
          ${benefit.bgClass}
        `}
      >
        <div className="scale-75 md:scale-100">
          {benefit.icon}
        </div>
      </div>

      {/* Text Container */}
      <div className="flex flex-col text-left lg:text-center">
        <h3
          className="text-[13px] md:text-xl font-black mb-0.5 md:mb-3 leading-tight"
          style={{ color: colors.textDark }}
        >
          {benefit.title}
        </h3>
        
        <p 
          className="text-[10px] md:text-[15px] leading-tight md:leading-relaxed font-medium" 
          style={{ color: colors.textMuted }}
        >
          {benefit.description}
        </p>
      </div>
    </div>
  );
}