"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  HelpCircle,
  ChevronDown,
  Phone,
  Mail,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  Users,
  Compass,
} from "lucide-react";
import type { FAQItem } from "@/data/faqs";

interface FAQsClientProps {
  faqs: FAQItem[];
}

export default function FAQsClient({ faqs }: FAQsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "overview" | "parents" | "tutors">("all");
  const [openIds, setOpenIds] = useState<number[]>([1, 2, 3]);

  const toggleItem = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenIds(faqs.map((f) => f.id));
  };

  const collapseAll = () => {
    setOpenIds([]);
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const categories = [
    { key: "all", label: "All Questions", count: faqs.length },
    {
      key: "overview",
      label: "Platform Overview",
      count: faqs.filter((f) => f.category === "overview").length,
    },
    {
      key: "parents",
      label: "For Parents & Students",
      count: faqs.filter((f) => f.category === "parents").length,
    },
    {
      key: "tutors",
      label: "For Tutors & Institutes",
      count: faqs.filter((f) => f.category === "tutors").length,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      {/* 1. HERO HEADER */}
      <section className="relative bg-[#091a30] text-white pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 md:px-8 overflow-hidden">
        {/* Background Gradients & Ambient Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[250px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-[1100px] mx-auto relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-400 text-[11px] font-black uppercase tracking-wider backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help &amp; Knowledge Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Frequently Asked <span className="text-amber-400">Questions</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Everything you need to know about finding verified tutors, skill coaches, curricula, fees, and registration on the AACHARYA platform.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs (e.g. fees, home tutor, chess, registration, online)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium border border-slate-200 shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-[1100px] mx-auto px-4 md:px-8 py-10 sm:py-14">
        {/* Category Pills & Expand/Collapse Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/80">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              );
            })}
          </div>

          {/* Expand / Collapse Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-bold text-slate-500">
            <button
              type="button"
              onClick={expandAll}
              className="hover:text-amber-600 hover:underline px-2 py-1"
            >
              Expand All
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={collapseAll}
              className="hover:text-amber-600 hover:underline px-2 py-1"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* FAQs Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-black text-slate-800">No questions matched your search</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any questions matching "{searchQuery}". Try different keywords or clear your search filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3.5 sm:space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              const faqId = `faq-q-${faq.id}`;
              const ansId = `faq-a-${faq.id}`;

              const categoryBadge =
                faq.category === "overview"
                  ? { label: "Platform", color: "bg-blue-50 text-blue-700 border-blue-200" }
                  : faq.category === "parents"
                  ? { label: "Parents & Students", color: "bg-emerald-50 text-emerald-700 border-emerald-200" }
                  : { label: "Tutors & Coaches", color: "bg-purple-50 text-purple-700 border-purple-200" };

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 bg-white shadow-xs overflow-hidden ${
                    isOpen
                      ? "border-amber-400/80 shadow-md ring-2 ring-amber-400/15"
                      : "border-slate-200 hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  <button
                    type="button"
                    id={faqId}
                    aria-expanded={isOpen}
                    aria-controls={ansId}
                    onClick={() => toggleItem(faq.id)}
                    className="w-full text-left p-4 sm:p-5 md:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-2xl"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-800 font-black text-xs shrink-0 mt-0.5">
                        {faq.id < 10 ? `0${faq.id}` : faq.id}
                      </span>
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${categoryBadge.color} mb-1`}>
                          {categoryBadge.label}
                        </span>
                        <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-snug">
                          {faq.question}
                        </h2>
                      </div>
                    </div>

                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "bg-amber-500 text-slate-950 rotate-180"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {/* Complete Answer Text in HTML for search engines */}
                  <div
                    id={ansId}
                    role="region"
                    aria-labelledby={faqId}
                    className={`px-4 sm:px-6 transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "max-h-[600px] pb-5 sm:pb-6 opacity-100"
                        : "max-h-0 pb-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    <div className="pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed sm:pl-10">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. QUICK ACTION TILES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-14 sm:mt-18">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Find Tutors Nearby</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Browse verified academic tutors for CBSE, ICSE, and state boards with transparent fee ratings.
              </p>
            </div>
            <Link
              href="/find-tutor-nearby"
              className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 hover:text-amber-700"
            >
              <span>Explore Tutors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Discover Activity Coaches</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Connect with coaches for chess, robotics, abacus, coding, music, dance, and creative arts.
              </p>
            </div>
            <Link
              href="/find-tutor-nearby?type=coach"
              className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-700"
            >
              <span>Explore Coaches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Join as a Teacher or Coach</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Build your professional teaching profile and receive student leads in your local neighborhood.
              </p>
            </div>
            <Link
              href="/signup/teacher"
              className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 hover:text-emerald-700"
            >
              <span>Register Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4. STILL HAVE QUESTIONS? DIRECT CONTACT CARD */}
        <div className="mt-12 bg-[#091a30] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-3 text-center lg:text-left max-w-xl">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                Personalized Assistance
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Still have questions? We're here to help.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Our Vijayawada support desk can guide you through finding the right tutor, scheduling a demo, or posting a customized requirement.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs">
                <a
                  href="tel:+918074103400"
                  className="flex items-center gap-2 text-slate-200 hover:text-amber-400 transition-colors font-bold"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>+91 80741 03400</span>
                </a>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <a
                  href="mailto:aacharyateam@gmail.com"
                  className="flex items-center gap-2 text-slate-200 hover:text-amber-400 transition-colors font-bold"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>aacharyateam@gmail.com</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <a
                href="https://wa.me/918074103400?text=Hi%20AACHARYA,%20I%20have%20a%20question%20regarding%20finding%20a%20tutor"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center flex items-center justify-center gap-2"
              >
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                href="/request-tutor"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center flex items-center justify-center gap-2"
              >
                <span>Post Requirement</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

