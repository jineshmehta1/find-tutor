"use client";

import React from 'react';
import { MapPin, Navigation, ExternalLink, Sparkles } from 'lucide-react';

const MapSection: React.FC = () => {
  // Correct Details for Bhavanipuram Hub
  const businessName = "Aacharya-Pre School-Chess Academy-Abacus-Robotics-Tuition Point";
  const address = "Opposite Indrakeeladri Apartment, Lalitha Nagar, Swathi Theatre Rd, Near Sivalayam Center, Bhavanipuram, Vijayawada, 520012";
  const googleMapsLink = "https://maps.app.goo.gl/bDM9RyyYgaUD7M627";

  return (
    <section className="py-20 bg-white" id="location">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* --- Header --- */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exact Location</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Visit Our <span className="text-amber-500">Vijayawada Hub</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            {businessName}
          </p>
        </div>

        {/* --- Map Container --- */}
        <div className="relative w-full h-[500px] md:h-[650px] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border-[10px] md:border-[16px] border-slate-50 shadow-2xl">
          
          {/* --- CORRECTED VIJAYAWADA EMBED --- */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.21175647313!2d80.59560447591605!3d16.51544482733919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35efe8474cbea9%3A0xa3e687823766f2b2!2sAacharya-Pre%20School-Chess%20Academy-Abacus-Robotics-Tuition%20Point-Bhavanipuram!5e0!3m2!1sen!2sin!4v1715632452312!5m2!1sen!2sin"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Aacharya Bhavanipuram Vijayawada"
            className="contrast-[1.05]"
          ></iframe>

          {/* --- Floating Address Card --- */}

        </div>
      </div>
    </section>
  );
};

export default MapSection;