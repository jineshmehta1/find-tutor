"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const CurriculumSun = () => {
  return (
    <section className="bg-[#FFD642] py-16 md:py-24 px-4 overflow-hidden relative selection:bg-amber-900 selection:text-white">
      {/* Decorative background circle */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-white/20 rounded-full blur-3xl -z-0" />
      
      <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* LEFT SIDE: THE CHART IMAGE */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative flex items-center justify-center w-full order-last lg:order-first"
        >
          {/* 
              REPLACE '/curriculum-chart.png' with your actual image path.
              The container uses aspect-square to keep it circular/balanced.
          */}
          <div className="relative w-full max-w-[500px] md:max-w-[600px] aspect-square">
            <Image
              src="/sun2.png" // Put your image in the public folder
              alt="Aacharya International Curriculum Chart"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Optional: Rotating glow effect behind the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent rounded-full animate-spin-slow -z-10 blur-2xl" />
        </motion.div>

        {/* RIGHT SIDE: TEXT CONTENT */}
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
            className="text-5xl md:text-7xl xl:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter"
          >
            A World of <br />
            <span className="text-white drop-shadow-md">Excellence.</span><br />
            <span className="text-amber-900/30">One School.</span>
          </motion.h2>

          <motion.p 
            className="text-slate-900 text-lg md:text-2xl font-bold leading-tight max-w-xl mx-auto lg:mx-0"
          >
            At Aacharya, we integrate the best of global 
            pedagogies to create a customized foundation for every child.
          </motion.p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <button className="group bg-slate-900 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-2xl flex items-center gap-3">
              Explore Programs
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default CurriculumSun;