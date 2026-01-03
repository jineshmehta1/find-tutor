"use client"

import { 
  BookOpen, Microscope, MonitorPlay, Music, Palette, Bus, Star, 
  CheckCircle, Target, Brain, Heart, Rocket, Languages 
} from "lucide-react"

export default function FacilitiesSection() {
  
  const facilities = [
    { 
      icon: BookOpen, 
      label: "Smart Library", 
      desc: "Books & E-Learning",
      color: "text-amber-600", 
      bg: "bg-amber-100", 
      border: "group-hover:border-amber-400",
      shadow: "group-hover:shadow-amber-100"
    },
    { 
      icon: Microscope, 
      label: "Robotics Labs", 
      desc: "Discovery Zone",
      color: "text-blue-600", 
      bg: "bg-blue-100", 
      border: "group-hover:border-blue-400",
      shadow: "group-hover:shadow-blue-100"
    },
    { 
      icon: MonitorPlay, 
      label: "Computer Lab", 
      desc: "Coding & Tech",
      color: "text-purple-600", 
      bg: "bg-purple-100", 
      border: "group-hover:border-purple-400",
      shadow: "group-hover:shadow-purple-100"
    },
    { 
      icon: Music, 
      label: "Music Room", 
      desc: "Rhythm & Beats",
      color: "text-rose-600", 
      bg: "bg-rose-100", 
      border: "group-hover:border-rose-400",
      shadow: "group-hover:shadow-rose-100"
    },
    { 
      icon: Palette, 
      label: "Art Classes", 
      desc: "Creative Space",
      color: "text-pink-600", 
      bg: "bg-pink-100", 
      border: "group-hover:border-pink-400",
      shadow: "group-hover:shadow-pink-100"
    },
    { 
      icon: Bus, 
      label: "Easy Transport", 
      desc: "Safe Travel",
      color: "text-green-600", 
      bg: "bg-green-100", 
      border: "group-hover:border-green-400",
      shadow: "group-hover:shadow-green-100"
    },
  ]

  const outcomes = [
    { text: "Confident Communicators", icon: Languages },
    { text: "Creative & Critical Thinkers", icon: Brain },
    { text: "Independent Learners", icon: Target },
    { text: "Emotionally Strong Children", icon: Heart },
    { text: "Future-Ready Mindset", icon: Rocket },
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      
      {/* Subtle Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- FACILITIES HEADER --- */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 font-black text-xs uppercase tracking-widest mb-6 shadow-sm">
            <Star size={14} className="fill-amber-500" /> World-Class Campus
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
            Our Premium <span className="text-amber-500 italic">Facilities</span> 🏰
          </h2>
          <p className="text-slate-500 mt-4 text-lg font-bold max-w-2xl mx-auto">
            Providing an environment where every corner is a new opportunity to learn and grow.
          </p>
        </div>
        
        {/* --- FACILITIES GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-24">
          {facilities.map((fac, i) => (
            <div 
              key={i} 
              className={`
                group bg-white p-6 rounded-[2.5rem] border-2 border-slate-100
                shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:shadow-amber-200/50 
                transition-all duration-500 hover:-translate-y-3
                flex flex-col items-center gap-4 cursor-default
                ${fac.border}
              `}
            >
              <div className={`
                w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 
                group-hover:scale-110 group-hover:rotate-12
                ${fac.bg} ${fac.color} shadow-inner
              `}>
                <fac.icon size={30} strokeWidth={2.5} />
              </div>
              
              <div className="text-center">
                <span className="block font-black text-slate-900 text-base mb-1 uppercase tracking-tight">{fac.label}</span>
                <span className="block text-[10px] font-black text-amber-500 uppercase tracking-widest">
                  {fac.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* --- LEARNING OUTCOMES SECTION --- */}
        <div className="bg-[#FFD642] rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-amber-200">
          {/* Decorative Circle */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 grid lg:grid-cols-3 gap-12 items-center">
            {/* Outcomes Title */}
            <div className="lg:col-span-1">
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-4">
                Learning <br/> 
                <span className="text-white drop-shadow-sm">Outcomes</span> <br/>
                at Aacharya
              </h3>
              <p className="text-slate-900 font-bold text-lg opacity-80">
                Beyond academics, we focus on the holistic evolution of every child.
              </p>
            </div>

            {/* Outcomes Grid */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {outcomes.map((outcome, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl flex items-center gap-4 shadow-lg border-b-4 border-amber-600/20 hover:scale-[1.02] transition-transform"
                >
                  <div className="bg-amber-500 p-2.5 rounded-xl text-white">
                    <outcome.icon size={22} strokeWidth={3} />
                  </div>
                  <span className="text-slate-900 font-black text-base md:text-lg leading-tight">
                    {outcome.text}
                  </span>
                </div>
              ))}
              
              {/* Special Tagline Card */}
              <div className="sm:col-span-2 bg-slate-900 p-4 rounded-2xl flex items-center justify-center gap-3">
                 <CheckCircle className="text-amber-400" size={20} />
                 <span className="text-white font-black uppercase tracking-[0.2em] text-xs md:text-sm">
                   Preparing children for the world of tomorrow
                 </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}