"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, ShieldCheck } from "lucide-react";

interface FeeEstimatorProps {
  onSelectEstimate?: (subject: string, level: string, mode: string) => void;
}

export function FeeEstimator({ onSelectEstimate }: FeeEstimatorProps) {
  const [level, setLevel] = useState("Class 9-10");
  const [subjectType, setSubjectType] = useState("Science & Maths");
  const [mode, setMode] = useState("Home Tuition");
  const [frequency, setFrequency] = useState("5 Days / Week");

  // Fee calculation logic
  const calculateFee = () => {
    let baseRateMin = 350;
    let baseRateMax = 500;

    if (level === "Class 1-5") {
      baseRateMin = 250;
      baseRateMax = 350;
    } else if (level === "Class 6-8") {
      baseRateMin = 300;
      baseRateMax = 420;
    } else if (level === "Class 9-10") {
      baseRateMin = 380;
      baseRateMax = 550;
    } else if (level === "Class 11-12") {
      baseRateMin = 500;
      baseRateMax = 800;
    } else if (level === "Tech & Programming" || level === "Competitive JEE/NEET") {
      baseRateMin = 600;
      baseRateMax = 1000;
    }

    if (mode === "Online (1-on-1)") {
      baseRateMin = Math.round(baseRateMin * 0.8);
      baseRateMax = Math.round(baseRateMax * 0.85);
    } else if (mode === "Center / Batch") {
      baseRateMin = Math.round(baseRateMin * 0.6);
      baseRateMax = Math.round(baseRateMax * 0.65);
    }

    if (subjectType === "JEE/NEET Prep" || subjectType === "AI & Robotics") {
      baseRateMin = Math.round(baseRateMin * 1.2);
      baseRateMax = Math.round(baseRateMax * 1.25);
    }

    // Monthly calculation (approx 20 hrs/month for 5 days a week, 12 hrs for 3 days)
    const hrsPerMonth = frequency === "5 Days / Week" ? 20 : frequency === "3 Days / Week" ? 12 : 8;
    const monthlyMin = baseRateMin * hrsPerMonth;
    const monthlyMax = baseRateMax * hrsPerMonth;

    return {
      hourly: `₹${baseRateMin} - ₹${baseRateMax}`,
      monthly: `₹${monthlyMin.toLocaleString('en-IN')} - ₹${monthlyMax.toLocaleString('en-IN')}`,
      tutorsAvailable: Math.floor(25 + Math.random() * 10) + (level === "Class 9-10" ? 40 : 20)
    };
  };

  const fees = calculateFee();

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-6 md:p-10 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Interactive Tuition Fee Calculator</span>
          </div>

          <div>
            <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Estimate Tuition Cost in <span className="text-gradient-gold">Bhavanipuram & Vijayawada</span>
            </h3>
            <p className="text-slate-400 text-sm font-medium mt-2">
              Select student class, learning mode, and frequency to view transparent market rate estimates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Level Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Student Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 text-white rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="Class 1-5">Class 1 to 5 (Primary)</option>
                <option value="Class 6-8">Class 6 to 8 (Middle)</option>
                <option value="Class 9-10">Class 9 & 10 (Secondary)</option>
                <option value="Class 11-12">Class 11 & 12 (Higher Secondary)</option>
                <option value="Competitive JEE/NEET">JEE Prep / NEET Exam</option>
                <option value="Tech & Programming">Coding, AI & Robotics</option>
              </select>
            </div>

            {/* Subject Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Subject Group</label>
              <select
                value={subjectType}
                onChange={(e) => setSubjectType(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 text-white rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="Science & Maths">Mathematics & Science</option>
                <option value="All CBSE/ICSE Subjects">All Subjects (Combo)</option>
                <option value="JEE/NEET Prep">Physics & Chemistry Deep Dive</option>
                <option value="AI & Robotics">Coding, Python & AI</option>
                <option value="Abacus & Chess">Abacus & Chess Coaching</option>
                <option value="Spoken English">Languages & Spoken English</option>
              </select>
            </div>

            {/* Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Teaching Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 text-white rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="Home Tuition">At Student Home</option>
                <option value="Online (1-on-1)">Online mode</option>
                <option value="Center / Batch">At Teacher Home</option>
              </select>
            </div>

            {/* Frequency Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 text-white rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="5 Days / Week">5 Days / Week (Regular)</option>
                <option value="3 Days / Week">3 Days / Week (Alternate)</option>
                <option value="Weekend Special">Weekend Special (Sat & Sun)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Estimated Result Box */}
        <div className="lg:col-span-5">
          <motion.div
            key={`${level}-${mode}-${subjectType}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Estimated Market Fee</span>
              <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/30">
                0% Brokerage Cut
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Estimated Hourly Rate</span>
                <div className="text-3xl md:text-4xl font-black text-amber-400 mt-1">
                  {fees.hourly} <span className="text-xs font-medium text-slate-300">/ hour</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Monthly Package (Approx)</span>
                <div className="text-2xl md:text-3xl font-black text-white mt-1">
                  {fees.monthly} <span className="text-xs font-medium text-slate-300">/ month</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Matches Available:
              </span>
              <span className="font-extrabold text-emerald-400">{fees.tutorsAvailable}+ Verified Tutors</span>
            </div>

            <button
              onClick={() => onSelectEstimate && onSelectEstimate(subjectType, level, mode)}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all hover:scale-102 active:scale-98"
            >
              <span>Get Exact Quotes For This Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
