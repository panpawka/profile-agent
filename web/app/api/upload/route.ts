import { NextRequest, NextResponse } from 'next/server';
import { parseFile } from '@/lib/parsers';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds for file parsing

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse file
    const parsed = await parseFile(buffer, file.name);

    return NextResponse.json({
      success: true,
      data: {
        content: parsed.content,
        fileName: parsed.fileName,
        fileType: parsed.fileType,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process file';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
