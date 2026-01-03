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
      description: 'Our educators are mentors who nurture every child with patience and love.',
      icon: <Heart className="w-6 h-6 md:w-8 md:h-8 text-rose-500" />, 
      bgClass: 'bg-rose-50', 
      accentClass: 'bg-rose-500', 
    },
    {
      title: 'Creative Learning',
      description: 'We move beyond textbooks with play-based and inquiry-driven methods.',
      icon: <Brain className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />,
      bgClass: 'bg-amber-50',
      accentClass: 'bg-amber-500',
    },
    {
      title: 'Safe Campus',
      description: '24/7 CCTV, gated entry, and background-verified staff for complete safety.',
      icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-green-600" />,
      bgClass: 'bg-green-50',
      accentClass: 'bg-green-500',
    },
    {
      title: 'Holistic Growth',
      description: 'Focusing on confidence, public speaking, and emotional intelligence.',
      icon: <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />,
      bgClass: 'bg-blue-50',
      accentClass: 'bg-blue-500',
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-amber-50/30 font-sans">
      
      {/* Background Decor */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-yellow-200/40 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-orange-200/40 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Headline */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Why Parents <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Trust Us?</span>
          </h2>
          <p className="mt-4 text-slate-600 font-medium max-w-2xl mx-auto text-sm md:text-base">
            We provide a world-class environment where your child’s safety and happiness come first.
          </p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (Desktop) / Column 1 (Mobile) */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            <BenefitCard benefit={benefits[0]} colors={colors} />
            <BenefitCard benefit={benefits[1]} colors={colors} />
          </div>

          {/* Central Image - Order 1 on Mobile, 2 on Desktop */}
          <div className="flex justify-center items-center order-1 lg:order-2 group">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-3xl group-hover:bg-orange-400/30 transition-colors duration-500" />
              
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full border-[8px] border-white shadow-2xl overflow-hidden bg-white mx-auto">
                <img
                  src="/school.jpeg" 
                  alt="Happy Student"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-2 right-4 md:right-8 bg-white px-4 py-2 rounded-2xl shadow-xl border border-amber-100 animate-bounce">
                 <span className="text-xl md:text-2xl">🌟</span>
              </div>
            </div>
          </div>

          {/* Right Column (Desktop) / Column 2 (Mobile) */}
          <div className="space-y-6 md:space-y-8 order-3 lg:order-3">
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
        group p-6 md:p-8 rounded-[2.5rem] shadow-lg shadow-amber-900/5 flex flex-col items-center lg:items-start text-center lg:text-left border
        transition-all duration-300 ease-out relative overflow-hidden bg-white
        hover:shadow-2xl hover:shadow-amber-900/10 hover:-translate-y-2 cursor-default
      "
      style={{
        borderColor: colors.cardBorder,
      }}
    >
      {/* Top Border Accent */}
      <div className={`absolute top-0 left-0 w-full lg:w-1.5 lg:h-full h-1.5 ${benefit.accentClass}`} />

      {/* Icon Circle */}
      <div
        className={`mb-4 md:mb-6 flex items-center justify-center rounded-2xl w-14 h-14 md:w-16 md:h-16 shadow-inner transition-transform duration-500 group-hover:rotate-[360deg] ${benefit.bgClass}`}
      >
        {benefit.icon}
      </div>

      <h3
        className="text-lg md:text-xl font-black mb-2 md:mb-3"
        style={{ color: colors.textDark }}
      >
        {benefit.title}
      </h3>
      
      <p 
        className="text-sm md:text-[15px] leading-relaxed font-medium" 
        style={{ color: colors.textMuted }}
      >
        {benefit.description}
      </p>
    </div>
  );
}