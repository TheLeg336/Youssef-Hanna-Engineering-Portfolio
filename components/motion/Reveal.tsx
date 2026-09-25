'use client';

import React, { useSyncExternalStore } from 'react';
import { motion, useScroll, useTransform, HTMLMotionProps } from 'motion/react';

function subscribeReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

type RevealVariant = 'standard' | 'heading' | 'visual' | 'staggerGroup';

interface RevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  amount?: number;
}

export function Reveal({
  children,
  variant = 'standard',
  delay = 0,
  className = '',
  amount = 0.2,
  ...rest
}: RevealProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    standard: {
      hidden: { opacity: 0, y: 18 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1] as const,
          delay,
        },
      },
    },
    heading: {
      hidden: { opacity: 0, y: 24 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1] as const,
          delay,
        },
      },
    },
    visual: {
      hidden: { opacity: 0, scale: 0.985, y: 14 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1] as const,
          delay,
        },
      },
    },
    staggerGroup: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.08,
          delayChildren: delay,
        },
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants[variant]}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// Page Scroll Progress Indicator (thin blue line at top)
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#178BFF] via-[#0864C7] to-[#0284C7] z-[60] origin-left pointer-events-none"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

// Scroll-linked environmental ambient light (light theme)
export function ScrollAmbientLight() {
  const { scrollYProgress } = useScroll();
  const prefersReduced = useReducedMotion();

  const yPos = useTransform(scrollYProgress, [0, 1], ['15%', '85%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.28, 0.18]);

  if (prefersReduced) return null;

  return (
    <motion.div
      className="fixed pointer-events-none -z-10 w-[600px] h-[600px] rounded-full blur-[140px]"
      style={{
        top: yPos,
        right: '8%',
        opacity,
        background: 'radial-gradient(circle, rgba(23, 139, 255, 0.08) 0%, rgba(8, 100, 199, 0.03) 50%, transparent 80%)',
      }}
    />
  );
}
