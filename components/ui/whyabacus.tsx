"use client";

import React from 'react';
import { Zap, Brain, Target, Puzzle } from 'lucide-react';

export default function WhyChooseAbacusSection() {
  
  const colors = {
    primaryAmber: '#d97706',
    textDark: '#0F172A',
    textMuted: '#475569',
    cardBg: '#FFFFFF',
    cardBorder: '#fbbf24',
  };

  const benefits = [
    {
      title: 'Lightning Speed',
      description: 'Calculate math problems faster than a calculator with 100% accuracy.',
      icon: <Zap className="w-5 h-5 md:w-8 md:h-8 text-amber-600" />, 
      bgClass: 'bg-amber-50', 
      accentClass: 'bg-amber-500', 
    },
    {
      title: 'Whole Brain Dev',
      description: 'Activates both logical and creative hemispheres of the brain.',
      icon: <Brain className="w-5 h-5 md:w-8 md:h-8 text-rose-600" />,
      bgClass: 'bg-rose-50',
      accentClass: 'bg-rose-500',
    },
    {
      title: 'Laser Focus',
      description: 'Improves listening skills and concentration span for academic excellence.',
      icon: <Target className="w-5 h-5 md:w-8 md:h-8 text-blue-600" />,
      bgClass: 'bg-blue-50',
      accentClass: 'bg-blue-500',
    },
    {
      title: 'Strong Memory',
      description: 'Enhances visualization skills, allowing kids to "see" numbers clearly.',
      icon: <Puzzle className="w-5 h-5 md:w-8 md:h-8 text-emerald-600" />,
      bgClass: 'bg-emerald-50',
      accentClass: 'bg-emerald-500',
    },
  ];

  return (
    <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 font-sans">
      
      {/* Background: Math/Dot Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Headline */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Why Choose Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Abacus Program?</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-12 relative">
          
          {/* Central Image - Scaled down for mobile */}
          <div className="w-full md:w-auto flex justify-center items-center order-1 md:order-2 group cursor-default mb-6 md:mb-0">
            <div className="relative">
              <div className="absolute inset-[-6px] md:inset-[-10px] border-2 border-dashed border-amber-300 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="relative w-32 h-32 sm:w-60 sm:h-60 lg:w-80 lg:h-80 rounded-full border-[4px] md:border-[6px] border-white shadow-xl overflow-hidden bg-white">
                <img
                  src="/abacus.jpeg" 
                  alt="Kid doing mental math"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Cards 1-4 with index for alternating sides */}
          <div className="w-full md:w-80 flex justify-center order-2 md:order-1 md:justify-end">
            <BenefitCard benefit={benefits[0]} index={0} colors={colors} />
          </div>

          <div className="w-full md:w-80 flex justify-center order-3 md:order-3 md:justify-start">
            <BenefitCard benefit={benefits[1]} index={1} colors={colors} />
          </div>

          <div className="w-full md:w-80 flex justify-center order-4 md:order-4 md:justify-end">
            <BenefitCard benefit={benefits[2]} index={2} colors={colors} />
          </div>

          <div className="w-full md:w-80 flex justify-center order-5 md:order-5 md:justify-start">
            <BenefitCard benefit={benefits[3]} index={3} colors={colors} />
          </div>

        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit, index, colors }) {
  // Logic for alternating: Even index = Icon Left, Odd index = Icon Right
  const isEven = index % 2 === 0;

  return (
    <div
      className={`
        group relative overflow-hidden bg-white transition-all duration-300 ease-out
        w-full max-w-sm md:max-w-none border border-slate-100 shadow-sm
        
        /* Mobile Slim Styling */
        flex ${isEven ? 'flex-row text-left' : 'flex-row-reverse text-right'} 
        items-center p-4 rounded-2xl gap-4
        
        /* Desktop Original Styling Reset */
        md:flex-col md:items-center md:text-center md:p-8 md:rounded-[2rem] md:shadow-lg md:shadow-amber-900/5
        md:hover:scale-105 md:hover:shadow-xl md:hover:-translate-y-2 cursor-pointer
      `}
    >
      {/* Top Border Accent (Desktop Only) */}
      <div className={`absolute top-0 left-0 w-full h-1 md:h-1.5 ${benefit.accentClass}`} />

      {/* Icon Circle */}
      <div
        className={`
          shrink-0 flex items-center justify-center rounded-xl md:rounded-2xl 
          w-12 h-12 md:w-16 md:h-16 shadow-inner transition-transform duration-300 group-hover:scale-110 
          ${benefit.bgClass}
        `}
      >
        {benefit.icon}
      </div>

      {/* Text Content */}
      <div className="flex flex-col">
        <h3
          className="text-base md:text-xl font-black mb-1 md:mb-3"
          style={{ color: colors.textDark }}
        >
          {benefit.title}
        </h3>
        
        <p 
          className="text-[11px] md:text-sm leading-tight md:leading-relaxed font-medium" 
          style={{ color: colors.textMuted }}
        >
          {benefit.description}
        </p>
      </div>
    </div>
  );
}