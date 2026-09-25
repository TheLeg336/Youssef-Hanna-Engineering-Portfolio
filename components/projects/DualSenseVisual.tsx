'use client';

import React, { useState, useRef, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor, Cpu, Gamepad2, Zap, Activity, Gauge, Volume2, ArrowRight, ArrowLeft } from 'lucide-react';
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
  const isVisible = useElementVisibility(containerRef, 0.2);
  const prefersReduced = useReducedMotion();

  const channels = [
    {
      id: 'inputs' as ChannelKey,
      name: 'Inputs',
      label: 'Controller Inputs',
      description: 'Analog sticks, buttons, and 6-axis IMU data routed from controller through Pico 2 W to PC host.',
      direction: 'DualSense → Pico 2 W → PC Host',
      dirType: 'left', // from right to left
      icon: Zap,
      color: '#178BFF',
    },
    {
      id: 'haptics' as ChannelKey,
      name: 'Haptics',
      label: 'Dual Haptic Actuators',
      description: 'PC force-feedback waveforms translated by the Pico into dual voice-coil actuator displacement.',
      direction: 'PC Host → Pico 2 W → DualSense',
      dirType: 'right', // from left to right
      icon: Activity,
      color: '#0864C7',
    },
    {
      id: 'triggers' as ChannelKey,
      name: 'Triggers',
      label: 'Adaptive Triggers',
      description: 'Motorized braking curves and dynamic resistance profiles bridged to controller gear actuators.',
      direction: 'PC Host → Pico 2 W → DualSense',
      dirType: 'right',
      icon: Gauge,
      color: '#0284C7',
    },
    {
      id: 'audio' as ChannelKey,
      name: 'Audio / Mic',
      label: 'Bidirectional Audio',
      description: 'Audio playback and microphone input telemetry bridged over synchronous USB endpoints.',
      direction: 'Bidirectional (PC ↔ Pico 2 W ↔ DualSense)',
      dirType: 'bi',
      icon: Volume2,
      color: '#7C3AED',
    },
  ];

  const currentChannelInfo = channels.find((c) => c.id === activeChannel);

  return (
    <div
      ref={containerRef}
      className="w-full glass-panel rounded-2xl p-5 sm:p-6 overflow-hidden select-none"
    >
      {/* Top Header & Channel Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-4 mb-5">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#0864C7] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
            Embedded Systems · RP2350 Architecture
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#17202A] mt-0.5">
            DualSense to PC Interactive Signal Flow
          </h3>
        </div>

        <span className="text-[11px] font-mono text-[#647184]">
          Wired bridge · 4 bidirectional channels
        </span>
      </div>

      {/* Actual Functional Channel Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        <button
          type="button"
          onClick={() => setActiveChannel('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] ${
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] ${
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

      {/* Signal Flow Diagram Surface */}
      <div className="relative w-full py-8 px-4 sm:px-8 bg-gradient-to-b from-[#FAFBFD] to-[#F1F5F9] rounded-xl border border-[#CBD5E1] overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid-fine opacity-50 pointer-events-none" />

        {/* 3 Hardware Nodes Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-6 items-center text-center">
          {/* Node 1: PC Host */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-md border border-[#CBD5E1] flex items-center justify-center text-[#178BFF] mb-2 group-hover:border-[#178BFF]">
              <Monitor className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#17202A]">PC Host</div>
            <div className="text-[10px] font-mono text-[#647184]">Windows / Linux</div>
          </div>

          {/* Node 2: Raspberry Pi Pico 2 W */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EAF5FF] shadow-md border-2 border-[#178BFF] flex items-center justify-center text-[#0864C7] mb-2 relative">
              <Cpu className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#178BFF] animate-pulse" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#17202A]">RP2350 Bridge</div>
            <div className="text-[10px] font-mono text-[#0864C7] font-semibold">Pico 2 W Microcontroller</div>
          </div>

          {/* Node 3: DualSense Controller */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-md border border-[#CBD5E1] flex items-center justify-center text-[#178BFF] mb-2">
              <Gamepad2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#17202A]">DualSense</div>
            <div className="text-[10px] font-mono text-[#647184]">Haptics & Triggers</div>
          </div>
        </div>

        {/* Animated Signal SVG Paths Connecting Nodes */}
        <div className="relative mt-6 pt-4 border-t border-black/5">
          <svg
            viewBox="0 0 500 50"
            className="w-full h-12 overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Base line 1: PC to Pico */}
            <line
              x1="90"
              y1="25"
              x2="230"
              y2="25"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Base line 2: Pico to DualSense */}
            <line
              x1="270"
              y1="25"
              x2="410"
              y2="25"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Dynamic Traveling Signal Packets */}
            {mounted && isVisible && !prefersReduced && (
              <>
                {/* Inputs: Right to Left (410 -> 270, 230 -> 90) */}
                {(activeChannel === 'all' || activeChannel === 'inputs') && (
                  <>
                    <motion.circle
                      cx="410"
                      cy="25"
                      r="4"
                      fill="#178BFF"
                      animate={{ cx: [410, 270] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.circle
                      cx="230"
                      cy="25"
                      r="4"
                      fill="#178BFF"
                      animate={{ cx: [230, 90] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', delay: 0.7 }}
                    />
                  </>
                )}

                {/* Haptics / Triggers: Left to Right (90 -> 230, 270 -> 410) */}
                {(activeChannel === 'all' || activeChannel === 'haptics' || activeChannel === 'triggers') && (
                  <>
                    <motion.circle
                      cx="90"
                      cy="25"
                      r="4"
                      fill="#0864C7"
                      animate={{ cx: [90, 230] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.circle
                      cx="270"
                      cy="25"
                      r="4"
                      fill="#0864C7"
                      animate={{ cx: [270, 410] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', delay: 0.7 }}
                    />
                  </>
                )}

                {/* Audio: Bidirectional */}
                {(activeChannel === 'all' || activeChannel === 'audio') && (
                  <>
                    <motion.circle
                      cx="90"
                      cy="20"
                      r="3.5"
                      fill="#7C3AED"
                      animate={{ cx: [90, 230] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'linear', delay: 0.3 }}
                    />
                    <motion.circle
                      cx="410"
                      cy="30"
                      r="3.5"
                      fill="#7C3AED"
                      animate={{ cx: [410, 270] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'linear', delay: 0.5 }}
                    />
                  </>
                )}
              </>
            )}
          </svg>
        </div>

        {/* Selected Channel Explanation Card */}
        <div className="mt-2 p-3.5 rounded-xl bg-white/95 border border-[#CBD5E1] shadow-xs text-xs font-mono text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-black/5 pb-1.5 mb-2">
            <span className="font-bold text-[#17202A] flex items-center gap-1.5">
              {currentChannelInfo ? (
                <>
                  <currentChannelInfo.icon className="w-3.5 h-3.5 text-[#178BFF]" />
                  <span>{currentChannelInfo.label}</span>
                </>
              ) : (
                'All 4 Concurrent Signal Channels Active'
              )}
            </span>

            <span className="text-[11px] text-[#0864C7] font-semibold">
              {currentChannelInfo ? currentChannelInfo.direction : 'Full Duplex USB Stream'}
            </span>
          </div>

          <p className="text-[11px] text-[#475569] font-sans leading-relaxed">
            {currentChannelInfo
              ? currentChannelInfo.description
              : 'Dedicated dual-core ARM Cortex-M33 scanning loop processes inputs on Core 0 while Core 1 routes force-feedback telemetry packets to prevent input starvation.'}
          </p>
        </div>
      </div>

      {/* Verified Hardware Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-black/5 text-xs font-mono">
        <div className="glass-card-solid p-3 rounded-xl">
          <div className="text-[10px] text-[#647184] uppercase">Microcontroller</div>
          <div className="text-xs font-bold text-[#17202A] mt-0.5">RP2350 (Pico 2 W)</div>
          <div className="text-[10px] text-[#647184]">Dual-Core M33</div>
        </div>

        <div className="glass-card-solid p-3 rounded-xl">
          <div className="text-[10px] text-[#647184] uppercase">Interface Type</div>
          <div className="text-xs font-bold text-[#17202A] mt-0.5">Wired Hardware Bridge</div>
          <div className="text-[10px] text-[#647184]">Hand-Soldered Header</div>
        </div>

        <div className="glass-card-solid p-3 rounded-xl">
          <div className="text-[10px] text-[#647184] uppercase">Active Channels</div>
          <div className="text-xs font-bold text-[#17202A] mt-0.5">4 Bidirectional</div>
          <div className="text-[10px] text-[#647184]">Inputs, Haptics, Triggers, Audio</div>
        </div>

        <div className="glass-card-solid p-3 rounded-xl bg-[#F0FDF4] border-[#BBF7D0]">
          <div className="text-[10px] text-[#047857] uppercase font-bold">Build Status</div>
          <div className="text-xs font-bold text-[#047857] mt-0.5">Built & Functional</div>
          <div className="text-[10px] text-[#059669]">Physical Hardware</div>
        </div>
      </div>
    </div>
  );
}
export default DualSenseVisual;
