'use client';

import React, { useState } from 'react';
import { SKILLS_DATA, SkillItem } from '@/lib/portfolio-data';
import { Reveal } from '@/components/motion/Reveal';

export function SkillsSection() {
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);

  return (
    <section id="skills" className="my-20 sm:my-28 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <Reveal variant="heading">
          <div className="border-b border-black/10 pb-6 mb-12">
            <div className="text-xs font-mono text-[#0864C7] font-semibold uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
              TECHNICAL PROFICIENCIES
            </div>
            <h2 className="text-section-title font-extrabold tracking-tight text-[#17202A] mt-1.5">
              Engineering Skills & Tools
            </h2>
            <p className="mt-2 text-xs font-mono text-[#647184]">
              Select any skill to see its practical engineering application.
            </p>
          </div>
        </Reveal>

        {/* Skill Clusters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILLS_DATA.map((group) => (
            <Reveal key={group.category} variant="standard">
              <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-[#0864C7] tracking-wider mb-4 border-b border-black/5 pb-2">
                    {group.category}
                  </h3>

                  {/* Tactile Pill Cluster */}
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => {
                      const isSelected = activeSkill?.name === skill.name;

                      return (
                        <button
                          key={skill.name}
                          type="button"
                          onMouseEnter={() => setActiveSkill(skill)}
                          onFocus={() => setActiveSkill(skill)}
                          onClick={() => setActiveSkill(isSelected ? null : skill)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all text-left inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] ${
                            isSelected
                              ? 'glass-pill-active font-semibold'
                              : 'glass-pill text-[#334155] hover:text-[#17202A]'
                          }`}
                        >
                          <span>{skill.name}</span>
                          {skill.projectSlug && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Practical note on selection */}
                <div className="min-h-[44px] pt-3 border-t border-black/5 text-xs text-[#647184]">
                  {activeSkill && group.skills.some((s) => s.name === activeSkill.name) ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#17202A]">
                      <span className="leading-relaxed font-sans">{activeSkill.note}</span>
                      {activeSkill.projectName && (
                        <span className="text-[#0864C7] font-mono text-[11px] font-semibold shrink-0 mt-1 sm:mt-0">
                          Applied: {activeSkill.projectName}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[#94A3B8] font-mono text-[11px]">
                      Hover or tap any skill to see practical context.
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
