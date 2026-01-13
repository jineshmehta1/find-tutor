"use client";

import React, { useState } from 'react';
import { 
  BookOpen, Brain, Bot, Swords, GraduationCap, 
  CheckCircle2, Users, ClipboardCheck, MessageCircle, 
  ArrowRight, FileText, Lightbulb, Target, Sparkles 
} from 'lucide-react';
import PrimaryBanner from '@/components/ui/primaryBanner';

export default function CoachesAndMethodology() {
  const [activeTab, setActiveTab] = useState('primary');

  const programs = {
    primary: {
      id: 'primary',
      label: 'Pre Primary Schooling',
      icon: <BookOpen className="w-5 h-5" />,
      title: "Foundational Literacy & Curiosity",
      description: "We focus on building strong reading habits,  intelligence before moving to complex subjects.",
      points: [
        "Curiosity-based learning modules",
        "Visual & interactive storytelling",
        "Small learning milestones to build confidence",
        "Emotional & academic balance"
      ]
    },
    abacus: {
      id: 'abacus',
      label: 'Abacus & Vedic Math',
      icon: <Brain className="w-5 h-5" />,
      title: "Mental Calculation & Brain Development",
      description: "A structured program designed to enhance speed, accuracy, and concentration through ancient calculation methods.",
      points: [
        "Whole-brain activation techniques",
        "Daily drills & speed competitions",
        "Measurable improvement in concentration",
        "Structured levels (Beginner to Advanced)"
      ]
    },
    robotics: {
      id: 'robotics',
      label: 'Robotics & AI',
      icon: <Bot className="w-5 h-5" />,
      title: "Logic, Coding & Future Tech",
      description: "Moving children from consumers of technology to creators. We teach logic, assembly, and basic programming.",
      points: [
        "Hands-on mechanical assembly",
        "Block-based coding for beginners",
        "Real-world problem solving projects",
        "Innovation-based learning approach"
      ]
    },
    chess: {
      id: 'chess',
      label: 'Pro Chess',
      icon: <Swords className="w-5 h-5" />,
      title: "Strategy & Decision Making",
      description: "Our chess curriculum is not just about playing, but about analyzing, planning, and accepting consequences of moves.",
      points: [
        "Opening → Middlegame → Endgame system",
        "Psychological tournament training",
        "Pattern recognition drills",
        "Analysis-based improvement"
      ]
    },
    cbse: {
      id: 'cbse',
      label: 'CBSE Coaching',
      icon: <GraduationCap className="w-5 h-5" />,
      title: "Concept Clarity & Exam Confidence",
      description: "For older students, we transition to a rigor-based approach focusing on syllabus mastery and exam techniques.",
      points: [
        "Syllabus-aligned teaching",
        "Regular mock tests & performance reports",
        "Dedicated doubt-clearing sessions",
        "Board-exam orientation"
      ]
    }
  };

  return (
    <div className="bg-white font-sans text-slate-900">
      <PrimaryBanner/>

      {/* -------------------------------------------------------------------------- */
      /*                               1. HERO SECTION                               */
      /* -------------------------------------------------------------------------- */}
      <section className="relative py-20 px-4 text-center bg-slate-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-yellow-600"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900">
            A Founder-Led Academic System <br />
            <span className="text-amber-600">Built for Real Learning.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Our programs are designed, supervised, and refined under the direct vision of our founder and senior academic board—not left to chance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all">
              Book Academic Consultation
            </button>
            <button className="px-8 py-3 bg-white border-2 border-slate-200 hover:border-amber-500 text-slate-700 font-bold rounded-xl transition-all">
              Explore Our Methodology
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /*                          2. FOUNDER SPOTLIGHT                               */
      /* -------------------------------------------------------------------------- */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* Founder Image */}
          <div className="md:col-span-5 relative">
            <div className="absolute inset-0 bg-amber-100 rounded-[2rem] rotate-3 transform translate-x-2 translate-y-2"></div>
            <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop" 
                alt="Founder of Aacharya Academy" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Experience Badge */}
            <div className="absolute bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border-l-4 border-amber-500">
              <p className="text-3xl font-black text-slate-900">20+</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Years of<br/>Excellence</p>
            </div>
          </div>

          {/* Founder Text */}
          <div className="md:col-span-7 space-y-6">
            <div className="inline-block px-3 py-1 bg-amber-50 text-amber-700 font-bold text-xs uppercase tracking-wider rounded-full">
              The Visionary
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Mrs. Anjali Sharma
              <span className="block text-lg md:text-xl font-medium text-slate-500 mt-1">Founder & Academic Director</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              "Education is not just about filling a bucket, but lighting a fire. My vision for Aacharya was to create a space where academic rigor meets creative freedom. We don't just teach subjects; we build the thinking framework for a child's entire life."
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-500" />
                  Mission
                </h4>
                <p className="text-sm text-slate-600 mt-1">To bridge the gap between rote learning and true understanding.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Philosophy
                </h4>
                <p className="text-sm text-slate-600 mt-1">Every child is a genius if taught the way they learn best.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /*                       3. LEADERSHIP MODEL (Trust)                           */
      /* -------------------------------------------------------------------------- */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How We Maintain Teaching Excellence</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our quality isn't dependent on individual teachers alone. It is driven by a robust, centralized academic system.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <FileText className="w-8 h-8 text-amber-400" />, 
                title: "Centralized Lesson Plans", 
                desc: "Every class, topic, and activity is pre-designed by our Academic Board to ensure consistency across all batches." 
              },
              { 
                icon: <ClipboardCheck className="w-8 h-8 text-amber-400" />, 
                title: "Weekly Academic Audits", 
                desc: "Our senior coordinators review classroom progress weekly to ensure no child is left behind." 
              },
              { 
                icon: <Users className="w-8 h-8 text-amber-400" />, 
                title: "Continuous Training", 
                desc: "Teachers undergo rigorous training every quarter on new methodologies and child psychology." 
              }
            ].map((item, i) => (
              <div key={i} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-colors">
                <div className="mb-4 bg-slate-900 w-16 h-16 rounded-xl flex items-center justify-center border border-slate-700">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /*                  4. & 5. METHODOLOGY & PROGRAMS (Interactive)               */
      /* -------------------------------------------------------------------------- */}
      <section className="py-24 px-4 bg-amber-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Our Specialized Methodology
            </h2>
            <p className="text-slate-600">Select a program to see how we teach it.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Tabs */}
            <div className="lg:w-1/3 flex flex-col gap-2">
              {Object.values(programs).map((prog) => (
                <button
                  key={prog.id}
                  onClick={() => setActiveTab(prog.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                    activeTab === prog.id 
                      ? 'bg-white border-amber-400 shadow-md transform scale-102' 
                      : 'bg-white border-transparent hover:bg-white/60 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === prog.id ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'}`}>
                    {prog.icon}
                  </div>
                  <span className={`font-bold text-lg ${activeTab === prog.id ? 'text-slate-900' : ''}`}>
                    {prog.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="lg:w-2/3">
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 h-full">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-3 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/30">
                     {programs[activeTab as keyof typeof programs].icon}
                   </div>
                   <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                     {programs[activeTab as keyof typeof programs].title}
                   </h3>
                </div>
                
                <p className="text-lg text-slate-600 mb-8 leading-relaxed border-l-4 border-amber-200 pl-4">
                  {programs[activeTab as keyof typeof programs].description}
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {programs[activeTab as keyof typeof programs].points.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-700 text-sm">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /*                      6. STUDENT DEVELOPMENT PHILOSOPHY                      */
      /* -------------------------------------------------------------------------- */}
      <section className="py-20 px-4 max-w-5xl mx-auto text-center">
  <h2 className="text-3xl font-bold mb-12">
    We Don't Just Teach Subjects — <span className="text-amber-600">We Build Thinkers</span>
  </h2>

  {/* grid-cols-1 for very small, sm:grid-cols-2 for tablet-ish mobile, md:grid-cols-4 for desktop */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
    {[
      { head: "Discipline", sub: "Without Fear" },
      { head: "Confidence", sub: "Without Arrogance" },
      { head: "Learning", sub: "Without Rote" },
      { head: "Growth", sub: "Beyond Marks" },
    ].map((item, i) => (
      <div 
        key={i} 
        className="flex items-center sm:flex-col sm:justify-center p-4 sm:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-amber-300 transition-all group"
      >
        {/* The Bar: Vertical on mobile (left), Horizontal on desktop (top) */}
        <div className="w-1 h-8 sm:w-12 sm:h-1 bg-slate-200 group-hover:bg-amber-400 mr-4 sm:mr-0 sm:mb-4 transition-colors shrink-0"></div>
        
        <div className="text-left sm:text-center">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
            {item.head}
          </h4>
          <p className="text-slate-500 text-[10px] sm:text-sm font-medium uppercase tracking-wide mt-0.5">
            {item.sub}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* -------------------------------------------------------------------------- */
      /*                           7. PARENT TRANSPARENCY                            */
      /* -------------------------------------------------------------------------- */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
           <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4">Complete Transparency with Parents</h3>
              <p className="text-slate-600 mb-6">
                We believe parents are partners in education. You will never be in the dark about your child's progress.
              </p>
              <ul className="space-y-4">
                {[
                  "Monthly Progress Reports",
                  "Open House Meetings",
                  "Direct Access to Academic Coordinators",
                  "Regular Learning Roadmaps"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="font-semibold text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
           </div>
           <div className="md:w-1/2 relative">
             <div className="absolute inset-0 bg-amber-200 rounded-full blur-3xl opacity-30"></div>
             <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
                <div className="bg-green-500 p-3 rounded-full text-white">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Average Response Time</p>
                  <p className="text-xl font-bold text-slate-900">Under 2 Hours</p>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /*                               8. CTA SECTION                                */
      /* -------------------------------------------------------------------------- */}
      <section className="py-20 px-4 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <Lightbulb className="w-12 h-12 text-amber-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Not Just Classes. <br/>A Complete Learning System.
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Join 500+ parents who trust Aacharya for their child's holistic development.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
               Book Academic Consultation <ArrowRight size={20} />
             </button>
             <button className="px-8 py-4 bg-transparent border border-slate-600 hover:border-white hover:bg-white hover:text-slate-900 text-white font-bold rounded-xl transition-all">
               Talk to Our Academic Team
             </button>
          </div>
        </div>
      </section>

    </div>
  );
}
