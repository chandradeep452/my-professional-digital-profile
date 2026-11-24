import React from 'react';
import { getAllStudents } from '@/lib/db';
import RecruiterDirectoryClient from './RecruiterDirectoryClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const students = getAllStudents();

  return (
    <div className="min-h-screen">
      <RecruiterDirectoryClient initialStudents={students} />
    </div>
  );
}
