// 1. Force dynamic to ensure data updates instantly from Admin
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button"
import { 
  ArrowRight, Trophy, Sun, CheckCircle2
} from "lucide-react"

// Dynamic Components (Ensure these files are ready to receive data as props)
import { DynamicGallery } from "@/components/dynamicgallery"
import { DynamicReviews } from "@/components/dynamicreviews"
import { DynamicCourses } from "@/components/dynamiccourses"
import { SuccessStoriesSection } from "@/components/dynamicsucess"

// Static UI Sections
import ColorfulFAQSection from "@/components/pagesfaq"
import PrimaryCTA from "@/components/schoolcta"
import FunStatsSection from "@/components/ui/primary-stat"
import AboutSection from "@/components/ui/parent"
import DayAtSchoolSection from "@/components/ui/dayatschool"
import FacilitiesSection from "@/components/ui/facility"
import WhyChooseUsSection from "@/components/ui/whyprimary"

// 2. DATA FETCHING FROM PRISMA
import { prisma } from "@/lib/data"; // Verify this matches your lib path

async function getPrimaryPageData() {
  const pageKey = "promaty"; // Ensure this matches the category/pageKey in your DB

  try {
    const [courses, gallery, reviews, stories] = await Promise.all([
      prisma.course.findMany({
        where: { pageKey },
        orderBy: { createdAt: "desc" },
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

    // Parse features if stored as a string in the DB
    const parsedCourses = courses.map((c) => ({
      ...c,
      features: typeof c.features === 'string' ? JSON.parse(c.features) : (c.features || []),
    }));

    return { courses: parsedCourses, gallery, reviews, stories };
  } catch (error) {
    console.error("Error fetching primary data:", error);
    return { courses: [], gallery: [], reviews: [], stories: [] };
  }
}

// 3. SERVER COMPONENT (Async)
export default async function PrimarySchoolPage() {
  const data = await getPrimaryPageData();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* ------------------- HERO SECTION ------------------- */}
      <section className="pt-14 pb-20 px-6 relative overflow-hidden bg-amber-50/50">
        <div className="absolute top-20 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-[100px] -z-10"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-amber-800 font-bold text-sm border border-amber-100">
              <Sun className="text-amber-500 w-4 h-4" /> 
              <span>Admissions Open for 2024-25</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1]">
              Sparking <span className="text-amber-500">Curiosity</span>,<br/>
              Building <span className="text-slate-700">Dreams</span>.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
              We don't just teach subjects; we nurture happy, confident, and creative children ready to take on the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="h-14 px-8 bg-amber-500 hover:bg-[#b08d21] text-white rounded-full font-bold text-lg shadow-lg transition-all">
                Book a School Tour
              </Button>
            </div>
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-sm font-semibold text-slate-500">
              <div className="flex items-center gap-2"><CheckCircle2 className="text-amber-500 w-5 h-5" /> CBSE Curriculum</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-amber-500 w-5 h-5" /> 20:1 Student Ratio</div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-500 border-8 border-white">
              <img src="/pic15.webp" alt="Primary School" className="w-full h-[500px] object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-amber-100">
              <div className="bg-amber-100 p-3 rounded-full text-amber-500"><Trophy size={24} /></div>
              <div>
                <p className="font-bold text-slate-900 text-lg">#1 Ranked</p>
                <p className="text-xs text-slate-500 font-bold uppercase">Primary School</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUsSection/>
      <FunStatsSection/>
      <AboutSection/>

      {/* ------------------- SUCCESS STORIES ------------------- */}
      <div className="py-12">
        <SuccessStoriesSection 
            badge="Champions"
            title="Our Wall of"
            titleHighlight="Fame"
            subtitle="Meet our bright young stars."
            stories={data.stories}
        />
      </div>

      {/* ------------------- CURRICULUM (Data from Server) ------------------- */}
      <div className="bg-slate-50 py-12">
        <div className="text-center mb-10">
           <h2 className="text-4xl font-black text-slate-900">Academic Programs</h2>
        </div>
        <DynamicCourses courses={data.courses} />
      </div>

      <DayAtSchoolSection/>
      <FacilitiesSection/>

      {/* ------------------- GALLERY ------------------- */}
      <DynamicGallery 
        images={data.gallery}
        title="Smiles & Success" 
        subtitle="Moments of joy and learning."
        badge="Campus Life"
      />
      
      {/* ------------------- REVIEWS ------------------- */}
      <div className="bg-amber-50/50 py-12">
        <DynamicReviews reviews={data.reviews} />
      </div>

      <ColorfulFAQSection/>
      <PrimaryCTA/>

    </div>
  )
}
