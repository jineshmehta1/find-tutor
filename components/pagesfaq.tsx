"use client"

import { useState } from "react"
import { Plus, Minus, MessageCircle, Phone, HelpCircle } from "lucide-react"

export default function ColorfulFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "What is the minimum age for admission?",
      answer: "For Grade 1, the child must be 6 years old by March 31st of the academic year. For Kindergarten (KG), the minimum age is 3+ years.",
      theme: "blue",
    },
    {
      question: "Do you provide school transport?",
      answer: "No, as of now we have no own transport facility. However the school is located very near to the central locality and accessible for all type of trnasport facilities.",
      theme: "amber",
    },
    {
      question: "What is the student-teacher ratio?",
      answer: "We maintain a strict 10:1 ratio in Primary classes to ensure every child gets personalized attention and care.",
      theme: "green",
    },
    {
      question: "Are meals provided at school?",
      answer: "We offer an optional nutritious meal plan prepared by our in-house nutritionists. We focus on healthy, balanced vegetarian meals.",
      theme: "rose",
    },
    {
      question: "What curriculum do you follow ?",
      answer: "Aacharya curriculum is mapped with EYFS (UK), Waldorf (German), NEP (Indian), Montissori (Italian), Reggio Emilia (Italian) and Project Zero (Harvard-USA). Traditional in name but global in standards.",
      theme: "red",
    },
  ]

  const getColors = (theme: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-50 border-blue-100 text-blue-700 hover:border-blue-300",
      amber: "bg-amber-50 border-amber-100 text-amber-700 hover:border-amber-300",
      green: "bg-green-50 border-green-100 text-green-700 hover:border-green-300",
      rose: "bg-rose-50 border-rose-100 text-rose-700 hover:border-rose-300",
      purple: "bg-purple-50 border-purple-100 text-purple-700 hover:border-purple-300",
    }
    return colors[theme] || colors.blue
  }

  return (
    <section className="py-8 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: THE FAQS */}
          <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
            <div className="text-center lg:text-left space-y-4">
              <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-black text-[10px] md:text-xs uppercase tracking-widest inline-flex items-center gap-2 shadow-sm">
                <HelpCircle size={14} className="fill-yellow-400/30" /> Got Questions?
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tighter">
                Everything You Need <br />
                To <span className="text-amber-500 italic">Know</span> 🤔
              </h2>
              <p className="text-slate-500 text-base md:text-lg font-medium max-w-xl mx-auto lg:mx-0">
                Can't find the answer you're looking for? Reach out to our admissions team directly!
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index
                const colorClasses = getColors(faq.theme)

                return (
                  <div
                    key={index}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className={`
                      cursor-pointer rounded-2xl md:rounded-3xl border-2 p-1 transition-all duration-500
                      ${isOpen ? 'bg-white shadow-xl scale-[1.01] md:scale-[1.02]' : 'bg-transparent border-transparent'}
                    `}
                  >
                    <div className={`
                      flex flex-col rounded-xl md:rounded-2xl border-2 p-4 md:p-6 transition-all duration-300
                      ${colorClasses}
                      ${isOpen ? 'border-transparent bg-opacity-100 shadow-inner' : 'bg-opacity-50'}
                    `}>
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-black text-base md:text-xl leading-tight">
                          {faq.question}
                        </h3>
                        <span className={`
                          flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white text-current transition-all duration-500 shadow-sm
                          ${isOpen ? 'rotate-180 bg-slate-900 text-white' : ''}
                        `}>
                          {isOpen ? <Minus size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
                        </span>
                      </div>
                      
                      <div className={`
                        overflow-hidden transition-all duration-500 ease-in-out
                        ${isOpen ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0'}
                      `}>
                        <p className="text-slate-700 font-bold text-sm md:text-base leading-relaxed pr-2 md:pr-8">
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
          <div className="lg:col-span-5 relative order-1 lg:order-2 px-2 md:px-0">
            <div className="relative group">
              
              {/* Abstract Blobs Background - Responsive sizing */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-amber-100 rounded-full blur-3xl opacity-40 -z-10"></div>

              {/* Main Image Container - Fluid height */}
              <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border-4 md:border-8 border-white shadow-2xl rotate-1 group-hover:rotate-0 transition-transform duration-700">
                <img
                  src="/kid.jpg"
                  alt="Thinking Student"
                  className="w-full aspect-[4/5] md:h-[600px] object-cover hover:scale-110 transition-transform duration-1000"
                />
              </div>

              {/* Floating Card 1: Contact Support */}
              <div className="absolute -bottom-6 -left-2 sm:-left-6 md:-left-8 bg-white p-3 md:p-4 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 md:gap-4 animate-float z-20">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <Phone size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Call Us</p>
                  <p className="text-sm md:text-lg font-black text-slate-800 tracking-tight">+91 80741 03400</p>
                </div>
              </div>

              {/* Floating Card 2: Chat Bubble - Positioned to stay inside mobile bounds */}
              <div className="absolute top-8 -right-2 sm:-right-4 lg:-right-6 bg-slate-900 p-3 md:p-4 md:pr-6 rounded-2xl rounded-tr-none shadow-2xl animate-bounce-slow z-20">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-400 rounded-lg flex items-center justify-center text-slate-900">
                      <MessageCircle size={18} className="md:w-5 md:h-5" />
                   </div>
                   <div>
                     <p className="font-black text-white text-xs md:text-sm">Still confused?</p>
                     <p className="text-[10px] md:text-xs text-amber-400 font-black cursor-pointer hover:underline uppercase tracking-widest">Chat with us!</p>
                   </div>
                </div>
              </div>

              {/* Decorative Star */}
              <div className="absolute -top-4 -left-4 text-amber-400 animate-pulse hidden sm:block">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>

            </div>
          </div>

        </div>
      </div>
      
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}