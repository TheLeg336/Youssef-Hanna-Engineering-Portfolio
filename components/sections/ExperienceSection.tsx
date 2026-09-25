'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Users, Award, BookOpen } from 'lucide-react';
import { EXPERIENCE_DATA, LAUNCHER_TIMELINE, PERSONAL_INFO } from '@/lib/portfolio-data';
import { Reveal, useReducedMotion } from '@/components/motion/Reveal';

export function ExperienceSection() {
  const prefersReduced = useReducedMotion();

  const leadershipSteps = [
    {
      stage: 'TARGET',
      desc: '~100 ft project requirement with strict out-of-pocket budget bounds.',
    },
    {
      stage: 'DISRUPTION',
      desc: 'Major mechanical failure roughly one week before competition.',
    },
    {
      stage: 'ASSESS',
      desc: 'Triaged intact components with the ~15-person team and identified usable parts.',
    },
    {
      stage: 'REDESIGN',
      desc: 'Rebuilt around surviving pieces into a more compact, stiffer chassis.',
    },
    {
      stage: 'RESULT',
      desc: '~300 ft achieved (3× target distance) and won 1st place in the class competition.',
    },
  ];

  return (
    <section id="experience" className="my-16 sm:my-24 scroll-mt-28">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal variant="heading">
          <div className="border-b border-black/10 pb-5 mb-10 sm:mb-12">
            <div className="text-xs font-mono text-[#0864C7] font-semibold uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
              ENGINEERING LEADERSHIP &amp; EXPERIENCE
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17202A] mt-1.5">
              Leadership &amp; Work History
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Featured Engineering Leadership (~65%) */}
          <div className="lg:col-span-8 space-y-6">
            <Reveal variant="standard">
              <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#0864C7] font-semibold">
                      <Users className="w-4 h-4" />
                      <span>ENGINEERING LEADERSHIP</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#17202A] mt-0.5">
                      Launcher Team Lead · Emergency Failure Recovery
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#059669] bg-[#EBFDF5] border border-[#A7F3D0] px-3 py-1 rounded-full self-start sm:self-auto shadow-2xs">
                    1st Place Winner
                  </span>
                </div>

                <p className="text-sm text-[#4B596A] leading-relaxed">
                  Served as Project Lead for approximately 15 engineering students during Introduction to
                  Engineering and Design at Cal Poly Pomona. When an unauthorized modification compromised the
                  mechanism one week before competition, assembled the team, triaged surviving components,
                  redesigned the assembly into a more compact chassis, and achieved ~300 ft for the class win.
                </p>

                {/* Concise Recovery Timeline (Section 52) */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-mono uppercase text-[#647184] tracking-wider font-semibold">
                    Recovery Timeline:
                  </div>

                  <div className="relative border-l-2 border-[#178BFF]/40 ml-3 pl-5 space-y-4">
                    {leadershipSteps.map((item, idx) => (
                      <motion.div
                        key={item.stage}
                        initial={{ opacity: 0, x: -6 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.35,
                          delay: prefersReduced ? 0 : idx * 0.06,
                        }}
                        className="relative"
                      >
                        <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#178BFF] shadow-xs" />

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#0864C7]">
                            {item.stage}
                          </span>
                        </div>
                        <p className="text-xs text-[#4B596A] mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Visually Quieter Work Experience, Tutoring & Honors (~35%) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Work Experience: Security Guard (Section 53) */}
            <Reveal variant="visual">
              <div className="glass-panel p-5 rounded-2xl space-y-3 bg-white/70">
                <div className="flex items-center gap-2 text-xs font-mono text-[#647184] font-semibold border-b border-black/5 pb-2">
                  <ShieldCheck className="w-4 h-4 text-[#178BFF]" />
                  <span>WORK EXPERIENCE</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-xs font-bold text-[#17202A]">Security Guard</h4>
                    <span className="text-[10px] font-mono text-[#647184]">Mar 2026 – Aug 2026</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#0864C7]">Kero Security · California</div>

                  <p className="text-xs text-[#4B596A] leading-relaxed pt-1">
                    Monitored assigned sites, performed routine patrols, communicated with staff and visitors,
                    and helped maintain a safe environment.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Mathematics Tutoring (Section 54) */}
            <Reveal variant="visual" delay={0.08}>
              <div className="glass-panel p-5 rounded-2xl space-y-2 bg-white/70">
                <div className="flex items-center gap-2 text-xs font-mono text-[#647184] font-semibold border-b border-black/5 pb-2">
                  <BookOpen className="w-4 h-4 text-[#178BFF]" />
                  <span>COMMUNITY EDUCATION</span>
                </div>

                <h4 className="text-xs font-bold text-[#17202A]">Mathematics Tutor</h4>
                <p className="text-xs text-[#4B596A] leading-relaxed">
                  Tutored mathematics for students and community members, breaking complex concepts into
                  clear step-by-step explanations.
                </p>
              </div>
            </Reveal>

            {/* Academic Honors */}
            <Reveal variant="visual" delay={0.12}>
              <div className="glass-panel p-5 rounded-2xl space-y-2.5 bg-white/70">
                <div className="flex items-center gap-2 text-xs font-mono text-[#D97706] font-semibold border-b border-black/5 pb-2">
                  <Award className="w-4 h-4" />
                  <span>HONORS</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {PERSONAL_INFO.honors.map((h) => (
                    <div key={h.title} className="text-[#334155]">
                      <span className="font-bold text-[#17202A]">{h.title}</span>
                      <span className="text-[#647184] text-[11px] block">{h.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
