// 1. Force dynamic to ensure Admin data updates instantl
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button"
import { 
  Calculator, Brain, Zap, Timer, 
  Puzzle, Eye, Mic, Award, GraduationCap, 
  Layers, TrendingUp
} from "lucide-react"

// Dynamic Components (Prop-ready versions)
import { DynamicGallery } from "@/components/dynamicgallery"
import { DynamicReviews } from "@/components/dynamicreviews"
import { DynamicCourses } from "@/components/dynamiccourses"
import { SuccessStoriesSection } from "@/components/dynamicsucess"

// Static UI Sections
import WhyChooseAbacusSection from "@/components/ui/whyabacus"
import AbacusFAQSection from "@/components/ui/roboticsfaq"

// 2. DATA FETCHING FROM PRISMA
import { prisma } from "@/lib/data"; 

async function getAbacusPageData() {
  const pageKey = "abacus";

  try {
    const [courses, gallery, reviews, stories] = await Promise.all([
      prisma.course.findMany({
        where: { pageKey },
        orderBy: { createdAt: "asc" },
      }),
      prisma.galleryItem.findMany({
        where: { pageKey },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.findMany({
        where: { pageKey },
        orderBy: { createdAt: "desc" },
      }),
      prisma.successStory.findMany({
        where: { pageKey },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Parse features JSON string to Array
    const parsedCourses = courses.map((c) => ({
      ...c,
      features: typeof c.features === 'string' ? JSON.parse(c.features) : (c.features || []),
    }));

    return { courses: parsedCourses, gallery, reviews, stories };
  } catch (error) {
    console.error("Error fetching abacus data:", error);
    return { courses: [], gallery: [], reviews: [], stories: [] };
  }
}

// 3. SERVER COMPONENT (Async)
export default async function AbacusPage() {
  const data = await getAbacusPageData();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">

      {/* ------------------- HERO SECTION ------------------- */}
      <section className="pt-14 pb-20 relative overflow-hidden bg-gradient-to-b from-amber-50 to-white">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f172a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-200/30 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
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
              <Button className="h-14 px-8 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-black text-lg shadow-lg">Book Free Assessment</Button>
            </div>
          </div>
          
          <div className="relative group perspective-1000">
             <div className="absolute inset-0 bg-amber-200 rounded-[2.5rem] rotate-3 scale-105 opacity-60 -z-10 group-hover:rotate-0 transition-all duration-500"></div>
             <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-white">
               <img src="/gallery15.jpg" alt="Kid using Abacus" className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700" />
               <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2 animate-bounce-slow">
                 <Calculator size={20} className="text-red-500 line-through" />
                 <span className="text-xs font-bold text-slate-700 uppercase">No Calculators Needed</span>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* ------------------- MATH STATS ------------------- */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around items-center gap-8 text-center">
          {[
            { label: "Graduates", val: "2,000+", icon: GraduationCap },
            { label: "National Winners", val: "100+", icon: Award },
            { label: "Speed Increase", val: "500%", icon: TrendingUp },
            { label: "Concentration", val: "10x", icon: Brain },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group p-4 rounded-xl hover:bg-amber-50/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 group-hover:bg-amber-500 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:text-white transition-all duration-300">
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

      {/* ------------------- CURRICULUM (Data from Server) ------------------- */}
      <div className="bg-white py-16">
        <div className="text-center mb-10">
           <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Learning Path</span>
           <h2 className="text-4xl font-black text-slate-900 mt-2">Choose Your Level</h2>
        </div>
        <DynamicCourses courses={data.courses} />
      </div>

      {/* ------------------- TRAINING TOOLS ------------------- */}
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
              <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-amber-400 transition-all flex flex-col items-center gap-3 group">
                <div className={`w-14 h-14 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}><tool.icon size={28} /></div>
                <div><span className="block font-bold text-slate-900 text-lg">{tool.label}</span><span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">{tool.desc}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------- SUCCESS STORIES (Data from Server) ------------------- */}
      <div className="py-12">
        <SuccessStoriesSection 
            badge="Champions"
            title="Our Wall of"
            titleHighlight="Fame"
            subtitle="Meet the students who redefined their limits."
            stories={data.stories}
        />
      </div>

      {/* ------------------- GALLERY (Data from Server) ------------------- */}
      <div className="py-12 bg-white">
        <DynamicGallery 
            images={data.gallery}
            title="Little Geniuses" 
            subtitle="Demonstrating incredible mental math skills."
            badge="Abacus Gallery"
        />
      </div>

      {/* ------------------- REVIEWS (Data from Server) ------------------- */}
      <div className="bg-slate-50 py-12 border-y border-slate-100">
         <DynamicReviews reviews={data.reviews} />
      </div>

      <AbacusFAQSection/>

      {/* ------------------- CTA ------------------- */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-amber-500 to-orange-500 p-10 md:p-16 shadow-xl shadow-orange-200">
            <Brain className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Unlock Your Child's Genius</h2>
            <Button className="h-14 px-10 bg-white text-amber-600 font-black text-lg rounded-full">Enroll Now</Button>
          </div>
        </div>
      </section>
    </div>
  )
}

// Helper Icons
function FlashlightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12z"></path>
      <line x1="6" y1="6" x2="18" y2="6"></line>
    </svg>
  )
}
