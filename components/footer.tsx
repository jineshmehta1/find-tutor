"use client";
import React from "react";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                DOODLE ICONS                                */
/* -------------------------------------------------------------------------- */

const ChessKnightDoodle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M19 22H5V20H19V22ZM17 18H7V16H17V18ZM15.5 14H8.5L7.5 8H9.5C9.5 8 10 9.5 11 9.5C12 9.5 13 8 13 8H16L15.5 14ZM12 2C10.5 2 9.5 3 9 4L8 6H13C14.5 6 15 5 15.5 4C16 3 14 2 12 2Z" />
    <path d="M12 4C14 4 15 5 15 6L14 12H10L9 6C10 5 11 4 12 4Z" opacity="0.5"/>
  </svg>
);

const ChessPawnDoodle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M16 22H8V20H16V22ZM14 18H10V14.5C10 14.5 8 12 8 10C8 7.5 9.5 6 12 6C14.5 6 16 7.5 16 10C16 12 14 14.5 14 14.5V18Z" />
    <circle cx="12" cy="4" r="2.5" />
  </svg>
);

const StarDoodle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*                               FOOTER COMPONENT                             */
/* -------------------------------------------------------------------------- */

export default function Footer() {
  return (
    <footer className="relative bg-slate-900 text-slate-300 overflow-hidden pt-16 pb-8">
      
      {/* -------------------- BACKGROUND DOODLES -------------------- */}
      {/* These are absolute positioned icons to create the 'kid/chess' texture */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Top Right Knight */}
        <ChessKnightDoodle className="absolute -top-10 -right-10 w-48 h-48 text-slate-800/50 rotate-12" />
        
        {/* Bottom Left Pawn */}
        <ChessPawnDoodle className="absolute -bottom-10 -left-10 w-40 h-40 text-slate-800/50 -rotate-12" />
        
        {/* Random Stars/Sparkles */}
        <StarDoodle className="absolute top-20 left-[20%] w-8 h-8 text-yellow-400/20 animate-pulse" />
        <StarDoodle className="absolute bottom-32 right-[20%] w-6 h-6 text-yellow-400/20" />
        <ChessKnightDoodle className="absolute bottom-20 left-[40%] w-12 h-12 text-slate-800 rotate-[30deg]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* 1. BRAND INFO */}
          <div className="space-y-6">
            <a href="/" className="flex items-center gap-3 group">
              {/* Using a placeholder for the image to match your header */}
              <img
                src="/image.png"
                alt="Aacharya Academy"
                className="w-12 h-12 object-contain bg-white rounded-full p-1"
              />
              <div className="flex flex-col">
                <span className="font-black text-2xl text-white leading-none tracking-tight">
                  AACHARYA
                </span>
                <span className="text-[10px] font-bold text-yellow-400 tracking-[0.2em] uppercase">
                  ACADEMY
                </span>
              </div>
            </a>
            <p className="text-sm leading-relaxed text-slate-400">
              Empowering young minds through academic excellence, strategic chess mastery, and creative robotics. Building the leaders of tomorrow.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-yellow-400 hover:text-slate-900 transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* 2. QUICK LINKS */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-yellow-400 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "/about" },
                { name: "Our Instructors", href: "/coaches" },
                { name: "Success Stories", href: "/gallery" },
                { name: "Admission Process", href: "/admissions" },
                { name: "Book a Demo", href: "/bookdemo" },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="flex items-center gap-2 text-sm hover:text-yellow-400 transition-colors group"
                  >
                    <ArrowRight className="w-3 h-3 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. PROGRAMS */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-yellow-400 rounded-full"></span>
              Programs
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Primary School (CBSE)", href: "/school" },
                { name: "Chess Coaching", href: "/chess" },
                { name: "Abacus Maths", href: "/abacus" },
                { name: "Robotics & AI", href: "/robotics" },
                { name: "Summer Camps", href: "/camps" },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="flex items-center gap-2 text-sm hover:text-yellow-400 transition-colors group"
                  >
                    <ArrowRight className="w-3 h-3 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. CONTACT */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-yellow-400 rounded-full"></span>
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <span>
                  Lalitha Nagar Road, Swathi Theatre Rd, opposite Indrakeeladri Apartment, near Sivalayam Center, Chittinagar, Bhavanipuram, V D Puram, Vijayawada, Andhra Pradesh 520012
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-yellow-400 shrink-0" />
                <span>+91 80741 03400</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-yellow-400 shrink-0" />
                <span>admissions@aacharya.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Aacharya Academy. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}