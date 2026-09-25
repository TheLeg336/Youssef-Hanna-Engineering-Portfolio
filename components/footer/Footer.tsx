'use client';

import React from 'react';
import { PERSONAL_INFO } from '@/lib/portfolio-data';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-black/5 py-8 px-4 sm:px-6 text-center text-xs font-mono text-[#647184] bg-[#FAFBFD]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span className="text-[#17202A] font-bold">{PERSONAL_INFO.name}</span>
          <span className="mx-2 text-[#CBD5E1]">·</span>
          <span>Mechanical Engineering</span>
          <span className="mx-2 text-[#CBD5E1]">·</span>
          <span>Cal Poly Pomona</span>
        </div>

        <div className="text-[11px] text-[#94A3B8]">
          © {currentYear} · Precision Engineering Portfolio
        </div>
      </div>
    </footer>
  );
}
export default Footer;
