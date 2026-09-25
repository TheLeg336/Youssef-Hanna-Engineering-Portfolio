'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  Cpu,
  Box,
  Sparkles,
  Check,
  CheckCircle2,
  Loader2,
  Terminal,
  Activity,
  Layers,
} from 'lucide-react';
import { AppBorderBeam } from '@/components/ui/LibrariesDevWrapper';
import { useElementVisibility } from '@/lib/useVisibility';
import { useReducedMotion } from '@/components/motion/Reveal';

const DynamicEzerCadViewer = dynamic(() => import('./EzerCadViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-xs font-mono text-[#8FDFFF] bg-[#0B1220]">
      <Loader2 className="w-6 h-6 text-[#22C7F2] animate-spin mb-2" />
      <span className="tracking-wide">Initializing SolidWorks CAD Kernel…</span>
    </div>
  ),
});

// Phase definitions with exact millisecond bounds
export const PHASES = [
  {
    id: 1,
    name: 'Voice Input',
    shortLabel: '1. Voice Input',
    startMs: 0,
    endMs: 3200,
    durationMs: 3200,
    icon: Mic,
  },
  {
    id: 2,
    name: 'Solving',
    shortLabel: '2. Solving',
    startMs: 3200,
    endMs: 7000,
    durationMs: 3800,
    icon: Cpu,
  },
  {
    id: 3,
    name: '3D CAD Output',
    shortLabel: '3. 3D CAD Output',
    startMs: 7000,
    endMs: 11800,
    durationMs: 4800,
    icon: Box,
  },
  {
    id: 4,
    name: 'Refinement',
    shortLabel: '4. Refinement',
    startMs: 11800,
    endMs: 15000,
    durationMs: 3200,
    icon: Sparkles,
  },
] as const;

const TOTAL_CYCLE = 16800; // Phase 5 resolution runs from 15000ms to 16800ms

// First Command: "Build me a 2 in × 2 in cube and put a 1 in diameter hole through the center."
const FIRST_COMMAND_TEXT = 'Build me a 2 in × 2 in cube and put a 1 in diameter hole through the center.';

// Second Command: "Add 0.200 in fillets to all vertical corners."
const SECOND_COMMAND_TEXT = 'Add 0.200 in fillets to all vertical corners.';

// Solve stack items for Phase 2
const SOLVE_STACK = [
  'Parse geometry intent',
  'Determine base solid',
  'Locate feature center',
  'Generate through-hole',
  'Validate topology',
];

