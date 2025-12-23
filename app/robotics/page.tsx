// app/robotics/page.tsx (Next.js 13+ Server Component)
import { Button } from "@/components/ui/button";
import {
  Bot, Cpu, Code, Zap, Settings, Rocket,
  BrainCircuit, Laptop, Award, Wrench, Trophy
} from "lucide-react";

// Dynamic Components (ensure these have "use client" at the top of their files)
import { DynamicGallery } from "@/components/dynamicgallery";
import { DynamicReviews } from "@/components/dynamicreviews";
import { DynamicCourses } from "@/components/dynamiccourses";
import { SuccessStoriesSection } from "@/components/dynamicsucess";

// Static Sections (client components)
import WhyChooseRoboticsSection from "@/components/ui/whyrobotics";
import RoboticsFAQSection from "@/components/ui/robotfaq";
import TechStackSection from "@/components/ui/tech";

// --- 1. DATA FETCHING ---
import { prisma } from "@/lib/data"; // or "@/lib/prisma" depending on your setup

export async function getPageData() {
  const pageKey = "robotics";

  try {
    // Fetch all data in parallel directly from Prisma
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

    // Parse JSON fields if needed (like `features` in courses)
    const parsedCourses = courses.map((c) => ({
      ...c,
      features: JSON.parse(c.features || "[]"),
    }));

    return { courses: parsedCourses, gallery, reviews, stories };
  } catch (error) {
    console.error("Error fetching robotics data:", error);
    return { courses: [], gallery: [], reviews: [], stories: [] };
  }
}


