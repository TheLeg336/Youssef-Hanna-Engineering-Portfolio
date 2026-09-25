'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/components/motion/Reveal';

export function HeroVisual() {
  const prefersReducedMotion = useReducedMotion();
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setPointerPos({ x: x * 12, y: y * 12 });
  };

  const handlePointerLeave = () => {
    setPointerPos({ x: 0, y: 0 });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-[480px] aspect-[4/3] rounded-3xl glass-panel p-4 sm:p-6 overflow-hidden flex items-center justify-center select-none shadow-xl border border-black/5"
    >
      {/* Precision Blueprint Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none" />

      {/* Floating Environmental Pale Blue Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#178BFF]/12 rounded-full blur-[70px] pointer-events-none" />

      {/* SVG Vector Coordinate Canvas */}
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full relative z-10 overflow-visible"
      >
        <defs>
          <linearGradient id="heroLightGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#178BFF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#0864C7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="1" />
          </linearGradient>

          <radialGradient id="heroPointGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#178BFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#178BFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Technical Coordinate Baseline */}
        <line x1="30" y1="240" x2="370" y2="240" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="3 3" />
        <line x1="40" y1="40" x2="40" y2="250" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="3 3" />

        {/* Measurement Reference Ticks */}
        <line x1="120" y1="237" x2="120" y2="243" stroke="#94A3B8" strokeWidth="1" />
        <line x1="200" y1="237" x2="200" y2="243" stroke="#94A3B8" strokeWidth="1" />
        <line x1="280" y1="237" x2="280" y2="243" stroke="#94A3B8" strokeWidth="1" />

        {/* Structural Triangle Load-Path Schematic */}
        <polygon
          points="60,240 200,90 340,240"
          fill="none"
          stroke="rgba(23, 139, 255, 0.18)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Center Support Truss Member */}
        <line x1="200" y1="90" x2="200" y2="240" stroke="rgba(23, 139, 255, 0.25)" strokeWidth="1.5" />

        {/* Dynamic Curved Ballistic Flight Arc */}
        <motion.path
          d="M 60 240 Q 200 60 340 240"
          fill="none"
          stroke="url(#heroLightGrad)"
          strokeWidth="3"
          initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as const }}
        />

        {/* Apex Node with Subtle Parallax response */}
        <g
          transform={`translate(${pointerPos.x * 0.5}, ${pointerPos.y * 0.5})`}
          className="transition-transform duration-100 ease-out"
        >
          <circle cx="200" cy="90" r="14" fill="url(#heroPointGlow)" />
          <circle cx="200" cy="90" r="4.5" fill="#0864C7" />
          <circle cx="200" cy="90" r="9" fill="none" stroke="#178BFF" strokeWidth="1.2" />

          {/* Dimension Tag */}
          <rect x="215" y="76" width="94" height="22" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" className="shadow-xs" />
          <text x="262" y="91" fill="#0864C7" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            APEX VECTOR
          </text>
        </g>

        {/* Launch Node (Left) */}
        <circle cx="60" cy="240" r="4" fill="#178BFF" />

        {/* Impact / Target Node (Right) */}
        <circle cx="340" cy="240" r="4" fill="#059669" />
        <circle cx="340" cy="240" r="9" fill="none" stroke="#059669" strokeWidth="1" className="animate-ping opacity-40" />

        {/* Coordinate labels */}
        <text x="60" y="258" fill="#647184" fontSize="10" fontFamily="monospace" textAnchor="middle">
          X: 000
        </text>
        <text x="340" y="258" fill="#647184" fontSize="10" fontFamily="monospace" textAnchor="middle">
          RANGE: ~300 FT
        </text>
      </svg>

      {/* Floating Glass Calibration Pills */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="glass-pill px-3 py-1 rounded-full text-[10px] font-mono text-[#0864C7] font-semibold flex items-center gap-1.5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF] animate-pulse" />
          <span>AEROSPACE & MECHANICAL TRAJECTORY</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none hidden sm:block">
        <div className="glass-pill px-2.5 py-1 rounded-full text-[10px] font-mono text-[#647184] shadow-xs">
          Empirical Data · Tested & Measured
        </div>
      </div>
    </div>
  );
}
export default HeroVisual;
