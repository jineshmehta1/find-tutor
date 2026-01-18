"use client"

import { useState } from "react"
import { Plus, Minus, Phone, HelpCircle, BookOpen, GraduationCap, Calculator } from "lucide-react"

export default function CBSEFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "When should we start Foundation for JEE/NEET?",
      answer: "We recommend starting in Class 9. This helps clear core concepts in Math & Science early, reducing pressure during the critical 11th & 12th board years.",
      theme: "blue", 
    },
    {
      question: "How do you handle doubt solving?",
      answer: "Beyond regular classes, we have dedicated 'Doubt Counters' available daily. Students can walk in to clear queries or use our app for instant video solutions.",
      theme: "amber",
    },
    {
      question: "Is the focus on NCERT or Competitive Exams?",
      answer: "It's a balanced approach. We strictly follow the CBSE NCERT syllabus for board exams while integrating advanced problem-solving techniques for competitive success.",
      theme: "green",
    },
    {
      question: "What is the batch size for personal attention?",
      answer: "We maintain a strict ratio of 25:1. This ensures every student gets personalized feedback and teachers can track individual progress effectively.",
      theme: "rose",
    },
  ]

  const getColors = (theme: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-50 border-blue-100 text-blue-700 hover:border-blue-300",
      amber: "bg-amber-50 border-amber-100 text-amber-700 hover:border-amber-300",
      green: "bg-emerald-50 border-emerald-100 text-emerald-700 hover:border-emerald-300",
      rose: "bg-rose-50 border-rose-100 text-rose-700 hover:border-rose-300",
    }
    return colors[theme] || colors.blue
  }

  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden relative">
      
      {/* Background: Subtle Graph Paper Pattern */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }}>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: THE FAQS */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <div className="text-left space-y-3 md:space-y-4">
              <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-100 text-blue-800 font-bold text-xs md:text-sm uppercase tracking-wider inline-flex items-center gap-2 border border-blue-200">
                <HelpCircle size={16} /> Admission Queries
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Mastering the <br />
                <span className="text-blue-600">Syllabus</span> 📚
              </h2>
              <p className="text-slate-600 text-base md:text-lg font-medium">
                Got questions about Board Exams, Schedules, or Faculty? We have all the answers you need.
              </p>
            </div>

            <div className="space-y-3 md:space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index
                const colorClasses = getColors(faq.theme)

                return (
                  <div
                    key={index}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className={`
                      cursor-pointer rounded-2xl border-2 p-1 transition-all duration-300
                      ${isOpen ? 'bg-white shadow-xl scale-[1.01] md:scale-[1.02] border-slate-50' : 'bg-transparent border-transparent'}
                    `}
                  >
                    <div className={`
                      flex flex-col rounded-xl border-2 p-4 md:p-5 transition-all duration-300
                      ${colorClasses}
                      ${isOpen ? 'border-transparent bg-opacity-100' : 'bg-opacity-60'}
                    `}>
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-bold text-base md:text-xl leading-snug">
                          {faq.question}
                        </h3>
                        <span className={`
                          flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-white/60 text-current transition-transform duration-300 border border-black/5
                          ${isOpen ? 'rotate-180 bg-white shadow-sm' : ''}
                        `}>
                          {isOpen ? <Minus size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
                        </span>
                      </div>
                      
                      <div className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${isOpen ? 'max-h-[500px] opacity-100 mt-3 md:mt-4' : 'max-h-0 opacity-0'}
                      `}>
                        <p className="text-slate-700 text-sm md:text-base font-medium leading-relaxed pr-2 md:pr-8">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: IMAGE & DECORATIONS */}
          <div className="lg:col-span-5 relative mt-12 lg:mt-0 px-2 md:px-0">
            <div className="relative group max-w-md mx-auto lg:max-w-none">
              
              {/* Abstract Blobs Background */}
              <div className="absolute top-10 -right-5 md:-right-10 w-48 h-48 md:w-64 md:h-64 bg-blue-200 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-5 md:-left-10 w-48 h-48 md:w-64 md:h-64 bg-emerald-200 rounded-full blur-3xl opacity-50 -z-10"></div>

              {/* Main Image Container */}
              <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img
                  src="/coaching.jpg"
                  alt="Students Studying"
                  className="w-full h-[300px] sm:h-[450px] lg:h-[600px] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Card 1: Counselor Contact */}
              <div className="absolute -bottom-6 -left-2 sm:-left-4 md:-left-8 bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 md:gap-4 animate-bounce-slow max-w-[240px] md:max-w-none">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                  <Phone size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Counselor</p>
                  <p className="text-sm md:text-lg font-black text-slate-800 whitespace-nowrap">+91 80741 03400</p>
                </div>
              </div>

              {/* Floating Card 2: Scholarship Test */}
              <div className="absolute top-6 -right-2 sm:-right-4 md:-right-6 bg-white p-3 md:p-4 md:pr-6 rounded-xl md:rounded-2xl rounded-tr-none shadow-xl border border-slate-100 animate-float">
                <div className="flex items-center gap-2 md:gap-3">
                   <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                      <GraduationCap size={18} className="md:w-5 md:h-5" />
                   </div>
                   <div>
                     <p className="font-bold text-slate-800 text-xs md:text-sm">Scholarship</p>
                     <p className="text-[10px] md:text-xs text-blue-600 font-bold cursor-pointer hover:underline">Register Free!</p>
                   </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 text-blue-500 rotate-12 drop-shadow-lg opacity-80 md:opacity-100">
                 <BookOpen size={40} className="md:w-14 md:h-14 text-blue-400" fill="currentColor" />
              </div>

              <div className="absolute bottom-20 -right-4 md:-right-8 text-amber-500 -rotate-12 drop-shadow-lg hidden sm:block">
                 <Calculator size={32} className="md:w-10 md:h-10 text-amber-400" />
              </div>

            </div>
          </div>

        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: float 5s ease-in-out infinite 1s;
        }
      `}</style>
    </section>
  )
}