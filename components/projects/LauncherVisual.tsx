'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '@/components/motion/Reveal';
import { useElementVisibility } from '@/lib/useVisibility';

// Spatial coordinates for clean aerospace schematic plot:
// Origin: (55, 175)
// Target ~100 ft: x = 180, y = 175
// Landing ~300 ft: x = 460, y = 175
// Illustrative peak: (260, 50)
const ORIGIN = { x: 55, y: 175 };
const LANDING = { x: 460, y: 175 };
// For quadratic Bézier with endpoints (55, 175) and (460, 175) to achieve apex at y = 50:
// B_y(0.5) = (175 + CTRL.y) / 2 = 50  =>  CTRL.y = 2 * 50 - 175 = -75
// Midpoint CTRL.x = (55 + 460) / 2 = 257.5
const CTRL = { x: 257.5, y: -75 };
const PEAK = { x: 257.5, y: 50 };
const TARGET_100_X = 180;

interface LauncherVisualProps {
  idPrefix?: string;
}

export function LauncherVisual({ idPrefix = 'launcher' }: LauncherVisualProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useElementVisibility(containerRef, 0.25);
  const prefersReduced = useReducedMotion();
  const [progress, setProgress] = useState(1); // 0 to 1
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  const pathGradId = `${idPrefix}-pathGrad`;
  const fillGradId = `${idPrefix}-fillGrad`;

  const reqIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const flightDurationMs = 2800; // time to draw trajectory from 0 to ~300 ft
  const holdDurationMs = 3600; // gentle hold at landed state before soft loop
  const totalCycleMs = flightDurationMs + holdDurationMs;

  useEffect(() => {
    if (prefersReduced || !isVisible) {
      lastTimeRef.current = null;
      return;
    }

    lastTimeRef.current = performance.now();
    let animId: number;

    const step = (now: number) => {
      if (lastTimeRef.current !== null) {
        const delta = Math.min(100, now - lastTimeRef.current);
        elapsedRef.current = (elapsedRef.current + delta) % totalCycleMs;
        const p = Math.min(1, elapsedRef.current / flightDurationMs);
        setProgress(p);
      }
      lastTimeRef.current = now;
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    reqIdRef.current = animId;
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [prefersReduced, isVisible, totalCycleMs, flightDurationMs]);

  // Projectile normalized parameter t (0 to 1)
  const flightT = useMemo(() => {
    if (progress < 0.12) return 0;
    if (progress >= 0.88) return 1;
    return (progress - 0.12) / 0.76;
  }, [progress]);

  // Trajectory calculations via de Casteljau quadratic Bézier evaluation
  const ballX = ORIGIN.x + (LANDING.x - ORIGIN.x) * flightT;
  const ballY =
    (1 - flightT) * (1 - flightT) * ORIGIN.y +
    2 * (1 - flightT) * flightT * CTRL.y +
    flightT * flightT * LANDING.y;

  // De Casteljau sub-curve control point for the active drawn segment [0, flightT]
  const activeCtrlX = ORIGIN.x + (CTRL.x - ORIGIN.x) * flightT;
  const activeCtrlY = ORIGIN.y + (CTRL.y - ORIGIN.y) * flightT;

  const hasPassedTarget = flightT >= (TARGET_100_X - ORIGIN.x) / (LANDING.x - ORIGIN.x);
  const isLanded = flightT >= 1;

  return (
    <div
      ref={containerRef}
      className="w-full glass-panel rounded-2xl p-5 sm:p-6 overflow-hidden select-none flex flex-col justify-between"
    >
      {/* Header: Verified Title & Schematic Honesty Label (No Replay button per user request) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-3 mb-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#0864C7] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
            Mechanical Design &amp; Rapid Prototyping · 2024
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#17202A] mt-0.5">
            Target vs. Achieved Range
          </h3>
        </div>

        <span className="px-2.5 py-1 rounded-md bg-[#EEF2F6] text-[10px] font-mono text-[#647184] font-semibold border border-[#CBD5E1]/60 self-start sm:self-auto">
          SCHEMATIC — NOT TO SCALE
        </span>
      </div>

      {/* Main Schematic SVG Plot */}
      <div className="relative w-full aspect-[16/8.2] min-h-[220px] max-h-[340px] bg-gradient-to-b from-[#F8FAFC] to-[#EEF2F6] rounded-xl border border-[#CBD5E1] p-3 sm:p-4 flex items-center justify-center overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-tech-grid-fine opacity-70 pointer-events-none" />

        <svg
          viewBox="0 0 520 220"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id={pathGradId} gradientUnits="userSpaceOnUse" x1={ORIGIN.x} y1="0" x2={LANDING.x} y2="0">
              <stop offset="0%" stopColor="#178BFF" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#0864C7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#059669" stopOpacity="1" />
            </linearGradient>

            <linearGradient id={fillGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#178BFF" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0864C7" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Ground Baseline Track */}
          <line
            x1="25"
            y1={ORIGIN.y}
            x2="495"
            y2={ORIGIN.y}
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* 1. ~100 FT BASELINE TARGET SPECIFICATION */}
          <g
            className="cursor-pointer"
            onClick={() =>
              setSelectedMilestone(
                selectedMilestone === 'target' ? null : 'target'
              )
            }
          >
            <line
              x1={TARGET_100_X}
              y1="45"
              x2={TARGET_100_X}
              y2={ORIGIN.y}
              stroke={hasPassedTarget ? '#0864C7' : '#CBD5E1'}
              strokeWidth={hasPassedTarget ? '1.8' : '1.2'}
              strokeDasharray="4 4"
              className="transition-colors duration-200"
            />
            <rect
              x={TARGET_100_X - 48}
              y="28"
              width="96"
              height="20"
              rx="4"
              fill="#FFFFFF"
              stroke={hasPassedTarget ? '#0864C7' : '#94A3B8'}
              strokeWidth={hasPassedTarget ? '1.5' : '1'}
              className="shadow-xs"
            />
            <text
              x={TARGET_100_X}
              y="41"
              fill={hasPassedTarget ? '#0864C7' : '#647184'}
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              ~100 FT TARGET
            </text>
            <circle
              cx={TARGET_100_X}
              cy={ORIGIN.y}
              r={hasPassedTarget ? 4 : 3}
              fill={hasPassedTarget ? '#0864C7' : '#94A3B8'}
            />
          </g>

          {/* 2. PARABOLIC SCHEMATIC TRAJECTORY ARC */}
          {/* Ghosted Full Trajectory Guide */}
          <path
            d={`M ${ORIGIN.x} ${ORIGIN.y} Q ${CTRL.x} ${CTRL.y} ${LANDING.x} ${LANDING.y}`}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Subtle Area Fill Under Trajectory */}
          {flightT > 0 && (
            <path
              d={`M ${ORIGIN.x} ${ORIGIN.y} Q ${activeCtrlX} ${activeCtrlY} ${ballX} ${ballY} L ${ballX} ${ORIGIN.y} Z`}
              fill={`url(#${fillGradId})`}
              pointerEvents="none"
            />
          )}

          {/* Active Drawn Trajectory */}
          {flightT > 0 && (
            <path
              d={`M ${ORIGIN.x} ${ORIGIN.y} Q ${activeCtrlX} ${activeCtrlY} ${ballX} ${ballY}`}
              fill="none"
              stroke={`url(#${pathGradId})`}
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Origin Hardware Node */}
          <g transform={`translate(${ORIGIN.x}, ${ORIGIN.y})`}>
            <rect x="-18" y="-2" width="28" height="4" rx="1" fill="#334155" />
            <circle cx="0" cy="0" r="3" fill="#0864C7" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* Flying Projectile Ball */}
          {flightT > 0 && !isLanded && (
            <g transform={`translate(${ballX}, ${ballY})`}>
              <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" stroke="#0864C7" strokeWidth="1.8" />
            </g>
          )}

          {/* 3. ~300 FT ACHIEVED TOUCHDOWN CALLOUT */}
          <g
            transform={`translate(${LANDING.x}, ${ORIGIN.y})`}
            className="cursor-pointer"
            onClick={() =>
              setSelectedMilestone(
                selectedMilestone === 'achieved' ? null : 'achieved'
              )
            }
          >
            <circle
              cx="0"
              cy="0"
              r={isLanded ? 4.5 : 3.5}
              fill={isLanded ? '#059669' : '#94A3B8'}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              className="transition-colors duration-200"
            />

            {isLanded && (
              <>
                <circle cx="0" cy="0" r="14" fill="none" stroke="#059669" strokeWidth="1.2" className="animate-ping opacity-40" />
                <line x1="0" y1="-42" x2="0" y2="-6" stroke="#059669" strokeWidth="1.2" strokeDasharray="2 2" />
                <rect
                  x="-58"
                  y="-72"
                  width="116"
                  height="30"
                  rx="5"
                  fill="#FFFFFF"
                  stroke="#059669"
                  strokeWidth="1.5"
                  className="shadow-md"
                />
                <text
                  x="0"
                  y="-58"
                  fill="#059669"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ~300 FT ACHIEVED
                </text>
                <text
                  x="0"
                  y="-46"
                  fill="#475569"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  (3× Target · 1st Place)
                </text>
              </>
            )}
          </g>

          {/* Dimension Tracks Below Ground */}
          <text
            x={ORIGIN.x}
            y="190"
            fill="#647184"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            START (0 FT)
          </text>

          {/* Dimension Line 1: Target Track */}
          <line x1={ORIGIN.x} y1="202" x2={TARGET_100_X} y2="202" stroke="#94A3B8" strokeWidth="1" />
          <line x1={ORIGIN.x} y1="199" x2={ORIGIN.x} y2="205" stroke="#94A3B8" strokeWidth="1" />
          <line x1={TARGET_100_X} y1="199" x2={TARGET_100_X} y2="205" stroke="#94A3B8" strokeWidth="1" />
          <rect x={(ORIGIN.x + TARGET_100_X) / 2 - 28} y="196" width="56" height="12" fill="#F8FAFC" />
          <text
            x={(ORIGIN.x + TARGET_100_X) / 2}
            y="204"
            fill="#647184"
            fontSize="7.5"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            ~100 FT
          </text>

          {/* Dimension Line 2: Achieved Track */}
          <line x1={ORIGIN.x} y1="214" x2={LANDING.x} y2="214" stroke="#059669" strokeWidth="1.2" />
          <line x1={ORIGIN.x} y1="211" x2={ORIGIN.x} y2="217" stroke="#059669" strokeWidth="1.2" />
          <line x1={LANDING.x} y1="211" x2={LANDING.x} y2="217" stroke="#059669" strokeWidth="1.2" />
          <rect x={(ORIGIN.x + LANDING.x) / 2 - 60} y="208" width="120" height="12" fill="#F8FAFC" />
          <text
            x={(ORIGIN.x + LANDING.x) / 2}
            y="216"
            fill="#059669"
            fontSize="7.5"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            ~300 FT (3× TARGET RANGE)
          </text>
        </svg>

        {/* Selected Milestone Tooltip */}
        <AnimatePresence>
          {selectedMilestone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-3 right-3 max-w-[calc(100%-24px)] sm:max-w-[280px] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-[#CBD5E1] shadow-xl text-xs font-mono text-[#17202A] z-20"
            >
              <div className="flex items-center justify-between gap-2 pb-1 mb-1 border-b border-black/5">
                <span className="font-bold text-[#0864C7] truncate min-w-0">
                  {selectedMilestone === 'target' ? 'SPECIFICATION REQUIREMENT' : 'CLASS COMPETITION RESULT'}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMilestone(null)}
                  className="text-[#94A3B8] hover:text-[#17202A] p-0.5"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                {selectedMilestone === 'target'
                  ? 'Baseline project specification required hitting a ~100 ft target under strict out-of-pocket funding constraints.'
                  : 'Achieved ~300 ft range—3× the target distance—with a calculated 30–40% profit margin, capturing 1st place in the class competition.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Compact Metrics Rail (Typography & Spacing, Not Nested Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 mt-3 border-t border-black/5 text-xs font-mono text-center">
        <div className="py-1.5 px-2">
          <div className="text-base sm:text-lg font-black text-[#047857]">~300 ft</div>
          <div className="text-[10px] uppercase text-[#647184] font-medium tracking-wide">ACHIEVED</div>
        </div>

        <div className="py-1.5 px-2 border-l border-black/5">
          <div className="text-base sm:text-lg font-black text-[#0864C7]">3×</div>
          <div className="text-[10px] uppercase text-[#647184] font-medium tracking-wide">TARGET</div>
        </div>

        <div className="py-1.5 px-2 border-l border-black/5">
          <div className="text-base sm:text-lg font-black text-[#17202A]">~15</div>
          <div className="text-[10px] uppercase text-[#647184] font-medium tracking-wide">TEAM MEMBERS</div>
        </div>

        <div className="py-1.5 px-2 border-l border-black/5">
          <div className="text-base sm:text-lg font-black text-[#17202A]">30–40%</div>
          <div className="text-[10px] uppercase text-[#647184] font-medium tracking-wide">MARGIN</div>
        </div>

        <div className="py-1.5 px-2 border-l border-black/5 col-span-2 sm:col-span-1">
          <div className="text-base sm:text-lg font-black text-[#D97706]">WINNER</div>
          <div className="text-[10px] uppercase text-[#647184] font-medium tracking-wide">1ST PLACE</div>
        </div>
      </div>

      {/* Compact Full-Width Process Strip */}
      <div className="mt-3 pt-3 border-t border-black/5">
        <div className="text-[10px] font-mono text-[#647184] uppercase tracking-wider mb-2 font-semibold">
          Failure Recovery Process:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 text-xs font-mono">
          <div className="p-2 rounded-lg bg-white/70 border border-[#CBD5E1]/60">
            <span className="text-[#0864C7] font-bold block text-[10px]">01 · TARGET</span>
            <span className="text-[11px] text-[#334155] leading-tight">~100 ft spec</span>
          </div>

          <div className="p-2 rounded-lg bg-rose-50/70 border border-rose-200">
            <span className="text-rose-700 font-bold block text-[10px]">02 · DISRUPTION</span>
            <span className="text-[11px] text-rose-900 leading-tight">1 wk to launch</span>
          </div>

          <div className="p-2 rounded-lg bg-white/70 border border-[#CBD5E1]/60">
            <span className="text-[#0864C7] font-bold block text-[10px]">03 · ASSESS</span>
            <span className="text-[11px] text-[#334155] leading-tight">Triage intact parts</span>
          </div>

          <div className="p-2 rounded-lg bg-white/70 border border-[#CBD5E1]/60">
            <span className="text-[#0864C7] font-bold block text-[10px]">04 · REDESIGN</span>
            <span className="text-[11px] text-[#334155] leading-tight">Compacted chassis</span>
          </div>

          <div className="p-2 rounded-lg bg-white/70 border border-[#CBD5E1]/60">
            <span className="text-[#0864C7] font-bold block text-[10px]">05 · TEST</span>
            <span className="text-[11px] text-[#334155] leading-tight">Stiffer frame</span>
          </div>

          <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-200">
            <span className="text-emerald-700 font-bold block text-[10px]">06 · WIN</span>
            <span className="text-[11px] text-emerald-900 leading-tight font-semibold">~300 ft &amp; 1st place</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LauncherVisual;
