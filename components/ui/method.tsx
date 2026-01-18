"use client";

import { Crown, Swords, BookOpen, Target, TrendingUp, CheckCircle2 } from "lucide-react";

export default function MethodologySection() {
  
  const phases = [
    { 
      step: "01",
      title: "The Opening", 
      desc: "Mastering principles, rapid development, and controlling the center.", 
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "group-hover:border-blue-300"
    },
    { 
      step: "02",
      title: "The Middlegame", 
      desc: "Tactical combinations, positional play, and attacking plans.", 
      icon: Swords,
      color: "text-amber-600",
      bg: "bg-amber-100",
      border: "group-hover:border-amber-300"
    },
    { 
      step: "03",
      title: "The Endgame", 
      desc: "King activity, pawn promotion, and theoretical checkmate patterns.", 
      icon: Crown,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      border: "group-hover:border-emerald-300"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-50 rounded-full blur-[100px] -z-10 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-50 rounded-full blur-[80px] -z-10"></div>
      
      {/* Abstract Chess Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: Content & Roadmap */}
          <div className="space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs uppercase tracking-wider mb-4">
                <Target size={14} /> Curriculum
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                The <span className="text-amber-500 relative inline-block">
                  Grandmaster
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-amber-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" /></svg>
                </span> Roadmap
              </h2>
              <p className="text-slate-600 text-lg font-medium mt-6 leading-relaxed">
                Chess isn't just about moving pieces; it's about a systematic approach to thinking. Our curriculum covers the three pillars of mastery.
              </p>
            </div>
            
            {/* The Timeline List */}
            <div className="space-y-6 relative">
              {/* Vertical Connecting Line */}
              <div className="absolute left-[35px] top-8 bottom-8 w-0.5 border-l-2 border-dashed border-slate-200 z-0"></div>

              {phases.map((phase, i) => (
                <div key={i} className={`flex gap-6 items-start relative z-10 group`}>
                  
                  {/* Icon Box */}
                  <div className={`
                    w-[70px] h-[70px] rounded-2xl flex flex-col items-center justify-center shrink-0 
                    border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-110
                    ${phase.bg} ${phase.color}
                  `}>
                    <phase.icon size={24} strokeWidth={2.5} />
                    <span className="text-[10px] font-black opacity-60 mt-1">{phase.step}</span>
                  </div>

                  {/* Text Card */}
                  <div className={`
                    flex-1 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm 
                    transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${phase.border}
                  `}>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">{phase.title}</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{phase.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Image Composition */}
          <div className="relative perspective-1000">
             
             {/* Back Decorative Box */}
             <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-[2.5rem] rotate-6 opacity-20 transform translate-x-4"></div>
             
             {/* Main Image */}
             <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-slate-100">
               <img 
                 src="/pic16.webp" 
                 className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
                 alt="Chess Coaching"
               />
               
               {/* Overlay Gradient */}
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>

               {/* Floating Stats Card 1 */}
               <div className="absolute top-8 right-8 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-float">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Live Analysis</span>
               </div>

               {/* Floating Stats Card 2 (Bottom) */}
               <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Tactical Rating</p>
                      <p className="text-2xl font-black text-slate-900">2200+</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-amber-500 rounded-full"></div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-500">
                    <CheckCircle2 size={12} className="text-amber-500" />
                    <span>Top 5% of Players</span>
                  </div>
               </div>
             </div>
          </div>

        </div>
      </div>
      
      {/* Float Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}