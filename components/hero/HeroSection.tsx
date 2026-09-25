'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, FileText, Github, Mail, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from '@/lib/portfolio-data';
import { AbstractAssemblyVisual } from './AbstractAssemblyVisual';
import { AppBorderBeam } from '@/components/ui/LibrariesDevWrapper';

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="relative pt-36 sm:pt-40 lg:pt-44 pb-12 sm:pb-16 overflow-hidden">
      {/* Background ambient pale aerospace blue lighting */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#178BFF]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center"
        >
          {/* LEFT COLUMN: Identity / Metadata Rail / Headline / CTA (~7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Restrained Single Glass Metadata Rail */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
              <div className="inline-flex flex-wrap items-center gap-2 sm:gap-2.5 p-1 sm:p-1.5 rounded-full glass-panel border border-black/5 text-xs font-mono shadow-xs">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#178BFF]/10 text-[#0864C7] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#178BFF] animate-pulse" />
                  <span>Seeking Summer 2027 Engineering Internship</span>
                </span>
                <span className="text-[#94A3B8] hidden md:inline">·</span>
                <span className="px-2 text-[#475569] font-medium hidden md:inline">
                  Mechanical Engineering · Cal Poly Pomona · <strong className="text-[#0864C7] font-bold">GPA 3.74</strong> · Expected May 2028
                </span>
              </div>
              {/* Mobile academic line fallback */}
              <div className="md:hidden glass-pill px-3 py-1 rounded-full text-xs font-mono text-[#475569] shadow-xs">
                Mechanical Engineering · Cal Poly Pomona · <strong className="text-[#0864C7]">GPA 3.74</strong> · 2028
              </div>
            </motion.div>

            {/* Eyebrow & Headline */}
            <motion.div variants={itemVariants} className="space-y-2.5">
              <div className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.14em] text-[#52657A] font-semibold">
                YOUSSEF HANNA · MECHANICAL ENGINEERING
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] xl:text-[66px] font-black tracking-[-0.035em] text-[#0F1E31] leading-[1.02] text-balance">
                From CAD to hardware,
                <br />
                I build systems
                <br />
                that have to work.
              </h1>
            </motion.div>

            {/* Concise 2-3 Line Natural Intro */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-[620px]"
            >
              I&apos;m Youssef Hanna, a junior Mechanical Engineering student at Cal Poly Pomona focused
              on aerospace, hands-on design, prototyping, embedded systems, and real-world testing.
            </motion.p>

            {/* Clean Non-Pill Focus Line */}
            <motion.div variants={itemVariants} className="pt-1">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs sm:text-sm text-[#334155]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold mr-1">
                  FOCUS:
                </span>
                <span className="font-medium text-[#1E293B]">Aerospace</span>
                <span className="text-[#94A3B8]">·</span>
                <span className="font-medium text-[#1E293B]">Mechanical Design</span>
                <span className="text-[#94A3B8]">·</span>
                <span className="font-medium text-[#1E293B]">Mechatronics</span>
                <span className="text-[#94A3B8]">·</span>
                <span className="font-medium text-[#1E293B]">Robotics</span>
                <span className="text-[#94A3B8]">·</span>
                <span className="font-medium text-[#1E293B]">Autonomous Systems</span>
              </div>
            </motion.div>

            {/* Action Row */}
            <motion.div
              variants={itemVariants}
              className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              {/* PRIMARY: Explore Work */}
              <AppBorderBeam colorVariant="aurora" size="md" className="rounded-full shadow-lg">
                <a
                  href="#projects"
                  className="liquid-glass-btn-primary px-6 sm:px-7 py-3 rounded-full text-white text-xs sm:text-sm font-mono font-bold inline-flex items-center gap-2.5 active:scale-95 cursor-pointer"
                >
                  <span>Explore Work</span>
                  <ArrowDown className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
                </a>
              </AppBorderBeam>

              {/* SECONDARY: Resume PDF */}
              <a
                href={PERSONAL_INFO.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass-btn-neutral px-5 py-3 rounded-full text-xs sm:text-sm font-mono font-semibold text-[#17202A] hover:text-[#0864C7] inline-flex items-center gap-2 active:scale-95"
              >
                <FileText className="w-4 h-4 text-[#178BFF]" />
                <span>Resume PDF</span>
              </a>

              {/* TERTIARY: Email Direct */}
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="liquid-glass-btn-neutral px-4 py-3 rounded-full text-xs font-mono text-[#475569] hover:text-[#17202A] inline-flex items-center gap-2 active:scale-95"
                aria-label="Email Youssef directly"
              >
                <Mail className="w-4 h-4 text-[#178BFF]" />
                <span>Email</span>
              </a>

              {/* SUPPORTING: GitHub */}
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass-btn-neutral px-3.5 py-3 rounded-full text-xs font-mono text-[#647184] hover:text-[#0864C7] inline-flex items-center gap-1.5 active:scale-95"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4 text-[#178BFF]" />
                <span className="hidden sm:inline">GitHub</span>
                <ExternalLink className="w-2.5 h-2.5 text-[#94A3B8]" />
              </a>
            </motion.div>

            {/* Bottom Scroll Cue */}
            <motion.div variants={itemVariants} className="pt-4 sm:pt-6">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#647184] hover:text-[#0864C7] transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF] group-hover:scale-125 transition-transform" />
                <span>Selected Engineering Work</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#178BFF] group-hover:translate-y-0.5 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Abstract Exploded Engineering Assembly (~5 cols) */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
            <motion.div variants={itemVariants} className="w-full max-w-lg lg:max-w-none">
              <AbstractAssemblyVisual />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
