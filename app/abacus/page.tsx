// 1.Force dynamic to ensure Admin data updates instantly
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button"
import { 
  Calculator, Brain, Zap, Timer, 
  Puzzle, Eye, Mic, Award, GraduationCap, 
  Layers, TrendingUp, Sparkles, Flashlight
} from "lucide-react"

// Dynamic Components
import { DynamicGallery } from "@/components/dynamicgallery"
import { DynamicReviews } from "@/components/dynamicreviews"
import { DynamicCourses } from "@/components/dynamiccourses"
import { SuccessStoriesSection } from "@/components/dynamicsucess"
import DynamicPageBanner from "@/components/dynamicbanner"

// Static UI Sections
import WhyChooseAbacusSection from "@/components/ui/whyabacus"
import AbacusFAQSection from "@/components/ui/roboticsfaq"

// 2. DATA FETCHING FROM PRISMA
import { prisma } from "@/lib/data"; 

async function getAbacusPageData() {
  const pageKey = "abacus";

  try {
    const [courses, gallery, reviews, stories, banner] = await Promise.all([
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
      prisma.banner.findUnique({
        where: { pageKey },
      }),
    ]);

    // Robust Feature Parsing (Prevents crash if JSON is malformed)
    const parsedCourses = courses.map((c) => {
      let featuresArray = [];
      try {
        if (Array.isArray(c.features)) {
          featuresArray = c.features;
        } else if (typeof c.features === 'string' && c.features.trim() !== "") {
          featuresArray = JSON.parse(c.features);
        }
      } catch (err) {
        console.error(`Failed to parse features for course ${c.id}:`, err);
        featuresArray = [];
      }
      return {
        ...c,
        features: Array.isArray(featuresArray) ? featuresArray : [],
      };
    });

    return { 
      courses: parsedCourses, 
      gallery, 
      reviews, 
      stories,
      banner: banner || {
        title: "Calculate Faster than a Calculator ⚡",
        subtitle: "Unlock your child's hidden genius. We teach visualization, concentration, and lightning-fast mental math skills.",
        imageUrl: "/gallery15.jpg",
        breadcrumb: "Abacus Academy"
      }
    };
  } catch (error) {
    console.error("Error fetching abacus data:", error);
    return { courses: [], gallery: [], reviews: [], stories: [], banner: null };
  }
}

// 3. SERVER COMPONENT (Async)
export default async function AbacusPage() {
  const data = await getAbacusPageData();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">

      {/* ------------------- DYNAMIC BANNER (Replaced Hero) ------------------- */}
      <DynamicPageBanner data={data.banner} />

      {/* ------------------- MATH STATS ------------------- */}
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

      {/* ------------------- CORE BENEFITS (Static) ------------------- */}
      <WhyChooseAbacusSection/>

      {/* ------------------- CURRICULUM (Dynamic) ------------------- */}
      <div className="bg-white py-24">
        
        <DynamicCourses courses={data?.courses || []} />
      </div>

      {/* ------------------- TRAINING TOOLS ------------------- */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-black text-slate-900 mb-12">Our Training Tools 🧮</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Layers, label: "Soroban Abacus", desc: "The Japanese Tool", color: "text-amber-600", bg: "bg-amber-50", border: "hover:border-amber-300" },
              { icon: Flashlight, label: "Flash Cards", desc: "For Photographic Memory", color: "text-blue-600", bg: "bg-blue-50", border: "hover:border-blue-300" },
              { icon: Timer, label: "Speed Writing", desc: "Motor Skill Drills", color: "text-rose-600", bg: "bg-rose-50", border: "hover:border-rose-300" },
              { icon: Mic, label: "Audio Dictation", desc: "Listening Exercises", color: "text-green-600", bg: "bg-green-50", border: "hover:border-green-300" },
            ].map((tool, i) => (
              <div key={i} className={`bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${tool.border} flex flex-col items-center gap-3 group`}>
                <div className={`w-14 h-14 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12`}><tool.icon size={28} /></div>
                <div><span className="block font-black text-slate-900 text-lg">{tool.label}</span><span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">{tool.desc}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------- SUCCESS STORIES (Dynamic) ------------------- */}
      <div className="py-20">
        <SuccessStoriesSection 
            badge="Champions"
            title="Our Wall of"
            titleHighlight="Fame"
            subtitle="Meet the students who redefined their limits."
            stories={data?.stories || []}
        />
      </div>

      {/* ------------------- GALLERY (Dynamic) ------------------- */}
      <div className="py-20 bg-white">
        <DynamicGallery 
            images={data?.gallery || []}
            title="Little Geniuses" 
            subtitle="Demonstrating incredible mental math skills."
            badge="Abacus Gallery"
        />
      </div>

      {/* ------------------- REVIEWS (Dynamic) ------------------- */}
      <div className="bg-slate-50 py-20 border-y border-slate-100">
         <DynamicReviews reviews={data?.reviews || []} />
      </div>

      {/* ------------------- FAQ (Static) ------------------- */}
      <AbacusFAQSection/>

      {/* ------------------- FINAL CTA ------------------- */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-amber-500 to-orange-500 shadow-2xl shadow-orange-200">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 p-12 md:p-20 text-center">
              <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/30">
                <Brain className="w-10 h-10 text-white animate-bounce" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Unlock Their Potential</h2>
              <p className="text-amber-50 text-xl font-medium mb-12 max-w-2xl mx-auto">
                Join our weekend or weekday batches. Book a free assessment session to see your child's starting point!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button className="h-16 px-12 bg-white text-orange-600 hover:bg-slate-50 font-black text-xl rounded-full shadow-xl transition-all active:scale-95">
                  Book Free Assessment
                </Button>
                <Button variant="outline" className="h-16 px-12 bg-transparent border-2 border-white text-white font-bold text-xl rounded-full hover:bg-white hover:text-orange-600 transition-all">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
