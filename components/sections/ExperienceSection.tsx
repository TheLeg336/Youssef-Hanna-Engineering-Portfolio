'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Users, Award } from 'lucide-react';
import { EXPERIENCE_DATA, LAUNCHER_TIMELINE, PERSONAL_INFO } from '@/lib/portfolio-data';
import { Reveal, useReducedMotion } from '@/components/motion/Reveal';

export function ExperienceSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="experience" className="my-20 sm:my-28 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <Reveal variant="heading">
          <div className="border-b border-black/10 pb-6 mb-12 sm:mb-14">
            <div className="text-xs font-mono text-[#0864C7] font-semibold uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
              ENGINEERING LEADERSHIP & EXPERIENCE
            </div>
            <h2 className="text-section-title font-extrabold tracking-tight text-[#17202A] mt-1.5">
              Leadership & Work Experience
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Featured Leadership Narrative Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal variant="standard">
              <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#0864C7] font-semibold">
                      <Users className="w-4 h-4" />
                      <span>ENGINEERING PROJECT LEAD</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#17202A] mt-0.5">
                      15-Person Launcher Team · Emergency Recovery
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#059669] bg-[#EBFDF5] border border-[#A7F3D0] px-3 py-1 rounded-full self-start sm:self-auto shadow-xs">
                    1st Place Winner
                  </span>
                </div>

                <p className="text-sm text-[#4B596A] leading-relaxed">
                  Led a ~15-person cross-functional student engineering team at Cal Poly Pomona.
                  When an unauthorized modification compromised the mechanism one week before competition,
                  directed triage recovery, redesigned around damaged parts, compacted the frame,
                  and led the team to victory reaching ~300 ft with ~30–40% profit margin.
                </p>

                {/* Sequential Leadership Timeline */}
                <div className="space-y-4 pt-2">
                  <div className="text-xs font-mono uppercase text-[#647184] tracking-wider mb-2 font-medium">
                    Critical Failure Recovery Timeline
                  </div>

                  <div className="relative border-l-2 border-[#CBD5E1] ml-3 pl-5 space-y-5">
                    {LAUNCHER_TIMELINE.map((item, idx) => (
                      <motion.div
                        key={item.phase}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: prefersReduced ? 0 : idx * 0.08,
                        }}
                        className="relative"
                      >
                        {/* Milestone dot */}
                        <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#178BFF] shadow-xs" />

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-[#0864C7] font-bold">
                            {item.phase} · {item.stage}
                          </span>
                          <span className="text-black/20">|</span>
                          <span className="text-xs font-bold text-[#17202A]">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-xs text-[#4B596A] mt-1 leading-relaxed">
                          {item.detail}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Community Tutoring Note */}
            <Reveal variant="standard" delay={0.1}>
              <div className="glass-panel p-5 rounded-2xl flex items-start gap-3 text-xs">
                <Users className="w-4 h-4 text-[#178BFF] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#17202A]">
                    Mathematics Tutor & Community Education
                  </div>
                  <p className="text-[#647184] mt-1 leading-relaxed">
                    Tutored students in algebra, geometry, and calculus through church community programs,
                    breaking down abstract mathematics into intuitive physical analogies.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Work Experience & Honors */}
          <div className="lg:col-span-5 space-y-6">
            {/* Work Experience */}
            <Reveal variant="visual">
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#0864C7] font-semibold border-b border-black/5 pb-3">
                  <ShieldCheck className="w-4 h-4" />
                  <span>PROFESSIONAL WORK EXPERIENCE</span>
                </div>

                {EXPERIENCE_DATA.map((job) => (
                  <div key={job.company} className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <h4 className="text-sm font-bold text-[#17202A]">{job.role}</h4>
                      <span className="text-[11px] font-mono text-[#647184]">{job.period}</span>
                    </div>
                    <div className="text-xs font-mono text-[#0864C7] font-medium">{job.company} · California</div>

                    <p className="text-xs text-[#4B596A] leading-relaxed pt-1">
                      {job.summary}
                    </p>

                    <ul className="space-y-1.5 pt-2 text-xs text-[#647184]">
                      {job.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#178BFF] font-mono">•</span>
                          <span className="leading-relaxed">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Academic Honors */}
            <Reveal variant="visual" delay={0.1}>
              <div className="glass-panel p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#D97706] font-semibold border-b border-black/5 pb-3">
                  <Award className="w-4 h-4" />
                  <span>ACADEMIC HONORS</span>
                </div>

                <div className="space-y-2.5">
                  {PERSONAL_INFO.honors.map((h) => (
                    <div key={h.title} className="glass-card-solid p-3 rounded-xl">
                      <div className="text-xs font-bold text-[#17202A]">{h.title}</div>
                      <div className="text-[11px] text-[#647184] mt-0.5">{h.detail}</div>
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
