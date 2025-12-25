"use client";

import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight, Star, Sparkles, BookOpen } from 'lucide-react';

const RoboticsBanner: React.FC = () => {
  return (
    <div className="relative w-full bg-[#FFFBF0] overflow-hidden pt-20 pb-14 md:pt-10 md:pb-3">
      
      {/* --- Background Decorative Elements --- */}
      
      {/* 1. Cheerful Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* 2. Soft Warm Blobs (Top Right & Bottom Left) */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-200 rounded-full blur-[100px] opacity-60 pointer-events-none -translate-y-1/3 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-100 rounded-full blur-[80px] opacity-70 pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

      {/* 3. Floating Icons (Playful & Academic) */}
      {/* Star - Top Left */}
      <div className="absolute top-24 left-10 md:left-20 opacity-20 text-amber-500 animate-bounce-slow">
        <Star className="w-12 h-12 fill-amber-500" />
      </div>

      {/* Book - Right Side */}
      <div className="absolute top-1/3 right-10 md:right-32 opacity-10 text-slate-400 transform rotate-12 hidden md:block">
        <BookOpen className="w-24 h-24" />
      </div>

      {/* Sparkles - Near Text */}
      <div className="absolute bottom-20 left-1/3 text-yellow-500 opacity-40 animate-pulse">
        <Sparkles className="w-8 h-8" />
      </div>

      {/* --- Main Content --- */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight relative">
          Aacharya Robotics <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Academy</span>
          {/* Decorative Underline */}
          <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300 -z-10 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
             <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
          </svg>
        </h1>
        
        {/* Description / Subtext */}
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-8 leading-relaxed font-medium">
          Aacharya Robotics Academy - Where we build the future.
        </p>

        {/* Breadcrumb Navigation (Pill Style) */}
        <nav className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-amber-100 shadow-md shadow-amber-100/50">
          <Link href="/" className="text-slate-500 hover:text-amber-600 transition-colors flex items-center gap-1.5 text-sm font-semibold">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          
          <ChevronRight className="w-4 h-4 text-slate-300" strokeWidth={3} />
          
          <span className="text-slate-900 font-bold text-sm">
            Pre Primary School
          </span>
        </nav>

      </div>

      {/* --- CSS Animation --- */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
};

export default RoboticsBanner;