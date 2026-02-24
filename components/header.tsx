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
    { name: "About Us", href: "/about" },
    {
      name: "Programs Offered",
      hasDropdown: true,
      subMenu: [
        { name: "Pre School", href: "/pre-school" },
        { name: "Chess Coaching", href: "/chess-academy" },
        { name: "Abacus Training", href: "/abacus-training" },
        { name: "Robotics, AI & IOT", href: "/robotics-center" },
        { name: "Tuition Point", href: "/tuition-center" },
      ],
    },
    { name: "Gallery", href: "/gallery" },
    { name: "Find Tutor", href: "/find-tutor-nearby" },
    { name: "Events", href: "/events" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="w-full relative z-50">

      {/* Main Navbar */}
      <header
        className={`w-full transition-all duration-300 border-b border-gray-100 ${scrolled
          ? "fixed top-0 bg-white/95 backdrop-blur-md shadow-md py-2"
          : "relative bg-white py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">

          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/image.png"
              alt="Aacharya Academy"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-black text-xl md:text-2xl text-slate-900 leading-none">
                AACHARYA
              </span>
              <span className="text-[9px] md:text-[11px] font-bold text-slate-500 tracking-[0.12em] mt-1 uppercase">
                Bhavanipuram, Vijayawada
              </span>
            </div>
          </a>

          {/* Desktop Nav - ADJUSTED SPACING (gap-12) */}
          <nav className="hidden lg:flex items-center gap-12">
            {navItems.map((item) => (
              <div key={item.name} className="relative group h-full flex items-center">
                {item.hasDropdown ? (
                  <button className="flex items-center gap-1.5 text-[15px] font-semibold text-slate-700 group-hover:text-yellow-600 py-2 transition-colors">
                    {item.name}
                    <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-all" />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className="text-[15px] font-semibold text-slate-700 hover:text-yellow-600 py-2 transition-colors"
                  >
                    {item.name}
                  </a>
                )}

                {/* Desktop Dropdown Spacing */}
                {item.hasDropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                      <div className="h-1 w-full bg-yellow-400" />
                      {item.subMenu?.map((sub) => (
                        <a
                          key={sub.name}
                          href={sub.href}
                          className="block px-5 py-3.5 text-sm font-medium text-slate-600 hover:text-yellow-700 hover:bg-yellow-50 transition-colors border-b border-slate-50 last:border-0"
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

          {/* Right Section Spacing */}
          <div className="flex items-center gap-4">
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-red-600 transition-all duration-200 border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50"
              >
                Logout
              </button>
            ) : (
              <a
                href="/signup"
                className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-slate-700 transition-all duration-200 border-2 border-slate-200 rounded-lg hover:border-yellow-400 hover:text-yellow-600"
              >
                Sign Up
              </a>
            )}
            <a
              href="/bookdemo"
              className="hidden md:inline-flex items-center justify-center px-8 py-2.5 text-sm font-bold text-slate-900 transition-all duration-200 bg-yellow-400 rounded-lg hover:bg-yellow-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              Enroll Now
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

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>

          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <span className="font-bold text-slate-800 text-lg">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {navItems.map((item) => (
              <div key={item.name} className="border-b border-slate-50 last:border-0 pb-4">
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setMobileSubMenuOpen(mobileSubMenuOpen === item.name ? null : item.name)}
                      className="flex items-center justify-between w-full text-left font-bold text-slate-700"
                    >
                      {item.name}
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileSubMenuOpen === item.name ? "rotate-180 text-yellow-600" : "text-slate-400"}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${mobileSubMenuOpen === item.name ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                      <div className="pl-4 space-y-3">
                        {item.subMenu?.map((sub) => (
                          <a key={sub.name} href={sub.href} className="block text-sm font-semibold text-slate-500 hover:text-yellow-700">
                            {sub.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <a href={item.href} className="block font-bold text-slate-700">
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
            <div className="flex gap-3">
              {session ? (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex-1 py-3 text-center text-red-600 font-bold border-2 border-red-200 rounded-xl hover:border-red-400 hover:bg-red-50"
                >
                  Logout
                </button>
              ) : (
                <a href="/signup" className="flex-1 py-3 text-center text-slate-700 font-bold border-2 border-slate-200 rounded-xl hover:border-yellow-400">
                  Sign Up
                </a>
              )}
            </div>
            <a href="/bookdemo" className="block w-full py-4 text-center text-slate-900 bg-yellow-400 font-black rounded-xl shadow-md">
              Enroll Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;