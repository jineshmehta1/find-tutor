// 1. Force dynamic to ensure Admin data updates instantly
export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import DynamicPageBanner from "@/components/dynamicbanner";
import { prisma } from "@/lib/data";

/* ---------------- FETCH HOME DATA ---------------- */
async function getHomeData() {
  const pageKey = "home";

  try {
    const banner = await prisma.banner.findUnique({
      where: { pageKey },
    });

    return {
      banner: banner ?? {
        title: "Where Academic Excellence Meets Future Skills",
        subtitle: "Admissions Open for 2024-25. Join the journey of innovation and learning.",
        imageUrl: "/hero.jpg",
        breadcrumb: "Welcome to Aacharya",
      },
    };
  } catch (error) {
    console.error("Error fetching home banner:", error);
    return {
      banner: {
        title: "Where Academic Excellence Meets Future Skills",
        subtitle: "Admissions Open for 2024-25.",
        imageUrl: "/hero.jpg",
        breadcrumb: "Welcome to Aacharya",
      },
    };
  }
}

/* ---------------- COMPONENT ---------------- */
export default async function HomeHero() {
  const data = await getHomeData();

  const programs = [
    {
      image: "/pre-co.png",
      label: "PRE SCHOOL",
      desc: "Play Group, Nursery, LKG, UKG. Age 2–6 Years",
      path: "/school",
    },
    {
      image: "/coach-co.png",
      label: "TUITION POINT",
      desc: "CBSE/IB offline tuition for Class 1–10",
      path: "/coaching",
    },
    {
      image: "/chess-co.png",
      label: "CHESS",
      desc: "Basic to professional coaching. Age 5–15 years",
      path: "/chess",
    },
    {
      image: "/abacus-co.png",
      label: "ABACUS",
      desc: "Speed & accuracy enhancement. Age 6–14 years",
      path: "/abacus",
    },
    {
      image: "/robo-co.png",
      label: "ROBOTICS & IoT",
      desc: "Coding, robotics & IoT made exciting",
      path: "/robotics",
    },
  ];

  return (
    <div className="bg-white">
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative w-full overflow-hidden">
        <DynamicPageBanner data={data.banner} />

        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-yellow-400/70 md:bg-yellow-400/60 mix-blend-multiply pointer-events-none" />

        {/* Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-white text-4xl md:text-7xl font-black leading-[1.1] mb-10 drop-shadow max-w-5xl">
            Igniting Young Minds <br className="hidden md:block" /> with Skills for Life
          </h1>

          <Link
            href="/contact"
            className="bg-white text-slate-900 px-8 py-4 md:px-10 md:py-5 rounded-full font-black text-sm md:text-base uppercase tracking-widest transition-transform hover:scale-105 shadow-xl"
          >
            Contact Us
          </Link>
        </div>
      </section>

            {/* ---------------- PROGRAMS SECTION ---------------- */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-6xl font-black text-[#332a3d] mb-4 tracking-tight leading-tight">
              Explore Our <span className="text-[#f97316]">Learning</span> World
            </h2>
            <p className="text-base md:text-xl text-slate-700 font-medium max-w-2xl mx-auto">
              Age-appropriate programs that nurture curiosity and confidence.
            </p>
          </div>

          {/* 
              MOBILE LAYOUT LOGIC:
              - Uses Flexbox (flex-wrap justify-center) for mobile to center the 5th item.
              - Uses grid-cols-5 for Desktop.
          */}
          <div className="flex flex-wrap justify-center lg:grid lg:grid-cols-5 gap-4 md:gap-6">
            {programs.map((program, idx) => (
              <div
                key={idx}
                className="flex flex-col bg-[#dbdbdb] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:shadow-xl md:hover:-translate-y-1 w-[calc(50%-0.5rem)] sm:w-[calc(40%-1rem)] lg:w-full"
              >
                {/* Card Body */}
                <div className="flex-1 flex flex-col items-center text-center p-5 md:p-8">
                  {/* Scaled Image for Mobile */}
                  <div className="h-20 md:h-28 flex items-center justify-center mb-4 md:mb-6">
                    <Image
                      src={program.image}
                      alt={`${program.label} Program`}
                      width={100}
                      height={100}
                      className="object-contain transition-transform duration-500 hover:scale-110 h-full w-auto"
                    />
                  </div>

                  <h3 className="text-[12px] md:text-[15px] font-black text-[#332a3d] mb-2 md:mb-4 uppercase leading-tight">
                    {program.label}
                  </h3>

                  <p className="text-[10px] md:text-[13px] leading-snug text-[#4a4a4a] font-semibold md:px-2">
                    {program.desc}
                  </p>
                </div>

                {/* Footer CTA */}
                <Link
                  href={program.path}
                  className="w-full bg-[#fbbc05] hover:bg-[#f9a825] py-3 md:py-4 px-4 md:px-6 flex items-center justify-between transition-colors group"
                >
                  <span className="text-[10px] md:text-sm font-bold text-slate-900">
                    More Info
                  </span>
                  <div className="bg-white/20 p-1 rounded-full group-hover:bg-white/40 transition-colors">
                    <ArrowRight size={14} className="text-white md:w-[18px] md:h-[18px]" />
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
