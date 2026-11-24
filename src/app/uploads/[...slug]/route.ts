import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

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

    // Check /tmp/uploads first (Vercel runtime), then public/uploads
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    const candidatePaths = [
      ...(isServerless ? [path.join('/tmp', 'uploads', relativePath)] : []),
      path.join(process.cwd(), 'public', 'uploads', relativePath),
      path.join('/tmp', 'uploads', relativePath),
    ];

    let targetFile: string | null = null;
    for (const p of candidatePaths) {
      if (fs.existsSync(p) && fs.lstatSync(p).isFile()) {
        targetFile = p;
        break;
      }
    }

    if (!targetFile) {
      return new NextResponse('File not found', { status: 404 });
    }

    const buffer = fs.readFileSync(/*turbopackIgnore: true*/ targetFile);
    const ext = path.extname(targetFile).toLowerCase();

    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.png') contentType = 'image/png';
    else if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
    else if (ext === '.webp') contentType = 'image/webp';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err: any) {
    console.error('File serve error:', err);
    return new NextResponse('Error loading file', { status: 500 });
  }
}
