"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  ArrowLeft, 
  ArrowRight, 
  MessageCircle, 
  ChevronUp 
} from "lucide-react";

// --- Data: Winners ---
const winners = [
  {
    id: 1,
    name: "ANMAY",
    title: "Winner",
    country: "India",
    flagUrl: "https://flagcdn.com/w80/in.png",
    image: "https://images.unsplash.com/photo-1599849926834-8c835252c002?q=80&w=800&auto=format&fit=crop", // Placeholder for Chess Kid
  },
  {
    id: 2,
    name: "HARI",
    title: "Winner",
    country: "Oman",
    flagUrl: "https://flagcdn.com/w80/om.png",
    image: "https://images.unsplash.com/photo-1629249767353-8d6b67776d6c?q=80&w=800&auto=format&fit=crop", // Placeholder for Group
  },
  {
    id: 3,
    name: "VIKAS",
    title: "Winner",
    country: "USA",
    flagUrl: "https://flagcdn.com/w80/us.png",
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=800&auto=format&fit=crop", // Placeholder
  },
  {
    id: 4,
    name: "VIHAAN",
    title: "Winner",
    country: "USA",
    flagUrl: "https://flagcdn.com/w80/us.png",
    image: "https://images.unsplash.com/photo-1589825478473-b3d9d30e3863?q=80&w=800&auto=format&fit=crop", // Placeholder
  },
  {
    id: 5,
    name: "AARAV",
    title: "Winner",
    country: "UK",
    flagUrl: "https://flagcdn.com/w80/gb.png",
    image: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=800&auto=format&fit=crop",
  },
];

export default function WinnersSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll Handler
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 320; // Approx card width + gap
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[700px] bg-[#F8F8F6] py-16 font-sans overflow-hidden">
      
      {/* --- BACKGROUND DECORATIONS --- */}
      
      {/* 1. Balloon & String (Left Side) */}
      <div className="absolute top-10 -left-10 md:left-4 z-0 opacity-90">
        <svg width="180" height="250" viewBox="0 0 200 300" fill="none">
          {/* String */}
          <path d="M50 120 C 50 180, 20 200, 80 220 C 140 240, 20 280, 0 300" stroke="#CDCBCB" strokeWidth="2" fill="none" />
          {/* Balloon */}
          <path d="M100 20 C 150 20, 180 60, 160 100 C 140 140, 100 150, 80 140 L 75 150 L 70 140 C 40 130, 20 80, 40 40 C 60 10, 80 20, 100 20 Z" fill="#06b6d4" />
          {/* Shine on Balloon */}
          <path d="M110 40 Q 130 40 140 60" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6" />
        </svg>
      </div>

      {/* 2. Pink Star (Top Right) */}
      <div className="absolute top-8 right-8 md:right-20 z-0">
        <svg width="60" height="60" viewBox="0 0 50 50" fill="none" className="transform rotate-12">
          <path d="M25 0 L32 17 L50 17 L36 29 L41 46 L25 36 L9 46 L14 29 L0 17 L18 17 Z" fill="#FF1493" />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-1.5 rounded-full bg-[#EBE9FE] mb-4">
            <span className="text-[#5C4EE5] font-semibold text-sm">Achievements</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A]">
            Winners At  Aacharya Academy 
          </h2>
        </div>

        {/* --- CAROUSEL WRAPPER --- */}
        <div className="relative flex items-center">
          
          {/* Left Button */}
          <button 
            onClick={() => scroll("left")}
            className="hidden md:flex absolute -left-4 lg:-left-12 z-20 w-12 h-12 bg-[#4338CA] hover:bg-[#3730a3] rounded-full items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-10 pt-4 px-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {winners.map((winner) => (
              <div 
                key={winner.id} 
                className="relative flex-shrink-0 w-[280px] md:w-[320px] snap-center"
              >
                {/* Flag Badge */}
                <div className="absolute -top-3 left-4 z-20 w-10 h-7 shadow-md overflow-hidden rounded-[2px]">
                  <Image 
                    src={winner.flagUrl} 
                    alt={winner.country}
                    width={40}
                    height={28}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Card Body */}
                <div className="bg-white p-3 rounded-[30px] shadow-sm hover:shadow-xl transition-shadow duration-300">
                  {/* Image Container */}
                  <div className="relative h-[280px] w-full rounded-[25px] overflow-hidden mb-4 bg-gray-200">
                    <Image
                      src={winner.image}
                      alt={winner.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="px-2 pb-2">
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                      {winner.name}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium">
                      {winner.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Button */}
          <button 
            onClick={() => scroll("right")}
            className="hidden md:flex absolute -right-4 lg:-right-12 z-20 w-12 h-12 bg-[#4338CA] hover:bg-[#3730a3] rounded-full items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
          >
            <ArrowRight className="w-6 h-6" />
          </button>

        </div>
      </div>

      {/* --- FIXED FLOATING BUTTONS --- */}

      {/* WhatsApp Chat (Bottom Left) */}
      {/* <div className="fixed bottom-6 left-6 z-50">
        <a 
          href="https://wa.me/123456789" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 font-semibold transition-transform hover:scale-105"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span>Chat with us</span>
        </a>
      </div> */}

      {/* Scroll to Top (Bottom Right) */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-[#5C4EE5] hover:bg-[#4a3ec2] rounded-full flex items-center justify-center shadow-lg transition-transform hover:-translate-y-1"
      >
        <ChevronUp className="w-5 h-5 text-white" strokeWidth={2.5} />
      </button>

    </section>
  );
}