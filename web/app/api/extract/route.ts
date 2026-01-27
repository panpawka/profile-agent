import { NextRequest, NextResponse } from 'next/server';
import { extractProfileData, enrichWithGitHub } from '@/lib/ai';
import type { ProfileData } from '@cli/src/types/profile';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds for AI processing

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, provider = 'gemini', githubUsername } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    // Extract profile data using AI
    let profileData = await extractProfileData(content, provider);

    // Add metadata
    profileData = {
      ...profileData,
      version: '1.0',
      generatedAt: new Date().toISOString(),
      templateId: 'minimal-dark', // Default template
      skills: profileData.skills || [],
      achievements: profileData.achievements || [],
      experience: profileData.experience || [],
      projects: profileData.projects || [],
      education: profileData.education || [],
      certifications: profileData.certifications || [],
      socialLinks: profileData.socialLinks || [],
      githubStats: {
        username: '',
        totalRepos: 0,
        totalStars: 0,
        totalForks: 0,
        topLanguages: [],
        lastUpdated: new Date().toISOString(),
      },
    };

    // Enrich with GitHub stats if username provided
    if (githubUsername) {
      profileData = await enrichWithGitHub(profileData, githubUsername);
    }

    return NextResponse.json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error('Extraction error:', error);
    const message = error instanceof Error ? error.message : 'Failed to extract profile data';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
