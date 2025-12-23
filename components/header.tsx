"use client";
import React, { useState, useEffect } from "react";

/* -------------------------------------------------------------------------- */
/*                               INTERNAL ICONS                               */
/* -------------------------------------------------------------------------- */
const ChevronDown = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const MenuIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*                                MAIN COMPONENT                              */
/* -------------------------------------------------------------------------- */

interface SubMenuItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href?: string;
  hasDropdown?: boolean;
  subMenu?: SubMenuItem[];
}

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    {
      name: "Programs",
      hasDropdown: true,
      subMenu: [
        { name: "Chess Coaching", href: "/chess" },
        { name: "Abacus Training", href: "/abacus" },
        { name: "Robotics Program", href: "/robotics" },
      ],
    },
    {
      name: "Academics",
      hasDropdown: true,
      subMenu: [
        { name: "Primary School", href: "/school" },
        { name: "Coaching Classes", href: "/coaching" },
      ],
    },
    { name: "Instructors", href: "/coaches" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="w-full relative z-50">
      
      {/* Main Navbar */}
      <header
        className={`w-full transition-all duration-300 border-b border-gray-100 ${
          scrolled 
            ? "fixed top-0 bg-white/95 backdrop-blur-md shadow-md py-2" 
            : "relative bg-white py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
  <img
    src="/image.png"
    alt="Aacharya Academy"
    className="w-10 h-10 md:w-12 md:h-12 object-contain"
  />

  <div className="flex flex-col">
    <span className="font-black text-xl md:text-2xl text-slate-900 leading-none">
      AACHARYA
    </span>
    <span className="text-[10px] md:text-xs font-bold text-yellow-600 tracking-[0.2em] uppercase">
      ACADEMY
    </span>
  </div>
</a>


          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group h-full flex items-center">
                {item.hasDropdown ? (
                  <button className="flex items-center gap-1 text-[15px] font-medium text-slate-700 group-hover:text-yellow-600 py-2 transition-colors">
                    {item.name}
                    <ChevronDown className="w-4 h-4 mt-0.5 opacity-50 group-hover:opacity-100 transition-all" />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className="text-[15px] font-medium text-slate-700 hover:text-yellow-600 py-2 transition-colors"
                  >
                    {item.name}
                  </a>
                )}

                {/* Desktop Dropdown */}
                {item.hasDropdown && (
                  <div className="absolute top-full left-0 pt-4 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                      <div className="h-1 w-full bg-yellow-400"></div> {/* Top Color Bar */}
                      {item.subMenu?.map((sub) => (
                        <a
                          key={sub.name}
                          href={sub.href}
                          className="block px-5 py-3 text-sm text-slate-600 hover:text-yellow-700 hover:bg-yellow-50 transition-colors border-b border-slate-50 last:border-0"
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Section: Button & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="/bookdemo"
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-slate-900 transition-all duration-200 bg-yellow-400 rounded-lg hover:bg-yellow-300 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none ring-offset-2 focus:ring-2 ring-yellow-400"
            >
              Book a Demo
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
            >
              <MenuIcon className="w-7 h-7" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay (Clean Side Drawer) */}
      <div 
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div 
          className={`absolute top-0 right-0 h-full w-[80%] max-w-[300px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Mobile Header */}
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <span className="font-bold text-slate-800 text-lg">Menu</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-red-500 transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.name} className="border-b border-slate-50 last:border-0 pb-2">
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setMobileSubMenuOpen(mobileSubMenuOpen === item.name ? null : item.name)}
                      className="flex items-center justify-between w-full p-3 text-left font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                      {item.name}
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-300 ${
                          mobileSubMenuOpen === item.name ? "rotate-180 text-yellow-600" : "text-slate-400"
                        }`} 
                      />
                    </button>
                    
                    {/* Mobile Submenu Animation */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        mobileSubMenuOpen === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-4 pr-2 pb-2 space-y-1">
                        {item.subMenu?.map((sub) => (
                          <a
                            key={sub.name}
                            href={sub.href}
                            className="block p-2 text-sm font-medium text-slate-500 hover:text-yellow-700 hover:bg-yellow-50 rounded-md"
                          >
                            {sub.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="block p-3 font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Footer Action */}
          <div className="p-5 border-t border-slate-100 bg-slate-50">
            <a
              href="/bookdemo"
              className="block w-full py-3 text-center text-slate-900 bg-yellow-400 font-bold rounded-lg shadow-md hover:bg-yellow-300"
            >
              Book a Free Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
