"use client";

import React from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Calculator, 
  BookOpen, 
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  Zap,
  Check
} from 'lucide-react';
import Link from 'next/link';

const AboutSection: React.FC = () => {
  const platformOfferings = [
    { 
      id: "school",
      icon: GraduationCap, 
      title: "School Tuitions (Class 1-12)", 
      tag: "CBSE & ICSE Specialists",
      image: "/tutor_teaching_card.png",
      desc: "1-on-1 personalized home tuition & live online classes in Mathematics, Physics, Chemistry, and Biology.", 
      highlights: ["Dedicated Subject Tutors", "Home Visits & Online Mode", "Weekly Chapterwise Tests"],
      color: "bg-blue-600 text-white" 
    },
    { 
      id: "coding",
      icon: Cpu, 
      title: "Coding, AI & Robotics", 
      tag: "Future Tech Skills",
      image: "/robotics-center.jpeg",
      desc: "Live interactive coding classes in Python, Web Development, Scratch, and hands-on Arduino IoT hardware kits.", 
      highlights: ["Hands-on STEM Kits", "Project Based Certificates", "Beginner to Advanced"],
      color: "bg-emerald-600 text-white" 
    },
    { 
      id: "abacus",
      icon: Calculator, 
      title: "Abacus & Mental Math", 
      tag: "Speed & Concentration",
      image: "/kidabacus.jpg",
      desc: "9-level structured brain development program for lightning-fast calculations & Olympiad speed math.", 
      highlights: ["10x Speed Calculations", "Improved Concentration", "Olympiad Level Prep"],
      color: "bg-amber-600 text-white" 
    },
    { 
      id: "chess",
      icon: Trophy, 
      title: "Grandmaster Chess Academy", 
      tag: "FIDE Rated Trainers",
      image: "/kidchess.jpg",
      desc: "FIDE rated coaching covering tactical openings, middle game strategy, endgames, and Sunday chess clubs.", 
      highlights: ["FIDE Certified Coaches", "Sunday Club Tournaments", "Strategic Thinking"],
      color: "bg-purple-600 text-white" 
    },
    { 
      id: "jee",
      icon: Zap, 
      title: "JEE & NEET Entrance Prep", 
      tag: "Top Rank Coaching",
      image: "/school-ach.jpeg",
      desc: "Rigorous entrance exam preparation by IITians and experienced medical faculty for high scores.", 
      highlights: ["IIT & Medical Faculty", "Deep Doubt Resolution", "1-on-1 Custom Pace"],
      color: "bg-rose-600 text-white" 
    },
    { 
      id: "verified",
      icon: ShieldCheck, 
      title: "Physical ID Verified Tutors", 
      tag: "100% Safety & Audit",
      image: "/champion.webp",
      desc: "Every instructor undergoes physical Aadhaar identity, academic degree, and address verification.", 
      highlights: ["Physically Checked Degrees", "0% Hidden Agency Markup", "Free 30-Min Demo"],
      color: "bg-indigo-600 text-white" 
    },
  ];

  const advantages = [
    { title: '100% Background Checked Tutors', desc: 'Every instructor undergoes physical ID, address, and degree verification.', color: 'sky' },
    { title: 'Zero Brokerage & Transparent Fees', desc: 'No hidden agency markups. You negotiate and pay tutors directly.', color: 'slate' },
    { title: 'Complimentary 30-Min Free Demo', desc: 'Take a trial class to evaluate teaching style and compatibility before booking.', color: 'rose' },
    { title: 'Flexible Hybrid Learning', desc: 'Seamlessly switch between Home Visits (Tutor Visits You) and Live 1-on-1 Online.', color: 'amber' },
    { title: 'Local Bhavanipuram Support', desc: 'Dedicated academic counselors in Vijayawada helping match the ideal tutor.', color: 'sky' },
  ];

  const colorStyles = {
    sky: { bg: 'bg-emerald-500', border: 'border-emerald-100' },
    slate: { bg: 'bg-slate-800', border: 'border-slate-100' },
    rose: { bg: 'bg-amber-500', border: 'border-amber-100' },
    amber: { bg: 'bg-indigo-600', border: 'border-indigo-100' },
  };

  return (
    <div className="bg-white">
      {/* --- HERO PLATFORM OVERVIEW --- */}
      <section className="py-12 md:py-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          <div className="w-full lg:w-1/2 relative">
            <div className="relative w-full max-w-[550px] mx-auto lg:mx-0 h-[320px] md:h-[450px]">
              <div className="absolute top-0 left-0 w-[78%] h-[75%] z-10">
                <img src="/about.jpeg" alt="Tutor Teaching Student" className="w-full h-full object-cover rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border-4 border-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-[65%] h-[60%] z-20">
                <div className="w-full h-full p-2 bg-white rounded-[1.5rem] shadow-xl">
                  <img src="/champion.webp" alt="Student Achievement" className="w-full h-full object-cover rounded-[1rem]" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">Our Platform Mission</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              Transforming Education with <br className="hidden md:block" />
              <span className="text-amber-500">Verified Local Tutors.</span>
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
              At Aacharya Platform, we remove the stress of finding trusted, high-quality private tutors. Whether your child needs one-on-one board exam prep in Mathematics, Python coding, or mental math speed training, we match you with verified educators in Bhavanipuram and Vijayawada.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {["100% ID Verified", "0% Brokerage Cut", "Free 30-Min Demo", "Home & Online"].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-slate-800 text-xs md:text-sm font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- OFFERINGS GRID WITH RICH IMAGES & BADGES --- */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-5 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Specialized Learning Programs
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">
              What We <span className="text-gradient-gold">Offer</span>
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Comprehensive tutoring, future tech coding, mental math, and chess programs taught by verified educators.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformOfferings.map((prog) => {
              const IconComp = prog.icon;
              return (
                <div 
                  key={prog.id} 
                  className="group flex flex-col rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 justify-between relative"
                >
                  {/* Card Image Header with Dark Gradient Overlay */}
                  <div className="relative h-48 md:h-52 w-full overflow-hidden bg-slate-900">
                    <img 
                      src={prog.image} 
                      alt={prog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Floating Badge Tag */}
                    <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                      {prog.tag}
                    </div>

                    {/* Floating Icon Badge */}
                    <div className={`absolute bottom-4 left-4 p-3 rounded-2xl ${prog.color} shadow-lg border border-white/20`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-extrabold text-slate-950 group-hover:text-primary transition-colors leading-snug">
                        {prog.title}
                      </h3>
                      <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                        {prog.desc}
                      </p>
                    </div>

                    {/* Bullet Highlights */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {prog.highlights.map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-6 md:px-8 pb-6 pt-2 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Home & Online Available
                    </span>
                    <Link 
                      href={`/find-tutor-nearby?subject=${encodeURIComponent(prog.title.split("(")[0])}`}
                      className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Find Tutors</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- WHY PARENTS TRUST US --- */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold uppercase">
            <CheckCircle2 size={14} /> Platform Promise
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900">Why Parents Trust Aacharya Platform</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {advantages.map((benefit, idx) => {
            const isRightAligned = idx % 2 !== 0;
            const style = colorStyles[benefit.color as keyof typeof colorStyles];
            return (
              <div key={idx} className={`relative flex items-center ${isRightAligned ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                <div className={`relative z-10 w-full bg-slate-50 border-[1.5px] ${style.border} rounded-2xl p-5 flex items-center gap-4 ${isRightAligned ? 'lg:flex-row-reverse lg:text-right' : 'text-left'}`}>
                  <div className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full ${style.bg} flex items-center justify-center text-white text-lg md:text-xl font-black shadow-md`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm md:text-base font-black text-slate-900 mb-0.5">{benefit.title}</h3>
                    <p className="text-slate-500 text-[11px] md:text-xs font-medium leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/find-tutor-nearby" className="group inline-flex items-center gap-3 bg-slate-950 hover:bg-primary text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">
            Find A Verified Tutor Nearby
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;