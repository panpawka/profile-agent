import fs from 'fs';
import path from 'path';
import { ParserEngine, ParsedSource } from './parsers';
import { LinkedInParser } from './parsers/linkedin';
import { GitHubClient, GitHubStats } from './github';
import { AIExtractor, AIConfig, ExtractionContext, ExtractionResult } from './ai';
import { TemplateRenderer } from './templates';
import type { ProfileData, GitHubStats as ProfileGitHubStats } from './types/profile';

export interface ProfileAgentConfig {
  aiProvider: 'gemini' | 'openai';
  aiApiKey?: string;
  githubToken?: string;
  defaultTemplate?: string;
}

export interface SourceInput {
  type: 'cv' | 'linkedin' | 'github' | 'text';
  path?: string;
  username?: string;
  content?: string;
}

export interface GenerateOptions {
  templateId?: string;
  outputPath?: string;
}

export interface DeployOptions {
  setupAction?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'manual';
}

/**
 * ProfileAgent - Programmatic API for generating GitHub profile READMEs
 * 
 * @example
 * ```typescript
 * const agent = new ProfileAgent({
 *   aiProvider: 'gemini',
 *   aiApiKey: process.env.GEMINI_API_KEY,
 *   githubToken: process.env.GITHUB_TOKEN,
 * });
 * 
 * await agent.addSource({ type: 'cv', path: './resume.pdf' });
 * await agent.addSource({ type: 'github', username: 'johndoe' });
 * 
 * const profileData = await agent.extract();
 * const readme = await agent.generate({ templateId: 'minimal-dark' });
 * 
 * console.log(readme);
 * ```
 */
export class ProfileAgent {
  private config: ProfileAgentConfig;
  private sources: ParsedSource[] = [];
  private githubData?: any;
  private profileData?: ProfileData;
  
  private parser: ParserEngine;
  private linkedInParser: LinkedInParser;
  private githubClient?: GitHubClient;
  private aiExtractor?: AIExtractor;
  private templateRenderer: TemplateRenderer;

  constructor(config: ProfileAgentConfig) {
    this.config = config;
    this.parser = new ParserEngine();
    this.linkedInParser = new LinkedInParser();
    this.templateRenderer = new TemplateRenderer();

    if (config.githubToken) {
      this.githubClient = new GitHubClient(config.githubToken);
    }

    if (config.aiProvider && config.aiApiKey) {
      this.aiExtractor = new AIExtractor({
        provider: config.aiProvider,
        apiKey: config.aiApiKey,
      });
    }
  }

  /**
   * Add a data source for profile generation
   * @param source Source configuration
   */
  async addSource(source: SourceInput): Promise<void> {
    switch (source.type) {
      case 'cv':
        if (!source.path) throw new Error('CV path is required');
        const cvResult = await this.parser.parseFile(source.path);
        this.sources.push(cvResult);
        break;

      case 'linkedin':
        if (!source.path) throw new Error('LinkedIn file path is required');
        const linkedInData = await this.linkedInParser.parse(source.path);
        this.sources.push({
          type: 'linkedin',
          content: JSON.stringify(linkedInData),
          metadata: { structured: linkedInData },
        });
        break;

      case 'github':
        if (!this.githubClient) {
          throw new Error('GitHub token not configured');
        }
        const username = source.username || (await this.getAuthenticatedUser());
        const [profile, stats] = await Promise.all([
          this.githubClient.fetchProfile(username),
          this.githubClient.calculateStats(username),
        ]);
        this.githubData = { profile, stats };
        break;

      case 'text':
        if (!source.content) throw new Error('Text content is required');
        this.sources.push({
          type: 'text',
          content: source.content,
        });
        break;

      default:
        throw new Error(`Unknown source type: ${(source as any).type}`);
    }
  }

