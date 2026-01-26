"use client";

import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight, Star, Sparkles, BookOpen, GraduationCap, Trophy, Cpu, Calculator } from 'lucide-react';

const AboutBanner: React.FC = () => {
  return (
    <div className="relative w-full bg-[#FFFBF0] overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20">
      
      {/* --- Background Decorative Elements --- */}
      
      {/* 1. Cheerful Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* 2. Soft Warm Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-200 rounded-full blur-[120px] opacity-40 pointer-events-none -translate-y-1/3 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100 rounded-full blur-[100px] opacity-50 pointer-events-none translate-y-1/4 -translate-x-1/4"></div>

      {/* 3. Floating Icons */}
      <div className="absolute top-24 left-10 md:left-20 opacity-20 text-amber-500 animate-bounce-slow">
        <Star className="w-12 h-12 fill-amber-500" />
      </div>
      <div className="absolute top-1/3 right-10 md:right-32 opacity-10 text-slate-400 transform rotate-12 hidden md:block">
        <BookOpen className="w-24 h-24" />
      </div>
      <div className="absolute bottom-10 right-1/4 text-orange-400 opacity-20 hidden md:block">
        <GraduationCap className="w-16 h-16" />
      </div>

      {/* --- Main Content --- */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        
        {/* Main Badge/Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-bold mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>Nurturing Young Minds in Vijayawada</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight max-w-5xl leading-[1.1]">
          Aacharya – <span className="text-amber-600">Preschool</span>, Chess, Robotics, Abacus & <span className="relative inline-block text-orange-500">
            Tuition Centre
            <svg className="absolute w-full h-3 -bottom-2 left-0 text-yellow-300 -z-10 opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
            </svg>
          </span>
        </h1>
        
        {/* Primary Description */}
        <p className="text-xl md:text-2xl text-slate-800 font-bold mb-4 max-w-3xl">
          Nurturing Young Minds through Early Education, Skills and Confidence.
        </p>

        {/* Detailed Description */}
        <p className="text-md md:text-lg text-slate-600 max-w-4xl mb-10 leading-relaxed font-medium">
          Aacharya is a child-focused education centre in <span className="text-slate-900 font-semibold">Bhavanipuram, Vijayawada</span>, offering Pre-Primary School (Play Group, Nursery, LKG & UKG) along with Chess Academy, Robotics & STEM learning, Abacus training and academic tuition support. Our programs focus on strong foundations, skill development and confident learning in a safe, nurturing environment.
        </p>

        {/* Program Chips/Tags */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
                { label: "Preschool", icon: GraduationCap },
                { label: "Chess Academy", icon: Trophy },
                { label: "Robotics & STEM", icon: Cpu },
                { label: "Abacus", icon: Calculator },
                { label: "Tuition", icon: BookOpen },
            ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-700 font-semibold text-sm">
                    <item.icon className="w-4 h-4 text-amber-500" />
                    {item.label}
                </div>
            ))}
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-amber-100 shadow-lg shadow-amber-200/20">
          <Link href="/" className="text-slate-500 hover:text-amber-600 transition-colors flex items-center gap-1.5 text-sm font-semibold">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-300" strokeWidth={3} />
          <span className="text-slate-900 font-bold text-sm">
            About Aacharya
          </span>
        </nav>

      </div>

      {/* --- CSS Animation --- */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>

    </div>
  );
};

export default AboutBanner;