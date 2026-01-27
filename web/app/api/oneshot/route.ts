import { NextRequest, NextResponse } from 'next/server';
import { extractProfileData } from '@/lib/ai';
import { TemplateEngine } from '@/lib/templates';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, provider = 'gemini', templateId = 'minimal-dark', githubUsername } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    // Step 1: Extract profile data using AI
    let profileData = await extractProfileData(content, provider);

    // Add metadata
    profileData = {
      ...profileData,
      version: '1.0',
      generatedAt: new Date().toISOString(),
      templateId,
      skills: profileData.skills || [],
      achievements: profileData.achievements || [],
      experience: profileData.experience || [],
      projects: profileData.projects || [],
      education: profileData.education || [],
      certifications: profileData.certifications || [],
      socialLinks: profileData.socialLinks || [],
      githubStats: {
        username: githubUsername || '',
        totalRepos: 0,
        totalStars: 0,
        totalForks: 0,
        topLanguages: [],
        lastUpdated: new Date().toISOString(),
      },
    };

    // Step 2: Enrich with GitHub stats if username provided
    if (githubUsername) {
      try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}`);
        if (response.ok) {
          const userData = await response.json();
          const reposResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100`);
          const repos = reposResponse.ok ? await reposResponse.json() : [];

          const totalStars = repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
          const totalForks = repos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0);

          const languages: Record<string, number> = {};
          repos.forEach((repo: any) => {
            if (repo.language) {
              languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
          });

          const total = Object.values(languages).reduce((sum, count) => sum + count, 0);
          const topLanguages = Object.entries(languages)
            .map(([language, count]) => ({
              language,
              percentage: Math.round((count / total) * 100),
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5);

          profileData.githubStats = {
            username: githubUsername,
            totalRepos: userData.public_repos,
            totalStars,
            totalForks,
            topLanguages,
            lastUpdated: new Date().toISOString(),
          };
        }
      } catch (error) {
        console.error('Failed to fetch GitHub stats:', error);
      }
    }

    // Step 3: Generate README
    const engine = new TemplateEngine();
    const markdown = await engine.render(templateId, profileData);

    return NextResponse.json({
      success: true,
      data: {
        profileData,
        markdown,
        templateId,
      },
    });
  } catch (error) {
    console.error('One-shot generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate profile';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
