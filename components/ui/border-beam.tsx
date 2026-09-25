'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BorderBeamProps {
  children?: React.ReactNode;
  size?: 'md' | 'sm' | 'line' | 'pulse-inner' | 'pulse-outside';
  colorVariant?: 'colorful' | 'mono' | 'ocean' | 'sunset' | 'forest' | 'candy' | 'ice' | 'gold';
  strength?: number;
  active?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  borderRadius?: number;
  className?: string;
  borderWidth?: number;
  duration?: number;
  [key: string]: any;
}

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
  duration = 2.0,
}: BorderBeamProps) {
  return (
    <div
      style={{ borderRadius: `${borderRadius}px` }}
      className={cn('relative p-[2px] overflow-hidden', className)}
    >
      {/* Animated Rotating Gradient Beam */}
      <div
        className={cn(
          'pointer-events-none absolute inset-[-150%] m-auto aspect-square transition-opacity duration-300',
          active ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          animation: active ? `border-beam-spin ${duration}s linear infinite` : 'none',
          background:
            'conic-gradient(from 0deg, transparent 0%, transparent 55%, #00F0FF 70%, #178BFF 85%, #60A5FA 95%, transparent 100%)',
        }}
      />

      {/* Radiant Bloom Glow Layer */}
      <div
        className={cn(
          'pointer-events-none absolute inset-[-150%] m-auto aspect-square filter blur-[6px] transition-opacity duration-300',
          active ? 'opacity-90' : 'opacity-0'
        )}
        style={{
          animation: active ? `border-beam-spin ${duration}s linear infinite` : 'none',
          background:
            'conic-gradient(from 0deg, transparent 0%, transparent 55%, #00F0FF 70%, #178BFF 85%, #38BDF8 95%, transparent 100%)',
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
