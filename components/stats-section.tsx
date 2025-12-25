"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Minus, 
  HelpCircle, 
  ArrowUp 
} from "lucide-react";

// --- FAQ Data ---
const faqData = [
  {
    question: "Why choose Aacharya over others?",
    answer:
      "We offer a unique blend of holistic education (Robotics, Abacus, Chess) along with core academics (CBSE). Our certified trainers, small batch sizes, and proven track record of national winners set us apart.",
  },
  {
    question: "What is the ideal age to start skill training?",
    answer:
      "For skills like Chess and Abacus, 5-7 years is ideal as it builds cognitive foundation. For Robotics, 8+ years is recommended. However, we have beginner programs for all age groups.",
  },
  {
    question: "Are the classes online or offline?",
    answer:
      "We offer both! Our offline center provides hands-on robotics and classroom learning, while our online programs for Chess and Abacus are optimized for interactive remote learning.",
  },
  {
    question: "Do you provide certification?",
    answer:
      "Yes. Students receive course completion certificates. For Chess, we also prepare students for official FIDE ratings and district/state tournaments.",
  },
  {
    question: "How do I book a demo class?",
    answer:
      "You can click the 'Book Demo' button on the top right or fill out the enquiry form. Our academic counselor will contact you to schedule a free trial session.",
  },
  {
    question: "What is the fee structure?",
    answer:
      "Fees vary based on the program (School vs. Skills) and duration. Please contact our admission desk for the latest fee chart and scholarship opportunities.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative bg-slate-50 py-16 lg:py-24 font-sans overflow-hidden" id="faq">
      
      {/* --- Background Pattern --- */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-6 shadow-sm">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Frequently Asked <span className="text-amber-500">Questions</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Everything you need to know about our programs, admissions, and teaching methodology.
          </p>
        </div>

        {/* --- FAQ Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqData.map((item, index) => (
            <div 
              key={index}
              className={`
                bg-white rounded-2xl border transition-all duration-300 overflow-hidden
                ${openIndex === index 
                  ? 'border-amber-400 shadow-xl shadow-amber-900/5 ring-1 ring-amber-400' 
                  : 'border-slate-200 shadow-sm hover:border-amber-200'
                }
              `}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-start justify-between p-6 text-left focus:outline-none"
              >
                <span className={`font-bold text-lg pr-4 ${openIndex === index ? 'text-slate-900' : 'text-slate-700'}`}>
                  {item.question}
                </span>
                
                {/* Icon Toggle */}
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${openIndex === index ? 'bg-amber-500 text-white rotate-180' : 'bg-slate-100 text-slate-500'}
                `}>
                  {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
              
              {/* Answer Content */}
              <div 
                className={`
                  px-6 transition-all duration-500 ease-in-out overflow-hidden
                  ${openIndex === index ? 'max-h-60 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'}
                `}
              >
                <p className="text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* --- Bottom CTA --- */}
        <div className="mt-12 text-center bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <p className="text-slate-800 font-semibold text-lg mb-2">
            Still have questions?
          </p>
          <p className="text-slate-500 mb-6">
            We're here to help. Chat with our admission counselor directly.
          </p>
          <a 
            href="https://wa.me/919876543210" 
            target="_blank"
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-amber-500 transition-colors shadow-lg"
          >
            Contact Support
          </a>
        </div>

      </div>

      {/* --- Scroll To Top --- */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-amber-500 hover:bg-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-1 active:scale-95 text-white"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" strokeWidth={2.5} />
      </button>

    </section>
  );
}