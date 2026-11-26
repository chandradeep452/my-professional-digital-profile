import { NextRequest, NextResponse } from 'next/server';
import {
  getAllStudents,
  getStudentByStudentId,
  getStudentByUserId,
  getUserByStudentId,
  saveStudent,
  updateUserStudentId,
} from '@/lib/db';
import { attachSessionCookie, getSessionUser } from '@/lib/auth';
import { StudentSubmissionPayload } from '@/types';

// Regex to detect explicit phone numbers or 10-12 consecutive digits
const PHONE_PATTERN = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/;

function normalizeUrl(raw?: string): string | undefined {
  const val = raw?.trim();
  if (!val) return undefined;
  if (/^https?:\/\//i.test(val)) return val;
  return `https://${val}`;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (session.role === 'student') {
      const own =
        (await getStudentByUserId(session.id)) ||
        (session.studentId ? await getStudentByStudentId(session.studentId) : null);
      const list = own ? [own] : [];
      return NextResponse.json({ success: true, count: list.length, students: list });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const branch = searchParams.get('branch') || undefined;
    const yearStr = searchParams.get('year');
    const year = yearStr ? parseInt(yearStr, 10) : undefined;

    const students = await getAllStudents({ search, branch, year });
    return NextResponse.json({ success: true, count: students.length, students });
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Please sign in as a student to save your profile.' }, { status: 401 });
    }
    if (session.role !== 'student') {
      return NextResponse.json({ error: 'Only signed-in students can create or edit student profiles.' }, { status: 403 });
    }

    const body = (await req.json()) as StudentSubmissionPayload;

    const effectiveStudentId = (body.studentId || session.studentId || '').trim().toUpperCase();
    if (!effectiveStudentId) {
      return NextResponse.json({ error: 'Student ID / Registration Number is required' }, { status: 400 });
    }
    if (!body.fullName?.trim()) {
      return NextResponse.json({ error: 'Full Name is required' }, { status: 400 });
    }
    if (!body.institutionalEmail?.trim()) {
      return NextResponse.json({ error: 'Institutional Email is required' }, { status: 400 });
    }
    if (!body.degree?.trim()) {
      return NextResponse.json({ error: 'Degree is required' }, { status: 400 });
    }
    if (!body.branch?.trim()) {
      return NextResponse.json({ error: 'Branch / Department is required' }, { status: 400 });
    }
    if (!body.graduationYear || isNaN(body.graduationYear)) {
      return NextResponse.json({ error: 'Valid Graduation Year is required' }, { status: 400 });
    }
    if (body.cgpa === undefined || isNaN(body.cgpa) || body.cgpa < 0 || body.cgpa > 10) {
      return NextResponse.json({ error: 'Valid CGPA (between 0.0 and 10.0) is required' }, { status: 400 });
    }
    if (!body.headlineBio?.trim()) {
      return NextResponse.json({ error: 'Professional Headline / Bio is required' }, { status: 400 });
    }

    // Ownership check so one student cannot overwrite another student's profile or claim another ID
    const existingByStudentId = await getStudentByStudentId(effectiveStudentId);
    if (existingByStudentId && existingByStudentId.userId !== session.id) {
      return NextResponse.json(
        { error: 'This Registration Number is already linked to another student account.' },
        { status: 403 }
      );
    }

    const existingUserWithId = await getUserByStudentId(effectiveStudentId);
    if (existingUserWithId && existingUserWithId.id !== session.id) {
      return NextResponse.json(
        { error: 'This Registration Number is already registered to another student account.' },
        { status: 409 }
      );
    }

    // Normalize URLs (e.g. www.mg.com -> https://www.mg.com)
    const normalizedPortfolio = normalizeUrl(body.portfolioUrl);
    const normalizedLinkedin = normalizeUrl(body.linkedinUrl);
    const normalizedGithub = normalizeUrl(body.githubUrl);
    const normalizedProjects = (body.projects || []).map((p) => ({
      ...p,
      githubUrl: normalizeUrl(p.githubUrl),
      liveDemoUrl: normalizeUrl(p.liveDemoUrl),
    }));
    const normalizedCerts = (body.certificates || []).map((c) => ({
      ...c,
      credentialUrl: normalizeUrl(c.credentialUrl),
    }));

    // Privacy Policy Check: Disallow phone numbers in all text fields
    const textToCheck = `${body.fullName} ${body.headlineBio} ${normalizedPortfolio || ''} ${JSON.stringify(normalizedProjects)}`;
    if (PHONE_PATTERN.test(textToCheck)) {
      return NextResponse.json(
        { error: 'Phone numbers must not be submitted anywhere in your profile.' },
        { status: 400 }
      );
    }

    const savedStudent = await saveStudent(
      {
        ...body,
        studentId: effectiveStudentId,
        fullName: body.fullName.trim(),
        institutionalEmail: body.institutionalEmail.trim().toLowerCase(),
        degree: body.degree.trim(),
        branch: body.branch.trim(),
        graduationYear: Number(body.graduationYear),
        cgpa: Number(body.cgpa),
        headlineBio: body.headlineBio.trim(),
        linkedinUrl: normalizedLinkedin,
        githubUrl: normalizedGithub,
        portfolioUrl: normalizedPortfolio,
        photoPath: body.photoPath !== undefined ? body.photoPath.trim() : undefined,
        projects: normalizedProjects,
        certificates: normalizedCerts,
      },
      session.id
    );

    const updatedUser =
      session.studentId !== effectiveStudentId
        ? await updateUserStudentId(session.id, effectiveStudentId)
        : null;

    const res = NextResponse.json(
      {
        success: true,
        message: 'Professional profile saved successfully!',
        student: savedStudent,
      },
      { status: 201 }
    );

    if (updatedUser) {
      attachSessionCookie(res, updatedUser);
    }

    return res;
  } catch (error: any) {
    console.error('Error saving student:', error);
    return NextResponse.json({ error: error.message || 'Failed to save student profile' }, { status: 500 });
  }
}
