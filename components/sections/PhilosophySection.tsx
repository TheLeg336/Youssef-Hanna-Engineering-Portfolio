'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Reveal, useReducedMotion } from '@/components/motion/Reveal';

export function PhilosophySection() {
  const prefersReduced = useReducedMotion();

  const stages = [
    {
      num: '01',
      title: 'DESIGN',
      tagline: 'Define constraints.',
      detail: 'Analyze physical load paths, calculate budget margins, and question baseline assumptions.',
    },
    {
      num: '02',
      title: 'BUILD',
      tagline: 'Turn geometry into hardware.',
      detail: 'Fabricate physical assemblies, solder interconnects, and integrate real mechatronic parts.',
    },
    {
      num: '03',
      title: 'TEST',
      tagline: 'Measure real behavior.',
      detail: 'Measure empirical launch distance, thermal dissipation, and packet latency under stress.',
    },
    {
      num: '04',
      title: 'ITERATE',
      tagline: 'Fix what reality exposes.',
      detail: 'Triage unexpected failures calmly, extract surviving value, and rebuild a stiffer, superior system.',
    },
  ];

  return (
    <section id="philosophy" className="my-20 sm:my-28 py-16 sm:py-20 border-y border-black/5 relative overflow-hidden bg-[#FAFBFD]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#178BFF]/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Quote Block */}
        <Reveal variant="heading">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="text-xs font-mono text-[#0864C7] font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
              ENGINEERING PHILOSOPHY
            </div>
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#17202A] leading-tight">
              &ldquo;I’m drawn to engineering problems where an idea eventually has to leave the screen and work in the real world.&rdquo;
            </blockquote>
          </div>
        </Reveal>

        {/* Connected Lifecycle System */}
        <Reveal variant="visual">
          <div className="relative">
            {/* Desktop Connecting Vector Line */}
            <div className="hidden lg:block absolute top-[28px] left-[6%] right-[6%] h-[2px] z-0">
              <motion.div
                initial={{ scaleX: prefersReduced ? 1 : 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as const }}
                className="w-full h-full bg-gradient-to-r from-[#178BFF]/30 via-[#0864C7] to-[#178BFF]/30 origin-left"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
              {stages.map((st, i) => (
                <motion.div
                  key={st.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: prefersReduced ? 0 : i * 0.12,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                  className="glass-card-solid p-6 rounded-2xl flex flex-col justify-between group hover:border-[#178BFF]/40 transition-colors shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-8 h-8 rounded-full bg-[#EAF5FF] text-[#0864C7] text-xs font-mono font-bold flex items-center justify-center border border-[#178BFF]/25 shadow-xs">
                        {st.num}
                      </span>
                      <span className="text-[10px] font-mono text-[#647184] uppercase tracking-wider">
                        PHASE {st.num}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#17202A] tracking-tight">
                      {st.title}
                    </h3>

                    <div className="text-xs font-mono text-[#0864C7] font-semibold mt-1">
                      {st.tagline}
                    </div>

                    <p className="text-xs text-[#4B596A] mt-3 leading-relaxed">
                      {st.detail}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-black/5 text-[10px] font-mono text-[#94A3B8]">
                    Loop: Validate Real Performance
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
export default PhilosophySection;
