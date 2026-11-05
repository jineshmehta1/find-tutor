"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight, Sparkles } from "lucide-react";
import { HOME_FEATURED_FAQS } from "@/data/faqs";

export default function HomeFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Structured Data (JSON-LD) for Google SEO rich snippet for these 5 featured questions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FEATURED_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      id="home-faqs"
      aria-labelledby="faq-heading"
      className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/60 to-white relative overflow-hidden font-sans border-t border-slate-100"
    >
      {/* Background Accent Gradients */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-400/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-[400px] h-[300px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-[1100px] mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-amber-900 text-[11px] font-black uppercase tracking-wider shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Got Questions?</span>
          </div>

          {/* EXACT H2 HEADING REQUIRED BY SEO SPEC */}
          <h2
            id="faq-heading"
            className="text-2xl sm:text-3.5xl md:text-4xl font-black text-slate-900 tracking-tight leading-snug"
          >
            Frequently Asked Questions About Finding Tutors &amp; Coaches
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium leading-relaxed">
            Quick answers to the most common questions from parents and students looking for quality home tutors, online teachers, and activity mentors.
          </p>
        </div>

        {/* 5 Selected FAQs Accordion */}
        <div className="space-y-3.5 sm:space-y-4 max-w-4xl mx-auto">
          {HOME_FEATURED_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const faqId = `home-faq-${faq.id}`;
            const answerId = `home-faq-ans-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 bg-white shadow-xs overflow-hidden ${
                  isOpen
                    ? "border-amber-400/80 shadow-md ring-2 ring-amber-400/20"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <button
                  type="button"
                  id={faqId}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-4 sm:p-5 md:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-2xl"
                >
                  <span className="flex items-start sm:items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-500/10 text-amber-700 font-black text-xs shrink-0 mt-0.5 sm:mt-0">
                      0{index + 1}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </span>
                  </span>

                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "bg-amber-500 text-slate-950 rotate-180"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </span>
                </button>

                {/* Answer Section: Always in HTML for crawler discovery, toggled smoothly */}
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={faqId}
                  className={`px-4 sm:px-6 transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[500px] pb-5 sm:pb-6 opacity-100" : "max-h-0 pb-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="pt-2 border-t border-slate-100/80 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Block linking to /faqs */}
        <div className="mt-10 sm:mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/faqs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm tracking-wide transition-all shadow-md hover:shadow-lg group"
          >
            <span>View All FAQs (15 Questions &amp; Answers)</span>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/request-tutor"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all"
          >
            <span>Post Your Requirement</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

