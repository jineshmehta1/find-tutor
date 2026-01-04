"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Gamepad2, 
  Zap, 
  Sun, 
  Cloud, 
  Star 
} from 'lucide-react';

export default function WhyChooseUsSection() {
  
  const benefits = [
    {
      title: 'Expert Coaches',
      description: 'Qualified trainers who guide every child with patience, care, and proven methods.',
      icon: <Users className="w-8 h-8 text-rose-500" />, 
      bg: 'bg-rose-50', 
      border: 'border-rose-100',
      hoverBorder: 'group-hover:border-rose-300',
      shadow: 'group-hover:shadow-rose-100',
    },
    {
      title: 'Scientific Curriculum',
      description: 'A structured path developing skills progressively, from fundamentals to advanced logic.',
      icon: <BookOpen className="w-8 h-8 text-amber-600" />,
      bg: 'bg-amber-50', 
      border: 'border-amber-100',
      hoverBorder: 'group-hover:border-amber-300',
      shadow: 'group-hover:shadow-amber-100',
    },
    {
      title: 'Child-Centric Approach',
      description: 'Interactive and engaging sessions that make learning chess enjoyable and focused.',
      icon: <Gamepad2 className="w-8 h-8 text-green-600" />,
      bg: 'bg-green-50', 
      border: 'border-green-100',
      hoverBorder: 'group-hover:border-green-300',
      shadow: 'group-hover:shadow-green-100',
    },
    {
      title: 'Building Life Skills',
      description: 'Strengthening concentration, decision-making, confidence, and discipline.',
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      bg: 'bg-blue-50', 
      border: 'border-blue-100',
      hoverBorder: 'group-hover:border-blue-300',
      shadow: 'group-hover:shadow-blue-100',
    },
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white font-sans selection:bg-amber-200">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-10 left-10 text-amber-200 animate-bounce opacity-60 hidden md:block" style={{ animationDuration: '4s' }}><Sun size={64} /></div>
      <div className="absolute bottom-20 right-10 text-blue-100 opacity-60 hidden md:block"><Cloud size={80} fill="currentColor" /></div>
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative max-w-7xl mx-auto text-center z-10">
        
        {/* Headline */}
        <div className="mb-16 md:mb-20">
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs uppercase tracking-wider mb-4 inline-block"
            >
               The Aacharya Difference
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-4"
            >
            Why Parents <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Trust Us?</span>
            </motion.h2>
        </div>

        {/* Flex container with wrapping */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-8 lg:gap-12 relative">
          
          {/* Central Image (Kid/School Theme) */}
          <div className="w-full md:w-auto flex justify-center items-center order-1 md:order-2 mb-8 md:mb-0">
            <div className="relative group w-64 h-64 lg:w-80 lg:h-80">
              
              {/* Animated Ring */}
              <div className="absolute inset-[-20px] border-2 border-dashed border-amber-300 rounded-full animate-[spin_12s_linear_infinite]" />
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-3xl group-hover:bg-orange-400/30 transition-colors duration-500" />
              
              <div className="relative w-full h-full rounded-full border-[8px] border-white shadow-2xl overflow-hidden bg-white z-10">
                <img
                  src="/pic16.webp" 
                  alt="Happy Student Learning Chess"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-4 right-0 bg-white px-4 py-2 rounded-xl shadow-lg border border-amber-100 animate-bounce z-20 flex items-center gap-2" style={{ animationDuration: '3s' }}>
                 <Star size={18} className="text-amber-500 fill-amber-500" />
                 <span className="font-bold text-slate-800 text-sm">#1 Choice</span>
              </div>
            </div>
          </div>

          {/* Left Column (Desktop) / Sequential (Mobile) */}
          <div className="flex flex-col gap-8 md:gap-24 order-2 md:order-1">
            <BenefitCard benefit={benefits[0]} />
            <BenefitCard benefit={benefits[2]} />
          </div>

          {/* Right Column (Desktop) / Sequential (Mobile) */}
          <div className="flex flex-col gap-8 md:gap-24 order-3 md:order-3">
            <BenefitCard benefit={benefits[1]} />
            <BenefitCard benefit={benefits[3]} />
          </div>

        </div>
      </div>
    </section>
  );
}

// Reusable Card with Hover Animation
function BenefitCard({ benefit }: { benefit: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`
        group p-6 md:p-8 rounded-[2rem] bg-white text-center border-2
        w-full max-w-sm md:w-[320px] transition-all duration-300 ease-out relative overflow-hidden
        hover:scale-105 hover:-translate-y-2 cursor-default shadow-sm hover:shadow-xl
        ${benefit.border} ${benefit.hoverBorder} ${benefit.shadow}
      `}
    >
      {/* Icon Circle */}
      <div
        className={`
          mb-6 mx-auto flex items-center justify-center rounded-2xl w-16 h-16 
          transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 
          ${benefit.bg}
        `}
      >
        {benefit.icon}
      </div>

      <h3 className="text-xl font-black mb-3 text-slate-900 tracking-tight">
        {benefit.title}
      </h3>
      
      <p className="text-sm leading-relaxed font-bold text-slate-500">
        {benefit.description}
      </p>
    </motion.div>
  );
}