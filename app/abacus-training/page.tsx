// 1. Force dynamic to ensure Admin data updates instantly
export const dynamic = "force-dynamic";
import Link from "next/link"
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
        imageUrl: "/about.jpeg",
        breadcrumb: "Abacus Academy"
      }
    };
  } catch (error) {
    console.error("Error fetching abacus data:", error);
    return { courses: [], gallery: [], reviews: [], stories: [], banner: null };
  }
}

export default async function AbacusPage() {
  const data = await getAbacusPageData();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">

      <DynamicPageBanner data={data.banner} />

      {/* ------------------- MATH STATS (2 per line on mobile) ------------------- */}
      <section className="bg-white py-8 md:py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {[
            { label: "Graduates", val: "2,000+", icon: GraduationCap },
            { label: "Winners", val: "100+", icon: Award },
            { label: "Increase", val: "500%", icon: TrendingUp },
            { label: "Focus", val: "10x", icon: Brain },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 md:gap-4 group cursor-default p-2 md:p-4 rounded-xl hover:bg-amber-50/50 transition-colors">
              <div className="w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl bg-amber-50 group-hover:bg-amber-500 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:text-white transition-colors duration-300">
                <item.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg md:text-2xl font-black text-slate-900 leading-tight">{item.val}</h3>
                <p className="text-slate-500 font-bold text-[10px] md:text-sm uppercase tracking-wider">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <WhyChooseAbacusSection/>

      {/* ------------------- CURRICULUM ------------------- */}
      <div className="bg-white py-0 md:py-0 px-4">
        <DynamicCourses courses={data?.courses || []} />
      </div>

      {/* ------------------- TRAINING TOOLS ------------------- */}
      <section className="py-10 md:py-15 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center relative z-10">
          <p className="text-2xl md:text-5xl font-black text-slate-900 mb-8 md:mb-12">Our Training Tools 🧮</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Layers, label: "Soroban", desc: "Traditional Tool", color: "text-amber-600", bg: "bg-amber-50", border: "hover:border-amber-300" },
              { icon: Flashlight, label: "Flash Cards", desc: "Photographic Memory", color: "text-blue-600", bg: "bg-blue-50", border: "hover:border-blue-300" },
              { icon: Timer, label: "Speed Writing", desc: "Motor Skill Drills", color: "text-rose-600", bg: "bg-rose-50", border: "hover:border-rose-300" },
              { icon: Mic, label: "Audio Dictation", desc: "Listening Exercises", color: "text-green-600", bg: "bg-green-50", border: "hover:border-green-300" },
            ].map((tool, i) => (
              <div key={i} className={`bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl ${tool.border} flex flex-col items-center gap-2 md:gap-3 group`}>
                <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 ${tool.bg} ${tool.color} rounded-xl md:rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12`}>
                  <tool.icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <div className="text-center">
                  <span className="block font-black text-slate-900 text-sm md:text-lg leading-tight">{tool.label}</span>
                  <span className="block text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">{tool.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------- GALLERY / REVIEWS / FAQ ------------------- */}
      <div className="py-12 md:py-20 bg-white">
        <DynamicGallery 
            images={data?.gallery || []}
            title="Little Geniuses" 
            subtitle="Demonstrating incredible mental math skills."
            badge="Abacus Gallery"
        />
      </div>

      <div className="bg-slate-50 py-12 md:py-20 border-y border-slate-100">
         <DynamicReviews reviews={data?.reviews || []} />
      </div>

      <AbacusFAQSection/>

      {/* ------------------- FINAL CTA ------------------- */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gradient-to-r from-amber-500 to-orange-500 shadow-2xl shadow-orange-200">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 p-10 md:p-20 text-center">
              <div className="bg-white/20 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 backdrop-blur-sm border border-white/30">
                <Brain className="w-8 h-8 md:w-10 md:h-10 text-white animate-bounce" />
              </div>
              <h2 className="text-3xl md:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">Unlock Their Potential</h2>
              <p className="text-amber-50 text-base md:text-xl font-medium mb-8 md:mb-12 max-w-2xl mx-auto">
                Book a free assessment session to see your child's starting point!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
  
  <Link href="/bookdemo">
    <Button className="h-14 md:h-16 px-8 md:px-12 bg-white text-orange-600 hover:bg-slate-50 font-black text-lg md:text-xl rounded-full shadow-xl transition-all active:scale-95">
      Free Assessment
    </Button>
  </Link>

  <Link href="/contact">
    <Button
      variant="outline"
      className="h-14 md:h-16 px-8 md:px-12 bg-transparent border-2 border-white text-white font-bold text-lg md:text-xl rounded-full hover:bg-white hover:text-orange-600 transition-all"
    >
      Contact Us
    </Button>
  </Link>

</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
