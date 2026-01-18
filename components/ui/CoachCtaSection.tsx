"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Trophy, Star, CheckCircle, Sparkles } from 'lucide-react';

const CoachCtaSection: React.FC = () => {
  return (
    <section className="relative py-20 px-4 md:px-8 bg-white font-sans overflow-hidden">
      
      {/* --- Background Texture (Light & Academic) --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-50/50 -skew-x-12 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-100/40 rounded-full blur-3xl"></div>
        {/* Subtle Dots */}
        <div className="absolute inset-0 opacity-[0.4]" 
             style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        
        {/* Main Card Container */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
          
          {/* --- LEFT: Content Area --- */}
          <div className="w-full lg:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 font-bold text-xs uppercase tracking-widest mb-6">
              <Trophy className="w-3.5 h-3.5" />
              <span>World-Class Faculty</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-[1.15]">
              Find the perfect <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                Mentor for your Child.
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-slate-600 text-lg mb-8 leading-relaxed max-w-lg">
              Learning is faster when you have the right guide. Our FIDE-rated coaches and certified academic tutors tailor every session to your child's pace.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-10">
              {[
                "Certified Trainers with 5+ Years Experience",
                "Personalized Learning Roadmap",
                "Regular Progress Reports & Feedback"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/bookdemo" className="w-full sm:w-auto">
                <button className="w-full group bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-1">
                  Book Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/gallery" className="w-full sm:w-auto">
                <button className="w-full bg-white border-2 border-slate-100 text-slate-700 font-bold py-4 px-8 rounded-xl hover:border-amber-500 hover:text-amber-600 transition-all">
                  View Profiles
                </button>
              </Link>
            </div>
          </div>

          {/* --- RIGHT: Image / Visual Area --- */}
          <div className="w-full lg:w-2/5 relative min-h-[400px] lg:min-h-full bg-amber-50">
            {/* Main Image */}
            <img 
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Friendly Teacher" 
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Gradient (Bottom) */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>

            {/* Floating 'Top Rated' Badge */}
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl animate-bounce-slow">
               <div className="flex items-center gap-1 mb-1">
                 {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
               </div>
               <p className="text-xs font-bold text-slate-800 uppercase tracking-wide text-center">Top Rated Tutors</p>
            </div>

            {/* Floating 'Result' Badge */}
            <div className="absolute bottom-8 left-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
               <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-green-600" />
               </div>
               <div>
                  <p className="text-sm font-bold text-slate-900">Proven Results</p>
                  <p className="text-xs text-slate-500">100% Success Rate</p>
               </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default CoachCtaSection;