import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
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
      <body className={`${openSans.className} min-h-screen flex flex-col text-zinc-100 font-normal antialiased selection:bg-white/20 selection:text-white relative`}>
        {/* Interactive Antigravity Cursor-Following Particle Field */}
        <AntigravityFieldBackground />
        <div className="ambient-glow-1" />
        <div className="ambient-glow-2" />
        <div className="ambient-glow-3" />

        {/* Global Animated Glass Navbar */}
        <NavbarClient initialUser={sessionUser} />

        {/* Main Viewport */}
        <main className="flex-1 relative z-10">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="relative z-10 border-t border-white/15 bg-[#090a14]/45 backdrop-blur-xl py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center text-center">
            <p className="text-xs text-zinc-400">
              &copy; {new Date().getFullYear()} Professional Digital Profile. Crafted for top campus talent and recruiters.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
