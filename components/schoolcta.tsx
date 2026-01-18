"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Sparkles, CheckCircle, Video } from "lucide-react"
import Link from "next/link"

export default function PrimaryCTA() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-6xl mx-auto">
        
        {/* ------------------- SCHOOL TOUR VIDEO SECTION ------------------- */}
        <div className="mb-16 md:mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-6">
            <Video size={14} className="text-amber-600" /> Virtual Experience
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
            Take a <span className="text-amber-500 italic">Virtual Tour</span> 🎥
          </h2>
          
          <p className="text-slate-500 font-bold text-base md:text-xl max-w-2xl mx-auto mb-10 md:mb-12">
            Step inside Aacharya and witness the joy of learning. Witness the premium 
            infrastructure designed for your child's growth.
          </p>

          {/* Video Container - Optimized for Silent Autoplay */}
          <div className="relative group max-w-5xl mx-auto">
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-amber-100/50 rounded-[2.5rem] md:rounded-[4rem] blur-2xl group-hover:bg-amber-200/50 transition-colors duration-500"></div>
            
            <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] md:rounded-[3.5rem] border-[6px] md:border-[12px] border-white shadow-2xl bg-slate-100 transition-transform duration-500 group-hover:scale-[1.01]">
              <video 
                className="w-full h-full object-cover"
                src="/tour.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline 
                poster="/pic15.webp" // Optional: shows this image while video loads
              >
                Your browser does not support the video tag.
              </video>

              {/* Silent Overlay Badge */}
              <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
                <div className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-2">
                   <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                   <span className="text-[10px] text-white font-black uppercase tracking-widest">Live Tour</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* ------------------- MAIN CTA CARD ------------------- */}
        <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 shadow-2xl shadow-orange-200 group transition-all duration-500 hover:scale-[1.01]">
          
          {/* Animated Background Decor */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-rose-400/30 rounded-full blur-3xl"></div>

          <div className="relative z-10 p-8 sm:p-12 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
            
            {/* LEFT SIDE: TEXT & TRUST BADGES */}
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] backdrop-blur-sm">
                <Sparkles size={14} className="fill-white" /> Admissions 2026-27
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter">
                Ready to Spark Your <br className="hidden sm:block"/> 
                Child's <span className="text-yellow-300 italic">Genius?</span>
              </h2>
              
              <p className="text-amber-50 text-base md:text-xl font-bold opacity-90 leading-relaxed">
                Join our community where every day is a new adventure in learning. 
                Limited seats available for early years.
              </p>
              
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center lg:justify-start gap-3 pt-2">
                 <div className="flex items-center justify-center gap-2 bg-black/10 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] md:text-xs font-black text-white uppercase tracking-wider border border-white/10">
                   <CheckCircle size={14} className="text-yellow-300" /> International Blended Curriculam
                 </div>
                 <div className="flex items-center justify-center gap-2 bg-black/10 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] md:text-xs font-black text-white uppercase tracking-wider border border-white/10">
                   <CheckCircle size={14} className="text-yellow-300" /> No Donation
                 </div>
              </div>
            </div>

            {/* RIGHT SIDE: INTERACTIVE BUTTONS */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 w-full lg:w-auto">
  
  <Link href="/bookdemo" className="w-full lg:w-auto">
    <Button className="h-14 md:h-16 px-10 bg-white text-orange-700 hover:bg-slate-900 hover:text-white font-black text-base md:text-lg rounded-2xl shadow-xl transition-all duration-300 group/btn w-full lg:w-auto">
      Apply Online
      <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
    </Button>
  </Link>

  <Link href="/bookdemo" className="w-full lg:w-auto">
    <Button
      variant="outline"
      className="h-14 md:h-16 px-10 bg-transparent border-4 border-white text-white font-black text-base md:text-lg rounded-2xl hover:bg-white hover:text-orange-700 transition-all duration-300 w-full lg:w-auto"
    >
      <Calendar className="mr-2 w-5 h-5" />
      Book a Tour
    </Button>
  </Link>

</div>

          </div>

          <div className="absolute bottom-0 right-0 p-4 opacity-20 hidden lg:block">
            <Sparkles size={120} className="text-white" />
          </div>
        </div>

      </div>
    </section>
  )
}