import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, getUserByStudentId } from '@/lib/db';
import { hashPassword, attachSessionCookie } from '@/lib/auth';
import { UserRole } from '@/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const role = body.role as UserRole;
    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const companyName = body.companyName ? String(body.companyName).trim() : undefined;
    const studentId = body.studentId ? String(body.studentId).trim().toUpperCase() : undefined;

    if (!role || !['recruiter', 'student'].includes(role)) {
      return NextResponse.json({ error: 'Please select Recruiter or Student role.' }, { status: 400 });
    }
    if (!fullName) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }
    if (role === 'student' && !studentId) {
      return NextResponse.json({ error: 'Student ID / Roll Number is required for student accounts.' }, { status: 400 });
    }

    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json({ error: 'An account with this email already exists. Please sign in.' }, { status: 409 });
    }

    if (role === 'student' && studentId) {
      const existingStudentUser = await getUserByStudentId(studentId);
      if (existingStudentUser) {
        return NextResponse.json(
          { error: 'An account with this Student ID already exists. Please sign in.' },
          { status: 409 }
        );
      }
    }

    const passwordHash = hashPassword(password);
    const user = await createUser({
      email,
      passwordHash,
      role,
      fullName,
      companyName: role === 'recruiter' ? companyName : undefined,
      studentId: role === 'student' ? studentId : undefined,
    });

    const res = NextResponse.json({ success: true, user }, { status: 201 });
    attachSessionCookie(res, user);
    return res;
  } catch (err: any) {
    console.error('Register error:', err);
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
