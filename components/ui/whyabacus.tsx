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
      description: 'Calculate faster than a calculator.',
      icon: <Zap className="w-5 h-5 md:w-8 md:h-8 text-amber-600" />, 
      bgClass: 'bg-amber-50', 
      accentClass: 'bg-amber-500', 
    },
    {
      title: 'Whole Brain',
      description: 'Logical and creative development.',
      icon: <Brain className="w-5 h-5 md:w-8 md:h-8 text-rose-600" />,
      bgClass: 'bg-rose-50',
      accentClass: 'bg-rose-500',
    },
    {
      title: 'Laser Focus',
      description: 'Better listening and concentration.',
      icon: <Target className="w-5 h-5 md:w-8 md:h-8 text-blue-600" />,
      bgClass: 'bg-blue-50',
      accentClass: 'bg-blue-500',
    },
    {
      title: 'Strong Memory',
      description: 'Enhanced visualization skills.',
      icon: <Puzzle className="w-5 h-5 md:w-8 md:h-8 text-emerald-600" />,
      bgClass: 'bg-emerald-50',
      accentClass: 'bg-emerald-500',
    },
  ];

  return (
    <section className="py-12 md:py-24 px-3 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 font-sans">
      
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Headline */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Why Our <span className="text-amber-600">Abacus?</span>
          </h2>
        </div>

        <div className="flex flex-col items-center gap-8">
          
          {/* Central Image */}
          <div className="relative group">
            <div className="absolute inset-[-4px] md:inset-[-8px] border-2 border-dashed border-amber-300 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="relative w-28 h-28 md:w-64 md:h-64 rounded-full border-4 border-white shadow-lg overflow-hidden">
              <img
                src="/abacus.jpeg" 
                alt="Abacus Training"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 2-Column Grid on Mobile, 4-Column on Desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 w-full">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative flex flex-row items-start gap-2 md:gap-4 bg-white p-3 md:p-6 rounded-xl md:rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                {/* Side Accent Line */}
                <div className={`absolute left-0 top-1/4 w-1 h-1/2 rounded-full ${benefit.accentClass}`} />

                {/* Icon: Left Side */}
                <div className={`shrink-0 flex items-center justify-center w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl ${benefit.bgClass}`}>
                  {benefit.icon}
                </div>

                {/* Content: Right Side */}
                <div className="flex flex-col">
                  <h3 className="text-[13px] md:text-lg font-bold text-slate-900 leading-tight mb-0.5 md:mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-[10px] md:text-sm text-slate-500 leading-tight">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}