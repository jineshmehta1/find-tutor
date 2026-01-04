import { Button } from "@/components/ui/button";
import {
  Bot, Cpu, Code, Zap, Settings, Rocket,
  BrainCircuit, Laptop, Award, Wrench, Trophy
} from "lucide-react";

// Dynamic Components
import { DynamicGallery } from "@/components/dynamicgallery";
import { DynamicReviews } from "@/components/dynamicreviews";
import { DynamicCourses } from "@/components/dynamiccourses";
import { SuccessStoriesSection } from "@/components/dynamicsucess";
import DynamicPageBanner from "@/components/dynamicbanner"; // Imported carefully

// Static Sections
import WhyChooseRoboticsSection from "@/components/ui/whyrobotics";
import RoboticsFAQSection from "@/components/ui/robotfaq";
import TechStackSection from "@/components/ui/tech";

// --- 1. DATA FETCHING (WITH ROBUST ERROR HANDLING) ---
import { prisma } from "@/lib/data";

export async function getPageData() {
  const pageKey = "robotics";

  try {
    // Fetch all data in parallel including the Banner
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
     * FIX: Robust Feature Parsing
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
        // Fallback in case Admin hasn't uploaded yet
        title: "Build, Code & Innovate",
        subtitle: "Transform from a screen consumer to a technology creator with our hands-on robotics curriculum.",
        imageUrl: "/pic38.webp",
        breadcrumb: "Robotics"
      } 
    };
  } catch (error) {
    console.error("Critical Error fetching robotics data:", error);
    return { courses: [], gallery: [], reviews: [], stories: [], banner: null };
  }
}


// --- 2. PAGE COMPONENT ---
export default async function RoboticsPage() {
  const data = await getPageData();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">

      {/* ------------------- DYNAMIC BANNER (REPLACED HERO) ------------------- */}
      <DynamicPageBanner data={data.banner} />

      {/* ------------------- CORE VALUES ------------------- */}
      <WhyChooseRoboticsSection/>

      {/* ------------------- QUICK STATS ------------------- */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around items-center gap-8 text-center">
          {[
            { label: "Hardware Kits", val: "15+", icon: Settings },
            { label: "Logic Puzzles", val: "200+", icon: BrainCircuit },
            { label: "Competitions", val: "10+", icon: Trophy },
            { label: "Student Success", val: "98%", icon: Zap },
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

      {/* ------------------- THE PROCESS ------------------- */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-amber-200 opacity-50 rotate-12"><BrainCircuit size={120} /></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-bold uppercase tracking-widest text-sm bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Learning Methodology
            </span>
            <h2 className="text-4xl font-black text-slate-900 mt-4">Coding the Future 🚀</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                "Creating <span className="text-amber-500 bg-amber-50 px-2 rounded-lg">Innovators</span>, not just users."
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                Our lab experience blends engineering and software. We use Lego Education, Arduino, and Industry-standard sensors to bring ideas to life.
              </p>
              
              <div className="bg-white p-6 rounded-3xl border-2 border-amber-100 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Settings size={80} /></div>
                <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2 text-lg">
                   The Engineering Loop
                </h4>
                <div className="space-y-4">
                  {[
                    { step: "Analyze & Design", icon: BrainCircuit },
                    { step: "Hardware Assembly", icon: Wrench },
                    { step: "Program Logic", icon: Code },
                    { step: "Execute & Debug", icon: Rocket },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100 group">
                      <div className="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm group-hover:rotate-6 transition-transform">
                        {index + 1}
                      </div>
                      <span className="text-slate-800 font-bold text-sm flex-1">{item.step}</span>
                      <item.icon className="w-5 h-5 text-amber-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Wrench, title: "Hardware Lab", desc: "Sensors, Motors, Bricks", color: "text-amber-600", bg: "bg-amber-50", border: "hover:border-amber-300" },
                { icon: BrainCircuit, title: "Algorithmic Logic", desc: "Flowchart thinking", color: "text-blue-600", bg: "bg-blue-50", border: "hover:border-blue-300" },
                { icon: Laptop, title: "Visual Coding", desc: "Scratch & Blockly", color: "text-purple-600", bg: "bg-purple-50", border: "hover:border-purple-300" },
                { icon: Award, title: "Global Skills", desc: "Soft-skills & AI basics", color: "text-green-600", bg: "bg-green-50", border: "hover:border-green-300" }
              ].map((item, i) => (
                <div key={i} className={`group p-6 rounded-[2rem] bg-white border-2 border-slate-100 shadow-sm hover:shadow-xl ${item.border} transition-all duration-300 hover:-translate-y-1 text-center`}>
                  <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform`}>
                    <item.icon size={28} />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------- CURRICULUM (DYNAMIC) ------------------- */}
      <div className="bg-white py-24">
        <div className="text-center mb-10">
          <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Our Levels</span>
          <h2 className="text-4xl font-black text-slate-900 mt-2">Pick a Program</h2>
        </div>
        <DynamicCourses courses={data?.courses || []} />
      </div>

      {/* ------------------- TECH STACK (STATIC) ------------------- */}
      <TechStackSection />

     

      {/* ------------------- GALLERY (DYNAMIC) ------------------- */}
      <div className="py-20 bg-white">
        <DynamicGallery 
          images={data?.gallery || []}
          title="Inside the Lab"
          subtitle="Glimpses of building, testing, and competing."
          badge="Robotics in Action"
        />
      </div>

      {/* ------------------- REVIEWS (DYNAMIC) ------------------- */}
      <div className="bg-slate-50 py-20 border-y border-slate-100">
        <DynamicReviews reviews={data?.reviews || []} />
      </div>

      {/* ------------------- FAQ (STATIC) ------------------- */}
      <RoboticsFAQSection />

      {/* ------------------- FINAL CTA ------------------- */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-amber-500 to-orange-500 shadow-2xl shadow-orange-200">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 p-12 md:p-20 text-center">
              <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/30">
                <Bot className="w-10 h-10 text-white animate-bounce" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready to Build?</h2>
              <p className="text-amber-50 text-xl font-medium mb-12 max-w-2xl mx-auto">
                Join our weekend or weekday batches. Book a free discovery session to see if your child is the next robotics champion!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button className="h-16 px-12 bg-white text-orange-600 hover:bg-slate-50 font-black text-xl rounded-full shadow-xl transition-all active:scale-95">
                  Secure Your Spot
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
  );
}