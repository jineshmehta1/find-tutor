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
      description: 'Mentors who nurture every child with patience and love.',
      icon: <Heart className="w-5 h-5 md:w-8 md:h-8 text-rose-500" />, 
      bgClass: 'bg-rose-50', 
      accentClass: 'bg-rose-500', 
    },
    {
      title: 'Creative Learning',
      description: 'Play-based and inquiry-driven methods beyond textbooks.',
      icon: <Brain className="w-5 h-5 md:w-8 md:h-8 text-amber-600" />,
      bgClass: 'bg-amber-50',
      accentClass: 'bg-amber-500',
    },
    {
      title: 'Safe Campus',
      description: '24/7 CCTV and verified staff for complete safety.',
      icon: <ShieldCheck className="w-5 h-5 md:w-8 md:h-8 text-green-600" />,
      bgClass: 'bg-green-50',
      accentClass: 'bg-green-500',
    },
    {
      title: 'Holistic Growth',
      description: 'Confidence, public speaking, and emotional intelligence.',
      icon: <GraduationCap className="w-5 h-5 md:w-8 md:h-8 text-blue-600" />,
      bgClass: 'bg-blue-50',
      accentClass: 'bg-blue-500',
    },
  ];

  return (
    <section className="py-10 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-amber-50/30 font-sans">
      
      {/* Background Decor */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Headline: Slimmer padding/font on mobile */}
        <div className="text-center mb-8 md:mb-20">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Why Parents <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Trust Us?</span>
          </h2>
          <p className="mt-2 md:mt-4 text-slate-600 font-medium max-w-2xl mx-auto text-xs md:text-base px-4">
            A world-class environment where safety and happiness come first.
          </p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-12 items-center">
          
          {/* Top 2 Cards on Mobile / Left Column on Desktop */}
          <div className="w-full space-y-3 md:space-y-8 order-2 lg:order-1">
            <BenefitCard benefit={benefits[0]} colors={colors} />
            <BenefitCard benefit={benefits[1]} colors={colors} />
          </div>

          {/* Central Image: Scaled down on Mobile */}
          <div className="flex justify-center items-center order-1 lg:order-2 group py-4 lg:py-0">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl lg:blur-3xl group-hover:bg-orange-400/30 transition-colors duration-500" />
              
              <div className="relative w-32 h-32 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full border-[4px] md:border-[8px] border-white shadow-xl overflow-hidden bg-white mx-auto">
                <img
                  src="/school.jpeg" 
                  alt="Happy Student"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              <div className="absolute -bottom-1 -right-1 bg-white p-1.5 md:p-2 rounded-full shadow-lg border border-amber-100">
                 <span className="text-sm md:text-2xl">🌟</span>
              </div>
            </div>
          </div>

          {/* Bottom 2 Cards on Mobile / Right Column on Desktop */}
          <div className="w-full space-y-3 md:space-y-8 order-3 lg:order-3">
            <BenefitCard benefit={benefits[2]} colors={colors} />
            <BenefitCard benefit={benefits[3]} colors={colors} />
          </div>

        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit, colors }: any) {
  return (
    <div
      className="
        group p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm md:shadow-lg shadow-amber-900/5 
        flex flex-row lg:flex-col items-center lg:items-start text-left lg:text-left border
        transition-all duration-300 ease-out relative overflow-hidden bg-white
        hover:shadow-md md:hover:shadow-2xl hover:shadow-amber-900/10 hover:-translate-y-1 md:hover:-translate-y-2 cursor-default
      "
      style={{
        borderColor: colors.cardBorder,
      }}
    >
      {/* Side Accent for mobile, Top Accent for desktop */}
      <div className={`absolute top-0 left-0 h-full w-1 md:w-full md:h-1.5 ${benefit.accentClass}`} />

      {/* Icon Circle: Smaller on mobile */}
      <div
        className={`shrink-0 flex items-center justify-center rounded-xl md:rounded-2xl w-10 h-10 md:w-16 md:h-16 shadow-inner transition-transform duration-500 group-hover:rotate-[360deg] ${benefit.bgClass} mr-4 lg:mr-0 lg:mb-6`}
      >
        {benefit.icon}
      </div>

      <div className="flex flex-col">
        <h3
          className="text-sm md:text-xl font-black mb-0.5 md:mb-3"
          style={{ color: colors.textDark }}
        >
          {benefit.title}
        </h3>
        
        <p 
          className="text-[10px] md:text-[15px] leading-snug md:leading-relaxed font-medium line-clamp-2 md:line-clamp-none" 
          style={{ color: colors.textMuted }}
        >
          {benefit.description}
        </p>
      </div>
    </div>
  );
}