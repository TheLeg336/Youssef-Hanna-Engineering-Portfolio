'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, Filter } from 'lucide-react';
import { useElementVisibility } from '@/lib/useVisibility';
import { useReducedMotion } from '@/components/motion/Reveal';

export interface MockCourse {
  id: string;
  code: string;
  title: string;
  section: string;
  professor: string;
  seats: string;
  rating: number;
  difficulty: number;
  wouldTakeAgain: number;
  reviewsCount: number;
  tags: string[];
  review: {
    course: string;
    date: string;
    text: string;
  };
}

const COURSES: MockCourse[] = [
  {
    id: 'c1',
    code: 'ME 3110',
    title: 'Fluid Mechanics',
    section: '01',
    professor: 'Dr. A. Reynolds',
    seats: '4 / 32 Open',
    rating: 4.8,
    difficulty: 2.3,
    wouldTakeAgain: 95,
    reviewsCount: 42,
    tags: ['Clear Grading', 'Engaging Lectures', 'Accessible Office Hours'],
    review: {
      course: 'ME 3110',
      date: 'Fall 2024',
      text: 'Explains Navier-Stokes and boundary layer physics clearly. Tough midterms, but the grading rubric is completely fair and transparent.',
    },
  },
  {
    id: 'c2',
    code: 'ME 2140',
    title: 'Vector Statics',
    section: '03',
    professor: 'Dr. M. Chen',
    seats: '1 / 28 Open',
    rating: 4.6,
    difficulty: 2.5,
    wouldTakeAgain: 91,
    reviewsCount: 38,
    tags: ['Hands-on Trusses', 'Helpful Diagrams', 'Patient Instructor'],
    review: {
      course: 'ME 2140',
      date: 'Spring 2025',
      text: 'Makes 3D equilibrium and truss load paths intuitive. Excellent bridge between mathematics and real physical structures.',
    },
  },
  {
    id: 'c3',
    code: 'ME 3150',
    title: 'Engineering Thermodynamics',
    section: '02',
    professor: 'Dr. K. Vance',
    seats: '0 / 30 Waitlist',
    rating: 3.8,
    difficulty: 4.1,
    wouldTakeAgain: 68,
    reviewsCount: 51,
    tags: ['Heavy Homework', 'Rigorous Proofs', 'Study Groups Recommended'],
    review: {
      course: 'ME 3150',
      date: 'Fall 2024',
      text: 'Very thorough Rankine and refrigeration cycle analysis. Fast-paced lectures, but you will truly master thermodynamic property tables.',
    },
  },
];

interface PopoverAnchor {
  top?: number;
  bottom?: number;
  left: number;
  placement: 'above' | 'below';
  triangleOffset: number;
  course: MockCourse;
}

interface UniRateVisualProps {
  layoutPrefix?: string;
}

