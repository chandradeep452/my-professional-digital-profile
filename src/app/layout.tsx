import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import { ShieldCheck } from 'lucide-react';
import NavbarClient from './NavbarClient';
import AntigravityFieldBackground from '@/components/AntigravityFieldBackground';
import { getSessionUser } from '@/lib/auth';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-open-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Professional Digital Profile — Modern Talent Portal',
  description: 'Verified student digital profiles, skills, projects, certificates, and resumes for recruiters with fluid animations.',
  icons: {
    icon: '/logo.jpg?v=2',
    apple: '/logo.jpg?v=2',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionUser = await getSessionUser();

  return (
    <html lang="en" className={`dark ${openSans.variable}`}>
      <body className={`${openSans.className} min-h-screen flex flex-col bg-black text-zinc-100 font-normal antialiased selection:bg-white/20 selection:text-white relative`}>
        {/* Interactive Antigravity Cursor-Following Particle Field */}
        <AntigravityFieldBackground />
        <div className="ambient-glow-1" />
        <div className="ambient-glow-2" />

        {/* Global Animated Glass Navbar */}
        <NavbarClient initialUser={sessionUser} />

        {/* Main Viewport */}
        <main className="flex-1 relative z-10">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-black/80 backdrop-blur-md py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2.5 text-xs text-zinc-300 bg-zinc-950/90 px-4 py-2 rounded-full border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <ShieldCheck className="w-4 h-4 text-zinc-200" />
              <span>
                <span className="text-white font-medium">Privacy Protected:</span> Student phone numbers, passwords, and sensitive IDs are strictly omitted.
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              &copy; {new Date().getFullYear()} Professional Digital Profile. Crafted for top campus talent and recruiters.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
