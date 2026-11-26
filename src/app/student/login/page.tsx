import React from 'react';
import { redirect } from 'next/navigation';
import AuthPortalClient from '@/components/AuthPortalClient';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function StudentLoginPage() {
  const session = await getSessionUser();
  if (session?.role === 'student') {
    redirect('/');
  }

  return <AuthPortalClient initialRole="student" />;
}