export function UniRateVisual({ layoutPrefix = 'unirate' }: UniRateVisualProps = {}) {
  const [minRating, setMinRating] = useState<number>(0);
  const [activeCourse, setActiveCourse] = useState<MockCourse | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<PopoverAnchor | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [userTakeover, setUserTakeover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Simulated cursor state & micro-interactions
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 380, y: 220 });
  const [isSimulatedClicking, setIsSimulatedClicking] = useState(false);
  const [simulatedHoverCourseId, setSimulatedHoverCourseId] = useState<string | null>(null);
  const [simulatedHoverMetric, setSimulatedHoverMetric] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const ratingBtnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isVisible = useElementVisibility(containerRef, 0.3);
  const prefersReduced = useReducedMotion();

  // Elapsed timeline counter in milliseconds for RAF ticker
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const isUserHoveringCard = useRef(false);
  const isMobileRef = useRef(false);

  // Detect mobile / touch environment
  useEffect(() => {
    const checkMobile = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const mobile = window.innerWidth < 768 || isTouch;
      setIsMobile(mobile);
      isMobileRef.current = mobile;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keyboard accessibility: Escape closes popover
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCourse(null);
        setPopoverAnchor(null);
        setIsPinned(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Desktop user takeover: stops the simulation while hovering inside the card
  const handleDesktopPointerEnter = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && !isMobileRef.current) {
      isUserHoveringCard.current = true;
      setUserTakeover(true);
      setCursorVisible(false);
      setIsSimulatedClicking(false);
      setSimulatedHoverCourseId(null);
      setSimulatedHoverMetric(null);
    }
  }, []);

  // Desktop user mouse leaves: immediately resets the demo from the start with zero delay!
  const handleDesktopPointerLeave = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && !isMobileRef.current) {
      isUserHoveringCard.current = false;
      setUserTakeover(false);
      elapsedRef.current = 0;
      setActiveCourse(null);
      setPopoverAnchor(null);
      setIsPinned(false);
      setIsSimulatedClicking(false);
      setSimulatedHoverCourseId(null);
      setSimulatedHoverMetric(null);
      setCursorVisible(false);
      lastTimeRef.current = performance.now();
    }
  }, []);

  // Position calculation: anchors popover relative to containerRef
  const calculateAnchor = useCallback((course: MockCourse, btnEl: HTMLElement | null): PopoverAnchor | null => {
    const container = containerRef.current;
    if (!container || !btnEl) return null;

    const cRect = container.getBoundingClientRect();
    const bRect = btnEl.getBoundingClientRect();

    const relTop = bRect.top - cRect.top;
    const relLeft = bRect.left - cRect.left;
    const btnCenter = relLeft + bRect.width / 2;

    const placeBelow = relTop < 290;
    const top = placeBelow ? relTop + bRect.height + 10 : undefined;
    const bottom = placeBelow ? undefined : cRect.height - relTop + 10;

    const maxAvailableWidth = Math.max(260, cRect.width - 24);
    const popoverWidth = Math.min(340, maxAvailableWidth);
    let left = btnCenter - 60;
    if (left + popoverWidth > cRect.width - 12) {
      left = cRect.width - popoverWidth - 12;
    }
    if (left < 12) {
      left = 12;
    }

    const triangleOffset = Math.max(16, Math.min(popoverWidth - 24, btnCenter - left));

    return {
      top,
      bottom,
      left,
      placement: placeBelow ? 'below' : 'above',
      triangleOffset,
      course,
    };
  }, []);

  // Continuous RAF timeline ticker:
  // - Pauses when scrolled out of view, resumes from exact same millisecond without reset!
  // - Pauses when desktop user is interacting inside the card
  // - Resets and restarts immediately as soon as desktop mouse leaves!
  // - Non-interruptible on mobile and tablet!
  useEffect(() => {
    if (prefersReduced) return;

    if (!isVisible) {
      lastTimeRef.current = null;
      return;
    }

    lastTimeRef.current = performance.now();
    let animId: number;
    const TOTAL_CYCLE = 9600;

    const tick = (now: number) => {
      if (lastTimeRef.current !== null) {
        const delta = Math.min(100, now - lastTimeRef.current);
        elapsedRef.current = (elapsedRef.current + delta) % TOTAL_CYCLE;
        const t = elapsedRef.current;

        const container = containerRef.current;
        const btn = ratingBtnRef.current;

        if (container && btn) {
          const cRect = container.getBoundingClientRect();
          const bRect = btn.getBoundingClientRect();
          const targetX = bRect.left - cRect.left + bRect.width / 2;
          const targetY = bRect.top - cRect.top + bRect.height / 2;
          const startX = Math.min(targetX + 130, cRect.width - 45);
          const startY = targetY + 95;

          // Step 0: Quick fade in with no delay
          if (t < 150) {
            setCursorVisible(false);
            setCursorPos({ x: startX, y: startY });
            setIsSimulatedClicking(false);
            setSimulatedHoverCourseId(null);
          } else if (t >= 150 && t < 450) {
            setCursorVisible(true);
            setCursorPos({ x: startX, y: startY });
          } else if (t >= 450 && t < 1500) {
            // Step 1: Smooth arc towards the rating badge
            setCursorVisible(true);
            setCursorPos({ x: targetX, y: targetY });
          } else if (t >= 1500 && t < 1800) {
            // Step 2: Hover activates badge
            setSimulatedHoverCourseId('c1');
          } else if (t >= 1800 && t < 2050) {
            // Step 3: Click down
            setIsSimulatedClicking(true);
          } else if (t >= 2050 && t < 2900) {
            // Step 4: Click release & popover pops open
            setIsSimulatedClicking(false);
            if (!isPinned) {
              const anchor = calculateAnchor(COURSES[0], btn);
              setActiveCourse(COURSES[0]);
              if (anchor) setPopoverAnchor(anchor);
            }
          } else if (t >= 2900 && t < 4000) {
            // Step 5: Cursor glides into popover towards Quality metric
            const anchor = calculateAnchor(COURSES[0], btn);
            const qX = anchor ? anchor.left + 55 : targetX + 10;
            const qY = anchor && anchor.top !== undefined ? anchor.top + 75 : targetY + 75;
            setCursorPos({ x: qX, y: qY });
            setSimulatedHoverMetric('quality');
          } else if (t >= 4000 && t < 5100) {
            // Step 6: Cursor slides across to Difficulty & Take Again
            const anchor = calculateAnchor(COURSES[0], btn);
            const dX = anchor ? anchor.left + 230 : targetX + 80;
            const dY = anchor && anchor.top !== undefined ? anchor.top + 75 : targetY + 75;
            setCursorPos({ x: dX, y: dY });
            setSimulatedHoverMetric('stats');
          } else if (t >= 5100 && t < 6200) {
            // Step 7: Cursor drifts down to inspect student tags
            const anchor = calculateAnchor(COURSES[0], btn);
            const tagX = anchor ? anchor.left + 80 : targetX + 30;
            const tagY = anchor && anchor.top !== undefined ? anchor.top + 130 : targetY + 120;
            setCursorPos({ x: tagX, y: tagY });
            setSimulatedHoverMetric('tags');
          } else if (t >= 6200 && t < 7400) {
            // Step 8: Cursor reads student review text
            const anchor = calculateAnchor(COURSES[0], btn);
            const revX = anchor ? anchor.left + 140 : targetX + 50;
            const revY = anchor && anchor.top !== undefined ? anchor.top + 185 : targetY + 160;
            setCursorPos({ x: revX, y: revY });
            setSimulatedHoverMetric('review');
          } else if (t >= 7400 && t < 8000) {
            // Step 9: Cursor glides away
            setSimulatedHoverMetric(null);
            setSimulatedHoverCourseId(null);
            setCursorPos({ x: startX + 40, y: startY + 30 });
          } else if (t >= 8000 && t < 8500) {
            // Step 10: Popover gently closes if not pinned by real user
            if (!isPinned && !isUserHoveringCard.current) {
              setActiveCourse(null);
              setPopoverAnchor(null);
            }
          } else if (t >= 8500) {
            // Step 11: Cursor fades out
            setCursorVisible(false);
          }
        }
      }
      lastTimeRef.current = now;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isVisible, prefersReduced, isPinned, calculateAnchor]);

  // Real user hover handlers
  const handleMouseEnterRating = (course: MockCourse, btnEl: HTMLButtonElement) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    const anchor = calculateAnchor(course, btnEl);
    setActiveCourse(course);
    if (anchor) setPopoverAnchor(anchor);
  };

  const handleMouseLeaveRating = () => {
    if (isPinned) return;
    closeTimerRef.current = setTimeout(() => {
      setActiveCourse(null);
      setPopoverAnchor(null);
    }, 240);
  };

  const handlePopoverMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handlePopoverMouseLeave = () => {
    if (isPinned) return;
    closeTimerRef.current = setTimeout(() => {
      setActiveCourse(null);
      setPopoverAnchor(null);
    }, 240);
  };

  const handleClickToggle = (course: MockCourse, btnEl: HTMLButtonElement) => {
    if (activeCourse?.id === course.id && isPinned) {
      setIsPinned(false);
      setActiveCourse(null);
      setPopoverAnchor(null);
    } else {
      const anchor = calculateAnchor(course, btnEl);
      setActiveCourse(course);
      if (anchor) setPopoverAnchor(anchor);
      setIsPinned(true);
    }
  };

  const handleClose = () => {
    setActiveCourse(null);
    setPopoverAnchor(null);
    setIsPinned(false);
  };

  return (
    <div
      ref={containerRef}
      className="w-full glass-panel rounded-2xl p-6 sm:p-7 md:p-8 relative select-none min-h-[480px] overflow-visible"
    >
      {/* Refined Simulated Desktop/Mobile Cursor Overlay with Accurate Orientation & Click Ripple */}
      {!prefersReduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute z-70 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] select-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: cursorVisible ? 1 : 0,
            x: cursorPos.x - 3,
            y: cursorPos.y - 2,
            scale: isSimulatedClicking ? 0.86 : 1,
          }}
          style={{
            transformOrigin: '3px 2px',
          }}
          transition={{
            opacity: { duration: 0.22 },
            x: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
            y: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 0.12 },
          }}
        >
          {/* Click Ripple Wave at the pointer tip */}
          {isSimulatedClicking && (
            <motion.span
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full border-2 border-[#178BFF] pointer-events-none"
            />
          )}

          {/* Authentic Standard OS Mouse Pointer Arrow (Tip at (3, 2), points up-left) */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="overflow-visible"
          >
            <path
              d="M3 2V18.5L7.5 14L11.5 21.5L13.8 20.2L9.8 13H15.5L3 2Z"
              fill="#111827"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}

      {/* Top Header: Factual metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-3.5 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#0864C7] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#178BFF]" />
              Chrome Extension · DOM Injection
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#17202A] mt-0.5">
            Registration Portal Injected Cards
          </h3>
        </div>

        <span className="px-2.5 py-1 rounded-md bg-[#EEF2F6] text-[10px] font-mono text-[#647184] font-semibold border border-[#CBD5E1]/60 self-start sm:self-auto">
          Representative Demo · Sample Professor Data
        </span>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-[#647184] text-xs mr-1 flex items-center gap-1 font-semibold">
            <Filter className="w-3.5 h-3.5 text-[#178BFF]" /> Min Rating:
          </span>
          {[0, 3.5, 4.0, 4.5].map((val) => {
            const isSelected = minRating === val;
            const label = val === 0 ? 'All' : `${val.toFixed(1)}+`;

            return (
              <button
                key={val}
                type="button"
                onClick={() => {
                  setMinRating(val);
                }}
                className={`relative px-3 py-1 rounded-lg text-xs font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] ${
                  isSelected
                    ? 'text-white font-bold'
                    : 'text-[#4B596A] hover:text-[#17202A] hover:bg-black/5'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId={`${layoutPrefix}-filter-pill-unirate`}
                    className="absolute inset-0 bg-[#178BFF] rounded-lg shadow-xs"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-[#647184] hidden sm:inline">
          Portal: BroncoDirect Registration
        </span>
      </div>

      {/* Course Registration Table with suppressHydrationWarning for browser extensions */}
      <div
        suppressHydrationWarning
        className="w-full overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-xs"
      >
        <table
          suppressHydrationWarning
          className="w-full text-left text-xs sm:text-sm font-mono border-collapse min-w-[540px]"
        >
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs text-[#647184] uppercase tracking-wide">
              <th className="py-3 px-4 font-semibold">Course</th>
              <th className="py-3 px-4 font-semibold">Title</th>
              <th className="py-3 px-4 font-semibold">Instructor</th>
              <th className="py-3 px-4 font-semibold">Injected Rating</th>
              <th className="py-3 px-4 font-semibold">Seats</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {COURSES.map((course, idx) => {
              const isDimmed = minRating > 0 && course.rating < minRating;
              const isSelected = activeCourse?.id === course.id;
              const isSimHover = simulatedHoverCourseId === course.id;

              return (
                <tr
                  key={course.id}
                  className={`transition-all duration-200 ${
                    isDimmed ? 'opacity-35 bg-[#F8FAFC]' : 'hover:bg-[#F8FAFC]'
                  } ${isSelected ? 'bg-[#F0F7FF]' : ''}`}
                >
                  <td className="py-3.5 px-4 font-semibold text-[#17202A]">
                    {course.code}
                    <span className="text-[11px] text-[#647184] block font-normal">
                      Sec {course.section}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-[#334155] font-sans font-medium">
                    {course.title}
                  </td>

                  <td className="py-3.5 px-4 text-[#17202A] font-sans">
                    {course.professor}
                  </td>

                  {/* Rating Trigger Badge */}
                  <td className="py-3.5 px-4">
                    <button
                      ref={idx === 0 ? ratingBtnRef : null}
                      type="button"
                      onClick={(e) => handleClickToggle(course, e.currentTarget)}
                      onMouseEnter={(e) => handleMouseEnterRating(course, e.currentTarget)}
                      onMouseLeave={handleMouseLeaveRating}
                      onFocus={(e) => handleMouseEnterRating(course, e.currentTarget)}
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-[13px] font-bold inline-flex items-center gap-1.5 transition-all shadow-xs border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF] ${
                        course.rating >= 4.5
                          ? 'bg-[#EBFDF5] text-[#047857] border-[#A7F3D0] hover:bg-[#D1FAE5]'
                          : course.rating >= 4.0
                          ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE] hover:bg-[#DBEAFE]'
                          : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] hover:bg-[#FEF3C7]'
                      } ${
                        isSelected || isSimHover
                          ? 'ring-2 ring-[#178BFF] scale-105 shadow-md'
                          : ''
                      } ${isSimHover && isSimulatedClicking ? 'scale-95' : ''}`}
                      aria-expanded={isSelected}
                      aria-label={`View ratings for ${course.professor}: ${course.rating} stars`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{course.rating.toFixed(1)}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs font-mono ${
                        course.seats.includes('Open')
                          ? 'text-[#059669] font-semibold'
                          : 'text-[#D97706]'
                      }`}
                    >
                      {course.seats}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ANCHORED FLOATING POPOVER (UNIFIED FOR ALL BREAKPOINTS) */}
      <AnimatePresence>
        {activeCourse && popoverAnchor && (
          <motion.div
            ref={popoverRef}
            initial={{
              opacity: 0,
              scale: 0.95,
              y: popoverAnchor.placement === 'below' ? -6 : 6,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: popoverAnchor.placement === 'below' ? -4 : 4,
            }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={handlePopoverMouseEnter}
            onMouseLeave={handlePopoverMouseLeave}
            style={{
              position: 'absolute',
              top: popoverAnchor.top,
              bottom: popoverAnchor.bottom,
              left: popoverAnchor.left,
              width: 340,
              maxWidth: 'calc(100% - 24px)',
              boxSizing: 'border-box',
              zIndex: 60,
            }}
            className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-[#CBD5E1] text-[#17202A] font-sans"
          >
            {/* Popover Pointer Triangle */}
            {popoverAnchor.placement === 'below' ? (
              <div
                style={{ left: popoverAnchor.triangleOffset }}
                className="absolute -top-1.5 w-3 h-3 bg-white border-t border-l border-[#CBD5E1] transform rotate-45 pointer-events-none"
              />
            ) : (
              <div
                style={{ left: popoverAnchor.triangleOffset }}
                className="absolute -bottom-1.5 w-3 h-3 bg-white border-b border-r border-[#CBD5E1] transform rotate-45 pointer-events-none"
              />
            )}

            {/* Header & Professor Name */}
            <div className="flex items-start justify-between border-b border-black/5 pb-2.5 mb-3">
              <div>
                <div className="text-[10px] font-mono text-[#0864C7] uppercase font-bold tracking-wider">
                  Rate My Professors · In-Portal Card
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#17202A] leading-tight">
                  {activeCourse.professor}
                </h4>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-1 rounded-full text-[#94A3B8] hover:text-[#17202A] hover:bg-black/5 cursor-pointer"
                aria-label="Close popover"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stats Grid with dynamic simulated hover highlights */}
            <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0] text-center mb-3">
              <div
                className={`py-1 rounded-lg transition-all ${
                  simulatedHoverMetric === 'quality'
                    ? 'bg-[#EBF5FF] ring-1.5 ring-[#178BFF] shadow-xs'
                    : ''
                }`}
              >
                <div className="text-lg font-black text-[#0864C7] font-mono">
                  {activeCourse.rating.toFixed(1)}
                </div>
                <div className="text-[10px] text-[#647184] uppercase font-mono">
                  Quality
                </div>
              </div>

              <div
                className={`border-x border-[#E2E8F0] py-1 rounded-lg transition-all ${
                  simulatedHoverMetric === 'stats'
                    ? 'bg-[#EBF5FF] ring-1.5 ring-[#178BFF] shadow-xs'
                    : ''
                }`}
              >
                <div className="text-lg font-black text-[#17202A] font-mono">
                  {activeCourse.difficulty.toFixed(1)}
                </div>
                <div className="text-[10px] text-[#647184] uppercase font-mono">
                  Difficulty
                </div>
              </div>

              <div
                className={`py-1 rounded-lg transition-all ${
                  simulatedHoverMetric === 'stats'
                    ? 'bg-[#EBF5FF] ring-1.5 ring-[#178BFF] shadow-xs'
                    : ''
                }`}
              >
                <div className="text-lg font-black text-[#059669] font-mono">
                  {activeCourse.wouldTakeAgain}%
                </div>
                <div className="text-[10px] text-[#647184] uppercase font-mono">
                  Take Again
                </div>
              </div>
            </div>

            {/* Top Student Tags */}
            <div className="mb-3">
              <div className="text-[10px] font-mono text-[#647184] uppercase mb-1.5 font-semibold">
                Top Student Tags:
              </div>
              <div className="flex flex-wrap gap-1">
                {activeCourse.tags.map((t, idx) => (
                  <span
                    key={t}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all ${
                      simulatedHoverMetric === 'tags' && idx === 0
                        ? 'bg-[#178BFF] text-white shadow-xs'
                        : 'bg-[#EEF2F6] text-[#475569]'
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Representative Student Feedback */}
            <div
              className={`border-t border-black/5 pt-2.5 text-xs text-[#334155] rounded-lg transition-all ${
                simulatedHoverMetric === 'review' ? 'bg-[#F0F7FF] p-2' : ''
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#647184] mb-1">
                <span>Review for {activeCourse.review.course}</span>
                <span>{activeCourse.review.date}</span>
              </div>
              <p className="italic leading-relaxed text-[#17202A]">
                &ldquo;{activeCourse.review.text}&rdquo;
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info & Verification */}
      <div className="mt-5 pt-3.5 border-t border-black/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#647184]">
        <span>Injection Architecture: Content Script + DOM Matcher</span>
        <span className="text-[#0864C7] font-semibold">Published on Chrome Web Store</span>
      </div>
    </div>
  );
}

export default UniRateVisual;
