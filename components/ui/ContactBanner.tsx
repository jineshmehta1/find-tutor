"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Home, ChevronRight, Star, Sparkles, BookOpen, GraduationCap, 
  ShieldCheck, Cpu, Calculator, Swords, Users, ArrowRight, Award, Zap, CheckCircle2 
} from 'lucide-react';

const ContactBanner: React.FC = () => {
  return (
    <div className="relative w-full bg-gradient-premium text-white overflow-hidden pt-12 pb-16 md:pt-16 md:pb-34">
      
      {/* --- Ambient Background Lights & Grid --- */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Main Content Container */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 space-y-10">
        
        {/* Breadcrumb Navigation Pill */}
        <div className="flex justify-center md:justify-start">
          <nav className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold">
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" strokeWidth={3} />
            <span className="text-amber-400 font-extrabold text-xs">
              Contact Support
            </span>
          </nav>
        </div>

        {/* Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading & Platform Intro */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Top Badges */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Response in 2 Hours</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vijayawada Helpdesk</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-5xl font-black tracking-tight leading-[1.08] text-white">
              Get in Touch with <span className="text-gradient-gold">Aacharya Platform</span>
            </h1>

            {/* Paragraph Description */}
            <p className="text-base md:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Ready to find the perfect verified local home tutor or start 1-on-1 online classes? Submit an inquiry below and our academic counselors will match you instantly with customized quotes.
            </p>

            {/* CTA Button Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/find-tutor-nearby"
                className="px-7 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 text-xs uppercase tracking-wider transition-all hover:scale-102 flex items-center gap-2"
              >
                <span>View Verified Tutors</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#contact"
                className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/15 backdrop-blur-md text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Post Enquiries Form</span>
              </a>
            </div>

            {/* Bullet Trust Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Physically Audited IDs</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>0% Hidden Commission</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Free Trial Demo Class</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating Stats Glass Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 grid grid-cols-2 gap-4"
          >
            <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl space-y-2 hover:border-amber-400/40 transition-all shadow-xl">
              <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center font-black">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-white">5,000+</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tutors Matched</div>
              <p className="text-[10px] text-slate-400 font-medium">Verified local & online instructors</p>
            </div>

            <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl space-y-2 hover:border-emerald-400/40 transition-all shadow-xl">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center font-black">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div className="text-3xl font-black text-white">4.95★</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Parent Rating</div>
              <p className="text-[10px] text-slate-400 font-medium">Over 1,200+ reviewed lessons</p>
            </div>

            <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl space-y-2 hover:border-blue-400/40 transition-all shadow-xl">
              <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-white">100%</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Verified IDs</div>
              <p className="text-[10px] text-slate-400 font-medium">Physical degree & address audit</p>
            </div>

            <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl space-y-2 hover:border-purple-400/40 transition-all shadow-xl">
              <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center font-black">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-white">24 hrs</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Fast Matching</div>
              <p className="text-[10px] text-slate-400 font-medium">Instant quotes from local tutors</p>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default ContactBanner;