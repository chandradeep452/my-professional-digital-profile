import React from 'react';
import Link from 'next/link';
import { getAllStudents } from '@/lib/db';
import { 
  Search, 
  GraduationCap, 
  FileText, 
  ExternalLink, 
  Award, 
  Code, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import RecruiterDirectoryClient from './RecruiterDirectoryClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const students = getAllStudents();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-indigo-700/50">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-700/60 border border-indigo-500/30 text-indigo-200 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Campus Talent & Recruitment Directory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
            My Professional Digital Profile
          </h1>

          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            A verified platform where recruiters can discover campus talent, inspect student projects, review accredited certificates, and access official resumes.
          </p>

          {/* Quick Stats Bar */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10">
              <span className="text-xl font-bold text-white block">{students.length}</span>
              <span className="text-xs text-indigo-200">Active Profiles</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10">
              <span className="text-xl font-bold text-white block">
                {students.filter(s => s.resumePath).length}
              </span>
              <span className="text-xs text-indigo-200">Resumes Attached</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10">
              <span className="text-xl font-bold text-white block">
                {students.reduce((acc, s) => acc + (s.projects?.length || 0), 0)}
              </span>
              <span className="text-xs text-indigo-200">Showcased Projects</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiter Interactive Search & Filter Client Component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <RecruiterDirectoryClient initialStudents={students} />
      </section>
    </div>
  );
}
