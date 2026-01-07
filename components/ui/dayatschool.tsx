"use client"

import { Sun, BookOpen, Utensils, Palette, Clock, Sparkles } from "lucide-react"

export default function DayAtSchoolSection() {
  
  const routine = [
    { 
      time: "08:30 AM", 
      icon: Sun, 
      title: "Morning Assembly", 
      desc: "Yoga, prayers, and positive affirmations to start the day.", 
      color: "text-amber-600",
      bg: "bg-amber-100",
      border: "border-amber-200"
    },
    { 
      time: "09:30 AM", 
      icon: BookOpen, 
      title: "Core Academics", 
      desc: "Math, English, and Science with interactive smart tools.", 
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-200"
    },
    { 
      time: "11:00 AM", 
      icon: Utensils, 
      title: "Healthy Snack Break", 
      desc: "Nutritious snacks to recharge energy levels.", 
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-200"
    },
    { 
      time: "12:30 PM", 
      icon: Palette, 
      title: "Creative & Sports", 
      desc: "Art, Robotics, Chess, or Outdoor Play activities.", 
      color: "text-purple-600",
      bg: "bg-purple-100",
      border: "border-purple-200"
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden relative">
      
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#f59e0b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content: Timeline */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-4">
               <Clock size={14} /> Daily Routine
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-[1.1]">
              A Day in the Life of a <br className="hidden sm:block"/>
              <span className="text-amber-500 inline-block transform hover:-rotate-2 transition-transform duration-300 cursor-default">Little Learner</span> 🎒
            </h2>
            
            <p className="text-slate-600 text-base sm:text-lg mb-8 md:mb-10 font-medium max-w-lg">
              Our routine is perfectly balanced to keep children energetic, focused, and happy throughout the day.
            </p>
            
            <div className="space-y-6 sm:pl-4">
              {routine.map((slot, i) => (
                <div key={i} className="flex gap-4 sm:gap-6 items-start relative group">
                  
                  {/* Connecting Line (Dashed) */}
                  {i !== routine.length - 1 && (
                    <div className="absolute left-[22px] sm:left-[26px] top-12 sm:top-14 bottom-[-24px] w-0.5 border-l-2 border-dashed border-slate-200 group-hover:border-amber-300 transition-colors"></div>
                  )}
                  
                  {/* Icon Circle */}
                  <div className={`
                    w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 z-10 
                    border-4 border-white shadow-md transition-all duration-300 group-hover:scale-110
                    ${slot.bg} ${slot.color}
                  `}>
                    <slot.icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                  </div>

                  {/* Text Card */}
                  <div className={`
                    flex-1 p-4 sm:p-5 rounded-2xl border bg-white shadow-sm transition-all duration-300
                    hover:shadow-md hover:-translate-y-1 ${slot.border}
                  `}>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${slot.color} bg-white/50 px-2 py-0.5 rounded-md border border-current/10`}>
                      {slot.time}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1.5 mb-1 group-hover:text-amber-600 transition-colors">
                      {slot.title}
                    </h4>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                      {slot.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content: Image Grid */}
          <div className="relative order-1 lg:order-2 mb-8 lg:mb-0">
            
            {/* Background Blob for Depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] sm:w-[120%] h-[80%] bg-amber-100/50 rounded-full blur-3xl -z-10"></div>
            
            {/* Floating Sparkle Icon */}
            <div className="absolute -top-4 -right-2 sm:-top-8 sm:-right-8 text-amber-400 animate-pulse">
                <Sparkles size={40} className="sm:w-12 sm:h-12" />
            </div>

            {/* Grid with responsive heights */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              <div className="space-y-3 sm:space-y-5">
                <img 
                  src="/assembly.jpeg" 
                  className="rounded-2xl sm:rounded-3xl shadow-lg hover:scale-[1.03] transition-transform border-2 sm:border-4 border-white object-cover h-32 sm:h-48 lg:h-56 w-full" 
                  alt="Classroom" 
                />
                <img 
                  src="/core.jpeg" 
                  className="rounded-2xl sm:rounded-3xl shadow-lg hover:scale-[1.03] transition-transform border-2 sm:border-4 border-white object-cover h-40 sm:h-56 lg:h-64 w-full" 
                  alt="Art Class" 
                />
              </div>
              <div className="space-y-3 sm:space-y-5 pt-6 sm:pt-10">
                <img 
                  src="/food.jpeg" 
                  className="rounded-2xl sm:rounded-3xl shadow-lg hover:scale-[1.03] transition-transform border-2 sm:border-4 border-white object-cover h-40 sm:h-56 lg:h-64 w-full" 
                  alt="Playground" 
                />
                <img 
                  src="creative.jpeg" 
                  className="rounded-2xl sm:rounded-3xl shadow-lg hover:scale-[1.03] transition-transform border-2 sm:border-4 border-white object-cover h-32 sm:h-48 lg:h-56 w-full" 
                  alt="Library" 
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}