  /**
   * Extract profile data using AI
   * @returns Extracted and structured profile data
   */
  async extract(): Promise<ProfileData> {
    if (!this.aiExtractor) {
      throw new Error('AI extractor not configured. Provide aiProvider and aiApiKey.');
    }

    // Build extraction context
    const context: ExtractionContext = {
      customText: [],
    };

    for (const source of this.sources) {
      if (source.type === 'cv') {
        context.cvText = source.content;
      } else if (source.type === 'linkedin') {
        context.linkedinText = source.content;
      } else if (source.type === 'text') {
        context.customText = context.customText || [];
        context.customText.push(source.content);
      }
    }

    if (this.githubData) {
      context.githubProfile = this.githubData.profile;
      context.githubRepos = this.githubData.stats.featuredRepos;
      context.githubStats = this.githubData.stats;
    }

    // Run AI extraction
    const result = await this.aiExtractor.extract(context);

    // Build profile data
    const githubStats: ProfileGitHubStats = this.githubData
      ? {
          username: this.githubData.profile.username,
          totalRepos: this.githubData.stats.totalRepos,
          totalStars: this.githubData.stats.totalStars,
          totalForks: this.githubData.stats.totalForks,
          topLanguages: this.githubData.stats.topLanguages.map((l: any) => ({
            language: l.language,
            percentage: Math.round((l.count / this.githubData.stats.totalRepos) * 100),
          })),
          lastUpdated: new Date().toISOString(),
        }
      : {
          username: 'username',
          totalRepos: 0,
          totalStars: 0,
          totalForks: 0,
          topLanguages: [],
          lastUpdated: new Date().toISOString(),
        };

    this.profileData = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      name: this.githubData?.profile.name || 'Your Name',
      headline: 'Software Developer',
      bio: result.bio,
      location: this.githubData?.profile.location,
      email: undefined,
      skills: result.skills,
      achievements: result.achievements,
      experience: [],
      projects: result.projects,
      education: [],
      certifications: [],
      socialLinks: this.buildSocialLinks(),
      githubStats,
      templateId: this.config.defaultTemplate || 'minimal-dark',
    };

