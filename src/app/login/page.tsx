import React from 'react';
import { redirect } from 'next/navigation';
import AuthPortalClient from '@/components/AuthPortalClient';
import { getSessionUser } from '@/lib/auth';
import { UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const session = await getSessionUser();
  if (session) {
    redirect('/');
  }

  const params = await searchParams;
  const initialRole: UserRole = params.role === 'student' ? 'student' : 'recruiter';

  return <AuthPortalClient initialRole={initialRole} />;
}
