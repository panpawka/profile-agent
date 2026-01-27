// AI extraction utilities - reuses CLI AI logic
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import type { ProfileData } from '@cli/src/types/profile';

export type AIProvider = 'gemini' | 'openai';

/**
 * Get AI model based on provider
 */
function getModel(provider: AIProvider) {
  switch (provider) {
    case 'gemini':
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not configured');
      }
      return google('gemini-2.0-flash-exp');

    case 'openai':
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured');
      }
      return openai('gpt-4o-mini');

    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}

/**
 * Extract profile data from text content using AI
 */
export async function extractProfileData(
  content: string,
  provider: AIProvider = 'gemini'
): Promise<ProfileData> {
  const model = getModel(provider);

  const prompt = `You are an expert at extracting professional profile information from resumes and CVs.

Analyze the following content and extract structured profile data.

Content:
${content}

Extract and return ONLY a valid JSON object with this exact structure:
{
  "name": "Full Name",
  "title": "Professional Title",
  "bio": "A compelling 2-3 sentence professional bio",
  "location": "City, Country (optional)",
  "email": "email@example.com (optional)",
  "github": "github-username (optional)",
  "linkedin": "linkedin-profile (optional)",
  "website": "https://website.com (optional)",
  "skills": {
    "languages": ["skill1", "skill2"],
    "frameworks": ["framework1", "framework2"],
    "tools": ["tool1", "tool2"],
    "other": ["other1", "other2"]
  },
  "achievements": [
    {
      "title": "Achievement title",
      "description": "Brief description",
      "date": "2024" 
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "description": "Project description",
      "url": "https://github.com/user/repo (optional)",
      "technologies": ["tech1", "tech2"]
    }
  ],
  "experience": [
    {
      "company": "Company name",
      "position": "Job title",
      "duration": "Jan 2020 - Present",
      "description": "Brief description"
    }
  ],
  "education": [
    {
      "institution": "University name",
      "degree": "Degree name",
      "year": "2020"
    }
  ]
}

Return ONLY valid JSON, no markdown formatting, no explanation.`;

  const { text } = await generateText({
    model,
    prompt,
    temperature: 0.3,
  });

  // Clean up response (remove markdown code blocks if present)
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    const profileData = JSON.parse(cleaned) as ProfileData;
    return profileData;
  } catch (error) {
    console.error('Failed to parse AI response:', cleaned);
    throw new Error('Failed to parse profile data from AI response');
  }
}

/**
 * Enrich profile data with GitHub stats
 */
export async function enrichWithGitHub(
  profileData: ProfileData,
  githubUsername?: string
): Promise<ProfileData> {
  const username = githubUsername || profileData.githubStats?.username;
  if (!username) return profileData;

  try {
    // Fetch GitHub stats
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) return profileData;

    const userData = await response.json();

    // Fetch repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const repos = reposResponse.ok ? await reposResponse.json() : [];

    // Calculate stats
    const totalStars = repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0);

    // Get language stats
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

    // Update GitHub stats
    return {
      ...profileData,
      githubStats: {
        username,
        totalRepos: userData.public_repos,
        totalStars,
        totalForks,
        topLanguages,
        lastUpdated: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error);
    return profileData;
  }
}
