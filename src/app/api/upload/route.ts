import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null; // 'resume' | 'certificate'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!type || !['resume', 'certificate'].includes(type)) {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 });
    }

    // Size limit: 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum limit of 5MB' }, { status: 400 });
    }

    const fileExt = path.extname(file.name).toLowerCase();
    const mimeType = file.type;

    if (type === 'resume') {
      if (fileExt !== '.pdf' || mimeType !== 'application/pdf') {
        return NextResponse.json({ error: 'Resume must be a PDF document' }, { status: 400 });
      }
    } else {
      const allowedExts = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
      if (!allowedExts.includes(fileExt)) {
        return NextResponse.json({ error: 'Certificate must be a PDF or image file (PNG/JPG/WEBP)' }, { status: 400 });
      }
    }

    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    const subDir = type === 'resume' ? 'resumes' : 'certificates';
    const uploadDir = isServerless
      ? path.join('/tmp', 'uploads', subDir)
      : path.join(process.cwd(), 'public', 'uploads', subDir);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safeFilename = `${type}-${randomUUID()}${fileExt}`;
    const destinationPath = path.join(uploadDir, safeFilename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(destinationPath, buffer);

    const publicPath = `/uploads/${subDir}/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: publicPath,
      originalName: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
