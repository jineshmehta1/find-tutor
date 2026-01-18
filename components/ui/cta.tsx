"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, ArrowRight, Navigation, Clock, Car, Mail } from 'lucide-react';

const VisitCampusCTA: React.FC = () => {
  const address = "Lalitha Nagar Road, Swathi Theatre Rd, Bhavanipuram, Vijayawada, Andhra Pradesh 520012";
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section className="relative py-16 md:py-24 bg-[#0f172a] overflow-hidden font-sans">
      
      {/* --- Background Textures --- */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'repeating-linear-gradient(45deg, #334155 0px, #334155 1px, transparent 1px, transparent 40px), repeating-linear-gradient(-45deg, #334155 0px, #334155 1px, transparent 1px, transparent 40px)' 
           }}>
      </div>
      
      {/* Golden Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[800px] h-[400px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12 relative overflow-hidden">
          
          {/* Decorative Circle */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/20 rounded-full blur-[60px]"></div>

          {/* --- Left: Text Content --- */}
          <div className="w-full lg:w-3/5 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6">
              <MapPin className="w-3.5 h-3.5" />
              <span>Visit Us in Vijayawada</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Experience the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
                Aacharya Atmosphere.
              </span>
            </h2>
            
            <div className="space-y-4 mb-8">
                <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto lg:mx-0 font-medium">
                Walk through our Robotics Labs, see our Chess Arenas, and meet the faculty. 
                We invite you to experience our world-class facilities firsthand.
                </p>
                <div className="flex items-start justify-center lg:justify-start gap-2 text-amber-100/70 italic text-sm md:text-base">
                    <MapPin className="w-5 h-5 shrink-0 text-amber-500" />
                    <p>{address}</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/book-demo" className="w-full sm:w-auto">
                <button className="w-full group bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:-translate-y-1">
                  <Calendar className="w-5 h-5" />
                  Schedule a Visit
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <a href={mapLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <button className="w-full group bg-transparent border border-slate-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                  <Navigation className="w-5 h-5 text-amber-500" />
                  Get Directions
                </button>
              </a>
            </div>
          </div>

          {/* --- Right: Visual / Map Graphic --- */}
          <div className="w-full lg:w-2/5 relative">
            <a href={mapLink} target="_blank" rel="noopener noreferrer">
                <div className="relative aspect-square md:aspect-video lg:aspect-square bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl group cursor-pointer">
                
                {/* Visual Map Placeholder */}
                <div className="absolute inset-0 bg-slate-800">
                    <div className="absolute top-4 left-0 w-full h-2 bg-slate-700/50 transform -rotate-12"></div>
                    <div className="absolute top-20 left-0 w-full h-4 bg-slate-700/50 transform -rotate-12"></div>
                    <div className="absolute bottom-10 left-0 w-full h-3 bg-slate-700/50 transform rotate-45"></div>
                    
                    {/* Pin Location */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="relative">
                        <div className="w-4 h-4 bg-amber-500 rounded-full animate-ping absolute inset-0"></div>
                        <div className="w-4 h-4 bg-amber-500 rounded-full relative z-10 border-2 border-white"></div>
                        </div>
                        <div className="bg-white px-3 py-1 rounded-lg shadow-lg mt-2 transform transition-transform group-hover:scale-110">
                        <span className="text-xs font-bold text-slate-900">Aacharya Vijayawada</span>
                        </div>
                    </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-bold flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-amber-500" />
                        Open Google Maps
                    </span>
                </div>
                </div>
            </a>
          </div>

        </div>

        {/* --- Bottom Info Strip --- */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center border-t border-white/10 pt-8">
           <div className="flex flex-col items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Visiting Hours</p>
              <p className="text-white font-medium text-sm md:text-base">Mon - Sat: 9 AM - 7 PM</p>
           </div>
           <div className="flex flex-col items-center gap-2">
              <Car className="w-5 h-5 text-amber-500" />
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Parking</p>
              <p className="text-white font-medium text-sm md:text-base">Safe In-Campus Parking</p>
           </div>
           <div className="flex flex-col items-center gap-2">
              <Mail className="w-5 h-5 text-amber-500" />
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Admissions</p>
              <p className="text-white font-medium text-sm md:text-base">info@aacharya.com</p>
           </div>
        </div>

      </div>
    </section>
  );
};

export default VisitCampusCTA;