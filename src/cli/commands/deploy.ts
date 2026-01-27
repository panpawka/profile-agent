import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { Octokit } from 'octokit';
import { ConfigManager } from '../../config';
import { ActionsGenerator } from '../../github/actions';
import type { ProfileData } from '../../types/profile';

export interface DeployOptions {
  setupAction?: boolean;
  noAction?: boolean;
}

export async function deployCommand(options: DeployOptions = {}) {
  console.log(chalk.blue('🚀 Deploying to GitHub...\n'));

  const spinner = ora();

  // Load config
  const configManager = new ConfigManager();
  let config;

  try {
    config = configManager.get();
  } catch (error) {
    console.log(chalk.red('Config not found. Run "profile-agent init" first.'));
    return;
  }

  // Check if README exists
  const readmePath = path.join(process.cwd(), 'README.md');
  if (!fs.existsSync(readmePath)) {
    console.log(chalk.red('README.md not found. Run "profile-agent generate" first.'));
    return;
  }

  // Check for GitHub token
  const githubToken = config.githubToken || process.env.GITHUB_TOKEN;
  if (!githubToken) {
    console.log(chalk.red('GitHub token not configured. Set GITHUB_TOKEN environment variable.'));
    return;
  }

  const octokit = new Octokit({ auth: githubToken });

  try {
    // Get authenticated user
    spinner.start('Getting GitHub user info...');
    const { data: user } = await octokit.rest.users.getAuthenticated();
    const username = user.login;
    spinner.succeed(`Authenticated as @${username}`);

    // Ensure profile repository exists
    spinner.start('Checking profile repository...');
    const repoName = username;
    let repoExists = false;

    try {
      await octokit.rest.repos.get({ owner: username, repo: repoName });
      repoExists = true;
      spinner.succeed('Profile repository found');
    } catch (error: any) {
      if (error.status === 404) {
        spinner.text = 'Creating profile repository...';
        await octokit.rest.repos.createForAuthenticatedUser({
          name: repoName,
          description: `${username}'s GitHub Profile`,
          auto_init: false,
          private: false,
        });
        spinner.succeed('Profile repository created');
        repoExists = true;
      } else {
        throw error;
      }
    }

    // Read README content
    const readmeContent = fs.readFileSync(readmePath, 'utf-8');

    // Push README to repository
    spinner.start('Uploading README...');

    let currentSha: string | undefined;

    // Check if README already exists
    try {
      const { data: existingFile } = await octokit.rest.repos.getContent({
        owner: username,
        repo: repoName,
        path: 'README.md',
      });

      if ('sha' in existingFile) {
        currentSha = existingFile.sha;
      }
    } catch (error: any) {
      // README doesn't exist yet, that's fine
      if (error.status !== 404) {
        throw error;
      }
    }

    // Create or update README
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: username,
      repo: repoName,
      path: 'README.md',
      message: currentSha
        ? '📝 Update profile README via ProfileAgent'
        : '🎉 Initial profile README via ProfileAgent',
      content: Buffer.from(readmeContent).toString('base64'),
      sha: currentSha,
    });

    spinner.succeed('README uploaded successfully');

    // Setup GitHub Actions if requested
    if (options.setupAction || (!options.noAction && config.updateFrequency !== 'manual')) {
      spinner.start('Setting up GitHub Actions...');

      const actionsGen = new ActionsGenerator();
      const workflowYaml = actionsGen.generate({
        frequency: config.updateFrequency || 'weekly',
        aiProvider: config.aiProvider,
      });

      // Check if .github/workflows directory structure exists
      let workflowSha: string | undefined;

      try {
        const { data: existingWorkflow } = await octokit.rest.repos.getContent({
          owner: username,
          repo: repoName,
          path: '.github/workflows/update-profile.yml',
        });

        if ('sha' in existingWorkflow) {
          workflowSha = existingWorkflow.sha;
        }
      } catch (error: any) {
        // Workflow doesn't exist, that's expected
        if (error.status !== 404) {
          throw error;
        }
      }

      // Create or update workflow file
      await octokit.rest.repos.createOrUpdateFileContents({
        owner: username,
        repo: repoName,
        path: '.github/workflows/update-profile.yml',
        message: workflowSha
          ? '⚙️ Update ProfileAgent workflow'
          : '⚙️ Setup ProfileAgent auto-update workflow',
        content: Buffer.from(workflowYaml).toString('base64'),
        sha: workflowSha,
      });

      spinner.succeed('GitHub Actions workflow configured');

      console.log(chalk.yellow('\n⚠️  Important: Add your API key as a repository secret'));
      console.log(chalk.white(`   Go to: https://github.com/${username}/${repoName}/settings/secrets/actions`));
      console.log(chalk.white(`   Add secret: ${config.aiProvider === 'gemini' ? 'GEMINI_API_KEY' : 'OPENAI_API_KEY'}\n`));
    }

    console.log(chalk.green('\n✅ Deployment successful!'));
    console.log(chalk.blue(`\n🔗 View your profile: https://github.com/${username}`));
  } catch (error) {
    spinner.fail('Deployment failed');
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log(chalk.red(`\nError: ${message}`));
  }
}
