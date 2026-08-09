"use client";

import React from 'react';
import { BrainCircuit, Target, FileText, Users, CheckCircle2 } from 'lucide-react';

export default function WhyChooseCoachingSection() {
  
  const colors = {
    primaryAmber: '#d97706',
    textDark: '#0F172A',
    textMuted: '#475569',
    cardBg: '#FFFFFF',
    cardBorder: '#fbbf24',
  };

  const benefits = [
    {
      title: 'Conceptual Clarity',
      description: 'Understanding the "Why" and "How".',
      icon: <BrainCircuit className="w-5 h-5 md:w-8 md:h-8 text-amber-600" />, 
      bgClass: 'bg-amber-50', 
      accentClass: 'bg-amber-500', 
    },
    {
      title: 'Exam Strategy',
      description: 'Master time and board patterns.',
      icon: <Target className="w-5 h-5 md:w-8 md:h-8 text-blue-600" />,
      bgClass: 'bg-blue-50',
      accentClass: 'bg-blue-500',
    },
    {
      title: 'Rigorous Testing',
      description: 'Weekly tests and mock exams.',
      icon: <FileText className="w-5 h-5 md:w-8 md:h-8 text-emerald-600" />,
      bgClass: 'bg-emerald-50',
      accentClass: 'bg-emerald-500',
    },
    {
      title: 'Personal Mentoring',
      description: 'Small batches for attention.',
      icon: <Users className="w-5 h-5 md:w-8 md:h-8 text-rose-600" />,
      bgClass: 'bg-rose-50',
      accentClass: 'bg-rose-500',
    },
  ];

  return (
    <section className="py-12 md:py-24 px-3 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 font-sans">
      
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f59e0b' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Why Toppers <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Choose Us?</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-12">
          
          {/* Central Image: Stays top on mobile */}
          <div className="relative group mb-4 lg:mb-0 lg:order-2">
            <div className="absolute inset-[-6px] md:inset-[-12px] border-2 border-dashed border-amber-300 rounded-full animate-[spin_15s_linear_infinite]" />
            
            <div className="relative w-32 h-32 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full border-[5px] md:border-[8px] border-white shadow-2xl overflow-hidden bg-white">
              <img
                src="/tution.jpeg" 
                alt="Student Success"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute -bottom-2 right-0 bg-white px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl shadow-lg border border-amber-100 flex items-center gap-1.5 md:gap-2">
               <CheckCircle2 size={14} className="text-amber-500 fill-amber-500 md:w-5 md:h-5" />
               <span className="font-black text-slate-800 text-[8px] md:text-xs uppercase tracking-wider">Proven Results</span>
            </div>
          </div>

          {/* Desktop Left Side / Mobile Top Two */}
          <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3 md:gap-6 w-full lg:w-auto lg:order-1">
            <BenefitCard benefit={benefits[0]} colors={colors} />
            <BenefitCard benefit={benefits[1]} colors={colors} />
            {/* These show on mobile to complete the 2x2 grid */}
            <div className="lg:hidden">
                <BenefitCard benefit={benefits[2]} colors={colors} />
            </div>
            <div className="lg:hidden">
                <BenefitCard benefit={benefits[3]} colors={colors} />
            </div>
          </div>

          {/* Desktop Right Side Only (Hidden on mobile to avoid duplication in the grid above) */}
          <div className="hidden lg:flex flex-col gap-6 lg:order-3">
            <BenefitCard benefit={benefits[2]} colors={colors} />
            <BenefitCard benefit={benefits[3]} colors={colors} />
          </div>

        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit, colors }: { benefit: any; colors: any }) {
  return (
    <div
      className={`
        group relative overflow-hidden bg-white border border-slate-100 shadow-sm
        w-full lg:w-[320px] transition-all duration-300 ease-out 
        hover:shadow-md md:hover:shadow-xl md:hover:-translate-y-1 cursor-default
        
        /* Mobile & Desktop: Icon Left, Content Right */
        flex flex-row items-start p-3 md:p-6 rounded-xl md:rounded-[2rem] gap-3 md:gap-4
      `}
    >
      {/* Side Accent Line */}
      <div className={`absolute left-0 top-1/4 w-1 h-1/2 rounded-r-full ${benefit.accentClass}`} />

      {/* Icon Circle */}
      <div
        className={`
          shrink-0 flex items-center justify-center rounded-lg md:rounded-2xl 
          w-9 h-9 md:w-16 md:h-16 shadow-inner transition-transform duration-300 group-hover:scale-110 
          ${benefit.bgClass}
        `}
      >
        <div className="scale-75 md:scale-100">
           {benefit.icon}
        </div>
      </div>

      {/* Text Container */}
      <div className="flex flex-col text-left">
        <h3
          className="text-[13px] md:text-lg font-black leading-tight mb-1"
          style={{ color: colors.textDark }}
        >
          {benefit.title}
        </h3>
        
        <p 
          className="text-[10px] md:text-sm leading-tight md:leading-relaxed font-medium" 
          style={{ color: colors.textMuted }}
        >
          {benefit.description}
        </p>
      </div>
    </div>
  );
}