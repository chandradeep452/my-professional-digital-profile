import { NextRequest, NextResponse } from 'next/server';
import { getAllStudents, saveStudent } from '@/lib/db';
import { StudentSubmissionPayload } from '@/types';

// Regex to detect explicit phone numbers or 10-12 consecutive digits
const PHONE_PATTERN = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const branch = searchParams.get('branch') || undefined;
    const yearStr = searchParams.get('year');
    const year = yearStr ? parseInt(yearStr, 10) : undefined;

    const students = getAllStudents({ search, branch, year });
    return NextResponse.json({ success: true, count: students.length, students });
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as StudentSubmissionPayload;

    // Validate Required Fields
    if (!body.studentId?.trim()) {
      return NextResponse.json({ error: 'Student ID / Roll Number is required' }, { status: 400 });
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

    // Privacy Policy Check: Disallow phone numbers in all text fields
    const textToCheck = `${body.fullName} ${body.headlineBio} ${body.portfolioUrl || ''} ${JSON.stringify(body.projects || [])}`;
    if (PHONE_PATTERN.test(textToCheck)) {
      return NextResponse.json({
        error: 'Privacy Policy Violation: Phone numbers must not be submitted anywhere in your profile.',
      }, { status: 400 });
    }

    // Save Student in SQLite
    const savedStudent = saveStudent({
      ...body,
      studentId: body.studentId.trim().toUpperCase(),
      fullName: body.fullName.trim(),
      institutionalEmail: body.institutionalEmail.trim().toLowerCase(),
      degree: body.degree.trim(),
      branch: body.branch.trim(),
      graduationYear: Number(body.graduationYear),
      cgpa: Number(body.cgpa),
      headlineBio: body.headlineBio.trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Professional profile saved successfully!',
      student: savedStudent,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving student:', error);
    return NextResponse.json({ error: error.message || 'Failed to save student profile' }, { status: 500 });
  }
}
