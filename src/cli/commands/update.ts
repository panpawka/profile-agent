import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { ConfigManager } from '../../config';
import { GitHubClient } from '../../github';

export interface UpdateOptions {
  full?: boolean;
}

export async function updateCommand(options: UpdateOptions = {}) {
  console.log(chalk.blue('🔄 Updating profile data...\n'));

  const configManager = new ConfigManager();
  let config;

  try {
    config = configManager.get();
  } catch (error) {
    console.log(chalk.red('Config not found. Run "profile-agent init" first.'));
    return;
  }

  const profileDataPath = path.join(process.cwd(), '.profile-agent', 'profile-data.json');
  
  if (!fs.existsSync(profileDataPath) || options.full) {
    console.log(chalk.yellow('Full update requires re-running extraction.'));
    console.log(chalk.white('Run: profile-agent extract --refresh'));
    return;
  }

  // Quick update: just refresh GitHub stats
  const githubToken = config.githubToken || process.env.GITHUB_TOKEN;
  if (!githubToken) {
    console.log(chalk.yellow('GitHub token not configured. Skipping GitHub stats update.'));
    return;
  }

  const spinner = ora('Fetching latest GitHub stats...').start();

  try {
    const github = new GitHubClient(githubToken);
    const { data } = await github['octokit'].rest.users.getAuthenticated();
    const username = data.login;

    const stats = await github.calculateStats(username);

    // Update profile data
    const profileData = JSON.parse(fs.readFileSync(profileDataPath, 'utf-8'));
    
    profileData.githubStats = {
      username,
      totalRepos: stats.totalRepos,
      totalStars: stats.totalStars,
      totalForks: stats.totalForks,
      totalContributions: 0,
      topLanguages: stats.topLanguages.map((l: any) => ({
        language: l.language,
        percentage: Math.round((l.count / stats.totalRepos) * 100),
      })),
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync(profileDataPath, JSON.stringify(profileData, null, 2));

    spinner.succeed('GitHub stats updated');
    console.log(chalk.green('\n✔ Profile data updated!'));
    console.log(chalk.blue('Next step: Run "profile-agent generate" to update your README'));
  } catch (error) {
    spinner.fail('Update failed');
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log(chalk.red(`\nError: ${message}`));
  }
}
