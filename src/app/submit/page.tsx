import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { getStudentByStudentId, getStudentByUserId } from '@/lib/db';
import SubmitProfileClient from './SubmitProfileClient';

export const dynamic = 'force-dynamic';

export default async function SubmitProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; origin?: string; profileId?: string }>;
}) {
  const session = await getSessionUser();
  if (!session || session.role !== 'student') {
    redirect('/student/login');
  }

  const params = await searchParams;
  const existingProfile =
    (await getStudentByUserId(session.id)) ||
    (session.studentId ? await getStudentByStudentId(session.studentId) : null);

  return (
    <SubmitProfileClient
      authUser={session}
      initialProfile={existingProfile}
      fromContext={params.from}
      originContext={params.origin}
      profileIdContext={params.profileId}
    />
  );
}
