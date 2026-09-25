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
    <div className="w-full h-[340px] sm:h-[380px] bg-[#F1F5F9] rounded-xl flex items-center justify-center text-xs font-mono text-[#647184] border border-[#CBD5E1]">
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
  'through-hole.',
];

// Secondary in-context modification prompt
const FILLET_WORDS = [
  'Add',
  '0.2 in',
  'fillets',
  'to',
  'all',
  'cube',
  'corners',
  'and',
  'hole',
  'edges.',
];

// Climax final statement
const ENDLESS_WORDS = [
  'the',
  'possibilities',
  'are',
  'endless',
];

// TIMELINE SCHEDULE (in milliseconds)
const TIMING = {
  // STAGE 1 (0 - 7500ms)
  DESKTOP_START: 0,
  CAMERA_ZOOM_DOWN_START: 400,
  SPEAKING_START: 1600,
  SPEAKING_END: 4800,
  CAMERA_ZOOM_OUT_START: 4800,
  BORDER_BEAM_START: 5200,
  BORDER_BEAM_END: 7200,
  STAGE_1_END: 7400,

  // STAGE 2 (7400 - 11000ms)
  SOLVING_START: 7400,
  STAGE_2_END: 11000,

  // STAGE 3 (11000 - 14400ms)
  CAD_STAGE_START: 11000,
  STAGE_3_END: 14400,

  // STAGE 4 (14400 - 30400ms)
  ITERATION_PILL_EXPAND: 14400,
  ITERATION_ZOOM_IN_START: 14800,
  ITERATION_SPEAKING_START: 15400,
  ITERATION_SPEAKING_END: 18400,
  ITERATION_ZOOM_OUT_START: 18400,
  ITERATION_BORDER_BEAM_START: 19000,
  ITERATION_BORDER_BEAM_END: 21400,
  FILLET_START: 19000,
  FILLET_END: 21400,
  ITERATION_DONE_START: 21400,
  
  // FINAL CLIMAX: ZOOM DOWN AGAIN & STREAM "the possibilities are endless"
  FINAL_ZOOM_DOWN_START: 22600,
  ENDLESS_STREAM_START: 23100,
  ENDLESS_STREAM_END: 24900,
  FINAL_COLLAPSE_START: 25400,

  // OUTRO: FADE TO BLACK -> "zer" -> "e" SLAMS IN WITH IMPACT & PARTICLES -> RESTART
  BLACKOUT_START: 26000,
  ZER_APPEAR_START: 26400,
  E_HIT_START: 27100,
  IMPACT_MOMENT: 27380,
  SHOCKWAVE_END: 28300,
  OUTRO_FADE_TO_RESTART: 29700,
  TOTAL_CYCLE: 30400,
};

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
    name: 'Constraint Solving',
    shortLabel: '2. Solving Engine',
    timeLabel: '0:07',
    startMs: TIMING.SOLVING_START,
    endMs: TIMING.STAGE_2_END,
    icon: Cpu,
  },
  {
    id: 'initial_cad',
    name: '3D CAD Model',
    shortLabel: '3. 3D Geometry',
    timeLabel: '0:11',
    startMs: TIMING.CAD_STAGE_START,
    endMs: TIMING.STAGE_3_END,
    icon: Box,
  },
  {
    id: 'fillet_edit',
    name: 'Live Modification',
    shortLabel: '4. Fillet & Outro',
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

  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const [isStageFading, setIsStageFading] = useState(false);
  const isActivelyDraggingRef = useRef(false);

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

  const handleModelInteraction = useCallback((interacting: boolean) => {
    isActivelyDraggingRef.current = interacting;
  }, []);

  const handleStageClick = useCallback((stageId: StageId) => {
    const targetStage = STAGES.find((s) => s.id === stageId);
    if (!targetStage) return;

    isActivelyDraggingRef.current = false;
    setIsStageFading(true);

    setTimeout(() => {
      elapsedRef.current = targetStage.startMs;
      setElapsedMs(targetStage.startMs);
      setIsStageFading(false);
    }, 120);
  }, []);

  // Continuous animation ticker that pauses offscreen without resetting!
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
        const isAtEnd = elapsedRef.current >= TIMING.TOTAL_CYCLE - 300;

        if (isAtEnd && isTouching) {
          elapsedRef.current = TIMING.TOTAL_CYCLE - 50;
          setElapsedMs(TIMING.TOTAL_CYCLE - 50);
        } else {
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
  const isListeningInitial = elapsedMs >= 800 && elapsedMs < TIMING.SPEAKING_START;

  const speechProgress = useMemo(() => {
    if (elapsedMs < TIMING.SPEAKING_START) return 0;
    if (elapsedMs >= TIMING.SPEAKING_END) return 1;
    return (elapsedMs - TIMING.SPEAKING_START) / (TIMING.SPEAKING_END - TIMING.SPEAKING_START);
  }, [elapsedMs]);

  const activeWordIndex = useMemo(() => {
    if (elapsedMs < TIMING.SPEAKING_START) return -1;
    if (elapsedMs >= TIMING.SPEAKING_END) return WORDS.length;
    return Math.min(WORDS.length - 1, Math.floor(speechProgress * WORDS.length));
  }, [elapsedMs, speechProgress]);

  const isBorderBeamActive =
    elapsedMs >= TIMING.BORDER_BEAM_START && elapsedMs < TIMING.BORDER_BEAM_END;

  // Stage 2 solver steps
  const solveStep1 = elapsedMs >= TIMING.SOLVING_START + 800;
  const solveStep2 = elapsedMs >= TIMING.SOLVING_START + 1800;
  const solveStep3 = elapsedMs >= TIMING.SOLVING_START + 2800;

  // Stage 4 In-Viewport Ezer Pill Calculations
  const isStage4Zoomed =
    (elapsedMs >= TIMING.ITERATION_ZOOM_IN_START && elapsedMs < TIMING.ITERATION_ZOOM_OUT_START) ||
    (elapsedMs >= TIMING.FINAL_ZOOM_DOWN_START && elapsedMs < TIMING.BLACKOUT_START);

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

  const isIterationBorderBeamActive =
    elapsedMs >= TIMING.ITERATION_BORDER_BEAM_START && elapsedMs < TIMING.ITERATION_BORDER_BEAM_END;

  const isIterationDone = elapsedMs >= TIMING.ITERATION_DONE_START;

  // Real-time Fillet Progress (0 to 1)
  const liveFilletProgress = useMemo(() => {
    if (elapsedMs < TIMING.FILLET_START) return 0;
    if (elapsedMs >= TIMING.FILLET_END) return 1;
    const p = (elapsedMs - TIMING.FILLET_START) / (TIMING.FILLET_END - TIMING.FILLET_START);
    return p * p * (3 - 2 * p);
  }, [elapsedMs]);

  // FINAL CLIMAX: "the possibilities are endless" streaming progress
  const isEndlessClimax = elapsedMs >= TIMING.FINAL_ZOOM_DOWN_START;
  const isEndlessStreaming =
    elapsedMs >= TIMING.ENDLESS_STREAM_START && elapsedMs < TIMING.ENDLESS_STREAM_END;

  const endlessProgress = useMemo(() => {
    if (elapsedMs < TIMING.ENDLESS_STREAM_START) return 0;
    if (elapsedMs >= TIMING.ENDLESS_STREAM_END) return 1;
    return (
      (elapsedMs - TIMING.ENDLESS_STREAM_START) /
      (TIMING.ENDLESS_STREAM_END - TIMING.ENDLESS_STREAM_START)
    );
  }, [elapsedMs]);

  const activeEndlessWordIndex = useMemo(() => {
    if (elapsedMs < TIMING.ENDLESS_STREAM_START) return -1;
    if (elapsedMs >= TIMING.ENDLESS_STREAM_END) return ENDLESS_WORDS.length;
    return Math.min(
      ENDLESS_WORDS.length - 1,
      Math.floor(endlessProgress * ENDLESS_WORDS.length)
    );
  }, [elapsedMs, endlessProgress]);

  const isFinalCollapsed = elapsedMs >= TIMING.FINAL_COLLAPSE_START;

  // OUTRO: Blackout & "zer" + "e" collision animation states
  const isBlackoutActive = elapsedMs >= TIMING.BLACKOUT_START;
  const isZerVisible = elapsedMs >= TIMING.ZER_APPEAR_START;
  const isEIncoming = elapsedMs >= TIMING.E_HIT_START;
  const hasImpactOccurred = elapsedMs >= TIMING.IMPACT_MOMENT;
  const isShockwaveActive = elapsedMs >= TIMING.IMPACT_MOMENT && elapsedMs < TIMING.SHOCKWAVE_END;
  const isOutroFadingOut = elapsedMs >= TIMING.OUTRO_FADE_TO_RESTART;

  const cycleProgress = (elapsedMs / TIMING.TOTAL_CYCLE) * 100;

  if (prefersReduced) {
    return (
      <div ref={containerRef} className="w-full glass-panel rounded-2xl p-6 sm:p-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#178BFF]/10 text-[#0864C7] font-semibold">
              CONCEPT DEMO · EZER IN DEVELOPMENT
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#17202A] mt-1">
              Natural Language CAD Synthesis Workflow
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card-solid p-4 rounded-xl space-y-2">
            <div className="text-xs font-mono text-[#0864C7] font-semibold">Voice Command:</div>
            <p className="text-sm text-[#17202A] italic">
              &ldquo;Build me a 2 in × 2 in × 2 in cube with a centered 1 in diameter through-hole.&rdquo;
            </p>
          </div>

          <div className="pt-2">
            <DynamicEzerCadViewer isPaused={true} filletProgress={1} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full glass-panel rounded-2xl p-4 sm:p-5 md:p-6 overflow-hidden flex flex-col justify-between min-h-[500px]"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-3 mb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#178BFF]/10 text-[#0864C7] font-semibold border border-[#178BFF]/20">
              CONCEPT DEMO · EZER IN DEVELOPMENT
            </span>
            <span className="text-[11px] font-mono text-[#647184]">
              Local AI / CAD Automation
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#17202A] mt-1">
            Autonomous CAD Synthesis &amp; Modification Loop
          </h3>
        </div>

        <div className="text-xs font-mono text-[#647184] hidden sm:block">
          Interactive Act Navigation
        </div>
      </div>

      {/* Main Dynamic Viewport */}
      <div
        className={`relative flex-1 flex flex-col justify-center items-center py-1 min-h-[350px] transition-opacity duration-200 ease-out ${
          isStageFading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <AnimatePresence mode="wait">
          {/* ACT 1: DESKTOP WORKSTATION */}
          {currentStage === 'pill_input' && (
            <motion.div
              key="stage-desktop-workstation"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full min-h-[350px] sm:min-h-[370px] relative rounded-xl overflow-hidden border border-[#CBD5E1] shadow-md bg-[#0A0F1D] flex flex-col justify-between"
            >
              {/* Camera Zoom Wrapper */}
              <motion.div
                className="w-full h-full absolute inset-0 flex flex-col justify-between pointer-events-none"
                style={{ transformOrigin: '50% 86%' }}
                animate={{
                  scale: isStage1Zoomed ? 1.25 : 1,
                  y: isStage1Zoomed ? -18 : 0,
                }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Wallpaper grid */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.35) 1px, transparent 0)`,
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* HUD Overlay */}
                <div className="absolute top-3 inset-x-4 flex items-center justify-between text-[10px] font-mono select-none z-20">
                  <div className="text-[#64748B] flex items-center gap-2">
                    <Monitor className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span className="text-white/80 font-medium">Workstation Environment</span>
                  </div>

                  <div className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[9.5px] font-mono text-[#38BDF8] flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
                    <span>ACT I // VOICE COMMAND INTENT</span>
                  </div>
                </div>

                {/* Desktop Shortcuts */}
                <div className="absolute top-11 left-4 flex flex-col gap-3 select-none pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => handleStageClick('initial_cad')}
                    title="Jump to 3D CAD Model (Stage 3)"
                    className="flex flex-col items-center gap-1 w-14 group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#178BFF] rounded-lg p-1 transition-transform active:scale-95"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-900 border border-white/20 shadow-md flex items-center justify-center text-white font-bold text-xs group-hover:border-[#38BDF8] transition-all">
                      SW
                    </div>
                    <span className="text-[9.5px] font-mono text-white/80 text-center leading-tight">
                      CAD Solid
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStageClick('fillet_edit')}
                    title="Jump to Live Fillet Modification (Stage 4)"
                    className="flex flex-col items-center gap-1 w-14 group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#178BFF] rounded-lg p-1 transition-transform active:scale-95"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#1E293B] border border-white/10 shadow-md flex items-center justify-center text-[#94A3B8] group-hover:border-[#38BDF8] transition-all">
                      <Folder className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-[9.5px] font-mono text-white/80 text-center leading-tight">
                      Fillets
                    </span>
                  </button>
                </div>

                {/* COMPACT SLEEK EZER PILL */}
                <div className="absolute bottom-[46px] inset-x-0 z-30 pointer-events-auto flex flex-col items-center justify-center px-3">
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'bottom center' }}
                    className="relative w-[245px] sm:w-[265px] max-w-[88vw] flex flex-col items-center"
                  >
                    <AppBorderBeam
                      size="sm"
                      colorVariant="ocean"
                      strength={1.0}
                      active={isBorderBeamActive}
                      theme="dark"
                      borderRadius={9999}
                      duration={2.0}
                      className="w-full rounded-full shadow-2xl"
                    >
                      <div className="relative w-full rounded-full bg-[#070B12]/95 border border-white/20 px-3.5 py-1.5 sm:py-2 text-white flex items-center justify-center min-h-[38px] overflow-hidden shadow-2xl">
                        {/* Voice Glow Liquid Waveform Simulation (Active during speaking) */}
                        {isSpeaking && (
                          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full z-10 opacity-70">
                            <div
                              className="absolute -bottom-2 inset-x-0 h-5"
                              style={{
                                background:
                                  'radial-gradient(ellipse at 50% 100%, rgba(0, 240, 255, 0.5) 0%, rgba(34, 199, 242, 0.25) 45%, transparent 75%)',
                                filter: 'blur(3px)',
                              }}
                            />
                            {/* Animated Fluctuating Wave Band */}
                            <div
                              className="absolute -bottom-1 inset-x-2 h-3.5 bg-gradient-to-r from-transparent via-[#22C7F2]/40 to-transparent animate-pulse"
                              style={{
                                filter: 'blur(2px)',
                                animationDuration: '1.2s',
                              }}
                            />
                          </div>
                        )}

                        {isListeningInitial && (
                          <div className="relative z-20 flex items-center justify-center gap-1.5 text-xs font-mono font-medium text-white/90 select-none">
                            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_6px_#00F0FF]" />
                            <span>Listening...</span>
                          </div>
                        )}

                        {!isListeningInitial && !isBorderBeamActive && (
                          <div className="relative z-20 w-full text-center leading-snug">
                            <span className="font-mono text-[11px] sm:text-[11.5px] font-semibold">
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
                                        ? 'text-[#00F0FF] font-bold scale-[1.06] drop-shadow-[0_0_8px_rgba(0,240,255,0.85)] -translate-y-[0.5px]'
                                        : isSpoken
                                        ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] opacity-100'
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

                        {isBorderBeamActive && (
                          <div className="relative z-20 flex items-center justify-center gap-1.5 text-xs font-mono font-semibold text-[#38BDF8]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
                            <span>Submitting to solver…</span>
                          </div>
                        )}
                      </div>
                    </AppBorderBeam>
                  </motion.div>
                </div>
              </motion.div>

              {/* Taskbar */}
              <div className="absolute bottom-0 inset-x-0 h-9 bg-[#0F172A]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-between px-3 select-none z-40">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStageClick('pill_input')}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  >
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-1 h-1 bg-[#00F0FF] rounded-xs" />
                      <div className="w-1 h-1 bg-[#178BFF] rounded-xs" />
                      <div className="w-1 h-1 bg-[#38BDF8] rounded-xs" />
                      <div className="w-1 h-1 bg-[#0284C7] rounded-xs" />
                    </div>
                  </button>

                  <span className="text-[10px] font-mono text-[#94A3B8]">Ezer Agent · Ready</span>
                </div>

                <div className="flex items-center gap-2 text-[9.5px] font-mono text-[#94A3B8]">
                  <Wifi className="w-3 h-3" />
                  <span>11:42 AM</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ACT 2: SOLVING ORB */}
          {currentStage === 'solving_orb' && (
            <motion.div
              key="stage-solving-orb"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full relative flex flex-col items-center justify-center py-4 space-y-4"
            >
              <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md bg-white/80 border border-[#CBD5E1] text-[9.5px] font-mono text-[#0864C7] flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF] animate-pulse" />
                <span>ACT II // CONSTRAINT SOLVER</span>
              </div>

              {/* Sphere */}
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute -inset-3 border border-[#178BFF]/30 border-dashed rounded-full pointer-events-none animate-spin"
                  style={{ animationDuration: '14s' }}
                />
                <motion.div
                  initial={{ width: 260, height: 38, borderRadius: 19 }}
                  animate={{ width: 88, height: 88, borderRadius: 44 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative bg-black border border-[#178BFF]/50 shadow-xl flex items-center justify-center overflow-hidden"
                >
                  <AppThinkingOrb state="solving" size={64} scale={1.3} dots={2.5} theme="dark" />
                </motion.div>
              </div>

              <div className="text-center space-y-2 max-w-sm w-full">
                <div className="text-xs font-mono font-bold text-[#0864C7] tracking-wider uppercase">
                  SOLVING CAD CONSTRAINTS
                </div>

                <div className="space-y-1.5 text-left text-[11px] font-mono bg-white/85 p-3 rounded-xl border border-black/5 shadow-xs">
                  <div className={`flex items-center justify-between ${solveStep1 ? 'text-[#059669]' : 'text-[#94A3B8]'}`}>
                    <div className="flex items-center gap-2">
                      {solveStep1 ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-current shrink-0" />}
                      <span>Base: 2″ × 2″ centered square</span>
                    </div>
                    <span className="text-[9.5px] opacity-70">{solveStep1 ? 'Solved' : '...'}</span>
                  </div>

                  <div className={`flex items-center justify-between ${solveStep2 ? 'text-[#059669]' : 'text-[#94A3B8]'}`}>
                    <div className="flex items-center gap-2">
                      {solveStep2 ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-current shrink-0" />}
                      <span>Extrude Boss: 2.000″ depth</span>
                    </div>
                    <span className="text-[9.5px] opacity-70">{solveStep2 ? 'Solved' : '...'}</span>
                  </div>

                  <div className={`flex items-center justify-between ${solveStep3 ? 'text-[#059669]' : 'text-[#94A3B8]'}`}>
                    <div className="flex items-center gap-2">
                      {solveStep3 ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-current shrink-0" />}
                      <span>Cut-Extrude: Ø 1.000″ through-hole</span>
                    </div>
                    <span className="text-[9.5px] opacity-70">{solveStep3 ? 'Solved' : '...'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ACT 3 & 4: 3D CAD MODEL VIEWPORT WITH LIVE FILLET & ENDLESS CLIMAX */}
          {(currentStage === 'initial_cad' || currentStage === 'fillet_edit') && (
            <motion.div
              key="stage-cad-interactive-viewport"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col space-y-2"
            >
              <div
                className="relative w-full rounded-xl overflow-hidden border border-[#CBD5E1] shadow-inner bg-[#EEF2F6]"
                onPointerDown={() => handleModelInteraction(true)}
                onPointerUp={() => handleModelInteraction(false)}
                onClick={() => handleModelInteraction(false)}
              >
                {/* HUD Badges */}
                <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none px-2.5 py-0.5 rounded-md bg-white/85 backdrop-blur-md border border-[#CBD5E1] text-[9.5px] font-mono text-[#0864C7] shadow-2xs">
                  <span>{currentStage === 'initial_cad' ? 'ACT III // 3D SOLID' : 'ACT IV // MODIFICATION'}</span>
                </div>

                <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none flex flex-col gap-0.5 text-[9.5px] font-mono text-[#64748B] bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#CBD5E1] shadow-2xs">
                  <span className="text-[#0864C7] font-bold">
                    {currentStage === 'initial_cad'
                      ? 'PARAMETRIC SOLID'
                      : isIterationDone
                      ? 'FILLETS COMPLETE'
                      : 'APPLYING FILLETS'}
                  </span>
                  <span>
                    {currentStage === 'initial_cad'
                      ? 'CUBE: 2.000″ × 2.000″ // HOLE: Ø 1.000″'
                      : `FILLET: R 0.200″ (${Math.round(liveFilletProgress * 100)}%)`}
                  </span>
                </div>

                {/* Camera Swoosh Wrapper */}
                <motion.div
                  className="w-full h-full"
                  style={{ transformOrigin: '50% 88%' }}
                  animate={{
                    scale: isStage4Zoomed ? 1.85 : 1,
                    y: isStage4Zoomed ? -36 : 0,
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <DynamicEzerCadViewer
                    filletProgress={liveFilletProgress}
                    onUserInteractionChange={handleModelInteraction}
                  />
                </motion.div>

                {/* IN-VIEWPORT COMPACT PILL (WITH MORPHING TO CLIMAX "the possibilities are endless") */}
                {currentStage === 'fillet_edit' && (
                  <motion.div
                    className="absolute bottom-3 inset-x-0 z-30 pointer-events-auto flex flex-col items-center justify-end px-2"
                    style={{ transformOrigin: 'bottom center' }}
                    animate={{
                      scale: isStage4Zoomed ? 1.28 : 1,
                      y: isStage4Zoomed ? -10 : 0,
                    }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.div
                      key="iter-pill-motion-container"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{
                        scaleX: isFinalCollapsed ? 0 : 1,
                        opacity: isFinalCollapsed ? 0 : 1,
                      }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: 'bottom center' }}
                      className={`flex flex-col items-center transition-all duration-300 ${
                        isEndlessClimax
                          ? 'w-[255px] max-w-[85vw]'
                          : isIterationDone
                          ? 'w-auto max-w-[90vw]'
                          : 'w-[225px] sm:w-[245px] max-w-[88vw]'
                      }`}
                    >
                      <AppBorderBeam
                        size="sm"
                        colorVariant="ocean"
                        strength={1.0}
                        active={isIterationBorderBeamActive || isEndlessStreaming}
                        theme="dark"
                        borderRadius={9999}
                        duration={2.0}
                        className="w-full rounded-full shadow-2xl"
                      >
                        <div className="relative w-full rounded-full bg-[#070B12]/95 border border-white/20 px-3.5 py-1.5 text-white flex items-center justify-center min-h-[36px] shadow-2xl overflow-hidden">
                          {/* Voice Glow Liquid Waveform Simulation (Active during iteration speaking) */}
                          {isIterationSpeaking && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full z-10 opacity-70">
                              <div
                                className="absolute -bottom-2 inset-x-0 h-5"
                                style={{
                                  background:
                                    'radial-gradient(ellipse at 50% 100%, rgba(0, 240, 255, 0.45) 0%, rgba(34, 199, 242, 0.25) 45%, transparent 75%)',
                                  filter: 'blur(3px)',
                                }}
                              />
                              <div
                                className="absolute -bottom-1 inset-x-2 h-3.5 bg-gradient-to-r from-transparent via-[#22C7F2]/40 to-transparent animate-pulse"
                                style={{
                                  filter: 'blur(2px)',
                                  animationDuration: '1.2s',
                                }}
                              />
                            </div>
                          )}

                          {/* Climax Voice Resonance (Active during "the possibilities are endless") */}
                          {isEndlessStreaming && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full z-10 opacity-80">
                              <div
                                className="absolute -bottom-2 inset-x-0 h-6"
                                style={{
                                  background:
                                    'radial-gradient(ellipse at 50% 100%, rgba(0, 240, 255, 0.6) 0%, rgba(14, 165, 233, 0.3) 50%, transparent 80%)',
                                  filter: 'blur(4px)',
                                }}
                              />
                            </div>
                          )}

                          {/* 1. Fillet command streaming */}
                          {!isIterationBorderBeamActive && !isIterationDone && (
                            <div className="relative z-20 w-full text-center leading-snug">
                              <span className="font-mono text-[11px] font-semibold">
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
                                          ? 'text-[#00F0FF] font-bold scale-[1.06] drop-shadow-[0_0_8px_rgba(0,240,255,0.85)] -translate-y-[0.5px]'
                                          : isSpoken
                                          ? 'text-white opacity-100'
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

                          {/* 2. Fillet border beam working feedback */}
                          {isIterationBorderBeamActive && !isIterationDone && (
                            <div className="relative z-20 flex items-center justify-center gap-1.5 text-xs font-mono font-semibold text-[#38BDF8]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
                              <span>Applying 0.200″ Fillets…</span>
                            </div>
                          )}

                          {/* 3. Fillet Done pill state */}
                          {isIterationDone && !isEndlessClimax && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative z-20 flex items-center justify-center gap-1.5 text-xs font-mono font-semibold text-[#10B981] whitespace-nowrap"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                              <span>Done · 0.200″ Fillets Applied</span>
                            </motion.div>
                          )}

                          {/* 4. FINAL CLIMAX: "the possibilities are endless" streamed word-by-word */}
                          {isEndlessClimax && !isFinalCollapsed && (
                            <div className="relative z-20 w-full text-center leading-snug">
                              <span className="font-mono text-xs sm:text-[12.5px] font-semibold tracking-wide">
                                {ENDLESS_WORDS.map((word, i) => {
                                  const isSpoken =
                                    elapsedMs >= TIMING.ENDLESS_STREAM_END ||
                                    i <= activeEndlessWordIndex;
                                  const isCurrent =
                                    i === activeEndlessWordIndex &&
                                    elapsedMs < TIMING.ENDLESS_STREAM_END;

                                  return (
                                    <span
                                      key={`endless-${word}-${i}`}
                                      className={`inline-block mr-1.5 transition-all duration-120 ${
                                        isCurrent
                                          ? 'text-[#00F0FF] font-bold scale-[1.10] drop-shadow-[0_0_8px_rgba(0,240,255,0.9)] -translate-y-[0.5px]'
                                          : isSpoken
                                          ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] opacity-100'
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
                        </div>
                      </AppBorderBeam>
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] font-mono text-[#647184]">
                <span className="flex items-center gap-1.5 text-[#059669] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cube (2″ × 2″ × 2″) + Hole (Ø 1.000″) + Fillets (R 0.200″)</span>
                </span>
                <span className="text-[#0864C7]">Touch / click &amp; drag to rotate in 3D</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            ACT 5 / BRAND OUTRO: FADE TO BLACK -> "zer" -> "e" SLAMS IN WITH IMPACT & PARTICLES -> RESTART
           ========================================================================= */}
        <AnimatePresence>
          {isBlackoutActive && (
            <motion.div
              key="ezer-blackout-outro"
              initial={{ opacity: 0 }}
              animate={{ opacity: isOutroFadingOut ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: isOutroFadingOut ? 0.6 : 0.45, ease: 'easeInOut' }}
              className="absolute inset-0 z-50 rounded-xl overflow-hidden bg-[#040711] flex flex-col items-center justify-center pointer-events-none select-none"
            >
              {/* Subtle ambient aerospace radial background light */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.18) 0%, rgba(2, 6, 23, 0.85) 65%, #040711 100%)',
                }}
              />

              {/* Grid texture for technical CAD workstation aesthetic */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.4) 1px, transparent 0)`,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* IMPACT SHOCKWAVE FLASH (Triggers at IMPACT_MOMENT for ~250ms) */}
              {isShockwaveActive && (
                <motion.div
                  initial={{ opacity: 0.85, scale: 0.3 }}
                  animate={{ opacity: 0, scale: 3.4 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute w-52 h-52 rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(0, 240, 255, 0.7) 0%, rgba(14, 165, 233, 0.35) 40%, transparent 75%)',
                    filter: 'blur(10px)',
                  }}
                />
              )}

              {/* EXPANDING SHOCKWAVE RING */}
              {isShockwaveActive && (
                <motion.div
                  initial={{ opacity: 1, scale: 0.2 }}
                  animate={{ opacity: 0, scale: 3.0 }}
                  transition={{ duration: 0.55, ease: [0.1, 0.9, 0.2, 1] }}
                  className="absolute w-44 h-44 rounded-full border-2 border-[#00F0FF] shadow-[0_0_24px_#00F0FF] pointer-events-none"
                />
              )}

              {/* SCATTERING IMPACT SPARK PARTICLES */}
              {isShockwaveActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {[
                    { angle: 25, dist: 75, size: 3.5, delay: 0 },
                    { angle: 65, dist: 90, size: 2.5, delay: 0.02 },
                    { angle: 110, dist: 80, size: 3, delay: 0 },
                    { angle: 155, dist: 100, size: 2, delay: 0.03 },
                    { angle: 200, dist: 85, size: 3, delay: 0.01 },
                    { angle: 245, dist: 95, size: 2.5, delay: 0.02 },
                    { angle: 290, dist: 80, size: 3.5, delay: 0 },
                    { angle: 335, dist: 90, size: 2, delay: 0.02 },
                    { angle: 40, dist: 110, size: 2.5, delay: 0.04 },
                    { angle: 180, dist: 105, size: 2, delay: 0.03 },
                    { angle: 130, dist: 88, size: 2.8, delay: 0.01 },
                    { angle: 315, dist: 95, size: 2.8, delay: 0.02 },
                  ].map((p, idx) => {
                    const rad = (p.angle * Math.PI) / 180;
                    const tx = Math.cos(rad) * p.dist;
                    const ty = Math.sin(rad) * p.dist;

                    return (
                      <motion.div
                        key={`spark-${idx}`}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{ x: tx, y: ty, opacity: 0, scale: 0.2 }}
                        transition={{ duration: 0.5, delay: p.delay, ease: 'easeOut' }}
                        className="absolute rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]"
                        style={{ width: p.size, height: p.size }}
                      />
                    );
                  })}
                </div>
              )}

              {/* MAIN BRAND TEXT LOCKUP */}
              <div className="relative z-20 flex flex-col items-center justify-center">
                {/* Logo Characters Container */}
                <div className="relative flex items-center font-mono font-black tracking-tight leading-none text-5xl sm:text-6xl md:text-7xl">
                  {/* LETTER "e" — ROCKETS IN FROM THE LEFT AND SLAMS INTO "zer" */}
                  {isEIncoming && (
                    <motion.span
                      initial={{
                        x: -160,
                        opacity: 0,
                        scale: 1.6,
                        rotate: -12,
                        filter: 'blur(8px)',
                      }}
                      animate={{
                        x: hasImpactOccurred ? [0, 4, -2, 0] : 0,
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        filter: 'blur(0px)',
                      }}
                      transition={{
                        x: hasImpactOccurred
                          ? { duration: 0.22, ease: 'easeOut' }
                          : { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.15 },
                        scale: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                        rotate: { duration: 0.28 },
                        filter: { duration: 0.2 },
                      }}
                      className={`inline-block transition-all duration-300 ${
                        hasImpactOccurred
                          ? 'text-[#00F0FF] drop-shadow-[0_0_28px_rgba(0,240,255,0.95)]'
                          : 'text-white'
                      }`}
                    >
                      e
                    </motion.span>
                  )}

                  {/* LETTERS "zer" — APPEAR FIRST, THEN JOLT/RECOIL ON IMPACT */}
                  {isZerVisible && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.92, y: 6 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        x: hasImpactOccurred ? [0, 18, -4, 2, 0] : 0,
                      }}
                      transition={{
                        opacity: { duration: 0.35, ease: 'easeOut' },
                        scale: { duration: 0.35, ease: 'easeOut' },
                        x: hasImpactOccurred
                          ? { duration: 0.42, times: [0, 0.2, 0.5, 0.8, 1], ease: 'easeOut' }
                          : { duration: 0 },
                      }}
                      className={`inline-block transition-all duration-300 ${
                        hasImpactOccurred
                          ? 'text-white drop-shadow-[0_0_28px_rgba(0,240,255,0.7)]'
                          : 'text-white/90'
                      }`}
                    >
                      zer
                    </motion.span>
                  )}
                </div>

                {/* LUMINOUS UNDER-GLOW ACCENT LINE (Sweeps across logo after impact) */}
                {hasImpactOccurred && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 140, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-[2px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent mt-2 shadow-[0_0_12px_#00F0FF]"
                  />
                )}

                {/* SECONDARY BADGE: "ENGINEERING CAD AUTOMATION" */}
                {hasImpactOccurred && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
                    className="mt-3.5 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-mono text-[#38BDF8] tracking-widest uppercase shadow-lg"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
                    <span>ENGINEERING CAD AUTOMATION</span>
                  </motion.div>
                )}
              </div>

              {/* Bottom loop status tag */}
              <div className="absolute bottom-3 text-[9.5px] font-mono text-white/30 tracking-wider">
                EZER WORKSTATION RESTARTING…
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timeline Controls & Verified Stack */}
      <div className="mt-3 pt-2.5 border-t border-black/5 flex flex-col gap-2">
        <div className="relative w-full bg-slate-100/80 rounded-xl p-1 border border-slate-200 shadow-inner flex flex-col gap-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 w-full" role="tablist">
            {STAGES.map((stg) => {
              const isActive = currentStage === stg.id;
              const Icon = stg.icon;

              return (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => handleStageClick(stg.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] ${
                    isActive
                      ? 'bg-white text-[#0864C7] font-semibold shadow-xs border border-[#178BFF]/25'
                      : 'text-[#647184] hover:text-[#17202A] hover:bg-white/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#178BFF]' : 'text-[#94A3B8]'}`} />
                  <span className="truncate">{stg.shortLabel}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full h-1 bg-slate-200/80 rounded-full overflow-hidden mx-auto">
            <motion.div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#0284C7] via-[#178BFF] to-[#38BDF8] rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, cycleProgress))}%` }}
              transition={{ ease: 'linear', duration: 0.05 }}
            />
          </div>
        </div>

        {/* Verified Tech Stack Only (Section 32) */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono text-[#647184]">
          <span>Verified Technologies: Tauri · Rust · SolidJS · SQLite · PowerShell</span>
          <span className="text-[#0864C7] font-semibold">Endless Concept Loop</span>
        </div>
      </div>
    </div>
  );
}

export default EzerVisual;
