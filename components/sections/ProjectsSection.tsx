'use client';

import React from 'react';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { LauncherVisual } from '@/components/projects/LauncherVisual';
import { DualSenseVisual } from '@/components/projects/DualSenseVisual';
import { EzerVisual } from '@/components/projects/EzerVisual';
import { UniRateVisual } from '@/components/projects/UniRateVisual';
import { Reveal } from '@/components/motion/Reveal';

export function ProjectsSection() {
  return (
    <section id="projects" className="my-16 sm:my-24 scroll-mt-28">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Section 19) */}
        <Reveal variant="heading">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/10 pb-5 mb-14 sm:mb-20">
            <div>
              <div className="text-xs font-mono text-[#0864C7] font-semibold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
                SELECTED ENGINEERING WORK
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17202A] mt-1.5">
                Physical Systems, Hardware &amp; Software
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#647184] max-w-md">
              Four projects spanning mechanical design, embedded hardware, engineering automation, and software.
            </p>
          </div>
        </Reveal>

        <div className="space-y-24 sm:space-y-28 lg:space-y-32">
          {/* =========================================================================
              PROJECT 01: PRECISION TENNIS BALL LAUNCHER (Mechanical & Prototyping)
              Layout: Desktop Left ~38% text/metrics, Right ~62% visualizer (Sections 21-26)
             ========================================================================= */}
          <article className="rounded-3xl p-4 sm:p-6 lg:p-8 bg-[#FAFBFD]/60 border border-slate-200/60 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Narrative & Verified Facts (Left ~38%) */}
              <div className="lg:col-span-5 space-y-4">
                <Reveal variant="standard">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#647184]">
                    <span className="text-[#0864C7] font-bold">01</span>
                    <span className="text-black/20">/</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[11px] text-[#17202A] font-semibold">
                      Mechanical / Prototyping
                    </span>
                    <span className="text-black/20">·</span>
                    <span>2024</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17202A] tracking-tight mt-1">
                    Precision Tennis Ball Launcher
                  </h3>

                  <p className="text-sm sm:text-base text-[#4B596A] leading-relaxed">
                    Led a ~15-person student engineering team to design, fabricate, and test a high-reach
                    mechanical launcher. When an unauthorized modification compromised the mechanism one
                    week before competition, led rapid triage and redesigned around surviving parts—achieving
                    ~300 ft (3× target distance) with ~30–40% profit margin and winning 1st place in the class competition.
                  </p>

                  <div className="pt-2 text-xs font-mono text-[#647184] space-y-1">
                    <div>
                      <span className="text-[#94A3B8]">ROLE:</span>{' '}
                      <span className="text-[#17202A] font-bold">Project Lead</span> (~15-Person Team)
                    </div>
                    <div>
                      <span className="text-[#94A3B8]">OUTCOME:</span>{' '}
                      <span className="text-[#059669] font-bold">1st Place Class Competition Winner</span>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Interactive Target vs. Achieved Range Visualizer (Right ~62%) */}
              <div className="lg:col-span-7">
                <Reveal variant="visual">
                  <LauncherVisual />
                </Reveal>
              </div>
            </div>
          </article>

          {/* =========================================================================
              PROJECT 02: DUALSENSE PC INTERFACE (Embedded Systems)
              Layout: Centered Header -> Near-Full-Width Signal Architecture (Sections 27-29)
             ========================================================================= */}
          <article className="rounded-3xl p-4 sm:p-6 lg:p-8 bg-white border border-slate-200/80 shadow-xs">
            <Reveal variant="standard">
              <div className="max-w-3xl mb-6">
                <div className="flex items-center gap-2 text-xs font-mono text-[#647184] mb-1">
                  <span className="text-[#0864C7] font-bold">02</span>
                  <span className="text-black/20">/</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EAF5FF] border border-[#178BFF]/25 text-[11px] text-[#0864C7] font-semibold">
                    Embedded Systems
                  </span>
                  <span className="text-black/20">·</span>
                  <span>2025</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17202A] tracking-tight">
                  DualSense PC Interface
                </h3>

                <p className="text-sm sm:text-base text-[#4B596A] mt-2 leading-relaxed">
                  Raspberry Pi Pico 2 W-based hardware bridge between a PC and PlayStation DualSense controller.
                  Translates bidirectional communication for controller inputs, dual voice-coil haptic feedback,
                  motorized adaptive trigger resistance curves, and audio streaming.
                </p>
              </div>
            </Reveal>

            {/* Near-Full-Width Interactive Architecture */}
            <div className="w-full">
              <Reveal variant="visual">
                <DualSenseVisual />
              </Reveal>
            </div>
          </article>

          {/* =========================================================================
              PROJECT 03: EZER (Flagship Interactive CAD Demo Section)
              Layout: Two-Column Composition (38% left narrative / 62% right live demo)
              Responsive: Collapses to single column on tablet; purpose-built order on mobile
             ========================================================================= */}
          <article className="rounded-[28px] sm:rounded-[32px] p-4 sm:p-7 lg:p-10 bg-[#F6F8FB] border border-[rgba(15,23,42,0.08)] shadow-[0_16px_40px_rgba(15,23,42,0.08)] relative overflow-hidden">
            {/* Background Ambient Depth */}
            <div
              className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-30"
              style={{
                background: 'radial-gradient(circle, rgba(34,199,242,0.35) 0%, rgba(47,128,255,0.15) 50%, transparent 75%)',
              }}
            />

            <div className="relative z-10 max-w-[1280px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* -------------------------------------------------------------
                    LEFT COLUMN: Project Information & Narrative (38% on desktop)
                ------------------------------------------------------------- */}
                <div className="lg:col-span-5 flex flex-col justify-between h-full pt-1 lg:pt-3">
                  <Reveal variant="standard">
                    <div>
                      {/* 1. Eyebrow Line */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0864C7] px-2.5 py-0.5 rounded-full bg-white border border-[#CBD5E1] shadow-2xs">
                          AI &amp; Automation · 2025–Present
                        </span>
                        <span className="text-[10px] font-mono text-[#64748B] hidden sm:inline">
                          Local AI + CAD Automation
                        </span>
                      </div>

                      {/* 2. Project Title */}
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight">
                        Ezer
                      </h3>

                      {/* 3. Short Description */}
                      <p className="mt-3 text-sm sm:text-base text-[#475569] leading-relaxed font-sans">
                        Experimental local desktop assistant exploring fast on-device computer-use models.
                        Investigating automated CAD workflows in SolidWorks with strict human-in-the-loop safety gates.
                      </p>

                      {/* 4. 2 x 2 Metadata Card Grid */}
                      <div className="grid grid-cols-2 gap-3 mt-6 sm:mt-7">
                        {/* Card 1: STATUS */}
                        <div className="rounded-[18px] p-4 bg-[rgba(255,255,255,0.84)] border border-[rgba(15,23,42,0.08)] shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex flex-col justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-bold">
                            STATUS
                          </span>
                          <span className="text-xs sm:text-[13px] font-mono font-semibold text-[#0F172A] mt-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                            In Active Development
                          </span>
                        </div>

                        {/* Card 2: TARGET MODEL */}
                        <div className="rounded-[18px] p-4 bg-[rgba(255,255,255,0.84)] border border-[rgba(15,23,42,0.08)] shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex flex-col justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-bold">
                            TARGET MODEL
                          </span>
                          <span className="text-xs sm:text-[13px] font-mono font-semibold text-[#0F172A] mt-1.5 truncate">
                            Local On-Device AI
                          </span>
                        </div>

                        {/* Card 3: DOMAIN FOCUS */}
                        <div className="rounded-[18px] p-4 bg-[rgba(255,255,255,0.84)] border border-[rgba(15,23,42,0.08)] shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex flex-col justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-bold">
                            DOMAIN FOCUS
                          </span>
                          <span className="text-xs sm:text-[13px] font-mono font-semibold text-[#0F172A] mt-1.5 truncate">
                            CAD / SolidWorks
                          </span>
                        </div>

                        {/* Card 4: ARCHITECTURE */}
                        <div className="rounded-[18px] p-4 bg-[rgba(255,255,255,0.84)] border border-[rgba(15,23,42,0.08)] shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex flex-col justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-bold">
                            ARCHITECTURE
                          </span>
                          <span className="text-xs sm:text-[13px] font-mono font-semibold text-[#0F172A] mt-1.5 truncate">
                            Tauri + Rust Backend
                          </span>
                        </div>
                      </div>

                      {/* 5. Concise Role & Status Lines */}
                      <div className="mt-6 pt-5 border-t border-[rgba(15,23,42,0.08)] text-[11px] sm:text-xs font-mono text-[#64748B] space-y-1.5">
                        <div className="flex items-start gap-1.5 leading-snug">
                          <span className="font-bold text-[#0F172A] shrink-0">ROLE:</span>
                          <span className="text-[#475569]">
                            Product Concept, Systems Design, UX, &amp; AI-Assisted Development
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#0F172A]">STATUS:</span>
                          <span className="text-[#0864C7] font-semibold">In Active Development</span>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>

                {/* -------------------------------------------------------------
                    RIGHT COLUMN: Flagship Live Demo Stage (62% on desktop)
                ------------------------------------------------------------- */}
                <div className="lg:col-span-7 w-full">
                  <Reveal variant="visual">
                    <EzerVisual />
                  </Reveal>
                </div>
              </div>
            </div>
          </article>

          {/* =========================================================================
              PROJECT 04: UNIRATE (Published Product)
              Layout: Top Row Header + Real Action Links -> Injected Table Demo (Sections 36-42)
             ========================================================================= */}
          <article className="rounded-3xl p-4 sm:p-6 lg:p-8 bg-white border border-slate-200/80 shadow-xs">
            <Reveal variant="standard">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#647184] mb-1">
                    <span className="text-[#0864C7] font-bold">04</span>
                    <span className="text-black/20">/</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EBFDF5] border border-[#A7F3D0] text-[11px] text-[#047857] font-semibold">
                      Published Product
                    </span>
                    <span className="text-black/20">·</span>
                    <span>2024–Present</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17202A] tracking-tight">
                    UniRate
                  </h3>

                  <p className="text-sm sm:text-base text-[#4B596A] mt-1.5 max-w-xl leading-relaxed">
                    Published Chrome extension that injects Rate My Professors metrics and review sentiment directly
                    into university course registration portals, eliminating manual tab-switching during class enrollment.
                  </p>
                </div>

                {/* Real Verified Links (Section 37) */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
                  <a
                    href="https://chromewebstore.google.com/detail/unirate/eeehacjdlohcgmhghnihgbgfmkbopcho"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full text-xs font-mono font-bold text-white bg-[#178BFF] hover:bg-[#0864C7] inline-flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <span>View UniRate</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="https://github.com/TheLeg336/UniRate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-pill px-4 py-2 rounded-full text-xs font-mono font-semibold text-[#17202A] hover:text-[#0864C7] inline-flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <Github className="w-3.5 h-3.5 text-[#178BFF]" />
                    <span>Source</span>
                    <ExternalLink className="w-2.5 h-2.5 text-[#94A3B8]" />
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Interactive Registration Demo */}
            <div className="w-full">
              <Reveal variant="visual">
                <UniRateVisual />
              </Reveal>
            </div>

            {/* Factual Product Breakdown (Section 36) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-black/5 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#FAFBFD] border border-[#CBD5E1]/60">
                <div className="text-[10.5px] uppercase text-[#0864C7] font-bold mb-1">WHY</div>
                <p className="text-[11px] text-[#475569] leading-relaxed font-sans">
                  Students lose desired class sections while repeatedly switching tabs to check professor ratings.
                  UniRate places faculty scores right where students register.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAFBFD] border border-[#CBD5E1]/60">
                <div className="text-[10.5px] uppercase text-[#0864C7] font-bold mb-1">BUILT</div>
                <p className="text-[11px] text-[#475569] leading-relaxed font-sans">
                  Conceived, architected, and built solo. Expanded multi-school string normalizers and DOM heuristics
                  using AI-assisted development and debugging.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAFBFD] border border-[#CBD5E1]/60">
                <div className="text-[10.5px] uppercase text-[#0864C7] font-bold mb-1">TECH STACK</div>
                <p className="text-[11px] text-[#475569] leading-relaxed font-sans">
                  JavaScript · HTML5 · CSS3 · Python · Chrome Extensions API · DOM Mutation Observers
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