// --- 2. PAGE COMPONENT (Async Server Component) ---
export default async function RoboticsPage() {
  const data = await getPageData();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">

      {/* ------------------- HERO SECTION ------------------- */}
      <section className="pt-14 pb-20 relative overflow-hidden bg-gradient-to-b from-amber-50 to-white">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-200/30 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-amber-200 shadow-sm text-amber-700 font-bold text-sm uppercase tracking-wider">
              <Bot size={18} className="text-amber-500" /> Future Engineers
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-slate-900">
              Build, Code, & <br/>
              <span className="text-amber-500">Innovate</span> 🤖
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
              Turn curiosity into creation. We teach kids to design robots, write code, and solve real-world problems using STEM.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="h-14 px-8 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-black text-lg shadow-[0_10px_20px_rgba(245,158,11,0.3)] hover:-translate-y-1 transition-all">
                Book Free Demo
              </Button>
              <Button variant="outline" className="h-14 px-8 bg-white border-2 border-slate-900 text-slate-900 rounded-full font-bold text-lg hover:bg-slate-900 hover:text-white transition-all">
                View Curriculum
              </Button>
            </div>
          </div>
          {/* Right */}
          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-amber-200 rounded-[2.5rem] rotate-3 scale-105 opacity-60 -z-10 group-hover:rotate-0 transition-all duration-500"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-white">
              <img 
                src="/pic38.webp" 
                alt="Kid building robot" 
                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2 animate-pulse">
                <Cpu size={20} className="text-amber-500" />
                <span className="text-xs font-bold text-slate-700 uppercase">STEM Certified</span>
              </div>
              <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                  <Code size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">Projects Built</p>
                  <p className="text-xl font-black text-slate-900">5,000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseRoboticsSection/>

      {/* ------------------- TECH STATS ------------------- */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around items-center gap-8 text-center">
          {[
            { label: "Robots Built", val: "10k+", icon: Bot },
            { label: "Lines of Code", val: "1M+", icon: Code },
            { label: "Competitions", val: "50+", icon: Trophy },
            { label: "Active Students", val: "500+", icon: Zap },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group cursor-default p-4 rounded-xl hover:bg-amber-50/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 group-hover:bg-amber-500 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:text-white transition-colors duration-300">
                {item.icon && <item.icon size={24} />}
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-slate-900">{item.val}</h3>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wide">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------- WHY CHOOSE US ------------------- */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-amber-200 opacity-50"><BrainCircuit size={100} /></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-bold uppercase tracking-widest text-sm bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              The Aacharya Advantage
            </span>
            <h2 className="text-4xl font-black text-slate-900 mt-4">Coding the Future 🚀</h2>
            <p className="text-slate-600 mt-4 text-lg max-w-2xl mx-auto font-medium">
              We move beyond screens. Our students touch, build, and program real machines.
            </p>
          </div>
          {/* Left + Right grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                "Turning Consumers of Tech into <span className="text-amber-500 bg-amber-50 px-2 rounded-lg">Creators</span>"
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                Our labs are equipped with Lego Education kits, Arduino boards, and 3D printers to ensure hands-on learning from Day 1.
              </p>
              <div className="bg-white p-6 rounded-3xl border-2 border-amber-100 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Settings size={80} /></div>
                <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2 text-lg">
                  ⚙️ The Engineering Process
                </h4>
                <div className="space-y-4">
                  {[
                    { step: "Think & Design", icon: BrainCircuit },
                    { step: "Build Structure", icon: Wrench },
                    { step: "Code Logic", icon: Code },
                    { step: "Test & Play", icon: Rocket },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">
                        {index + 1}
                      </div>
                      <span className="text-slate-800 font-bold text-sm flex-1">{item.step}</span>
                      {item.icon && <item.icon className="w-5 h-5 text-amber-500" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Right Content */}
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Wrench, title: "Hands-on Labs", desc: "Lego & Arduino Kits", color: "text-amber-600", bg: "bg-amber-50", border: "hover:border-amber-300" },
                { icon: BrainCircuit, title: "Logical Thinking", desc: "Algorithm building", color: "text-blue-600", bg: "bg-blue-50", border: "hover:border-blue-300" },
                { icon: Laptop, title: "Real Coding", desc: "Python & Scratch", color: "text-purple-600", bg: "bg-purple-50", border: "hover:border-purple-300" },
                { icon: Award, title: "Certified", desc: "STEM Accreditation", color: "text-green-600", bg: "bg-green-50", border: "hover:border-green-300" }
              ].map((item, i) => (
                <div key={i} className={`group p-6 rounded-[2rem] bg-white border-2 border-slate-100 shadow-sm hover:shadow-xl ${item.border} transition-all duration-300 hover:-translate-y-1 text-center cursor-default`}>
                  <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    {item.icon && <item.icon size={28} />}
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------- CURRICULUM ------------------- */}
      <div className="bg-white py-16">
        <div className="text-center mb-10">
          <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Roadmap</span>
          <h2 className="text-4xl font-black text-slate-900 mt-2">Choose Your Level</h2>
        </div>
        <DynamicCourses courses={data?.courses || []} />
      </div>

      {/* ------------------- TECH STACK ------------------- */}
      <TechStackSection />

      {/* ------------------- SUCCESS STORIES ------------------- */}
      <div className="py-12">
        <SuccessStoriesSection 
          badge="Champions"
          title="Our Wall of"
          titleHighlight="Fame"
          subtitle="Meet the students who redefined their limits."
          stories={data?.stories || []}
        />
      </div>

      {/* ------------------- GALLERY ------------------- */}
      <div className="py-12 bg-white">
        <DynamicGallery 
          images={data?.gallery || []}
          title="Young Innovators"
          subtitle="See our students building the future."
          badge="Robotics Gallery"
        />
      </div>

      {/* ------------------- REVIEWS ------------------- */}
      <div className="bg-slate-50 py-12 border-y border-slate-100">
        <DynamicReviews reviews={data?.reviews || []} />
      </div>

      {/* ------------------- FAQ ------------------- */}
      <RoboticsFAQSection />

      {/* ------------------- CTA ------------------- */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-amber-500 to-orange-500 shadow-xl shadow-orange-200">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10 p-10 md:p-16 text-center">
              <Bot className="w-16 h-16 text-white mx-auto mb-6 animate-bounce" />
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Start Building Today!</h2>
              <p className="text-amber-50 text-xl font-medium mb-10 max-w-2xl mx-auto">
                Join the academy where kids create the future. Limited seats in our weekend batches.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="h-14 px-10 bg-white text-amber-600 hover:bg-slate-50 font-black text-lg rounded-full shadow-lg transition-all">
                  Enroll Now
                </Button>
                <Button variant="outline" className="h-14 px-10 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-amber-600 transition-all">
                  Visit Lab
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
