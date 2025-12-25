"use client";

import React from "react";
import Link from "next/link";
import { 
  Crown,          // Chess
  Calculator,     // Abacus
  Bot,            // Robotics
  Backpack,       // Primary School
  BookOpen,       // Coaching
  ArrowRight, 
  ArrowUp,
  Sparkles
} from "lucide-react";

// --- Program Data ---
const programs = [
  {
    id: "chess",
    title: "Chess Coaching",
    description: "From beginner moves to Grandmaster strategy. Enhance concentration and tactical thinking with FIDE-rated trainers.",
    icon: <Crown className="w-8 h-8 text-amber-600" />,
    features: ["FIDE Rated Trainers", "Tactical Analysis", "Tournament Prep"],
    color: "bg-amber-50 border-amber-100",
    iconBg: "bg-amber-100",
  },
  {
    id: "abacus",
    title: "Abacus Training",
    description: "Boost mental math speed, memory, and visualization skills. A proven method to make your child fall in love with numbers.",
    icon: <Calculator className="w-8 h-8 text-yellow-600" />,
    features: ["Speed Calculation", "Visual Memory", "Brain Development"],
    color: "bg-yellow-50 border-yellow-100",
    iconBg: "bg-yellow-100",
  },
  {
    id: "robotics",
    title: "Robotics Classes",
    description: "Hands-on STEM learning. Students build, code, and operate their own robots using modern kits and AI concepts.",
    icon: <Bot className="w-8 h-8 text-orange-600" />,
    features: ["STEM Foundations", "Coding Logic", "Hardware Projects"],
    color: "bg-orange-50 border-orange-100",
    iconBg: "bg-orange-100",
  },
  {
    id: "school",
    title: "Pre Primary School",
    description: "A complete CBSE-aligned academic program focusing on holistic growth, curiosity, and strong foundational values.",
    icon: <Backpack className="w-8 h-8 text-indigo-600" />,
    features: ["CBSE Curriculum", "Value Education", "Activity Based"],
    color: "bg-indigo-50 border-indigo-100",
    iconBg: "bg-indigo-100",
  },
  {
    id: "coaching",
    title: "Coaching (CBSE)",
    description: "Subject-specific tuition for higher grades. rigorous practice, doubt solving, and exam-oriented preparation.",
    icon: <BookOpen className="w-8 h-8 text-slate-600" />,
    features: ["Maths & Science", "Exam Strategy", "Small Batches"],
    color: "bg-slate-50 border-slate-200",
    iconBg: "bg-slate-200",
  },
];

export default function CoursesSection() {
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative bg-slate-50 py-16 lg:py-24 font-sans overflow-hidden" id="programs">
      
      {/* --- Background Pattern --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-yellow-400 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-orange-400 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 mb-4">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-600" />
            <span className="text-amber-800 font-bold text-xs uppercase tracking-wider">Holistic Education</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Our Academic & Skill <span className="text-amber-500">Programs</span>
          </h2>
          <p className="text-slate-600 text-lg">
            Whether you want to top the class or master a new skill, we have a structured path for you.
          </p>
        </div>

        {/* --- Cards Grid --- */}
        {/* Grid logic: 3 columns for skills, then centered row for academics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          
          {programs.map((program, idx) => (
            <div 
              key={program.id}
              className={`
                group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm 
                hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 
                transition-all duration-300 flex flex-col justify-between
                ${idx >= 3 ? 'lg:col-span-1.5' : ''} /* This keeps the grid alignment clean if needed, or remove for standard grid */
              `}
            >
              {/* Hover Line Top */}
              <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-amber-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

              <div>
                {/* Icon Box */}
                <div className={`w-16 h-16 rounded-2xl ${program.iconBg} flex items-center justify-center mb-6 transition-transform group-hover:rotate-6`}>
                  {program.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                  {program.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {program.description}
                </p>

                {/* Mini Features Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {program.features.map((feat, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-semibold rounded-md border border-slate-100">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Link href="https://wa.me/+918074103400" target="_blank" className="mt-auto">
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-amber-500 hover:text-white transition-all duration-300 group-hover:shadow-lg">
                  Enquire Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

            </div>
          ))}
        </div>

      </div>

      {/* --- Scroll to Top Button --- */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-1 hover:scale-110"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" strokeWidth={3} />
      </button>

    </section>
  );
}