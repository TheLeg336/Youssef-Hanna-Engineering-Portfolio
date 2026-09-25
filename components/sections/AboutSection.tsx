'use client';

import React from 'react';
import { GraduationCap, Award, BookOpen, Globe2, Compass } from 'lucide-react';
import { EDUCATION_DATA } from '@/lib/portfolio-data';
import { Reveal } from '@/components/motion/Reveal';

export function AboutSection() {
  return (
    <section id="about" className="my-16 sm:my-24 scroll-mt-28">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal variant="heading">
          <div className="border-b border-black/10 pb-5 mb-10 sm:mb-12">
            <div className="text-xs font-mono text-[#0864C7] font-semibold uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
              ENGINEERING IDENTITY &amp; EDUCATION
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17202A] mt-1.5">
              About Youssef
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: About Text (~58%) */}
          <div className="lg:col-span-7 space-y-5">
            <Reveal variant="standard">
              <div className="text-base sm:text-lg text-[#334155] leading-relaxed space-y-4">
                <p>
                  I&apos;m Youssef Hanna, a junior Mechanical Engineering student at Cal Poly Pomona.
                  I&apos;m most interested in aerospace and in work that lets me design, build, test,
                  and improve real systems.
                </p>

                <p>
                  I enjoy engineering most when an idea leaves CAD and has to work in the physical world.
                  I like building, troubleshooting, testing, and finding simpler solutions when the first
                  approach fails.
                </p>

                <p>
                  I&apos;m especially interested in projects that cross mechanical design, embedded hardware,
                  electronics, and software when combining them creates a better system.
                </p>
              </div>

              {/* Compact Metadata Line Below (Section 46) */}
              <div className="pt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-[#475569]">
                <span className="glass-pill px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                  <Compass className="w-3.5 h-3.5 text-[#178BFF]" />
                  <span>Fountain Valley, CA</span>
                </span>

                <span className="glass-pill px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                  <Globe2 className="w-3.5 h-3.5 text-[#178BFF]" />
                  <span>English · Arabic</span>
                </span>

                <span className="glass-pill px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                  <Award className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Dean&apos;s List · Phi Theta Kappa</span>
                </span>
              </div>
            </Reveal>
          </div>

          {/* Right: Education Credential (~42%) */}
          <div className="lg:col-span-5">
            <Reveal variant="visual">
              <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-black/5 pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#0864C7] font-bold">
                    <GraduationCap className="w-4 h-4" />
                    <span>ACADEMIC CREDENTIAL</span>
                  </div>
                  <span className="text-xs font-mono text-[#647184]">Junior Status</span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#17202A]">
                    {EDUCATION_DATA.school}
                  </h3>
                  <div className="text-xs font-mono text-[#0864C7] font-semibold mt-0.5">
                    {EDUCATION_DATA.degree}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-black/5 text-xs font-mono">
                  <div>
                    <span className="text-[#647184] block text-[10px] uppercase font-medium">EXPECTED GRADUATION</span>
                    <span className="text-[#17202A] font-bold text-sm">May 2028</span>
                  </div>
                  <div>
                    <span className="text-[#647184] block text-[10px] uppercase font-medium">CUMULATIVE GPA</span>
                    <span className="text-[#0864C7] font-bold text-sm">3.74 / 4.00</span>
                  </div>
                </div>

                {/* Relevant Coursework (Section 48) */}
                <div className="pt-3 border-t border-black/5">
                  <div className="text-xs font-mono text-[#647184] uppercase mb-2 flex items-center gap-1.5 font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-[#178BFF]" />
                    <span>Relevant Coursework:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {EDUCATION_DATA.relevantCoursework.map((course) => (
                      <span
                        key={course}
                        className="px-2.5 py-1 rounded-md bg-[#EEF2F6] text-xs font-mono text-[#334155]"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Honors */}
                <div className="pt-2 text-xs font-mono text-[#647184] flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Honors: Dean&apos;s List · Phi Theta Kappa</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
