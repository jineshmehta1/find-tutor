"use client";

import { motion } from "framer-motion";
import { Award, GraduationCap } from "lucide-react";

export default function TrustBar() {
  return (
    <section className="bg-white border-b border-slate-100 relative z-40">
      {/* Subtle top accent line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-5xl mx-auto px-0 md:px-6 py-3 md:py-6">
        <div className="flex flex-row items-center justify-center gap-0 md:gap-12">
          
          {/* --- LEFT ITEM: GOVT RECOGNITION --- */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-4 px-2"
          >
            <div className="shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm transition-transform duration-500 hover:scale-110">
              <Award className="text-amber-600 w-4 h-4 md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] md:text-[11px] font-black uppercase tracking-wider text-slate-600 leading-none mb-0.5 md:mb-1">
                Official Recognition
              </span>
              <span className="text-[10px] md:text-lg font-black text-slate-900 uppercase md:normal-case tracking-tight leading-none">
                Govt. <span className="md:hidden">of AP</span> 
                <span className="hidden md:inline">of Andhra Pradesh</span>
              </span>
            </div>
          </motion.div>

          {/* --- VERTICAL DIVIDER --- */}
          <div className="w-px h-8 md:h-12 bg-slate-100 mx-2 md:mx-0" />

          {/* --- RIGHT ITEM: SOCIETY INFO --- */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-4 px-2"
          >
            <div className="shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm transition-transform duration-500 hover:scale-110">
              <GraduationCap className="text-blue-600 w-4 h-4 md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] md:text-[11px] font-black uppercase tracking-wider text-slate-600 leading-none mb-0.5 md:mb-1">
                Academic Partner
              </span>
              <span className="text-[10px] md:text-lg font-black text-slate-900 uppercase md:normal-case tracking-tight leading-none">
                Duckling <span className="md:hidden">Society</span>
                <span className="hidden md:inline">Educational Society</span>
              </span>
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Bottom accent shadow */}
      <div className="h-[1px] w-full bg-slate-50 shadow-[0_1px_2px_rgba(0,0,0,0.03)]" />
    </section>
  );
}