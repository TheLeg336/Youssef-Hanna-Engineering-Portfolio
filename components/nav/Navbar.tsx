'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, FileText, ArrowUpRight, Sparkles } from 'lucide-react';
import { PERSONAL_INFO } from '@/lib/portfolio-data';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('projects');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const navLinks = [
    { id: 'projects', label: 'Work', href: isHomePage ? '#projects' : '/#projects' },
    { id: 'philosophy', label: 'Philosophy', href: isHomePage ? '#philosophy' : '/#philosophy' },
    { id: 'about', label: 'About', href: isHomePage ? '#about' : '/#about' },
    { id: 'skills', label: 'Skills', href: isHomePage ? '#skills' : '/#skills' },
    { id: 'experience', label: 'Experience', href: isHomePage ? '#experience' : '/#experience' },
    { id: 'contact', label: 'Contact', href: isHomePage ? '#contact' : '/#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (isHomePage) {
        const sections = ['projects', 'philosophy', 'about', 'skills', 'experience', 'contact'];
        const scrollPosition = window.scrollY + 200;

        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && el.offsetTop <= scrollPosition) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-4 pointer-events-none flex justify-center">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        className={`pointer-events-auto h-11 sm:h-12 transition-[background-color,border-color,box-shadow] duration-200 rounded-full px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-6 w-full max-w-[820px] ${
          isScrolled
            ? 'glass-dock shadow-xl border-[#178BFF]/15'
            : 'glass-panel border-black/5 shadow-md'
        }`}
      >
        {/* Left: Brand Monogram & Easter Egg */}
        <div className="relative shrink min-w-0">
          <Link
            href="/"
            onClick={() => {
              setShowEasterEgg(true);
              setTimeout(() => setShowEasterEgg(false), 2600);
            }}
            onMouseEnter={() => setShowEasterEgg(true)}
            onMouseLeave={() => setShowEasterEgg(false)}
            className="flex items-center gap-2 sm:gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] rounded-full p-1 -m-1 min-w-0"
            aria-label="Youssef Hanna Home"
          >
            {/* Precision Monogram Pill */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-b from-white to-[#F1F5F9] border border-[#CBD5E1] flex items-center justify-center group-hover:border-[#178BFF] group-hover:shadow-xs group-hover:shadow-[#178BFF]/25 transition-all relative overflow-hidden shadow-xs shrink-0">
              {/* Precision aerospace crosshair reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-full h-px bg-[#0864C7]" />
                <div className="h-full w-px bg-[#0864C7] absolute" />
              </div>
              <span className="font-mono text-[10px] sm:text-[11px] font-black tracking-tight text-[#17202A] group-hover:text-[#0864C7] transition-colors relative z-10 select-none">
                YH
              </span>
            </div>

            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs sm:text-sm font-bold tracking-tight text-[#17202A] group-hover:text-[#0864C7] transition-colors whitespace-nowrap truncate">
                Youssef Hanna
              </span>
              <span className="text-[10px] font-mono text-[#647184] hidden lg:inline">
                Mechanical Engineering · Cal Poly Pomona
              </span>
            </div>
          </Link>

          {/* Easter Egg Tooltip on Monogram (desktop only) */}
          <AnimatePresence>
            {showEasterEgg && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="absolute top-12 left-0 z-50 px-3 py-1.5 rounded-lg bg-white text-[10px] font-mono text-[#0864C7] border border-[#178BFF]/30 shadow-xl whitespace-nowrap flex items-center gap-1.5 pointer-events-none hidden sm:flex"
              >
                <Sparkles className="w-3 h-3 text-[#178BFF]" />
                <span>DESIGN · BUILD · TEST · ITERATE</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: Fluid Navigation Pills (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center gap-1 relative shrink-0" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = isHomePage && activeSection === link.id;

            return (
              <a
                key={link.id}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] ${
                  isActive ? 'text-[#0864C7] font-bold' : 'text-[#647184] hover:text-[#17202A]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded-full bg-[#EAF5FF] border border-[#178BFF]/25 shadow-xs"
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: Resume Pill & Mobile Menu Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <a
            href={PERSONAL_INFO.resumePath}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-pill px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold text-[#17202A] inline-flex items-center gap-1 sm:gap-1.5 hover:text-[#0864C7] hover:border-[#178BFF]/40 transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-[#178BFF] shrink-0" />
            <span className="font-semibold text-xs">Resume</span>
            <ArrowUpRight className="w-3 h-3 text-[#647184] shrink-0 hidden sm:inline" />
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden glass-pill p-1.5 rounded-full text-[#647184] hover:text-[#17202A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] shrink-0 flex items-center justify-center"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-16 left-4 right-4 max-w-md mx-auto glass-dock rounded-2xl p-4 space-y-3 shadow-2xl border-[#CBD5E1]"
          >
            <div className="text-[10px] font-mono text-[#0864C7] font-semibold px-2 uppercase tracking-wider">
              {PERSONAL_INFO.internshipGoal}
            </div>

            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-[#17202A] hover:bg-[#F1F5F9] transition-colors"
                >
                  {link.label}
                </a>
              ))}

              <a
                href={PERSONAL_INFO.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-[#EAF5FF] text-[#0864C7] border border-[#178BFF]/30 mt-2"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#178BFF]" />
                  Download Resume PDF
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#0864C7]" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
export default Navbar;
