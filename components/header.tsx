"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "Find Tutors", href: "/find-tutor-nearby" },
    { name: "Find Coaches", href: "/find-tutor-nearby?type=coach" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
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
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src="/image.png"
              alt="Aacharya Academy"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-black text-xl md:text-2xl text-[#0f223a] tracking-tight leading-none uppercase">
                AACHARYA
              </span>
              <span className="text-[8px] md:text-[9px] font-black text-amber-500 tracking-wider mt-0.5 uppercase">
                FIND TUTORS NEARBY
              </span>
            </div>
          </a>

          {/* Desktop Navigation - Hidden below XL (1280px) to prevent crowding */}
          <nav className="hidden xl:flex items-center gap-8 2xl:gap-10">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href?.split("?")[0] || ""));
              return (
                <div key={item.name} className="relative group">
                  {item.hasDropdown ? (
                    <button className="flex items-center gap-1 text-[15px] font-bold text-slate-700 hover:text-primary transition-colors">
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className={`text-[15px] font-bold py-1.5 transition-all duration-200 relative ${
                        isActive
                          ? "text-amber-500 border-b-2 border-amber-500"
                          : "text-slate-700 hover:text-amber-500"
                      }`}
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
              );
            })}
          </nav>

          {/* Right Section: Buttons */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <>
                  <a
                    href={
                      session.user.role === "ADMIN"
                        ? "/admin"
                        : session.user.role === "TEACHER"
                        ? "/teacher"
                        : "/student"
                    }
                    className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-amber-500 transition-all flex items-center gap-1.5"
                  >
                    Dashboard
                  </a>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-4 py-2 text-sm font-bold text-red-600 border border-red-100 rounded-xl hover:bg-red-50 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="px-4 py-2 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-amber-500 transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-slate-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <span>Login</span>
                  </a>
                  <a
                    href="/signup"
                    className="px-5 py-2 text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm transition-all hover:scale-102 flex items-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-slate-950">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                    </svg>
                    <span>Sign Up</span>
                  </a>
                </>
              )}
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
