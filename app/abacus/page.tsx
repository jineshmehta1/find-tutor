"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Calculator, Brain, Zap, Timer, CheckCircle2, 
  Puzzle, Eye, Mic, Award, GraduationCap, 
  HelpCircle, Plus, Minus, Layers, TrendingUp
} from "lucide-react"
import { DynamicGallery } from "@/components/dynamicgallery"
import { DynamicReviews } from "@/components/dynamicreviews"
import { DynamicCourses } from "@/components/dynamiccourses"
import WhyChooseAbacusSection from "@/components/ui/whyabacus"
import RoboticsFAQSection from "@/components/ui/robotfaq"
import AbacusFAQSection from "@/components/ui/roboticsfaq"
import { SuccessStoriesSection } from "@/components/dynamicsucess"

export default function AbacusPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">

      {/* -------------------------------------------------------------------------- */
      /*                               1. HERO SECTION                              */
      /* -------------------------------------------------------------------------- */}
      <section className="pt-14 pb-20 relative overflow-hidden bg-gradient-to-b from-amber-50 to-white">
        
        {/* Background: Math Symbols Pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f172a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        
        {/* Soft Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-200/30 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-amber-200 shadow-sm text-amber-700 font-bold text-sm uppercase tracking-wider">
              <Brain size={18} className="text-amber-500" /> Whole Brain Development
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-slate-900">
              Calculate Faster than a <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Calculator</span> ⚡
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
              Unlock your child's hidden genius. We teach visualization, concentration, and lightning-fast mental math skills.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="h-14 px-8 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-black text-lg shadow-[0_10px_20px_rgba(245,158,11,0.3)] hover:-translate-y-1 transition-all">
                Book Free Assessment
              </Button>
              <Button variant="outline" className="h-14 px-8 bg-white border-2 border-slate-900 text-slate-900 rounded-full font-bold text-lg hover:bg-slate-900 hover:text-white transition-all">
                Explore Levels
              </Button>
            </div>
          </div>
          
          {/* Right Image Composition */}
          <div className="relative group perspective-1000">
             {/* Decorative Border */}
             <div className="absolute inset-0 bg-amber-200 rounded-[2.5rem] rotate-3 scale-105 opacity-60 -z-10 group-hover:rotate-0 transition-all duration-500"></div>
             
             <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-white">
               <img 
                 src="/gallery15.jpg" 
                 alt="Kid using Abacus" 
                 className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
               />
               
               {/* Floating Badge 1 */}
               <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2 animate-bounce-slow">
                 <Calculator size={20} className="text-red-500 line-through" />
                 <span className="text-xs font-bold text-slate-700 uppercase">No Calculators Needed</span>
               </div>

               {/* Floating Stats Card (Bottom) */}
               <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-4">
                 <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                   <Zap size={24} />
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 uppercase font-bold">Calculation Speed</p>
                   <p className="text-xl font-black text-slate-900">5x Faster</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      

      {/* -------------------------------------------------------------------------- */
      /*                             2. MATH STATS                                   */
      /* -------------------------------------------------------------------------- */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around items-center gap-8 text-center">
          {[
            { label: "Graduates", val: "2,000+", icon: GraduationCap },
            { label: "National Winners", val: "100+", icon: Award },
            { label: "Speed Increase", val: "500%", icon: TrendingUp },
            { label: "Concentration", val: "10x", icon: Brain },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group cursor-default p-4 rounded-xl hover:bg-amber-50/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 group-hover:bg-amber-500 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:text-white transition-colors duration-300">
                <item.icon size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-slate-900">{item.val}</h3>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wide">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <WhyChooseAbacusSection/>

      {/* -------------------------------------------------------------------------- */
      /*                        3. WHY ABACUS (Benefits)                             */
      /* -------------------------------------------------------------------------- */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16">
            <span className="text-amber-600 font-bold uppercase tracking-widest text-sm bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Beyond Mathematics
            </span>
            <h2 className="text-4xl font-black text-slate-900 mt-4">Brain Gym for Kids 🧠</h2>
            <p className="text-slate-600 mt-4 text-lg max-w-2xl mx-auto font-medium">
              Abacus isn't just about math; it activates both the left (logic) and right (creative) sides of the brain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { icon: Eye, title: "Visualization", desc: "Kids learn to picture numbers as beads, boosting photographic memory.", color: "text-blue-600", bg: "bg-blue-50" },
               { icon: Zap, title: "Speed & Accuracy", desc: "Solving complex problems in seconds with 100% precision.", color: "text-amber-600", bg: "bg-amber-50" },
               { icon: Mic, title: "Listening Skills", desc: "Solving dictated sums improves auditory processing and focus.", color: "text-purple-600", bg: "bg-purple-50" },
               { icon: Puzzle, title: "Logical Thinking", desc: "Enhances problem-solving capabilities and analytical reasoning.", color: "text-rose-600", bg: "bg-rose-50" }
             ].map((item, i) => (
               <div key={i} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-200 hover:-translate-y-2 transition-all duration-300">
                 <div className={`w-16 h-16 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                   <item.icon size={30} strokeWidth={2} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                 <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /*                       4. CURRICULUM (Dynamic Courses)                       */
      /* -------------------------------------------------------------------------- */}
      <div className="bg-white py-16">
        <div className="text-center mb-10">
           <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Learning Path</span>
           <h2 className="text-4xl font-black text-slate-900 mt-2">Choose Your Level</h2>
        </div>
        <DynamicCourses category="abacus" />
      </div>

      {/* -------------------------------------------------------------------------- */
      /*                       5. THE METHODOLOGY (Visual Process)                   */
      /* -------------------------------------------------------------------------- */}
      <section className="py-24 bg-amber-50/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             
             {/* Left: Text & Process */}
             <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                  From <span className="text-amber-500">Touch</span> to <span className="text-orange-600">Visualization</span>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  We transition students from using a physical tool to performing complex calculations entirely in their minds.
                </p>
                
                <div className="space-y-4">
                  {[
                    { step: "Physical Abacus", desc: "Learning bead movements and finger techniques." },
                    { step: "Visualization", desc: "Imagining the abacus and moving beads mentally." },
                    { step: "Mental Arithmetic", desc: "Solving math problems faster than a calculator." },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
                      <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{item.step}</h4>
                        <p className="text-slate-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             {/* Right: Image */}
             <div className="relative">
                <div className="absolute inset-0 bg-orange-200 rounded-[2.5rem] rotate-6 opacity-30 transform translate-x-4"></div>
                <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-white">
                  <img 
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop" 
                    className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                    alt="Mental Math"
                  />
                </div>
             </div>

          </div>
        </div>
      </section>

      <div className="py-12">
        <SuccessStoriesSection 
            badge="Champions"
            title="Our Wall of"
            titleHighlight="Fame"
            subtitle="Meet the students who redefined their limits and achieved the impossible."
        />
      </div>

      {/* -------------------------------------------------------------------------- */
      /*                       6. TRAINING TOOLS (Tech Stack Style)                  */
      /* -------------------------------------------------------------------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-12">Our Training Tools 🧮</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Layers, label: "Soroban Abacus", desc: "The Japanese Tool", color: "text-amber-600", bg: "bg-amber-100" },
              { icon: FlashlightIcon, label: "Flash Cards", desc: "For Photographic Memory", color: "text-blue-600", bg: "bg-blue-100" },
              { icon: Timer, label: "Speed Writing", desc: "Motor Skill Drills", color: "text-rose-600", bg: "bg-rose-100" },
              { icon: Mic, label: "Audio Dictation", desc: "Listening Exercises", color: "text-green-600", bg: "bg-green-100" },
            ].map((tool, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-amber-400 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center gap-3 group cursor-default">
                <div className={`w-14 h-14 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <tool.icon size={28} />
                </div>
                <div>
                  <span className="block font-bold text-slate-900 text-lg">{tool.label}</span>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">{tool.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /*                      7. GALLERY & REVIEWS                                   */
      /* -------------------------------------------------------------------------- */}
      <div className="py-12 bg-white">
        <DynamicGallery 
            category="abacus" 
            title="Little Geniuses" 
            subtitle="See our students demonstrating incredible mental math skills."
        />
      </div>

      <div className="bg-slate-50 py-12 border-y border-slate-100">
         <DynamicReviews category="abacus" />
      </div>

      {/* -------------------------------------------------------------------------- */
      /*                          8. FAQ (Math Specific)                             */
      /* -------------------------------------------------------------------------- */}
      <AbacusFAQSection/>
      {/* -------------------------------------------------------------------------- */
      /*                               9. CTA SECTION                                */
      /* -------------------------------------------------------------------------- */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-amber-500 to-orange-500 shadow-xl shadow-orange-200">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 p-10 md:p-16 text-center">
               <Brain className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
               <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                 Unlock Your Child's Genius
               </h2>
               <p className="text-amber-50 text-xl font-medium mb-10 max-w-2xl mx-auto">
                 Give them the gift of speed, accuracy, and confidence. Join our next batch!
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button className="h-14 px-10 bg-white text-amber-600 hover:bg-slate-50 font-black text-lg rounded-full shadow-lg transition-all">
                   Enroll Now
                 </Button>
                 <Button variant="outline" className="h-14 px-10 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-amber-600 transition-all">
                   Watch Demo
                 </Button>
               </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

// Helper Icon
function FlashlightIcon(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12z"></path>
      <line x1="6" y1="6" x2="18" y2="6"></line>
      <line x1="12" y1="12" x2="12" y2="12"></line>
    </svg>
  )
}
