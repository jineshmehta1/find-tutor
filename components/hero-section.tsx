// 1. Force dynamic to ensure Admin data updates instantly
export const dynamic = "force-dynamic";

import React from "react";
import { ArrowRight } from "lucide-react";
import DynamicPageBanner from "@/components/dynamicbanner";
import Link from "next/link";
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

export default async function HomeHero() {
  const data = await getHomeData();

  // Updated Data with Image Paths
  const programs = [
    { 
      image: "/pre-co.png", // Replace with your image path
      label: "PRE SCHOOL", 
      desc: "Play Group, Nursery, LKG, UKG. Age 2-6 Years",
      path: "/school", 
    },
    { 
      image: "/coach-co.png", // Replace with your image path
      label: "TUITION POINT", 
      desc: "CBSE/IB offline tuition point for class 1-10",
      path: "/coaching", 
    },
    { 
      image: "/chess-co.png", // Replace with your image path
      label: "CHESS", 
      desc: "Basic to professional level coaching. Age 5-15 years",
      path: "/chess", 
    },
    { 
      image: "/abacus-co.png", // Replace with your image path
      label: "ABACUS", 
      desc: "Empowering with Speed & Accuracy. Age 6-14 years",
      path: "/abacus", 
    },
    { 
      image: "/robo-co.png", // Replace with your image path
      label: "ROBOTICS & IoT", 
      desc: "Coding, robotics & IoT made exciting for kids",
      path: "/robotics", 
    },
  ];

  return (
    <div className="bg-white">
      {/* ------------------- HERO BANNER ------------------- */}
      <section className="relative w-full overflow-hidden">
        <DynamicPageBanner data={data.banner} />
        <div className="absolute inset-0 z-10 bg-yellow-400/70 md:bg-yellow-400/60 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-white text-4xl md:text-7xl font-bold leading-[1.1] mb-10 drop-shadow-sm max-w-5xl">
            Igniting Young Minds <br className="hidden md:block" /> with Skills for Life
          </h1>
          <Link 
            href="/contact"
            className="bg-white text-slate-900 px-8 py-4 md:px-10 md:py-5 rounded-full font-black text-sm md:text-base uppercase tracking-widest transition-all hover:scale-105 shadow-xl"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* ------------------- PROGRAMS SECTION ------------------- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-[#332a3d] mb-4 tracking-tight">
              Explore Our <span className="text-[#f97316]">Learning</span> World
            </h2>
            <p className="text-lg md:text-xl text-slate-700 font-medium">
              Age-appropriate programs that nurture curiosity and confidence.
            </p>
          </div>

          {/* Program Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {programs.map((program, idx) => (
              <div 
                key={idx}
                className="flex flex-col bg-[#dbdbdb] rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Content Container */}
                <div className="flex-1 flex flex-col items-center text-center p-8">
                  {/* Image Holder */}
                  <div className="h-28 flex items-center justify-center mb-6">
                    <img 
                      src={program.image} 
                      alt={program.label} 
                      className="max-h-full w-auto object-contain transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  
                  <h3 className="text-[15px] font-black text-[#332a3d] mb-4 tracking-tight uppercase">
                    {program.label}
                  </h3>
                  
                  <p className="text-[13px] leading-snug text-[#4a4a4a] font-semibold px-2">
                    {program.desc}
                  </p>
                </div>

                {/* Yellow Footer Button */}
                <Link 
                  href={program.path}
                  className="w-full bg-[#fbbc05] hover:bg-[#f9a825] py-4 px-6 flex items-center justify-between transition-colors group"
                >
                  <span className="text-sm font-bold text-slate-900">More Info</span>
                  <div className="bg-white/20 p-1 rounded-full group-hover:bg-white/40 transition-colors">
                    <ArrowRight size={18} className="text-white" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}