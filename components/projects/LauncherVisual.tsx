'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Crosshair } from 'lucide-react';
import { useReducedMotion } from '@/components/motion/Reveal';
import { useElementVisibility } from '@/lib/useVisibility';

// Spatial coordinates optimized for zero overlapping and pristine engineering hierarchy:
// Origin: (65, 215)
// Apex: (295, 58) -> Altitude equivalent: ~62 ft
// 100 ft Baseline post: x = 218, y = 215
// 300 ft Touchdown: x = 525, y = 215
const ORIGIN = { x: 65, y: 215 };
const LANDING = { x: 525, y: 215 };
const APEX = { x: 295, y: 58 };
const TARGET_100_X = 218;

export function LauncherVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useElementVisibility(containerRef, 0.2);
  const prefersReduced = useReducedMotion();
  const [progress, setProgress] = useState(1); // 0 to 1
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [isManualPause, setIsManualPause] = useState(false);

  // Animation timeline: loops every few seconds continuously (no timer shown)
  const reqIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const flightDurationMs = 3200; // active flight phase
  const holdDurationMs = 2400; // pause at landing before looping again
  const totalCycleMs = flightDurationMs + holdDurationMs; // 5600ms total loop

  useEffect(() => {
    if (prefersReduced || isManualPause || !isVisible) {
      lastTimeRef.current = null;
      return;
    }

    lastTimeRef.current = performance.now();
    let animId: number;

    const step = (now: number) => {
      if (lastTimeRef.current !== null) {
        const delta = Math.min(100, now - lastTimeRef.current);
        elapsedRef.current = (elapsedRef.current + delta) % totalCycleMs;
        const cycleElapsed = elapsedRef.current;
        // p climbs smoothly from 0 to 1 during flight, then stays at 1 during hold
        const p = Math.min(1, cycleElapsed / flightDurationMs);
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
  }, [prefersReduced, isManualPause, isVisible, totalCycleMs, flightDurationMs]);

  const handleReplay = () => {
    setSelectedMarker(null);
    setIsManualPause(false);
    if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    elapsedRef.current = 0;
    lastTimeRef.current = performance.now();
    setProgress(0);

    const step = (now: number) => {
      if (lastTimeRef.current !== null) {
        const delta = Math.min(100, now - lastTimeRef.current);
        elapsedRef.current = (elapsedRef.current + delta) % totalCycleMs;
        const p = Math.min(1, elapsedRef.current / flightDurationMs);
        setProgress(p);
      }
      lastTimeRef.current = now;
      reqIdRef.current = requestAnimationFrame(step);
    };

    reqIdRef.current = requestAnimationFrame(step);
  };

  // Jump to specific milestone (pauses loop for deliberate inspection)
  const jumpToStage = (stageP: number, markerKey?: string) => {
    if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    setIsManualPause(true);
    setProgress(stageP);
    if (markerKey) setSelectedMarker(markerKey);
  };

  // Trajectory timeline breakdown:
  // 0.00 - 0.15: Cocking spring / charging
  // 0.15 - 0.22: Trigger release & recoil
  // 0.20 - 0.90: Ballistic flight arc from (65, 215) to (525, 215)
  // 0.90 - 1.00: Touchdown impact shockwave
  const isCocking = progress < 0.15;
  const isFiring = progress >= 0.15 && progress < 0.22;
  const isFlying = progress >= 0.20 && progress < 0.90;
  const hasPassedTarget = progress >= 0.44; // ~100 ft passed
  const isLanded = progress >= 0.90;

  // Ball flight parameter t normalized from 0 to 1
  const flightT = useMemo(() => {
    if (progress < 0.20) return 0;
    if (progress >= 0.90) return 1;
    return (progress - 0.20) / 0.70;
  }, [progress]);

  // Parabolic trajectory point:
  // x(t) = 65 + 460 * t
  // y(t) = 215 - 4 * (215 - 58) * t * (1 - t)
  const ballX = ORIGIN.x + (LANDING.x - ORIGIN.x) * flightT;
  const ballY = ORIGIN.y - 4 * (ORIGIN.y - APEX.y) * flightT * (1 - flightT);

  // Instantaneous velocity tangent angle (degrees)
  const tangentAngleDeg = useMemo(() => {
    const H = ORIGIN.y - APEX.y;
    const dy = -4 * H * (1 - 2 * flightT);
    const dx = LANDING.x - ORIGIN.x;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }, [flightT]);

  // Spring compression displacement during cocking
  const springDraw = useMemo(() => {
    if (progress < 0.15) {
      return (progress / 0.15) * 14;
    }
    return 0;
  }, [progress]);

  // Recoil displacement on base during fire
  const recoilX = useMemo(() => {
    if (progress >= 0.15 && progress < 0.22) {
      const snap = (progress - 0.15) / 0.07;
      return Math.sin(snap * Math.PI) * -3.5;
    }
    return 0;
  }, [progress]);

  return (
    <div
      ref={containerRef}
      className="w-full glass-panel rounded-2xl p-5 sm:p-6 overflow-hidden select-none flex flex-col justify-between"
    >
      {/* Top Header & Replay Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-4 mb-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#0864C7] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#178BFF] animate-pulse" />
            Mechanical Failure Recovery · Emergency Chassis Redesign
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#17202A] mt-0.5">
            Ballistic Trajectory &amp; Structural Margin Verification
          </h3>
        </div>

        {/* Live Replay Control */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReplay}
            className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-[#178BFF]/10 text-[#0864C7] hover:bg-[#178BFF]/20 border border-[#178BFF]/25 inline-flex items-center gap-1.5 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] active:scale-95 cursor-pointer transition-all"
            aria-label="Replay trajectory test animation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#0864C7]" />
            <span>Replay Launch</span>
          </button>
        </div>
      </div>

      {/* Main Dynamic Viewport: High-Precision Aerospace SVG Plot (No overlapping elements) */}
      <div className="relative w-full aspect-[16/8.8] min-h-[260px] max-h-[380px] bg-gradient-to-b from-[#F8FAFC] to-[#EEF2F6] rounded-xl border border-[#CBD5E1] p-3 sm:p-4 flex items-center justify-center overflow-hidden shadow-inner">
        {/* Fine Technical Coordinate Grid */}
        <div className="absolute inset-0 bg-tech-grid-fine opacity-80 pointer-events-none" />

        <svg
          viewBox="0 0 620 280"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="launcherPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#178BFF" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0864C7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#059669" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="launcherFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#178BFF" stopOpacity="0.12" />
              <stop offset="60%" stopColor="#0864C7" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#0864C7" stopOpacity="0" />
            </linearGradient>

            <radialGradient id="ballGlowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#38BDF8" />
              <stop offset="85%" stopColor="#0864C7" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ground Baseline Track */}
          <line
            x1="35"
            y1={ORIGIN.y}
            x2="585"
            y2={ORIGIN.y}
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* 1. 100 FT TARGET BASELINE REFERENCE LINE & CALLOUT (ANCHORED TO LEFT AT Y=52 TO PREVENT ANY OVERLAP) */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedMarker('target')}
          >
            {/* Vertical Reference Line: from y=48 down to ground y=215 */}
            <line
              x1={TARGET_100_X}
              y1="48"
              x2={TARGET_100_X}
              y2={ORIGIN.y}
              stroke={hasPassedTarget ? '#0864C7' : '#CBD5E1'}
              strokeWidth={hasPassedTarget ? '1.8' : '1.2'}
              strokeDasharray="4 4"
              className="transition-colors duration-300"
            />

            {/* Target Baseline Tag (Staggered to the left of the line at y=52, completely clear of Apex tag) */}
            <rect
              x={TARGET_100_X - 100}
              y="52"
              width="96"
              height="22"
              rx="4"
              fill="#FFFFFF"
              stroke={hasPassedTarget ? '#0864C7' : '#94A3B8'}
              strokeWidth={hasPassedTarget ? '1.5' : '1'}
              className="shadow-xs"
            />
            {/* Small horizontal leader connector line from tag to vertical milestone */}
            <line
              x1={TARGET_100_X - 4}
              y1="63"
              x2={TARGET_100_X}
              y2="63"
              stroke={hasPassedTarget ? '#0864C7' : '#94A3B8'}
              strokeWidth="1.2"
            />
            <text
              x={TARGET_100_X - 52}
              y="66"
              fill={hasPassedTarget ? '#0864C7' : '#647184'}
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              SPEC: ~100 FT
            </text>

            {/* Target intersection tick on the ground */}
            <circle
              cx={TARGET_100_X}
              cy={ORIGIN.y}
              r={hasPassedTarget ? 4.5 : 3.5}
              fill={hasPassedTarget ? '#0864C7' : '#94A3B8'}
            />
          </g>

          {/* 2. APEX REFERENCE MARKER & CALLOUT (POSITIONED DIRECTLY ABOVE APEX AT Y=14, ZERO CLASH) */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedMarker('apex')}
          >
            {/* Vertical Drop from badge bottom (y=36) down to Apex point at (295, 58) */}
            <line
              x1={APEX.x}
              y1="36"
              x2={APEX.x}
              y2={APEX.y}
              stroke="#94A3B8"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle cx={APEX.x} cy={APEX.y} r="3" fill="#0864C7" />

            {/* Apex Callout Tag */}
            <rect
              x={APEX.x - 63}
              y="14"
              width="126"
              height="22"
              rx="4"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1"
              className="shadow-xs"
            />
            <text
              x={APEX.x}
              y="28"
              fill="#475569"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              APEX: ~62 FT (45° OPTIMAL)
            </text>
          </g>

          {/* 3. PARABOLIC TRAJECTORY ARC & FILL */}
          {/* Filled Area Under Parabolic Trajectory Arc */}
          <path
            d={`M ${ORIGIN.x} ${ORIGIN.y} Q ${APEX.x} -99 ${LANDING.x} ${LANDING.y} Z`}
            fill="url(#launcherFillGrad)"
            opacity={progress > 0.2 ? Math.min(1, (progress - 0.2) * 2) : 0}
            className="transition-opacity duration-300"
          />

          {/* Parabolic Guide Path (Ghosted Line) */}
          <path
            d={`M ${ORIGIN.x} ${ORIGIN.y} Q ${APEX.x} -99 ${LANDING.x} ${LANDING.y}`}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Active Flight Trajectory Arc drawn behind projectile */}
          {flightT > 0 && (
            <path
              d={`M ${ORIGIN.x} ${ORIGIN.y} Q ${ORIGIN.x + (APEX.x - ORIGIN.x) * flightT} ${ORIGIN.y + (-99 - ORIGIN.y) * flightT} ${ballX} ${ballY}`}
              fill="none"
              stroke="url(#launcherPathGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Projectile Altitude Drop-Line During Flight */}
          {isFlying && (
            <g>
              <line
                x1={ballX}
                y1={ballY}
                x2={ballX}
                y2={ORIGIN.y}
                stroke="#178BFF"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                opacity="0.6"
              />
              <circle cx={ballX} cy={ORIGIN.y} r="2.5" fill="#178BFF" opacity="0.6" />
            </g>
          )}

          {/* 4. MECHANICAL LAUNCHER ASSEMBLY AT ORIGIN (65, 215) */}
          <g
            transform={`translate(${ORIGIN.x + recoilX}, ${ORIGIN.y})`}
            className="cursor-pointer"
            onClick={() => setSelectedMarker('start')}
          >
            {/* Chassis Mounting Base Plate */}
            <rect x="-22" y="-2" width="36" height="5" rx="1.5" fill="#334155" stroke="#1E293B" strokeWidth="1" />
            <circle cx="-14" cy="0.5" r="1.2" fill="#94A3B8" />
            <circle cx="8" cy="0.5" r="1.2" fill="#94A3B8" />

            {/* Angular 45° Launcher Rail Guide Tube */}
            <g transform="rotate(-45)">
              <rect x="0" y="-3.5" width="30" height="7" rx="1.5" fill="#475569" stroke="#1E293B" strokeWidth="1" />
              <line x1="3" y1="0" x2={24 - springDraw} y2="0" stroke="#94A3B8" strokeWidth="2" strokeDasharray="2 2" />
              <rect x={23 - springDraw} y="-4.5" width="4" height="9" rx="1" fill="#178BFF" />
            </g>

            {/* Pivot Point Bolt */}
            <circle cx="0" cy="0" r="3.5" fill="#0864C7" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* 5. FLYING PROJECTILE BALL */}
          {progress >= 0.18 && (
            <g transform={`translate(${ballX}, ${ballY})`}>
              <circle cx="0" cy="0" r="11" fill="url(#ballGlowGrad)" opacity="0.85" />
              <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" stroke="#0864C7" strokeWidth="1.5" />

              {isFlying && (
                <g transform={`rotate(${tangentAngleDeg})`}>
                  <line x1="4" y1="0" x2="14" y2="0" stroke="#0864C7" strokeWidth="1.5" />
                  <polygon points="14,0 10,-2.5 10,2.5" fill="#0864C7" />
                </g>
              )}
            </g>
          )}

          {/* 6. TOUCHDOWN / 300 FT IMPACT CALLOUT (HOVERING CLEANLY AT Y=140, ZERO TRAJECTORY CLASH) */}
          <g
            transform={`translate(${LANDING.x}, ${ORIGIN.y})`}
            className="cursor-pointer"
            onClick={() => setSelectedMarker('achieved')}
          >
            {/* Impact Ground Point */}
            <circle cx="0" cy="0" r="4.5" fill="#059669" stroke="#FFFFFF" strokeWidth="1.5" />

            {isLanded && (
              <>
                {/* Shockwave Rings on ground */}
                <circle cx="0" cy="0" r="16" fill="none" stroke="#059669" strokeWidth="1.2" className="animate-ping opacity-40" />
                <circle cx="0" cy="0" r="7" fill="#059669" opacity="0.25" />

                {/* Vertical Leader Line pointing down from callout box */}
                <line x1="0" y1="-50" x2="0" y2="-6" stroke="#059669" strokeWidth="1.2" strokeDasharray="2 2" />

                {/* Achieved Distance Callout Box: securely placed at y=-85 to y=-50 */}
                <rect
                  x="-62"
                  y="-85"
                  width="124"
                  height="34"
                  rx="5"
                  fill="#FFFFFF"
                  stroke="#059669"
                  strokeWidth="1.5"
                  className="shadow-md"
                />
                <text
                  x="0"
                  y="-69"
                  fill="#059669"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ~300 FT ACHIEVED
                </text>
                <text
                  x="0"
                  y="-56"
                  fill="#475569"
                  fontSize="8.5"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  (3× Target · 1st Place)
                </text>
              </>
            )}
          </g>

          {/* 7. UNIFIED AEROSPACE DIMENSION TRACKS (POSITIONED CLEANLY BELOW GROUND WITH NO OVERLAPS) */}
          {/* Origin Label */}
          <text
            x={ORIGIN.x}
            y="232"
            fill="#475569"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            ORIGIN (0 FT)
          </text>

          {/* Dimension 1: Baseline Spec Track (|← 100 FT →|) */}
          <g>
            <line x1={ORIGIN.x} y1="248" x2={TARGET_100_X} y2="248" stroke="#94A3B8" strokeWidth="1" />
            <line x1={ORIGIN.x} y1="244" x2={ORIGIN.x} y2="252" stroke="#94A3B8" strokeWidth="1" />
            <line x1={TARGET_100_X} y1="244" x2={TARGET_100_X} y2="252" stroke="#94A3B8" strokeWidth="1" />
            <rect
              x={(ORIGIN.x + TARGET_100_X) / 2 - 38}
              y="241"
              width="76"
              height="14"
              fill="#F8FAFC"
            />
            <text
              x={(ORIGIN.x + TARGET_100_X) / 2}
              y="251"
              fill="#647184"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              |← ~100 FT →|
            </text>
          </g>

          {/* Dimension 2: Achieved Distance Track (|← ~300 FT ACHIEVED (3×) →|) */}
          <g>
            <line x1={ORIGIN.x} y1="266" x2={LANDING.x} y2="266" stroke="#059669" strokeWidth="1.2" />
            <line x1={ORIGIN.x} y1="262" x2={ORIGIN.x} y2="270" stroke="#059669" strokeWidth="1.2" />
            <line x1={LANDING.x} y1="262" x2={LANDING.x} y2="270" stroke="#059669" strokeWidth="1.2" />
            <rect
              x={(ORIGIN.x + LANDING.x) / 2 - 82}
              y="259"
              width="164"
              height="14"
              fill="#F8FAFC"
            />
            <text
              x={(ORIGIN.x + LANDING.x) / 2}
              y="269"
              fill="#059669"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              |← ~300 FT ACHIEVED (3× SPEC MARGIN) →|
            </text>
          </g>
        </svg>

        {/* Dynamic Tooltip on Marker Click/Tap */}
        <AnimatePresence>
          {selectedMarker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-80 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-[#CBD5E1] shadow-xl text-xs font-mono text-[#17202A] z-30"
            >
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5">
                <span className="font-bold text-[#0864C7] flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-[#0864C7]" />
                  {selectedMarker === 'start' && 'LAUNCH ORIGIN & REDESIGNED CHASSIS'}
                  {selectedMarker === 'apex' && 'BALLISTIC APEX & ANGLE TUNING'}
                  {selectedMarker === 'target' && 'BASELINE SPECIFICATION (~100 FT)'}
                  {selectedMarker === 'achieved' && 'VICTORY DISTANCE (~300 FT ACHIEVED)'}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMarker(null)}
                  className="text-[#94A3B8] hover:text-[#17202A] p-0.5 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                {selectedMarker === 'start' &&
                  'After an initial chassis structural failure under high spring tension, Youssef led a 15-member team in immediate root cause failure analysis, designing and machining a compacted, high-rigidity chassis using shop tools within 48 hours.'}
                {selectedMarker === 'apex' &&
                  'The redesigned chassis maintained precise 45.0° launch angle under dynamic shock loading, generating an apex altitude of ~62 feet with near-optimal energy transfer.'}
                {selectedMarker === 'target' &&
                  'Competition specification baseline required reaching approximately 100 feet. Many competing designs experienced chassis deflection or energy dissipation before 120 feet.'}
                {selectedMarker === 'achieved' &&
                  'The reinforced chassis reached approximately 300 feet—tripling the baseline spec margin (3× target distance) and capturing 1st Place class victory by a 30–40% distance margin.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stage Inspection Pilled Buttons along the bottom */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-black/5">
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-[11px] font-mono text-[#647184] mr-1 hidden sm:inline">Inspect:</span>

          <button
            type="button"
            onClick={() => jumpToStage(0.10, 'start')}
            className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white hover:bg-[#F1F5F9] text-[#17202A] border border-[#CBD5E1] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF]" />
            <span>1. Launch Mechanism</span>
          </button>

          <button
            type="button"
            onClick={() => jumpToStage(0.55, 'apex')}
            className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white hover:bg-[#F1F5F9] text-[#17202A] border border-[#CBD5E1] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#647184]" />
            <span>2. Apex (~62 ft)</span>
          </button>

          <button
            type="button"
            onClick={() => jumpToStage(0.44, 'target')}
            className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white hover:bg-[#F1F5F9] text-[#0864C7] border border-[#178BFF]/30 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0864C7]" />
            <span>3. Spec (~100 ft)</span>
          </button>

          <button
            type="button"
            onClick={() => jumpToStage(1.0, 'achieved')}
            className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#047857] border border-[#86EFAC] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
            <span>4. Touchdown (~300 ft)</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-[#647184]">
          Continuous Ballistic Loop · Class Victory Margin
        </div>
      </div>

      {/* Verified Factual Result Metrics Only */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 text-xs font-mono">
        <div className="glass-card-solid p-3 rounded-xl">
          <div className="text-[10px] text-[#647184] uppercase">Target Distance</div>
          <div className="text-sm font-bold text-[#17202A] mt-0.5">~100 ft</div>
          <div className="text-[10px] text-[#647184]">Class Spec</div>
        </div>

        <div className="glass-card-solid p-3 rounded-xl bg-[#F0FDF4] border-[#BBF7D0]">
          <div className="text-[10px] text-[#047857] uppercase font-bold">Achieved Distance</div>
          <div className="text-sm font-bold text-[#047857] mt-0.5">~300 ft</div>
          <div className="text-[10px] text-[#059669]">~3× Baseline Margin</div>
        </div>

        <div className="glass-card-solid p-3 rounded-xl">
          <div className="text-[10px] text-[#647184] uppercase">Team Size Led</div>
          <div className="text-sm font-bold text-[#17202A] mt-0.5">~15 Members</div>
          <div className="text-[10px] text-[#647184]">Project Lead</div>
        </div>

        <div className="glass-card-solid p-3 rounded-xl">
          <div className="text-[10px] text-[#647184] uppercase">Outcome &amp; Margin</div>
          <div className="text-sm font-bold text-[#D97706] mt-0.5">1st Place</div>
          <div className="text-[10px] text-[#647184]">~30–40% Margin</div>
        </div>
      </div>
    </div>
  );
}

export default LauncherVisual;
