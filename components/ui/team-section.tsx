"use client";

import React from 'react';
import { 
  Lightbulb, 
  BrainCircuit, 
  Puzzle, 
  HeartHandshake, 
  BookOpen, 
  Target 
} from 'lucide-react';

export default function TeachingPhilosophySection() {
  
  const pillars = [
    {
      title: "Conceptual Clarity",
      description: "We move beyond rote learning. Our focus is on building deep conceptual understanding, ensuring students grasp the 'Why' and 'How'.",
      icon: <Lightbulb className="w-6 h-6 md:w-8 md:h-8 text-amber-500" />,
      bg: "bg-amber-50",
      border: "border-amber-100"
    },
    {
      title: "Cognitive Development",
      description: "Through tools like Abacus and Chess, we stimulate brain development, enhancing memory, concentration, and logical reasoning.",
      icon: <BrainCircuit className="w-6 h-6 md:w-8 md:h-8 text-indigo-500" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100"
    },
    {
      title: "Hands-on Learning",
      description: "In Robotics and Science, we believe in 'Learning by Doing'. Students build, code, and experiment to validate theory.",
      icon: <Puzzle className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100"
    },
    {
      title: "Personalized Mentorship",
      description: "Small batch sizes allow mentors to tailor their teaching style to individual learning curves and children's needs.",
      icon: <HeartHandshake className="w-6 h-6 md:w-8 md:h-8 text-rose-500" />,
      bg: "bg-rose-50",
      border: "border-rose-100"
    }
  ];

  return (
    <section className="py-12 md:py-24 bg-white font-sans relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="container mx-auto px-5 md:px-12 relative z-10 max-w-7xl">
        
        {/* --- Header: Slimmer on Mobile --- */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 mb-4">
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Our Methodology</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            We Don't Just Teach. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">
              We Ignite Curiosity.
            </span>
          </h2>
          
          <p className="text-sm md:text-lg text-slate-600 leading-relaxed px-4">
            Our philosophy is rooted in education that is engaging, and future-ready.
          </p>
        </div>

        {/* --- The Pillars Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 relative">
          
          {/* Central Target Icon (Desktop Only) */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full border-4 border-slate-50 z-20 items-center justify-center shadow-lg">
             <Target className="w-8 h-8 text-slate-200" />
          </div>

          {pillars.map((pillar, idx) => (
            <div 
              key={idx}
              className={`
                group relative p-5 md:p-8 rounded-2xl md:rounded-3xl border ${pillar.border} bg-white transition-all duration-300
                flex flex-row md:flex-col items-start
                ${idx % 2 === 0 ? 'md:text-right md:items-end' : 'md:text-left md:items-start'}
              `}
            >
              {/* Desktop Hover Bg */}
              <div className={`absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${pillar.bg}`}></div>
              
              {/* Icon: Small/Left on Mobile, Larger/Alternating on Desktop */}
              <div className={`
                relative z-10 shrink-0
                w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 bg-white
                mr-4 md:mr-0 ${idx % 2 === 0 ? 'md:mb-6 md:order-last' : 'md:mb-6'}
              `}>
                {pillar.icon}
              </div>

              {/* Text Content */}
              <div className="relative z-10">
                <h3 className="text-lg md:text-2xl font-bold text-slate-900 mb-1 md:mb-3 group-hover:text-amber-600 transition-colors">
                  {pillar.title}
                </h3>
                
                <p className="text-xs md:text-base text-slate-500 md:text-slate-600 leading-relaxed md:leading-normal line-clamp-2 md:line-clamp-none">
                  {pillar.description}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* --- Bottom Statement: Slimmer on Mobile --- */}
        <div className="mt-12 md:mt-20 text-center">
           <div className="inline-block relative p-6 md:p-8 bg-slate-900 rounded-2xl md:rounded-3xl text-white max-w-4xl shadow-xl overflow-hidden">
              <h3 className="text-lg md:text-2xl font-serif italic mb-2 relative z-10">
                "Education is not the filling of a pail, but the lighting of a fire."
              </h3>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest relative z-10">
                — William Butler Yeats
              </p>
           </div>
        </div>

      </div>
    </section>
  );
}