"use client";

import React, { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Baby,
  Trophy,
  Calculator,
  Cpu,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Pre School",
    subtitle: "Nurturing Foundation",
    description:
      "A magical space where curiosity meets structured play, building strong emotional and cognitive foundations.",
    features: ["Play-based Learning", "Safe Environment", "Expert Caregivers", "Creative Arts"],
    img1: "/pic9.webp",
    img2: "/pic15.webp",
    href: "/preschool",
    icon: Baby,
    color: "from-rose-400 to-pink-500",
    lightBg: "bg-rose-100",
    textColor: "text-rose-600",
  },
  {
    title: "Chess Coaching",
    subtitle: "Master the Board",
    description:
      "Develop strategy, patience, and deep thinking through structured chess training and competitions.",
    features: ["Tactical Puzzles", "Opening Theory", "Weekly Tournaments", "IQ Boosting"],
    img1: "/pic18.webp",
    img2: "/pic20.webp",
    href: "/chess",
    icon: Trophy,
    color: "from-indigo-400 to-blue-500",
    lightBg: "bg-indigo-100",
    textColor: "text-indigo-600",
  },
  {
    title: "Abacus Training",
    subtitle: "Mental Math Power",
    description:
      "Enhance speed, accuracy, and memory with powerful mental math techniques used globally.",
    features: ["9 Skill Levels", "Concentration", "Certification", "Speed Calculation"],
    img1: "/central.jpg",
    img2: "/gallery15.jpg",
    href: "/abacus",
    icon: Calculator,
    color: "from-amber-400 to-orange-500",
    lightBg: "bg-amber-100",
    textColor: "text-amber-600",
  },
  {
    title: "Robotics & AI",
    subtitle: "Build the Future",
    description:
      "Hands-on robotics and coding to build real-world problem-solving skills for tomorrow.",
    features: ["IoT Projects", "Python Coding", "STEM Learning", "Hardware Skills"],
    img1: "/pic34.webp",
    img2: "/pic36.webp",
    href: "/robotics",
    icon: Cpu,
    color: "from-cyan-400 to-blue-500",
    lightBg: "bg-cyan-100",
    textColor: "text-cyan-600",
  },
  {
    title: "Tuition Point",
    subtitle: "Academic Excellence",
    description:
      "Focused learning with expert tutors ensuring strong conceptual clarity and exam success.",
    features: ["1-12 Classes", "Expert Faculty", "Progress Tracking", "Exam Prep"],
    img1: "/kidcoaching.jpg",
    img2: "/sucess.jpg",
    href: "/tuition",
    icon: GraduationCap,
    color: "from-emerald-400 to-teal-500",
    lightBg: "bg-emerald-100",
    textColor: "text-emerald-600",
  },
];

export default function PremiumProgramSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">

      {/* subtle background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-7xl mx-auto px-4 relative">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border shadow-sm text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Programs
          </div>

          <h2 className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Premium Learning {" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Experiences
            </span>
          </h2>
        </div>

        {/* SLIDER */}
        <div className="relative">

          {/* arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white border shadow-lg rounded-full flex items-center justify-center hover:bg-slate-900 hover:text-white transition"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-slate-900 text-white shadow-lg rounded-full flex items-center justify-center hover:bg-amber-500 transition"
          >
            <ChevronRight />
          </button>

          {/* scroll container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
          >
            {services.map((s, i) => (
              <div key={i} className="min-w-full snap-center">

                <div className="grid lg:grid-cols-2 gap-10 items-center bg-white rounded-[32px] border border-slate-100 shadow-xl p-6 md:p-12">

                  {/* TEXT */}
                  <div className="space-y-6">
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${s.lightBg} ${s.textColor}`}>
                      {s.subtitle}
                    </div>

                    <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900">
                      {s.title}
                    </h3>

                    <p className="text-slate-600 text-lg leading-relaxed">
                      {s.description}
                    </p>

                    {/* features */}
                    <div className="grid grid-cols-2 gap-3">
                      {s.features.map((f, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <CheckCircle2 className={`w-4 h-4 ${s.textColor}`} />
                          {f}
                        </div>
                      ))}
                    </div>

                    <Link href={s.href}>
                      <Button className="mt-4 bg-slate-900 text-white hover:bg-amber-500 rounded-full px-6 py-3">
                        Explore Program
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* IMAGE */}
                  <div className="relative h-[300px] md:h-[400px]">

                    {/* gradient glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-20 blur-2xl rounded-3xl`} />

                    <img
                      src={s.img1}
                      className="absolute top-0 right-0 w-[80%] h-[70%] object-cover rounded-2xl shadow-lg"
                    />

                    <img
                      src={s.img2}
                      className="absolute bottom-0 left-0 w-[70%] h-[60%] object-cover rounded-2xl shadow-xl border-4 border-white"
                    />
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>

        {/* hint */}
        <p className="text-center mt-10 text-xs text-slate-400 tracking-widest uppercase">
          Swipe or use arrows
        </p>
      </div>
    </section>
  );
}