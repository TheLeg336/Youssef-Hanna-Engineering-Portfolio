'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, FileText, Github, Mail, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from '@/lib/portfolio-data';
import { HeroVisual } from './HeroVisual';
import { AppBorderBeam } from '@/components/ui/LibrariesDevWrapper';

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="relative pt-24 sm:pt-32 pb-14 overflow-hidden text-center">
      {/* Background ambient pale blue lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#178BFF]/9 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 flex flex-col items-center"
        >
          {/* Step 1: Scientific Availability & Academic Credentials */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-2">
            <span className="glass-pill px-4 py-1.5 rounded-full text-xs font-mono text-[#0864C7] font-semibold inline-flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#178BFF] animate-pulse" />
              <span>Available for Summer 2027 Internships</span>
            </span>

            <span className="glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-[#647184] shadow-xs">
              Cal Poly Pomona · GPA 3.74
            </span>
          </motion.div>

          {/* Step 2: Main Engineering Headline (Centered, High Impact) */}
          <motion.div variants={itemVariants} className="space-y-2 max-w-4xl mx-auto">
            <div className="text-xs font-mono uppercase tracking-widest text-[#647184] font-semibold">
              Youssef Hanna · Mechanical &amp; Aerospace Engineering
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#17202A] leading-[1.08] text-balance">
              I design, build, test, and validate physical systems.
            </h1>
          </motion.div>

          {/* Step 3: Scientific Positioning Statement */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-[#4B596A] leading-relaxed max-w-2xl mx-auto"
          >
            Mechanical engineering student bridging autonomous CAD synthesis, embedded telemetry bridges,
            and structural test fixtures under real-world physical constraints. Proven track record leading
            15-engineer teams to physical competition victory.
          </motion.p>

          {/* Step 4: Core Engineering Disciplines */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 pt-1 text-xs font-medium">
            {['Aerospace Systems', 'Mechanical Design', 'Mechatronics & Robotics', 'Autonomous Systems'].map(
              (discipline) => (
                <span
                  key={discipline}
                  className="px-3.5 py-1.5 rounded-full bg-white/80 border border-[#CBD5E1] text-[#334155] shadow-2xs font-mono text-[11px]"
                >
                  {discipline}
                </span>
              )
            )}
          </motion.div>

          {/* Step 5: CENTERED PRIMARY ACTION ROW WITH LIQUID GLASS EXPLORE WORK CTA */}
          <motion.div
            variants={itemVariants}
            className="pt-2 flex flex-wrap items-center justify-center gap-3 w-full"
          >
            {/* Centered Explore Work CTA with BorderBeam & Liquid Glass Refraction */}
            <AppBorderBeam colorVariant="ocean" size="md" className="rounded-full shadow-lg">
              <a
                href="#projects"
                className="group px-7 sm:px-8 py-3.5 rounded-full text-white bg-gradient-to-r from-[#0284C7] via-[#178BFF] to-[#38BDF8] text-sm font-bold inline-flex items-center gap-2.5 shadow-[0_8px_24px_-4px_rgba(23,139,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.5)] hover:shadow-[0_12px_32px_-2px_rgba(23,139,255,0.65)] hover:brightness-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] active:scale-95"
              >
                <span>Explore Work</span>
                <ArrowDown className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
              </a>
            </AppBorderBeam>

            {/* Resume CTA */}
            <a
              href={PERSONAL_INFO.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill px-5 py-3.5 rounded-full text-xs font-mono font-semibold text-[#17202A] hover:text-[#0864C7] bg-white/80 hover:bg-white border border-[#CBD5E1]/80 hover:border-[#178BFF]/40 inline-flex items-center gap-2 shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] active:scale-95"
            >
              <FileText className="w-4 h-4 text-[#178BFF]" />
              <span>Resume PDF</span>
            </a>

            {/* Direct Email */}
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="glass-pill px-4 py-3.5 rounded-full text-xs font-mono text-[#647184] hover:text-[#17202A] bg-white/80 hover:bg-white border border-[#CBD5E1]/80 hover:border-[#178BFF]/40 inline-flex items-center gap-2 shadow-xs transition-all active:scale-95"
              aria-label="Email Youssef"
            >
              <Mail className="w-4 h-4 text-[#178BFF]" />
              <span className="hidden sm:inline">Email</span>
            </a>

            {/* GitHub */}
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill px-3.5 py-3.5 rounded-full text-xs font-mono text-[#647184] hover:text-[#0864C7] bg-white/80 hover:bg-white border border-[#CBD5E1]/80 hover:border-[#178BFF]/40 inline-flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4 text-[#178BFF]" />
              <span className="hidden md:inline">GitHub</span>
              <ExternalLink className="w-2.5 h-2.5 text-[#94A3B8]" />
            </a>
          </motion.div>

          {/* Step 6: Centered Custom Science-Based Visual Schematic with Telemetry Flanks */}
          <motion.div
            variants={itemVariants}
            className="pt-6 w-full flex flex-col items-center"
          >
            {/* Scientific Telemetry Ribbon */}
            <div className="w-full max-w-xl flex items-center justify-between px-3 pb-2 text-[10px] font-mono text-[#64748B] select-none">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF]" />
                <span>DATUM: GROUND ZERO // X:000 Y:000</span>
              </span>
              <span className="text-[#0864C7] font-semibold">
                APEX: 62 FT // RANGE: ~300 FT
              </span>
            </div>

            {/* Central Precision Interactive Schematic */}
            <div className="w-full flex justify-center">
              <HeroVisual />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
export default HeroSection;
