'use client';

import { useState, useEffect, RefObject } from 'react';

/**
 * Tracks element visibility in viewport using IntersectionObserver.
 * Accurately detects when the component enters or leaves the visible viewport.
 */
export function useElementVisibility(
  ref: RefObject<HTMLElement | null>,
  threshold: number = 0.15
): boolean {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return true;
    }
    return false;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin: '50px 0px 50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold]);

  return isVisible;
}
