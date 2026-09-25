'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from '@/components/motion/Reveal';
import { LauncherVisual } from '@/components/projects/LauncherVisual';
import { DualSenseVisual } from '@/components/projects/DualSenseVisual';
import { EzerVisual } from '@/components/projects/EzerVisual';
import { UniRateVisual } from '@/components/projects/UniRateVisual';

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
  {
    id: 'dualsense',
    label: 'DualSense',
    category: 'Embedded Hardware',
    tagline: 'Pico 2 W hardware bridge: PC ↔ Controller',
  },
];

export function SelectedSystemsReel() {
  const [activeId, setActiveId] = useState<SystemId>('launcher');
  const [userClicked, setUserClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReduced = useReducedMotion();
  const autoCycleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-cycle through systems every 12 seconds unless user clicked a tab or is currently hovering
  useEffect(() => {
    if (prefersReduced || userClicked || isHovered) return;

    autoCycleTimerRef.current = setInterval(() => {
      setActiveId((prev) => {
        const idx = SYSTEMS.findIndex((s) => s.id === prev);
        const nextIdx = (idx + 1) % SYSTEMS.length;
        return SYSTEMS[nextIdx].id;
      });
    }, 12000);

    return () => {
      if (autoCycleTimerRef.current) {
        clearInterval(autoCycleTimerRef.current);
      }
    };
  }, [prefersReduced, userClicked, isHovered]);

  const handleTabClick = (id: SystemId) => {
    setUserClicked(true);
    setActiveId(id);
    if (autoCycleTimerRef.current) {
      clearInterval(autoCycleTimerRef.current);
      autoCycleTimerRef.current = null;
    }
  };

  const activeSystem = SYSTEMS.find((s) => s.id === activeId) || SYSTEMS[0];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            {userClicked ? 'Manual Control' : isHovered ? 'Paused on Hover' : 'Auto-cycling (12s)'}
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
                onClick={() => handleTabClick(sys.id)}
                className={`relative py-1.5 px-2 rounded-lg text-xs font-mono transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] cursor-pointer ${
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

      {/* Full Non-Interactable Autonomous Demo Stage */}
      <div className="relative w-full my-3 min-h-[460px] sm:min-h-[490px] rounded-xl overflow-hidden pointer-events-none select-none [&_.glass-panel]:border-0 [&_.glass-panel]:shadow-none [&_.glass-panel]:bg-transparent [&_.glass-panel]:p-0">
        <AnimatePresence mode="wait">
          {activeId === 'launcher' && (
            <motion.div
              key="hero-launcher"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full"
            >
              <LauncherVisual idPrefix="hero" />
            </motion.div>
          )}

          {activeId === 'ezer' && (
            <motion.div
              key="hero-ezer"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full"
            >
              <EzerVisual />
            </motion.div>
          )}

          {activeId === 'unirate' && (
            <motion.div
              key="hero-unirate"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full"
            >
              <UniRateVisual layoutPrefix="hero" />
            </motion.div>
          )}

          {activeId === 'dualsense' && (
            <motion.div
              key="hero-dualsense"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full"
            >
              <DualSenseVisual />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Metadata & Deep Link */}
      <div className="flex items-center justify-between pt-2.5 border-t border-black/5 text-xs font-mono">
        <span className="text-[11px] text-[#475569] truncate flex-1 min-w-0 pr-2">
          {activeSystem.tagline}
        </span>

        <a
          href="#projects"
          className="text-[11px] font-bold text-[#0864C7] hover:text-[#178BFF] inline-flex items-center gap-1 shrink-0 transition-colors"
        >
          <span>View All Work</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export default SelectedSystemsReel;
