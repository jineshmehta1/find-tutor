"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Gamepad2, 
  Zap, 
  Sun, 
  Star 
} from 'lucide-react';

export default function WhyChooseUsSection() {
  
  const benefits = [
    {
      title: 'Expert Coaches',
      description: 'Qualified trainers with proven methods.',
      icon: Users, 
      color: "text-rose-600",
      bg: 'bg-rose-50', 
      border: 'hover:border-rose-300',
    },
    {
      title: 'Scientific Path',
      description: 'A structured path for skill growth.',
      icon: BookOpen,
      color: "text-amber-600",
      bg: 'bg-amber-50', 
      border: 'hover:border-amber-300',
    },
    {
      title: 'Child-Centric',
      description: 'Engaging & interactive sessions.',
      icon: Gamepad2,
      color: "text-emerald-600",
      bg: 'bg-emerald-50', 
      border: 'hover:border-emerald-300',
    },
    {
      title: 'Life Skills',
      description: 'Focus & decision-making skills.',
      icon: Zap,
      color: "text-blue-600",
      bg: 'bg-blue-50', 
      border: 'hover:border-blue-300',
    },
  ];

  return (
    <section className="py-12 md:py-24 px-3 sm:px-6 relative overflow-hidden bg-white">
      
      {/* Background Decor */}
      <div className="absolute top-10 left-10 text-amber-100 opacity-60 hidden md:block animate-pulse"><Sun size={64} /></div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#d97706 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-black text-[10px] uppercase tracking-widest mb-4 inline-block"
            >
               The Aacharya Difference
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight"
            >
            Why Parents <span className="text-amber-500 italic">Trust Us?</span>
            </motion.h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-12">
          
          {/* Central Image: First on mobile, Middle on desktop */}
          <div className="order-1 lg:order-2 flex justify-center mb-4 lg:mb-0">
            <div className="relative group w-32 h-32 md:w-64 md:h-64 lg:w-80 lg:h-80">
              <div className="absolute inset-[-8px] border-2 border-dashed border-amber-200 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="relative w-full h-full rounded-full border-[4px] md:border-[6px] border-white shadow-xl overflow-hidden bg-white z-10">
                <img src="/chess-cen.jpeg" alt="Happy Student" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white px-2 py-0.5 rounded shadow border border-amber-100 z-20 flex items-center gap-1">
                 <Star size={10} className="text-amber-500 fill-amber-500" />
                 <span className="font-black text-slate-800 text-[8px] md:text-[10px] uppercase">#1 Choice</span>
              </div>
            </div>
          </div>

          {/* Mobile Grid (Hidden on Desktop) */}
          <div className="grid grid-cols-2 gap-3 order-2 lg:hidden w-full">
            {benefits.map((benefit, idx) => (
              <BenefitCard key={idx} benefit={benefit} />
            ))}
          </div>

          {/* Desktop Layout: Left Side Cards */}
          <div className="hidden lg:flex flex-col gap-6 order-1">
            <BenefitCard benefit={benefits[0]} />
            <BenefitCard benefit={benefits[2]} />
          </div>

          {/* Desktop Layout: Right Side Cards */}
          <div className="hidden lg:flex flex-col gap-6 order-3">
            <BenefitCard benefit={benefits[1]} />
            <BenefitCard benefit={benefits[3]} />
          </div>

        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit }: { benefit: any }) {
  const Icon = benefit.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`
        group flex items-start md:items-center gap-2 md:gap-4 p-2.5 md:p-5 rounded-xl md:rounded-2xl bg-white border-2 border-slate-50
        transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-default
        w-full lg:w-[300px] ${benefit.border}
      `}
    >
      {/* Icon Container */}
      <div className={`
        flex-shrink-0 w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-xl 
        flex items-center justify-center transition-transform group-hover:rotate-3
        ${benefit.bg} ${benefit.color}
      `}>
        <Icon size={18} className="md:w-7 md:h-7" strokeWidth={2.5} />
      </div>

      {/* Text Container */}
      <div className="text-left">
        <h3 className="text-[11px] md:text-base font-black text-slate-900 leading-tight uppercase mb-0.5">
          {benefit.title}
        </h3>
        <p className="text-[9px] md:text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors leading-tight">
          {benefit.description}
        </p>
      </div>
    </motion.div>
  );
}