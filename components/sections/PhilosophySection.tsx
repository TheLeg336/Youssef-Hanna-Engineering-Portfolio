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
      sentence: 'Define constraints.',
    },
    {
      num: '02',
      title: 'BUILD',
      sentence: 'Turn geometry into hardware.',
    },
    {
      num: '03',
      title: 'TEST',
      sentence: 'Measure what actually happens.',
    },
    {
      num: '04',
      title: 'ITERATE',
      sentence: 'Fix what reality exposes.',
    },
  ];

  return (
    <section id="philosophy" className="my-16 sm:my-24 py-16 sm:py-20 border-y border-black/5 relative overflow-hidden bg-[#FAFBFD]">
      {/* Background ambient pale lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#178BFF]/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Editorial Quote Block (Max width ~850px) */}
        <Reveal variant="heading">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <div className="text-xs font-mono text-[#0864C7] font-semibold uppercase tracking-wider mb-3 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
              ENGINEERING PHILOSOPHY
            </div>
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#17202A] leading-tight text-balance">
              &ldquo;I’m drawn to engineering problems where an idea eventually has to leave the screen and work in the real world.&rdquo;
            </blockquote>
          </div>
        </Reveal>

        {/* Connected Lifecycle Path (No large cards — single connected pipeline) */}
        <Reveal variant="visual">
          <div className="relative max-w-4xl mx-auto">
            {/* Desktop / Tablet Connecting Line */}
            <div className="hidden md:block absolute top-[18px] left-[12%] right-[12%] h-[2px] z-0">
              <motion.div
                initial={{ scaleX: prefersReduced ? 1 : 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] as const }}
                className="w-full h-full bg-gradient-to-r from-[#178BFF]/30 via-[#0864C7] to-[#178BFF]/30 origin-left"
              />
            </div>

            {/* Desktop / Tablet Horizontal Pipeline */}
            <div className="hidden md:grid grid-cols-4 gap-4 relative z-10 text-center">
              {stages.map((st, i) => (
                <div key={st.num} className="flex flex-col items-center">
                  {/* Step Circle Indicator */}
                  <div className="w-9 h-9 rounded-full bg-white border-2 border-[#178BFF] text-[#0864C7] font-mono text-xs font-bold flex items-center justify-center shadow-xs mb-3">
                    {st.num}
                  </div>

                  <h3 className="text-sm font-bold text-[#17202A] font-mono tracking-wide">
                    {st.title}
                  </h3>

                  <p className="text-xs text-[#4B596A] mt-1 font-sans">
                    {st.sentence}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile Vertical Connected Timeline */}
            <div className="md:hidden relative border-l-2 border-[#178BFF]/40 ml-4 pl-6 space-y-6">
              {stages.map((st) => (
                <div key={st.num} className="relative">
                  {/* Milestone Dot */}
                  <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#178BFF] shadow-xs" />

                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-mono font-bold text-[#0864C7]">{st.num}</span>
                    <span className="text-xs font-bold text-[#17202A] font-mono">{st.title}</span>
                  </div>

                  <p className="text-xs text-[#4B596A] mt-0.5">
                    {st.sentence}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default PhilosophySection;
