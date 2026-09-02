"use client";

import React, { useState, useEffect } from "react";
import { Plus, Minus, HelpCircle, ArrowUp, Sparkles, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "How do I connect with a tutor in Bhavanipuram & Vijayawada?",
    answer: "When you post a requirement or search for a subject on our homepage, our system matches you with verified tutors. Tutors can be reached directly via message or phone call to discuss your exact needs and customized fee quotes.",
    theme: "indigo",
    light: "bg-indigo-50 border-indigo-100 text-indigo-900",
    dark: "bg-indigo-600 text-white shadow-indigo-200"
  },
  {
    question: "Can I evaluate the tutor before committing?",
    answer: "Yes! You can contact the tutor directly via message or call before committing to any package to discuss communication, methodology, and compatibility.",
    theme: "emerald",
    light: "bg-emerald-50 border-emerald-100 text-emerald-900",
    dark: "bg-emerald-600 text-white shadow-emerald-200"
  },
  {
    question: "Does Aacharya platform charge a middleman commission?",
    answer: "No. We operate on a 0% hidden markup policy for parents. You negotiate billing hours and fees directly with your assigned instructor, ensuring transparent prices without any broker cuts.",
    theme: "violet",
    light: "bg-violet-50 border-violet-100 text-violet-900",
    dark: "bg-violet-600 text-white shadow-violet-200"
  },
  {
    question: "How are tutor profiles and credentials physically verified?",
    answer: "We physically audit government-issued identity documents (Aadhaar/PAN), educational degrees, certificates, and local residential address proofs of all instructors before awarding them the verified badge.",
    theme: "rose",
    light: "bg-rose-50 border-rose-100 text-rose-900",
    dark: "bg-rose-600 text-white shadow-rose-200"
  },
  {
    question: "Can we switch between Home Tuition and 1-on-1 Online mode?",
    answer: "Yes, you can choose a hybrid model. Switch between in-person home tutoring visits and live interactive 1-on-1 online classes anytime based on your convenience.",
    theme: "amber",
    light: "bg-amber-50 border-amber-100 text-amber-900",
    dark: "bg-amber-600 text-white shadow-amber-200"
  },
  {
    question: "What is the average hourly or monthly fee structure?",
    answer: "Tutor rates typically range between ₹250/hr and ₹800/hr depending on class grade, subject complexity (e.g. Class 12 Physics vs Class 5 English), and mode. Try our interactive Fee Estimator on the home page for a localized estimate.",
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
    <div className="relative bg-white py-16 md:py-24 px-6 overflow-hidden animate-fade-in-up" id="faq">
      
      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <HelpCircle size={14} />
            <span>Support Center</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-base max-w-lg mx-auto">
            Everything you need to know about our home and online tutor pairing model.
          </p>
        </div>

        {/* Colored Accordion Grid */}
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
                  {/* Question */}
                  <div className="flex items-center justify-between gap-4">
                    <h3 className={`text-base md:text-lg font-bold leading-snug transition-colors ${isOpen ? 'text-white' : 'text-current'}`}>
                      {item.question}
                    </h3>
                    <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isOpen ? 'bg-white/20 text-white' : 'bg-black/5 text-current'
                    }`}>
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </div>

                  {/* Answer */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-4"
                      >
                        <p className="text-slate-100 text-xs md:text-sm font-medium leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}