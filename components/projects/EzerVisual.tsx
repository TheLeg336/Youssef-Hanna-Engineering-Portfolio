'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import {
  Loader2,
  CheckCircle2,
  Mic,
  Cpu,
  Box,
  Sparkles,
  Folder,
  Search,
  Wifi,
  Volume2,
  Monitor,
} from 'lucide-react';
import { AppBorderBeam, AppThinkingOrb, AppVoiceBeam } from '@/components/ui/LibrariesDevWrapper';
import { useElementVisibility } from '@/lib/useVisibility';
import { useReducedMotion } from '@/components/motion/Reveal';

const DynamicEzerCadViewer = dynamic(() => import('./EzerCadViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[360px] sm:h-[400px] bg-[#F1F5F9] rounded-xl flex items-center justify-center text-xs font-mono text-[#647184] border border-[#CBD5E1]">
      <Loader2 className="w-5 h-5 text-[#178BFF] animate-spin mr-2" />
      <span>Loading 3D CAD Synthesis Viewport…</span>
    </div>
  ),
});

// Initial creation prompt
const WORDS = [
  'Open',
  'SolidWorks',
  'and',
  'build',
  'me',
  'a',
  '2 in',
  '×',
  '2 in',
  '×',
  '2 in',
  'cube',
  'with',
  'a',
  'centered',
  '1 in',
  'diameter',
  'through-hole.',
];

// Secondary in-context modification prompt
const FILLET_WORDS = [
  'Can',
  'you',
  'add',
  'fillets',
  'to',
  'the',
  'corners',
  'of',
  'the',
  'cube',
  'and',
  'the',
  'edges',
  'of',
  'the',
  'hole',
  'with',
  'a',
  'radius',
  'of',
  '0.2 in?',
];

// TIMELINE SCHEDULE (in milliseconds)
// STAGE 1 (0ms - 7500ms): Desktop Workstation & Voice Command
//   0ms - 400ms: Desktop view, pill smoothly expands horizontally above taskbar
//   400ms - 1200ms: Camera zooms down smoothly to pill (scale: 1.34, y: -26px)
//   1000ms - 1700ms: Pill shows "Listening..." state with pulsing cyan dot
//   1700ms - 5000ms: Word-by-word streaming animated like a wave, voice glow fluctuates
//   5000ms - 5400ms: Camera zooms back out to full desktop
//   5400ms - 7400ms: WORKING: BORDER BEAM SWEEPS FOR EXACTLY 2 SECONDS (cyan-blue gradient!)
//   7400ms - 7500ms: Transition to Stage 2
// STAGE 2 (7500ms - 11500ms): Solving Base Constraints (Reasoning Orb)
// STAGE 3 (11500ms - 15000ms): Initial CAD Model (Sharp Cube + Hole in 3D viewport)
// STAGE 4 (15000ms - 24500ms): Live Fillet Edit
//   15000ms - 15400ms: Compact pill expands horizontally near bottom center
//   15400ms - 16000ms: Camera swoosh zooms in smoothly to pill (scale: 1.28, y: -24px)
//   16000ms - 19400ms: Request streams in with undulating voice glow
//   19400ms - 20000ms: Camera swoosh zooms back out to reveal 3D CAD model
//   20000ms - 22400ms: WORKING: BORDER BEAM SWEEPS FOR 2.4 SECONDS ON SUBMIT
//                      Simultaneously, 3D model fillets all corners (R0.200")
//   22400ms - 24500ms: WHOLE THING TRANSFORMS AND SHRINKS WHEN DONE -> Checkmark on left + Done
//                      Continuous 3D rotation; pauses at end if user is still touching model!
const TIMING = {
  // STAGE 1
  DESKTOP_START: 0,
  CAMERA_ZOOM_DOWN_START: 400,
  SPEAKING_START: 1700,
  SPEAKING_END: 5000,
  CAMERA_ZOOM_OUT_START: 5000,
  BORDER_BEAM_START: 5400,
  BORDER_BEAM_END: 7400, // Exactly 2 seconds of border beam!
  STAGE_1_END: 7500,

  // STAGE 2
  SOLVING_START: 7500,
  STAGE_2_END: 11500,

  // STAGE 3
  CAD_STAGE_START: 11500,
  STAGE_3_END: 15000,

  // STAGE 4
  ITERATION_PILL_EXPAND: 15000,
  ITERATION_ZOOM_IN_START: 15400,
  ITERATION_SPEAKING_START: 16000,
  ITERATION_SPEAKING_END: 19400,
  ITERATION_ZOOM_OUT_START: 19400,
  ITERATION_BORDER_BEAM_START: 20000,
  ITERATION_BORDER_BEAM_END: 22400, // 2.4 seconds of border beam while filleting
  FILLET_START: 20000,
  FILLET_END: 22400,
  ITERATION_DONE_START: 22400,
  TOTAL_CYCLE: 24500,
};