    return this.profileData;
  }

  /**
   * Generate README using a template
   * @param options Generation options
   * @returns Generated README markdown
   */
  async generate(options: GenerateOptions = {}): Promise<string> {
    if (!this.profileData) {
      throw new Error('No profile data available. Run extract() first.');
    }

    const templateId = options.templateId || this.profileData.templateId;
    const readme = await this.templateRenderer.render(templateId, this.profileData);

    if (options.outputPath) {
      fs.writeFileSync(options.outputPath, readme);
    }

    return readme;
  }

  /**
   * Save profile data to file
   * @param data Profile data to save
   * @param outputPath Output file path
   */
  saveProfile(data: ProfileData, outputPath: string = './profile-data.json'): void {
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    this.profileData = data;
  }

  /**
   * Load profile data from file
   * @param inputPath Input file path
   * @returns Loaded profile data
   */
  loadProfile(inputPath: string): ProfileData {
    const content = fs.readFileSync(inputPath, 'utf-8');
    this.profileData = JSON.parse(content);
    return this.profileData!;
  }

  /**
   * List available templates
   * @returns Array of template configs
   */
  listTemplates() {
    return this.templateRenderer.listTemplates();
  }

  /**
   * Preview a template with current or sample profile data
   * @param templateId Template ID to preview
   * @param useSampleData Whether to use sample data instead of current profile
   * @returns Generated README preview
   */
  async preview(templateId: string, useSampleData: boolean = false): Promise<string> {
    const dataToUse = useSampleData ? this.getSampleProfileData() : this.profileData;
    
    if (!dataToUse) {
      throw new Error('No profile data available. Either run extract() first or use useSampleData=true.');
    }

    return await this.templateRenderer.render(templateId, dataToUse);
  }

  /**
   * Get sample profile data for previewing templates
   * @returns Sample ProfileData
   */
  private getSampleProfileData(): ProfileData {
    return {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      name: 'Alex Developer',
      headline: 'Full-Stack Engineer | Open Source Enthusiast',
      bio: 'Passionate software engineer with 5+ years of experience building scalable web applications. I love contributing to open source and exploring new technologies.',
      location: 'San Francisco, CA',
      email: undefined,
      skills: [
        {
          category: 'Languages',
          skills: [
            { name: 'JavaScript', proficiency: 'expert' as const },
            { name: 'TypeScript', proficiency: 'expert' as const },
            { name: 'Python', proficiency: 'advanced' as const },
            { name: 'Go', proficiency: 'intermediate' as const },
            { name: 'Rust', proficiency: 'intermediate' as const },
          ],
        },
        {
          category: 'Frontend',
          skills: [
            { name: 'React', proficiency: 'expert' as const },
            { name: 'Next.js', proficiency: 'advanced' as const },
            { name: 'Vue.js', proficiency: 'advanced' as const },
            { name: 'Tailwind CSS', proficiency: 'expert' as const },
          ],
        },
        {
          category: 'Backend',
          skills: [
            { name: 'Node.js', proficiency: 'expert' as const },
            { name: 'Express', proficiency: 'expert' as const },
            { name: 'FastAPI', proficiency: 'advanced' as const },
            { name: 'PostgreSQL', proficiency: 'advanced' as const },
            { name: 'MongoDB', proficiency: 'advanced' as const },
          ],
        },
        {
          category: 'DevOps',
          skills: [
            { name: 'Docker', proficiency: 'expert' as const },
            { name: 'Kubernetes', proficiency: 'advanced' as const },
            { name: 'AWS', proficiency: 'advanced' as const },
            { name: 'GitHub Actions', proficiency: 'expert' as const },
            { name: 'Terraform', proficiency: 'intermediate' as const },
          ],
        },
      ],
      achievements: [
        {
          id: '1',
          text: 'Built and scaled a microservices platform serving 10M+ users',
          source: 'cv' as const,
          isHighlighted: true,
        },
        {
          id: '2',
          text: 'Core contributor to React ecosystem with 50+ merged PRs',
          source: 'github' as const,
          isHighlighted: true,
        },
        {
          id: '3',
          text: 'Speaker at JSConf 2023: "Building Resilient Distributed Systems"',
          source: 'linkedin' as const,
          isHighlighted: true,
        },
        {
          id: '4',
          text: 'Open source project maintainer with 5K+ GitHub stars',
          source: 'github' as const,
          isHighlighted: true,
        },
      ],
      experience: [],
      projects: [
        {
          name: 'awesome-cloud-toolkit',
          description: 'A comprehensive toolkit for cloud infrastructure management',
          technologies: ['TypeScript', 'AWS', 'Terraform'],
          repoUrl: 'https://github.com/sample/awesome-cloud-toolkit',
          stars: 3420,
          isFeatured: true,
        },
        {
          name: 'realtime-collab-editor',
          description: 'Real-time collaborative code editor with WebRTC and CRDTs',
          technologies: ['React', 'WebRTC', 'Yjs', 'Node.js'],
          repoUrl: 'https://github.com/sample/realtime-collab-editor',
          stars: 1850,
          isFeatured: true,
        },
        {
          name: 'ml-inference-engine',
          description: 'Fast ML model inference engine optimized for edge devices',
          technologies: ['Rust', 'ONNX', 'Python'],
          repoUrl: 'https://github.com/sample/ml-inference-engine',
          stars: 890,
          isFeatured: true,
        },
      ],
      education: [],
      certifications: [],
      socialLinks: [
        { platform: 'Twitter', url: 'https://twitter.com/alexdev' },
        { platform: 'Website', url: 'https://alexdev.io' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/alexdev' },
      ],
      githubStats: {
        username: 'alexdev',
        totalRepos: 87,
        totalStars: 6250,
        totalForks: 420,
        topLanguages: [
          { language: 'TypeScript', percentage: 42 },
          { language: 'JavaScript', percentage: 28 },
          { language: 'Python', percentage: 15 },
          { language: 'Go', percentage: 10 },
          { language: 'Rust', percentage: 5 },
        ],
        lastUpdated: new Date().toISOString(),
      },
      templateId: 'minimal-dark',
    };
  }

  /**
   * Get current profile data
   * @returns Current profile data or undefined
   */
  getProfileData(): ProfileData | undefined {
    return this.profileData;
  }

  /**
   * Get authenticated GitHub user
   */
  private async getAuthenticatedUser(): Promise<string> {
    if (!this.githubClient) {
      throw new Error('GitHub client not initialized');
    }
    const { data } = await this.githubClient['octokit'].rest.users.getAuthenticated();
    return data.login;
  }

  /**
   * Build social links from GitHub profile
   */
  private buildSocialLinks(): any[] {
    const links: any[] = [];

    if (this.githubData?.profile?.twitterUsername) {
      links.push({
        platform: 'Twitter',
        url: `https://twitter.com/${this.githubData.profile.twitterUsername}`,
      });
    }

    if (this.githubData?.profile?.blog) {
      links.push({
        platform: 'Website',
        url: this.githubData.profile.blog,
      });
    }

    return links;
  }
}

// Export main class and types
export * from './types/profile';
export * from './errors';
export type { AIConfig, ExtractionContext, ExtractionResult } from './ai';
export type { ParsedSource } from './parsers';
export type { GitHubRepository, GitHubProfile } from './github';
export type { Template, TemplateConfig } from './templates/loader';
