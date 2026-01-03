"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe, Sun, ArrowRight } from 'lucide-react';

const curriculumData = [
  {
    title: "Reggio Emilia",
    description: "Creative, project-based experiences that encourage exploration and self-expression",
    color: "border-rose-400",
    shadow: "shadow-rose-100"
  },
  {
    title: "Waldorf",
    description: "Imagination-driven learning through music, movement, stories, and nature",
    color: "border-orange-400",
    shadow: "shadow-orange-100"
  },
  {
    title: "NEP 2020",
    description: "Strong foundation in literacy, numeracy, life skills, and holistic development",
    color: "border-blue-400",
    shadow: "shadow-blue-100"
  },
  {
    title: "Project Zero (Harvard)",
    description: "Learning that makes children's thinking visible, nurturing deep understanding",
    color: "border-amber-500",
    shadow: "shadow-amber-100"
  },
  {
    title: "Montessori",
    description: "Hands-on learning that builds independence, focus, and fine motor skills",
    color: "border-emerald-400",
    shadow: "shadow-emerald-100"
  },
  {
    title: "EYFS (UK)",
    description: "Play-based learning that develops communication, confidence, and social skills",
    color: "border-indigo-400",
    shadow: "shadow-indigo-100"
  },
];

const CurriculumSun = () => {
  return (
    <section className="bg-[#FFD642] py-16 md:py-24 px-4 overflow-hidden relative selection:bg-amber-900 selection:text-white">
      {/* Decorative background circle */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-white/20 rounded-full blur-3xl -z-0" />
      
      <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* LEFT SIDE: THE SUN DIAGRAM (Visual Core) */}
        <div className="relative flex flex-col items-center justify-center min-h-[400px] md:min-h-[600px] w-full">
          
          {/* Central Hub - Animated Center */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="z-30 w-44 h-44 md:w-64 md:h-64 bg-white rounded-full shadow-2xl flex items-center justify-center text-center p-6 md:p-8 border-[10px] md:border-[15px] border-amber-400 relative"
          >
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-amber-200 animate-spin-slow" />
            <div className="relative">
              <h3 className="font-black text-slate-900 text-lg md:text-2xl leading-none uppercase tracking-tighter mb-2">
                AACHARYA
              </h3>
              <div className="h-1 w-12 bg-amber-500 mx-auto mb-2" />
              <p className="text-slate-800 text-[10px] md:text-sm font-bold leading-tight uppercase tracking-widest">
                International<br/>
                <span className="text-amber-600">Curriculum</span><br/>
                Integration
              </p>
            </div>
          </motion.div>

          {/* RADIAL CARDS (Hidden on Mobile, Orbital on Desktop) */}
          <div className="absolute inset-0 hidden xl:block">
            {[
              { pos: "top-[5%] left-[50%] -translate-x-1/2", data: curriculumData[0] },
              { pos: "top-[20%] right-[0%]", data: curriculumData[1] },
              { pos: "top-[50%] -translate-y-1/2 -right-[15%]", data: curriculumData[2] },
              { pos: "bottom-[15%] right-[5%]", data: curriculumData[3] },
              { pos: "bottom-[5%] left-[50%] -translate-x-1/2", data: curriculumData[4] },
              { pos: "top-[50%] -translate-y-1/2 -left-[15%]", data: curriculumData[5] },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`absolute ${item.pos} w-56 group`}
              >
                <div className={`bg-white p-5 rounded-3xl shadow-xl border-l-8 ${item.data.color} transition-all duration-500 group-hover:-translate-y-3 group-hover:rotate-2`}>
                  <h4 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-tight">
                    {item.data.title}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-500 leading-snug">
                    {item.data.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* MOBILE & TABLET LAYOUT (Responsive Grid) */}
          <div className="xl:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full">
            {curriculumData.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white p-6 rounded-2xl shadow-lg border-l-8 ${item.color} flex flex-col justify-center`}
              >
                <h4 className="font-black text-slate-900 text-sm uppercase mb-2 tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  {item.title}
                </h4>
                <p className="text-xs font-bold text-slate-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: THE TEXT CONTENT (Authoritative Text) */}
        <div className="text-center lg:text-left space-y-6 md:space-y-10 order-first lg:order-last">
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 border border-white/40 text-slate-900 font-black text-xs md:text-sm uppercase tracking-widest shadow-sm"
          >
            <Sparkles size={16} className="text-amber-700 animate-pulse" />
            Global Academic Standards
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl xl:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter"
          >
            A World of <br />
            <span className="text-white drop-shadow-md">Excellence.</span><br />
            <span className="text-amber-900/30">One School.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-900 text-lg md:text-2xl font-bold leading-tight max-w-xl mx-auto lg:mx-0"
          >
            At Aacharya, we don’t just follow one system. We integrate the best of global 
            pedagogies to create a customized foundation for every child’s future.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center lg:justify-start gap-4"
          >
            <button className="group bg-slate-900 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-2xl flex items-center gap-3 active:scale-95">
              Explore Programs
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="bg-white/30 backdrop-blur-md text-slate-900 border-2 border-white/50 px-8 py-4 md:py-5 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all">
              Our Vision
            </button>
          </motion.div>
        </div>

      </div>

      {/* Additional SEO/Brand Detail */}
      <div className="mt-20 pt-10 border-t border-black/5 flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale">
         <div className="flex items-center gap-2 font-black text-xs uppercase tracking-tighter"><Globe size={18}/> UK Standards</div>
         <div className="flex items-center gap-2 font-black text-xs uppercase tracking-tighter"><Sun size={18}/> NEP Aligned</div>
         <div className="flex items-center gap-2 font-black text-xs uppercase tracking-tighter"><Sparkles size={18}/> Project Zero</div>
      </div>
    </section>
  );
};

export default CurriculumSun;