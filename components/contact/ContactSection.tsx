'use client';

import React, { useState } from 'react';
import { Mail, Check, Copy, Github, FileText, ArrowUpRight, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from '@/lib/portfolio-data';
import { AppBorderBeam } from '@/components/ui/LibrariesDevWrapper';
import { Reveal } from '@/components/motion/Reveal';

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section id="contact" className="my-24 sm:my-32 scroll-mt-24 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Large Statement */}
        <Reveal variant="heading">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-mono text-[#0864C7] font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#178BFF] animate-pulse" />
              <span>Available for Summer 2027 Internships</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#17202A] leading-[1.08]">
              BUILD SOMETHING<br />THAT HAS TO WORK.
            </h2>

            <p className="text-sm sm:text-base text-[#4B596A] max-w-xl mx-auto leading-relaxed pt-2">
              Interested in Summer 2027 engineering internships across aerospace, mechanical design,
              robotics, mechatronics, and autonomous systems.
            </p>
          </div>
        </Reveal>

        {/* Floating Liquid-Glass Contact Dock with Real Links */}
        <Reveal variant="visual" delay={0.15}>
          <div className="mt-10 sm:mt-12 flex justify-center">
            <div className="glass-dock bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_16px_40px_-12px_rgba(23,139,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-full p-2 sm:p-2.5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {/* Left Button: Email Direct (Liquid Glass Pill - NOT Blue) */}
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="glass-pill px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-semibold text-[#17202A] hover:text-[#0864C7] bg-white/80 hover:bg-white border border-[#CBD5E1]/70 hover:border-[#178BFF]/40 inline-flex items-center gap-2 shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] active:scale-95"
              >
                <Mail className="w-4 h-4 text-[#178BFF]" />
                <span>Email Youssef</span>
              </a>

              {/* Copy Email Button */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="glass-pill px-3.5 py-2.5 rounded-full text-xs font-mono text-[#475569] hover:text-[#17202A] bg-white/80 hover:bg-white border border-[#CBD5E1]/70 inline-flex items-center gap-1.5 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] active:scale-95 cursor-pointer"
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#178BFF]" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* MIDDLE BUTTON: Resume PDF (PRIMARY BLUE WITH LIQUID GLASS EFFECTS & BORDER BEAM) */}
              <AppBorderBeam colorVariant="ocean" size="sm" className="rounded-full shadow-md">
                <a
                  href={PERSONAL_INFO.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full text-xs font-mono font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#178BFF] to-[#38BDF8] shadow-[0_4px_16px_rgba(23,139,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.5)] hover:shadow-[0_6px_22px_rgba(23,139,255,0.65)] hover:brightness-105 inline-flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>Resume PDF</span>
                  <ArrowUpRight className="w-3 h-3 text-white/80" />
                </a>
              </AppBorderBeam>

              {/* GitHub */}
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-pill px-3.5 py-2.5 rounded-full text-xs font-mono text-[#475569] hover:text-[#17202A] bg-white/80 hover:bg-white border border-[#CBD5E1]/70 inline-flex items-center gap-1.5 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] active:scale-95"
              >
                <Github className="w-3.5 h-3.5 text-[#178BFF]" />
                <span className="hidden sm:inline">GitHub</span>
              </a>

              {/* Handshake */}
              <a
                href={PERSONAL_INFO.handshake}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-pill px-3.5 py-2.5 rounded-full text-xs font-mono text-[#475569] hover:text-[#17202A] bg-white/80 hover:bg-white border border-[#CBD5E1]/70 inline-flex items-center gap-1.5 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] active:scale-95"
              >
                <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
                <span className="hidden sm:inline">Handshake</span>
                <ExternalLink className="w-2.5 h-2.5 text-[#94A3B8]" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
export default ContactSection;
