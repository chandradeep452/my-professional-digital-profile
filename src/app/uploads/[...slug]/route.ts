import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getUploadedFile } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    if (!slug || slug.length === 0) {
      return new NextResponse('File not found', { status: 404 });
    }

    const relativePath = slug.join('/');

    // Primary: fetch persistent file from Neon Postgres
    const dbFile = await getUploadedFile(relativePath);
    if (dbFile) {
      return new NextResponse(new Uint8Array(dbFile.buffer), {
        headers: {
          'Content-Type': dbFile.mimeType || 'application/octet-stream',
          'Content-Disposition': `inline; filename="${encodeURIComponent(dbFile.originalName)}"`,
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // Fallback: local disk if a static file exists
    const candidatePath = path.join(process.cwd(), 'public', 'uploads', relativePath);
    if (fs.existsSync(candidatePath) && fs.lstatSync(candidatePath).isFile()) {
      const buffer = fs.readFileSync(/*turbopackIgnore: true*/ candidatePath);
      const ext = path.extname(candidatePath).toLowerCase();

      let contentType = 'application/octet-stream';
      if (ext === '.pdf') contentType = 'application/pdf';
      else if (ext === '.png') contentType = 'image/png';
      else if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
      else if (ext === '.webp') contentType = 'image/webp';

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': 'inline',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    return new NextResponse('File not found', { status: 404 });
  } catch (err: any) {
    console.error('File serve error:', err);
    return new NextResponse('Error loading file', { status: 500 });
  }
}
