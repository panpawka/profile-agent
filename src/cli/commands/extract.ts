import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { ConfigManager } from '../../config';
import { AIExtractor, ExtractionContext } from '../../ai';
import type { ProfileData, GitHubStats } from '../../types/profile';

export interface ExtractOptions {
  refresh?: boolean;
  edit?: boolean;
}

export async function extractCommand(options: ExtractOptions = {}) {
  console.log(chalk.blue('🤖 Extracting profile data with AI...\n'));

  const configManager = new ConfigManager();
  let config;

  try {
    config = configManager.get();
  } catch (error) {
    console.log(chalk.red('Config not found. Run "profile-agent init" first.'));
    return;
  }

  const sourcesDir = path.join(process.cwd(), '.profile-agent', 'sources');
  if (!fs.existsSync(sourcesDir)) {
    console.log(chalk.red('No sources found. Run "profile-agent add" to add sources first.'));
    return;
  }

  // Load all sources
  const context: ExtractionContext = {};
  let githubStats: GitHubStats | undefined;

  // Load CV
  const cvPath = path.join(sourcesDir, 'cv.json');
  if (fs.existsSync(cvPath)) {
    const cvData = JSON.parse(fs.readFileSync(cvPath, 'utf-8'));
    context.cvText = cvData.content;
    console.log(chalk.green('✔ Loaded CV'));
  }

  // Load LinkedIn
  const linkedinPath = path.join(sourcesDir, 'linkedin.json');
  if (fs.existsSync(linkedinPath)) {
    const linkedinData = JSON.parse(fs.readFileSync(linkedinPath, 'utf-8'));
    context.linkedinText = linkedinData.content;
    console.log(chalk.green('✔ Loaded LinkedIn data'));
  }

  // Load GitHub
  const githubPath = path.join(sourcesDir, 'github.json');
  if (fs.existsSync(githubPath)) {
    const githubData = JSON.parse(fs.readFileSync(githubPath, 'utf-8'));
    context.githubProfile = githubData.profile;
    context.githubRepos = githubData.stats.featuredRepos;
    context.githubStats = githubData.stats;
    githubStats = {
      username: githubData.profile.username,
      totalRepos: githubData.stats.totalRepos,
      totalStars: githubData.stats.totalStars,
      totalForks: githubData.stats.totalForks,
      topLanguages: githubData.stats.topLanguages.map((l: any) => ({
        language: l.language,
        percentage: Math.round((l.count / githubData.stats.totalRepos) * 100),
      })),
      lastUpdated: new Date().toISOString(),
    };
    console.log(chalk.green('✔ Loaded GitHub data'));
  }

  // Load custom texts
  const customTextsPath = path.join(sourcesDir, 'custom-texts.json');
  if (fs.existsSync(customTextsPath)) {
    context.customText = JSON.parse(fs.readFileSync(customTextsPath, 'utf-8'));
    console.log(chalk.green(`✔ Loaded ${context.customText?.length || 0} custom text(s)`));
  }

  if (
    !context.cvText &&
    !context.linkedinText &&
    !context.githubProfile &&
    !context.customText
  ) {
    console.log(chalk.red('No sources available. Add sources first.'));
    return;
  }

  console.log('');

  // Initialize AI extractor
  const aiProvider = config.aiProvider || 'gemini';
  const aiApiKey = config.aiApiKey || process.env[`${aiProvider.toUpperCase()}_API_KEY`];

  if (!aiApiKey) {
    console.log(chalk.red(`${aiProvider.toUpperCase()} API key not configured.`));
    console.log(chalk.yellow(`Set ${aiProvider.toUpperCase()}_API_KEY environment variable.`));
    return;
  }

  const extractor = new AIExtractor({
    provider: aiProvider,
    apiKey: aiApiKey,
  });

  // Run extraction with progress indicators
  const spinner = ora();

  try {
    spinner.start('Extracting skills and expertise...');
    const result = await extractor.extract(context);
    spinner.succeed('AI extraction complete!');

    // Build profile data
    const profileData: ProfileData = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      name: context.githubProfile?.name || 'Your Name',
      headline: 'Software Developer',
      bio: result.bio,
      location: context.githubProfile?.location || undefined,
      email: config.includeEmail ? context.githubProfile?.email : undefined,
      skills: result.skills,
      achievements: result.achievements,
      experience: [], // TODO: Extract from CV/LinkedIn
      projects: result.projects,
      education: [], // TODO: Extract from CV/LinkedIn
      certifications: [], // TODO: Extract from CV/LinkedIn
      socialLinks: buildSocialLinks(context.githubProfile),
      githubStats: githubStats || {
        username: 'username',
        totalRepos: 0,
        totalStars: 0,
        totalForks: 0,
        topLanguages: [],
        lastUpdated: new Date().toISOString(),
      },
      templateId: config.defaultTemplate || 'minimal-dark',
    };

    // Save profile data
    const profileDataPath = path.join(process.cwd(), '.profile-agent', 'profile-data.json');
    fs.writeFileSync(profileDataPath, JSON.stringify(profileData, null, 2));

    console.log(chalk.green('\n✔ Profile data saved to .profile-agent/profile-data.json'));
    console.log(chalk.blue('\nExtracted:'));
    console.log(chalk.white(`  • ${result.skills.length} skill categories`));
    console.log(chalk.white(`  • ${result.achievements.length} achievements`));
    console.log(chalk.white(`  • ${result.projects.length} projects`));
    console.log(chalk.white(`  • Bio: ${result.bio.substring(0, 60)}...`));

    console.log(chalk.blue('\nNext step: Run "profile-agent generate" to create your README'));
  } catch (error) {
    spinner.fail('Extraction failed');
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log(chalk.red(`\nError: ${message}`));
  }
}

function buildSocialLinks(githubProfile: any): any[] {
  const links: any[] = [];

  if (githubProfile?.twitterUsername) {
    links.push({
      platform: 'Twitter',
      url: `https://twitter.com/${githubProfile.twitterUsername}`,
    });
  }

  if (githubProfile?.blog) {
    links.push({
      platform: 'Website',
      url: githubProfile.blog,
    });
  }

  return links;
}
