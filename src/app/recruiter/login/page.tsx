import React from 'react';
import { redirect } from 'next/navigation';
import AuthPortalClient from '@/components/AuthPortalClient';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function RecruiterLoginPage() {
  const session = await getSessionUser();
  if (session?.role === 'recruiter') {
    redirect('/');
  }

  return <AuthPortalClient initialRole="recruiter" />;
}
