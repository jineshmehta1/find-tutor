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

// WhatsApp Icon SVG
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*                               FOOTER COMPONENT                             */
/* -------------------------------------------------------------------------- */

export default function Footer() {
  return (
    <footer className="relative bg-slate-900 text-slate-300 overflow-hidden pt-16 pb-8">
      
      {/* -------------------- FLOATING WHATSAPP BUTTON -------------------- */}
      <a
        href="https://wa.me/918074103400"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-[100] group flex items-center justify-center"
      >
        {/* Animated Pulse Circles */}
        <span className="absolute w-full h-full bg-green-500 rounded-full animate-ping opacity-25"></span>
        <span className="absolute w-14 h-14 bg-green-500 rounded-full animate-pulse opacity-40"></span>
        
        {/* Main Icon Button */}
        <div className="relative w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(37,211,102,0.4)] transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          <WhatsAppIcon className="w-8 h-8" />
          
          {/* Tooltip on Hover */}
          <span className="absolute right-16 bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap">
            Chat with us!
            <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></span>
          </span>
        </div>
      </a>

      {/* -------------------- BACKGROUND DOODLES -------------------- */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <ChessKnightDoodle className="absolute -top-10 -right-10 w-48 h-48 text-slate-800/50 rotate-12" />
        <ChessPawnDoodle className="absolute -bottom-10 -left-10 w-40 h-40 text-slate-800/50 -rotate-12" />
        <StarDoodle className="absolute top-20 left-[20%] w-8 h-8 text-yellow-400/20 animate-pulse" />
        <StarDoodle className="absolute bottom-32 right-[20%] w-6 h-6 text-yellow-400/20" />
        <ChessKnightDoodle className="absolute bottom-20 left-[40%] w-12 h-12 text-slate-800 rotate-[30deg]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* 1. BRAND INFO */}
          <div className="space-y-6">
            <a href="/" className="flex items-center gap-3 group">
              <img
                src="/image.png"
                alt="Aacharya Academy"
                className="w-12 h-12 object-contain bg-white rounded-full p-1"
              />
              <div className="flex flex-col">
                <span className="font-black text-2xl text-white leading-none tracking-tight">
                  AACHARYA
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
                { name: "Success Stories", href: "/gallery" },
                { name: "Contact Us", href: "/contact" },
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
                { name: "Pre Primary School", href: "/school" },
                { name: "Chess Coaching", href: "/chess" },
                { name: "Abacus Maths", href: "/abacus" },
                { name: "Robotics, AI & IOT", href: "/robotics" },
                { name: "Tution Point", href: "/coaching" },
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
                  Lalitha Nagar Road, Swathi Theatre Rd, Bhavanipuram, Vijayawada, Andhra Pradesh 520012
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
          <p>© {new Date().getFullYear()} Aacharya. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}