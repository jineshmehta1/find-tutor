"use client";

import React, { useState, useEffect } from "react";
import { Plus, Minus, HelpCircle, ArrowUp } from "lucide-react";

const faqData = [
  {
    question: "Why choose Aacharya over others?",
    answer: "We offer a unique blend of holistic education (Robotics, Abacus, Chess) along with core academics (CBSE). Our certified trainers, small batch sizes, and proven track record of national winners set us apart.",
  },
  {
    question: "What is the ideal age to start skill training?",
    answer: "For skills like Chess and Abacus, 5-7 years is ideal as it builds cognitive foundation. For Robotics, 8+ years is recommended. However, we have beginner programs for all age groups.",
  },
  {
    question: "Are the classes online or offline?",
    answer: "We offer both! Our offline center provides hands-on robotics and classroom learning, while our online programs for Chess and Abacus are optimized for interactive remote learning.",
  },
  {
    question: "Do you provide certification?",
    answer: "Yes. Students receive course completion certificates. For Chess, we also prepare students for official FIDE ratings and district/state tournaments.",
  },
  {
    question: "How do I book a demo class?",
    answer: "You can click the 'Book Demo' button on the top right or fill out the enquiry form. Our academic counselor will contact you to schedule a free trial session.",
  },
  {
    question: "What is the fee structure?",
    answer: "Fees vary based on the program (School vs. Skills) and duration. Please contact our admission desk for the latest fee chart and scholarship opportunities.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showScroll, setShowScroll] = useState(false);

  // Show scroll-to-top button after scrolling 400px
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative bg-slate-50 py-12 md:py-24 px-4 overflow-hidden" id="faq">
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-100 text-amber-600 mb-4 shadow-sm">
            <HelpCircle className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Frequently Asked <span className="text-amber-500">Questions</span>
          </h2>
          <p className="text-slate-600 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            Quick answers to common questions about our programs and admissions.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {faqData.map((item, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl md:rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === index 
                  ? 'border-amber-400 shadow-lg' 
                  : 'border-slate-200 shadow-sm hover:border-amber-200'
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-start justify-between p-5 md:p-6 text-left"
              >
                <span className={`font-bold text-base md:text-lg pr-4 ${openIndex === index ? 'text-amber-600' : 'text-slate-800'}`}>
                  {item.question}
                </span>
                <div className={`mt-1 flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all ${
                  openIndex === index ? 'bg-amber-500 text-white rotate-180' : 'bg-slate-100 text-slate-400'
                }`}>
                  {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
              
              <div 
                className={`px-5 md:px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-[300px] pb-5 md:pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-50 pt-4">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Support Box */}
        <div className="mt-12 md:mt-16 text-center bg-white border border-slate-100 rounded-2xl p-6 md:p-10 shadow-sm max-w-3xl mx-auto">
          <h3 className="text-slate-900 font-bold text-lg md:text-xl mb-2">Still have questions?</h3>
          <p className="text-slate-500 text-sm md:text-base mb-6">Our academic counselors are ready to help you find the right fit.</p>
          <a 
            href="https://wa.me/918074103400" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-slate-900 text-white rounded-full font-bold hover:bg-amber-500 transition-all shadow-md active:scale-95"
          >
            Contact Support
          </a>
        </div>
      </div>

      {/* Floating Scroll To Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg transition-all hover:bg-amber-600 hover:-translate-y-1 active:scale-90 text-white ${
          showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" strokeWidth={3} />
      </button>
    </section>
  );
}