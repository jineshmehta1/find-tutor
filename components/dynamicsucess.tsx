"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trophy, TrendingUp, Medal, ArrowRight, 
  Quote, Zap, Star, Target, Crown, Sparkles 
} from "lucide-react"
import { cn } from "@/lib/utils"

// --- Icon Mapping ---
const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, Trophy, Medal, Zap, Star, Target, Crown, Sparkles,
  default: Trophy
}

export interface StoryStat {
  label: string
  value: string
  icon: string | React.ElementType
}

export interface SuccessStory {
  id: number
  name: string
  role: string
  image: string
  videoThumbnail?: string
  quote: string
  story: string
  stats: StoryStat[] | string
}

interface SuccessStoriesSectionProps {
  title?: string
  titleHighlight?: string
  subtitle?: string
  badge?: string
  className?: string
  stories?: SuccessStory[]
}

const defaultStories: SuccessStory[] = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "State Champion '24",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200",
    quote: "The strategic thinking I learned here didn't just help me win chess games; it helped me ace my college interviews.",
    story: "Alex started as a complete beginner at age 10. Through our 'Grandmaster Pathway', he quickly climbed the ranks and now mentors junior players.",
    stats: [
      { label: "Rating Gain", value: "+850", icon: "TrendingUp" },
      { label: "Tournaments", value: "12", icon: "Trophy" },
      { label: "State Rank", value: "#1", icon: "Medal" },
    ]
  }
]

export function SuccessStoriesSection({
  title = "Real Stories,",
  titleHighlight = "Real Results",
  subtitle = "From beginners to masters, discover how our academy shapes champions both on and off the board.",
  badge = "Hall of Fame",
  className,
  stories = defaultStories
}: SuccessStoriesSectionProps) {
  
  const safeStories = stories && stories.length > 0 ? stories : defaultStories;
  const [activeId, setActiveId] = useState(safeStories[0]?.id)
  const [activeStory, setActiveStory] = useState(safeStories[0])

  useEffect(() => {
    const found = safeStories.find(s => s.id === activeId) || safeStories[0];
    setActiveStory(found);
  }, [activeId, safeStories]);

  const currentStats = useMemo(() => {
    if (!activeStory || !activeStory.stats) return [];
    if (Array.isArray(activeStory.stats)) return activeStory.stats;
    if (typeof activeStory.stats === 'string') {
      try { return JSON.parse(activeStory.stats); } 
      catch (e) { return []; }
    }
    return [];
  }, [activeStory]);

  if (!activeStory) return null;

  return (
    <section className={cn("py-0 md:py-24 bg-white overflow-hidden relative", className)}>
      
      {/* Background Decor (Scaled for mobile) */}
      <div className="absolute top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-amber-50 rounded-full blur-[80px] md:blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-50 rounded-full blur-[80px] md:blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-10 md:mb-16 text-center max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] md:text-xs font-bold tracking-widest uppercase"
          >
            <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span>{badge}</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 md:mb-6">
            {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">{titleHighlight}</span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 font-medium px-4">
            {subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Navigation (Horizontal on mobile, Vertical on desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex flex-row overflow-x-auto lg:flex-col gap-3 pb-4 lg:pb-0 no-scrollbar snap-x px-2 lg:px-0">
              {safeStories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => setActiveId(story.id)}
                  className={cn(
                    "flex-shrink-0 snap-center group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 text-left border relative w-[260px] lg:w-full",
                    activeId === story.id
                      ? "bg-white border-amber-500 shadow-xl shadow-amber-500/10 scale-100 z-10 ring-1 ring-amber-500/20"
                      : "bg-slate-50/50 border-transparent hover:bg-white hover:border-amber-200"
                  )}
                >
                  <div className={cn(
                    "relative w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 transition-all duration-300 shrink-0",
                    activeId === story.id ? "border-amber-500 scale-105" : "border-slate-200"
                  )}>
                    <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      "font-bold text-sm md:text-lg leading-tight truncate",
                      activeId === story.id ? "text-slate-900" : "text-slate-600"
                    )}>
                      {story.name}
                    </h4>
                    <p className={cn(
                      "text-[10px] md:text-sm font-medium truncate",
                      activeId === story.id ? "text-amber-600" : "text-slate-400"
                    )}>
                      {story.role}
                    </p>
                  </div>

                  <ArrowRight className={cn(
                    "hidden md:block w-5 h-5 transition-all duration-300",
                    activeId === story.id 
                      ? "text-amber-500 opacity-100 translate-x-0" 
                      : "text-slate-300 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                  )} />
                </button>
              ))}
            </div>
            
            {/* CTA Card (Hidden on mobile scroll, or placed at end) */}
            <div className="hidden lg:block mt-6 p-8 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group cursor-pointer shadow-xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/20 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/30 transition-all duration-500" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Start Your Story</h3>
                  <p className="text-slate-400 text-sm mb-6 font-medium">Join 500+ students achieving greatness.</p>
                  <span className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
                      Apply Now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
            </div>
          </div>

          {/* RIGHT: Active Content (Refined for mobile) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-xl md:shadow-2xl md:shadow-slate-200/50 p-6 md:p-12 relative overflow-hidden"
              >
                {/* Decorative Background Icon (Smaller on mobile) */}
                <div className="absolute top-0 right-0 p-4 md:p-8 opacity-[0.03] pointer-events-none">
                  <Quote className="w-24 h-24 md:w-48 md:h-48" />
                </div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-10 border-b border-slate-100 pb-6 md:pb-8 gap-4">
                    <div>
                      <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-2">
                        {activeStory.name}
                      </h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] md:text-sm font-bold uppercase tracking-wide">
                        <Crown className="w-3 h-3 md:w-4 md:h-4" /> {activeStory.role}
                      </div>
                    </div>
                    {/* Big Quote Icon (Hidden on very small screens) */}
                    <div className="hidden sm:flex w-12 h-12 md:w-14 md:h-14 bg-amber-500 text-white rounded-xl md:rounded-2xl items-center justify-center shadow-lg">
                      <Quote className="w-6 h-6 md:w-7 md:h-7 fill-current" />
                    </div>
                  </div>

                  <div className="flex flex-col xl:flex-row gap-8 md:gap-12">
                    
                    {/* Story Text */}
                    <div className="flex-1 space-y-4 md:space-y-6">
                      <blockquote className="text-lg md:text-2xl font-bold text-slate-900 leading-normal font-serif italic">
                        "{activeStory.quote}"
                      </blockquote>
                      <p className="text-slate-600 leading-relaxed text-sm md:text-lg font-medium">
                        {activeStory.story}
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="w-full xl:w-64 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 md:gap-4">
                      {currentStats.map((stat: StoryStat, idx: number) => {
                        const IconComponent = typeof stat.icon === 'string' 
                          ? ICON_MAP[stat.icon] || ICON_MAP.default 
                          : stat.icon;

                        return (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx + 0.2 }}
                            className="bg-slate-50 p-4 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-white hover:shadow-md transition-all duration-300 group"
                          >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white border border-slate-100 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform shadow-sm">
                              {IconComponent && <IconComponent className="w-5 h-5 md:w-6 md:h-6" />}
                            </div>
                            <div>
                              <p className="text-xl md:text-2xl font-black text-slate-900 leading-none mb-1">{stat.value}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>

                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}