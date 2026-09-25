import React from 'react';
import { Navbar } from '@/components/nav/Navbar';
import { HeroSection } from '@/components/hero/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { PhilosophySection } from '@/components/sections/PhilosophySection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ContactSection } from '@/components/contact/ContactSection';
import { Footer } from '@/components/footer/Footer';
import { ScrollProgressBar, ScrollAmbientLight } from '@/components/motion/Reveal';

export default function HomePage() {
  return (
    <>
      {/* Scroll Progress Bar at the top of the viewport */}
      <ScrollProgressBar />

      {/* Ambient background illumination linked to scroll */}
      <ScrollAmbientLight />

      {/* Floating Liquid-Glass Navigation Capsule */}
      <Navbar />

      <main className="min-h-screen">
        {/* 01: Hero Section */}
        <HeroSection />

        {/* 02: Selected Engineering Work & Interactive System Visualizers */}
        <ProjectsSection />

        {/* 04: Engineering Philosophy: Design → Build → Test → Iterate */}
        <PhilosophySection />

        {/* 05: About Youssef & Education */}
        <AboutSection />

        {/* 06: Technical Proficiencies & Applied Skills */}
        <SkillsSection />

        {/* 07: Leadership Story & Experience */}
        <ExperienceSection />

        {/* 08: Direct Recruiter Contact Dock */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ContactSection />
        </div>
      </main>

      <Footer />
    </>
  );
}
