import { AIProvider, AIConfig } from './config';
import type { ProfileData, SkillCategory, Achievement, Project, TechStackItem, Skill } from '../types/profile';
import type { GitHubStats } from '../github';

/**
 * Encodes a string for shields.io badge labels
 */
function encodeShieldsLabel(text: string): string {
  if (!text) return '';

  return text
    // 1. Double up dashes first (Shields.io syntax)
    .replace(/-/g, '--') 
    // 2. Replace spaces with underscores
    .replace(/ /g, '_')
    // 3. URL encode special chars (like # to %23, + to %2B)
    .replace(/[^\w\s\-\_]/g, (char) => encodeURIComponent(char));
}

/**
 * Tech color mapping for shields.io badges (hex without #)
 * Fallback colors for common technologies if AI doesn't provide them
 */
const FALLBACK_TECH_COLORS: Record<string, string> = {
  "TypeScript": "3178C6", "JavaScript": "F7DF1E", "Python": "3776AB",
  "Java": "007396", "C#": "239120", "Go": "00ADD8", "Rust": "000000",
  "React": "61DAFB", "Vue.js": "4FC08D", "Angular": "DD0031",
  "Node.js": "339933", "Django": "092E20", "Flask": "000000",
  "PostgreSQL": "4169E1", "MongoDB": "47A248", "MySQL": "4479A1",
  "Redis": "DC382D", "Docker": "2496ED", "Kubernetes": "326CE5",
  "AWS": "FF9900", "Azure": "0078D4", "GCP": "4285F4"
};

/**
 * Tech logo mapping for shields.io badges
 */
const FALLBACK_TECH_LOGOS: Record<string, string> = {
  "TypeScript": "typescript", "JavaScript": "javascript", "Python": "python",
  "Java": "java", "C#": "csharp", "Go": "go", "Rust": "rust",
  "React": "react", "Vue.js": "vue.js", "Angular": "angular",
  "Node.js": "node.js", "Django": "django", "Flask": "flask",
  "PostgreSQL": "postgresql", "MongoDB": "mongodb", "MySQL": "mysql",
  "Redis": "redis", "Docker": "docker", "Kubernetes": "kubernetes",
  "AWS": "amazonaws", "Azure": "microsoftazure", "GCP": "googlecloud"
};

/**
 * Ensures a skill has all required badge fields
 */
function ensureSkillBadgeFields(skill: any): Skill {
  const encoded = skill.encoded || encodeShieldsLabel(skill.name);
  const color = skill.color || FALLBACK_TECH_COLORS[skill.name] || "2563EB";
  const logo = skill.logo || FALLBACK_TECH_LOGOS[skill.name] || skill.name.toLowerCase().replace(/[.\s]/g, "");
  
  return {
    name: skill.name,
    encoded,
    color,
    logo,
    proficiency: skill.proficiency,
    yearsOfExperience: skill.yearsOfExperience
  };
}

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
  techStack: TechStackItem[];
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
    const [skills, achievements, projects, bio, techStack] = await Promise.all([
      this.extractSkills(combinedContext),
      this.extractAchievements(combinedContext),
      this.extractProjects(context),
      this.generateBio(combinedContext),
      this.extractTechStack(context),
    ]);

    return {
      skills,
      achievements,
      bio,
      projects,
      techStack,
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

    // Ensure all skills have badge metadata
    const enrichedSkills = (result.skills || []).map(category => ({
      ...category,
      skills: category.skills.map(ensureSkillBadgeFields)
    }));

    return enrichedSkills;
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
   * Extract tech stack with shields.io badge information
   * @param context Extraction context
   * @returns Array of tech stack items with badge details
   */
  private async extractTechStack(context: ExtractionContext): Promise<TechStackItem[]> {
    const combinedContext = this.combineContext(context);

    const prompt = `Analyze the following profile data and extract the main technologies used by this developer.
For each technology, provide:
1. name - the technology name (e.g., "React", "TypeScript", "Node.js", "C#")
2. color - a hex color code WITHOUT the # (e.g., "61DAFB" for React blue, "3178C6" for TypeScript blue)
3. logo - the shields.io logo identifier (usually lowercase, e.g., "react", "typescript", "node.js", "csharp")

Focus on the most significant technologies. Include programming languages, frameworks, libraries, databases, and tools.
Limit to 10-15 most relevant technologies.

Context:
{context}

Return a JSON object with a "techStack" array.`;

    const userMessage = prompt.replace('{context}', combinedContext);

    const result = await this.ai.generateJSON<{ techStack: Omit<TechStackItem, 'encoded'>[] }>(
      'You are a technical profile analyzer extracting technology stacks.',
      userMessage
    );

    // Add encoded field to each tech stack item
    return (result.techStack || []).map(tech => ({
      ...tech,
      encoded: this.encodeShieldsLabel(tech.name),
    }));
  }

  /**
   * Encodes a string for shields.io badge labels
   */
  private encodeShieldsLabel(text: string): string {
    if (!text) return '';

    return text
      // 1. Double up dashes first (Shields.io syntax)
      .replace(/-/g, '--') 
      // 2. Replace spaces with underscores
      .replace(/ /g, '_')
      // 3. URL encode special chars (like # to %23, + to %2B)
      .replace(/[^\w\s\-\_]/g, (char) => encodeURIComponent(char));
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

export type { AIProvider, AIConfig };

