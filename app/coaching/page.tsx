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

    /**
     * Robust Feature Parsing
     */
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
        // Fallback in case Admin hasn't uploaded banner data yet
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

// 3. SERVER COMPONENT (Async)
export default async function CBSECoachingPage() {
  const data = await getCoachingPageData();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">

      {/* ------------------- DYNAMIC BANNER (Replaced Hero) ------------------- */}
      <DynamicPageBanner data={data.banner} />

      {/* ------------------- ACADEMIC STATS ------------------- */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around items-center gap-8 text-center">
          {[
            { label: "Students Enrolled", val: "1,500+", icon: GraduationCap },
            { label: "Expert Faculty", val: "25+", icon: PenTool },
            { label: "Toppers Produced", val: "500+", icon: Award },
            { label: "Practice Tests", val: "10k+", icon: FileText },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group p-4 rounded-xl hover:bg-amber-50/50 transition-colors">
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

      <WhyChooseCoachingSection/>

      {/* ------------------- CURRICULUM (Data from Server) ------------------- */}
      <div className="bg-white py-16">
        <div className="text-center mb-10">
           <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Our Batches</span>
           <h2 className="text-4xl font-black text-slate-900 mt-2">Classes We Coach</h2>
        </div>
        <DynamicCourses courses={data.courses} />
      </div>

      {/* ------------------- SUBJECTS STACK ------------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-12">Subjects We Master 📖</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: Calculator, label: "Mathematics", desc: "Logic & Practice", color: "text-amber-600", bg: "bg-amber-100" },
              { icon: Microscope, label: "Science", desc: "Bio, Chem, Physics", color: "text-blue-600", bg: "bg-blue-100" },
              { icon: Globe, label: "Social Science", desc: "History & Civics", color: "text-rose-600", bg: "bg-rose-100" },
              { icon: PenTool, label: "English", desc: "Grammar & Lit", color: "text-green-600", bg: "bg-green-100" },
              { icon: BrainCircuit, label: "Hindi / Lang", desc: "Core Basics", color: "text-purple-600", bg: "bg-purple-100" },
            ].map((tool, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-amber-400 transition-all flex flex-col items-center gap-3 group">
                <div className={`w-14 h-14 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}><tool.icon size={28} /></div>
                <div><span className="block font-bold text-slate-900 text-lg">{tool.label}</span><span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">{tool.desc}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* ------------------- GALLERY (Data from Server) ------------------- */}
      <div className="py-12 bg-white">
        <DynamicGallery 
            images={data.gallery}
            title="Classroom Vibes" 
            subtitle="Serious learning, serious fun."
            badge="Coaching Gallery"
        />
      </div>

      {/* ------------------- REVIEWS (Data from Server) ------------------- */}
      <div className="bg-slate-50 py-12 border-y border-slate-100">
         <DynamicReviews reviews={data.reviews} />
      </div>

      <CBSEFAQSection/>

      {/* ------------------- CTA ------------------- */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-amber-500 to-orange-600 shadow-xl shadow-orange-200">
            <div className="relative z-10 p-10 md:p-16 text-center">
               <Sparkles className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
               <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Start Your Success Story</h2>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button className="h-14 px-10 bg-white text-amber-600 font-black text-lg rounded-full">Enroll Now</Button>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}