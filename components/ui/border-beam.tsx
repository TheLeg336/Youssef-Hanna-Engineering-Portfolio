'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BorderBeamProps {
  children?: React.ReactNode;
  size?: 'md' | 'sm' | 'line' | 'pulse-inner' | 'pulse-outside';
  colorVariant?: 'aurora' | 'ocean' | 'colorful' | 'mono' | 'sunset' | 'forest' | 'candy' | 'ice' | 'gold';
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
  // Vibrant contrasting aurora spectrum: sharply visible against blue buttons, glass, and dark surfaces
  aurora:
    'conic-gradient(from 0deg, transparent 0%, transparent 50%, #38BDF8 68%, #818CF8 80%, #C084FC 90%, #F472B6 96%, #F59E0B 99%, transparent 100%)',
  ocean:
    'conic-gradient(from 0deg, transparent 0%, transparent 55%, #00F0FF 70%, #178BFF 85%, #60A5FA 95%, transparent 100%)',
  colorful:
    'conic-gradient(from 0deg, transparent 0%, transparent 45%, #06B6D4 60%, #3B82F6 72%, #8B5CF6 84%, #EC4899 94%, #F59E0B 98%, transparent 100%)',
  sunset:
    'conic-gradient(from 0deg, transparent 0%, transparent 55%, #F59E0B 72%, #EF4444 86%, #EC4899 96%, transparent 100%)',
  gold:
    'conic-gradient(from 0deg, transparent 0%, transparent 55%, #FBBF24 72%, #F59E0B 86%, #D97706 96%, transparent 100%)',
  mono:
    'conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(255,255,255,0.4) 80%, rgba(255,255,255,0.95) 95%, transparent 100%)',
};

export function BorderBeam({
  children,
  size = 'md',
  colorVariant = 'aurora',
  strength = 1.0,
  active = true,
  theme = 'dark',
  borderRadius = 9999,
  className = '',
  borderWidth = 2,
  duration = 2.4,
}: BorderBeamProps) {
  const gradient = GRADIENT_PRESETS[colorVariant] || GRADIENT_PRESETS.aurora;

  return (
    <div
      style={{ borderRadius: `${borderRadius}px` }}
      className={cn('relative p-[2px] overflow-hidden inline-flex', className)}
    >
      {/* Animated Rotating Gradient Beam */}
      <div
        className={cn(
          'pointer-events-none absolute inset-[-150%] m-auto aspect-square transition-opacity duration-300',
          active ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          animation: active ? `border-beam-spin ${duration}s linear infinite` : 'none',
          background: gradient,
        }}
      />

      {/* Radiant Bloom Glow Layer for high-contrast border definition */}
      <div
        className={cn(
          'pointer-events-none absolute inset-[-150%] m-auto aspect-square filter blur-[6px] transition-opacity duration-300',
          active ? 'opacity-90' : 'opacity-0'
        )}
        style={{
          animation: active ? `border-beam-spin ${duration}s linear infinite` : 'none',
          background: gradient,
        }}
      />

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
