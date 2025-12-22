export const revalidate = 10; 

import { Button } from "@/components/ui/button"
import { 
  Crown, Trophy, Swords, Brain, Target, 
  Users, TrendingUp, Globe, GraduationCap, 
  CheckCircle2, Star, Sparkles, MapPin
} from "lucide-react"
import { DynamicGallery } from "@/components/dynamicgallery"
import { DynamicReviews } from "@/components/dynamicreviews"
import { DynamicCourses } from "@/components/dynamiccourses"
import BenefitsSection from "@/components/ui/chess1"
import WhyChooseUsSection from "@/components/ui/whychess"
import MethodologySection from "@/components/ui/method"
import ChessFAQSection from "@/components/ui/chessfaq"
import { SuccessStoriesSection } from "@/components/dynamicsucess"

export default function ChessAcademyPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">

      {/* -------------------------------------------------------------------------- */
      /*                               1. HERO SECTION                               */
      /* -------------------------------------------------------------------------- */}
      <section className="pt-14 pb-20 relative overflow-hidden bg-gradient-to-b from-amber-50 to-white">
        
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-200/30 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-amber-200 shadow-sm text-amber-700 font-bold text-sm uppercase tracking-wider">
              <Crown size={16} className="text-amber-500 fill-amber-500" /> FIDE Rated Coaches
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black leading-[1.1] text-slate-900">
              Kids are the real <br/>
              <span className="text-amber-500">Kings & Queens</span> ♟️
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
              From first moves to checkmate. We build concentration, strategy, and confidence in young minds through professional chess training.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="h-14 px-8 bg-amber-500 hover:bg-[#b08d21] text-white rounded-full font-black text-lg shadow-[0_10px_20px_rgba(201,162,39,0.3)] hover:-translate-y-1 transition-all">
                Book Free Trial
              </Button>
              <Button variant="outline" className="h-14 px-8 bg-white border-2 border-slate-900 text-slate-900 rounded-full font-bold text-lg hover:bg-slate-900 hover:text-white transition-all">
                View Syllabus
              </Button>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative group perspective-1000">
             {/* Decorative Board Border */}
             <div className="absolute inset-0 bg-amber-200 rounded-[2rem] rotate-3 scale-105 opacity-60 -z-10 group-hover:rotate-0 transition-all duration-500"></div>
             
             <div className="relative rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl bg-white">
               <img 
                 src="/pic20.webp" 
                 alt="Kid playing chess" 
                 className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
               />
               
               {/* Floating Stats Card */}
               <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                     <Trophy size={24} />
                   </div>
                   <div>
                     <p className="text-xs text-slate-400 uppercase font-bold">Success Rate</p>
                     <p className="text-lg font-black text-slate-900">150+ Trophies</p>
                   </div>
                 </div>
                 <div className="h-8 w-[1px] bg-slate-200"></div>
                 <div className="text-right">
                    <p className="text-amber-500 font-black text-2xl">2200+</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Max Rating</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /*                             2. STATS (Light Version)                        */
      /* -------------------------------------------------------------------------- */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around items-center gap-8 text-center">
          {[
            { label: "Active Students", val: "500+", icon: Users },
            { label: "FIDE Instructors", val: "10+", icon: GraduationCap },
            { label: "Online & Offline", val: "Hybrid", icon: Globe },
            { label: "Avg Rating Boost", val: "+400", icon: TrendingUp },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group cursor-default p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-14 h-14 rounded-full bg-amber-50 group-hover:bg-amber-500 border border-amber-100 flex items-center justify-center text-amber-500 group-hover:text-white transition-colors">
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

      <WhyChooseUsSection/>

      {/* -------------------------------------------------------------------------- */
      /*                        3. WHY CHESS (Benefits Grid)                         */
      /* -------------------------------------------------------------------------- */}
      <BenefitsSection/>



      {/* -------------------------------------------------------------------------- */
      /*                       4. CURRICULUM (Dynamic Courses)                       */
      /* -------------------------------------------------------------------------- */}
      <div className="bg-white py-16">
        <div className="text-center mb-10">
           <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Learning Path</span>
           <h2 className="text-4xl font-black text-slate-900 mt-2">Choose Your Level</h2>
        </div>
        <DynamicCourses category="chess" />
      </div>

      {/* -------------------------------------------------------------------------- */
      /*                       5. METHODOLOGY (Light Version)                        */
      /* -------------------------------------------------------------------------- */}
      <MethodologySection/>

      <div className="py-12">
        <SuccessStoriesSection 
            badge="Champions"
            title="Our Wall of"
            titleHighlight="Fame"
            subtitle="Meet the students who redefined their limits and achieved the impossible."
        />
      </div>

      {/* -------------------------------------------------------------------------- */
      /*                      6. GALLERY (Dynamic Component)                         */
      /* -------------------------------------------------------------------------- */}
      <div className="py-12 bg-white">
        <DynamicGallery 
            category="chess" 
            title="Tournaments & Training" 
            subtitle="Capturing the intensity and joy of the game."
        />
      </div>

      {/* -------------------------------------------------------------------------- */
      /*                      7. REVIEWS (Dynamic Component)                         */
      /* -------------------------------------------------------------------------- */}
      <div className="bg-slate-50 py-12 border-y border-slate-100">
         <DynamicReviews category="chess" />
      </div>

      {/* -------------------------------------------------------------------------- */
      /*                          8. FAQ (Light Version)                             */
      /* -------------------------------------------------------------------------- */}
      <ChessFAQSection/>

      {/* -------------------------------------------------------------------------- */
      /*                               9. CTA SECTION                                */
      /* -------------------------------------------------------------------------- */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 shadow-xl shadow-amber-100/50">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #C9A227 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 p-10 md:p-16 text-center">
               <Crown className="w-16 h-16 text-amber-500 mx-auto mb-6" />
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                 Ready to Make Your Move?
               </h2>
               <p className="text-slate-600 text-xl font-medium mb-10 max-w-2xl mx-auto">
                 Join the academy that creates champions. Book your free assessment session today.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button className="h-14 px-10 bg-amber-500 hover:bg-[#b08d21] text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                   Join the Club
                 </Button>
                 <Button variant="outline" className="h-14 px-10 bg-white border-2 border-amber-500 text-amber-500 font-bold text-lg rounded-full hover:bg-amber-500 hover:text-white transition-all">
                   Contact Coach
                 </Button>
               </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}