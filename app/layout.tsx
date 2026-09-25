import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#F4F6F8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://youssefhanna.engineering'),
  title: 'Youssef Hanna — Engineering Portfolio',
  description:
    'Junior Mechanical Engineering student at Cal Poly Pomona focused on aerospace, hands-on design, prototyping, embedded systems, and engineering problem solving.',
  authors: [{ name: 'Youssef Hanna', url: 'https://github.com/TheLeg336' }],
  creator: 'Youssef Hanna',
  keywords: [
    'Youssef Hanna',
    'Mechanical Engineering',
    'Cal Poly Pomona',
    'Aerospace Engineering',
    'Mechatronics',
    'Robotics',
    'Engineering Portfolio',
    'Autonomous Systems',
    'SolidWorks',
    'Raspberry Pi Pico',
  ],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Youssef Hanna — Engineering Portfolio',
    description:
      'Junior Mechanical Engineering student at Cal Poly Pomona focused on aerospace, hands-on design, prototyping, embedded systems, and engineering problem solving.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Youssef Hanna Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Youssef Hanna — Engineering Portfolio',
    description:
      'Junior Mechanical Engineering student at Cal Poly Pomona focused on aerospace, hands-on design, prototyping, embedded systems, and engineering problem solving.',
    creator: '@TheLeg336',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Youssef Hanna',
    jobTitle: 'Mechanical Engineering Student',
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'California State Polytechnic University, Pomona',
      alternateName: 'Cal Poly Pomona',
    },
    url: 'https://youssefhanna.engineering',
    email: 'youssefhanna336@gmail.com',
    sameAs: [
      'https://github.com/TheLeg336',
      'https://cpp.joinhandshake.com/profiles/uwhh2v',
    ],
    knowsAbout: [
      'Mechanical Engineering',
      'Aerospace Engineering',
      'Mechatronics',
      'Robotics',
      'SolidWorks',
      'Embedded Systems',
      'Rapid Prototyping',
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#F4F6F8] text-[#17202A] antialiased selection:bg-[#178BFF]/20 selection:text-[#0864C7] min-h-screen flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
