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
      description: "We move beyond rote learning. Our focus is on building deep conceptual understanding, ensuring students grasp the 'Why' and 'How' behind every topic.",
      icon: <Lightbulb className="w-8 h-8 text-amber-500" />,
      bg: "bg-amber-50",
      border: "border-amber-100"
    },
    {
      title: "Cognitive Development",
      description: "Through tools like Abacus and Chess, we stimulate brain development, enhancing memory, concentration, and logical reasoning skills from an early age.",
      icon: <BrainCircuit className="w-8 h-8 text-indigo-500" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100"
    },
    {
      title: "Hands-on Learning",
      description: "Especially in Robotics and Science, we believe in 'Learning by Doing'. Students build, code, and experiment to validate theoretical knowledge.",
      icon: <Puzzle className="w-8 h-8 text-emerald-500" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100"
    },
    {
      title: "Personalized Mentorship",
      description: "Every child learns differently. Our small batch sizes allow mentors to tailor their teaching style to individual learning curves.",
      icon: <HeartHandshake className="w-8 h-8 text-rose-500" />,
      bg: "bg-rose-50",
      border: "border-rose-100"
    }
  ];

  return (
    <section className="py-20 bg-white font-sans relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 z-0"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-7xl">
        
        {/* --- Header --- */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 mb-6">
            <BookOpen className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Our Methodology</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            We Don't Just Teach. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">
              We Ignite Curiosity.
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 leading-relaxed">
            At Aacharya, our philosophy is rooted in the belief that education should be holistic, engaging, and future-ready. We nurture the intellect and character simultaneously.
          </p>
        </div>

        {/* --- The Pillars Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative">
          
          {/* Central Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full border-4 border-slate-100 z-20 flex items-center justify-center shadow-xl">
             <Target className="w-10 h-10 text-slate-300" />
          </div>

          {pillars.map((pillar, idx) => (
            <div 
              key={idx}
              className={`
                group relative p-8 rounded-3xl border ${pillar.border} bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                ${idx % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}
              `}
            >
              {/* Background Blob */}
              <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${pillar.bg}`}></div>
              
              <div className={`relative z-10 flex flex-col ${idx % 2 === 0 ? 'md:items-end' : 'md:items-start'}`}>
                {/* Icon Box */}
                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 bg-white
                  ${idx % 2 === 0 ? 'md:order-last md:mt-6 md:mb-0' : ''}
                `}>
                  {pillar.icon}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                  {pillar.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* --- Bottom Statement --- */}
        <div className="mt-20 text-center">
           <div className="inline-block relative p-8 bg-slate-900 rounded-3xl text-white max-w-4xl shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <h3 className="text-2xl md:text-3xl font-serif italic mb-4 relative z-10">
                "Education is not the filling of a pail, but the lighting of a fire."
              </h3>
              <p className="text-slate-400 font-medium text-sm uppercase tracking-widest relative z-10">
                — William Butler Yeats
              </p>
           </div>
        </div>

      </div>
    </section>
  );
}