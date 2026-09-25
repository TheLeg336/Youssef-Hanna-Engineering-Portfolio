'use client';

import React from 'react';
import { GraduationCap, Award, BookOpen, Globe2, Compass } from 'lucide-react';
import { PERSONAL_INFO, EDUCATION_DATA } from '@/lib/portfolio-data';
import { Reveal } from '@/components/motion/Reveal';

export function AboutSection() {
  return (
    <section id="about" className="my-20 sm:my-28 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <Reveal variant="heading">
          <div className="border-b border-black/10 pb-6 mb-12 sm:mb-14">
            <div className="text-xs font-mono text-[#0864C7] font-semibold uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
              ENGINEERING IDENTITY & EDUCATION
            </div>
            <h2 className="text-section-title font-extrabold tracking-tight text-[#17202A] mt-1.5">
              About Youssef
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: Editorial Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal variant="standard">
              <div className="text-base sm:text-lg text-[#334155] leading-relaxed space-y-5">
                <p>
                  I’m <strong className="text-[#17202A] font-bold">Youssef Hanna</strong>, a junior Mechanical Engineering
                  student at <strong className="text-[#17202A] font-bold">Cal Poly Pomona</strong>. My core direction
                  is aerospace—spacecraft, aircraft, and advanced mobility—alongside mechanical systems, robotics,
                  mechatronics, and autonomous hardware.
                </p>

                <p>
                  I enjoy engineering most when an idea leaves the CAD viewport and has to work in the physical world:
                  tolerances, vibrations, fastener torque, electrical continuity, and component recovery under stress.
                  I focus on a hands-on foundation of roughly{' '}
                  <span className="text-[#0864C7] font-bold">65–80% mechanical design and physical prototyping</span> and{' '}
                  <span className="text-[#0284C7] font-bold">20–35% embedded electronics, firmware, and software</span>.
                </p>

                <p>
                  When physical hardware breaks—like our launcher chassis one week before competition—I prefer assessing
                  what remains intact, redesigning around surviving parts, and iterating quickly under pressure.
                </p>
              </div>

              {/* Compact Fact Pills */}
              <div className="pt-4 flex flex-wrap gap-2 text-xs font-mono">
                <span className="glass-pill px-3.5 py-1.5 rounded-full text-[#334155] inline-flex items-center gap-1.5 shadow-xs">
                  <Compass className="w-3.5 h-3.5 text-[#178BFF]" />
                  <span>Fountain Valley, CA</span>
                </span>

                <span className="glass-pill px-3.5 py-1.5 rounded-full text-[#334155] inline-flex items-center gap-1.5 shadow-xs">
                  <Globe2 className="w-3.5 h-3.5 text-[#178BFF]" />
                  <span>English (Fluent) · Arabic (Fluent)</span>
                </span>

                <span className="glass-pill px-3.5 py-1.5 rounded-full text-[#334155] inline-flex items-center gap-1.5 shadow-xs">
                  <Award className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Dean&apos;s List · Phi Theta Kappa</span>
                </span>
              </div>
            </Reveal>
          </div>

          {/* Right: Education Credential Card */}
          <div className="lg:col-span-5">
            <Reveal variant="visual">
              <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-black/5 pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#0864C7] font-bold">
                    <GraduationCap className="w-4 h-4" />
                    <span>DEGREE CANDIDACY</span>
                  </div>
                  <span className="text-xs font-mono text-[#647184]">Junior Status</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#17202A]">
                    {EDUCATION_DATA.school}
                  </h3>
                  <div className="text-xs font-mono text-[#0864C7] font-semibold mt-1">
                    {EDUCATION_DATA.degree}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-black/5 text-xs font-mono">
                  <div>
                    <span className="text-[#647184] block text-[10px] uppercase font-medium">GRADUATION DATE</span>
                    <span className="text-[#17202A] font-bold text-sm">May 2028</span>
                  </div>
                  <div>
                    <span className="text-[#647184] block text-[10px] uppercase font-medium">CUMULATIVE GPA</span>
                    <span className="text-[#0864C7] font-bold text-sm">3.74 / 4.00</span>
                  </div>
                </div>

                {/* Relevant Coursework */}
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
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
export default AboutSection;
