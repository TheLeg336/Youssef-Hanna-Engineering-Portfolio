'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// Dynamically import client-only WebGL / Canvas effects to prevent SSR hydration mismatches
const DynamicBorderBeam = dynamic(
  () => import('border-beam').then((mod) => mod.BorderBeam),
  {
    ssr: false,
    loading: () => <div className="border border-[#178BFF]/20 rounded-[inherit] w-full h-full" />,
  }
);

const DynamicThinkingOrb = dynamic(
  () => import('thinking-orbs').then((mod) => mod.ThinkingOrb),
  {
    ssr: false,
    loading: () => <div className="w-16 h-16 rounded-full bg-[#178BFF]/10 border border-[#178BFF]/30 animate-pulse" />,
  }
);

const DynamicMetalBadge = dynamic(
  () => import('metal-fx').then((mod) => mod.MetalBadge),
  {
    ssr: false,
    loading: () => <span className="font-mono text-xs font-bold text-[#17202A]">YH</span>,
  }
);

const DynamicLiquid = dynamic(
  () => import('liquid-gooey').then((mod) => mod.Liquid),
  {
    ssr: false,
    loading: () => null,
  }
);

import { BorderBeam as BaseBorderBeam, type BorderBeamProps } from './border-beam';

// BorderBeam wrapper with aerospace ocean styling
export function AppBorderBeam({
  children,
  colorVariant = 'ocean',
  size = 'md',
  strength = 1.0,
  active = true,
  theme = 'dark',
  borderRadius = 9999,
  className = '',
  duration = 2.0,
  ...props
}: BorderBeamProps & { children?: React.ReactNode }) {
  const mounted = useMounted();

  if (!mounted) {
    return <div className={`relative rounded-[inherit] ${className}`}>{children}</div>;
  }

  return (
    <BaseBorderBeam
      colorVariant={colorVariant}
      size={size}
      strength={strength}
      active={active}
      theme={theme}
      borderRadius={borderRadius}
      className={className}
      duration={duration}
      {...props}
    >
      {children}
    </BaseBorderBeam>
  );
}

// ThinkingOrb semantic wrapper for Ezer local AI
export function AppThinkingOrb({
  ezerState,
  state,
  size = 64,
  theme = 'light',
  scale = 1.0,
  dots = 2.0,
  dotSize = 0.85,
  className = '',
}: {
  ezerState?: 'idle' | 'planning' | 'working' | 'waiting' | 'complete' | 'solving';
  state?: 'working' | 'searching' | 'solving' | 'listening' | 'connecting' | 'weaving' | 'composing' | 'breathing' | 'shaping';
  size?: 64 | 32 | 20;
  theme?: 'dark' | 'light' | 'auto';
  scale?: number;
  dots?: number;
  dotSize?: number;
  className?: string;
}) {
  const mounted = useMounted();

  // Map Ezer cognitive states to ThinkingOrb state animations
  const orbStateMap: Record<string, 'breathing' | 'solving' | 'working' | 'listening' | 'connecting'> = {
    idle: 'breathing',
    planning: 'solving',
    solving: 'solving',
    working: 'working',
    waiting: 'listening',
    complete: 'connecting',
  };

  const activeOrbState = state || (ezerState ? orbStateMap[ezerState] : 'solving') || 'solving';

  if (!mounted) {
    return (
      <div
        style={{ width: size * scale, height: size * scale }}
        className={`rounded-full bg-[#0D1117] border border-[#178BFF]/40 flex items-center justify-center ${className}`}
      >
        <span className="w-3 h-3 rounded-full bg-[#178BFF] animate-pulse" />
      </div>
    );
  }

  return (
    <div
      style={scale !== 1 ? { transform: `scale(${scale})`, transformOrigin: 'center' } : undefined}
      className={`relative flex items-center justify-center select-none ${className}`}
    >
      <DynamicThinkingOrb
        state={activeOrbState}
        size={size}
        theme={theme}
        dots={dots}
        dotSize={dotSize}
      />
    </div>
  );
}

// VoiceBeam wrapper for Ezer voice listening phase from Libraries.dev
export function AppVoiceBeam({
  children,
  className = '',
  level = 0,
  palette,
  colorVariant = 'ocean',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  level?: number;
  palette?: string[];
  colorVariant?: string;
  [key: string]: any;
}) {
  const mounted = useMounted();
  const [VoiceBeamComp, setVoiceBeamComp] = useState<any>(null);

  useEffect(() => {
    let active = true;
    import('voice-glow')
      .then((m) => {
        if (active) setVoiceBeamComp(() => m.VoiceBeam);
      })
      .catch((err) => {
        console.warn('VoiceBeam load warning:', err);
      });
    return () => {
      active = false;
    };
  }, []);

  const activeLevel = typeof level === 'number' ? level : 0;

  if (!mounted || !VoiceBeamComp) {
    return (
      <div className={`relative ${className}`}>
        {/* Soft fallback wave glow during SSR / client loading */}
        {activeLevel > 0.05 && (
          <div
            className="absolute -inset-3 rounded-full pointer-events-none blur-xl transition-opacity duration-150"
            style={{
              background:
                'radial-gradient(ellipse at 50% 100%, rgba(0, 240, 255, 0.45), rgba(23, 139, 255, 0.25) 55%, transparent 75%)',
              opacity: Math.min(1, activeLevel * 1.5),
            }}
          />
        )}
        {children}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <VoiceBeamComp
        colorVariant={colorVariant}
        palette={palette || ['#00F0FF', '#178BFF', '#38BDF8', '#0284C7']}
        level={level}
        type="pill"
        theme="dark"
        coreLight={0}
        reach={1.4}
        spread={1.15}
        bloomHeight={1.6}
        {...props}
      >
        {children}
      </VoiceBeamComp>
    </div>
  );
}

// Re-export BorderBeam from Libraries.dev
export { DynamicBorderBeam as BorderBeam };

// Backwards compatibility alias
export const AppVoiceGlow = AppVoiceBeam;

// MetalFx machined aerospace monogram badge
export function AppMetalBadge({
  text = 'YH',
  theme = 'light',
  scale = 1.0,
  className = '',
}: {
  text?: string;
  theme?: 'dark' | 'light' | 'auto';
  scale?: number;
  className?: string;
}) {
  const mounted = useMounted();

  if (!mounted) {
    return (
      <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold text-[#17202A] bg-[#EEF2F6] border border-[#D0D7DE] ${className}`}>
        {text}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <DynamicMetalBadge
        theme={theme}
        strength={0.85}
        scale={scale}
      >
        {text}
      </DynamicMetalBadge>
    </div>
  );
}

// LiquidGooey fluid container for morphing pills
export function AppLiquidGooey({
  children,
  blur = 6,
  contrast = 18,
  className = '',
}: {
  children: React.ReactNode;
  blur?: number;
  contrast?: number;
  className?: string;
}) {
  const mounted = useMounted();

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      <DynamicLiquid blur={blur} contrast={contrast} fill="rgba(23, 139, 255, 0.15)">
        {children}
      </DynamicLiquid>
    </div>
  );
}
