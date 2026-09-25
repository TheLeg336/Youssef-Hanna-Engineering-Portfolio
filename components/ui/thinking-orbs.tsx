'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export type EzerOrbState = 'idle' | 'planning' | 'working' | 'waiting' | 'complete';

interface ThinkingOrbsProps {
  state: EzerOrbState;
  className?: string;
  size?: number;
  interactive?: boolean;
  onStateChange?: (state: EzerOrbState) => void;
}

export function ThinkingOrbs({
  state,
  className,
  size = 140,
}: ThinkingOrbsProps) {
  // Color & atmosphere palettes matching states
  const stateThemes = {
    idle: {
      primary: '#59AFFF',
      secondary: '#1E3A5F',
      glow: 'rgba(89, 175, 255, 0.25)',
      label: 'System Idle — Awaiting Command',
      speed: 6,
    },
    planning: {
      primary: '#7DD3FC',
      secondary: '#38BDF8',
      glow: 'rgba(125, 211, 252, 0.35)',
      label: 'Decomposing Task & Geometry Plan',
      speed: 3,
    },
    working: {
      primary: '#60A5FA',
      secondary: '#93C5FD',
      glow: 'rgba(96, 165, 250, 0.45)',
      label: 'Executing Macro & Parameter Streams',
      speed: 1.8,
    },
    waiting: {
      primary: '#FBBF24',
      secondary: '#D97706',
      glow: 'rgba(251, 191, 36, 0.4)',
      label: 'Human Confirmation Gate Engaged',
      speed: 4,
    },
    complete: {
      primary: '#34D399',
      secondary: '#059669',
      glow: 'rgba(52, 211, 153, 0.4)',
      label: 'Task Sequence Verified & Complete',
      speed: 5,
    },
  };

  const theme = stateThemes[state];

  return (
    <div
      className={cn('relative flex items-center justify-center select-none', className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label={`Ezer AI State: ${state} — ${theme.label}`}
    >
      {/* Background radial atmosphere */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-700 pointer-events-none blur-xl"
        style={{
          background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Engineering precision calibration ring */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="0.8"
          strokeDasharray="2 4"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="rgba(89, 175, 255, 0.15)"
          strokeWidth="0.6"
        />
        {/* Ticks at 4 cardinal axes */}
        <line x1="50" y1="2" x2="50" y2="7" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <line x1="50" y1="93" x2="50" y2="98" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <line x1="2" y1="50" x2="7" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <line x1="93" y1="50" x2="98" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      </svg>

      {/* Outer rotating orbital vector path */}
      <motion.div
        className="absolute inset-2 rounded-full border border-dashed border-white/20"
        animate={{
          rotate: state === 'working' ? 360 : state === 'planning' ? -360 : 0,
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: theme.speed * 2,
        }}
      />

      {/* Primary cognitive orb core */}
      <motion.div
        className="relative rounded-full flex items-center justify-center transition-colors duration-500 overflow-hidden shadow-2xl"
        style={{
          width: size * 0.52,
          height: size * 0.52,
          background: `radial-gradient(circle at 35% 35%, ${theme.primary} 0%, ${theme.secondary} 50%, #090B0F 100%)`,
          boxShadow: `0 0 25px ${theme.glow}, inset 0 0 12px rgba(255,255,255,0.3)`,
        }}
        animate={{
          scale: state === 'working' ? [1, 1.06, 1] : state === 'planning' ? [1, 1.03, 1] : [1, 1.02, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: theme.speed,
          ease: 'easeInOut',
        }}
      >
        {/* Internal refractive highlight */}
        <div className="absolute top-1 left-2 w-5 h-2.5 rounded-full bg-white/40 blur-[1px] -rotate-12" />

        {/* Orbiting micro-satellite point */}
        {state !== 'idle' && (
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]"
            animate={{
              x: [-(size * 0.2), size * 0.2, -(size * 0.2)],
              y: [-(size * 0.1), size * 0.1, -(size * 0.1)],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: theme.speed * 0.8,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
