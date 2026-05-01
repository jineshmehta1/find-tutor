// 1. Force dynamic to ensure Admin data updates instantly
export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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
        subtitle:
          "Admissions Open for 2024-25. Join the journey of innovation and learning.",
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

/* ---------------- PROGRAMS DATA (UPDATED COLORS) ---------------- */
const programs = [
  {
    image: "/pre-co.png",
    label: "Pre School",
    tag: "Ages 2 – 6",
    desc: "International Play Group & Nursery nurturing creativity, curiosity and foundational skills in a joyful environment.",
    path: "/pre-school",
    accent: "#4f46e5",
    accentLight: "#e0e7ff",
    accentMid: "#c7d2fe",
    number: "01",
  },
  {
    image: "/coach-co.png",
    label: "Tuition Point",
    tag: "Class 1 – 10",
    desc: "Expert CBSE / IB coaching with small batches, live doubt-solving and personalised attention for every student.",
    path: "/tuition-center",
    accent: "#ea580c",
    accentLight: "#ffedd5",
    accentMid: "#fed7aa",
    number: "02",
  },
  {
    image: "/chess-co.png",
    label: "Chess Academy",
    tag: "All Ages",
    desc: "Master strategy, foresight and deep focus under professional coaching. Compete at regional and national level.",
    path: "/chess-academy",
    accent: "#7c3aed",
    accentLight: "#ede9fe",
    accentMid: "#ddd6fe",
    number: "03",
  },
  {
    image: "/abacus-co.png",
    label: "Abacus Training",
    tag: "Ages 5 – 14",
    desc: "Enhance mental arithmetic speed and right-brain development through internationally proven abacus techniques.",
    path: "/abacus-training",
    accent: "#059669",
    accentLight: "#dcfce7",
    accentMid: "#bbf7d0",
    number: "04",
  },
  {
    image: "/robo-co.png",
    label: "Robotics & IoT",
    tag: "Ages 8 – 16",
    desc: "Future-ready coding, hardware prototyping and robotics for young innovators building tomorrow's solutions today.",
    path: "/robotics-center",
    accent: "#db2777",
    accentLight: "#fce7f3",
    accentMid: "#fbcfe8",
    number: "05",
  },
  {
    image: "/tutor-new-removebg-preview.png",
    label: "Find Tutors",
    tag: "On-Demand",
    desc: "Connect with verified expert tutors near you. One-on-one sessions personalised to your child's pace and style.",
    path: "/find-tutor-nearby",
    accent: "#d97706",
    accentLight: "#fef3c7",
    accentMid: "#fde68a",
    number: "06",
  },
];

/* ---------------- COMPONENT ---------------- */
export default async function HomeHero() {
  const data = await getHomeData();

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative w-full overflow-hidden">
        <DynamicPageBanner data={data.banner} />
      </section>

      {/* PROGRAMS */}
      <section className="bg-white py-20 md:py-28 px-5 md:px-10 lg:px-16">
        <div className="max-w-[1380px] mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="block w-8 h-[2px] rounded-full bg-orange-400" />
                <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-orange-500">
                  Our Curated Programs
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-[45px] font-extrabold leading-[1.05] tracking-tight text-slate-900">
                Empowering the next<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                  Generation of Leaders
                </span>
              </h2>
            </div>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xs">
              Age-appropriate learning paths designed for holistic growth.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {programs.map((p, i) => (
              <Link
                key={i}
                href={p.path}
                className="group relative flex flex-col rounded-[28px] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)]"
                style={{
                  background: `linear-gradient(135deg, ${p.accentLight}, #ffffff)`,
                  border: `1px solid ${p.accentMid}`,
                }}
              >
                {/* Glow */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-30 group-hover:opacity-60 transition"
                  style={{ backgroundColor: p.accent }}
                />

                <div className="flex flex-col h-full p-6 sm:p-7 md:p-8 relative z-10">

                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="text-[10px] sm:text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-white/70 backdrop-blur"
                      style={{ color: p.accent }}
                    >
                      {p.tag}
                    </span>
                    <span
                      className="text-xs font-black opacity-20"
                      style={{ color: p.accent }}
                    >
                      {p.number}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="relative w-full rounded-[20px] bg-white/70 backdrop-blur-md border border-white/50 mb-6 flex items-center justify-center overflow-hidden h-32 sm:h-36 md:h-40">
                    <Image
                      src={p.image}
                      alt={p.label}
                      width={120}
                      height={120}
                      className="object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className="absolute bottom-0 right-0 w-16 h-16 rounded-tl-full opacity-20"
                      style={{ backgroundColor: p.accent }}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
                    {p.label}
                  </h3>

                  <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed mb-6">
                    {p.desc}
                  </p>

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                      <span
                        className="text-sm font-bold tracking-wide"
                        style={{ color: p.accent }}
                      >
                        View Details
                      </span>

                      <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:rotate-45"
                        style={{ backgroundColor: p.accent }}
                      >
                        <ArrowUpRight size={18} strokeWidth={3} />
                      </div>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>

         

        </div>
      </section>
    </div>
  );
}