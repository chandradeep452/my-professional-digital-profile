import { NextRequest, NextResponse } from 'next/server';
import { deleteStudentById, getStudentById, getStudentByStudentId } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing student identifier' }, { status: 400 });
    }

    let student = await getStudentById(id);
    if (!student) {
      student = await getStudentByStudentId(id.toUpperCase());
    }

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const isOwner =
      session.role === 'student' &&
      (student.userId === session.id ||
        (session.studentId && student.studentId === session.studentId));

    if (session.role !== 'recruiter' && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized to view this profile' }, { status: 403 });
    }

    return NextResponse.json({ success: true, student });
  } catch (error: any) {
    console.error('Error fetching student details:', error);
    return NextResponse.json({ error: 'Failed to fetch student details' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing student identifier' }, { status: 400 });
    }

    let student = await getStudentById(id);
    if (!student) {
      student = await getStudentByStudentId(id.toUpperCase());
    }

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const isOwner =
      session.role === 'student' &&
      (student.userId === session.id ||
        (session.studentId && student.studentId === session.studentId));

    if (!isOwner) {
      return NextResponse.json({ error: 'You can only delete your own student profile.' }, { status: 403 });
    }

    await deleteStudentById(student.id);
    return NextResponse.json({ success: true, message: 'Profile removed successfully.' });
  } catch (error: any) {
    console.error('Error deleting student profile:', error);
    return NextResponse.json({ error: 'Failed to remove student profile' }, { status: 500 });
  }
}
