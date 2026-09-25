'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor, Cpu, Gamepad2, Mic, Box, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useReducedMotion } from '@/components/motion/Reveal';

type SystemId = 'launcher' | 'dualsense' | 'ezer' | 'unirate';

interface SystemItem {
  id: SystemId;
  label: string;
  category: string;
  tagline: string;
}

const SYSTEMS: SystemItem[] = [
  {
    id: 'launcher',
    label: 'Launcher',
    category: 'Mechanical Design',
    tagline: '~100 ft spec target → ~300 ft achieved (3× target)',
  },
  {
    id: 'dualsense',
    label: 'DualSense',
    category: 'Embedded Hardware',
    tagline: 'Pico 2 W hardware bridge: PC ↔ Controller',
  },
  {
    id: 'ezer',
    label: 'Ezer',
    category: 'Engineering Automation',
    tagline: 'Voice intent → constraint solving → 3D geometry',
  },
  {
    id: 'unirate',
    label: 'UniRate',
    category: 'Software / Extension',
    tagline: 'In-portal professor ratings & review popover',
  },
];

export function SelectedSystemsReel() {
  const [activeId, setActiveId] = useState<SystemId>('launcher');
  const [userInteracted, setUserInteracted] = useState(false);
  const prefersReduced = useReducedMotion();
  const autoCycleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop auto-cycling permanently once user interacts
  const handleUserInteraction = useCallback(() => {
    if (!userInteracted) {
      setUserInteracted(true);
      if (autoCycleTimerRef.current) {
        clearInterval(autoCycleTimerRef.current);
        autoCycleTimerRef.current = null;
      }
    }
  }, [userInteracted]);

  // Auto-cycle through systems every 4.5 seconds on desktop/tablet unless user interacted
  useEffect(() => {
    if (prefersReduced || userInteracted) return;

    autoCycleTimerRef.current = setInterval(() => {
      setActiveId((prev) => {
        const idx = SYSTEMS.findIndex((s) => s.id === prev);
        const nextIdx = (idx + 1) % SYSTEMS.length;
        return SYSTEMS[nextIdx].id;
      });
    }, 4500);

    return () => {
      if (autoCycleTimerRef.current) {
        clearInterval(autoCycleTimerRef.current);
      }
    };
  }, [prefersReduced, userInteracted]);

  const activeSystem = SYSTEMS.find((s) => s.id === activeId) || SYSTEMS[0];

  return (
    <div
      onMouseEnter={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      onFocusCapture={handleUserInteraction}
      className="w-full glass-panel rounded-2xl p-4 sm:p-5 overflow-hidden flex flex-col justify-between border border-[#CBD5E1]/80 shadow-[0_12px_32px_-8px_rgba(25,45,65,0.08)] bg-white/80"
    >
      {/* Header & Segmented Pill Navigation */}
      <div className="space-y-3 pb-3 border-b border-black/5">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#0864C7] font-bold uppercase tracking-wider text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#178BFF] animate-pulse" />
            <span>SELECTED SYSTEMS REEL</span>
          </div>
          <span className="text-[10px] text-[#647184] hidden sm:inline">
            {userInteracted ? 'Manual Control' : 'Auto-cycling (4.5s)'}
          </span>
        </div>

        {/* Tab Pills with shared layoutId */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#EEF2F6]/80 rounded-xl border border-[#CBD5E1]/60">
          {SYSTEMS.map((sys) => {
            const isSelected = activeId === sys.id;

            return (
              <button
                key={sys.id}
                type="button"
                onClick={() => {
                  handleUserInteraction();
                  setActiveId(sys.id);
                }}
                className={`relative py-1.5 px-2 rounded-lg text-xs font-mono transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] ${
                  isSelected
                    ? 'text-[#0864C7] font-bold'
                    : 'text-[#647184] hover:text-[#17202A] hover:bg-white/50'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="heroReelTab"
                    className="absolute inset-0 bg-white rounded-lg shadow-xs border border-[#178BFF]/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 block truncate text-[11px] sm:text-xs">
                  {sys.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Interactive Preview Canvas */}
      <div className="relative w-full h-[220px] sm:h-[240px] my-3 rounded-xl bg-gradient-to-b from-[#F8FAFC] to-[#EEF2F6] border border-[#CBD5E1]/70 overflow-hidden flex items-center justify-center p-3">
        <div className="absolute inset-0 bg-tech-grid-fine opacity-60 pointer-events-none" />

        <AnimatePresence mode="wait">
          {/* 1. LAUNCHER PREVIEW */}
          {activeId === 'launcher' && (
            <motion.div
              key="preview-launcher"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full flex flex-col justify-between relative z-10"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#647184]">
                <span className="text-[#0864C7] font-semibold">SCHEMATIC: NOT TO SCALE</span>
                <span className="text-emerald-700 font-bold">1st Place Class Winner</span>
              </div>

              {/* Trajectory Drawing */}
              <div className="relative flex-1 flex items-center justify-center">
                <svg viewBox="0 0 360 120" className="w-full h-full overflow-visible">
                  {/* Ground line */}
                  <line x1="20" y1="95" x2="340" y2="95" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                  
                  {/* Origin */}
                  <circle cx="40" cy="95" r="4" fill="#0864C7" />
                  <text x="40" y="112" fill="#647184" fontSize="8" fontFamily="monospace" textAnchor="middle">
                    0 FT
                  </text>

                  {/* ~100 ft Spec Target */}
                  <line x1="140" y1="35" x2="140" y2="95" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 3" />
                  <circle cx="140" cy="95" r="3.5" fill="#94A3B8" />
                  <rect x="98" y="24" width="84" height="16" rx="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
                  <text x="140" y="35" fill="#475569" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    TARGET: ~100 FT
                  </text>

                  {/* Arc Path */}
                  <path
                    d="M 40 95 Q 170 -15 300 95"
                    fill="none"
                    stroke="#0864C7"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />

                  {/* Achieved ~300 ft Landing */}
                  <circle cx="300" cy="95" r="4.5" fill="#059669" />
                  <circle cx="300" cy="95" r="10" fill="none" stroke="#059669" strokeWidth="1" className="animate-ping opacity-40" />
                  <rect x="238" y="48" width="108" height="20" rx="4" fill="#FFFFFF" stroke="#059669" strokeWidth="1.2" />
                  <text x="292" y="61" fill="#059669" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    ~300 FT (3× TARGET)
                  </text>
                </svg>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#647184] pt-1 border-t border-black/5">
                <span>Team: ~15 Members Led</span>
                <span className="text-[#0864C7]">Commercial Margin: ~30–40%</span>
              </div>
            </motion.div>
          )}

          {/* 2. DUALSENSE PREVIEW */}
          {activeId === 'dualsense' && (
            <motion.div
              key="preview-dualsense"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full flex flex-col justify-between relative z-10"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#647184]">
                <span className="text-[#0864C7] font-semibold">SIGNAL ARCHITECTURE</span>
                <span className="text-emerald-700 font-bold">RP2350 Hardware Bridge</span>
              </div>

              {/* 3 Hardware Nodes with Traveling Signal Packets */}
              <div className="relative flex-1 flex flex-col justify-center">
                <div className="grid grid-cols-3 gap-2 items-center text-center">
                  {/* PC */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#CBD5E1] shadow-xs flex items-center justify-center text-[#178BFF]">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#17202A] mt-1">PC Host</span>
                  </div>

                  {/* Pico 2 W */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF5FF] border-2 border-[#178BFF] shadow-xs flex items-center justify-center text-[#0864C7] relative">
                      <Cpu className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#178BFF] animate-pulse" />
                    </div>
                    <span className="text-[10px] font-bold text-[#0864C7] mt-1">Pico 2 W</span>
                  </div>

                  {/* DualSense */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#CBD5E1] shadow-xs flex items-center justify-center text-[#178BFF]">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#17202A] mt-1">DualSense</span>
                  </div>
                </div>

                {/* Animated Bridge Lines with Traveling Signal Packets */}
                <div className="relative mt-2">
                  <svg viewBox="0 0 240 24" className="w-full h-6 overflow-visible">
                    <line x1="45" y1="12" x2="95" y2="12" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="145" y1="12" x2="195" y2="12" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                    
                    {/* Left packet */}
                    <motion.circle
                      cx="45"
                      cy="12"
                      r="3.5"
                      fill="#178BFF"
                      animate={{ cx: [45, 95] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Right packet */}
                    <motion.circle
                      cx="195"
                      cy="12"
                      r="3.5"
                      fill="#0864C7"
                      animate={{ cx: [195, 145] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', delay: 0.6 }}
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#647184] pt-1 border-t border-black/5">
                <span>Channels: Inputs · Haptics · Triggers · Audio</span>
                <span className="text-[#0864C7]">Wired USB</span>
              </div>
            </motion.div>
          )}

          {/* 3. EZER PREVIEW */}
          {activeId === 'ezer' && (
            <motion.div
              key="preview-ezer"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full flex flex-col justify-between relative z-10"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#647184]">
                <span className="text-[#0864C7] font-semibold">LOCAL AI WORKFLOW CONCEPT</span>
                <span className="text-amber-700 font-bold">In Active Development</span>
              </div>

              {/* Step Sequence: Voice intent → Solving → 3D Solid */}
              <div className="flex-1 flex flex-col justify-center items-center space-y-2.5">
                {/* Voice Input Capsule */}
                <div className="px-3 py-1.5 rounded-full bg-[#0A0F1D] border border-white/20 text-white flex items-center gap-2 text-[10px] font-mono shadow-md w-full max-w-[260px]">
                  <Mic className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse shrink-0" />
                  <span className="truncate text-white/90">
                    &ldquo;Build 2″ × 2″ × 2″ cube with 1″ hole&rdquo;
                  </span>
                </div>

                {/* Solving Indicator */}
                <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-[#0864C7] bg-white px-2.5 py-1 rounded-md border border-[#178BFF]/30 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF] animate-ping" />
                  <span>Parsing constraints &amp; synthesizing geometry…</span>
                </div>

                {/* Tiny CAD Model Result Chip */}
                <div className="flex items-center gap-2 text-[10.5px] font-mono font-bold text-[#059669] bg-[#EBFDF5] border border-[#A7F3D0] px-3 py-1 rounded-lg">
                  <Box className="w-3.5 h-3.5" />
                  <span>Solid Model Generated: 2.000″ Cube</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#647184] pt-1 border-t border-black/5">
                <span>Stack: Tauri · Rust · SolidJS</span>
                <span className="text-[#0864C7]">Full Demo Below</span>
              </div>
            </motion.div>
          )}

          {/* 4. UNIRATE PREVIEW */}
          {activeId === 'unirate' && (
            <motion.div
              key="preview-unirate"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full flex flex-col justify-between relative z-10"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#647184]">
                <span className="text-[#0864C7] font-semibold">IN-PORTAL DOM INJECTION</span>
                <span className="text-[#0864C7] font-bold">Published Extension</span>
              </div>

              {/* Registration Table Row Preview & Injected Card */}
              <div className="flex-1 flex flex-col justify-center space-y-2">
                {/* Course Row */}
                <div className="bg-white p-2 rounded-lg border border-[#CBD5E1] shadow-2xs flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="font-bold text-[#17202A]">ME 3110</span>
                    <span className="text-[10px] text-[#647184] ml-1">Fluid Mechanics</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#334155] font-sans">Dr. A. Reynolds</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EBFDF5] text-[#047857] border border-[#A7F3D0] flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 fill-current" />
                      4.8
                    </span>
                  </div>
                </div>

                {/* Injected Popover Card Snippet */}
                <div className="bg-white/95 p-2 rounded-lg border border-[#178BFF]/40 shadow-md text-[10px] font-mono flex items-center justify-between">
                  <div>
                    <span className="text-[#0864C7] font-bold block">Rate My Professors Card</span>
                    <span className="text-[#647184]">Quality: 4.8 · Difficulty: 2.3</span>
                  </div>
                  <span className="text-[#059669] font-bold bg-[#EBFDF5] px-2 py-0.5 rounded">
                    95% Take Again
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#647184] pt-1 border-t border-black/5">
                <span>Target: University Portal Tables</span>
                <span className="text-[#0864C7]">Full Interactive Demo Below</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Metadata & Deep Link */}
      <div className="flex items-center justify-between pt-2 border-t border-black/5 text-xs font-mono">
        <span className="text-[11px] text-[#475569] truncate max-w-[200px] sm:max-w-none">
          {activeSystem.tagline}
        </span>

        <a
          href="#projects"
          className="text-[11px] font-bold text-[#0864C7] hover:text-[#178BFF] inline-flex items-center gap-1 shrink-0"
        >
          <span>View All Work</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export default SelectedSystemsReel;
