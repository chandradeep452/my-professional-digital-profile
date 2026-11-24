import { NextRequest, NextResponse } from 'next/server';
import { getStudentById, getStudentByStudentId } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing student identifier' }, { status: 400 });
    }

    // Try finding by UUID primary key first, then fallback to studentId
    let student = getStudentById(id);
    if (!student) {
      student = getStudentByStudentId(id.toUpperCase());
    }

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, student });
  } catch (error: any) {
    console.error('Error fetching student details:', error);
    return NextResponse.json({ error: 'Failed to fetch student details' }, { status: 500 });
  }
}
