import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { ConfigManager } from '../../config';
import { ParserEngine } from '../../parsers';
import { GitHubClient } from '../../github';

export interface AddOptions {
  cv?: string;
  linkedin?: string;
  github?: boolean | string;
  text?: string;
}

export async function addCommand(options: AddOptions) {
  console.log(chalk.blue('Adding context sources...'));

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
    fs.mkdirSync(sourcesDir, { recursive: true });
  }

  // Handle CV upload
  if (options.cv) {
    await handleCVUpload(options.cv, sourcesDir);
  }

  // Handle LinkedIn upload
  if (options.linkedin) {
    await handleLinkedInUpload(options.linkedin, sourcesDir);
  }

  // Handle GitHub connection
  if (options.github) {
    await handleGitHubConnection(config, sourcesDir);
  }

  // Handle custom text
  if (options.text) {
    await handleCustomText(options.text, sourcesDir);
  }

  console.log(chalk.green('\n✔ Sources added successfully!'));
  console.log(chalk.blue('Next step: Run "profile-agent extract" to process sources'));
}

async function handleCVUpload(cvPath: string, sourcesDir: string) {
  if (!fs.existsSync(cvPath)) {
    console.log(chalk.red(`CV file not found: ${cvPath}`));
    return;
  }

  const parser = new ParserEngine();

  try {
    console.log(chalk.blue('📄 Parsing CV...'));
    const result = await parser.parseFile(cvPath);

    // Save parsed content
    const outputPath = path.join(sourcesDir, 'cv.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify(
        {
          type: 'cv',
          originalFile: cvPath,
          content: result.content,
          metadata: result.metadata,
          parsedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );

    console.log(chalk.green(`✔ CV parsed (${result.content.length} characters)`));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log(chalk.red(`✗ Failed to parse CV: ${message}`));
  }
}

async function handleLinkedInUpload(linkedinPath: string, sourcesDir: string) {
  if (!fs.existsSync(linkedinPath)) {
    console.log(chalk.red(`LinkedIn file not found: ${linkedinPath}`));
    return;
  }

  const parser = new ParserEngine();

  try {
    console.log(chalk.blue('📄 Parsing LinkedIn export...'));
    const result = await parser.parseFile(linkedinPath);

    // Save parsed content
    const outputPath = path.join(sourcesDir, 'linkedin.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify(
        {
          type: 'linkedin',
          originalFile: linkedinPath,
          content: result.content,
          metadata: result.metadata,
          parsedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );

    console.log(chalk.green(`✔ LinkedIn data parsed (${result.content.length} characters)`));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log(chalk.red(`✗ Failed to parse LinkedIn data: ${message}`));
  }
}

async function handleGitHubConnection(config: any, sourcesDir: string) {
  console.log(chalk.blue('🐙 Fetching GitHub data...'));

  const githubToken = config.githubToken || process.env.GITHUB_TOKEN;
  if (!githubToken) {
    console.log(chalk.yellow('⚠ GitHub token not configured. Set GITHUB_TOKEN environment variable.'));
    return;
  }

  const github = new GitHubClient(githubToken);

  try {
    // Get authenticated user
    const { data } = await github['octokit'].rest.users.getAuthenticated();
    const username = data.login;

    console.log(chalk.blue(`Fetching data for @${username}...`));

    // Fetch profile and repositories
    const [profile, stats] = await Promise.all([
      github.fetchProfile(username),
      github.calculateStats(username),
    ]);

    // Save GitHub data
    const outputPath = path.join(sourcesDir, 'github.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify(
        {
          type: 'github',
          profile,
          stats,
          fetchedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );

    console.log(chalk.green(`✔ GitHub data fetched (@${username}, ${stats.totalRepos} repos)`));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log(chalk.red(`✗ Failed to fetch GitHub data: ${message}`));
  }
}

async function handleCustomText(text: string, sourcesDir: string) {
  console.log(chalk.blue('📝 Adding custom text...'));

  const customTextsPath = path.join(sourcesDir, 'custom-texts.json');
  let customTexts: string[] = [];

  // Load existing custom texts
  if (fs.existsSync(customTextsPath)) {
    customTexts = JSON.parse(fs.readFileSync(customTextsPath, 'utf-8'));
  }

  // Add new text
  customTexts.push(text);

  // Save updated custom texts
  fs.writeFileSync(customTextsPath, JSON.stringify(customTexts, null, 2));

  console.log(chalk.green(`✔ Custom text added (${text.length} characters)`));
}
