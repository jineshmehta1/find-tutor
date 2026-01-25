// 1. Force dynamic to ensure Admin data updates instantly
export const dynamic = "force-dynamic";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Crown, Trophy, Users, TrendingUp, Globe, GraduationCap,
  Target, Zap, Lightbulb, BookOpen, ChevronRight, Star
} from "lucide-react"

// Dynamic Components
import { DynamicGallery } from "@/components/dynamicgallery"
import { DynamicReviews } from "@/components/dynamicreviews"
import { DynamicCourses } from "@/components/dynamiccourses"
import { SuccessStoriesSection } from "@/components/dynamicsucess"
import DynamicPageBanner from "@/components/dynamicbanner"

// UI Sections (Static)
import WhyChooseUsSection from "@/components/ui/whychess"
import BenefitsSection from "@/components/ui/chess1"
import MethodologySection from "@/components/ui/method"
import ChessFAQSection from "@/components/ui/chessfaq"

import { prisma } from "@/lib/data";

async function getChessPageData() {
  const pageKey = "chess";

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
        title: "Master the Game of Kings",
        subtitle: "From first moves to grandmaster strategies. We build concentration, logic, and confidence in young minds.",
        imageUrl: "/pic20.webp",
        breadcrumb: "Chess Academy"
      }
    };
  } catch (error) {
    console.error("Critical Error fetching chess data:", error);
    return { courses: [], gallery: [], reviews: [], stories: [], banner: null };
  }
}

export default async function ChessAcademyPage() {
  const data = await getChessPageData();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">

      <DynamicPageBanner data={data.banner} />

      {/* ------------------- QUICK STATS (2 per line on mobile) ------------------- */}
      <section className="bg-white py-8 md:py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {[
            { label: "Active Students", val: "500+", icon: Users },
            { label: "FIDE Coaches", val: "10+", icon: GraduationCap },
            { label: "Tournaments", val: "150+", icon: Trophy },
            { label: "Rating Boost", val: "+400", icon: TrendingUp },
          ].map((item, i) => (
            <div 
              key={i} 
              className="flex items-center gap-2 md:gap-4 group cursor-default p-2 md:p-4 rounded-xl hover:bg-amber-50/50 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-amber-50 group-hover:bg-amber-500 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:text-white transition-all duration-300">
                <item.icon className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              
              <div className="text-left">
                <h3 className="text-lg md:text-2xl font-black text-slate-900 leading-none">
                  {item.val}
                </h3>
                <p className="text-slate-500 font-bold text-[9px] md:text-sm uppercase tracking-tight mt-1">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <WhyChooseUsSection />
      <BenefitsSection />

      {/* ------------------- THE GRANDMASTER'S PATH ------------------- */}
      <section className="py-12 md:py-24 bg-slate-50 relative overflow-hidden">
        {/* Decorative background (Hidden on smallest mobile for clean look) */}
        <div className="hidden md:block absolute top-10 left-10 text-amber-200 opacity-50 rotate-12"><Crown size={120} /></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-amber-600 font-bold uppercase tracking-widest text-[10px] md:text-sm bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Training Methodology
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mt-4">The Strategic Mindset 🧠</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start">
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                "Winning is a <span className="text-amber-500 bg-amber-50 px-2 rounded-lg">Habit</span>, not an accident."
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                Our curriculum follows the professional FIDE standards, blending theoretical depth with practical tournament-style play.
              </p>
              
              <div className="bg-white p-5 md:p-8 rounded-[2rem] border-2 border-amber-100 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Target size={80} /></div>
                <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2 text-lg justify-center lg:justify-start">
                   The Professional Loop
                </h4>
                <div className="space-y-3">
                  {[
                    { step: "Theory & Analysis", icon: BookOpen },
                    { step: "Tactical Drills", icon: Zap },
                    { step: "Game Simulation", icon: Trophy },
                    { step: "Review & Refine", icon: Lightbulb },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100 group">
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center font-bold text-xs md:text-sm shadow-sm">
                        {index + 1}
                      </div>
                      <span className="text-slate-800 font-bold text-xs md:text-sm flex-1 text-left">{item.step}</span>
                      <item.icon className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {[
                { icon: Crown, title: "FIDE Coaches", desc: "Expert guidance", color: "text-amber-600", bg: "bg-amber-50" },
                { icon: Target, title: "Tactical Vision", desc: "Spot moves", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: Star, title: "Psychology", desc: "Build resilience", color: "text-purple-600", bg: "bg-purple-50" },
                { icon: Globe, title: "Rated Events", desc: "Global network", color: "text-green-600", bg: "bg-green-50" }
              ].map((item, i) => (
                <div key={i} className={`group p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-white border-2 border-slate-100 shadow-sm transition-all duration-300 text-center`}>
                  <div className={`w-10 h-10 md:w-14 md:h-14 ${item.bg} ${item.color} rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:rotate-12 transition-transform`}>
                    <item.icon className="w-5 h-5 md:w-7 md:h-7" />
                  </div>
                  <h4 className="text-sm md:text-lg font-black text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-[10px] md:text-sm font-medium leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------- DYNAMIC CURRICULUM ------------------- */}
      <div className="bg-white py-12 md:py-10 px-4">
        <DynamicCourses courses={data?.courses || []} />
      </div>

      <SuccessStoriesSection stories={data.stories} />

      <MethodologySection/>

      {/* ------------------- DYNAMIC GALLERY ------------------- */}
      <div className="py-12 md:py-20 bg-white">
        <DynamicGallery 
            images={data?.gallery || []}
            title="Tournaments & Training" 
            badge="Chess Gallery"
        />
      </div>

      {/* ------------------- REVIEWS ------------------- */}
      <div className="bg-slate-50 py-12 md:py-20 border-y border-slate-100">
         <DynamicReviews reviews={data?.reviews || []} />
      </div>

      <ChessFAQSection/>

      {/* ------------------- FINAL CTA ------------------- */}
      <section className="py-12 md:py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-r from-amber-600 to-yellow-600 shadow-2xl shadow-amber-200">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 p-10 md:p-20 text-center">
              <div className="bg-white/20 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 backdrop-blur-sm border border-white/30">
                <Crown className="w-8 h-8 md:w-10 md:h-10 text-white animate-bounce" />
              </div>
              <h2 className="text-3xl md:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">Ready to Play?</h2>
              <p className="text-amber-50 text-base md:text-xl font-medium mb-8 md:mb-12 max-w-2xl mx-auto">
                Join the club where champions are born. Book a free demo class to assess your level!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
  
  <Link href="/bookdemo" className="w-full sm:w-auto">
    <Button className="h-14 md:h-16 w-full sm:w-auto px-10 bg-white text-amber-600 font-black text-lg md:text-xl rounded-full shadow-xl transition-all active:scale-95">
      Join the Club
    </Button>
  </Link>

  <Link href="/contact" className="w-full sm:w-auto">
    <Button
      variant="outline"
      className="h-14 md:h-16 w-full sm:w-auto px-10 bg-transparent border-2 border-white text-white font-bold text-lg md:text-xl rounded-full hover:bg-white hover:text-amber-600 transition-all"
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