// 1. Force dynamic to ensure data updates instantly from Admin
export const dynamic = "force-dynamic";

import { 
  Trophy, Sun, CheckCircle2
} from "lucide-react"

// Dynamic Components
import { DynamicGallery } from "@/components/dynamicgallery"
import { DynamicReviews } from "@/components/dynamicreviews"
import { DynamicCourses } from "@/components/dynamiccourses"
import { SuccessStoriesSection } from "@/components/dynamicsucess"
import DynamicPageBanner from "@/components/dynamicbanner"

// Static UI Sections
import ColorfulFAQSection from "@/components/pagesfaq"
import PrimaryCTA from "@/components/schoolcta"
import FunStatsSection from "@/components/ui/primary-stat"
import AboutSection from "@/components/ui/parent"
import DayAtSchoolSection from "@/components/ui/dayatschool"
import FacilitiesSection from "@/components/ui/facility"
import WhyChooseUsSection from "@/components/ui/whyprimary"

// 2. DATA FETCHING FROM PRISMA
import { prisma } from "@/lib/data";

async function getPrimaryPageData() {
  const pageKey = "promaty"; // Matching your database identifier

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
     * Robust Feature Parsing for Courses
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
        title: "Sparking Curiosity, Building Dreams",
        subtitle: "We don't just teach subjects; we nurture happy, confident, and creative children ready to take on the world.",
        imageUrl: "/pic15.webp",
        breadcrumb: "Primary School"
      }
    };
  } catch (error) {
    console.error("Error fetching primary data:", error);
    return { courses: [], gallery: [], reviews: [], stories: [], banner: null };
  }
}

// 3. SERVER COMPONENT (Async)
export default async function PrimarySchoolPage() {
  const data = await getPrimaryPageData();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">

      {/* ------------------- DYNAMIC BANNER (Replaces Hero) ------------------- */}
      <DynamicPageBanner data={data.banner} />

      {/* ------------------- QUICK STATS / USP ------------------- */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap justify-center gap-8 md:gap-16">
           <div className="flex items-center gap-2 text-slate-600 font-bold">
             <CheckCircle2 className="text-amber-500 w-6 h-6" /> 
             <span>CBSE Curriculum</span>
           </div>
           <div className="flex items-center gap-2 text-slate-600 font-bold">
             <CheckCircle2 className="text-amber-500 w-6 h-6" /> 
             <span>20:1 Student Ratio</span>
           </div>
           <div className="flex items-center gap-2 text-slate-600 font-bold">
             <Sun className="text-amber-500 w-6 h-6" /> 
             <span>Admissions 2024-25 Open</span>
           </div>
        </div>
      </div>

      <WhyChooseUsSection/>
      <FunStatsSection/>
      <AboutSection/>

      {/* ------------------- SUCCESS STORIES (Dynamic) ------------------- */}
      <div className="py-12">
        <SuccessStoriesSection 
            badge="Champions"
            title="Our Wall of"
            titleHighlight="Fame"
            subtitle="Meet our bright young stars."
            stories={data.stories}
        />
      </div>

      {/* ------------------- CURRICULUM (Dynamic) ------------------- */}
      <div className="bg-slate-50 py-12">
        <div className="text-center mb-10">
           <span className="text-amber-600 font-bold uppercase tracking-widest text-sm">Learning Path</span>
           <h2 className="text-4xl font-black text-slate-900 mt-2">Academic Programs</h2>
        </div>
        <DynamicCourses courses={data.courses} />
      </div>

      <DayAtSchoolSection/>
      <FacilitiesSection/>

      {/* ------------------- GALLERY (Dynamic) ------------------- */}
      <div className="py-12 bg-white">
        <DynamicGallery 
          images={data.gallery}
          title="Smiles & Success" 
          subtitle="Moments of joy and learning."
          badge="Campus Life"
        />
      </div>
      
      {/* ------------------- REVIEWS (Dynamic) ------------------- */}
      <div className="bg-amber-50/50 py-16 border-y border-amber-100/50">
        <DynamicReviews reviews={data.reviews} />
      </div>

      <ColorfulFAQSection/>
      <PrimaryCTA/>

    </div>
  )
}