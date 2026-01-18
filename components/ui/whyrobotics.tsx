"use client";

import React from 'react';
import { Bot, Code, Cpu, Trophy, Sparkles } from 'lucide-react';

export default function WhyChooseRoboticsSection() {
  
  // Theme Colors: Amber & Slate (Tech Feel)
  const colors = {
    primaryAmber: '#d97706',      // amber-600
    textDark: '#0F172A',          // slate-900
    textMuted: '#475569',         // slate-600
    cardBg: '#FFFFFF',            // white
    cardBorder: '#fbbf24',        // amber-400
  };

  const benefits = [
    {
      title: 'Hands-on Engineering',
      description: 'We don’t just watch videos. Students build real robots using Lego & Arduino kits.',
      icon: <Bot className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />, 
      bgClass: 'bg-amber-50', 
      accentClass: 'bg-amber-500', 
    },
    {
      title: 'Coding Mastery',
      description: 'From drag-and-drop logic (Scratch) to real-world text programming (Python).',
      icon: <Code className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />,
      bgClass: 'bg-blue-50',
      accentClass: 'bg-blue-500',
    },
    {
      title: 'Modern Tech Labs',
      description: 'Fully equipped labs with 3D Printers, IoT Sensors, and High-Speed workstations.',
      icon: <Cpu className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />,
      bgClass: 'bg-emerald-50',
      accentClass: 'bg-emerald-500',
    },
    {
      title: 'Competition Ready',
      description: 'We train students to win National Robotics Olympiads and Hackathons.',
      icon: <Trophy className="w-6 h-6 md:w-8 md:h-8 text-rose-600" />,
      bgClass: 'bg-rose-50',
      accentClass: 'bg-rose-500',
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 font-sans">
      
      {/* Background: Circuit Pattern (Subtle Tech Vibe) */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      {/* Abstract Glows */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-amber-200/40 rounded-full blur-3xl filter opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-blue-200/40 rounded-full blur-3xl filter opacity-60 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto text-center z-10">
        
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-10 md:mb-16 text-slate-900 tracking-tight">
          Why Future Engineers <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Choose Us?</span>
        </h2>

        {/* Flex container with wrapping */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-12 relative">
          
          {/* Central Image (Robotics Theme) */}
          {/* Mobile: Order 1 (Top), Desktop: Order 2 (Center) */}
          <div className="w-full md:w-auto flex justify-center items-center order-1 md:order-2 group cursor-default mb-4 md:mb-0">
            <div className="relative">
              {/* Spinning Tech Ring */}
              <div className="absolute inset-[-10px] border-2 border-dashed border-amber-300 rounded-full animate-[spin_10s_linear_infinite]" />
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-3xl group-hover:bg-blue-400/30 transition-colors duration-500" />
              
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 lg:w-80 lg:h-80 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-white">
                <img
                  src="robotics-center.jpeg" 
                  alt="Kid building robot"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-4 right-0 bg-white px-4 py-2 rounded-xl shadow-lg border border-amber-100 animate-bounce-slow flex items-center gap-2">
                 <Sparkles size={18} className="text-amber-500 fill-amber-500" />
                 <span className="font-bold text-slate-800 text-xs uppercase tracking-wide">STEM Certified</span>
              </div>
            </div>
          </div>

          {/* Card 1: Hands-on */}
          <div className="w-full md:w-80 flex justify-center order-2 md:order-1 md:justify-end">
            <BenefitCard benefit={benefits[0]} colors={colors} />
          </div>

          {/* Card 2: Coding */}
          <div className="w-full md:w-80 flex justify-center order-3 md:order-3 md:justify-start">
            <BenefitCard benefit={benefits[1]} colors={colors} />
          </div>

          {/* Card 3: Modern Labs */}
          <div className="w-full md:w-80 flex justify-center order-4 md:order-4 md:justify-end">
            <BenefitCard benefit={benefits[2]} colors={colors} />
          </div>

          {/* Card 4: Competitions */}
          <div className="w-full md:w-80 flex justify-center order-5 md:order-5 md:justify-start">
            <BenefitCard benefit={benefits[3]} colors={colors} />
          </div>

        </div>
      </div>
    </section>
  );
}

// Reusable Card with Hover Animation
function BenefitCard({ benefit, colors }: any) {
  return (
    <div
      className="
        group p-6 md:p-8 rounded-[2rem] shadow-lg shadow-amber-900/5 flex flex-col items-center text-center border
        w-full max-w-sm md:max-w-none transition-all duration-300 ease-out relative overflow-hidden
        hover:scale-105 hover:shadow-xl hover:shadow-amber-900/10 hover:-translate-y-2 cursor-pointer bg-white
      "
      style={{
        borderColor: '#f1f5f9', // Subtler border initially
      }}
    >
      {/* Top Border Accent */}
      <div className={`absolute top-0 left-0 w-full h-1.5 ${benefit.accentClass}`} />

      {/* Icon Circle */}
      <div
        className={`mb-4 md:mb-6 flex items-center justify-center rounded-2xl w-14 h-14 md:w-16 md:h-16 shadow-sm transition-transform duration-300 group-hover:scale-110 ${benefit.bgClass}`}
      >
        {benefit.icon}
      </div>

      <h3
        className="text-lg md:text-xl font-black mb-2 md:mb-3 transition-colors duration-300"
        style={{ color: colors.textDark }}
      >
        {benefit.title}
      </h3>
      
      <p 
        className="text-sm md:text-sm leading-relaxed font-medium" 
        style={{ color: colors.textMuted }}
      >
        {benefit.description}
      </p>
    </div>
  );
}