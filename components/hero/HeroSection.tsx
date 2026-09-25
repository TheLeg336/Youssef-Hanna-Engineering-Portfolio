'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, FileText, Github, Mail, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from '@/lib/portfolio-data';
import { SelectedSystemsReel } from './SelectedSystemsReel';
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
    <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 overflow-hidden">
      {/* Background ambient pale aerospace blue lighting */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#178BFF]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center"
        >
          {/* LEFT COLUMN: Identity / Recruiter Rail / Headline / CTA (~7 columns) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Recruiter Metadata Rail */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
              <span className="glass-pill px-3.5 py-1 rounded-full text-xs font-mono text-[#0864C7] font-semibold inline-flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#178BFF] animate-pulse" />
                <span>Seeking Summer 2027 Internship</span>
              </span>

              <span className="glass-pill px-3 py-1 rounded-full text-xs font-mono text-[#475569] shadow-xs">
                Mechanical Engineering · Cal Poly Pomona
              </span>

              <span className="glass-pill px-3 py-1 rounded-full text-xs font-mono text-[#0864C7] font-bold shadow-xs">
                GPA 3.74
              </span>

              <span className="glass-pill px-3 py-1 rounded-full text-xs font-mono text-[#647184] shadow-xs">
                Expected May 2028
              </span>
            </motion.div>

            {/* Main Headline (Natural casing, intentional line breaks) */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <div className="text-xs font-mono uppercase tracking-widest text-[#647184] font-semibold">
                Youssef Hanna · Engineering Portfolio
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#17202A] leading-[1.08] text-balance">
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
              className="text-base sm:text-lg text-[#4B596A] leading-relaxed max-w-xl"
            >
              I&apos;m Youssef Hanna, a junior Mechanical Engineering student at Cal Poly Pomona focused
              on aerospace, hands-on design, prototyping, embedded systems, and real-world testing.
            </motion.p>

            {/* Focus / Target Areas */}
            <motion.div variants={itemVariants} className="space-y-2 pt-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#647184] font-semibold flex items-center gap-2">
                <span>FOCUS / TARGET AREAS:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Aerospace',
                  'Mechanical Design',
                  'Mechatronics',
                  'Autonomous Systems',
                  'Robotics',
                ].map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1 rounded-full bg-white/80 border border-[#CBD5E1] text-[#334155] font-mono text-[11px] shadow-2xs"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Strict Visual Hierarchy Action Row: Primary Explore Work, Secondary Resume, Tertiary Email, Supporting GitHub */}
            <motion.div
              variants={itemVariants}
              className="pt-2 flex flex-wrap items-center gap-3"
            >
              {/* PRIMARY: Explore Work with Liquid Glass and Aurora Border Beam */}
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
                className="liquid-glass-btn-neutral px-4 sm:px-5 py-3 rounded-full text-xs font-mono font-semibold text-[#17202A] hover:text-[#0864C7] inline-flex items-center gap-2 active:scale-95"
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
          </div>

          {/* RIGHT COLUMN: Interactive "Selected Systems" Hero Reel (~5 columns) */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
            <motion.div variants={itemVariants} className="w-full max-w-xl lg:max-w-none">
              <SelectedSystemsReel />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