// Workflow stages with exact placement along the timeline
const STAGES = [
  {
    id: 'pill_input',
    name: 'Voice Command',
    shortLabel: '1. Voice Command',
    timeLabel: '0:00',
    startMs: 0,
    endMs: TIMING.STAGE_1_END,
    icon: Mic,
  },
  {
    id: 'solving_orb',
    name: 'Solving Constraints',
    shortLabel: '2. Solving Base',
    timeLabel: '0:07',
    startMs: TIMING.SOLVING_START,
    endMs: TIMING.STAGE_2_END,
    icon: Cpu,
  },
  {
    id: 'initial_cad',
    name: 'Initial 3D Model',
    shortLabel: '3. Initial CAD',
    timeLabel: '0:11',
    startMs: TIMING.CAD_STAGE_START,
    endMs: TIMING.STAGE_3_END,
    icon: Box,
  },
  {
    id: 'fillet_edit',
    name: 'Fillet Modification',
    shortLabel: '4. Live Fillet Edit',
    timeLabel: '0:15',
    startMs: TIMING.ITERATION_PILL_EXPAND,
    endMs: TIMING.TOTAL_CYCLE,
    icon: Sparkles,
  },
] as const;

type StageId = typeof STAGES[number]['id'];

export function EzerVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useElementVisibility(containerRef, 0.25);
  const prefersReduced = useReducedMotion();

  // Elapsed timeline counter in milliseconds
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  // Smooth crossfade state on stage change (no slow rewind!)
  const [isStageFading, setIsStageFading] = useState(false);

  // 3D Model active interaction tracking
  const isActivelyDraggingRef = useRef(false);

  // Derive active stage from timeline
  let currentStage: StageId = 'pill_input';
  if (elapsedMs < TIMING.STAGE_1_END) {
    currentStage = 'pill_input';
  } else if (elapsedMs < TIMING.STAGE_2_END) {
    currentStage = 'solving_orb';
  } else if (elapsedMs < TIMING.STAGE_3_END) {
    currentStage = 'initial_cad';
  } else {
    currentStage = 'fillet_edit';
  }

  // Handle user interaction inside 3D model area (touch, drag, rotate)
  const handleModelInteraction = useCallback((interacting: boolean) => {
    isActivelyDraggingRef.current = interacting;
  }, []);

  // Handle clicking on a timeline stage pill with instant clean crossfade
  const handleStageClick = useCallback((stageId: StageId) => {
    const targetStage = STAGES.find((s) => s.id === stageId);
    if (!targetStage) return;

    isActivelyDraggingRef.current = false;
    setIsStageFading(true);

    setTimeout(() => {
      elapsedRef.current = targetStage.startMs;
      setElapsedMs(targetStage.startMs);
      setIsStageFading(false);
    }, 140);
  }, []);

  // Main animation ticker:
  // Continuous playback during all stages.
  // ONLY pauses at the very end if user is actively touching/rotating the 3D model!
  // Pauses when not visible in scroll viewport without resetting!
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
        const isTouching = isActivelyDraggingRef.current;
        const isAtEnd = elapsedRef.current >= TIMING.TOTAL_CYCLE - 250;

        if (isAtEnd && isTouching) {
          // Pauses at the end while user is still touching or rotating the model
          elapsedRef.current = TIMING.TOTAL_CYCLE - 50;
          setElapsedMs(TIMING.TOTAL_CYCLE - 50);
        } else {
          // Continues playing seamlessly throughout the demo
          elapsedRef.current = (elapsedRef.current + delta) % TIMING.TOTAL_CYCLE;
          setElapsedMs(elapsedRef.current);
        }
      }
      lastTimeRef.current = now;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isVisible, prefersReduced]);

  // Stage 1 variables
  const isStage1Zoomed =
    elapsedMs >= TIMING.CAMERA_ZOOM_DOWN_START && elapsedMs < TIMING.CAMERA_ZOOM_OUT_START;
  const isSpeaking = elapsedMs >= TIMING.SPEAKING_START && elapsedMs < TIMING.SPEAKING_END;
  const isListeningInitial =
    elapsedMs >= 1000 && elapsedMs < TIMING.SPEAKING_START;

  const speechProgress = useMemo(() => {
    if (elapsedMs < TIMING.SPEAKING_START) return 0;
    if (elapsedMs >= TIMING.SPEAKING_END) return 1;
    return (elapsedMs - TIMING.SPEAKING_START) / (TIMING.SPEAKING_END - TIMING.SPEAKING_START);
  }, [elapsedMs]);

  // Active word index for progressive wave highlight without layout shift
  const activeWordIndex = useMemo(() => {
    if (elapsedMs < TIMING.SPEAKING_START) return -1;
    if (elapsedMs >= TIMING.SPEAKING_END) return WORDS.length;
    return Math.min(WORDS.length - 1, Math.floor(speechProgress * WORDS.length));
  }, [elapsedMs, speechProgress]);

  // Natural speaking voice wave fluctuation for glow
  const voiceFluctuation = useMemo(() => {
    if (!isSpeaking) return 0.2;
    const t = elapsedMs;
    const v =
      0.35 * Math.sin(t * 0.009) +
      0.3 * Math.sin(t * 0.021) +
      0.2 * Math.cos(t * 0.037) +
      0.5;
    return Math.max(0.15, Math.min(1.0, v));
  }, [elapsedMs, isSpeaking]);

  const { voiceBeamLevel, voiceBeamStrength } = useMemo(() => {
    if (elapsedMs < TIMING.SPEAKING_START) {
      return {
        voiceBeamLevel: 0.16 + Math.sin(elapsedMs * 0.004) * 0.04,
        voiceBeamStrength: 0.7,
      };
    }
    if (elapsedMs < TIMING.SPEAKING_END) {
      return {
        voiceBeamLevel: Math.min(0.75, 0.28 + voiceFluctuation * 0.45),
        voiceBeamStrength: 0.95,
      };
    }
    // Fades out during border beam
    return { voiceBeamLevel: 0, voiceBeamStrength: 0 };
  }, [elapsedMs, voiceFluctuation]);

  // Border beam plays for exactly 2 seconds during the last 2 seconds of part 1
  const isBorderBeamActive =
    elapsedMs >= TIMING.BORDER_BEAM_START && elapsedMs < TIMING.BORDER_BEAM_END;

  // Stage 2 solver steps
  const solveStep1 = elapsedMs >= TIMING.SOLVING_START + 900;
  const solveStep2 = elapsedMs >= TIMING.SOLVING_START + 2100;
  const solveStep3 = elapsedMs >= TIMING.SOLVING_START + 3200;

  // Stage 4 In-Viewport Ezer Pill Calculations
  const isStage4Zoomed =
    elapsedMs >= TIMING.ITERATION_ZOOM_IN_START && elapsedMs < TIMING.ITERATION_ZOOM_OUT_START;
  const isIterationSpeaking =
    elapsedMs >= TIMING.ITERATION_SPEAKING_START && elapsedMs < TIMING.ITERATION_SPEAKING_END;

  const iterationSpeechProgress = useMemo(() => {
    if (elapsedMs < TIMING.ITERATION_SPEAKING_START) return 0;
    if (elapsedMs >= TIMING.ITERATION_SPEAKING_END) return 1;
    return (
      (elapsedMs - TIMING.ITERATION_SPEAKING_START) /
      (TIMING.ITERATION_SPEAKING_END - TIMING.ITERATION_SPEAKING_START)
    );
  }, [elapsedMs]);

  const activeIterationWordIndex = useMemo(() => {
    if (elapsedMs < TIMING.ITERATION_SPEAKING_START) return -1;
    if (elapsedMs >= TIMING.ITERATION_SPEAKING_END) return FILLET_WORDS.length;
    return Math.min(
      FILLET_WORDS.length - 1,
      Math.floor(iterationSpeechProgress * FILLET_WORDS.length)
    );
  }, [elapsedMs, iterationSpeechProgress]);

  // Stage 4 Voice glow level
  const { iterVoiceBeamLevel, iterVoiceBeamStrength } = useMemo(() => {
    if (elapsedMs < TIMING.ITERATION_SPEAKING_START) {
      return { iterVoiceBeamLevel: 0.15, iterVoiceBeamStrength: 0.6 };
    }
    if (elapsedMs < TIMING.ITERATION_SPEAKING_END) {
      const v = 0.3 * Math.sin(elapsedMs * 0.015) + 0.3 * Math.cos(elapsedMs * 0.027) + 0.45;
      return {
        iterVoiceBeamLevel: Math.min(0.72, 0.28 + v * 0.45),
        iterVoiceBeamStrength: 0.95,
      };
    }
    return { iterVoiceBeamLevel: 0, iterVoiceBeamStrength: 0 };
  }, [elapsedMs]);

  // Border beam plays in Stage 4 for ~2.4 seconds while filleting
  const isIterationBorderBeamActive =
    elapsedMs >= TIMING.ITERATION_BORDER_BEAM_START && elapsedMs < TIMING.ITERATION_BORDER_BEAM_END;

  const isIterationDone = elapsedMs >= TIMING.ITERATION_DONE_START;

  // Real-time Fillet Progress: grows smoothly from 0 to 1 during Stage 4 border beam!
  const liveFilletProgress = useMemo(() => {
    if (elapsedMs < TIMING.FILLET_START) return 0;
    if (elapsedMs >= TIMING.FILLET_END) return 1;
    const p = (elapsedMs - TIMING.FILLET_START) / (TIMING.FILLET_END - TIMING.FILLET_START);
    // Smooth cubic ease-in-out curve
    return p * p * (3 - 2 * p);
  }, [elapsedMs]);

  // Overall cycle progress percentage (0 to 100%)
  const cycleProgress = (elapsedMs / TIMING.TOTAL_CYCLE) * 100;

  // Static reduced motion fallback
  if (prefersReduced) {
    return (
      <div ref={containerRef} className="w-full glass-panel rounded-2xl p-6 sm:p-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#178BFF]/10 text-[#0864C7] font-semibold">
              ILLUSTRATIVE WORKFLOW · EZER IN DEVELOPMENT
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#17202A] mt-1">
              Natural Language CAD Synthesis Workflow
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card-solid p-4 rounded-xl space-y-2">
            <div className="text-xs font-mono text-[#0864C7] font-semibold">1. Voice Creation:</div>
            <p className="text-sm text-[#17202A] italic">
              &ldquo;Open SolidWorks and build me a 2 in × 2 in × 2 in cube with a centered 1 in
              diameter through-hole.&rdquo;
            </p>
          </div>

          <div className="pt-2">
            <div className="text-xs font-mono text-[#647184] mb-2 font-semibold">
              2. Synthesized 3D Model with Fillets:
            </div>
            <DynamicEzerCadViewer isPaused={true} filletProgress={1} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full glass-panel rounded-2xl p-4 sm:p-5 md:p-6 overflow-hidden flex flex-col justify-between min-h-[520px]"
    >
      {/* Top Header: Clean title & metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-3 mb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#178BFF]/10 text-[#0864C7] font-semibold border border-[#178BFF]/20">
              Concept Demo · Target Ezer Workflow
            </span>
            <span className="text-[11px] font-mono text-[#647184]">
              Local AI / Real-Time CAD Synthesis
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#17202A] mt-1">
            Autonomous CAD Geometry Synthesis &amp; Live Iteration Loop
          </h3>
        </div>

        <div className="text-xs font-mono text-[#647184] hidden sm:block">
          Interactive Timeline Navigation
        </div>
      </div>

      {/* Main Dynamic Viewport Box with instant smooth crossfade */}
      <div
        className={`relative flex-1 flex flex-col justify-center items-center py-1 min-h-[370px] transition-opacity duration-150 ease-out ${
          isStageFading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <AnimatePresence mode="wait">
          {/* STAGE 1: DESKTOP WORKSTATION WITH TASKBAR, HORIZONTAL EXPANSION, ZOOM DOWN, & 2s BORDER BEAM */}
          {currentStage === 'pill_input' && (
            <motion.div
              key="stage-desktop-workstation"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full min-h-[370px] sm:min-h-[390px] relative rounded-xl overflow-hidden border border-[#CBD5E1] shadow-md bg-[#0A0F1D] flex flex-col justify-between"
            >
              {/* Workstation Desktop Camera Zoom Wrapper */}
              <motion.div
                className="w-full h-full absolute inset-0 flex flex-col justify-between pointer-events-none"
                style={{ transformOrigin: '50% 86%' }}
                animate={{
                  scale: isStage1Zoomed ? 1.34 : 1,
                  y: isStage1Zoomed ? -26 : 0,
                }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Desktop Wallpaper with Subtle Engineering Coordinate Grid */}
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.35) 1px, transparent 0)`,
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Desktop Technical Coordinate Overlay & Cinematic Chapter HUD */}
                <div className="absolute top-3 inset-x-4 flex items-center justify-between text-[10px] font-mono select-none z-20">
                  <div className="text-[#64748B] flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-white/90 font-semibold">
                      <Monitor className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>Workstation Desktop</span>
                    </span>
                    <span className="opacity-60 hidden sm:inline">X: 0.000 Y: 0.000 Z: 0.000</span>
                  </div>

                  {/* Cinematic Trailer Act I Badge */}
                  <div className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[9.5px] font-mono text-[#38BDF8] flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
                    <span>ACT I // NATURAL LANGUAGE INTENT</span>
                    <span className="text-white/40">|</span>
                    <span className="text-white/80">0:0{Math.min(7, Math.floor(elapsedMs / 1000))}</span>
                  </div>
                </div>

                {/* Fully Hooked-Up Interactive Desktop Shortcuts (Zero Phoney Buttons!) */}
                <div className="absolute top-11 left-4 flex flex-col gap-3.5 select-none pointer-events-auto">
                  {/* SolidWorks 2025 Icon -> Jumps to 3D CAD Stage */}
                  <button
                    type="button"
                    onClick={() => handleStageClick('initial_cad')}
                    title="Shortcut: Jump to 3D CAD Model (Stage 3)"
                    className="flex flex-col items-center gap-1 w-16 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] rounded-xl p-1 -m-1 transition-transform active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-700 to-red-900 border border-white/20 shadow-md flex items-center justify-center text-white font-bold text-xs group-hover:border-[#38BDF8] group-hover:shadow-[0_0_12px_rgba(23,139,255,0.4)] transition-all">
                      SW
                    </div>
                    <span className="text-[10px] font-mono text-white/90 text-center leading-tight drop-shadow-md group-hover:text-[#38BDF8] transition-colors">
                      SolidWorks
                    </span>
                  </button>

                  {/* Ezer Voice Agent Icon -> Replays Voice Command */}
                  <button
                    type="button"
                    onClick={() => handleStageClick('pill_input')}
                    title="Shortcut: Replay Voice Input (Stage 1)"
                    className="flex flex-col items-center gap-1 w-16 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] rounded-xl p-1 -m-1 transition-transform active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#38BDF8]/40 shadow-md flex items-center justify-center text-[#38BDF8] group-hover:border-[#00F0FF] group-hover:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all">
                      <Mic className="w-5 h-5 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-mono text-white/90 text-center leading-tight drop-shadow-md group-hover:text-[#00F0FF] transition-colors">
                      Ezer Agent
                    </span>
                  </button>

                  {/* CAD Workspace Folder -> Jumps to Live Fillet Edit */}
                  <button
                    type="button"
                    onClick={() => handleStageClick('fillet_edit')}
                    title="Shortcut: Jump to Live Fillet Modification (Stage 4)"
                    className="flex flex-col items-center gap-1 w-16 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] rounded-xl p-1 -m-1 transition-transform active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-white/10 shadow-md flex items-center justify-center text-[#94A3B8] group-hover:border-[#38BDF8] group-hover:shadow-[0_0_12px_rgba(56,189,248,0.4)] transition-all">
                      <Folder className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-[10px] font-mono text-white/90 text-center leading-tight drop-shadow-md group-hover:text-[#38BDF8] transition-colors">
                      Part Fillets
                    </span>
                  </button>
                </div>

                {/* THE EZER PILL: EXPANDS HORIZONTALLY SLIGHTLY ABOVE THE TASKBAR */}
                <div className="absolute bottom-[48px] sm:bottom-[52px] inset-x-0 z-30 pointer-events-auto flex flex-col items-center justify-center px-3">
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'bottom center' }}
                    className="relative w-[310px] sm:w-[335px] max-w-[90vw] flex flex-col items-center"
                  >
                    <AppVoiceBeam
                      type="pill"
                      colorVariant="ocean"
                      theme="dark"
                      level={voiceBeamLevel}
                      strength={voiceBeamStrength}
                      reach={1.45}
                      spread={1.2}
                      bend={35}
                      bloomHeight={1.7}
                      coreLight={0}
                      palette={['#00F0FF', '#178BFF', '#38BDF8', '#0284C7']}
                      className="w-full"
                    >
                      <AppBorderBeam
                        size="md"
                        colorVariant="ocean"
                        strength={1.0}
                        active={isBorderBeamActive}
                        theme="dark"
                        borderRadius={9999}
                        duration={2.0}
                        className="w-full rounded-full shadow-2xl"
                      >
                        <div className="relative w-full rounded-full bg-[#070B12] border border-white/20 px-4 sm:px-5 py-2 sm:py-2.5 text-white flex items-center justify-center min-h-[42px] overflow-hidden shadow-2xl">
                          {/* 1. Initial Resting Listening State */}
                          {isListeningInitial && (
                            <div className="flex items-center justify-center gap-2 py-0.5 text-xs font-mono font-medium text-white/90 relative z-30 select-none">
                              <span className="w-2 h-2 rounded-full bg-[#178BFF] animate-pulse" />
                              <span>Listening...</span>
                            </div>
                          )}

                          {/* 2. Wave Word Streaming (Without blocking text or layout shift) */}
                          {!isListeningInitial && !isBorderBeamActive && (
                            <div className="relative z-30 w-full text-center leading-snug">
                              <span className="font-mono text-xs sm:text-[12.5px] font-semibold">
                                {WORDS.map((word, i) => {
                                  const isSpoken =
                                    elapsedMs >= TIMING.SPEAKING_END || i <= activeWordIndex;
                                  const isCurrent =
                                    i === activeWordIndex && elapsedMs < TIMING.SPEAKING_END;

                                  return (
                                    <span
                                      key={`${word}-${i}`}
                                      className={`inline-block mr-1 transition-all duration-120 ${
                                        isCurrent
                                          ? 'text-[#38BDF8] font-bold scale-[1.08] drop-shadow-[0_0_8px_rgba(56,189,248,0.95)]'
                                          : isSpoken
                                          ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] opacity-100'
                                          : 'opacity-0'
                                      }`}
                                    >
                                      {word}
                                    </span>
                                  );
                                })}
                              </span>
                            </div>
                          )}

                          {/* 3. Border beam working feedback (2.0s duration!) */}
                          {isBorderBeamActive && (
                            <div className="relative z-30 flex items-center justify-center gap-2 text-xs font-mono font-semibold text-[#38BDF8] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
                              <span>Submitting natural language command to CAD engine…</span>
                            </div>
                          )}
                        </div>
                      </AppBorderBeam>
                    </AppVoiceBeam>
                  </motion.div>
                </div>
              </motion.div>

              {/* REALISTIC DESKTOP BOTTOM TASKBAR WITH INTERACTIVE SHORTCUTS */}
              <div className="absolute bottom-0 inset-x-0 h-10 bg-[#0F172A]/90 backdrop-blur-md border-t border-white/10 flex items-center justify-between px-3 select-none z-40 pointer-events-auto">
                {/* Left: Start button & Active Taskbar apps */}
                <div className="flex items-center gap-2">
                  {/* Start menu icon -> Restarts demo */}
                  <button
                    type="button"
                    onClick={() => handleStageClick('pill_input')}
                    title="Click to restart Ezer workflow demo"
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#178BFF]"
                  >
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-1.5 h-1.5 bg-[#00F0FF] rounded-xs" />
                      <div className="w-1.5 h-1.5 bg-[#178BFF] rounded-xs" />
                      <div className="w-1.5 h-1.5 bg-[#38BDF8] rounded-xs" />
                      <div className="w-1.5 h-1.5 bg-[#0284C7] rounded-xs" />
                    </div>
                  </button>

                  {/* Search pill */}
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[#94A3B8]">
                    <Search className="w-3 h-3 text-[#64748B]" />
                    <span>Search CAD models…</span>
                  </div>

                  {/* Active App: SolidWorks -> Shortcut to 3D CAD */}
                  <button
                    type="button"
                    onClick={() => handleStageClick('initial_cad')}
                    title="Switch to SolidWorks 3D CAD Model (Stage 3)"
                    className="relative flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-white/10 active:scale-95 transition-all cursor-pointer text-xs font-mono text-white/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#178BFF]"
                  >
                    <div className="w-4 h-4 rounded bg-red-600 flex items-center justify-center text-[9px] font-bold text-white shadow-2xs">
                      SW
                    </div>
                    <span className="hidden md:inline text-[10px]">SolidWorks 2025</span>
                    <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#178BFF] rounded-full" />
                  </button>

                  {/* Active App: Ezer Agent -> Shortcut to Voice Input */}
                  <button
                    type="button"
                    onClick={() => handleStageClick('pill_input')}
                    title="Switch to Ezer Voice Agent (Stage 1)"
                    className="relative flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-white/10 active:scale-95 transition-all cursor-pointer text-xs font-mono text-[#38BDF8] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#178BFF]"
                  >
                    <Mic className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span className="hidden md:inline text-[10px]">Ezer Active</span>
                    <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#00F0FF] rounded-full" />
                  </button>
                </div>

                {/* Right: System Tray & Clock */}
                <div className="flex items-center gap-3 text-[10px] font-mono text-[#94A3B8]">
                  <span className="hidden sm:inline text-[#059669] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                    <span>SW API Ready</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <Wifi className="w-3.5 h-3.5" />
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-white/80 font-medium">11:42 AM</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STAGE 2: SOLVING ORB INSIDE JET-BLACK CIRCLE WITH CINEMATIC TELEMETRY */}
          {currentStage === 'solving_orb' && (
            <motion.div
              key="stage-solving-orb"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full relative flex flex-col items-center justify-center py-4 space-y-5"
            >
              {/* Cinematic Chapter II Badge */}
              <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-white/70 backdrop-blur-md border border-[#CBD5E1] text-[9.5px] font-mono text-[#0864C7] flex items-center gap-1.5 shadow-2xs select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF] animate-pulse" />
                <span>ACT II // CONSTRAINT SOLVER ENGINE</span>
                <span className="opacity-40">|</span>
                <span className="font-semibold">0:0{Math.min(11, Math.floor(elapsedMs / 1000))}</span>
              </div>

              {/* Neural Sphere with Concentric Telemetry Orbit Rings */}
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute -inset-3.5 border border-[#178BFF]/30 border-dashed rounded-full pointer-events-none animate-spin"
                  style={{ animationDuration: '14s' }}
                />
                <div className="absolute -inset-6 border border-[#38BDF8]/15 rounded-full pointer-events-none" />

                <motion.div
                  initial={{ width: 335, height: 42, borderRadius: 21 }}
                  animate={{ width: 96, height: 96, borderRadius: 48 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative bg-black border border-[#178BFF]/50 shadow-2xl flex items-center justify-center overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-full bg-radial from-[#178BFF]/25 to-transparent pointer-events-none" />
                  <AppThinkingOrb
                    state="solving"
                    size={64}
                    scale={1.35}
                    dots={2.5}
                    dotSize={0.8}
                    theme="dark"
                  />
                </motion.div>
              </div>

              <div className="text-center space-y-2.5 max-w-sm w-full">
                <div>
                  <div className="text-xs font-mono font-bold text-[#0864C7] tracking-wider uppercase">
                    REASONING &amp; SOLVING CAD CONSTRAINTS
                  </div>
                  <div className="text-[11px] font-mono text-[#647184] mt-0.5">
                    Decomposing natural language prompt into SolidWorks geometry steps
                  </div>
                </div>

                <div className="space-y-1.5 text-left text-[11px] font-mono bg-white/80 p-3 rounded-xl border border-black/5 shadow-xs">
                  <div
                    className={`flex items-center justify-between transition-colors ${
                      solveStep1 ? 'text-[#059669]' : 'text-[#94A3B8]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {solveStep1 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-current shrink-0" />
                      )}
                      <span>Base: 2 in × 2 in centered square</span>
                    </div>
                    <span className="text-[9.5px] opacity-70">{solveStep1 ? '+0.9s' : '...'}</span>
                  </div>

                  <div
                    className={`flex items-center justify-between transition-colors ${
                      solveStep2 ? 'text-[#059669]' : 'text-[#94A3B8]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {solveStep2 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-current shrink-0" />
                      )}
                      <span>Extrude Boss-Base: 2.000 in depth blind</span>
                    </div>
                    <span className="text-[9.5px] opacity-70">{solveStep2 ? '+2.1s' : '...'}</span>
                  </div>

                  <div
                    className={`flex items-center justify-between transition-colors ${
                      solveStep3 ? 'text-[#059669]' : 'text-[#94A3B8]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {solveStep3 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-current shrink-0" />
                      )}
                      <span>Cut-Extrude: Ø 1.000 in through-all hole</span>
                    </div>
                    <span className="text-[9.5px] opacity-70">{solveStep3 ? '+3.2s' : '...'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STAGE 3 & 4: 3D CAD MODEL VIEWPORT WITH SWOOSH ZOOM, COMPACT PILL, BORDER BEAM, & SHRINK TO DONE */}
          {(currentStage === 'initial_cad' || currentStage === 'fillet_edit') && (
            <motion.div
              key="stage-cad-interactive-viewport"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col space-y-2.5"
            >
              {/* CAD Model Container with Swoosh Zoom Wrapper */}
              <div
                className="relative w-full rounded-xl overflow-hidden border border-[#CBD5E1] shadow-inner bg-[#EEF2F6]"
                onPointerDown={() => handleModelInteraction(true)}
                onPointerUp={() => handleModelInteraction(false)}
                onClick={() => handleModelInteraction(false)}
              >
                {/* Cinematic Chapter Badge (Top-Right) */}
                <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none px-2.5 py-1 rounded-md bg-white/80 backdrop-blur-md border border-[#CBD5E1] text-[9.5px] font-mono text-[#0864C7] flex items-center gap-1.5 shadow-2xs select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF] animate-pulse" />
                  <span>
                    {currentStage === 'initial_cad'
                      ? 'ACT III // 3D BOUNDARY REPRESENTATION'
                      : 'ACT IV // REAL-TIME TOPOLOGY MODIFICATION'}
                  </span>
                  <span className="opacity-40">|</span>
                  <span className="font-semibold">
                    0:{Math.min(24, Math.floor(elapsedMs / 1000)) < 10 ? '0' : ''}
                    {Math.min(24, Math.floor(elapsedMs / 1000))}
                  </span>
                </div>

                {/* Cinematic Engineering Telemetry HUD (Top-Left) */}
                <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none flex flex-col gap-0.5 text-[9.5px] font-mono text-[#64748B] bg-white/80 backdrop-blur-md px-2.5 py-1.5 rounded-md border border-[#CBD5E1] shadow-2xs select-none">
                  <span className="text-[#0864C7] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF] animate-pulse" />
                    <span>
                      {currentStage === 'initial_cad'
                        ? 'PARAMETRIC B-REP SYNTHESIS'
                        : isIterationDone
                        ? 'TOPOLOGY MODIFICATION COMPLETE'
                        : 'LIVE FILLET SOLVER ACTIVE'}
                    </span>
                  </span>
                  <span>
                    {currentStage === 'initial_cad'
                      ? 'CUBE: 2.000″ × 2.000″ × 2.000″ // BORE: Ø 1.000″'
                      : `FILLET: R 0.200″ (${Math.round(liveFilletProgress * 100)}%) // 14 EDGES`}
                  </span>
                </div>

                {/* Swoosh Zoom Camera Transform Wrapper */}
                <motion.div
                  className="w-full h-full"
                  style={{ transformOrigin: '50% 86%' }}
                  animate={{
                    scale: isStage4Zoomed ? 1.28 : 1,
                    y: isStage4Zoomed ? -24 : 0,
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* 3D WebGL Canvas */}
                  <DynamicEzerCadViewer
                    filletProgress={liveFilletProgress}
                    onUserInteractionChange={handleModelInteraction}
                  />
                </motion.div>

                {/* IN-VIEWPORT COMPACT EZER PILL:
                    - Starts in Stage 4: expands horizontally near bottom center
                    - Swoosh zooms in while request streams
                    - Swoosh zooms out to reveal 3D CAD model
                    - BORDER BEAM SWEEPS while filleting (no orb!)
                    - Transforms & shrinks when done with green checkmark on left */}
                {currentStage === 'fillet_edit' && (
                  <div className="absolute bottom-3 sm:bottom-3.5 inset-x-0 z-30 pointer-events-auto flex flex-col items-center justify-end px-2">
                    <motion.div
                      key="iter-pill-motion-container"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{
                        scaleX: 1,
                        opacity: 1,
                      }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: 'bottom center' }}
                      className={`flex flex-col items-center transition-all duration-300 ${
                        isIterationDone
                          ? 'w-auto max-w-[90vw]'
                          : 'w-[270px] sm:w-[290px] max-w-[88vw]'
                      }`}
                    >
                      <AppVoiceBeam
                        type="pill"
                        colorVariant="ocean"
                        theme="dark"
                        level={iterVoiceBeamLevel}
                        strength={iterVoiceBeamStrength}
                        palette={['#00F0FF', '#178BFF', '#38BDF8', '#0284C7']}
                        reach={1.4}
                        spread={1.15}
                        bend={30}
                        bloomHeight={1.6}
                        coreLight={0}
                        className="w-full"
                      >
                        <AppBorderBeam
                          size="md"
                          colorVariant="ocean"
                          strength={1.0}
                          active={isIterationBorderBeamActive}
                          theme="dark"
                          borderRadius={9999}
                          duration={2.0}
                          className="w-full rounded-full shadow-2xl"
                        >
                          <motion.div
                            animate={{
                              paddingLeft: isIterationDone ? 16 : 14,
                              paddingRight: isIterationDone ? 16 : 14,
                            }}
                            className="relative w-full rounded-full bg-[#070B12] border border-white/20 py-1.5 sm:py-2 text-white flex items-center justify-center min-h-[38px] shadow-2xl overflow-hidden"
                          >
                            {/* State A: Clean word streaming of the fillet modification command */}
                            {!isIterationBorderBeamActive && !isIterationDone && (
                              <div className="relative z-30 w-full text-center leading-snug">
                                <span className="font-mono text-[11px] sm:text-[11.5px] font-semibold">
                                  {FILLET_WORDS.map((word, i) => {
                                    const isSpoken =
                                      elapsedMs >= TIMING.ITERATION_SPEAKING_END ||
                                      i <= activeIterationWordIndex;
                                    const isCurrent =
                                      i === activeIterationWordIndex &&
                                      elapsedMs < TIMING.ITERATION_SPEAKING_END;

                                    return (
                                      <span
                                        key={`${word}-${i}`}
                                        className={`inline-block mr-1 transition-all duration-120 ${
                                          isCurrent
                                            ? 'text-[#38BDF8] font-bold scale-[1.06] drop-shadow-[0_0_8px_rgba(56,189,248,0.95)]'
                                            : isSpoken
                                            ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] opacity-100'
                                            : 'opacity-0'
                                        }`}
                                      >
                                        {word}
                                      </span>
                                    );
                                  })}
                                </span>
                              </div>
                            )}

                            {/* State B: BorderBeam active + Real-time Working Feedback (NO ORB!) */}
                            {isIterationBorderBeamActive && !isIterationDone && (
                              <div className="relative z-30 flex items-center justify-center gap-1.5 text-xs font-mono font-semibold text-[#38BDF8] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
                                <span>Applying 0.200″ Fillets…</span>
                              </div>
                            )}

                            {/* State C: Whole thing transforms & shrinks when done with green checkmark on left */}
                            {isIterationDone && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                className="relative z-30 flex items-center justify-center gap-1.5 text-xs font-mono font-semibold text-[#10B981] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] whitespace-nowrap"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                                <span>Done · 0.200″ Fillets Applied</span>
                              </motion.div>
                            )}
                          </motion.div>
                        </AppBorderBeam>
                      </AppVoiceBeam>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Viewport Status & Verified Specs */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] font-mono text-[#647184]">
                <span className="flex items-center gap-1.5 text-[#059669] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {isIterationDone
                      ? 'Cube (2″ × 2″ × 2″) + Hole (Ø 1.000″) + Fillets (R0.200″)'
                      : 'Cube (2″ × 2″ × 2″) + Centered Through-Hole (Ø 1.000″)'}
                  </span>
                </span>
                <span className="text-[#0864C7]">Click &amp; drag to rotate model in 3D</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SEAMLESS, INTEGRATED TIMELINE BAR */}
      <div className="mt-3 pt-2.5 border-t border-black/5 flex flex-col gap-2">
        <div className="relative w-full bg-slate-100/80 rounded-xl p-1 border border-slate-200 shadow-inner flex flex-col gap-1">
          {/* 4 Segmented Stage Pills */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-1 w-full"
            role="tablist"
            aria-label="Ezer workflow stages"
          >
            {STAGES.map((stg) => {
              const isActive = currentStage === stg.id;
              const isPast =
                (stg.id === 'pill_input' && currentStage !== 'pill_input') ||
                (stg.id === 'solving_orb' &&
                  (currentStage === 'initial_cad' || currentStage === 'fillet_edit')) ||
                (stg.id === 'initial_cad' && currentStage === 'fillet_edit');

              const Icon = stg.icon;

              return (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => handleStageClick(stg.id)}
                  className={`relative py-1.5 px-2 rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] active:scale-[0.98] ${
                    isActive
                      ? 'bg-white text-[#0864C7] font-semibold shadow-xs border border-[#178BFF]/25'
                      : isPast
                      ? 'text-[#0864C7] hover:bg-white/60 font-medium'
                      : 'text-[#647184] hover:text-[#17202A] hover:bg-white/40'
                  }`}
                  aria-label={`${stg.name} at ${stg.timeLabel}`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-[#178BFF]' : isPast ? 'text-[#0864C7]' : 'text-[#94A3B8]'
                    }`}
                  />
                  <span className="truncate">{stg.shortLabel}</span>
                  <span className="text-[10px] opacity-60 hidden md:inline">
                    {stg.timeLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Seamless Continuous Progress Line */}
          <div className="relative w-full h-1 bg-slate-200/80 rounded-full overflow-hidden mx-auto">
            <motion.div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#0284C7] via-[#178BFF] to-[#38BDF8] rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, cycleProgress))}%` }}
              transition={{ ease: 'linear', duration: 0.05 }}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono text-[#647184]">
          <span>Tech Stack: Rust + SolidWorks API + Local Whisper</span>
          <span className="text-[#0864C7] font-semibold">Stage: Pre-Alpha Integration</span>
        </div>
      </div>
    </div>
  );
}

export default EzerVisual;
