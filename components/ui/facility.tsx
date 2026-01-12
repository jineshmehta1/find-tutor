"use client"

import React from "react"
import { 
  Wind, ShieldCheck, Bot, TentTree, 
  GlassWater, Star, CheckCircle, 
  Target, Brain, Heart, Rocket, Languages, Armchair,
  Images, Sparkles, Droplets
} from "lucide-react"

export default function FacilitiesSection() {
  
  const facilities = [
    { 
      icon: Wind, 
      label: "Classrooms & Furniture", 
      desc: "Spacious classrooms with child-friendly furniture",
      color: "text-amber-600", bg: "bg-amber-100", border: "group-hover:border-amber-400"
    },
    { 
      icon: ShieldCheck, 
      label: "Hygiene & Safety", 
      desc: "Safe, secure campus with high hygiene standards",
      color: "text-emerald-600", bg: "bg-emerald-100", border: "group-hover:border-emerald-400"
    },
    { 
      icon: Bot, 
      label: "Robotics & STEM Lab", 
      desc: "Hands-on learning with modern technology",
      color: "text-blue-600", bg: "bg-blue-100", border: "group-hover:border-blue-400"
    },
    { 
      icon: TentTree, 
      label: "Play Areas", 
      desc: "Dedicated indoor and outdoor play spaces",
      color: "text-rose-600", bg: "bg-rose-100", border: "group-hover:border-rose-400"
    },
    { 
      icon: GlassWater, 
      label: "Water & Washrooms", 
      desc: "Clean washrooms & purified drinking water",
      color: "text-cyan-600", bg: "bg-cyan-100", border: "group-hover:border-cyan-400"
    },
  ]

  const outcomes = [
    { text: "Confident Communicators", icon: Languages },
    { text: "Creative & Critical Thinkers", icon: Brain },
    { text: "Independent Learners", icon: Target },
    { text: "Emotionally Strong Children", icon: Heart },
    { text: "Future-Ready Mindset", icon: Rocket },
  ]

  const facilityImages = [
    "/fac1.jpeg", "/fac2.jpeg", "/fac3.jpeg", "/fac4.jpeg", "/fac5.jpeg", "/fac6.jpeg"
  ]

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 font-black text-[10px] md:text-xs uppercase tracking-widest mb-4 shadow-sm">
            <Star size={14} className="fill-amber-500" /> Infrastructure
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
            Facilities at <span className="text-amber-500 italic">Aacharya</span> 🏰
          </h2>
        </div>
        
        {/* --- SLIM INFRASTRUCTURE GRID (5 Items) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-16">
          {facilities.map((fac, i) => (
            <div 
              key={i} 
              className={`
                group bg-white p-5 md:p-6 rounded-2xl md:rounded-[1.5rem] border-2 border-slate-100
                shadow-[0_8px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-amber-200/30 
                transition-all duration-300 hover:-translate-y-1
                flex items-center gap-4 cursor-default
                ${fac.border}
                ${i === 3 ? 'lg:col-start-1' : ''} 
              `}
            >
              <div className={`
                flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all duration-500 
                group-hover:scale-110 group-hover:rotate-3
                ${fac.bg} ${fac.color}
              `}>
                <fac.icon size={24} className="md:w-7 md:h-7" strokeWidth={2.5} />
              </div>
              
              <div>
                <span className="block font-black text-slate-900 text-sm md:text-base mb-0.5 tracking-tight uppercase">
                  {fac.label}
                </span>
                <span className="block text-xs md:text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                  {fac.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* --- SLIDING IMAGE SECTION --- */}
        <div className="relative mb-20">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter">Campus Gallery</h3>
             <div className="h-px flex-grow mx-4 bg-slate-100 hidden md:block"></div>
             <div className="inline-flex items-center gap-2 text-amber-600 font-black uppercase tracking-widest text-[10px]">
                <Images size={14} /> Virtual Tour
             </div>
          </div>

          <div className="relative flex overflow-hidden group">
            <div className="flex gap-4 animate-marquee whitespace-nowrap py-2">
              {[...facilityImages, ...facilityImages].map((src, index) => (
                <div 
                  key={index} 
                  className="w-[260px] md:w-[350px] h-[180px] md:h-[240px] flex-shrink-0 rounded-2xl overflow-hidden border-4 border-white shadow-md transition-transform hover:scale-105 duration-500"
                >
                  <img 
                    src={src} 
                    alt={`Facility ${index}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          </div>
        </div>

        {/* --- LEARNING OUTCOMES BANNER --- */}
        <div className="bg-[#FFD642] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1 text-center lg:text-left">
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-3">
                Learning <br className="hidden md:block"/> 
                <span className="text-white drop-shadow-sm uppercase">Outcomes</span>
              </h3>
              <p className="text-slate-900 font-bold text-xs md:text-sm opacity-90 uppercase tracking-wider">
                Holistic evolution of every child.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {outcomes.map((outcome, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-3.5 md:p-4 rounded-xl flex items-center gap-3 shadow-md border-b-4 border-amber-600/10"
                >
                  <div className="bg-amber-500 p-2 rounded-lg text-white">
                    <outcome.icon size={18} strokeWidth={3} />
                  </div>
                  <span className="text-slate-900 font-black text-xs md:text-sm uppercase tracking-tight">
                    {outcome.text}
                  </span>
                </div>
              ))}
              
              <div className="sm:col-span-2 bg-slate-900 p-3 rounded-xl flex items-center justify-center gap-3">
                 <CheckCircle className="text-amber-400" size={16} />
                 <span className="text-white font-black uppercase tracking-[0.1em] text-[10px] md:text-xs">
                   Preparing children for the world of tomorrow
                 </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}