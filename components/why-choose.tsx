"use client";

import React from 'react';
import { 
  ShieldCheck, 
  LayoutGrid, 
  TrendingUp, 
  Users, 
  ThumbsUp, 
  CheckCircle2 
} from 'lucide-react';

export default function WhyChooseUsSection() {
  
  const colors = {
    textDark: '#0f172a',          // slate-900
    textMuted: '#475569',         // slate-600
  };

  const benefits = [
    {
      title: 'All-in-One Learning Campus',
      description: 'Pre school, Tuition, Chess, Abacus & Robotics — complete academic and skill-based development in one place.',
      icon: <LayoutGrid className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />, 
      bgClass: 'bg-blue-50', 
    },
    {
      title: 'Cleanest & Child-Safe Campus',
      description: 'Hygienic classrooms, CCTV-secured environment and trained caregivers ensure 100% safety.',
      icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />,
      bgClass: 'bg-emerald-50',
    },
    {
      title: 'Strong Academic & Skill Growth',
      description: 'From NEP preschool to concept-based tuition, we foster logic and creativity through specialized skills.',
      icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />,
      bgClass: 'bg-amber-50',
    },
    {
      title: 'Experienced Teachers',
      description: 'Small batch sizes and trained teachers allow focused attention and continuous progress tracking.',
      icon: <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />,
      bgClass: 'bg-purple-50',
    },
    {
      title: 'Trusted Results',
      description: 'Visible improvement in confidence, discipline and academics building long-term community trust.',
      icon: <ThumbsUp className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />,
      bgClass: 'bg-orange-50',
    },
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white font-sans">
      
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Headline */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-sm font-bold uppercase tracking-wider mb-4">
            <CheckCircle2 size={16} />
            The Aacharya Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Why Parents Trust <span className="text-amber-600">Aacharya</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-slate-600 text-lg">
            Providing a secure, holistic, and high-growth environment for the next generation of leaders.
          </p>
        </div>

        {/* 3-Column Layout: Left (2 cards) | Center (Image) | Right (3 cards) */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-12">
          
          {/* LEFT COLUMN: 2 Cards */}
          <div className="flex flex-col gap-8 w-full xl:w-1/3 order-2 xl:order-1">
             <BenefitCard benefit={benefits[0]} colors={colors} align="right" />
             <BenefitCard benefit={benefits[1]} colors={colors} align="right" />
          </div>

          {/* CENTRAL IMAGE */}
          <div className="w-full xl:w-1/3 flex justify-center items-center order-1 xl:order-2">
            <div className="relative">
              {/* Animated Glow Backdrops */}
              <div className="absolute inset-0 bg-amber-200 rounded-full blur-[80px] opacity-30 animate-pulse"></div>
              
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl rotate-3 overflow-hidden border-8 border-white shadow-2xl">
                 <img 
                   src="/table.jpg" // Replace with a photo of your actual campus or happy kids
                   alt="Aacharya Academy Campus" 
                   className="w-full h-full object-cover"
                 />
                 {/* Overlay badge */}
                 <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-xl">
                    <p className="text-amber-600 font-black text-xl leading-none">500+</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Happy Families</p>
                 </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 3 Cards */}
          <div className="flex flex-col gap-8 w-full xl:w-1/3 order-3 xl:order-3">
             <BenefitCard benefit={benefits[2]} colors={colors} align="left" />
             <BenefitCard benefit={benefits[3]} colors={colors} align="left" />
             <BenefitCard benefit={benefits[4]} colors={colors} align="left" />
          </div>

        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit, colors, align }) {
  // Logic to handle text alignment on large screens
  const alignmentClass = align === 'right' ? 'xl:text-right xl:items-end' : 'xl:text-left xl:items-start';
  const flexDirection = align === 'right' ? 'xl:flex-row-reverse' : 'xl:flex-row';

  return (
    <div className={`group flex flex-col items-center gap-5 p-2 transition-all duration-300 ${alignmentClass}`}>
      {/* Icon with colored background */}
      <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-md ${benefit.bgClass}`}>
        {benefit.icon}
      </div>

      {/* Text Content */}
      <div className={`flex flex-col ${alignmentClass}`}>
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
          {benefit.title}
        </h3>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium max-w-sm">
          {benefit.description}
        </p>
      </div>
    </div>
  );
}