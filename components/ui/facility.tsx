"use client"

import React from "react"
import { 
  Wind, ShieldCheck, Gamepad2, Grid3x3, Bot, TentTree, 
  Droplets, GlassWater, Star, CheckCircle, 
  Target, Brain, Heart, Rocket, Languages, Armchair,
  Images
} from "lucide-react"

export default function FacilitiesSection() {
  
  const facilities = [
    { 
      icon: Wind, 
      label: "Spacious Classrooms", 
      desc: "Well-ventilated with natural light",
      color: "text-amber-600", bg: "bg-amber-100", border: "group-hover:border-amber-400"
    },
    { 
      icon: Armchair, 
      label: "Child-Friendly Furniture", 
      desc: "Age-appropriate for comfort & posture",
      color: "text-blue-600", bg: "bg-blue-100", border: "group-hover:border-blue-400"
    },
    { 
      icon: ShieldCheck, 
      label: "Safe & Secure Campus", 
      desc: "CCTV & controlled entry/exit",
      color: "text-emerald-600", bg: "bg-emerald-100", border: "group-hover:border-emerald-400"
    },
    { 
      icon: Gamepad2, 
      label: "Activity Rooms", 
      desc: "Art, music, movement & indoor games",
      color: "text-purple-600", bg: "bg-purple-100", border: "group-hover:border-purple-400"
    },
    { 
      icon: Grid3x3, 
      label: "Chess & Abacus Rooms", 
      desc: "Quiet zones with kits & material",
      color: "text-rose-600", bg: "bg-rose-100", border: "group-hover:border-rose-400"
    },
    { 
      icon: Bot, 
      label: "Robotics & STEM Lab", 
      desc: "Hands-on learning with models",
      color: "text-orange-600", bg: "bg-orange-100", border: "group-hover:border-orange-400"
    },
    { 
      icon: TentTree, 
      label: "Indoor & Outdoor Play", 
      desc: "Soft play for motor-skills",
      color: "text-pink-600", bg: "bg-pink-100", border: "group-hover:border-pink-400"
    },
    { 
      icon: Droplets, 
      label: "Clean Washrooms", 
      desc: "Sanitized & child-friendly",
      color: "text-cyan-600", bg: "bg-cyan-100", border: "group-hover:border-cyan-400"
    },
    { 
      icon: GlassWater, 
      label: "Drinking Water", 
      desc: "Safe, purified & easy-access",
      color: "text-indigo-600", bg: "bg-indigo-100", border: "group-hover:border-indigo-400"
    },
  ]

  const outcomes = [
    { text: "Confident Communicators", icon: Languages },
    { text: "Creative & Critical Thinkers", icon: Brain },
    { text: "Independent Learners", icon: Target },
    { text: "Emotionally Strong Children", icon: Heart },
    { text: "Future-Ready Mindset", icon: Rocket },
  ]

  // Add your facility image paths here
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 font-black text-[10px] md:text-xs uppercase tracking-widest mb-4 md:mb-6 shadow-sm">
            <Star size={14} className="fill-amber-500" /> Infrastructure
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight">
            Facilities at <span className="text-amber-500 italic">Aacharya</span> 🏰
          </h2>
          <p className="text-slate-500 mt-4 text-sm md:text-lg font-bold max-w-2xl mx-auto uppercase tracking-wide">
            Designed for safety, comfort, and curious minds.
          </p>
        </div>
        
        {/* --- INFRASTRUCTURE GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-24">
          {facilities.map((fac, i) => (
            <div 
              key={i} 
              className={`
                group bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 border-slate-100
                shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:shadow-amber-200/40 
                transition-all duration-500 hover:-translate-y-2
                flex items-start gap-4 md:gap-5 cursor-default
                ${fac.border}
              `}
            >
              <div className={`
                flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 
                group-hover:scale-110 group-hover:rotate-6
                ${fac.bg} ${fac.color}
              `}>
                <fac.icon size={24} className="md:w-[28px] md:h-[28px]" strokeWidth={2.5} />
              </div>
              
              <div>
                <span className="block font-black text-slate-900 text-base md:text-lg mb-1 tracking-tight leading-none uppercase">
                  {fac.label}
                </span>
                <span className="block text-xs md:text-sm font-bold text-slate-400 group-hover:text-amber-600 transition-colors">
                  {fac.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* --- LEARNING OUTCOMES BANNER --- */}
        <div className="bg-[#FFD642] rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 relative overflow-hidden shadow-2xl shadow-amber-200/50 mb-16 md:mb-24">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 grid lg:grid-cols-3 gap-8 md:gap-12 items-center">
            <div className="lg:col-span-1 text-center lg:text-left">
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-4">
                Learning <br className="hidden md:block"/> 
                <span className="text-white drop-shadow-sm uppercase">Outcomes</span> <br className="hidden md:block"/>
                at Aacharya
              </h3>
              <p className="text-slate-900 font-bold text-sm md:text-lg opacity-90">
                Beyond academics, we focus on the holistic evolution of every child.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {outcomes.map((outcome, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-4 md:p-5 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 shadow-xl border-b-4 border-amber-600/20"
                >
                  <div className="bg-amber-500 p-2 md:p-2.5 rounded-lg md:rounded-xl text-white">
                    <outcome.icon size={20} strokeWidth={3} />
                  </div>
                  <span className="text-slate-900 font-black text-sm md:text-lg leading-tight">
                    {outcome.text}
                  </span>
                </div>
              ))}
              
              <div className="sm:col-span-2 bg-slate-900 p-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-3">
                 <CheckCircle className="text-amber-400" size={18} />
                 <span className="text-white font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-[10px] md:text-sm text-center">
                   Preparing children for the world of tomorrow
                 </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- SLIDING IMAGE SECTION --- */}
        <div className="relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-amber-600 font-black uppercase tracking-widest text-xs mb-2">
              <Images size={16} /> Virtual Tour
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 uppercase">Explore our Facilities</h3>
          </div>

          {/* Sliding Track */}
          <div className="relative flex overflow-hidden group">
            <div className="flex gap-4 md:gap-6 animate-marquee whitespace-nowrap py-4">
              {[...facilityImages, ...facilityImages].map((src, index) => (
                <div 
                  key={index} 
                  className="w-[280px] md:w-[400px] h-[200px] md:h-[280px] flex-shrink-0 rounded-2xl md:rounded-[2rem] overflow-hidden border-4 border-white shadow-lg transition-transform hover:scale-105 duration-500"
                >
                  <img 
                    src={src} 
                    alt={`Facility ${index}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>

            {/* Gradient Fades for the edges */}
            <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          </div>
        </div>

      </div>

      {/* Tailwind Animation CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}