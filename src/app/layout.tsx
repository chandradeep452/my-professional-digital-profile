import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Briefcase, UserCheck, ShieldCheck, GraduationCap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Professional Digital Profile — Campus Talent Portal',
  description: 'Verified student digital profiles, skills, projects, certificates, and resumes for recruiters.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md group-hover:bg-indigo-700 transition">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition tracking-tight">
                  My Professional Digital Profile
                </span>
                <span className="block text-xs text-slate-500 font-medium">Recruiter & Student Showcase</span>
              </div>
            </Link>

            <nav className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
              >
                <Briefcase className="w-4 h-4 text-slate-500" />
                <span>Recruiter Portal</span>
              </Link>
              <Link
                href="/submit"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition"
              >
                <UserCheck className="w-4 h-4" />
                <span>Submit / Update Profile</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 bg-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                <strong>Privacy Compliant:</strong> Profiles exclude phone numbers, passwords, and sensitive personal information for student privacy.
              </span>
            </div>
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} My Professional Digital Profile. Built for campus recruiters and students.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
