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
  Wifi,
  Monitor,
} from 'lucide-react';
import { AppBorderBeam, AppThinkingOrb } from '@/components/ui/LibrariesDevWrapper';
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
  // STAGE 1: VOICE COMMAND & INTENT (0 - 8000ms)
  // At start (0 to 1.5s): clean workstation, NO pill present!
  DESKTOP_START: 0,
  PILL_APPEAR_START: 1500,     // At 1.5s, pill enters/expands onto desktop (never there at start!)
  PILL_ZOOM_IN_START: 1900,    // Camera zooms in more when pill is being used
  SPEAKING_START: 2200,        // Natural voice typing streaming begins
  SPEAKING_END: 5400,          // Voice typing completes
  PILL_ZOOM_OUT_START: 5500,   // Camera zooms out to show what is happening (submitting to solver)
  BORDER_BEAM_START: 5600,     // Border beam active
  BORDER_BEAM_END: 7800,
  STAGE_1_END: 8000,

  // STAGE 2: CONSTRAINT SOLVING (8000 - 11600ms)
  SOLVING_START: 8000,
  STAGE_2_END: 11600,

  // STAGE 3: 3D CAD MODEL (11600 - 15000ms)
  CAD_STAGE_START: 11600,
  STAGE_3_END: 15000,

  // STAGE 4: LIVE FILLET MODIFICATION & CLIMAX (15000 - 30600ms)
  ITERATION_PILL_APPEAR: 15000,
  ITERATION_ZOOM_IN_START: 15300, // Zooms in more when pill is being used for modification
  ITERATION_SPEAKING_START: 15600,
  ITERATION_SPEAKING_END: 18600,
  ITERATION_ZOOM_OUT_START: 18800,// Zooms out so user can clearly see every change on the 3D model!
  ITERATION_BORDER_BEAM_START: 18800,
  ITERATION_BORDER_BEAM_END: 21200,
  FILLET_START: 18800,
  FILLET_END: 21200,
  ITERATION_DONE_START: 21200,    // Fillets complete; user sees all changes on 3D geometry

  // FINAL CLIMAX: ZOOM BACK IN & STREAM "the possibilities are endless"
  FINAL_ZOOM_IN_START: 22200,     // Zooms back in after user sees every change!
  ENDLESS_STREAM_START: 22500,
  ENDLESS_STREAM_END: 24300,

  // CAMERA DIVE: DOES NOT ZOOM OUT, ZOOMS MORE IN UNTIL FULLY BLACK
  DIVE_INTO_PILL_START: 24600,

  // OUTRO: PURE BLACK SCREEN -> SWITCH JOY-CON ANIMATION WITH TILTED "E"
  BLACKOUT_START: 25200,
  ZER_APPEAR_START: 25500,        // "ZER" appears in pure white
  E_SLIDE_START: 25900,           // "E" appears tilted counterclockwise (-22deg) and slides in
  SNAP_MOMENT: 26280,             // "E" aligns to 0deg: Joy-Con snap & recoil!
  SNAP_FLASH_END: 26550,          // Specular flash & subtle ripple fade
  OUTRO_FADE_TO_RESTART: 29800,   // Pure white "EZER" holds with ZERO descriptions, then clean fade
  TOTAL_CYCLE: 30600,
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
    timeLabel: '0:08',
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
    startMs: TIMING.ITERATION_PILL_APPEAR,
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
  // Pill is NOT there at the beginning (0 to 1.5s)! Appears only at PILL_APPEAR_START!
  const isPillVisible = elapsedMs >= TIMING.PILL_APPEAR_START;
  const isStage1Zoomed =
    elapsedMs >= TIMING.PILL_ZOOM_IN_START && elapsedMs < TIMING.PILL_ZOOM_OUT_START;
  const isSpeaking = elapsedMs >= TIMING.SPEAKING_START && elapsedMs < TIMING.SPEAKING_END;
  const isListeningInitial =
    elapsedMs >= TIMING.PILL_APPEAR_START && elapsedMs < TIMING.SPEAKING_START;

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
  // Zooms in more when pill is being used, then zooms out so user can see every change!
  const isStage4PillZoomed =
    elapsedMs >= TIMING.ITERATION_ZOOM_IN_START && elapsedMs < TIMING.ITERATION_ZOOM_OUT_START;
  
  // After seeing every change, zooms back in for "the possibilities are endless", then zooms MORE in into black!
  const isClimaxZoomed =
    elapsedMs >= TIMING.FINAL_ZOOM_IN_START && elapsedMs < TIMING.DIVE_INTO_PILL_START;

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
  const isEndlessClimax = elapsedMs >= TIMING.FINAL_ZOOM_IN_START;
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

  // CAMERA DIVE: Does NOT zoom out, stays plunged in until cycle restarts
  const isDivingIntoPill = elapsedMs >= TIMING.DIVE_INTO_PILL_START;

  // OUTRO: Switch Joy-Con animation states with counterclockwise tilt
  const isBlackoutActive = elapsedMs >= TIMING.BLACKOUT_START;
  const isZerVisible = elapsedMs >= TIMING.ZER_APPEAR_START;
  const isESliding = elapsedMs >= TIMING.E_SLIDE_START;
  const hasSnapOccurred = elapsedMs >= TIMING.SNAP_MOMENT;
  const isSnapFlashActive =
    elapsedMs >= TIMING.SNAP_MOMENT && elapsedMs < TIMING.SNAP_FLASH_END;

  const cycleProgress = (elapsedMs / TIMING.TOTAL_CYCLE) * 100;

  if (prefersReduced) {
    return (
      <div ref={containerRef} className="w-full glass-panel rounded-2xl p-6 sm:p-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#178BFF]/10 text-[#0864C7] font-semibold">
              DEMO · EZER IN DEVELOPMENT
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
              DEMO · EZER IN DEVELOPMENT
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
              {/* Dynamic Camera: Zooms in more when pill is used, then zooms out to show what is happening! */}
              <motion.div
                className="w-full h-full absolute inset-0 flex flex-col justify-between pointer-events-none"
                style={{ transformOrigin: '50% 86%' }}
                animate={{
                  scale: isStage1Zoomed ? 1.38 : 1,
                  y: isStage1Zoomed ? -28 : 0,
                }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
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
                <div className="absolute top-3 inset-x-3 sm:inset-x-4 flex items-center justify-between gap-2 text-[10px] font-mono select-none z-20">
                  <div className="text-[#64748B] flex items-center gap-1.5 min-w-0 truncate">
                    <Monitor className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                    <span className="text-white/80 font-medium truncate">
                      <span className="hidden sm:inline">Workstation Environment</span>
                      <span className="inline sm:hidden">Workstation</span>
                    </span>
                  </div>

                  <div className="px-2 sm:px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[9px] sm:text-[9.5px] font-mono text-[#38BDF8] flex items-center gap-1.5 shadow-xs shrink-0 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse shrink-0" />
                    <span className="hidden sm:inline">ACT I // VOICE COMMAND INTENT</span>
                    <span className="inline sm:hidden">ACT I // VOICE INTENT</span>
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

                {/* EZER PILL: NOT present at the beginning (0 to 1.5s)! Appears and expands only when summoned! */}
                <div className="absolute bottom-[46px] inset-x-0 z-30 pointer-events-auto flex flex-col items-center justify-center px-3">
                  <AnimatePresence>
                    {isPillVisible && (
                      <motion.div
                        key="act1-ezer-pill"
                        initial={{ opacity: 0, scale: 0.82, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.82 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="relative flex flex-col items-center w-[340px] max-w-[92vw]"
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
                          <div className="relative w-full rounded-full bg-[#070B12]/95 border border-white/20 px-3.5 py-2 sm:py-2.5 text-white flex items-center justify-center min-h-[42px] overflow-hidden shadow-2xl">
                            {/* Live Audio Waveform Glow during speaking */}
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
                                <div
                                  className="absolute -bottom-1 inset-x-2 h-3.5 bg-gradient-to-r from-transparent via-[#22C7F2]/40 to-transparent animate-pulse"
                                  style={{
                                    filter: 'blur(2px)',
                                    animationDuration: '1.2s',
                                  }}
                                />
                              </div>
                            )}

                            {/* Listening Prompt */}
                            {isListeningInitial && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative z-20 flex items-center justify-center gap-2 text-xs font-mono font-medium text-white/90 select-none whitespace-nowrap"
                              >
                                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_6px_#00F0FF]" />
                                <span className="tracking-wide">Listening...</span>
                              </motion.div>
                            )}

                            {/* Word-by-word streaming text */}
                            {!isListeningInitial && !isBorderBeamActive && (
                              <div className="relative z-20 w-full text-center leading-snug px-1">
                                <span className="font-mono text-[10.5px] sm:text-[11.5px] font-semibold leading-relaxed break-words">
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

                            {/* Border beam submission indicator */}
                            {isBorderBeamActive && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative z-20 flex items-center justify-center gap-2 text-xs font-mono font-semibold text-[#38BDF8]"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
                                <span>Submitting to solver…</span>
                              </motion.div>
                            )}
                          </div>
                        </AppBorderBeam>
                      </motion.div>
                    )}
                  </AnimatePresence>
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

                  <span className="text-[10px] font-mono text-[#94A3B8]">
                    {isSpeaking
                      ? 'EZER Agent · Listening'
                      : isPillVisible
                      ? 'EZER Agent · Active'
                      : 'EZER Agent · Standby'}
                  </span>
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
              <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md bg-white/80 border border-[#CBD5E1] text-[9.5px] font-mono text-[#0864C7] flex items-center gap-1.5 shadow-2xs shrink-0 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF] animate-pulse shrink-0" />
                <span className="truncate">ACT II // CONSTRAINT SOLVER</span>
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

              <div className="text-center space-y-2 max-w-sm w-full px-2">
                <div className="text-xs font-mono font-bold text-[#0864C7] tracking-wider uppercase truncate">
                  SOLVING CAD CONSTRAINTS
                </div>

                <div className="space-y-1.5 text-left text-[10.5px] sm:text-[11px] font-mono bg-white/85 p-3 rounded-xl border border-black/5 shadow-xs">
                  <div className={`flex items-center justify-between gap-2 ${solveStep1 ? 'text-[#059669]' : 'text-[#94A3B8]'}`}>
                    <div className="flex items-center gap-2 min-w-0 truncate">
                      {solveStep1 ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-current shrink-0" />}
                      <span className="truncate">Base: 2″ × 2″ centered square</span>
                    </div>
                    <span className="text-[9.5px] opacity-70 shrink-0">{solveStep1 ? 'Solved' : '...'}</span>
                  </div>

                  <div className={`flex items-center justify-between gap-2 ${solveStep2 ? 'text-[#059669]' : 'text-[#94A3B8]'}`}>
                    <div className="flex items-center gap-2 min-w-0 truncate">
                      {solveStep2 ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-current shrink-0" />}
                      <span className="truncate">Extrude Boss: 2.000″ depth</span>
                    </div>
                    <span className="text-[9.5px] opacity-70 shrink-0">{solveStep2 ? 'Solved' : '...'}</span>
                  </div>

                  <div className={`flex items-center justify-between gap-2 ${solveStep3 ? 'text-[#059669]' : 'text-[#94A3B8]'}`}>
                    <div className="flex items-center gap-2 min-w-0 truncate">
                      {solveStep3 ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-current shrink-0" />}
                      <span className="truncate">Cut-Extrude: Ø 1.000″ through-hole</span>
                    </div>
                    <span className="text-[9.5px] opacity-70 shrink-0">{solveStep3 ? 'Solved' : '...'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ACT 3 & 4: 3D CAD MODEL VIEWPORT WITH DYNAMIC ZOOM IN/OUT CYCLE & DIVE INTO BLACK */}
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
                {/* HUD Header Bar: Flex row guarantees zero badge overlap */}
                <div
                  className={`absolute top-2.5 inset-x-2.5 z-20 pointer-events-none flex items-start justify-between gap-2 text-[9.5px] font-mono select-none transition-opacity duration-300 ${
                    isDivingIntoPill ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  {/* Left Status Badge */}
                  <div className="flex flex-col gap-0.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#CBD5E1] shadow-2xs max-w-[64%] min-w-0">
                    <span className="text-[#0864C7] font-bold truncate">
                      {currentStage === 'initial_cad'
                        ? 'PARAMETRIC SOLID'
                        : isIterationDone
                        ? 'FILLETS COMPLETE'
                        : 'APPLYING FILLETS'}
                    </span>
                    <span className="text-[#64748B] truncate text-[9px] sm:text-[9.5px]">
                      {currentStage === 'initial_cad'
                        ? 'CUBE: 2″ × 2″ // HOLE: Ø 1″'
                        : `FILLET: R 0.200″ (${Math.round(liveFilletProgress * 100)}%)`}
                    </span>
                  </div>

                  {/* Right Stage Badge */}
                  <div className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md border border-[#CBD5E1] text-[9px] sm:text-[9.5px] font-mono text-[#0864C7] shadow-2xs shrink-0 whitespace-nowrap">
                    <span>{currentStage === 'initial_cad' ? 'ACT III // 3D SOLID' : 'ACT IV // MODIFICATION'}</span>
                  </div>
                </div>

                {/* 3D CAD Viewport with precise camera zoom choreography:
                    1. Zooms in when pill is used for speech
                    2. Zooms OUT so user can see every change happening on the 3D model!
                    3. After seeing changes, zooms back in for climax text
                    4. Does NOT zoom out again, but plunges more in until fully black! */}
                <motion.div
                  className="w-full h-full"
                  style={{ transformOrigin: '50% 86%' }}
                  animate={{
                    scale: isDivingIntoPill
                      ? 3.6
                      : isClimaxZoomed
                      ? 1.55
                      : isStage4PillZoomed
                      ? 1.35
                      : 1,
                    y: isDivingIntoPill
                      ? -80
                      : isClimaxZoomed
                      ? -35
                      : isStage4PillZoomed
                      ? -24
                      : 0,
                    opacity: isDivingIntoPill ? 0.2 : 1,
                    filter: isDivingIntoPill ? 'blur(10px)' : 'blur(0px)',
                  }}
                  transition={{
                    duration: isDivingIntoPill ? 0.65 : 0.55,
                    ease: isDivingIntoPill ? [0.45, 0, 0.2, 1] : [0.16, 1, 0.3, 1],
                  }}
                >
                  <DynamicEzerCadViewer
                    filletProgress={liveFilletProgress}
                    onUserInteractionChange={handleModelInteraction}
                  />
                </motion.div>

                {/* IN-VIEWPORT PILL: Zooms in with camera, dives straight into dark pill */}
                {currentStage === 'fillet_edit' && (
                  <motion.div
                    className="absolute bottom-3 inset-x-0 z-30 pointer-events-auto flex flex-col items-center justify-end px-2"
                    style={{ transformOrigin: 'center center' }}
                    animate={{
                      scale: isDivingIntoPill ? 38 : isClimaxZoomed ? 1.25 : isStage4PillZoomed ? 1.15 : 1,
                      y: isDivingIntoPill ? -115 : isClimaxZoomed ? -12 : 0,
                    }}
                    transition={{
                      duration: isDivingIntoPill ? 0.65 : 0.55,
                      ease: isDivingIntoPill ? [0.45, 0, 0.2, 1] : [0.16, 1, 0.3, 1],
                    }}
                  >
                    <motion.div
                      key="iter-pill-motion-container"
                      className={`flex flex-col items-center transition-all duration-300 ${
                        isEndlessClimax
                          ? 'w-[250px] sm:w-[275px] max-w-[88vw]'
                          : isIterationDone
                          ? 'w-auto max-w-[90vw]'
                          : 'w-[235px] sm:w-[265px] max-w-[88vw]'
                      }`}
                    >
                      <AppBorderBeam
                        size="sm"
                        colorVariant="ocean"
                        strength={1.0}
                        active={isIterationBorderBeamActive || isEndlessStreaming || isDivingIntoPill}
                        theme="dark"
                        borderRadius={9999}
                        duration={2.0}
                        className="w-full rounded-full shadow-2xl"
                      >
                        <div className="relative w-full rounded-full bg-[#070B12] border border-white/20 px-3.5 sm:px-4 py-2 text-white flex items-center justify-center min-h-[38px] shadow-2xl overflow-hidden">
                          {/* Live Waveform during speaking */}
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

                          {/* Climax Voice Resonance during "the possibilities are endless" */}
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
                            <div className="relative z-20 w-full text-center leading-snug px-1">
                              <span className="font-mono text-[10.5px] sm:text-[11px] font-semibold leading-relaxed break-words">
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
                            <div className="relative z-20 flex items-center justify-center gap-1.5 text-xs font-mono font-semibold text-[#38BDF8] px-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping shrink-0" />
                              <span className="truncate">Applying 0.200″ Fillets…</span>
                            </div>
                          )}

                          {/* 3. Fillet Done pill state */}
                          {isIterationDone && !isEndlessClimax && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative z-20 flex items-center justify-center gap-1.5 text-xs font-mono font-semibold text-[#10B981] whitespace-nowrap px-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                              <span className="truncate">Done · 0.200″ Fillets Applied</span>
                            </motion.div>
                          )}

                          {/* 4. FINAL CLIMAX: "the possibilities are endless" streamed word-by-word */}
                          {isEndlessClimax && (
                            <motion.div
                              animate={{
                                opacity: isDivingIntoPill ? 0 : 1,
                                scale: isDivingIntoPill ? 2.5 : 1,
                              }}
                              transition={{ duration: 0.35, ease: 'easeIn' }}
                              className="relative z-20 w-full text-center leading-snug px-1"
                            >
                              <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-normal sm:tracking-wide break-words">
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
                            </motion.div>
                          )}
                        </div>
                      </AppBorderBeam>
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Status Bar */}
              <div
                className={`flex items-center justify-between gap-2 px-1 text-[10.5px] sm:text-[11px] font-mono text-[#647184] min-w-0 transition-opacity duration-300 ${
                  isDivingIntoPill ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <span className="flex items-center gap-1.5 text-[#059669] font-semibold truncate min-w-0">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Cube (2″×2″×2″) + Hole (Ø 1″) + Fillets</span>
                </span>
                <span className="text-[#0864C7] shrink-0 text-[10px] hidden sm:inline">
                  Drag to rotate in 3D
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            ACT 5 / BRAND OUTRO: PURE BLACK SCREEN -> NINTENDO SWITCH JOY-CON SNAP "EZER"
            - Pure pitch-black screen
            - All White, All Caps: "EZER"
            - Nintendo Switch Joy-Con lock animation:
              1. "ZER" is centered in pure bold white
              2. "E" starts tilted counterclockwise (-22deg), slides down the rail and rotates into 0deg alignment
              3. SNAP! Mechanical Joy-Con recoil (dip down 8px & spring back up)
              4. Crisp specular white flash + expanding subtle shockwave ring + baseline glint
              5. Sits in pure, proud stillness with ZERO descriptions or badges
           ========================================================================= */}
        <AnimatePresence>
          {isBlackoutActive && (
            <motion.div
              key="ezer-blackout-outro"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 rounded-xl overflow-hidden bg-[#000000] flex flex-col items-center justify-center pointer-events-none select-none"
            >
              {/* BRAND LOCKUP: ALL WHITE, ALL CAPS, NINTENDO SWITCH JOY-CON SNAP */}
              <div className="relative flex items-center justify-center">
                {/* Mechanical Recoil Wrapper: Shifts down 8px on snap and springs back */}
                <motion.div
                  animate={
                    hasSnapOccurred
                      ? {
                          y: [0, 8, -2.5, 0],
                        }
                      : { y: 0 }
                  }
                  transition={{
                    duration: 0.24,
                    times: [0, 0.35, 0.7, 1],
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative flex items-baseline tracking-normal font-mono font-black text-6xl sm:text-7xl md:text-8xl select-none leading-none"
                >
                  {/* LETTER "E": Starts tilted counterclockwise (-22deg) above, slides down the rail and rotates into 0deg alignment */}
                  <div className="relative overflow-visible">
                    {isESliding ? (
                      <motion.span
                        initial={{
                          y: -110,
                          x: -28,
                          rotate: -22,
                          scale: 1.25,
                          opacity: 0,
                        }}
                        animate={{
                          y: 0,
                          x: 0,
                          rotate: 0,
                          scale: 1,
                          opacity: 1,
                        }}
                        transition={{
                          duration: 0.38,
                          ease: [0.2, 0.9, 0.3, 1],
                        }}
                        className="inline-block text-white"
                        style={{ transformOrigin: 'bottom right' }}
                      >
                        E
                      </motion.span>
                    ) : (
                      <span className="inline-block opacity-0">E</span>
                    )}
                  </div>

                  {/* LETTERS "ZER": Waiting in place in pure bold white */}
                  {isZerVisible ? (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="inline-block text-white"
                    >
                      ZER
                    </motion.span>
                  ) : (
                    <span className="inline-block opacity-0">ZER</span>
                  )}

                  {/* THE "CLICK" FLASH: A crisp white specular ping at the contact joint */}
                  {isSnapFlashActive && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0.3 }}
                      animate={{ opacity: [0, 1, 0], scaleY: [0.3, 1.5, 0.7] }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute left-[0.74em] top-0 bottom-0 w-[3px] bg-white pointer-events-none shadow-[0_0_20px_#FFFFFF]"
                    />
                  )}

                  {/* SUBTLE CONTACT SHOCKWAVE RING */}
                  {isSnapFlashActive && (
                    <motion.div
                      initial={{ opacity: 0.9, scale: 0.2 }}
                      animate={{ opacity: 0, scale: 2.6 }}
                      transition={{ duration: 0.38, ease: 'easeOut' }}
                      className="absolute left-[0.74em] top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-white pointer-events-none shadow-[0_0_16px_#FFFFFF]"
                    />
                  )}

                  {/* SUBTLE HORIZONTAL UNDER-RAIL ALIGNMENT GLINT */}
                  {hasSnapOccurred && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: '100%', opacity: [0, 0.85, 0] }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="absolute -bottom-2.5 inset-x-0 h-[2px] bg-white pointer-events-none shadow-[0_0_12px_#FFFFFF]"
                    />
                  )}
                </motion.div>
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
