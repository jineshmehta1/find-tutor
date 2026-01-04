"use client"

import { useEffect, useState, useRef } from "react"
import { Sparkles, Users, ShieldCheck, GraduationCap, Star, Heart } from "lucide-react"

// --- 1. Counter Component ---
const Counter = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    if (countRef.current) observer.observe(countRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return <span ref={countRef}>{count.toLocaleString()}</span>
}

// --- 2. Main Component ---
export default function FunStatsSection() {
  const stats = [
    { 
      num: 20, 
      suffix: "+", 
      label: "Years of Excellence in Education", 
      icon: Sparkles, 
      color: "text-yellow-400", 
      bg: "bg-yellow-400/20",
      border: "border-yellow-500"
    },
    { 
      num: 2500, 
      suffix: "+", 
      label: "Happy Learners", 
      icon: Users, 
      color: "text-blue-400", 
      bg: "bg-blue-400/20",
      border: "border-blue-500"
    },
    { 
      num: 100, 
      suffix: "%", 
      label: "Safe Campus", 
      icon: ShieldCheck, 
      color: "text-green-400", 
      bg: "bg-green-400/20",
      border: "border-green-500"
    },
    { 
      num: 25, 
      suffix: "+", 
      label: "Super Teachers", 
      icon: GraduationCap, 
      color: "text-rose-400", 
      bg: "bg-rose-400/20",
      border: "border-rose-500"
    },
  ]

  return (
    <section className="bg-slate-900 py-12 md:py-24 relative overflow-hidden">
      
      {/* Background Decor (Optimized for mobile: hidden or scaled) */}
      <div className="absolute top-5 left-5 text-slate-800 animate-pulse hidden sm:block"><Star size={40} /></div>
      <div className="absolute bottom-5 right-5 text-slate-800 animate-pulse delay-75 hidden sm:block"><Heart size={40} /></div>
      
      {/* Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Grid: 1 col on tiny mobile, 2 cols on small mobile/tablet, 4 cols on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`
                group bg-slate-800/40 backdrop-blur-md 
                rounded-[2rem] p-5 sm:p-8 
                border-b-4 ${stat.border}
                hover:-translate-y-2 active:scale-95 transition-all duration-300
                flex flex-col items-center justify-center text-center
                shadow-lg hover:shadow-2xl hover:shadow-slate-950
              `}
            >
              {/* Icon Bubble (Scales on mobile) */}
              <div className={`
                w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 
                ${stat.bg} ${stat.color} 
                group-hover:scale-110 group-hover:rotate-6 transition-transform
              `}>
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} />
              </div>

              {/* Number Counter (Font sizes scale) */}
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-1 flex items-baseline gap-0.5">
                <Counter end={stat.num} />
                <span className={`${stat.color} text-2xl sm:text-3xl`}>{stat.suffix}</span>
              </h3>

              {/* Label (Uppercase tracking looks better on mobile) */}
              <p className="text-slate-400 font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.15em] group-hover:text-white transition-colors">
                {stat.label}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}
