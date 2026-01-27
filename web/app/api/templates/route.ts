import { NextRequest, NextResponse } from 'next/server';
import { TemplateEngine } from '@/../../src/templates/loader';

export async function GET() {
  try {
    const engine = new TemplateEngine();
    const templates = engine.listTemplates();

    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error('Error listing templates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load templates' },
      { status: 500 }
    );
  }
}
