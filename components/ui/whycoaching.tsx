"use client";

import React from 'react';
import { BrainCircuit, Target, FileText, Users, CheckCircle2 } from 'lucide-react';

export default function WhyChooseCoachingSection() {
  
  // Theme Colors: Amber & Slate (Academic Excellence)
  const colors = {
    primaryAmber: '#d97706',      // amber-600
    textDark: '#0F172A',          // slate-900
    textMuted: '#475569',         // slate-600
    cardBg: '#FFFFFF',            // white
    cardBorder: '#fbbf24',        // amber-400
  };

  const benefits = [
    {
      title: 'Conceptual Clarity',
      description: 'We move beyond rote memorization. Students understand the "Why" and "How".',
      icon: <BrainCircuit className="w-5 h-5 md:w-8 md:h-8 text-amber-600" />, 
      bgClass: 'bg-amber-50', 
      accentClass: 'bg-amber-500', 
    },
    {
      title: 'Exam Strategy',
      description: 'Master time management, answer writing, and board patterns.',
      icon: <Target className="w-5 h-5 md:w-8 md:h-8 text-blue-600" />,
      bgClass: 'bg-blue-50',
      accentClass: 'bg-blue-500',
    },
    {
      title: 'Rigorous Testing',
      description: 'Weekly chapter tests, cumulative assessments, and mock exams.',
      icon: <FileText className="w-5 h-5 md:w-8 md:h-8 text-emerald-600" />,
      bgClass: 'bg-emerald-50',
      accentClass: 'bg-emerald-500',
    },
    {
      title: 'Personal Mentorship',
      description: 'Small batches ensure individual attention and doubt resolution.',
      icon: <Users className="w-5 h-5 md:w-8 md:h-8 text-rose-600" />,
      bgClass: 'bg-rose-50',
      accentClass: 'bg-rose-500',
    },
  ];

  return (
    <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 font-sans">
      
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f59e0b' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative max-w-7xl mx-auto text-center z-10">
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-10 md:mb-16 text-slate-900 tracking-tight">
          Why Toppers <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Choose Us?</span>
        </h2>

        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-12 relative">
          
          {/* Central Image */}
          <div className="w-full md:w-auto flex justify-center items-center order-1 md:order-2 group mb-6 md:mb-0">
            <div className="relative">
              <div className="absolute inset-[-10px] border-2 border-dashed border-amber-300 rounded-full animate-[spin_12s_linear_infinite] hidden md:block" />
              
              <div className="relative w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-white">
                <img
                  src="/tution.jpeg" 
                  alt="Student Studying"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-lg shadow-lg border border-amber-100 flex items-center gap-2 md:bottom-4 md:right-0 md:px-4 md:py-2 md:rounded-xl">
                 <CheckCircle2 size={16} className="text-amber-500 fill-amber-500" />
                 <span className="font-bold text-slate-800 text-[10px] md:text-xs uppercase tracking-wide">Proven Results</span>
              </div>
            </div>
          </div>

          {/* Benefit Cards */}
          <div className="w-full md:w-80 flex justify-center order-2 md:order-1 md:justify-end">
            <BenefitCard benefit={benefits[0]} colors={colors} />
          </div>

          <div className="w-full md:w-80 flex justify-center order-3 md:order-3 md:justify-start">
            <BenefitCard benefit={benefits[1]} colors={colors} />
          </div>

          <div className="w-full md:w-80 flex justify-center order-4 md:order-4 md:justify-end">
            <BenefitCard benefit={benefits[2]} colors={colors} />
          </div>

          <div className="w-full md:w-80 flex justify-center order-5 md:order-5 md:justify-start">
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
        group relative overflow-hidden bg-white border border-slate-100 shadow-sm
        w-full max-w-[400px] md:max-w-none transition-all duration-300 ease-out 
        hover:shadow-xl hover:shadow-amber-900/10 md:hover:-translate-y-2
        
        /* MOBILE SLIM: Horizontal layout */
        flex flex-row items-start p-4 rounded-2xl gap-4
        
        /* DESKTOP SAME: Vertical layout */
        md:flex-col md:items-center md:text-center md:p-8 md:rounded-[2rem] md:shadow-lg md:shadow-amber-900/5
      "
    >
      {/* Top Border Accent (Desktop) */}
      <div className={`absolute top-0 left-0 w-full h-1 md:h-1.5 ${benefit.accentClass}`} />

      {/* Icon Circle */}
      <div
        className={`
          flex-shrink-0 flex items-center justify-center rounded-xl md:rounded-2xl 
          w-12 h-12 md:w-16 md:h-16 shadow-sm transition-transform duration-300 group-hover:scale-110 
          ${benefit.bgClass}
        `}
      >
        {benefit.icon}
      </div>

      {/* Text Container */}
      <div className="flex flex-col">
        <h3
          className="text-base md:text-xl font-black mb-1 md:mb-3 transition-colors duration-300"
          style={{ color: colors.textDark }}
        >
          {benefit.title}
        </h3>
        
        <p 
          className="text-xs md:text-sm leading-relaxed font-medium" 
          style={{ color: colors.textMuted }}
        >
          {benefit.description}
        </p>
      </div>
    </div>
  );
}