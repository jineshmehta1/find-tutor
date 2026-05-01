"use client";

import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Trophy, 
  Users, 
  BookOpen, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function WhyChooseUsSection() {
  const benefits = [
    {
      title: 'All-in-One Learning Hub',
      desc: 'Pre-school, Chess, Abacus & Robotics under one roof.',
      icon: <BookOpen size={20} />,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      title: '100% Child Safe',
      desc: 'CCTV surveillance, secure entry & trained caregivers.',
      icon: <ShieldCheck size={20} />,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Skill Development',
      desc: 'Logic, memory, creativity & confidence building from early age.',
      icon: <Zap size={20} />,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      title: 'Expert Mentors',
      desc: 'Small batches with experienced & caring teachers.',
      icon: <Users size={20} />,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      title: 'NEP 2020 Curriculum',
      desc: 'Modern & play-based learning aligned with NEP 2020.',
      icon: <Sparkles size={20} />,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
    },
    {
      title: 'Proven Results',
      desc: 'Join 500+ happy families seeing real improvement.',
      icon: <Trophy size={20} />,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-[#FCFDF2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT SIDE - IMAGE */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-8 border-white">
              <img 
                src="/fac1.jpeg" 
                alt="Aacharya Academy Experience"
                className="w-full h-[460px] object-cover"
              />
              <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-800 flex items-center gap-2 shadow">
                🌟 Nurturing Little Minds
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - COMPACT CONTENT */}
          <div className="lg:col-span-7 space-y-8">
            
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
                WHY AACHARYA?
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                Giving Your Child the <br/><span className="text-blue-600">Perfect Headstart</span>
              </h2>
            </div>

            {/* Compact Benefits Grid with Visible Borders */}
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, idx) => (
                <div 
                  key={idx} 
                  className={`border-2 ${benefit.color} p-5 rounded-2xl hover:shadow-md transition-all duration-300 group`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border shrink-0 group-hover:scale-110 transition-transform">
                      {benefit.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-[15px] leading-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-slate-600 text-xs leading-snug">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link 
                href="/contact"
                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                Enroll Now 
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}