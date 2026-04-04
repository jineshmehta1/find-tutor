"use client";

import React, { useRef } from "react";
import { 
  ChevronLeft, ChevronRight, Sparkles, CheckCircle2, 
  Baby, Trophy, Calculator, Cpu, GraduationCap, ArrowRight 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Pre School",
    subtitle: "Nurturing Foundation",
    description: "A magical space where curiosity meets structured play. We focus on social, emotional, and cognitive growth for your little ones.",
    features: ["Play-based Learning", "Safe Environment", "Expert Caregivers", "Creative Arts"],
    img1: "/pic9.webp",
    img2: "/pic15.webp",
    href: "/preschool",
    icon: Baby,
    color: "from-rose-500 to-pink-600",
    lightBg: "bg-rose-50",
    textColor: "text-rose-600",
  },
  {
    title: "Chess Coaching",
    subtitle: "Master the Board",
    description: "Strategic thinking, extreme patience, and logic. Our curriculum turns beginners into tactical thinkers and competitive champions.",
    features: ["Tactical Puzzles", "Opening Theory", "Weekly Tournaments", "IQ Boosting"],
    img1: "/pic18.webp",
    img2: "/pic20.webp",
    href: "/chess",
    icon: Trophy,
    color: "from-indigo-500 to-blue-600",
    lightBg: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    title: "Abacus Training",
    subtitle: "Mental Math Power",
    description: "Visualize calculations at the speed of light. Boost confidence, memory, and accuracy using the world-renowned Soroban method.",
    features: ["9 Skill Levels", "Concentration Drills", "Global Certification", "Fast Calculation"],
    img1: "/central.jpg",
    img2: "/gallery15.jpg",
    href: "/abacus",
    icon: Calculator,
    color: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    title: "Robotics & AI",
    subtitle: "Build the Future",
    description: "Hands-on coding and mechanical engineering. Students build and program their own robots using Arduino and IoT sensors.",
    features: ["IoT Integration", "Python Coding", "Circuit Design", "STEM Projects"],
    img1: "/pic34.webp",
    img2: "/pic36.webp",
    href: "/robotics",
    icon: Cpu,
    color: "from-cyan-500 to-blue-500",
    lightBg: "bg-cyan-50",
    textColor: "text-cyan-600",
  },
  {
    title: "Tuition Point",
    subtitle: "Academic Excellence",
    description: "Personalized coaching for school subjects. We bridge the gap between classroom teaching and exam-ready deep understanding.",
    features: ["Grade 1-12", "Expert Tutors", "Weekly Progress", "Exam Preparation"],
    img1: "/kidcoaching.jpg",
    img2: "/sucess.jpg",
    href: "/tuition",
    icon: GraduationCap,
    color: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50",
    textColor: "text-emerald-600",
  }
];

export default function CenteredProgramSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-20 md:py-32 bg-slate-50 overflow-hidden font-sans">
      {/* Background Pattern - Matched to your testimonial style */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5"
           style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* --- CENTERED HEADER --- */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Success Starts Here</span>
          </div>
          <h2 className="text-2xl md:text-5xl font-extrabold text-slate-900 tracking-tighter leading-[1.1] mb-6">
            World-Class <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Learning Programs</span>
          </h2>
          <div className="h-1.5 w-24 bg-amber-400 mx-auto rounded-full"></div>
        </div>

        {/* --- SLIDER CONTAINER WITH SIDE ARROWS --- */}
        <div className="relative group px-4 md:px-0">
          
          {/* Left Arrow Button */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-[-20px] md:left-[-40px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-20 md:h-20 rounded-full bg-white border border-slate-100 shadow-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all active:scale-90"
          >
            <ChevronLeft className="w-6 h-6 md:w-10 md:h-10" />
          </button>

          {/* Right Arrow Button */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-[-20px] md:right-[-40px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-20 md:h-20 rounded-full bg-slate-900 text-white shadow-2xl flex items-center justify-center hover:bg-amber-500 transition-all active:scale-90"
          >
            <ChevronRight className="w-6 h-6 md:w-10 md:h-10" />
          </button>

          {/* Horizontal Scroll Window */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {services.map((service, index) => (
              <div 
                key={index}
                className="min-w-full snap-center"
              >
                {/* Spacious Content Card */}
                <div className="bg-white rounded-[3.5rem] md:rounded-[5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 md:p-24 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative overflow-hidden">
                  
                  {/* Left Side: Text Content */}
                  <div className="flex-1 space-y-8 md:space-y-12 text-left z-10">
                    <div className="space-y-6">
                      <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full ${service.lightBg} ${service.textColor} font-black text-xs uppercase tracking-[0.3em]`}>
                        {service.subtitle}
                      </div>
                      <h3 className="text-2xl md:text-4xl font-black text-slate-900 leading-[0.85] tracking-tighter">
                        {service.title}
                      </h3>
                      <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl italic">
                        "{service.description}"
                      </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                      {service.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className={`w-7 h-7 rounded-full ${service.lightBg} flex items-center justify-center shrink-0`}>
                              <CheckCircle2 className={`w-4 h-4 ${service.textColor}`} />
                          </div>
                          <span className="font-bold text-slate-700 text-lg md:text-xl">{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-8">
                      <Link href={service.href}>
                        <Button className={`group h-16 md:h-14 px-10 md:px-16 rounded-[2.5rem] bg-slate-900 hover:bg-amber-500 text-white font-black text-sm md:text-lg uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95`}>
                          View Full Details
                          <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-3 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Right Side: Visual Image Stack */}
                  <div className="flex-1 relative w-full max-w-[600px] aspect-square lg:aspect-auto lg:h-[650px] group/img">
                    {/* Glowing Accent */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-10 rounded-[4rem] blur-3xl group-hover/img:opacity-20 transition-opacity duration-700`} />
                    
                    {/* Primary Large Image */}
                    <div className="absolute top-0 right-0 w-[105%] h-[65%] rounded-[3rem] md:rounded-[4.5rem] overflow-hidden shadow-2xl border-[14px] border-white z-10 -rotate-2 group-hover/img:rotate-0 transition-all duration-700">
                      <img src={service.img1} alt={service.title} className="w-full h-full object-cover grayscale-[20%] group-hover/img:grayscale-0 transition-all" />
                    </div>

                    {/* Secondary Overlapping Image */}
                    <div className="absolute bottom-0 left-0 w-[95%] h-[55%] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border-[10px] border-white z-20 rotate-6 group-hover/img:rotate-2 transition-all duration-700">
                      <img src={service.img2} alt={service.title} className="w-full h-full object-cover" />
                     
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Swipe Hint */}
        <div className="mt-16 text-center">
           <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.6em] animate-pulse">
            Swipe or use arrows to navigate
          </p>
        </div>

      </div>
    </section>
  );
}