import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ExternalLink, User, Wrench, Shield } from 'lucide-react';
import { PROJECTS } from '@/lib/portfolio-data';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/footer/Footer';
import { LauncherVisual } from '@/components/projects/LauncherVisual';
import { UniRateVisual } from '@/components/projects/UniRateVisual';
import { DualSenseVisual } from '@/components/projects/DualSenseVisual';
import { EzerVisual } from '@/components/projects/EzerVisual';
import { ScrollProgressBar, ScrollAmbientLight } from '@/components/motion/Reveal';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.title} — Youssef Hanna Engineering Portfolio`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} — Case Study | Youssef Hanna`,
      description: project.shortDescription,
      type: 'article',
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const projectIndex = PROJECTS.findIndex((p) => p.slug === slug);
  if (projectIndex === -1) notFound();

  const project = PROJECTS[projectIndex];
  const prevProject = projectIndex > 0 ? PROJECTS[projectIndex - 1] : PROJECTS[PROJECTS.length - 1];
  const nextProject = projectIndex < PROJECTS.length - 1 ? PROJECTS[projectIndex + 1] : PROJECTS[0];

  return (
    <>
      <ScrollProgressBar />
      <ScrollAmbientLight />
      <Navbar />

      <main className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        {/* Return to Portfolio Link */}
        <div className="mb-8">
          <Link
            href="/#projects"
            className="glass-pill px-3.5 py-1.5 rounded-full inline-flex items-center gap-2 text-xs font-mono text-[#647184] hover:text-[#0864C7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178BFF]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO SELECTED WORK</span>
          </Link>
        </div>

        {/* Project Header */}
        <header className="border-b border-black/10 pb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#647184] mb-3">
            <span className="glass-pill px-3 py-1 rounded-full text-[#0864C7] font-semibold">
              {project.category}
            </span>
            <span className="text-black/20">·</span>
            <span>{project.type}</span>
            <span className="text-black/20">·</span>
            <span>{project.year}</span>
            {project.isInDevelopment && (
              <>
                <span className="text-black/20">·</span>
                <span className="text-[#D97706] font-bold">IN ACTIVE DEVELOPMENT</span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17202A]">
            {project.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#4B596A] leading-relaxed max-w-3xl">
            {project.longDescription}
          </p>

          {/* Quick Meta Rail */}
          <div className="mt-6 flex flex-wrap items-center gap-3 pt-6 border-t border-black/5 text-xs font-mono text-[#647184]">
            <div className="glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-2 text-[#17202A]">
              <User className="w-3.5 h-3.5 text-[#178BFF]" />
              <span>{project.role}</span>
            </div>
            {project.hardware && (
              <div className="glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-2 text-[#17202A]">
                <Wrench className="w-3.5 h-3.5 text-[#178BFF]" />
                <span>{project.hardware}</span>
              </div>
            )}
            <div className="glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-2 text-[#0864C7] font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>{project.status}</span>
            </div>
          </div>

          {/* External Links */}
          {project.slug === 'unirate' && (
            <div className="mt-5 flex flex-wrap gap-3 font-mono text-xs">
              <a
                href="https://chromewebstore.google.com/detail/unirate/eeehacjdlohcgmhghnihgbgfmkbopcho"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#178BFF] text-white font-bold inline-flex items-center gap-1.5 shadow-xs hover:bg-[#0864C7] transition-colors"
              >
                <span>Install on Chrome Web Store</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </header>

        {/* Verified Metrics Banner */}
        <section className="my-8" aria-label="Key Performance Indicators">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#647184] mb-3 font-semibold">
            VERIFIED PROJECT METRICS
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="glass-card-solid p-4 rounded-2xl shadow-xs"
              >
                <div className="text-[10px] font-mono text-[#647184] uppercase font-medium">{m.label}</div>
                <div className={`text-xl sm:text-2xl font-extrabold font-mono mt-1 ${m.highlight ? 'text-[#0864C7]' : 'text-[#17202A]'}`}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dedicated Interactive Visualization Demo */}
        <section className="my-10" aria-label="Technical Visualization">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#647184] mb-3 flex items-center justify-between font-semibold">
            <span>TECHNICAL SPECIFICATION & INTERACTIVE DEMO</span>
            <span className="text-[#0864C7]">SYSTEM SIMULATION</span>
          </div>

          {project.slug === 'launcher' && <LauncherVisual />}
          {project.slug === 'unirate' && <UniRateVisual />}
          {project.slug === 'dualsense' && <DualSenseVisual />}
          {project.slug === 'ezer' && <EzerVisual />}
        </section>

        {/* 10-Step Structured Engineering Case Study Narrative */}
        <section className="my-16" aria-label="Detailed Case Study Narrative">
          <div className="border-b border-black/10 pb-4 mb-8">
            <span className="text-xs font-mono text-[#0864C7] font-semibold uppercase tracking-wider block">
              ENGINEERING ANALYSIS
            </span>
            <h2 className="text-2xl font-bold text-[#17202A] mt-1">
              Design, Failure Recovery & Testing Lifecycle
            </h2>
          </div>

          <div className="space-y-10">
            {project.sections.map((sec) => (
              <article
                key={sec.number}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-8 border-b border-black/5"
              >
                <div className="md:col-span-3">
                  <div className="flex items-center gap-2 font-mono text-sm font-bold text-[#0864C7]">
                    <span>{sec.number}</span>
                    <span className="text-black/20">—</span>
                    <span className="text-[#17202A] uppercase tracking-wider text-xs">
                      {sec.title}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-9">
                  <p className="text-sm sm:text-base text-[#4B596A] leading-relaxed">
                    {sec.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Technologies Applied */}
        <section className="my-12 p-6 rounded-2xl glass-panel">
          <div className="text-xs font-mono text-[#647184] uppercase tracking-wider mb-4 font-semibold">
            TOOLS, HARDWARE & APPLIED DISCIPLINES
          </div>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-3.5 py-1.5 rounded-full glass-card-solid text-[#17202A] font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Previous / Next Project Navigation Rail */}
        <nav
          className="mt-16 pt-8 border-t border-black/10 grid grid-cols-1 sm:grid-cols-2 gap-4"
          aria-label="Other Projects Navigation"
        >
          <Link
            href={`/projects/${prevProject.slug}`}
            className="glass-panel p-5 rounded-2xl hover:border-[#178BFF]/40 transition-all group shadow-xs"
          >
            <div className="text-[10px] font-mono text-[#647184] flex items-center gap-1.5 group-hover:text-[#0864C7] transition-colors font-medium">
              <ArrowLeft className="w-3 h-3" />
              <span>PREVIOUS PROJECT</span>
            </div>
            <div className="text-base font-bold text-[#17202A] mt-1">
              {prevProject.title}
            </div>
            <div className="text-xs text-[#647184] mt-0.5 line-clamp-1">
              {prevProject.shortDescription}
            </div>
          </Link>

          <Link
            href={`/projects/${nextProject.slug}`}
            className="glass-panel p-5 rounded-2xl hover:border-[#178BFF]/40 transition-all group sm:text-right shadow-xs"
          >
            <div className="text-[10px] font-mono text-[#647184] flex items-center justify-end gap-1.5 group-hover:text-[#0864C7] transition-colors font-medium">
              <span>NEXT PROJECT</span>
              <ArrowRight className="w-3 h-3" />
            </div>
            <div className="text-base font-bold text-[#17202A] mt-1">
              {nextProject.title}
            </div>
            <div className="text-xs text-[#647184] mt-0.5 line-clamp-1">
              {nextProject.shortDescription}
            </div>
          </Link>
        </nav>
      </main>

      <Footer />
    </>
  );
}
