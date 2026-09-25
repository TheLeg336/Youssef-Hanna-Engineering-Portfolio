'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, FileText, Github, Mail, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from '@/lib/portfolio-data';
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
    <section className="relative pt-36 sm:pt-40 lg:pt-44 pb-16 sm:pb-20 overflow-hidden">
      {/* Background ambient pale aerospace blue lighting centered */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#178BFF]/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center space-y-6 sm:space-y-7 w-full"
        >
          {/* Restrained Single Glass Metadata Rail */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 p-1 sm:p-1.5 rounded-full glass-panel border border-black/5 text-xs font-mono shadow-xs">
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
          <motion.div variants={itemVariants} className="space-y-3 w-full">
            <div className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.14em] text-[#52657A] font-semibold">
              YOUSSEF HANNA · MECHANICAL ENGINEERING
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black tracking-[-0.035em] text-[#0F1E31] leading-[1.04] text-balance max-w-3xl mx-auto">
              From CAD to hardware,
              <br />
              I build systems
              <br />
              that have to work.
            </h1>
          </motion.div>

          {/* Concise Natural Intro */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto"
          >
            I&apos;m Youssef Hanna, a junior Mechanical Engineering student at Cal Poly Pomona focused
            on aerospace, hands-on design, prototyping, embedded systems, and real-world testing.
          </motion.p>

          {/* Clean Non-Pill Focus Line */}
          <motion.div variants={itemVariants} className="pt-0.5">
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs sm:text-sm text-[#334155]">
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
            className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {/* PRIMARY: Explore Work */}
            <AppBorderBeam colorVariant="aurora" size="md" className="rounded-full shadow-lg">
              <a
                href="#projects"
                className="liquid-glass-btn-primary px-6 sm:px-8 py-3.5 rounded-full text-white text-xs sm:text-sm font-mono font-bold inline-flex items-center gap-2.5 active:scale-95 cursor-pointer"
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
              className="liquid-glass-btn-neutral px-5 py-3.5 rounded-full text-xs sm:text-sm font-mono font-semibold text-[#17202A] hover:text-[#0864C7] inline-flex items-center gap-2 active:scale-95"
            >
              <FileText className="w-4 h-4 text-[#178BFF]" />
              <span>Resume PDF</span>
            </a>

            {/* TERTIARY: Email Direct */}
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="liquid-glass-btn-neutral px-4 py-3.5 rounded-full text-xs font-mono text-[#475569] hover:text-[#17202A] inline-flex items-center gap-2 active:scale-95"
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
              className="liquid-glass-btn-neutral px-4 py-3.5 rounded-full text-xs font-mono text-[#647184] hover:text-[#0864C7] inline-flex items-center gap-1.5 active:scale-95"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4 text-[#178BFF]" />
              <span className="hidden sm:inline">GitHub</span>
              <ExternalLink className="w-2.5 h-2.5 text-[#94A3B8]" />
            </a>
          </motion.div>

          {/* DIRECT PROJECT QUICK-JUMP LINKS FOR RECRUITERS */}
          <motion.div variants={itemVariants} className="pt-4 sm:pt-6 w-full">
            <div className="flex flex-col items-center gap-2.5">
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#94A3B8]">
                DIRECT PROJECT LINKS FOR RECRUITERS:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { name: '01 Launcher', hash: '#launcher' },
                  { name: '02 Ezer', hash: '#ezer' },
                  { name: '03 UniRate', hash: '#unirate' },
                  { name: '04 DualSense', hash: '#dualsense' },
                ].map((p) => (
                  <a
                    key={p.hash}
                    href={p.hash}
                    className="glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-[#334155] hover:text-[#0864C7] hover:border-[#178BFF]/40 inline-flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF]" />
                    <span>{p.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
