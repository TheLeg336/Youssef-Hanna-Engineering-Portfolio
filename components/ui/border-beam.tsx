'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BorderBeamProps {
  children?: React.ReactNode;
  size?: 'md' | 'sm' | 'line' | 'pulse-inner' | 'pulse-outside';
  colorVariant?: 'aurora' | 'ocean' | 'electric' | 'ice' | 'colorful' | 'mono' | 'sunset' | 'forest' | 'candy' | 'gold';
  strength?: number;
  active?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  borderRadius?: number;
  className?: string;
  borderWidth?: number;
  duration?: number;
  [key: string]: any;
}

const GRADIENT_PRESETS: Record<string, string> = {
  // Pure blue gradient mixes: zero purple, high-contrast spectrum from deep cobalt to electric cyan and diamond white tip
  aurora:
    'conic-gradient(from 0deg, rgba(30, 58, 138, 0) 0%, rgba(30, 58, 138, 0) 50%, #1e40af 66%, #0369a1 76%, #0ea5e9 84%, #00f0ff 91%, #bae6fd 96%, #ffffff 99%, rgba(255, 255, 255, 0) 100%)',
  ocean:
    'conic-gradient(from 0deg, rgba(2, 132, 199, 0) 0%, rgba(2, 132, 199, 0) 52%, #1d4ed8 68%, #0284c7 78%, #00d8ff 88%, #7dd3fc 95%, #ffffff 99%, rgba(255, 255, 255, 0) 100%)',
  electric:
    'conic-gradient(from 0deg, rgba(29, 78, 216, 0) 0%, rgba(29, 78, 216, 0) 50%, #1e3a8a 64%, #2563eb 74%, #0284c7 83%, #00f2fe 91%, #e0f2fe 97%, #ffffff 99%, rgba(255, 255, 255, 0) 100%)',
  ice:
    'conic-gradient(from 0deg, rgba(6, 182, 212, 0) 0%, rgba(6, 182, 212, 0) 55%, #0284c7 70%, #06b6d4 82%, #38bdf8 90%, #cffafe 96%, #ffffff 99%, rgba(255, 255, 255, 0) 100%)',
  colorful:
    'conic-gradient(from 0deg, rgba(30, 64, 175, 0) 0%, rgba(30, 64, 175, 0) 48%, #1d4ed8 62%, #0284c7 74%, #06b6d4 84%, #38bdf8 92%, #ffffff 99%, rgba(255, 255, 255, 0) 100%)',
  sunset:
    'conic-gradient(from 0deg, rgba(245, 158, 11, 0) 0%, rgba(245, 158, 11, 0) 55%, #f59e0b 72%, #ea580c 86%, #fbbf24 96%, #ffffff 99%, rgba(255, 255, 255, 0) 100%)',
  gold:
    'conic-gradient(from 0deg, rgba(217, 119, 6, 0) 0%, rgba(217, 119, 6, 0) 55%, #d97706 72%, #f59e0b 86%, #fef08a 96%, #ffffff 99%, rgba(255, 255, 255, 0) 100%)',
  mono:
    'conic-gradient(from 0deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 0.4) 80%, rgba(255, 255, 255, 0.95) 96%, #ffffff 99%, rgba(255, 255, 255, 0) 100%)',
};

export function BorderBeam({
  children,
  size = 'md',
  colorVariant = 'ocean',
  strength = 1.0,
  active = true,
  theme = 'dark',
  borderRadius = 9999,
  className = '',
  borderWidth = 2,
  duration = 2.4,
}: BorderBeamProps) {
  const gradient = GRADIENT_PRESETS[colorVariant] || GRADIENT_PRESETS.ocean;

  return (
    <div
      style={{ borderRadius: `${borderRadius}px` }}
      className={cn('relative p-[2px] inline-flex', className)}
    >
      {/* 
        Perimeter Border Track:
        Strictly masked to the border ring using CSS mask exclusion (WebkitMaskComposite: 'xor').
        The entire inner area (content-box) is 100% hollowed out so the rotating beam and bloom
        can NEVER bleed underneath the button body or cast any moving shadow across the button.
      */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300',
          active ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          padding: `${borderWidth}px`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
        }}
      >
        {/* Animated Rotating Gradient Beam */}
        <div
          className="absolute inset-[-150%] m-auto aspect-square"
          style={{
            animation: active ? `border-beam-spin ${duration}s linear infinite` : 'none',
            background: gradient,
          }}
        />

        {/* Radiant Bloom Glow Layer strictly within the perimeter border */}
        <div
          className="absolute inset-[-150%] m-auto aspect-square filter blur-[3px]"
          style={{
            animation: active ? `border-beam-spin ${duration}s linear infinite` : 'none',
            background: gradient,
            opacity: 0.85,
          }}
        />
      </div>

      {/* Child Content Wrapped at Higher Stacking Context */}
      <div
        style={{ borderRadius: `calc(${borderRadius}px - ${borderWidth}px)` }}
        className="relative z-10 w-full h-full"
      >
        {children}
      </div>
    </div>
  );
}

export default BorderBeam;
