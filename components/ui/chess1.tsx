"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  Lightbulb, 
  Timer, 
  Trophy, 
  GraduationCap, 
  ArrowRight, 
  Sparkles 
} from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: Zap,
      title: "Focus & Concentration",
      desc: "Trains children to stay attentive and plan with absolute clarity.",
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "hover:border-rose-300",
    },
    {
      icon: Lightbulb,
      title: "Strong Thinking Skills",
      desc: "Develops logic, problem-solving, and strategic decision-making.",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "hover:border-blue-300",
    },
    {
      icon: Timer,
      title: "Patience & Discipline",
      desc: "Teaches the value of analyzing choices under pressure.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "hover:border-emerald-300",
    },
    {
      icon: Trophy,
      title: "Confidence & Resilience",
      desc: "Helps kids learn from mistakes and grow stronger every game.",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "hover:border-amber-300",
    },
    {
      icon: GraduationCap,
      title: "Life Success",
      desc: "Skills that translate directly to school and future careers.",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "hover:border-indigo-300",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#C9A227 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 font-black text-[10px] md:text-xs uppercase tracking-widest mb-4 shadow-sm"
          >
            <Sparkles size={14} className="fill-amber-500" /> 
            The Aacharya Edge
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight"
          >
            Developing Minds, <br/>
            <span className="text-[#C9A227] italic">One Move at a Time</span> 🧠
          </motion.h2>
        </div>

        {/* Slim Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {benefits.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`
                group bg-white p-5 rounded-2xl border-2 border-slate-100
                shadow-[0_8px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-amber-200/30 
                transition-all duration-300 hover:-translate-y-1
                flex items-center gap-4 cursor-default
                ${item.border}
              `}
            >
              {/* Icon - Compact Size */}
              <div className={`
                flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center 
                transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
                ${item.bg} ${item.color}
              `}>
                <item.icon size={24} strokeWidth={2.5} />
              </div>

              {/* Text Content */}
              <div className="flex-grow">
                <h3 className="font-black text-slate-900 text-sm md:text-base mb-0.5 tracking-tight uppercase">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors leading-snug">
                  {item.desc}
                </p>
              </div>

              {/* Minimal Arrow */}
              <div className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                <ArrowRight size={16} className="text-[#C9A227]" />
              </div>
            </motion.div>
          ))}
          
          {/* Final "CTA" Slim Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="group bg-slate-900 p-5 rounded-2xl flex items-center justify-center gap-3 md:col-span-1 lg:col-span-1 border-2 border-slate-900"
          >
             <div className="bg-amber-500 p-2 rounded-lg text-white">
                <Trophy size={18} />
             </div>
             <span className="text-white font-black uppercase tracking-widest text-[10px] md:text-xs">
               Join the Champions
             </span>
          </motion.div>
        </div>

      </div>
    </section>
  );
}