export function EzerVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useElementVisibility(containerRef, 0.25);
  const prefersReduced = useReducedMotion();

  // Elapsed timeline counter (in milliseconds)
  const [elapsedMs, setElapsedMs] = useState(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const isUserInteractingWith3DRef = useRef(false);

  // RAF Ticker: Pauses when out of view without resetting; resumes seamlessly!
  useEffect(() => {
    if (prefersReduced) return;

    if (!isVisible) {
      lastTimeRef.current = null;
      return;
    }

    lastTimeRef.current = performance.now();
    let animId: number;

    const tick = (now: number) => {
      if (lastTimeRef.current !== null) {
        const delta = Math.min(100, now - lastTimeRef.current);

        // Slow down or pause progression only during manual user 3D drag
        if (!isUserInteractingWith3DRef.current) {
          elapsedRef.current = (elapsedRef.current + delta) % TOTAL_CYCLE;
          setElapsedMs(elapsedRef.current);
        }
      }
      lastTimeRef.current = now;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isVisible, prefersReduced]);

  // Jump directly to a phase when user clicks a timeline pill
  const handleJumpToPhase = useCallback((phaseId: number) => {
    const target = PHASES.find((p) => p.id === phaseId);
    if (target) {
      elapsedRef.current = target.startMs;
      setElapsedMs(target.startMs);
    }
  }, []);

  // Determine active phase
  let currentPhaseId: 1 | 2 | 3 | 4 | 5 = 1;
  if (elapsedMs < 3200) currentPhaseId = 1;
  else if (elapsedMs < 7000) currentPhaseId = 2;
  else if (elapsedMs < 11800) currentPhaseId = 3;
  else if (elapsedMs < 15000) currentPhaseId = 4;
  else currentPhaseId = 5;

  // ---------------------------------------------------------------------------
  // Phase 1 Calculations: Voice Pill Typing & Waveform
  // ---------------------------------------------------------------------------
  const isPhase1 = currentPhaseId === 1;
  // Typing from 400ms to 2600ms (2200ms duration for 74 chars = ~30ms per char)
  const p1TypeProgress = Math.max(0, Math.min(1, (elapsedMs - 400) / 2200));
  const p1CharCount = Math.floor(p1TypeProgress * FIRST_COMMAND_TEXT.length);
  const p1TypedText = FIRST_COMMAND_TEXT.slice(0, p1CharCount);
  const p1IsListening = elapsedMs < 400;
  const p1IsConfirming = elapsedMs >= 2600 && elapsedMs < 3000;
  const p1IsGliding = elapsedMs >= 3000;

  // ---------------------------------------------------------------------------
  // Phase 2 Calculations: Solving Orb & Solve Stack
  // ---------------------------------------------------------------------------
  const isPhase2 = currentPhaseId === 2;
  const p2Time = elapsedMs - 3200; // 0 to 3800ms
  // Stack items enter every 600ms starting at 400ms
  const activeSolveItemIndex = Math.min(4, Math.floor((p2Time - 400) / 600));

  // ---------------------------------------------------------------------------
  // Phase 3 Calculations: 3D CAD Output Generation
  // ---------------------------------------------------------------------------
  const isPhase3 = currentPhaseId === 3;
  const p3Time = elapsedMs - 7000;
  const isP3Wireframe = p3Time < 600; // initial wireframe appearance

  // ---------------------------------------------------------------------------
  // Phase 4 Calculations: Refinement Second Command & Fillet Morph
  // ---------------------------------------------------------------------------
  const isPhase4 = currentPhaseId === 4;
  const p4Time = elapsedMs - 11800; // 0 to 3200ms
  // Second command typing: 0 to 1200ms
  const p4TypeProgress = Math.max(0, Math.min(1, p4Time / 1200));
  const p4CharCount = Math.floor(p4TypeProgress * SECOND_COMMAND_TEXT.length);
  const p4TypedText = SECOND_COMMAND_TEXT.slice(0, p4CharCount);

  // Fillet progress: 0.0 to 1.0 between 1200ms and 2400ms
  const filletProgress = isPhase4
    ? Math.max(0, Math.min(1, (p4Time - 1200) / 1000))
    : currentPhaseId === 5
    ? 1.0
    : 0.0;

  const highlightVerticalEdges = isPhase4 && p4Time >= 1000 && p4Time < 2400;
  const showFilletSuccessChip = isPhase4 && p4Time >= 2000;

  // ---------------------------------------------------------------------------
  // Phase 5 Calculations: Resolution & Hold
  // ---------------------------------------------------------------------------
  const isPhase5 = currentPhaseId === 5;
  const p5Time = elapsedMs - 15000;
  const isP5Fading = p5Time > 1200;

  return (
    <div
      ref={containerRef}
      className="w-full bg-[rgba(255,255,255,0.82)] backdrop-blur-[18px] rounded-[24px] sm:rounded-[28px] border border-[rgba(255,255,255,0.78)] shadow-[0_24px_56px_rgba(15,23,42,0.12)] p-4 sm:p-6 flex flex-col justify-between select-none relative overflow-hidden"
      style={{
        boxShadow: '0 24px 56px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
      }}
    >
      {/* =======================================================================
          1. TOP UTILITY / HEADER STRIP (Height: 48px)
      ======================================================================= */}
      <div className="h-12 w-full flex items-center justify-between border-b border-[rgba(15,23,42,0.08)] pb-3 px-1 text-xs font-mono">
        {/* Left Micro Label Pill */}
        <div className="px-2.5 py-1 rounded-full bg-white border border-[rgba(15,23,42,0.08)] text-[10px] sm:text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C7F2]" />
          <span>CONCEPT DEMO · LOCAL CAD WORKFLOW</span>
        </div>

        {/* Centered/Right Title */}
        <div className="hidden md:block text-[12px] font-semibold text-[#475569] tracking-tight">
          Voice-to-CAD Geometry Synthesis
        </div>

        {/* Right System Status */}
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#64748B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="hidden sm:inline">Interactive loop ·</span>
          <span>In view only</span>
        </div>
      </div>

      {/* =======================================================================
          2. MAIN ANIMATED STAGE (~500px Desktop / ~420px Tablet / ~360px Mobile)
             Inset Dark Viewport #0B1220 with Fine CAD Grid and Bloom
      ======================================================================= */}
      <div className="relative w-full h-[370px] sm:h-[430px] lg:h-[480px] my-4 rounded-[20px] sm:rounded-[22px] bg-[#0B1220] border border-[rgba(143,223,255,0.14)] overflow-hidden shadow-inner flex items-center justify-center">
        {/* Subtle Background CAD Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(34, 199, 242, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 199, 242, 0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Faint Center Ambient Bloom */}
        <div
          className="absolute w-[360px] h-[360px] rounded-full pointer-events-none blur-[90px] opacity-25"
          style={{
            background: 'radial-gradient(circle, #22C7F2 0%, #2F80FF 45%, transparent 70%)',
          }}
        />

        {/* Soft Vignette Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(11, 18, 32, 0.85) 100%)',
          }}
        />

        {/* -------------------------------------------------------------------
            CORNER LIVE STATUS BEACON (Phases 2, 3, 4, 5)
            Glided up smoothly from Phase 1 Voice Pill
        ------------------------------------------------------------------- */}
        {(currentPhaseId >= 2 || p1IsGliding) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isP5Fading ? 0 : 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute top-4 left-4 z-30 pointer-events-none"
          >
            <div className="w-[190px] sm:w-[230px] h-[44px] rounded-full bg-[rgba(13,18,32,0.92)] backdrop-blur-md border border-[rgba(143,223,255,0.22)] px-3.5 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-[#22C7F2] animate-pulse shrink-0" />
                <div className="flex flex-col overflow-hidden text-left">
                  <span className="text-[11px] font-mono font-semibold text-[#E5F0FF] truncate">
                    {isPhase4 ? 'Refinement active' : 'Command received'}
                  </span>
                  <span className="text-[9px] font-mono text-[rgba(229,240,255,0.72)] truncate">
                    {isPhase4 ? '0.200" fillet request' : 'Geometry intent parsed'}
                  </span>
                </div>
              </div>
              <Terminal className="w-3.5 h-3.5 text-[#22C7F2]/70 shrink-0" />
            </div>
          </motion.div>
        )}

        {/* -------------------------------------------------------------------
            PHASE 1: VOICE PILL & WAVEFORM (Duration: ~3.2s)
        ------------------------------------------------------------------- */}
        {isPhase1 && !p1IsGliding && (
          <div className="relative z-20 flex flex-col items-center justify-center px-4 w-full">
            {/* The Ezer Voice Pill */}
            <AppBorderBeam
              colorVariant="ocean"
              borderRadius={9999}
              duration={2.0}
              active={true}
              className="w-full max-w-[460px] shadow-2xl rounded-full"
            >
              <div
                className={`relative w-full rounded-full bg-[#0B1220]/95 backdrop-blur-xl border border-[rgba(143,223,255,0.28)] px-5 py-4 flex flex-col justify-center min-h-[96px] sm:min-h-[104px] overflow-hidden transition-transform duration-200 ${
                  p1IsConfirming ? 'scale-[0.96]' : 'scale-100'
                }`}
                style={{
                  boxShadow:
                    'inset 0 1px 1px rgba(255,255,255,0.15), 0 16px 36px -4px rgba(34,199,242,0.25)',
                }}
              >
                {/* Top-Left Listening Indicator Dot & Status */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#22C7F2] animate-pulse shadow-[0_0_8px_#22C7F2]" />
                  <span className="text-[12px] font-mono font-medium text-[rgba(229,240,255,0.78)]">
                    {p1IsListening ? 'Listening…' : 'Transcribing voice…'}
                  </span>
                </div>

                {/* Main Transcribed Command Text (Large, readable, beautiful line-wrap) */}
                <div className="relative z-20 min-h-[46px] flex items-center">
                  <p className="text-[15px] sm:text-[18px] md:text-[20px] font-semibold text-[#F8FBFF] leading-[1.25] tracking-tight">
                    {p1TypedText}
                    {p1TypeProgress < 1 && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-[#22C7F2] animate-pulse align-middle" />
                    )}
                  </p>
                </div>

                {/* Restrained Liquid Voice Glow Waveform under text */}
                <div className="absolute bottom-0 inset-x-0 h-[18px] pointer-events-none overflow-hidden opacity-60">
                  <div
                    className="w-full h-full"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 100%, rgba(103, 232, 249, 0.45) 0%, rgba(34, 199, 242, 0.24) 40%, transparent 80%)',
                      filter: 'blur(3px)',
                    }}
                  />
                </div>
              </div>
            </AppBorderBeam>

            {/* Micro Caption Below Pill */}
            <p className="mt-3 text-[11px] font-mono text-[rgba(229,240,255,0.65)] tracking-wide">
              Local voice command stream
            </p>
          </div>
        )}

        {/* -------------------------------------------------------------------
            PHASE 2: SOLVING ORB & SOLVE STACK (Duration: ~3.8s)
        ------------------------------------------------------------------- */}
        {isPhase2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative z-20 flex flex-col items-center justify-center gap-6 px-4"
          >
            {/* Computational Solving Orb with Dual Counter-Rotating Rings */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              {/* Outer Counter-Rotating Ring */}
              <div
                className="absolute inset-0 rounded-full border border-dashed border-[#22C7F2]/50 animate-[spin_10s_linear_infinite]"
                style={{ transform: 'rotateX(68deg)' }}
              />

              {/* Inner Fast Ring with Travelling Highlight */}
              <div
                className="absolute inset-2 rounded-full border border-[#8FDFFF]/70 animate-[spin_5s_linear_infinite_reverse]"
                style={{ transform: 'rotateY(65deg)' }}
              />

              {/* Core Glowing Sphere */}
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full relative shadow-[0_0_32px_rgba(34,199,242,0.65)]"
                style={{
                  background:
                    'radial-gradient(circle at 35% 35%, #8FDFFF 0%, #22C7F2 45%, #2F80FF 85%, #0B1220 100%)',
                }}
              >
                {/* Subtle amber computation flicker */}
                <div
                  className="absolute inset-0 rounded-full bg-[#F59E0B] opacity-15 animate-ping"
                  style={{ animationDuration: '2.4s' }}
                />
              </div>

              {/* Surrounding Halo */}
              <div className="absolute -inset-4 rounded-full bg-[#2F80FF]/15 blur-xl pointer-events-none" />
            </div>

            {/* Vertical Solve Stack / Task List */}
            <div className="flex flex-col gap-1.5 w-full max-w-[280px]">
              {SOLVE_STACK.map((task, idx) => {
                const isCompleted = idx < activeSolveItemIndex;
                const isActive = idx === activeSolveItemIndex;
                const isPending = idx > activeSolveItemIndex;

                return (
                  <div
                    key={task}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg border transition-all duration-200 text-xs font-mono ${
                      isActive
                        ? 'bg-[rgba(13,18,32,0.95)] border-[#22C7F2]/50 text-[#F8FBFF] shadow-sm translate-x-1'
                        : isCompleted
                        ? 'bg-[rgba(13,18,32,0.65)] border-white/5 text-[#9FE8D0]'
                        : 'bg-transparent border-transparent text-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      ) : isActive ? (
                        <span className="w-2 h-2 rounded-full bg-[#22C7F2] animate-ping" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-white/20" />
                      )}
                      <span>{task}</span>
                    </div>
                    {isCompleted && (
                      <span className="text-[10px] text-[#10B981] font-semibold">DONE</span>
                    )}
                    {isActive && (
                      <span className="text-[10px] text-[#22C7F2] font-semibold animate-pulse">
                        SOLVING
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* -------------------------------------------------------------------
            PHASES 3, 4, 5: 3D CAD STAGE (Three.js Extruded Cube + Fillet)
        ------------------------------------------------------------------- */}
        {currentPhaseId >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isP5Fading ? 0 : 1 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 w-full h-full"
          >
            <DynamicEzerCadViewer
              isPaused={!isVisible}
              filletProgress={filletProgress}
              highlightEdges={highlightVerticalEdges}
              isWireframeOnly={isP3Wireframe}
              showCallouts={!isP3Wireframe}
              onUserInteractionChange={(interacting) => {
                isUserInteractingWith3DRef.current = interacting;
              }}
            />
          </motion.div>
        )}

        {/* -------------------------------------------------------------------
            PHASE 4 OVERLAYS: Second Command Prompt & Fillet Success Chip
        ------------------------------------------------------------------- */}
        {isPhase4 && (
          <>
            {/* Top-Right Refinement Command Card */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 right-4 z-30 max-w-[270px] pointer-events-none"
            >
              <div className="p-3 rounded-2xl bg-[#0B1220]/90 backdrop-blur-md border border-[#22C7F2]/40 text-white shadow-xl flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#22C7F2] font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>PARAMETRIC REFINEMENT</span>
                </div>
                <p className="text-[12px] font-mono text-[#F8FBFF] leading-snug font-medium">
                  &ldquo;{p4TypedText}&rdquo;
                </p>
              </div>
            </motion.div>

            {/* Center Success Badge after Filleting */}
            <AnimatePresence>
              {showFilletSuccessChip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 220 }}
                  className="absolute bottom-16 z-30 pointer-events-none flex flex-col items-center gap-1"
                >
                  <div className="px-4 py-2 rounded-full bg-[rgba(16,185,129,0.14)] backdrop-blur-md border border-[rgba(16,185,129,0.38)] text-[#10B981] font-mono text-xs font-bold shadow-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span>Fillet complete · 4 edges · R0.200 in</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/50 tracking-wider">
                    No topology errors
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* =======================================================================
          3. TIMELINE / STATE STRIP (Height: ~76px)
             Segmented interactive pills with active blue/cyan glow
      ======================================================================= */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 py-1">
        {PHASES.map((phase) => {
          const isActive = currentPhaseId === phase.id;
          const isDone = currentPhaseId > phase.id || currentPhaseId === 5;
          const Icon = phase.icon;

          return (
            <button
              key={phase.id}
              onClick={() => handleJumpToPhase(phase.id)}
              className={`relative px-3 py-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-[0.98] ${
                isActive
                  ? 'bg-white border-[#22C7F2] shadow-[0_4px_16px_rgba(34,199,242,0.22)]'
                  : isDone
                  ? 'bg-white/80 border-[#10B981]/30 text-[#0F172A] hover:border-[#10B981]/50'
                  : 'bg-white/50 border-[rgba(15,23,42,0.06)] text-[#64748B] hover:bg-white hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                  Phase 0{phase.id}
                </span>
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-[#10B981]" />
                ) : (
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-[#22C7F2] animate-pulse' : 'text-[#64748B]'
                    }`}
                  />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[12px] font-mono font-semibold truncate ${
                    isActive ? 'text-[#0864C7]' : 'text-[#0F172A]'
                  }`}
                >
                  {phase.name}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C7F2] shadow-[0_0_6px_#22C7F2]" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* =======================================================================
          4. FOOTER STATUS STRIP
      ======================================================================= */}
      <div className="pt-3 border-t border-[rgba(15,23,42,0.08)] flex flex-col sm:flex-row items-center justify-between gap-1 text-[10.5px] font-mono text-[#64748B]">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#22C7F2]" />
          <span>Tech stack: Local AI · Rust runtime · SolidWorks workflow</span>
        </div>
        <div>
          <span>Status: Concept demonstration</span>
        </div>
      </div>
    </div>
  );
}

export default EzerVisual;
