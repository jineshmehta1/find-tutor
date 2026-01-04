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
  const pageKey = "promaty"; 

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
        featuresArray = [];
      }
      return { ...c, features: featuresArray };
    });

    return { 
      courses: parsedCourses, 
      gallery, 
      reviews, 
      stories,
      banner: banner || {
        title: "Sparking Curiosity, Building Dreams",
        subtitle: "We don't just teach subjects; we nurture happy, confident, and creative children ready to take on the world.",
        imageUrl: "/pic15.webp", // Replace this with your collage image path
        breadcrumb: "Primary School"
      }
    };
  } catch (error) {
    console.error("Error fetching primary data:", error);
    return { courses: [], gallery: [], reviews: [], stories: [], banner: null };
  }
}

// 3. SERVER COMPONENT
export default async function PrimarySchoolPage() {
  const data = await getPrimaryPageData();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">

      {/* ------------------- BRANDED HERO BANNER ------------------- */}
      <section className="relative h-[30vh] md:h-[90vh] w-full overflow-hidden flex items-center">
        
        {/* Background Image (Your Collage) */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${data.banner?.imageUrl || '/pic15.webp'})` }}
        />

        {/* YELLOWISH/AMBER TINT OVERLAY (Matching your image) */}
        <div className="absolute inset-0 z-10 bg-amber-500/35 " />

        {/* TEXT CONTENT (White & Bold) */}
        <div className="relative z-20 container mx-auto px-8 md:px-16">
          <div className="max-w-4xl">
            <h1 className="text-white text-2xl md:text-5xl text-semibold uppercase tracking-tight drop-shadow-md mb-2">
              Aacharya Pre Primary School
            </h1>
            <p className="text-white text-sm md:text-3xl font-medium leading-tight drop-shadow-sm opacity-95">
              Learning with Love, Growing with Confidence
            </p>
          </div>
        </div>
      </section>

      {/* ------------------- QUICK STATS / USP ------------------- */}
      <div className="bg-white border-b border-slate-100 relative z-30">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap justify-center gap-8 md:gap-16">
           <div className="flex items-center gap-2 text-slate-700 font-bold">
             <CheckCircle2 className="text-amber-500 w-6 h-6" /> 
             <span>NEP-International Curriculum</span>
           </div>
           <div className="flex items-center gap-2 text-slate-700 font-bold">
             <CheckCircle2 className="text-amber-500 w-6 h-6" /> 
             <span>10:1 Student Ratio</span>
           </div>
           <div className="flex items-center gap-2 text-slate-700 font-bold">
             <Sun className="text-amber-500 w-6 h-6" /> 
             <span>Admissions 2026-27 Open</span>
           </div>
        </div>
      </div>

      <WhyChooseUsSection/>
      <FunStatsSection/>
      <AboutSection/>

      {/* ------------------- CURRICULUM (Dynamic) ------------------- */}
      <div className="bg-slate-50 py-12">
        
        <DynamicCourses courses={data.courses} />
      </div>

      <DayAtSchoolSection/>
      <FacilitiesSection/>

      {/* ------------------- GALLERY (Dynamic) ------------------- */}
      <div className="py-0 bg-white">
        <DynamicGallery 
          images={data.gallery}
          title="Smiles & Success" 
          subtitle="Moments of joy and learning."
          badge="Campus Life"
        />
      </div>
      
      {/* ------------------- REVIEWS (Dynamic) ------------------- */}
      <div className="bg-amber-50/50 py-0 border-y border-amber-100/50">
        <DynamicReviews reviews={data.reviews} />
      </div>

      <ColorfulFAQSection/>
      <PrimaryCTA/>

    </div>
  )
}