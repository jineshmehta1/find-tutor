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
      desc: "Trains children to think calmly, stay attentive, and plan ahead with absolute clarity.",
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "hover:border-rose-200",
      gradient: "from-rose-50 to-white",
    },
    {
      icon: Lightbulb,
      title: "Strong Thinking Skills",
      desc: "Develops deep logic, complex problem-solving, and strategic decision-making abilities.",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "hover:border-blue-200",
      gradient: "from-blue-50 to-white",
    },
    {
      icon: Timer,
      title: "Patience & Discipline",
      desc: "Teaches children the value of waiting, analyzing, and making thoughtful choices under pressure.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "hover:border-emerald-200",
      gradient: "from-emerald-50 to-white",
    },
    {
      icon: Trophy,
      title: "Confidence & Resilience",
      desc: "Helps kids learn from their mistakes and grow stronger with every game played.",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "hover:border-amber-200",
      gradient: "from-amber-50 to-white",
    },
    {
      icon: GraduationCap,
      title: "Academic & Life Success",
      desc: "Enhances memory and creativity—skills that translate directly to school and future careers.",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "hover:border-indigo-200",
      gradient: "from-indigo-50 to-white",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden selection:bg-amber-100">
      
      {/* Background: Subtle Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#C9A227 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 shadow-sm text-amber-800 font-black text-xs uppercase tracking-widest mb-6"
          >
            <Sparkles size={14} className="text-[#C9A227] fill-[#C9A227]" /> 
            The Aacharya Edge
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter"
          >
            Developing Minds, <br/>
            <span className="text-[#C9A227]">One Move at a Time 🧠</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-6 text-lg md:text-xl max-w-2xl mx-auto font-bold leading-tight"
          >
            Chess is more than a game—it’s a gymnasium for the brain. 
            Here is how we shape the leaders of tomorrow.
          </motion.p>
        </div>

        {/* Benefits Grid - Optimized for 5 items (3+2 layout on large screens) */}
        <div className="flex flex-wrap justify-center gap-6">
          {benefits.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`
                group relative bg-gradient-to-br ${item.gradient} 
                p-8 rounded-[2.5rem] border-2 border-slate-50 ${item.border}
                shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 
                hover:-translate-y-2 transition-all duration-500
                flex flex-col w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)]
              `}
            >
              {/* Icon Container */}
              <div className={`
                w-16 h-16 rounded-2xl ${item.bg} ${item.color} 
                flex items-center justify-center mb-8 
                group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500
                shadow-sm
              `}>
                <item.icon size={32} strokeWidth={2.5} />
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-[#C9A227] transition-colors tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-bold">
                  {item.desc}
                </p>
              </div>

              {/* Subtle Bottom Accent */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between overflow-hidden">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                  Aacharya Excellence
                </span>
                <div className="translate-x-10 group-hover:translate-x-0 transition-transform duration-500">
                   <ArrowRight className="w-5 h-5 text-[#C9A227]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}