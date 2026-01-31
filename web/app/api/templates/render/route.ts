import { NextRequest, NextResponse } from 'next/server';
import { TemplateEngine } from '@/lib/templates';
import type { ProfileData } from '@cli/src/types/profile';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * POST /api/templates/render
 * Render all templates with profile data
 * Returns: Map of templateId -> markdown
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileData } = body as { profileData: ProfileData };

    if (!profileData) {
      return NextResponse.json(
        { success: false, error: 'profileData is required' },
        { status: 400 }
      );
    }

    const engine = new TemplateEngine();
    const templates = engine.listTemplates();
    
    // Render all templates in parallel
    const renderPromises = templates.map(async (template) => {
      try {
        const markdown = await engine.render(template.id, profileData);
        return { templateId: template.id, markdown, config: template };
      } catch (error) {
        console.error(`Failed to render template ${template.id}:`, error);
        return { templateId: template.id, markdown: '', config: template, error: true };
      }
    });

    const results = await Promise.all(renderPromises);
    
    // Convert to map
    const renderedTemplates: Record<string, { markdown: string; config: any }> = {};
    results.forEach(({ templateId, markdown, config }) => {
      renderedTemplates[templateId] = { markdown, config };
    });

    return NextResponse.json({
      success: true,
      data: renderedTemplates,
    });
  } catch (error) {
    console.error('Template rendering error:', error);
    const message = error instanceof Error ? error.message : 'Failed to render templates';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
