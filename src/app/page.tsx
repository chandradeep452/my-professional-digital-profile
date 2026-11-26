import React from 'react';
import Link from 'next/link';
import { getAllStudents, getStudentByStudentId, getStudentByUserId } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import RecruiterDirectoryClient from './RecruiterDirectoryClient';
import AuthPortalClient from '@/components/AuthPortalClient';
import SparkleBorderButton from '@/components/SparkleBorderButton';
import StudentProfileWorkspace from '@/components/StudentProfileWorkspace';
import { EncryptedText } from '@/components/ui/encrypted-text';
import { Sparkles, UserCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await getSessionUser();

  if (session?.role === 'recruiter') {
    const students = await getAllStudents();
    return (
      <div className="min-h-screen">
        <RecruiterDirectoryClient initialStudents={students} />
      </div>
    );
  }

  if (session?.role === 'student') {
    const existingProfile =
      (await getStudentByUserId(session.id)) ||
      (session.studentId ? await getStudentByStudentId(session.studentId) : null);

    if (existingProfile) {
      return (
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-950/90 border border-white/15 text-zinc-200 text-xs font-normal">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Student Profile Workspace • {session.fullName}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 font-normal">
                  Browse your overview, skills, projects, certificates, and resume from the left sidebar.
                </p>
              </div>
            </div>

            <StudentProfileWorkspace
              student={existingProfile}
              isOwner={true}
              editHref="/submit?from=home"
              previewHref={`/profile/${existingProfile.id}?from=home`}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pb-16">
        <section className="relative overflow-hidden pt-12 pb-10 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-transparent">
          <div className="max-w-5xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-950/90 border border-white/15 text-zinc-200 text-xs font-normal uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300 animate-pulse" />
              <span>Welcome, {session.fullName}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-medium tracking-tight leading-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]">
              <EncryptedText
                text="My Professional Digital Profile"
                encryptedClassName="text-zinc-400"
                revealedClassName="text-white"
                revealDelayMs={95}
                flipDelayMs={45}
              />
            </h1>

            <p className="text-zinc-300 max-w-2xl mx-auto text-sm sm:text-base font-normal leading-relaxed">
              You are signed in as a Student{session.studentId ? ` (ID: ${session.studentId})` : ''}. Create your digital portfolio for campus recruiters.
            </p>
          </div>
        </section>

        <div className="max-w-xl mx-auto px-4 pt-10">
          <div className="glass-panel rounded-3xl border border-white/15 p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-white/8 border border-white/15 flex items-center justify-center text-zinc-200 mx-auto">
              <UserCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-medium text-white">Complete Your Digital Profile</h2>
              <p className="text-sm text-zinc-400 font-normal leading-relaxed">
                Add your academic details, projects, certificates, and PDF resume so verified recruiters can discover you.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/submit?from=home">
                <SparkleBorderButton as="span" size="md">
                  Build My Profile
                </SparkleBorderButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Signed-out Visitor: Hero + Recruiter / Student Sign-In Portal
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-12 pb-8 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-950/90 border border-white/15 text-zinc-200 text-xs font-normal uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-zinc-300 animate-pulse" />
            <span>Campus Talent & Recruitment Directory</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight leading-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]">
            <EncryptedText
              text="My Professional Digital Profile"
              encryptedClassName="text-zinc-400"
              revealedClassName="text-white"
              revealDelayMs={95}
              flipDelayMs={45}
            />
          </h1>

          <p className="text-zinc-300 max-w-2xl mx-auto text-sm sm:text-base font-normal leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
            Sign in as a Recruiter to explore verified student profiles and resumes, or sign in as a Student to build and edit your digital portfolio.
          </p>
        </div>
      </section>

      <AuthPortalClient initialRole="recruiter" embedded />
    </div>
  );
}
