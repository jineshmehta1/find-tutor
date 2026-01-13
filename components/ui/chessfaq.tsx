"use client"

import { useState } from "react"
import { Plus, Minus, MessageCircle, Phone, HelpCircle, Crown, Trophy } from "lucide-react"
import Link from "next/link";
export default function ChessFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  // CHESS SPECIFIC QUESTIONS
  const faqs = [
    {
      question: "What is the best age to start Chess?",
      answer: "We recommend starting as early as 5 years old! At this age, children grasp patterns quickly, building strong cognitive foundations for the future.",
      theme: "amber", 
    },
    {
      question: "Do you offer Online or Offline classes?",
      answer: "We offer both! Our offline centers provide a physical board experience, while our online classes use interactive tools like Lichess & Chess.com.",
      theme: "blue",
    },
    {
      question: "How do students get FIDE Rated?",
      answer: "We guide students through District and State level tournaments. Once they perform well against rated players, they acquire their official FIDE Rating.",
      theme: "green",
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
    <section className="py-20 bg-white overflow-hidden relative">
      
      {/* Background: Subtle Chess Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* -----------------------------------------------------------------
             LEFT COLUMN: THE FAQS
             ----------------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-8">
            <div className="text-left space-y-4">
              <span className="px-4 py-2 rounded-full bg-amber-100 text-amber-800 font-bold text-sm uppercase tracking-wider inline-flex items-center gap-2 border border-amber-200">
                <HelpCircle size={16} /> Parent Queries
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Mastering the <br />
                <span className="text-[#C9A227]">Details</span> ♟️
              </h2>
              <p className="text-slate-600 text-lg font-medium">
                Got questions about tournaments, ratings, or schedules? We've got the moves figured out.
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
                      cursor-pointer rounded-2xl border-2 p-1 transition-all duration-300
                      ${isOpen ? 'bg-white shadow-xl scale-[1.02] border-slate-50' : 'bg-transparent border-transparent'}
                    `}
                  >
                    <div className={`
                      flex flex-col rounded-xl border-2 p-5 transition-all duration-300
                      ${colorClasses}
                      ${isOpen ? 'border-transparent bg-opacity-100' : 'bg-opacity-60'}
                    `}>
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-bold text-lg md:text-xl leading-snug">
                          {faq.question}
                        </h3>
                        <span className={`
                          flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/60 text-current transition-transform duration-300 border border-black/5
                          ${isOpen ? 'rotate-180 bg-white shadow-sm' : ''}
                        `}>
                          {isOpen ? <Minus size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={3} />}
                        </span>
                      </div>
                      
                      <div className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${isOpen ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}
                      `}>
                        <p className="text-slate-700 font-medium leading-relaxed pr-8">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* -----------------------------------------------------------------
             RIGHT COLUMN: IMAGE & DECORATIONS
             ----------------------------------------------------------------- */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative group perspective-1000">
              
              {/* Abstract Blobs Background */}
              <div className="absolute top-10 -right-10 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-50 -z-10"></div>

              {/* Main Image Container */}
              <div className="relative rounded-[2.5rem] overflow-hidden">
                <img
                  src="/chess.jpg"
                  alt="Kid Playing Chess"
                  className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Card 1: Coach Contact */}
              <div className="absolute -bottom-8 -left-4 md:-left-8 bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center gap-4 animate-bounce-slow">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Talk to Coach</p>
                  <p className="text-lg font-black text-slate-800">+91 80741 03400</p>
                </div>
              </div>

              {/* Floating Card 2: Tournament Win */}
              <div className="absolute top-12 -right-6 bg-white p-4 pr-6 rounded-2xl rounded-tr-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 animate-float">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                      <Trophy size={20} />
                   </div>
                   <div>
  <p className="font-bold text-slate-800 text-sm">Next Tournament</p>

  <Link
    href="https://apchess.org/register"
    className="text-xs text-amber-600 font-bold cursor-pointer hover:underline"
  >
    Register Now!
  </Link>
</div>
                </div>
              </div>

              {/* Decorative Elements (Chess Pieces) */}
              <div className="absolute -top-6 -left-6 text-amber-500 rotate-12 drop-shadow-lg">
                 <Crown size={56} fill="currentColor" className="text-amber-400" />
              </div>

            </div>
          </div>

        </div>
      </div>
      
      {/* Animations */}
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