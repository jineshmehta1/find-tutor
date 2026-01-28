"use client";

import React from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  Quote, 
  Cpu, 
  Calculator, 
  School, 
  BookOpen, 
  Award, 
  FlaskConical,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const AboutSection: React.FC = () => {
  const programs = [
    { icon: School, title: "Aacharya Pre-Primary", desc: "NEP-aligned, activity-based learning for creativity.", color: "bg-blue-50 text-blue-600" },
    { icon: Trophy, title: "Chess Academy", desc: "FIDE preparation and Sunday chess clubs.", color: "bg-amber-50 text-amber-600" },
    { icon: Cpu, title: "Robotics & IoT", desc: "Hands-on coding with Arduino and Raspberry Pi.", color: "bg-purple-50 text-purple-600" },
    { icon: Calculator, title: "Abacus Training", desc: "9-level program for mental math mastery.", color: "bg-emerald-50 text-emerald-600" },
    { icon: BookOpen, title: "Tuition Point", desc: "Personalized support in Maths and Science.", color: "bg-rose-50 text-rose-600" },
    { icon: FlaskConical, title: "Workshops & Camps", desc: "STEM and arts camps for teamwork.", color: "bg-indigo-50 text-indigo-600" },
  ];

  const benefits = [
    { title: 'Holistic Learning', desc: 'A complete ecosystem covering academics, STEM, and Chess.', color: 'sky' },
    { title: 'Experienced Mentors', desc: 'Skilled teachers who nurture every child’s potential.', color: 'slate' },
    { title: 'Safe Environment', desc: 'Hygienic classrooms prioritizing safety and care.', color: 'rose' },
    { title: 'Skill & Confidence', desc: 'Activities that build creativity and problem-solving.', color: 'amber' },
    { title: 'Parent Partnership', desc: 'Transparent progress tracking and active involvement.', color: 'sky' },
  ];

  const colorStyles = {
    sky: { bg: 'bg-sky-400', border: 'border-sky-100' },
    slate: { bg: 'bg-slate-400', border: 'border-slate-100' },
    rose: { bg: 'bg-rose-400', border: 'border-rose-100' },
    amber: { bg: 'bg-amber-400', border: 'border-amber-100' },
  };

  return (
    <div className="bg-white">
      {/* --- HERO SECTION --- */}
      <section className="py-12 md:py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          <div className="w-full lg:w-1/2 relative">
            <div className="relative w-full max-w-[550px] mx-auto lg:mx-0 h-[320px] md:h-[450px]">
              <div className="absolute top-0 left-0 w-[75%] h-[75%] z-10">
                <img src="/about.jpeg" alt="Classroom" className="w-full h-full object-cover rounded-[1.5rem] md:rounded-[2rem] shadow-2xl" />
              </div>
              <div className="absolute bottom-0 right-0 w-[65%] h-[60%] z-20">
                <div className="w-full h-full p-2 bg-white rounded-[1.5rem] shadow-xl">
                  <img src="/champion.webp" alt="Activities" className="w-full h-full object-cover rounded-[1rem]" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-amber-50 border border-amber-100">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">About Aacharya</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
              Bridging Academics with <br className="hidden md:block" />
              <span className="text-amber-500">Future Skills.</span>
            </h2>
            <p className="text-slate-600 text-sm md:text-lg mb-6 leading-relaxed">
              At Aacharya, we believe every child is unique and full of potential. Our mission is to provide a nurturing, safe, and stimulating environment where children can learn, explore, and grow across academics, creativity, and life skills.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {["Holistic", "STEM", "Activity Based", "Safe Campus"].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span className="text-slate-800 text-xs md:text-base font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: SLIM PROGRAM CARDS --- */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-5 max-w-7xl">
          <div className="text-center md:text-left mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Our Programs</h2>
            <p className="text-slate-500 text-sm">Comprehensive ecosystem for modern skill development.</p>
          </div>
          
          {/* Mobile: 1 col, slim horizontal | Desktop: 3 col, standard card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {programs.map((prog, i) => (
              <div 
                key={i} 
                className="group flex items-center md:flex-col md:items-start p-3 md:p-8 rounded-xl md:rounded-3xl bg-white border border-slate-100 hover:shadow-lg transition-all"
              >
                {/* Slim Icon Container */}
                <div className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-2xl ${prog.color} flex items-center justify-center mr-4 md:mr-0 md:mb-6`}>
                  <prog.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                
                {/* Text content - adjusted for slimness */}
                <div className="flex-1">
                  <h4 className="text-sm md:text-xl font-black text-slate-900 mb-0.5 md:mb-3">{prog.title}</h4>
                  <p className="text-slate-500 text-[11px] md:text-sm leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-none">
                    {prog.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* --- SECTION 4: WHY PARENTS CHOOSE US --- */}
      <section className="py-16 px-4 bg-slate-50/50">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold uppercase mb-4">
            <CheckCircle2 size={14} /> The Aacharya Advantage
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900">Why Parents Trust Aacharya</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {benefits.map((benefit, idx) => {
            const isRightAligned = idx % 2 !== 0;
            const style = colorStyles[benefit.color as keyof typeof colorStyles];
            return (
              <div key={idx} className={`relative flex items-center ${isRightAligned ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                <div className={`relative z-10 w-full bg-white border-[1.5px] ${style.border} rounded-2xl p-4 flex items-center gap-4 ${isRightAligned ? 'lg:flex-row-reverse lg:text-right' : 'text-left'}`}>
                  <div className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full ${style.bg} flex items-center justify-center text-white text-lg md:text-2xl font-black shadow-md`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm md:text-lg font-black text-slate-800 mb-0.5">{benefit.title}</h3>
                    <p className="text-slate-500 text-[10px] md:text-sm font-semibold leading-tight">{benefit.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/contact" className="group inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">
            Enroll Your Child Today
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;