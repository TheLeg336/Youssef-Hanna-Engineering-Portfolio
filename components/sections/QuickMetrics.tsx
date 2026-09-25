'use client';

import React from 'react';
import { Reveal } from '@/components/motion/Reveal';

export function QuickMetrics() {
  const metrics = [
    { value: '3.74', label: 'Cumulative GPA', sublabel: 'Scale of 4.00 · Cal Poly Pomona' },
    { value: '~15', label: 'Team Members Led', sublabel: 'Class competition winner' },
    { value: '~300 ft', label: 'Launcher Range', sublabel: '3× original 100 ft baseline' },
    { value: '4', label: 'Featured Systems', sublabel: 'Mechanical, Embedded & Software' },
    { value: 'May ’28', label: 'Graduation Date', sublabel: 'B.S. Mechanical Engineering' },
  ];

  return (
    <section className="my-10 sm:my-14" aria-label="Quick Engineering Metrics">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal variant="standard">
          <div className="glass-panel p-5 sm:p-7 rounded-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6 text-left">
              {metrics.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#17202A] tracking-tight">
                    {item.value}
                  </div>
                  <div className="text-xs font-bold text-[#0864C7] font-mono">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-[#647184] line-clamp-1">
                    {item.sublabel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
export default QuickMetrics;
