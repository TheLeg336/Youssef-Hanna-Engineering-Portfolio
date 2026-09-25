import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Download, Mail, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO, EDUCATION_DATA, SKILLS_DATA, PROJECTS, EXPERIENCE_DATA, LEADERSHIP_DATA } from '@/lib/portfolio-data';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/footer/Footer';
import { ScrollProgressBar } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Resume — Youssef Hanna | Mechanical Engineering',
  description:
    'Engineering resume of Youssef Hanna, Junior Mechanical Engineering student at Cal Poly Pomona seeking Summer 2027 internships in aerospace and mechanical engineering.',
};

export default function ResumePage() {
  return (
    <>
      <ScrollProgressBar />
      <Navbar />

      <main className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        {/* Navigation and Download Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="glass-pill px-4 py-2 rounded-full inline-flex items-center gap-2 text-xs font-mono text-[#647184] hover:text-[#0864C7] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO PORTFOLIO</span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={PERSONAL_INFO.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#178BFF] text-white font-bold text-xs font-mono hover:bg-[#0864C7] transition-colors shadow-sm inline-flex items-center gap-2 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official PDF</span>
            </a>
          </div>
        </div>

        {/* Clean Paper-Style Engineering Resume Container */}
        <div className="glass-card-solid bg-white p-6 sm:p-10 rounded-2xl border-[#CBD5E1] text-[#17202A] shadow-lg">
          {/* Header */}
          <header className="border-b border-black/10 pb-6 mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#17202A]">
              {PERSONAL_INFO.name}
            </h1>
            <div className="text-sm font-mono text-[#0864C7] font-semibold mt-1">
              Mechanical Engineering Student · {PERSONAL_INFO.school}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#647184]">
              <span>{PERSONAL_INFO.location}</span>
              <span className="text-black/20">·</span>
              <a href={`mailto:${PERSONAL_INFO.email}`} className="text-[#0864C7] hover:underline">
                {PERSONAL_INFO.email}
              </a>
              <span className="text-black/20">·</span>
              <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#0864C7]">
                github.com/TheLeg336
              </a>
              <span className="text-black/20">·</span>
              <a href={PERSONAL_INFO.handshake} target="_blank" rel="noopener noreferrer" className="hover:text-[#0864C7]">
                Handshake Profile
              </a>
            </div>
          </header>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#0864C7] border-b border-black/10 pb-1.5 mb-3 font-bold">
              EDUCATION
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <h3 className="text-base font-bold text-[#17202A]">
                  {EDUCATION_DATA.school}
                </h3>
                <div className="text-xs text-[#4B596A] font-mono">
                  {EDUCATION_DATA.degree}
                </div>
              </div>
              <div className="text-xs font-mono text-[#647184] sm:text-right">
                <div>Expected {EDUCATION_DATA.expectedGraduation}</div>
                <div className="text-[#0864C7] font-bold">GPA: {EDUCATION_DATA.gpa}</div>
              </div>
            </div>

            <div className="mt-2 text-xs text-[#647184]">
              <span className="font-mono text-[#17202A] font-semibold">Honors: </span>
              {EDUCATION_DATA.honors.join(', ')}
            </div>

            <div className="mt-2 text-xs text-[#647184]">
              <span className="font-mono text-[#17202A] font-semibold">Relevant Coursework: </span>
              {EDUCATION_DATA.relevantCoursework.join(', ')}
            </div>
          </section>

          {/* Featured Engineering Projects */}
          <section className="mb-8">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#0864C7] border-b border-black/10 pb-1.5 mb-3 font-bold">
              FEATURED ENGINEERING PROJECTS
            </h2>

            <div className="space-y-5">
              {PROJECTS.map((proj) => (
                <div key={proj.slug} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-sm font-bold text-[#17202A]">
                      {proj.title}
                      <span className="text-xs font-mono font-normal text-[#647184] ml-2">
                        [{proj.role}]
                      </span>
                    </h3>
                    <span className="text-xs font-mono text-[#647184]">{proj.year}</span>
                  </div>

                  <p className="text-xs text-[#4B596A] leading-relaxed">
                    {proj.shortDescription}
                  </p>

                  <div className="text-[11px] font-mono text-[#647184] pt-0.5">
                    <span className="text-[#0864C7] font-semibold">Tech: </span>
                    {proj.techStack.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Leadership */}
          <section className="mb-8">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#0864C7] border-b border-black/10 pb-1.5 mb-3 font-bold">
              ENGINEERING LEADERSHIP
            </h2>

            <div className="space-y-4">
              {LEADERSHIP_DATA.map((item) => (
                <div key={item.title} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-sm font-bold text-[#17202A]">{item.title}</h3>
                    <span className="text-xs font-mono text-[#647184]">{item.period}</span>
                  </div>
                  <div className="text-xs font-mono text-[#0864C7] font-medium">{item.subtitle}</div>
                  <p className="text-xs text-[#4B596A] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Work Experience */}
          <section className="mb-8">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#0864C7] border-b border-black/10 pb-1.5 mb-3 font-bold">
              WORK EXPERIENCE
            </h2>

            <div className="space-y-4">
              {EXPERIENCE_DATA.map((job) => (
                <div key={job.company} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-sm font-bold text-[#17202A]">{job.role}</h3>
                    <span className="text-xs font-mono text-[#647184]">{job.period}</span>
                  </div>
                  <div className="text-xs font-mono text-[#0864C7] font-medium">
                    {job.company} · {job.location}
                  </div>
                  <p className="text-xs text-[#4B596A] leading-relaxed">
                    {job.summary}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Skills Matrix */}
          <section>
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#0864C7] border-b border-black/10 pb-1.5 mb-3 font-bold">
              TECHNICAL PROFICIENCIES
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              {SKILLS_DATA.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="font-bold text-[#17202A] text-[11px] uppercase">
                    {cat.category}
                  </div>
                  <div className="text-[#4B596A] leading-relaxed">
                    {cat.skills.map((s) => s.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
