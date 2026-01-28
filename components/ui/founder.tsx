"use client";

import React from "react";
import { 
  User, 
  Award, 
  GraduationCap, 
  CheckCircle2,
  Quote,
  Star,
  BookOpen,
  Trophy
} from "lucide-react";

const FounderSection: React.FC = () => {
  return (
    <section className="relative py-12 md:py-16 bg-white overflow-hidden font-sans">
      
      {/* --- Background Texture --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50/50 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        
        {/* --- CENTERED HEADER (Tighter Margins) --- */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-amber-50 border border-amber-200">
            <User className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[10px] md:text-xs font-bold text-amber-800 uppercase tracking-[0.2em]">Our Leadership</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            The Visionary <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">Behind Aacharya</span>
          </h2>
        </div>

        {/* --- WIDE HORIZONTAL LAYOUT (Reduces Vertical Length) --- */}
        <div className="flex flex-col lg:flex-row items-stretch gap-8 xl:gap-12">
          
          {/* LEFT: Image (Horizontal/Square format to save height) */}
          <div className="lg:w-1/3 shrink-0">
            <div className="relative h-full min-h-[350px] md:min-h-[450px] rounded-[2rem] overflow-hidden border-[4px] border-white shadow-xl bg-slate-900 group">
              <img 
                src="/chess-cen.jpeg" 
                alt="Dr. Rajesh Gunti" 
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-bold text-white tracking-tight">Dr. Rajesh Gunti</h3>
                <p className="text-amber-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                  <Star className="w-3 h-3 fill-amber-400" /> Founder
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Content (Split into 2 internal columns to use width) */}
          <div className="lg:w-2/3 flex flex-col justify-center">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12">
              
              {/* Internal Col 1: Bio */}
              <div className="space-y-4">
                <div className="relative">
                  <Quote className="absolute -top-4 -left-4 w-10 h-10 text-slate-100 -z-10" />
                  <p className="text-lg text-slate-700 font-medium leading-relaxed italic">
                    "Education is the formation of character and competence. We build foundations for the leaders of tomorrow."
                  </p>
                </div>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                  A visionary academician with over <strong>20 years</strong> of experience. Dr. Rajesh (M.Tech, Ph.D) is a renowned researcher whose work is featured in SCI and SCOPUS indexed publications, with a mission to nurture a lifelong love for learning.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-400" /> M.Tech, Ph.D
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-200/50">
                    <Trophy className="w-3.5 h-3.5" /> Best Teacher Awardee
                  </span>
                </div>
              </div>

              {/* Internal Col 2: Credentials Grid (Moves facts horizontally) */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-center">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: <BookOpen />, title: "20+ Years", desc: "Teaching & Leadership" },
                    { icon: <Star />, title: "150+ Lectures", desc: "Invited Guest Speaker" },
                    { icon: <Award />, title: "500+ Initiatives", desc: "Community Focused" },
                    { icon: <CheckCircle2 />, title: "SCI Researcher", desc: "IIT & NIT Presentations" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm border border-slate-100 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                        {React.cloneElement(item.icon as React.ReactElement, { size: 18 })}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Stats Ribbon (Full Width within content area) */}
            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-8 md:gap-16">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900">20+</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900">SCI</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Research</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900">JNTUH</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alumni</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FounderSection; 
