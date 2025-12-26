// 1. Force dynamic to ensure Admin data updates instantly
export const dynamic = "force-dynamic";

import React from "react";
import { 
  BookOpen,      
  BrainCircuit,  
  Bot,           
  Gamepad2,      
  GraduationCap,
  Plane,
  Crown
} from "lucide-react";

// Dynamic Components
import DynamicPageBanner from "@/components/dynamicbanner";
import Link from "next/link";

// 2. DATA FETCHING
import { prisma } from "@/lib/data";

async function getHomeData() {
  const pageKey = "home";
  try {
    const banner = await prisma.banner.findUnique({
      where: { pageKey },
    });

    return {
      banner: banner || {
        title: "Where Academic Excellence Meets Future Skills",
        subtitle: "Admissions Open for 2024-25. Join the journey of innovation and learning.",
        imageUrl: "/hero.jpg",
        breadcrumb: "Welcome to Aacharya"
      }
    };
  } catch (error) {
    console.error("Error fetching home banner:", error);
    return { banner: null };
  }
}

// 3. SERVER COMPONENT
export default async function HomeHero() {
  const data = await getHomeData();

  const programs = [
    { 
      icon: GraduationCap, 
      label: "Pre-Primary", 
      path: "/school",
      color: "text-blue-500"
    },
    { 
      icon: BrainCircuit, 
      label: "Abacus", 
      path: "/abacus",
      color: "text-amber-500"
    },
    { 
      icon: Bot, 
      label: "Robotics", 
      path: "/robotics",
      color: "text-purple-500"
    },
    { 
      icon: Crown, 
      label: "Chess", 
      path: "/chess",
      color: "text-emerald-500"
    },
    { 
        icon: BookOpen, 
        label: "Tution Point", 
        path: "/coaching",
        color: "text-rose-500"
    },
  ];

  return (
    <div className="bg-white">
      {/* ------------------- DYNAMIC BANNER ------------------- */}
      <DynamicPageBanner data={data.banner} />

      {/* ------------------- GOAL SELECTION SECTION (Based on Image) ------------------- */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Programs We Offer At <span className="text-amber-600">Aacharya</span>
          </h2>
          </div>

          {/* Goal Icons Grid */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {programs.map((program, idx) => (
              <Link 
                href={program.path} 
                key={idx}
                className="group flex flex-col items-center gap-4 transition-all hover:-translate-y-2"
              >
                {/* Icon Container */}
                <div className="w-24 h-24 md:w-32 md:h-32 bg-sky-50 rounded-[2.5rem] flex items-center justify-center shadow-sm border border-sky-100 group-hover:shadow-md group-hover:bg-white transition-all duration-300">
                    <program.icon 
                        size={48} 
                        className={`${program.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`} 
                    />
                </div>
                
                {/* Label */}
                <span className="text-lg md:text-xl font-bold text-slate-700 group-hover:text-sky-500 transition-colors">
                    {program.label}
                </span>
              </Link>
            ))}

          </div>
        </div>
      </section>
    </div>
  );
}