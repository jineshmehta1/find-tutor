"use client";

import React from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  Quote 
} from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden font-sans">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* --- Left Column: Images Composition --- */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative w-full max-w-[550px] mx-auto lg:mx-0 h-[450px] sm:h-[520px]">
              
              {/* Decorative Pattern (Dots) */}
              <div className="absolute -top-8 -right-8 w-32 h-32 opacity-10 z-0">
                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                  <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="2" className="text-amber-600" fill="currentColor" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
              </div>

              {/* Main Image (Classroom/Academic) */}
              <div className="absolute top-0 left-0 w-[75%] h-[65%] z-10">
                <img 
                  src="/gallery15.jpg" 
                  alt="Students learning in classroom"
                  className="w-full h-full object-cover rounded-[2rem] shadow-2xl shadow-slate-200"
                />
              </div>

              {/* Secondary Image (Skill/Activity) */}
              <div className="absolute bottom-0 right-0 w-[65%] h-[55%] z-20">
                <div className="w-full h-full p-3 bg-white rounded-[2rem] shadow-xl">
                  <img 
                    src="/champion.webp" 
                    alt="Student engaging in robotics"
                    className="w-full h-full object-cover rounded-[1.5rem]"
                  />
                </div>
              </div>

              {/* Floating Badge: Years of Excellence */}
              <div className="absolute bottom-12 -left-4 sm:left-0 z-30 bg-white p-4 pr-6 rounded-r-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-4 border-l-4 border-amber-500 animate-in fade-in slide-in-from-left duration-700">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                  <Trophy className="w-6 h-6" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">15+</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Years of Excellence</div>
                </div>
              </div>

            </div>
          </div>

          {/* --- Right Column: Text Content --- */}
          <div className="w-full lg:w-1/2">
            
            {/* Pill Label */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-amber-50 border border-amber-100">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                About Aacharya
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-[1.15]">
              Bridging Academics with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                Future Skills.
              </span>
            </h2>

            {/* Description Text */}
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed mb-8">
              <p>
                At Aacharya, we believe education goes beyond textbooks. We fuse the rigour of the <strong className="text-slate-900">CBSE Curriculum</strong> with the creativity of modern skills like <strong className="text-slate-900">Robotics, Chess, and Abacus</strong>.
              </p>
              <p>
                Our mission is to nurture well-rounded individuals who are not only academic toppers but also critical thinkers and problem solvers.
              </p>
            </div>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
               {[
                 "CBSE Aligned Pedagogy", 
                 "Certified Skill Trainers", 
                 "Small Batch Sizes", 
                 "Holistic Development"
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                 </div>
               ))}
            </div>

            {/* Founder Profile Section */}
            <div className="relative mt-8 pt-8 border-t border-slate-100">
              {/* Quote Graphic */}
              <Quote className="absolute top-6 right-0 text-slate-100 w-12 h-12 -scale-x-100" />
              
              <div className="flex items-center gap-5 relative z-10">
                {/* <div className="relative">
                    <img 
                        src="/gallery21.jpeg" 
                        alt="Founder Portrait"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md ring-1 ring-slate-200"
                    />
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                </div> */}
                {/* <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Vivek Singh
                  </h4>
                  <p className="text-sm font-medium text-amber-600">
                    Founder & Principal Director
                  </p>
                </div> */}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;