"use client"

import { CheckCircle2, ArrowRight, Baby, BookOpen, Trophy, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

// --- Theme Configuration ---
// This maps the "themeKey" from your Database to actual styles/icons
const THEMES = {
  beginner: {
    primary: "bg-orange-500",
    secondary: "bg-orange-50",
    text: "text-orange-600",
    icon: Baby,
    shadow: "shadow-orange-500/20"
  },
  intermediate: {
    primary: "bg-teal-500",
    secondary: "bg-teal-50",
    text: "text-teal-600",
    icon: BookOpen,
    shadow: "shadow-teal-500/20"
  },
  advanced: {
    primary: "bg-purple-600",
    secondary: "bg-purple-50",
    text: "text-purple-600",
    icon: Trophy,
    shadow: "shadow-purple-500/20"
  },
}

// --- Types ---
interface CourseData {
  id: number
  title: string
  age: string
  description: string
  features: string[]
  themeKey: string // "beginner" | "intermediate" | "advanced"
  popular: boolean
}

interface DynamicCoursesProps {
  courses: CourseData[]
}

export function DynamicCourses({ courses = [] }: DynamicCoursesProps) {
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  // Fallback if no courses are found
  if (!courses || courses.length === 0) {
    return null 
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D3834]/5 text-[#0D3834] text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            <span>Structured Learning Paths</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black text-[#0D3834]">
            Our Programs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether your child is just starting out or ready for advanced challenges, 
            we have a tailored curriculum designed for their success.
          </p>
        </div>

        {/* Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 relative z-10"
        >
          {courses.map((course) => {
            // Match the DB string (course.themeKey) to our THEMES object
            // Default to 'beginner' if the key is missing or typo'd
            const theme = THEMES[course.themeKey as keyof typeof THEMES] || THEMES.beginner
            const Icon = theme.icon
            
            return (
              <motion.div
                key={course.id}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className="flex flex-col relative bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden group"
              >
                {/* Popular Badge */}
                {course.popular && (
                  <div className="absolute top-0 right-0 bg-[#0D3834] text-white text-xs font-bold px-4 py-2 rounded-bl-2xl z-10">
                    MOST POPULAR
                  </div>
                )}

                {/* Decorative Top Bar */}
                <div className={`h-2 ${theme.primary} w-full`} />

                <div className="p-8 flex-1 flex flex-col">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${theme.secondary} ${theme.text}`}>
                      <Icon size={32} strokeWidth={2.5} />
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
                      {course.age}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-[#0D3834] mb-3">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    {course.description}
                  </p>
                  
                  {/* Features List */}
                  <ul className="space-y-4 mb-8 flex-1">
                    {course.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 font-medium text-sm">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${theme.text}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link href="/contact" className="mt-auto">
                    <Button 
                      className={`w-full h-14 text-base ${theme.primary} hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${theme.shadow}`}
                    >
                      Enroll Now <ArrowRight size={20} />
                    </Button>
                  </Link>
                </div>

                {/* Subtle gradient overlay on hover */}
                <div className={`absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${theme.primary}`} />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}