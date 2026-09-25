'use client';

import React, { useState } from 'react';
import { SKILLS_DATA, SkillItem } from '@/lib/portfolio-data';
import { Reveal } from '@/components/motion/Reveal';

export function SkillsSection() {
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);

  return (
    <section id="skills" className="my-16 sm:my-24 scroll-mt-28">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal variant="heading">
          <div className="border-b border-black/10 pb-5 mb-10 sm:mb-12">
            <div className="text-xs font-mono text-[#0864C7] font-semibold uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
              TECHNICAL PROFICIENCIES
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17202A] mt-1.5">
              Engineering Skills &amp; Applied Tools
            </h2>
            <p className="mt-2 text-xs font-mono text-[#647184]">
              Hover, focus, or tap any skill to see its verified application context.
            </p>
          </div>
        </Reveal>

        {/* 4-Column Responsive Grid on Desktop / 2x2 on Tablet / Stacking on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {SKILLS_DATA.map((group) => (
            <Reveal key={group.category} variant="standard">
              <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-3 h-full">
                <div>
                  <h3 className="text-[11px] font-mono font-bold uppercase text-[#0864C7] tracking-wider mb-3 border-b border-black/5 pb-2">
                    {group.category}
                  </h3>

                  {/* Tactile Pill Cluster */}
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => {
                      const isSelected = activeSkill?.name === skill.name;

                      return (
                        <button
                          key={skill.name}
                          type="button"
                          onMouseEnter={() => setActiveSkill(skill)}
                          onFocus={() => setActiveSkill(skill)}
                          onClick={() => setActiveSkill(isSelected ? null : skill)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all text-left inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] ${
                            isSelected
                              ? 'glass-pill-active font-semibold'
                              : 'glass-pill text-[#334155] hover:text-[#17202A]'
                          }`}
                        >
                          <span>{skill.name}</span>
                          {skill.projectName && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Practical note on selection */}
                <div className="min-h-[46px] pt-2.5 border-t border-black/5 text-xs text-[#647184]">
                  {activeSkill && group.skills.some((s) => s.name === activeSkill.name) ? (
                    <div className="space-y-0.5 text-[#17202A]">
                      <div className="leading-snug font-sans text-[11.5px]">{activeSkill.note}</div>
                      {activeSkill.projectName && (
                        <div className="text-[#0864C7] font-mono text-[10.5px] font-semibold">
                          {activeSkill.projectName}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[#94A3B8] font-mono text-[10.5px]">
                      Hover or tap for context.
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
