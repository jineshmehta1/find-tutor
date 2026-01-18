"use client"

import React from "react"
import { motion } from "framer-motion"
import { Star, Quote, CheckCircle2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

// --- Types ---
// Matches your Prisma Schema
export interface ReviewData {
  id: number
  name: string
  role: string
  content: string
  rating: number
  date: string
}

interface ReviewProps {
  reviews?: ReviewData[]
  className?: string
}

// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

export function DynamicReviews({ reviews = [], className }: ReviewProps) {
  
  // Safety check: If no reviews are passed, hide the section or log it
  if (!reviews || reviews.length === 0) {
    console.log("DynamicReviews: No reviews found for this pageKey.");
    // Optional: Return null to hide section completely if empty
    // return null; 
  }

  return (
    <section className={cn("relative py-12 bg-slate-50 overflow-hidden", className)}>
      
      {/* --- Background Ambient Light --- */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-50/60 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Testimonials</span>
          </motion.div>

          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Voices from our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Community</span>
          </h2>
          <p className="text-slate-500 text-lg">
            Hear from parents and students about their journey with us.
          </p>
        </div>

        {/* --- Reviews Grid --- */}
        {reviews.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="relative group h-full"
              >
                {/* Card Container */}
                <div className="h-full bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-amber-900/5 group-hover:border-amber-100 flex flex-col">
                  
                  {/* Decorative Quote Icon */}
                  <div className="absolute top-6 right-6 text-slate-100 group-hover:text-amber-50 transition-colors duration-300">
                    <Quote className="w-10 h-10 fill-current" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"}`} 
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-slate-600 mb-6 leading-relaxed flex-grow text-sm font-medium">
                    "{review.content}"
                  </p>

                  {/* Footer / User Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-50 mt-auto">
                    {/* Avatar with Initials */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white uppercase">
                      {review.name.charAt(0)}
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                        {review.name}
                        <CheckCircle2 className="w-3 h-3 text-teal-500" aria-label="Verified User" />
                      </h4>
                      <div className="flex items-center gap-2 text-xs">
                          <span className="text-amber-600 font-semibold uppercase tracking-wide">{review.role}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-slate-400">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10 text-slate-400">
            No reviews available for this section yet.
          </div>
        )}

        {/* --- Bottom CTA --- */}
        <div className="mt-16 text-center">
             <a href="#" className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:border-amber-500 hover:text-amber-600 transition-all duration-300 shadow-sm hover:shadow-md">
                View all Reviews
             </a>
        </div>

      </div>
    </section>
  )
}