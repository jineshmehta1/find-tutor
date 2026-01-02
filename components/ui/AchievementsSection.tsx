"use client";

import React, { useRef } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Trophy, 
  Medal, 
  Star, 
  GraduationCap, 
  Award
} from "lucide-react";

// --- Demo Data ---
const achievers = [
  {
    id: 1,
    name: "Aditya Verma",
    category: "Chess",
    award: "State Gold Medalist",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop",
    desc: "Undefeated in U-14 State Championship 2024",
    icon: <Trophy className="w-4 h-4" />
  },
  {
    id: 2,
    name: "Riya Sharma",
    category: "Academics",
    award: "District Topper (98.6%)",
    image: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?q=80&w=600&auto=format&fit=crop",
    desc: "Class 10th CBSE Board Exams",
    icon: <GraduationCap className="w-4 h-4" />
  },
  {
    id: 3,
    name: "Team Robo-X",
    category: "Robotics",
    award: "National Innovation Award",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=600&auto=format&fit=crop",
    desc: "Best AI Integration in Lego League",
    icon: <Award className="w-4 h-4" />
  },
  {
    id: 4,
    name: "Vihaan Gupta",
    category: "Abacus",
    award: "Grand Master Title",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop",
    desc: "Solved 100 sums in 5 minutes",
    icon: <Medal className="w-4 h-4" />
  },
  {
    id: 5,
    name: "Sanya Malhotra",
    category: "Chess",
    award: "FIDE Rated 1600+",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&auto=format&fit=crop",
    desc: "Youngest player to achieve rating in District",
    icon: <Trophy className="w-4 h-4" />
  }
];

const AchievementsSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 768 ? window.innerWidth * 0.8 : 400;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount 
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative py-16 md:py-24 lg:py-32 bg-white overflow-hidden font-sans">
      
      {/* --- Background Texture --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-[500px] md:h-[500px] bg-amber-100/40 rounded-full blur-[80px] md:blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-[500px] md:h-[500px] bg-yellow-100/40 rounded-full blur-[80px] md:blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-16 gap-10">
          
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 md:mb-6 rounded-full bg-amber-50 border border-amber-200 shadow-sm">
              <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600" />
              <span className="text-[10px] md:text-xs font-bold text-amber-800 uppercase tracking-widest">Hall of Glory</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-none mb-4">
              Aacharya's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">
                Achievements
              </span>
            </h2>
            <p className="text-sm md:text-lg text-slate-500 max-w-lg leading-relaxed mx-auto lg:mx-0">
              Excellence is not an act, but a habit. We take pride in our stars who excel at State, National, and International levels.
            </p>
          </div>

          {/* --- STATS RIBBON --- */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 lg:gap-12 pb-2 border-t border-slate-100 lg:border-none pt-8 lg:pt-0">
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-black text-slate-900">50+</p>
              <p className="text-[9px] md:text-sm font-semibold text-slate-500 uppercase tracking-wide mt-1">Trophies</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-black text-slate-900">100%</p>
              <p className="text-[9px] md:text-sm font-semibold text-slate-500 uppercase tracking-wide mt-1">Pass Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-black text-slate-900">2k+</p>
              <p className="text-[9px] md:text-sm font-semibold text-slate-500 uppercase tracking-wide mt-1">Alumni</p>
            </div>
          </div>
        </div>

        {/* --- CAROUSEL AREA --- */}
        <div className="relative group">
          
          {/* Custom Nav Buttons (Desktop Only) */}
          <div className="hidden lg:flex gap-3 absolute -top-24 right-0">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-amber-500 hover:text-white hover:border-amber-500 shadow-sm transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-amber-500 hover:text-white hover:border-amber-500 shadow-sm transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Scroll Track */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-12 pt-4 px-1 -mx-4 md:mx-0 scrollbar-hide md:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {achievers.map((item) => (
              <div 
                key={item.id}
                className="snap-center shrink-0 w-[82vw] sm:w-[320px] md:w-[360px] first:ml-4 lg:first:ml-0"
              >
                {/* --- THE CARD --- */}
                <div className="relative h-[420px] md:h-[500px] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-xl shadow-slate-200 group/card cursor-pointer border-[2px] md:border-[3px] border-white">
                  
                  {/* Background Image */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover opacity-80 md:opacity-90 transition-transform duration-700 group-hover/card:scale-110"
                  />
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                  {/* Top Badge (Category) */}
                  <div className="absolute top-4 md:top-6 left-4 md:left-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider">
                      {item.icon}
                      {item.category}
                    </span>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-1 md:translate-y-2 transition-transform duration-500 group-hover/card:translate-y-0">
                    
                    {/* Golden Line Decoration */}
                    <div className="w-10 md:w-12 h-1 bg-amber-500 mb-3 md:mb-4 rounded-full"></div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 leading-tight">
                      {item.name}
                    </h3>

                    {/* Award Highlight */}
                    <div className="text-amber-400 font-bold text-base md:text-lg mb-2 md:mb-3 flex items-center gap-2">
                      <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-amber-400" />
                      {item.award}
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed border-l-2 border-white/20 pl-3">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AchievementsSection;