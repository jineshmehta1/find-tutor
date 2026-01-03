"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Play, Sparkles, Instagram } from "lucide-react"
import { cn } from "@/lib/utils"

// --- Types ---
export interface GalleryItem {
  id: number
  category: string
  type: string 
  src: string
  title: string
  location: string
}

interface DynamicGalleryProps {
  images?: GalleryItem[]
  title?: string
  subtitle?: string
  badge?: string
  className?: string
}

export function DynamicGallery({ 
  images = [], 
  title = "Capturing the Moments",
  subtitle = "Explore our journey through training sessions, tournaments, and events.",
  badge = "Our Gallery",
  className
}: DynamicGalleryProps) {

  // Default to the first image
  const [currentIndex, setCurrentIndex] = useState(0)

  // --- Navigation ---
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1 < images.length ? prev + 1 : 0))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : images.length - 1))
  }

  // --- 3D Carousel Math ---
  const getCardStyle = (index: number) => {
    const distance = index - currentIndex
    
    // Performance optimization: Don't render cards far off-screen
    if (Math.abs(distance) > 2) return { display: "none" }

    const isActive = distance === 0
    const xOffset = distance * 260 
    const scale = isActive ? 1.1 : 1 - Math.abs(distance) * 0.15
    const opacity = isActive ? 1 : 0.4
    const zIndex = 10 - Math.abs(distance)
    const blur = isActive ? "0px" : "6px"
    const rotateY = distance * 15 

    return {
      x: xOffset,
      scale,
      opacity,
      zIndex,
      filter: `blur(${blur})`,
      rotateY,
      display: "block",
    }
  }

  // --- Empty State ---
  if (!images || images.length === 0) {
    return (
      <section className="py-24 bg-slate-50 text-center">
        <p className="text-slate-400">No gallery images found for this section.</p>
      </section>
    );
  }

  return (
    <section className={cn("relative w-full py-24 bg-slate-50 overflow-hidden", className)}>
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-100/50 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{badge}</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500 text-lg">
            {subtitle}
          </p>
        </div>

        {/* Carousel Stage */}
        <div className="relative h-[450px] flex items-center justify-center perspective-[1000px]">
          <AnimatePresence mode="popLayout">
            {images.map((img, index) => {
              const style = getCardStyle(index)
              if (style.display === "none") return null

              return (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    x: style.x,
                    scale: style.scale,
                    opacity: style.opacity,
                    zIndex: style.zIndex,
                    filter: style.filter,
                    rotateY: style.rotateY,
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="absolute w-[300px] h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 cursor-pointer"
                  onClick={() => setCurrentIndex(index)}
                >
                  <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Video Icon */}
                  {img.type === "video" && (
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </div>
                  )}

                  {/* Text Content */}
                  {index === currentIndex && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="absolute bottom-0 left-0 p-6 text-white w-full"
                    >
                      <span className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1 block">{img.category}</span>
                      <h3 className="text-2xl font-bold leading-tight mb-1">{img.title}</h3>
                      <p className="text-sm text-slate-300">{img.location}</p>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center justify-center mt-8 gap-6">
          <div className="flex gap-4">
            <button 
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-700 flex items-center justify-center hover:bg-amber-500 hover:border-amber-500 hover:text-white transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-700 flex items-center justify-center hover:bg-amber-500 hover:border-amber-500 hover:text-white transition-colors shadow-sm"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <a href="#" className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
            <Instagram className="w-4 h-4" />
            View more on Instagram
          </a>
        </div>

      </div>
    </section>
  )
}