// 1. Force dynamic to ensure data updates instantly from Admin
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button"
import { 
  BookOpen, GraduationCap, PenTool, Calculator, 
  Microscope, Globe, Award, TrendingUp, 
  CheckCircle2, Clock, FileText, BrainCircuit, Target, Sparkles
} from "lucide-react"

// Dynamic Components
import { DynamicGallery } from "@/components/dynamicgallery"
import { DynamicReviews } from "@/components/dynamicreviews"
import { DynamicCourses } from "@/components/dynamiccourses"
import { SuccessStoriesSection } from "@/components/dynamicsucess"
import DynamicPageBanner from "@/components/dynamicbanner"

// Static UI Sections
import WhyChooseCoachingSection from "@/components/ui/whycoaching"
import CBSEFAQSection from "@/components/ui/coachingfaq"

// 2. DATA FETCHING FROM PRISMA
import { prisma } from "@/lib/data"; 

async function getCoachingPageData() {
  const pageKey = "coaching"; 

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
        title: "Master Your Syllabus",
        subtitle: "Comprehensive coaching for Grades 6 to 10. We focus on concept clarity, regular practice, and building exam confidence.",
        imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
        breadcrumb: "CBSE Coaching"
      }
    };
  } catch (error) {
    console.error("Error fetching coaching data:", error);
    return { courses: [], gallery: [], reviews: [], stories: [], banner: null };
  }
}

export default async function CBSECoachingPage() {
  const data = await getCoachingPageData();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">

      <DynamicPageBanner data={data.banner} />

      {/* ------------------- ACADEMIC STATS (Updated for 2 per line on mobile) ------------------- */}
      <section className="bg-white py-8 md:py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { label: "Students", val: "1,500+", icon: GraduationCap },
            { label: "Faculty", val: "25+", icon: PenTool },
            { label: "Toppers", val: "500+", icon: Award },
            { label: "Tests", val: "10k+", icon: FileText },
          ].map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 group p-3 md:p-4 rounded-xl hover:bg-amber-50/50 transition-colors text-center md:text-left">
              <div className="w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl bg-amber-50 group-hover:bg-amber-500 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:text-white transition-colors duration-300">
                <item.icon className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <div>
                <h3 className="text-lg md:text-2xl font-black text-slate-900">{item.val}</h3>
                <p className="text-slate-500 font-bold text-[9px] md:text-sm uppercase tracking-wider">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <WhyChooseCoachingSection/>

      {/* ------------------- CURRICULUM ------------------- */}
      <div className="bg-white py-12 md:py-16">
        <div className="text-center mb-8 md:mb-10 px-4">
           <span className="text-slate-400 font-bold uppercase tracking-widest text-xs md:text-sm">Our Batches</span>
           <h2 className="text-2xl md:text-4xl font-black text-slate-900 mt-2">Classes We Coach</h2>
        </div>
        <div className="px-4">
          <DynamicCourses courses={data.courses} />
        </div>
      </div>

      {/* ------------------- SUBJECTS STACK (2 per line on mobile) ------------------- */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-8 md:mb-12">Subjects We Master 📖</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              { icon: Calculator, label: "Mathematics", desc: "Logic & Practice", color: "text-amber-600", bg: "bg-amber-100" },
              { icon: Microscope, label: "Science", desc: "Bio, Chem, Physics", color: "text-blue-600", bg: "bg-blue-100" },
              { icon: Globe, label: "Social Science", desc: "History & Civics", color: "text-rose-600", bg: "bg-rose-100" },
              { icon: PenTool, label: "English", desc: "Grammar & Lit", color: "text-green-600", bg: "bg-green-100" },
              { icon: BrainCircuit, label: "Hindi / Lang", desc: "Core Basics", color: "text-purple-600", bg: "bg-purple-100" },
            ].map((tool, i) => (
              <div key={i} className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 hover:border-amber-400 transition-all flex flex-col items-center gap-3 group">
                <div className={`w-10 h-10 md:w-14 md:h-14 shrink-0 ${tool.bg} ${tool.color} rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-slate-900 text-sm md:text-lg">{tool.label}</span>
                  <span className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">{tool.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------- GALLERY / REVIEWS ------------------- */}
      <div className="py-10 bg-white px-4">
        <DynamicGallery 
            images={data.gallery}
            title="Classroom Vibes" 
            subtitle="Serious learning, serious fun."
            badge="Coaching Gallery"
        />
      </div>

      <div className="bg-slate-50 py-10 border-y border-slate-100 px-4">
         <DynamicReviews reviews={data.reviews} />
      </div>

      <div className="px-4">
        <CBSEFAQSection/>
      </div>

      {/* ------------------- CTA ------------------- */}
      <section className="py-12 md:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-r from-amber-500 to-orange-600 shadow-xl shadow-orange-200">
            <div className="relative z-10 p-8 md:p-16 text-center">
               <Sparkles className="w-10 h-10 md:w-16 md:h-16 text-white mx-auto mb-4 md:mb-6 animate-pulse" />
               <h2 className="text-2xl md:text-5xl font-black text-white mb-4 md:mb-6 leading-tight">Start Your Success Story</h2>
               <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                 <Button className="h-12 md:h-14 w-full sm:w-auto px-10 bg-white text-amber-600 font-black text-lg rounded-full hover:bg-slate-50 transition-colors">
                   Enroll Now
                 </Button>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}