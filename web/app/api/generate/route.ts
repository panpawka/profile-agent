import { NextRequest, NextResponse } from 'next/server';
import { TemplateEngine } from '@/lib/templates';
import type { ProfileData } from '@cli/src/types/profile';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileData, templateId = 'minimal-dark' } = body;

    if (!profileData) {
      return NextResponse.json(
        { success: false, error: 'Profile data is required' },
        { status: 400 }
      );
    }

    // Create template engine
    const engine = new TemplateEngine();

    // Validate template exists
    const templates = engine.listTemplates();
    const templateExists = templates.some((t) => t.id === templateId);
    
    if (!templateExists) {
      return NextResponse.json(
        { success: false, error: `Template not found: ${templateId}` },
        { status: 404 }
      );
    }

    // Generate README
    const markdown = await engine.render(templateId, profileData as ProfileData);

    return NextResponse.json({
      success: true,
      data: {
        markdown,
        templateId,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate README';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
