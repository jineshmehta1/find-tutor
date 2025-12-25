"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  BookOpen,      
  BrainCircuit,  
  Bot,           
  Gamepad2,      
  Star, 
  CheckCircle2,
  GraduationCap
} from "lucide-react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const programs = [
    { 
      icon: GraduationCap, 
      label: "Pre Primary Schooling", 
      path: "/school",
      // Solid Blue Theme
      theme: "bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
    },
    { 
      icon: BrainCircuit, 
      label: "Abacus & Mental Math", 
      path: "/abacus",
      // Solid Amber Theme
      theme: "bg-amber-500 border-amber-500 text-white hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-200"
    },
    { 
      icon: Bot, 
      label: "Robotics & AI", 
      path: "/robotics",
      // Solid Purple Theme
      theme: "bg-purple-600 border-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200"
    },
    { 
      icon: Gamepad2, 
      label: "Professional Chess", 
      path: "/chess",
      // Solid Emerald Theme
      theme: "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200"
    },
    { 
      icon: BookOpen, 
      label: "CBSE Coaching", 
      path: "/coaching",
      // Solid Rose Theme
      theme: "bg-rose-600 border-rose-600 text-white hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-200"
    },
  ];

  return (
    <section className="relative min-h-screen bg-white flex items-center pt-12 pb-16 lg:pt-2 lg:pb-32 overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-50/50 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Content Column */}
          <div className={`lg:col-span-7 space-y-8 transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs tracking-wide uppercase mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              Admissions Open 2024-25
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl leading-[1.1] font-extrabold text-slate-900 tracking-tight">
              Where <span className="text-amber-600">Academic Excellence</span> <br className="hidden md:block" />
              Meets Future Skills.
            </h1>

            {/* Programs Section */}
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-amber-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">Programs We Offer</h2>
               </div>
               
              

               {/* Colorful Program Buttons - Now Permanently Vibrant */}
               <div className="flex flex-wrap gap-3">
                 {programs.map((item, idx) => (
                   <button 
                     key={idx} 
                     onClick={() => router.push(item.path)}
                     className={`group flex items-center gap-3 px-6 py-3.5 border shadow-sm rounded-2xl text-sm font-bold transition-all duration-300 hover:-translate-y-1 active:scale-95 ${item.theme}`}
                   >
                     <item.icon size={20} className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                     {item.label}
                   </button>
                 ))}
               </div>
            </div>

            {/* Main CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
              <button 
                onClick={() => router.push('/demo')} 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300"
              >
                Book a Free Demo <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => router.push('/about')} 
                className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold text-lg hover:border-amber-500 hover:text-amber-600 transition-all"
              >
                Learn More
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <div className="flex text-amber-500">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span>Trusted by 500+ Parents</span>
            </div>
          </div>

          {/* Right Side Visuals */}
          <div className={`lg:col-span-5 relative mt-12 lg:mt-0 lg:h-[600px] flex items-center justify-center transition-all duration-1000 delay-300 transform ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-100 to-yellow-50 rounded-[3rem] -rotate-6 scale-90 -z-10 border border-amber-100/50"></div>
            <div className="relative w-full max-w-[450px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
              <img src="/hero.jpg" alt="Student" className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
            </div>

            {/* Floating Info Cards */}
            <div className="absolute top-10 -left-6 bg-white p-4 rounded-xl shadow-lg border border-slate-50 flex items-center gap-3 animate-bounce shadow-blue-100" style={{ animationDuration: '3s' }}>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><GraduationCap size={20} /></div>
                <div className="text-sm font-bold text-slate-800">Pre Primary School</div>
            </div>

            <div className="absolute bottom-20 -right-6 bg-white p-4 rounded-xl shadow-lg border border-slate-50 flex items-center gap-3 animate-bounce shadow-amber-100" style={{ animationDuration: '4s' }}>
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600"><Bot size={20} /></div>
                <div className="text-sm font-bold text-slate-800">Robotics, AI & IOT</div>
            </div>

            <div className="absolute bottom-6 left-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-100 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-xs font-bold text-slate-700">100% Personal Focus</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
