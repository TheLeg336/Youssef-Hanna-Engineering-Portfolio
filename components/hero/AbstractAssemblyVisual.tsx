'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export function AbstractAssemblyVisual() {
  const prefersReducedMotion = useReducedMotion();
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setPointerPos({ x: x * 14, y: y * 10 });
  };

  const handlePointerLeave = () => {
    setPointerPos({ x: 0, y: 0 });
  };

  // Idle vertical breathing offsets for staggered exploded sensation
  // Each part has its own subtle vertical float
  const breathingTransition = (delay: number) =>
    prefersReducedMotion
      ? { duration: 0 }
      : {
          duration: 6.5,
          repeat: Infinity,
          repeatType: 'reverse' as const,
          ease: 'easeInOut' as const,
          delay,
        };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-[500px] aspect-[4/3.8] rounded-3xl glass-panel p-3.5 sm:p-5 overflow-hidden flex flex-col justify-between select-none shadow-xl border border-black/5"
    >
      {/* Background Precision Blueprint Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-35 pointer-events-none" />
      <div className="absolute inset-0 bg-tech-grid-fine opacity-20 pointer-events-none" />

      {/* Ambient Aerospace Blue Glow in upper center */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#178BFF]/10 rounded-full blur-[75px] pointer-events-none" />

      {/* TOP HUD BAR */}
      <div className="relative z-20 flex items-center justify-between text-[10px] font-mono text-[#647184] border-b border-black/[0.06] pb-2.5 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#178BFF] animate-pulse" />
          <span className="font-semibold text-[#0864C7] tracking-wider">ASM-084 // EXPLODED KINEMATIC STACK</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[#94A3B8]">ISOMETRIC 30°</span>
          <span className="px-1.5 py-0.5 rounded bg-white/80 border border-[#CBD5E1] text-[#334155] font-semibold text-[9px]">
            TOL ±0.02
          </span>
        </div>
      </div>

      {/* SVG Vector Canvas */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center py-1 overflow-visible">
        <svg
          viewBox="0 0 460 410"
          className="w-full h-full max-h-[350px] overflow-visible"
        >
          <defs>
            {/* Gradients for Machined 6061 Aluminum */}
            <linearGradient id="aluSurface" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            <linearGradient id="aluSideLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>

            <linearGradient id="aluSideRight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Bronze / Steel Shaft Gradient */}
            <linearGradient id="steelShaft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="25%" stopColor="#CBD5E1" />
              <stop offset="50%" stopColor="#F8FAFC" />
              <stop offset="75%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Dark Anodized Slate */}
            <linearGradient id="darkAnodized" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* PCB Substrate Gradient */}
            <linearGradient id="pcbPlate" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0E2338" />
              <stop offset="100%" stopColor="#091422" />
            </linearGradient>

            {/* Aerospace Blue Laser Pulse */}
            <linearGradient id="laserPulseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#178BFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="1" />
              <stop offset="100%" stopColor="#178BFF" stopOpacity="0" />
            </linearGradient>

            {/* Drop Shadow for components */}
            <filter id="partGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* ============================================================== */}
          {/* STATIC BACKGROUND: Centerline Axis & Datum Reference Markers   */}
          {/* ============================================================== */}
          {/* Vertical Assembly Centerline */}
          <line
            x1="230"
            y1="25"
            x2="230"
            y2="385"
            stroke="#178BFF"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.45"
          />

          {/* Traveling Aerospace Blue Axis Pulse */}
          {!prefersReducedMotion && (
            <motion.line
              x1="230"
              y1="25"
              x2="230"
              y2="105"
              stroke="url(#laserPulseGrad)"
              strokeWidth="2.5"
              initial={{ y1: 25, y2: 105, opacity: 0 }}
              animate={{
                y1: [25, 305, 305],
                y2: [105, 385, 385],
                opacity: [0, 0.9, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                repeatDelay: 3.5,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* DATUM [ -A- ] Callout at Bottom Left */}
          <g transform="translate(68, 350)">
            <rect
              x="0"
              y="-10"
              width="36"
              height="20"
              rx="3"
              fill="#FFFFFF"
              stroke="#94A3B8"
              strokeWidth="1"
              className="shadow-xs"
            />
            <text
              x="18"
              y="4"
              textAnchor="middle"
              fill="#0864C7"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              [-A-]
            </text>
            <line x1="36" y1="0" x2="95" y2="0" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="95" cy="0" r="2" fill="#0864C7" />
          </g>

          {/* TECHNICAL CALLOUT RIGHT: Diameter Reference */}
          <g transform="translate(330, 215)">
            <line x1="-35" y1="0" x2="30" y2="0" stroke="#94A3B8" strokeWidth="0.9" strokeDasharray="2 2" />
            <circle cx="-35" cy="0" r="2" fill="#178BFF" />
            <rect
              x="35"
              y="-10"
              width="78"
              height="20"
              rx="3"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="0.9"
            />
            <text
              x="74"
              y="4"
              textAnchor="middle"
              fill="#475569"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="600"
            >
              Ø 48.00 REF
            </text>
          </g>

          {/* ============================================================== */}
          {/* LAYER 1: Baseplate Fixture (Lowest component)                  */}
          {/* ============================================================== */}
          <motion.g
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [0, 4, 0],
                    x: pointerPos.x * 0.25,
                  }
            }
            transition={breathingTransition(0)}
          >
            {/* Baseplate Extruded Sides */}
            <path
              d="M 125 330 L 125 344 L 230 384 L 230 370 Z"
              fill="url(#aluSideLeft)"
              stroke="#64748B"
              strokeWidth="0.8"
            />
            <path
              d="M 230 370 L 230 384 L 335 344 L 335 330 Z"
              fill="url(#aluSideRight)"
              stroke="#64748B"
              strokeWidth="0.8"
            />

            {/* Baseplate Isometric Top Surface */}
            <polygon
              points="125,330 230,290 335,330 230,370"
              fill="url(#aluSurface)"
              stroke="#475569"
              strokeWidth="1.2"
            />

            {/* Recessed Pocket Detail on Baseplate */}
            <polygon
              points="155,330 230,302 305,330 230,358"
              fill="#E2E8F0"
              stroke="#94A3B8"
              strokeWidth="0.8"
              strokeDasharray="2 2"
            />

            {/* Center Mounting Pilot Bore */}
            <ellipse cx="230" cy="330" rx="36" ry="16" fill="#CBD5E1" stroke="#475569" strokeWidth="1" />
            <ellipse cx="230" cy="330" rx="22" ry="10" fill="#94A3B8" stroke="#334155" strokeWidth="1" />

            {/* 4x Corner Tapped Bores with Chamfers */}
            <ellipse cx="145" cy="330" rx="5" ry="2.5" fill="#475569" stroke="#94A3B8" strokeWidth="0.8" />
            <ellipse cx="315" cy="330" rx="5" ry="2.5" fill="#475569" stroke="#94A3B8" strokeWidth="0.8" />
            <ellipse cx="230" cy="298" rx="5" ry="2.5" fill="#475569" stroke="#94A3B8" strokeWidth="0.8" />
            <ellipse cx="230" cy="362" rx="5" ry="2.5" fill="#475569" stroke="#94A3B8" strokeWidth="0.8" />

            {/* Coordinate Crosshairs at Datum Origin */}
            <line x1="222" y1="330" x2="238" y2="330" stroke="#0864C7" strokeWidth="0.8" />
            <line x1="230" y1="326" x2="230" y2="334" stroke="#0864C7" strokeWidth="0.8" />
          </motion.g>

          {/* ============================================================== */}
          {/* LAYER 2: Lower Bearing Flange / Retaining Collar (Y ≈ 280)    */}
          {/* ============================================================== */}
          <motion.g
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [-4, 3, -4],
                    x: pointerPos.x * 0.45,
                  }
            }
            transition={breathingTransition(0.3)}
          >
            {/* Exploded Leader Dotted Line to Base */}
            <line x1="230" y1="290" x2="230" y2="318" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="2 2" />

            {/* Outer Flange Cylinder Sides */}
            <path
              d="M 182 278 L 182 288 A 48 20 0 0 0 278 288 L 278 278 Z"
              fill="url(#aluSideLeft)"
              stroke="#475569"
              strokeWidth="0.8"
            />
            {/* Flange Top Surface */}
            <ellipse cx="230" cy="278" rx="48" ry="20" fill="url(#aluSurface)" stroke="#475569" strokeWidth="1" />

            {/* Inner Ring Bore */}
            <ellipse cx="230" cy="278" rx="28" ry="12" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
            <ellipse cx="230" cy="278" rx="18" ry="8" fill="#94A3B8" stroke="#334155" strokeWidth="1" />

            {/* Bolt Pattern Holes on Flange */}
            <circle cx="195" cy="278" r="2.2" fill="#475569" />
            <circle cx="265" cy="278" r="2.2" fill="#475569" />
            <circle cx="230" cy="265" r="2.2" fill="#475569" />
            <circle cx="230" cy="291" r="2.2" fill="#475569" />
          </motion.g>

          {/* ============================================================== */}
          {/* LAYER 3: Polymer Vibration Isolation Ring (Y ≈ 246)           */}
          {/* ============================================================== */}
          <motion.g
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [-8, 2, -8],
                    x: pointerPos.x * 0.6,
                  }
            }
            transition={breathingTransition(0.6)}
          >
            {/* Gasket Side */}
            <path
              d="M 194 246 L 194 251 A 36 15 0 0 0 266 251 L 266 246 Z"
              fill="#0F172A"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Gasket Top */}
            <ellipse cx="230" cy="246" rx="36" ry="15" fill="url(#darkAnodized)" stroke="#475569" strokeWidth="0.9" />
            <ellipse cx="230" cy="246" rx="22" ry="9" fill="#090D16" stroke="#1E293B" strokeWidth="0.8" />
          </motion.g>

          {/* ============================================================== */}
          {/* LAYER 4: Stepped Drive Spindle / Rotor Shaft (Y ≈ 200)         */}
          {/* ============================================================== */}
          <motion.g
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [-12, 1, -12],
                    x: pointerPos.x * 0.75,
                  }
            }
            transition={breathingTransition(0.9)}
          >
            {/* Lower Shoulder Cylinder */}
            <path
              d="M 206 205 L 206 217 A 24 10 0 0 0 254 217 L 254 205 Z"
              fill="url(#steelShaft)"
              stroke="#334155"
              strokeWidth="0.8"
            />
            <ellipse cx="230" cy="205" rx="24" ry="10" fill="url(#aluSurface)" stroke="#475569" strokeWidth="0.9" />

            {/* Stepped Upper Shaft Body */}
            <path
              d="M 216 172 L 216 205 A 14 6 0 0 0 244 205 L 244 172 Z"
              fill="url(#steelShaft)"
              stroke="#334155"
              strokeWidth="0.9"
            />
            {/* Upper Shaft Crown Ellipse */}
            <ellipse cx="230" cy="172" rx="14" ry="6" fill="#F8FAFC" stroke="#475569" strokeWidth="0.9" />

            {/* Machined Keyway Slot on Shaft */}
            <line x1="224" y1="180" x2="224" y2="198" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="224" y1="180" x2="224" y2="198" stroke="#F1F5F9" strokeWidth="0.6" strokeLinecap="round" />

            {/* Circlip Retaining Ring Groove */}
            <ellipse
              cx="230"
              cy="188"
              rx="14"
              ry="6"
              fill="none"
              stroke="#0864C7"
              strokeWidth="1.2"
              opacity="0.8"
            />
          </motion.g>

          {/* ============================================================== */}
          {/* LAYER 5: Electromechanical Logic & Sensor PCB (Y ≈ 145)        */}
          {/* ============================================================== */}
          <motion.g
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [-16, 0, -16],
                    x: pointerPos.x * 0.9,
                  }
            }
            transition={breathingTransition(1.2)}
          >
            {/* PCB Substrate Edge Thickness */}
            <path
              d="M 160 148 L 160 153 L 230 178 L 300 153 L 300 148 L 230 173 Z"
              fill="#06121C"
              stroke="#0864C7"
              strokeWidth="0.6"
            />

            {/* Octagonal PCB Top Surface */}
            <polygon
              points="180,123 280,123 310,143 280,163 180,163 150,143"
              fill="url(#pcbPlate)"
              stroke="#178BFF"
              strokeWidth="1"
            />

            {/* High-Tech Circuit Traces (Cyan & Gold) */}
            <path
              d="M 170 140 L 195 140 L 205 133 L 220 133"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle cx="170" cy="140" r="1.8" fill="#38BDF8" />

            <path
              d="M 290 140 L 265 140 L 255 147 L 240 147"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle cx="290" cy="140" r="1.8" fill="#38BDF8" />

            <path
              d="M 230 130 L 230 135"
              fill="none"
              stroke="#22C55E"
              strokeWidth="1"
            />

            {/* Central Microcontroller QFN IC Package */}
            <rect
              x="218"
              y="136"
              width="24"
              height="14"
              rx="1.5"
              fill="#0A0E17"
              stroke="#64748B"
              strokeWidth="0.8"
            />
            {/* IC Pinouts (tiny silver marks) */}
            <line x1="222" y1="134" x2="222" y2="136" stroke="#CBD5E1" strokeWidth="0.8" />
            <line x1="226" y1="134" x2="226" y2="136" stroke="#CBD5E1" strokeWidth="0.8" />
            <line x1="234" y1="134" x2="234" y2="136" stroke="#CBD5E1" strokeWidth="0.8" />
            <line x1="238" y1="134" x2="238" y2="136" stroke="#CBD5E1" strokeWidth="0.8" />

            <line x1="222" y1="150" x2="222" y2="152" stroke="#CBD5E1" strokeWidth="0.8" />
            <line x1="226" y1="150" x2="226" y2="152" stroke="#CBD5E1" strokeWidth="0.8" />
            <line x1="234" y1="150" x2="234" y2="152" stroke="#CBD5E1" strokeWidth="0.8" />
            <line x1="238" y1="150" x2="238" y2="152" stroke="#CBD5E1" strokeWidth="0.8" />

            {/* IC Laser Marking Label */}
            <text
              x="230"
              y="145.5"
              textAnchor="middle"
              fill="#38BDF8"
              fontSize="6"
              fontFamily="monospace"
              fontWeight="bold"
            >
              MCU-ARM
            </text>

            {/* SMT Passive Components (0402 caps) */}
            <rect x="206" y="142" width="5" height="3" rx="0.5" fill="#CBD5E1" stroke="#475569" strokeWidth="0.5" />
            <rect x="249" y="137" width="5" height="3" rx="0.5" fill="#CBD5E1" stroke="#475569" strokeWidth="0.5" />

            {/* Flexible Ribbon Wire Harness curving out from PCB */}
            <path
              d="M 152 143 C 120 148, 110 180, 118 205"
              fill="none"
              stroke="#0284C7"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M 152 143 C 120 148, 110 180, 118 205"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.9"
            />
          </motion.g>

          {/* ============================================================== */}
          {/* LAYER 6: Lightweight Aerospace Bracket / Clevis (Y ≈ 95)       */}
          {/* ============================================================== */}
          <motion.g
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [-20, -2, -20],
                    x: pointerPos.x * 1.1,
                  }
            }
            transition={breathingTransition(1.5)}
          >
            {/* Exploded Leader Line */}
            <line x1="230" y1="95" x2="230" y2="120" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="2 2" />

            {/* Machined Clevis Arch - 6061 Aluminum */}
            <path
              d="M 190 98 L 190 106 A 40 16 0 0 0 270 106 L 270 98 Z"
              fill="url(#aluSideLeft)"
              stroke="#475569"
              strokeWidth="0.8"
            />
            <ellipse cx="230" cy="98" rx="40" ry="16" fill="url(#aluSurface)" stroke="#475569" strokeWidth="1" />

            {/* Weight Reduction / Skeletonized Pockets */}
            <ellipse cx="210" cy="98" rx="8" ry="3.5" fill="#CBD5E1" stroke="#64748B" strokeWidth="0.8" />
            <ellipse cx="250" cy="98" rx="8" ry="3.5" fill="#CBD5E1" stroke="#64748B" strokeWidth="0.8" />

            {/* Central Spindle Passthrough Bore */}
            <ellipse cx="230" cy="98" rx="16" ry="7" fill="#94A3B8" stroke="#334155" strokeWidth="1" />

            {/* Fastener Tapped Bores */}
            <circle cx="198" cy="98" r="1.8" fill="#1E293B" />
            <circle cx="262" cy="98" r="1.8" fill="#1E293B" />
          </motion.g>

          {/* ============================================================== */}
          {/* LAYER 7: Top Anodized Retaining Collar (Y ≈ 60)                */}
          {/* ============================================================== */}
          <motion.g
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [-24, -4, -24],
                    x: pointerPos.x * 1.25,
                  }
            }
            transition={breathingTransition(1.8)}
          >
            {/* Collar Side */}
            <path
              d="M 205 60 L 205 66 A 25 10 0 0 0 255 66 L 255 60 Z"
              fill="url(#aluSideLeft)"
              stroke="#475569"
              strokeWidth="0.8"
            />
            {/* Collar Top */}
            <ellipse cx="230" cy="60" rx="25" ry="10" fill="url(#aluSurface)" stroke="#475569" strokeWidth="1" />
            <ellipse cx="230" cy="60" rx="14" ry="5.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="0.8" />

            {/* Laser Calibrated Alignment Degree Marks */}
            <line x1="208" y1="60" x2="212" y2="60" stroke="#0864C7" strokeWidth="1" />
            <line x1="248" y1="60" x2="252" y2="60" stroke="#0864C7" strokeWidth="1" />
            <line x1="230" y1="52" x2="230" y2="55" stroke="#0864C7" strokeWidth="1" />
            <line x1="230" y1="65" x2="230" y2="68" stroke="#0864C7" strokeWidth="1" />
          </motion.g>

          {/* ============================================================== */}
          {/* LAYER 8: Suspended Socket Head Cap Screws (SHCS M4) (Y ≈ 30)   */}
          {/* ============================================================== */}
          <motion.g
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [-28, -6, -28],
                    x: pointerPos.x * 1.35,
                  }
            }
            transition={breathingTransition(2.1)}
          >
            {/* Left Fastener */}
            <g transform="translate(198, 28)">
              {/* Exploded Leader Line down to bracket */}
              <line x1="0" y1="12" x2="0" y2="68" stroke="#94A3B8" strokeWidth="0.7" strokeDasharray="1.5 1.5" />
              {/* Threaded Shank */}
              <rect x="-1" y="4" width="2" height="10" fill="#64748B" stroke="#475569" strokeWidth="0.4" />
              {/* Cap Head */}
              <rect x="-3" y="0" width="6" height="5" rx="0.8" fill="url(#aluSurface)" stroke="#334155" strokeWidth="0.7" />
              {/* Hex Socket */}
              <rect x="-1.2" y="1" width="2.4" height="2" fill="#1E293B" />
            </g>

            {/* Right Fastener */}
            <g transform="translate(262, 28)">
              {/* Exploded Leader Line down to bracket */}
              <line x1="0" y1="12" x2="0" y2="68" stroke="#94A3B8" strokeWidth="0.7" strokeDasharray="1.5 1.5" />
              {/* Threaded Shank */}
              <rect x="-1" y="4" width="2" height="10" fill="#64748B" stroke="#475569" strokeWidth="0.4" />
              {/* Cap Head */}
              <rect x="-3" y="0" width="6" height="5" rx="0.8" fill="url(#aluSurface)" stroke="#334155" strokeWidth="0.7" />
              {/* Hex Socket */}
              <rect x="-1.2" y="1" width="2.4" height="2" fill="#1E293B" />
            </g>
          </motion.g>

          {/* ============================================================== */}
          {/* CALLOUT LEFT: Embedded Subsystem Annotation                   */}
          {/* ============================================================== */}
          <g transform="translate(42, 142)">
            <line x1="106" y1="0" x2="68" y2="0" stroke="#178BFF" strokeWidth="0.9" />
            <circle cx="106" cy="0" r="2" fill="#178BFF" />
            <rect
              x="0"
              y="-10"
              width="66"
              height="20"
              rx="3"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="0.9"
            />
            <text
              x="33"
              y="4"
              textAnchor="middle"
              fill="#0864C7"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              EMBEDDED MCU
            </text>
          </g>
        </svg>
      </div>

      {/* BOTTOM METADATA BAR */}
      <div className="relative z-20 flex items-center justify-between text-[11px] font-mono border-t border-black/[0.06] pt-2.5 px-1">
        <div className="flex items-center gap-1.5 font-bold text-[#0F1E31] tracking-wide">
          <span>MECHANICAL</span>
          <span className="text-[#94A3B8]">·</span>
          <span>EMBEDDED</span>
          <span className="text-[#94A3B8]">·</span>
          <span className="text-[#0864C7]">SYSTEMS</span>
        </div>
        <div className="text-[10px] text-[#647184] hidden sm:block">
          CAD/CAM VERIFIED · 6061-T6
        </div>
      </div>
    </div>
  );
}

export default AbstractAssemblyVisual;
