"use client";

import React from 'react';
import { Bot, Code, Cpu, Trophy, Sparkles } from 'lucide-react';

export default function WhyChooseRoboticsSection() {
  
  const colors = {
    primaryAmber: '#d97706',
    textDark: '#0F172A',
    textMuted: '#475569',
    cardBg: '#FFFFFF',
    cardBorder: '#fbbf24',
  };

  const benefits = [
    {
      title: 'Hands-on Build',
      description: 'Real robots using Lego & Arduino kits.',
      icon: <Bot className="w-5 h-5 md:w-8 md:h-8 text-amber-600" />, 
      bgClass: 'bg-amber-50', 
      accentClass: 'bg-amber-500', 
    },
    {
      title: 'Coding Mastery',
      description: 'From Scratch logic to Python scripts.',
      icon: <Code className="w-5 h-5 md:w-8 md:h-8 text-blue-600" />,
      bgClass: 'bg-blue-50',
      accentClass: 'bg-blue-500',
    },
    {
      title: 'Modern Tech Labs',
      description: '3D Printers, IoT, and workstations.',
      icon: <Cpu className="w-5 h-5 md:w-8 md:h-8 text-emerald-600" />,
      bgClass: 'bg-emerald-50',
      accentClass: 'bg-emerald-500',
    },
    {
      title: 'Olympiad Prep',
      description: 'Training for National Hackathons.',
      icon: <Trophy className="w-5 h-5 md:w-8 md:h-8 text-rose-600" />,
      bgClass: 'bg-rose-50',
      accentClass: 'bg-rose-500',
    },
  ];

  return (
    <section className="py-12 md:py-24 px-3 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 font-sans">
      
      {/* Background: Circuit Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Headline */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Why Future Engineers <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Choose Us?</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-12">
          
          {/* Central Image: Orbiting Tech Style */}
          <div className="relative group mb-4 lg:mb-0 lg:order-2">
            <div className="absolute inset-[-6px] md:inset-[-12px] border-2 border-dashed border-amber-300 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-0 bg-amber-400/10 rounded-full blur-3xl" />
            
            <div className="relative w-36 h-36 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full border-[5px] md:border-[8px] border-white shadow-2xl overflow-hidden bg-white">
              <img
                src="robotics-center.jpeg" 
                alt="Robotics Training"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            
            <div className="absolute -bottom-2 right-0 bg-white px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl shadow-lg border border-amber-100 flex items-center gap-1.5 md:gap-2">
               <Sparkles size={14} className="text-amber-500 fill-amber-500 md:w-5 md:h-5" />
               <span className="font-black text-slate-800 text-[8px] md:text-xs uppercase tracking-wider">STEM Certified</span>
            </div>
          </div>

          {/* Grid Container: 2-column on mobile, flanking columns on desktop */}
          <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3 md:gap-6 w-full lg:w-auto lg:order-1">
            <BenefitCard benefit={benefits[0]} colors={colors} />
            <BenefitCard benefit={benefits[1]} colors={colors} />
            {/* These visible on mobile to complete the 2x2 grid */}
            <div className="lg:hidden">
                <BenefitCard benefit={benefits[2]} colors={colors} />
            </div>
            <div className="lg:hidden">
                <BenefitCard benefit={benefits[3]} colors={colors} />
            </div>
          </div>

          {/* Desktop Right Side Column */}
          <div className="hidden lg:flex flex-col gap-6 lg:order-3">
            <BenefitCard benefit={benefits[2]} colors={colors} />
            <BenefitCard benefit={benefits[3]} colors={colors} />
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
        group relative overflow-hidden bg-white border border-slate-200 shadow-sm
        w-full lg:w-[320px] transition-all duration-300 ease-out 
        hover:shadow-md md:hover:shadow-xl md:hover:-translate-y-1 cursor-default
        
        /* Layout: Icon Left, Content Right */
        flex flex-row items-start p-3 md:p-6 rounded-xl md:rounded-[2rem] gap-3 md:gap-4
      `}
    >
      {/* Decorative Side Accent */}
      <div className={`absolute left-0 top-1/4 w-1 h-1/2 rounded-r-full ${benefit.accentClass}`} />

      {/* Icon Square/Circle */}
      <div
        className={`
          shrink-0 flex items-center justify-center rounded-lg md:rounded-2xl 
          w-10 h-10 md:w-16 md:h-16 shadow-inner transition-transform duration-300 group-hover:scale-110 
          ${benefit.bgClass}
        `}
      >
        <div className="scale-90 md:scale-100">
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