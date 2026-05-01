"use client";

import React, { useRef } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Trophy, 
  Star, 
  Crown,
  Plus
} from "lucide-react";

// --- Achievers Data (Using country codes for visual flag graphics) ---
const achievers = [
  {
    id: 1,
    name: "Aacharya Chess Team",
    category: "ELITE",
    award: "INTER-SCHOOL CHESS",
    image: "/chess.jpeg", 
    desc: "Outstanding Performance: Secured 2nd Place in Team Competition and 3rd Place Individually on the First Board.",
    countryCode: "in", // India
    color: "bg-[#2D63ED]", 
    shadow: "shadow-blue-200"
  },
  {
    id: 2,
    name: "Mr. Varun",
    category: "TOPPER",
    award: "CBSE ACADEMICS",
    image: "/school-ach.jpeg", 
    desc: "Officially Achieved Class 5th CBSE Student excellence with an outstanding 99.97% overall score.",
    countryCode: "in", // USA
    color: "bg-[#7C3AED]", 
    shadow: "shadow-purple-200"
  },
  {
    id: 3,
    name: "Robotics Team",
    category: "INNOVATORS",
    award: "ROBOTICS WORKSHOP",
    image: "/robotics-sucess.jpeg",
    desc: "Demonstrated exceptional strategy in leading the biggest hands-on workshop with 600+ participants.",
    countryCode: "in", // India
    color: "bg-[#059669]", 
    shadow: "shadow-emerald-200"
  },
  {
    id: 4,
    name: "Abacus Prodigy",
    category: "MASTERS",
    award: "LITTLE CHAMPIONS",
    image: "/abacus-sucess.jpeg",
    desc: "Champion: One of the fastest mental calculators. Quick Math Hero at regional and state levels.",
    countryCode: "in", // India
    color: "bg-[#E11D48]", 
    shadow: "shadow-rose-200"
  },
];

const AchievementsSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
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
    <section className="relative py-24 bg-white overflow-hidden font-sans">
      
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* --- CENTERED HEADER --- */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-slate-50 text-slate-500 border border-slate-200 shadow-sm">
            <Trophy size={14} className="fill-slate-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Hall of Glory</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-[1000] text-slate-900 tracking-tighter leading-[1.1] mb-6 text-center">
            Our Proud {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Achievers</span>
          </h2>
          <div className="flex justify-center gap-3">
            <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* --- CAROUSEL TRACK --- */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-12 scrollbar-hide pt-16"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {achievers.map((item) => (
            <div 
              key={item.id}
              className="snap-center shrink-0 w-[88vw] sm:w-[340px] md:w-[380px]"
            >
              <div className={`relative ${item.color} rounded-[3.5rem] p-8 md:p-10 text-white shadow-2xl ${item.shadow} group transition-all duration-500 hover:-translate-y-3`}>
                
                <Plus className="absolute top-1/2 right-10 w-20 h-20 text-white/10 font-black pointer-events-none" />

                {/* Profile Image (Top-Left Overlap) */}
                <div className="absolute -top-16 left-6 flex items-start gap-4">
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-[2.5rem] border-[8px] border-white overflow-hidden shadow-2xl bg-slate-100 relative">
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                    />
                    <div className="absolute top-2 left-2 w-7 h-7 bg-[#FFB800] rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                      <Crown size={12} className="text-white fill-white" />
                    </div>
                  </div>
                  
                  <div className="mt-20">
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-md">
                        {item.name}
                    </h3>
                    <div className="text-[10px] font-bold text-white/70 tracking-[0.2em] mt-2 border-t border-white/20 pt-2 inline-block">
                        {item.category}
                    </div>
                  </div>
                </div>

                <div className="mt-28">
                  <div className="w-12 h-1.5 bg-[#FFB800] mb-8 rounded-full"></div>

                  <p className="text-[11px] font-bold text-white/70 uppercase tracking-[0.2em] mb-2">Award Distinction</p>
                  <h4 className="text-xl md:text-2xl font-black leading-[1.1] tracking-tight mb-6 text-white uppercase">
                    {item.award}
                  </h4>
                  
                  <p className="text-[14px] font-medium leading-relaxed text-white/80 line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                {/* Footer Badges */}
                <div className="flex items-center justify-between mt-12">
                   {/* Verified Pill */}
                   <div className="bg-white px-5 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-xl">
                      <Star size={14} className="text-[#FFB800] fill-[#FFB800]" />
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Aacharya Verified</span>
                   </div>

                   {/* VISUAL FLAG IMAGE (Replacing text/emoji) */}
                   <div className="w-14 h-10 bg-white p-1 rounded-xl shadow-lg border border-white rotate-6 overflow-hidden">
                      <img 
                        src={`https://flagcdn.com/w80/${item.countryCode}.png`} 
                        alt="Flag" 
                        className="w-full h-full object-cover rounded-md"
                      />
                   </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default AchievementsSection;