"use client";

import React, { useState, useEffect } from "react";
import { Plus, Minus, HelpCircle, ArrowUp, Sparkles, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "Why choose Aacharya over others?",
    answer: "We offer a unique blend of holistic education (Robotics, Abacus, Chess) along with core academics (CBSE). Our certified trainers and small batch sizes set us apart.",
    theme: "indigo",
    light: "bg-indigo-50 border-indigo-100 text-indigo-900",
    dark: "bg-indigo-600 text-white shadow-indigo-200"
  },
  {
    question: "What is the ideal age to start skill training?",
    answer: "For skills like Chess and Abacus, 5-7 years is ideal. For Robotics, 8+ years is recommended. We have beginner programs for all age groups.",
    theme: "emerald",
    light: "bg-emerald-50 border-emerald-100 text-emerald-900",
    dark: "bg-emerald-600 text-white shadow-emerald-200"
  },
  {
    question: "Are the classes online or offline?",
    answer: "We offer both! Our offline center provides hands-on learning, while our online programs are optimized for interactive remote training.",
    theme: "violet",
    light: "bg-violet-50 border-violet-100 text-violet-900",
    dark: "bg-violet-600 text-white shadow-violet-200"
  },
  {
    question: "Do you provide certification?",
    answer: "Yes. Students receive course completion certificates. For Chess, we prepare students for official FIDE ratings and tournaments.",
    theme: "rose",
    light: "bg-rose-50 border-rose-100 text-rose-900",
    dark: "bg-rose-600 text-white shadow-rose-200"
  },
  {
    question: "How do I book a demo class?",
    answer: "Click the 'Book Demo' button or fill out the enquiry form. Our counselor will contact you to schedule a free trial session.",
    theme: "amber",
    light: "bg-amber-50 border-amber-100 text-amber-900",
    dark: "bg-amber-600 text-white shadow-amber-200"
  },
  {
    question: "What is the fee structure?",
    answer: "Fees vary based on the program and duration. Contact our admission desk for the latest fee chart and scholarship opportunities.",
    theme: "slate",
    light: "bg-slate-50 border-slate-200 text-slate-900",
    dark: "bg-slate-800 text-white shadow-slate-200"
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative bg-white py-16 md:py-24 px-6 overflow-hidden" id="faq">
      
      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* --- BALANCED HEADER --- */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">
            <HelpCircle size={14} />
            Support Center
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Commonly Asked <span className="text-indigo-600">Questions</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-base max-w-lg mx-auto">
            Everything you need to know about our academy programs and admissions process.
          </p>
        </div>

        {/* --- COLORED GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`group rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                  isOpen ? `${item.dark} shadow-2xl` : `${item.light} hover:shadow-md cursor-pointer`
                }`}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div className="p-6 md:p-8">
                  {/* Question Row */}
                  <div className="flex items-center justify-between gap-4">
                    <h3 className={`text-base md:text-lg font-bold leading-snug transition-colors ${isOpen ? 'text-white' : 'text-current'}`}>
                      {item.question}
                    </h3>
                    <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isOpen ? 'bg-white/20 text-white' : 'bg-black/5 text-current'
                    }`}>
                      {isOpen ? <Minus size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
                    </div>
                  </div>

                  {/* Answer Section */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="pt-6 mt-6 border-t border-white/10">
                          <p className="text-sm md:text-base font-medium leading-relaxed text-white/90">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- COMPACT FOOTER SUPPORT --- */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
          <div className="flex -space-x-3">
             {[1,2,3].map(i => (
               <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
             ))}
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-bold text-slate-900">Still have questions?</h4>
            <p className="text-slate-500 text-sm">Our team is here to help you 24/7.</p>
          </div>
          <a 
            href="https://wa.me/918074103400" 
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Scroll To Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transition-all hover:-translate-y-1 text-white ${
          showScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ArrowUp size={20} strokeWidth={3} />
      </button>
    </section>
  );
}