"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

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
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "Find Tutor", href: "/find-tutor-nearby" },
    { name: "Reviews", href: "/reviews" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="w-full relative z-50">
      <header
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "fixed top-0 glass-header shadow-sm py-2.5"
            : "relative bg-white/40 backdrop-blur-md py-2.5 md:py-3.5 border-b border-slate-100/50"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Logo Section */}
          <a href="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/image.png" // Ensure this path is correct
              alt="Aacharya Academy"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl md:text-2xl text-[#1a1a1a] tracking-tight leading-none">
                AACHARYA
              </span>
              <span className="text-[9px] md:text-[10px] font-bold text-slate-500 tracking-[0.1em] mt-0.5 uppercase">
                Bhavanipuram, Vijayawada
              </span>
            </div>
          </a>

          {/* Desktop Navigation - Hidden below XL (1280px) to prevent crowding */}
          <nav className="hidden xl:flex items-center gap-8 2xl:gap-10">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.hasDropdown ? (
                  <button className="flex items-center gap-1 text-[15px] font-semibold text-slate-700 hover:text-primary transition-colors">
                    {item.name}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className="text-[15px] font-bold text-slate-700 hover:text-primary transition-all duration-200 nav-link-hover py-1"
                  >
                    {item.name}
                  </a>
                )}

                {/* Dropdown Menu */}
                {item.hasDropdown && (
                  <div className="absolute top-full left-0 pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                      {item.subMenu?.map((sub) => (
                        <a
                          key={sub.name}
                          href={sub.href}
                          className="block px-5 py-3 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
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

          {/* Right Section: Buttons */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-5 py-2.5 text-sm font-bold text-red-600 border border-red-100 rounded-xl hover:bg-red-50 transition-all"
                >
                  Logout
                </button>
              ) : (
                <a
                  href="/signup"
                  className="px-6 py-2.5 text-[15px] font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                >
                  Sign Up
                </a>
              )}
              <a
                href="/request-tutor"
                className="px-7 py-2.5 text-[15px] font-bold text-white bg-primary hover:bg-primary/95 rounded-xl shadow-md shadow-primary/10 transition-all hover:scale-102"
              >
                Request a Tutor
              </a>
            </div>

            {/* Mobile Hamburger - Visible below XL */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="xl:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <MenuIcon className="w-8 h-8" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[100] xl:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <span className="font-bold text-slate-900">Navigation</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-1">
            {navItems.map((item) => (
              <div key={item.name} className="py-2">
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setMobileSubMenuOpen(mobileSubMenuOpen === item.name ? null : item.name)}
                      className="flex items-center justify-between w-full text-left font-semibold text-slate-700 py-2"
                    >
                      {item.name}
                      <ChevronDown className={`w-5 h-5 transition-transform ${mobileSubMenuOpen === item.name ? "rotate-180 text-primary" : ""}`} />
                    </button>
                    <div className={`pl-4 overflow-hidden transition-all duration-300 ${mobileSubMenuOpen === item.name ? "max-h-60 mt-2" : "max-h-0"}`}>
                      {item.subMenu?.map((sub) => (
                        <a key={sub.name} href={sub.href} className="block py-2.5 text-sm font-medium text-slate-500 hover:text-primary">
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  </>
                ) : (
                  <a href={item.href} className="block py-2 font-semibold text-slate-700 hover:text-primary">
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="p-5 border-t border-slate-100 bg-slate-50 gap-3 flex flex-col">
            <a href="/signup" className="w-full py-3 text-center text-slate-700 font-bold border border-slate-200 rounded-xl bg-white shadow-sm">
              Sign Up
            </a>
            <a href="/request-tutor" className="w-full py-3 text-center text-white bg-primary font-bold rounded-xl shadow-md">
              Request a Tutor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
