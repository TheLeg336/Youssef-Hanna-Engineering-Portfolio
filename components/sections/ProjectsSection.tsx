'use client';

import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { PROJECTS } from '@/lib/portfolio-data';
import { LauncherVisual } from '@/components/projects/LauncherVisual';
import { UniRateVisual } from '@/components/projects/UniRateVisual';
import { DualSenseVisual } from '@/components/projects/DualSenseVisual';
import { EzerVisual } from '@/components/projects/EzerVisual';
import { Reveal } from '@/components/motion/Reveal';

export function ProjectsSection() {
  return (
    <section id="projects" className="my-20 sm:my-28 scroll-mt-24">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <Reveal variant="heading">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/10 pb-6 mb-12 sm:mb-16">
            <div>
              <div className="text-xs font-mono text-[#0864C7] font-semibold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
                ENGINEERING WORK & SYSTEMS
              </div>
              <h2 className="text-section-title font-extrabold tracking-tight text-[#17202A] mt-1.5">
                Featured Engineering Builds
              </h2>
            </div>
            <p className="text-xs font-mono text-[#647184] max-w-sm">
              Physical mechanisms, embedded hardware, Chrome extension DOM injection, and desktop automation.
            </p>
          </div>
        </Reveal>

        {/* Projects List */}
        <div className="space-y-20 sm:space-y-28">
          {PROJECTS.map((project, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <article
                key={project.slug}
                className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Text Narrative Column (Desktop side-by-side; Tablet/Mobile reordered) */}
                <div
                  className={`w-full lg:col-span-5 space-y-4 sm:space-y-5 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <Reveal variant="standard">
                    {/* Category & Year Metadata */}
                    <div className="flex items-center gap-2 text-xs font-mono text-[#647184]">
                      <span className="text-[#0864C7] font-bold">{`0${idx + 1}`}</span>
                      <span className="text-black/20">/</span>
                      <span className="px-2.5 py-0.5 rounded-full glass-pill text-[11px] text-[#17202A] font-semibold">
                        {project.category}
                      </span>
                      <span className="text-black/20">·</span>
                      <span>{project.year}</span>
                    </div>

                    {/* Project Title */}
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17202A] tracking-tight mt-1">
                      {project.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm sm:text-base text-[#4B596A] leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Key Technical Metric Pills */}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
                      {project.metrics.slice(0, 4).map((m) => (
                        <div
                          key={m.label}
                          className="glass-card-solid p-2.5 sm:p-3 rounded-xl"
                        >
                          <div className="text-[10px] text-[#647184] uppercase font-medium">{m.label}</div>
                          <div className={`font-bold text-xs sm:text-sm mt-0.5 ${m.highlight ? 'text-[#0864C7]' : 'text-[#17202A]'}`}>
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Role & Status */}
                    <div className="pt-1 text-xs font-mono text-[#647184] flex flex-wrap items-center gap-x-4 gap-y-1">
                      <div>
                        <span className="text-[#94A3B8]">ROLE:</span>{' '}
                        <span className="text-[#17202A] font-medium">{project.role}</span>
                      </div>
                      <div>
                        <span className="text-[#94A3B8]">STATUS:</span>{' '}
                        <span className="text-[#0864C7] font-semibold">{project.status}</span>
                      </div>
                    </div>

                    {/* Functional CTAs only (no fake buttons) */}
                    {project.slug === 'unirate' && (
                      <div className="pt-3 flex flex-wrap items-center gap-3">
                        <a
                          href="https://chromewebstore.google.com/detail/unirate/eeehacjdlohcgmhghnihgbgfmkbopcho"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-full text-xs font-mono font-bold text-white bg-[#178BFF] hover:bg-[#0864C7] inline-flex items-center gap-2 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] active:scale-95"
                        >
                          <span>Chrome Web Store</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </Reveal>
                </div>

                {/* Interactive Product Window Column */}
                <div
                  className={`w-full lg:col-span-7 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <Reveal variant="visual">
                    {project.slug === 'launcher' && <LauncherVisual />}
                    {project.slug === 'unirate' && <UniRateVisual />}
                    {project.slug === 'dualsense' && <DualSenseVisual />}
                    {project.slug === 'ezer' && <EzerVisual />}
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default ProjectsSection;
