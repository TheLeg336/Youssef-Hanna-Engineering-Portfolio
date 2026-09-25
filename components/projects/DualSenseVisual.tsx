'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { motion } from 'motion/react';
import { Monitor, Cpu, Gamepad2, Zap, Activity, Gauge, Volume2 } from 'lucide-react';
import { useReducedMotion } from '@/components/motion/Reveal';
import { useElementVisibility } from '@/lib/useVisibility';

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

type ChannelKey = 'all' | 'inputs' | 'haptics' | 'triggers' | 'audio';

export function DualSenseVisual() {
  const [activeChannel, setActiveChannel] = useState<ChannelKey>('all');
  const mounted = useMounted();
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useElementVisibility(containerRef, 0.25);
  const prefersReduced = useReducedMotion();

  const channels = [
    {
      id: 'inputs' as ChannelKey,
      name: 'Inputs',
      label: 'Controller Inputs',
      description: 'Analog sticks, buttons, and IMU data bridged from controller through Pico 2 W to PC host.',
      direction: 'DualSense → Pico 2 W → PC Host',
      dirType: 'upstream',
      icon: Zap,
    },
    {
      id: 'haptics' as ChannelKey,
      name: 'Haptics',
      label: 'Dual Haptic Actuators',
      description: 'PC force-feedback waveforms translated by Pico 2 W into dual voice-coil actuator displacement.',
      direction: 'PC Host → Pico 2 W → DualSense',
      dirType: 'downstream',
      icon: Activity,
    },
    {
      id: 'triggers' as ChannelKey,
      name: 'Adaptive Triggers',
      label: 'Adaptive Triggers',
      description: 'Dynamic resistance profiles bridged to controller motorized gear actuators.',
      direction: 'PC Host → Pico 2 W → DualSense',
      dirType: 'downstream',
      icon: Gauge,
    },
    {
      id: 'audio' as ChannelKey,
      name: 'Audio / Mic',
      label: 'Bidirectional Audio',
      description: 'Audio playback and microphone stream communication bridged over USB interface.',
      direction: 'Bidirectional (PC ↔ Pico 2 W ↔ DualSense)',
      dirType: 'bidirectional',
      icon: Volume2,
    },
  ];

  // Auto-cycle through channels autonomously (3.5s per channel) so it shows off everything non-interactively
  useEffect(() => {
    if (prefersReduced || !isVisible) return;

    const channelSequence: ChannelKey[] = ['all', 'inputs', 'haptics', 'triggers', 'audio'];
    const timer = setInterval(() => {
      setActiveChannel((prev) => {
        const nextIdx = (channelSequence.indexOf(prev) + 1) % channelSequence.length;
        return channelSequence[nextIdx];
      });
    }, 3600);

    return () => clearInterval(timer);
  }, [isVisible, prefersReduced]);

  const currentChannelInfo = channels.find((c) => c.id === activeChannel);

  return (
    <div
      ref={containerRef}
      className="w-full glass-panel rounded-2xl p-5 sm:p-6 md:p-7 overflow-hidden select-none"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-3.5 mb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#0864C7] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
            Embedded Hardware · Raspberry Pi Pico 2 W
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#17202A] mt-0.5">
            Bidirectional Signal Architecture
          </h3>
        </div>

        <span className="px-2.5 py-1 rounded-md bg-[#EEF2F6] text-[10px] font-mono text-[#647184] font-semibold border border-[#CBD5E1]/60 self-start sm:self-auto">
          Wired Hardware Bridge
        </span>
      </div>

      {/* Channel Selector Pill Row (Horizontally scrollable on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveChannel('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] ${
            activeChannel === 'all'
              ? 'glass-pill-active font-bold text-[#0864C7]'
              : 'glass-pill text-[#647184] hover:text-[#17202A]'
          }`}
        >
          All Channels
        </button>

        {channels.map((ch) => {
          const Icon = ch.icon;
          const isActive = activeChannel === ch.id;

          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => setActiveChannel(ch.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all inline-flex items-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] ${
                isActive
                  ? 'glass-pill-active font-bold text-[#0864C7]'
                  : 'glass-pill text-[#647184] hover:text-[#17202A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{ch.name}</span>
            </button>
          );
        })}
      </div>

      {/* DESKTOP & TABLET: HORIZONTAL ARCHITECTURE VISUALIZATION */}
      <div className="hidden sm:block relative w-full py-8 px-6 bg-gradient-to-b from-[#FAFBFD] to-[#F1F5F9] rounded-xl border border-[#CBD5E1] overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid-fine opacity-50 pointer-events-none" />

        {/* 3 Hardware Nodes Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-6 items-center text-center">
          {/* Node 1: PC Host */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-[#CBD5E1] flex items-center justify-center text-[#178BFF] mb-2">
              <Monitor className="w-8 h-8" />
            </div>
            <div className="text-sm font-bold text-[#17202A]">PC Host</div>
            <div className="text-[10px] font-mono text-[#647184]">Windows / Linux</div>
          </div>

          {/* Node 2: Raspberry Pi Pico 2 W */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF5FF] shadow-md border-2 border-[#178BFF] flex items-center justify-center text-[#0864C7] mb-2 relative">
              <Cpu className="w-8 h-8" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#178BFF] animate-pulse" />
            </div>
            <div className="text-sm font-bold text-[#0864C7]">Pico 2 W Bridge</div>
            <div className="text-[10px] font-mono text-[#647184]">RP2350 Microcontroller</div>
          </div>

          {/* Node 3: DualSense Controller */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-[#CBD5E1] flex items-center justify-center text-[#178BFF] mb-2">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <div className="text-sm font-bold text-[#17202A]">DualSense</div>
            <div className="text-[10px] font-mono text-[#647184]">Haptics &amp; Triggers</div>
          </div>
        </div>

        {/* Horizontal SVG Connection Paths */}
        <div className="relative mt-6 pt-3 border-t border-black/5">
          <svg viewBox="0 0 500 40" className="w-full h-10 overflow-visible" preserveAspectRatio="none">
            <line x1="90" y1="20" x2="230" y2="20" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="270" y1="20" x2="410" y2="20" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />

            {mounted && isVisible && !prefersReduced && (
              <>
                {/* Inputs: Controller -> Pico -> PC */}
                {(activeChannel === 'all' || activeChannel === 'inputs') && (
                  <>
                    <motion.circle
                      cx="410"
                      cy="20"
                      r="4"
                      fill="#178BFF"
                      animate={{ cx: [410, 270] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.circle
                      cx="230"
                      cy="20"
                      r="4"
                      fill="#178BFF"
                      animate={{ cx: [230, 90] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: 'linear', delay: 0.65 }}
                    />
                  </>
                )}

                {/* Haptics & Triggers: PC -> Pico -> Controller */}
                {(activeChannel === 'all' || activeChannel === 'haptics' || activeChannel === 'triggers') && (
                  <>
                    <motion.circle
                      cx="90"
                      cy="20"
                      r="4"
                      fill="#0864C7"
                      animate={{ cx: [90, 230] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.circle
                      cx="270"
                      cy="20"
                      r="4"
                      fill="#0864C7"
                      animate={{ cx: [270, 410] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: 'linear', delay: 0.65 }}
                    />
                  </>
                )}

                {/* Audio: Bidirectional */}
                {(activeChannel === 'all' || activeChannel === 'audio') && (
                  <>
                    <motion.circle
                      cx="90"
                      cy="15"
                      r="3.5"
                      fill="#7C3AED"
                      animate={{ cx: [90, 230] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.2 }}
                    />
                    <motion.circle
                      cx="410"
                      cy="25"
                      r="3.5"
                      fill="#7C3AED"
                      animate={{ cx: [410, 270] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.4 }}
                    />
                  </>
                )}
              </>
            )}
          </svg>
        </div>
      </div>

      {/* MOBILE: CLEAN VERTICAL ARCHITECTURE (Per Section 65) */}
      <div className="sm:hidden relative w-full py-5 px-4 bg-gradient-to-b from-[#FAFBFD] to-[#F1F5F9] rounded-xl border border-[#CBD5E1] overflow-hidden">
        <div className="flex flex-col items-center gap-3">
          {/* Node 1: PC Host */}
          <div className="flex items-center gap-3 w-full max-w-[240px] p-2.5 rounded-xl bg-white border border-[#CBD5E1] shadow-2xs">
            <Monitor className="w-6 h-6 text-[#178BFF] shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-[#17202A]">PC Host</div>
              <div className="text-[10px] font-mono text-[#647184]">Windows / Linux</div>
            </div>
          </div>

          {/* Vertical Signal Arrow / Line */}
          <div className="h-6 w-0.5 bg-[#CBD5E1] relative flex items-center justify-center">
            {mounted && isVisible && !prefersReduced && (
              <motion.div
                className="w-2 h-2 rounded-full bg-[#178BFF]"
                animate={{ y: [-10, 10] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </div>

          {/* Node 2: Pico 2 W */}
          <div className="flex items-center gap-3 w-full max-w-[240px] p-2.5 rounded-xl bg-[#EAF5FF] border-2 border-[#178BFF] shadow-xs">
            <Cpu className="w-6 h-6 text-[#0864C7] shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-[#0864C7]">Pico 2 W Bridge</div>
              <div className="text-[10px] font-mono text-[#647184]">RP2350 Controller</div>
            </div>
          </div>

          {/* Vertical Signal Arrow / Line */}
          <div className="h-6 w-0.5 bg-[#CBD5E1] relative flex items-center justify-center">
            {mounted && isVisible && !prefersReduced && (
              <motion.div
                className="w-2 h-2 rounded-full bg-[#0864C7]"
                animate={{ y: [10, -10] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'linear', delay: 0.55 }}
              />
            )}
          </div>

          {/* Node 3: DualSense */}
          <div className="flex items-center gap-3 w-full max-w-[240px] p-2.5 rounded-xl bg-white border border-[#CBD5E1] shadow-2xs">
            <Gamepad2 className="w-6 h-6 text-[#178BFF] shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-[#17202A]">DualSense Controller</div>
              <div className="text-[10px] font-mono text-[#647184]">Haptics &amp; Triggers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Strip */}
      <div className="mt-3 p-3 rounded-xl bg-white border border-[#CBD5E1] shadow-2xs text-xs font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 mb-1 border-b border-black/5">
          <span className="font-bold text-[#17202A] flex items-center gap-1.5 truncate min-w-0">
            {currentChannelInfo ? currentChannelInfo.label : 'All 4 Concurrent Signal Channels'}
          </span>
          <span className="text-[10px] sm:text-[10.5px] text-[#0864C7] font-semibold truncate shrink-0">
            {currentChannelInfo ? currentChannelInfo.direction : 'Wired USB Interface'}
          </span>
        </div>
        <p className="text-[11px] text-[#475569] font-sans leading-relaxed">
          {currentChannelInfo
            ? currentChannelInfo.description
            : 'Hardware bridge translates controller inputs, dual voice-coil haptic vibrations, motorized adaptive trigger braking curves, and audio telemetry between PC and controller.'}
        </p>
      </div>

      {/* Verified Compact Facts Rail */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-3 border-t border-black/5 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-white/70 border border-[#CBD5E1]/60">
          <div className="text-[10px] text-[#647184] uppercase font-medium">Role</div>
          <div className="text-xs font-bold text-[#17202A] mt-0.5">Designer / Builder</div>
          <div className="text-[10px] text-[#647184]">Solo Embedded Build</div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/70 border border-[#CBD5E1]/60">
          <div className="text-[10px] text-[#647184] uppercase font-medium">Hardware</div>
          <div className="text-xs font-bold text-[#0864C7] mt-0.5">Raspberry Pi Pico 2 W</div>
          <div className="text-[10px] text-[#647184]">RP2350 Microcontroller</div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
          <div className="text-[10px] text-[#047857] uppercase font-bold">Status</div>
          <div className="text-xs font-bold text-[#047857] mt-0.5">Built &amp; Functional</div>
          <div className="text-[10px] text-[#059669]">Hand-Soldered Hardware</div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/70 border border-[#CBD5E1]/60">
          <div className="text-[10px] text-[#647184] uppercase font-medium">Functions</div>
          <div className="text-xs font-bold text-[#17202A] mt-0.5">4 Signal Streams</div>
          <div className="text-[10px] text-[#647184]">Inputs · Haptics · Triggers · Audio</div>
        </div>
      </div>
    </div>
  );
}

export default DualSenseVisual;
