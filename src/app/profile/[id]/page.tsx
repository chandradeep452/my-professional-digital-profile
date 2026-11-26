import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getStudentById, getStudentByStudentId } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { ArrowLeft } from 'lucide-react';
import StudentProfileWorkspace from '@/components/StudentProfileWorkspace';

export const dynamic = 'force-dynamic';

export default async function StudentProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; origin?: string }>;
}) {
  const session = await getSessionUser();
  if (!session) {
    redirect('/recruiter/login');
  }

  const { id } = await params;
  const query = await searchParams;
  const from = query.from;
  const origin = query.origin;

  let student = await getStudentById(id);
  if (!student) {
    student = await getStudentByStudentId(id.toUpperCase());
  }

  if (!student) {
    notFound();
  }

  const isOwner =
    session.role === 'student' &&
    (student.userId === session.id ||
      (session.studentId && student.studentId === session.studentId));

  if (session.role !== 'recruiter' && !isOwner) {
    redirect('/');
  }

  // Determine exact logical Back destination based on where user clicked from
  let backHref = '/';
  let backLabel = 'Back to Home';

  if (from === 'editor') {
    backHref = origin ? `/submit?from=${encodeURIComponent(origin)}` : '/submit';
    backLabel = 'Back to Profile Editor';
  } else if (from === 'directory' || (!from && session.role === 'recruiter')) {
    backHref = '/';
    backLabel = 'Back to Recruiter Directory';
  } else {
    backHref = '/';
    backLabel = 'Back to Home';
  }

  const editHref =
    from === 'editor'
      ? backHref
      : `/submit?from=profile&profileId=${encodeURIComponent(student.id)}${
          from ? `&origin=${encodeURIComponent(from)}` : ''
        }`;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Context-Aware Back Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-950/90 border border-white/15 text-xs font-normal text-zinc-200 hover:text-white hover:bg-zinc-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>

          <span className="text-xs text-zinc-400 font-normal">
            {isOwner ? 'Public Profile Preview' : 'Candidate Profile'}
          </span>
        </div>

        <StudentProfileWorkspace
          student={student}
          isOwner={Boolean(isOwner)}
          editHref={editHref}
        />
      </div>
    </div>
  );
}
