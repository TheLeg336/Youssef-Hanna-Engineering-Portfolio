'use client';

import React from 'react';
import { Mail, Github, FileText, ArrowUpRight, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from '@/lib/portfolio-data';
import { AppBorderBeam } from '@/components/ui/LibrariesDevWrapper';
import { Reveal } from '@/components/motion/Reveal';

export function ContactSection() {
  return (
    <section id="contact" className="my-16 sm:my-24 scroll-mt-28 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Large Statement (Section 55) */}
        <Reveal variant="heading">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-mono text-[#0864C7] font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#178BFF] animate-pulse" />
              <span>Seeking Summer 2027 Internships</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#17202A] leading-[1.08]">
              Let&apos;s build the next one.
            </h2>

            <p className="text-sm sm:text-base text-[#4B596A] max-w-xl mx-auto leading-relaxed pt-1">
              Looking for Summer 2027 engineering internship opportunities, especially in aerospace,
              mechanical design, robotics, mechatronics, and autonomous systems.
            </p>
          </div>
        </Reveal>

        {/* Floating Liquid-Glass Contact Dock (Section 55) */}
        <Reveal variant="visual" delay={0.12}>
          <div className="mt-8 sm:mt-10 flex justify-center">
            <div className="glass-dock rounded-full p-2 sm:p-2.5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {/* Email Direct */}
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="liquid-glass-btn-neutral px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-semibold text-[#17202A] hover:text-[#0864C7] inline-flex items-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <Mail className="w-4 h-4 text-[#178BFF]" />
                <span>Email Youssef</span>
              </a>

              {/* Resume PDF (PRIMARY LIQUID GLASS WITH AURORA BORDER BEAM) */}
              <AppBorderBeam colorVariant="aurora" size="sm" className="rounded-full shadow-md">
                <a
                  href={PERSONAL_INFO.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-glass-btn-primary px-5 sm:px-6 py-2.5 rounded-full text-xs font-mono font-bold text-white inline-flex items-center gap-2 transition-all active:scale-95"
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
                className="liquid-glass-btn-neutral px-3.5 py-2.5 rounded-full text-xs font-mono text-[#475569] hover:text-[#17202A] inline-flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
              >
                <Github className="w-3.5 h-3.5 text-[#178BFF]" />
                <span>GitHub</span>
                <ExternalLink className="w-2.5 h-2.5 text-[#94A3B8]" />
              </a>

              {/* Handshake */}
              <a
                href={PERSONAL_INFO.handshake}
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass-btn-neutral px-3.5 py-2.5 rounded-full text-xs font-mono text-[#475569] hover:text-[#17202A] inline-flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
              >
                <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
                <span>Handshake</span>
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
