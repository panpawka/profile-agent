import { AIProvider, AIConfig } from './config';
import type { ProfileData, SkillCategory, Achievement, Project } from '../types/profile';
import type { GitHubStats } from '../github';

export interface ExtractionContext {
  cvText?: string;
  linkedinText?: string;
  githubProfile?: any;
  githubRepos?: any[];
  githubStats?: any;
  customText?: string[];
}

export interface ExtractionResult {
  skills: SkillCategory[];
  achievements: Achievement[];
  bio: string;
  projects: Project[];
}

export class AIExtractor {
  private ai: AIProvider;

  constructor(config: AIConfig) {
    this.ai = new AIProvider(config);
  }

  /**
   * Extract complete profile data from all sources
   * @param context Combined context from all sources
   * @returns Extracted profile data
   */
  async extract(
    context: ExtractionContext
  ): Promise<ExtractionResult> {
    // Combine all text sources
    const combinedContext = this.combineContext(context);

    // Run extractions in parallel for efficiency
    const [skills, achievements, projects, bio] = await Promise.all([
      this.extractSkills(combinedContext),
      this.extractAchievements(combinedContext),
      this.extractProjects(context),
      this.generateBio(combinedContext),
    ]);

    return {
      skills,
      achievements,
      bio,
      projects,
    };
  }

  /**
   * Extract technical skills and categorize them
   * @param context Combined context text
   * @returns Categorized skills
   */
  private async extractSkills(context: string): Promise<SkillCategory[]> {
    const prompt = AIProvider.loadPrompt('extract-skills');
    const userMessage = prompt.replace('{context}', context);

    const result = await this.ai.generateJSON<{ skills: SkillCategory[] }>(
      'You are a technical recruiter analyzing developer skills.',
      userMessage
    );

    return result.skills || [];
  }

  /**
   * Extract and enhance achievements
   * @param context Combined context text
   * @returns Array of achievements
   */
  private async extractAchievements(context: string): Promise<Achievement[]> {
    const prompt = AIProvider.loadPrompt('extract-achievements');
    const userMessage = prompt.replace('{context}', context);

    const result = await this.ai.generateJSON<{ achievements: any[] }>(
      'You are a career coach helping to articulate professional achievements.',
      userMessage
    );

    // Add IDs and normalize structure
    return (result.achievements || []).map((achievement, index) => ({
      id: `ach-${index + 1}`,
      text: achievement.text,
      source: achievement.source || 'cv',
      metrics: achievement.metrics || [],
      isHighlighted: achievement.isHighlighted || false,
    }));
  }

  /**
   * Generate professional bio
   * @param context Combined context text
   * @returns Bio text
   */
  private async generateBio(context: string): Promise<string> {
    const prompt = AIProvider.loadPrompt('generate-bio');
    const userMessage = prompt.replace('{context}', context);

    const bio = await this.ai.generate(
      'You are a professional copywriter specializing in developer profiles.',
      userMessage,
      0.5 // Slightly higher temperature for creative writing
    );

    return bio.trim();
  }

  /**
   * Summarize GitHub projects
   * @param context Extraction context with GitHub data
   * @returns Array of projects
   */
  private async extractProjects(context: ExtractionContext): Promise<Project[]> {
    if (!context.githubRepos || context.githubRepos.length === 0) {
      return [];
    }

    // Prepare project context
    const projectsContext = context.githubRepos.map((repo) => ({
      name: repo.name,
      description: repo.description || 'No description',
      stars: repo.stars || 0,
      language: repo.language,
      topics: repo.topics || [],
      url: repo.url,
    }));

    const prompt = AIProvider.loadPrompt('summarize-projects');
    const userMessage = prompt.replace(
      '{context}',
      JSON.stringify(projectsContext, null, 2)
    );

    const result = await this.ai.generateJSON<{ projects: any[] }>(
      'You are a developer advocate creating project showcases.',
      userMessage
    );

    // Merge with original repo data
    return (result.projects || []).map((proj) => {
      const original = context.githubRepos!.find((r) => r.name === proj.name);
      return {
        name: proj.name,
        description: proj.description,
        repoUrl: original?.url || '',
        liveUrl: original?.homepage || undefined,
        technologies: proj.technologies || [],
        stars: original?.stars || 0,
        isFeatured: proj.isFeatured || false,
      };
    });
  }

  /**
   * Combine all context sources into a single string
   * @param context Extraction context
   * @returns Combined context text
   */
  private combineContext(context: ExtractionContext): string {
    const parts: string[] = [];

    if (context.cvText) {
      parts.push('=== CV/RESUME ===');
      parts.push(context.cvText);
    }

    if (context.linkedinText) {
      parts.push('\n=== LINKEDIN PROFILE ===');
      parts.push(context.linkedinText);
    }

    if (context.githubProfile) {
      parts.push('\n=== GITHUB PROFILE ===');
      parts.push(JSON.stringify(context.githubProfile, null, 2));
    }

    if (context.customText && context.customText.length > 0) {
      parts.push('\n=== CUSTOM TEXT ===');
      parts.push(context.customText.join('\n\n'));
    }

    return parts.join('\n');
  }
}

export { AIProvider, AIConfig };

