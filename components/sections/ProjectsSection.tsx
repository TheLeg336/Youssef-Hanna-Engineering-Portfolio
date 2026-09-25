'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Github, ArrowUpRight, Link2, Check } from 'lucide-react';
import { LauncherVisual } from '@/components/projects/LauncherVisual';
import { DualSenseVisual } from '@/components/projects/DualSenseVisual';
import { EzerVisual } from '@/components/projects/EzerVisual';
import { UniRateVisual } from '@/components/projects/UniRateVisual';
import { Reveal } from '@/components/motion/Reveal';

function DirectProjectLink({
  slug,
  hash,
  title,
  align = 'start',
}: {
  slug: string;
  hash: string;
  title: string;
  align?: 'start' | 'center';
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/#${hash}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-2 pt-2.5 ${
        align === 'center' ? 'justify-center' : 'justify-start'
      }`}
    >
      <Link
        href={`/projects/${slug}`}
        className="px-3.5 py-1.5 rounded-full bg-[#178BFF]/10 hover:bg-[#178BFF]/20 border border-[#178BFF]/25 text-xs font-mono text-[#0864C7] font-semibold inline-flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
        title={`View full standalone case study for ${title}`}
      >
        <span>Full Case Study</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-[#178BFF]" />
      </Link>

      <button
        type="button"
        onClick={handleCopy}
        className="glass-pill px-3 py-1.5 rounded-full text-xs font-mono text-[#475569] hover:text-[#0864C7] inline-flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
        title={`Copy direct shareable link to #${hash} for recruiters`}
        aria-label={`Copy direct link to ${title}`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-[#10B981] font-semibold">Direct Link Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>Copy #{hash} Link</span>
          </>
        )}
      </button>
    </div>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="my-16 sm:my-24 scroll-mt-28">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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

              {/* Direct Jump Anchor Selector */}
              <div className="flex flex-wrap items-center gap-2 pt-3">
                <span className="text-[11px] font-mono text-[#647184] uppercase mr-1">
                  Direct Anchors:
                </span>
                {[
                  { name: '01 Launcher', hash: '#launcher' },
                  { name: '02 Ezer', hash: '#ezer' },
                  { name: '03 UniRate', hash: '#unirate' },
                  { name: '04 DualSense', hash: '#dualsense' },
                ].map((p) => (
                  <a
                    key={p.hash}
                    href={p.hash}
                    className="glass-pill px-2.5 py-1 rounded-full text-xs font-mono text-[#334155] hover:text-[#0864C7] shadow-2xs transition-all active:scale-95"
                  >
                    {p.name}
                  </a>
                ))}
              </div>
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#647184] max-w-md">
              Four projects spanning mechanical design, embedded hardware, engineering automation, and software.
            </p>
          </div>
        </Reveal>

        <div className="space-y-24 sm:space-y-28 lg:space-y-32">
          {/* =========================================================================
              PROJECT 01: PRECISION TENNIS BALL LAUNCHER (Mechanical & Prototyping)
              Direct Link: #launcher
             ========================================================================= */}
          <article
            id="launcher"
            className="scroll-mt-24 sm:scroll-mt-28 rounded-3xl p-4 sm:p-6 lg:p-8 bg-[#FAFBFD]/60 border border-slate-200/60 shadow-xs"
          >
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

                  {/* Direct Link & Case Study Share Widget */}
                  <DirectProjectLink slug="launcher" hash="launcher" title="Precision Tennis Ball Launcher" />
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
              PROJECT 02: EZER (Featured Experimental Project)
              Direct Link: #ezer
             ========================================================================= */}
          <article
            id="ezer"
            className="scroll-mt-24 sm:scroll-mt-28 rounded-3xl p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]/80 border border-slate-200/80 shadow-xs"
          >
            <Reveal variant="standard">
              <div className="max-w-3xl mx-auto text-center mb-8">
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#647184] mb-1">
                  <span className="text-[#0864C7] font-bold">02</span>
                  <span className="text-black/20">/</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[11px] text-[#17202A] font-semibold">
                    Engineering Automation &amp; HCI
                  </span>
                  <span className="text-black/20">·</span>
                  <span className="text-[#0864C7] font-semibold">In Active Development</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-[#17202A] tracking-tight mt-1">
                  Ezer
                </h3>

                <p className="text-sm sm:text-base text-[#4B596A] mt-2 leading-relaxed max-w-2xl mx-auto">
                  Experimental local desktop assistant exploring fast on-device computer control and automated
                  CAD engineering workflows. Concept demonstration illustrates natural language geometry synthesis
                  and live parametric modification.
                </p>

                {/* Direct Link & Case Study Share Widget */}
                <DirectProjectLink slug="ezer" hash="ezer" title="Ezer CAD Automation" align="center" />
              </div>
            </Reveal>

            {/* Large Centered Visualizer (75–85% width on large displays) */}
            <div className="max-w-5xl mx-auto">
              <Reveal variant="visual">
                <EzerVisual />
              </Reveal>
            </div>

            {/* Two Concise Columns Below */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto mt-6 pt-6 border-t border-black/5 text-xs font-mono">
              <div className="p-4 rounded-xl bg-white border border-[#CBD5E1]/60 shadow-2xs">
                <div className="text-[11px] uppercase text-[#0864C7] font-bold mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF]" />
                  WHAT I&apos;M EXPLORING
                </div>
                <ul className="space-y-1.5 text-[#334155]">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#178BFF]">•</span>
                    <span>Local AI inference for privacy-preserving computer control</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#178BFF]">•</span>
                    <span>Deterministic CAD synthesis with explicit safety approval gates</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#178BFF]">•</span>
                    <span>Repetitive mechanical modeling workflows and constraint generation</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#CBD5E1]/60 shadow-2xs">
                <div className="text-[11px] uppercase text-[#0864C7] font-bold mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF]" />
                  MY ROLE &amp; APPROACH
                </div>
                <ul className="space-y-1.5 text-[#334155]">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#178BFF]">•</span>
                    <span>Product concept, systems architecture, and state-machine design</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#178BFF]">•</span>
                    <span>Interactive UI/UX design with cognitive state feedback</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#178BFF]">•</span>
                    <span>AI-assisted systems development in Tauri, Rust, and SolidJS</span>
                  </li>
                </ul>
              </div>
            </div>
          </article>

          {/* =========================================================================
              PROJECT 03: UNIRATE (Published Product)
              Direct Link: #unirate
             ========================================================================= */}
          <article
            id="unirate"
            className="scroll-mt-24 sm:scroll-mt-28 rounded-3xl p-4 sm:p-6 lg:p-8 bg-white border border-slate-200/80 shadow-xs"
          >
            <Reveal variant="standard">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#647184] mb-1">
                    <span className="text-[#0864C7] font-bold">03</span>
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

                  {/* Direct Link & Case Study Share Widget */}
                  <DirectProjectLink slug="unirate" hash="unirate" title="UniRate Chrome Extension" />
                </div>

                {/* Real Verified Links */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
                  <a
                    href="https://chromewebstore.google.com/detail/unirate/eeehacjdlohcgmhghnihgbgfmkbopcho"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full text-xs font-mono font-bold text-white bg-[#178BFF] hover:bg-[#0864C7] inline-flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <span>Chrome Web Store</span>
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

            {/* Factual Product Breakdown */}
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

          {/* =========================================================================
              PROJECT 04: DUALSENSE PC INTERFACE (Embedded Systems)
              Direct Link: #dualsense
             ========================================================================= */}
          <article
            id="dualsense"
            className="scroll-mt-24 sm:scroll-mt-28 rounded-3xl p-4 sm:p-6 lg:p-8 bg-white border border-slate-200/80 shadow-xs"
          >
            <Reveal variant="standard">
              <div className="max-w-3xl mb-6">
                <div className="flex items-center gap-2 text-xs font-mono text-[#647184] mb-1">
                  <span className="text-[#0864C7] font-bold">04</span>
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

                {/* Direct Link & Case Study Share Widget */}
                <DirectProjectLink slug="dualsense" hash="dualsense" title="DualSense PC Interface" />
              </div>
            </Reveal>

            {/* Near-Full-Width Interactive Architecture */}
            <div className="w-full">
              <Reveal variant="visual">
                <DualSenseVisual />
              </Reveal>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
