// 1. Force dynamic to ensure data updates instantly from Admin
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button"
import { 
  BookOpen, GraduationCap, PenTool, Calculator, 
  Microscope, Globe, Award, TrendingUp, 
  CheckCircle2, Clock, FileText, BrainCircuit, Target, Sparkles
} from "lucide-react"

// Dynamic Components (Ensure these are ready to receive data as props)
import { DynamicGallery } from "@/components/dynamicgallery"
import { DynamicReviews } from "@/components/dynamicreviews"
import { DynamicCourses } from "@/components/dynamiccourses"
import { SuccessStoriesSection } from "@/components/dynamicsucess"

// Static UI Sections
import WhyChooseCoachingSection from "@/components/ui/whycoaching"
import CBSEFAQSection from "@/components/ui/coachingfaq"

// 2. DATA FETCHING FROM PRISMA
import { prisma } from "@/lib/data"; // Verify this matches your lib/prisma setup path

async function getCoachingPageData() {
  const pageKey = "coaching"; // The identifier used in your Admin Panel

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

    // Parse features JSON if stored as a string in DB
    const parsedCourses = courses.map((c) => ({
      ...c,
      features: typeof c.features === 'string' ? JSON.parse(c.features) : (c.features || []),
    }));

    return { courses: parsedCourses, gallery, reviews, stories };
  } catch (error) {
    console.error("Error fetching coaching data:", error);
    return { courses: [], gallery: [], reviews: [], stories: [] };
  }
}

// 3. SERVER COMPONENT (Async)
export default async function CBSECoachingPage() {
  const data = await getCoachingPageData();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">

      {/* ------------------- HERO SECTION ------------------- */}
      <section className="pt-14 pb-20 relative overflow-hidden bg-gradient-to-b from-amber-50 to-white">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230f172a' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-200/30 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-amber-200 shadow-sm text-amber-700 font-bold text-sm uppercase tracking-wider">
              <Award size={18} className="text-amber-500" /> Excellence in Education
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-slate-900">
              Master Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Syllabus</span> 📚
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
              Comprehensive coaching for Grades 6 to 10. We focus on concept clarity, regular practice, and building exam confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="h-14 px-8 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-black text-lg shadow-lg">Book Free Trial</Button>
              <Button variant="outline" className="h-14 px-8 bg-white border-2 border-slate-900 text-slate-900 rounded-full font-bold text-lg">Download Brochure</Button>
            </div>
          </div>
          
          <div className="relative group perspective-1000">
             <div className="absolute inset-0 bg-amber-200 rounded-[2.5rem] rotate-3 scale-105 opacity-60 -z-10 group-hover:rotate-0 transition-all duration-500"></div>
             <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-white">
               <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop" alt="Student Studying" className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700" />
               <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2 animate-bounce-slow">
                 <CheckCircle2 size={20} className="text-green-500" />
                 <span className="text-xs font-bold text-slate-700 uppercase">100% Pass Rate</span>
               </div>
               <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-4">
                 <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600"><TrendingUp size={24} /></div>
                 <div><p className="text-xs text-slate-400 uppercase font-bold">Average Score</p><p className="text-xl font-black text-slate-900">92% +</p></div>
               </div>
             </div>
          </div>
        </div>
      </section>

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
