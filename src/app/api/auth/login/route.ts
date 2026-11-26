import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getUserByStudentId } from '@/lib/db';
import { verifyPassword, attachSessionCookie } from '@/lib/auth';
import { UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = String(body.identifier || body.email || '').trim();
    const password = String(body.password || '');
    const expectedRole = body.role as UserRole | undefined;

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Email / ID and password are required.' }, { status: 400 });
    }

    let userRow = await getUserByEmail(identifier);
    if (!userRow && expectedRole === 'student') {
      userRow = await getUserByStudentId(identifier);
    }

    if (!userRow || !verifyPassword(password, userRow.passwordHash)) {
      return NextResponse.json({ error: 'Invalid credentials. Please check your email/ID and password.' }, { status: 401 });
    }

    if (expectedRole && userRow.role !== expectedRole) {
      const targetLabel = userRow.role === 'recruiter' ? 'Recruiter Login' : 'Student Login';
      return NextResponse.json(
        { error: `This account is registered as a ${userRow.role}. Please use ${targetLabel}.` },
        { status: 403 }
      );
    }

    const { passwordHash: _, ...user } = userRow;
    const res = NextResponse.json({ success: true, user });
    attachSessionCookie(res, user);
    return res;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: err.message || 'Sign in failed' }, { status: 500 });
  }
}
