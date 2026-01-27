import { Octokit } from 'octokit';
import chalk from 'chalk';

export interface OAuthResult {
  token: string;
  username: string;
}

export class GitHubOAuth {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit();
  }

  /**
   * Perform GitHub Device Flow OAuth
   * @returns Access token and username
   */
  async authenticate(): Promise<OAuthResult> {
    console.log(chalk.blue('\n🔐 GitHub Authentication Required\n'));

    // For MVP, we'll use personal access token approach
    // In production, implement proper OAuth flow with GitHub App
    
    console.log(chalk.yellow('Please create a GitHub Personal Access Token:'));
    console.log(chalk.white('1. Go to: https://github.com/settings/tokens/new'));
    console.log(chalk.white('2. Set description: "ProfileAgent"'));
    console.log(chalk.white('3. Select scopes: repo, read:user, workflow'));
    console.log(chalk.white('4. Click "Generate token" and copy it\n'));

    // In a real implementation, we would:
    // 1. Use device flow API
    // 2. Display user code
    // 3. Poll for authorization
    // 4. Exchange for token
    
    // For now, direct users to use GITHUB_TOKEN env var
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      throw new Error('GITHUB_TOKEN environment variable not set. Please set it and try again.');
    }

    // Validate token and get user
    const authedOctokit = new Octokit({ auth: token });
    const { data: user } = await authedOctokit.rest.users.getAuthenticated();

    console.log(chalk.green(`✔ Authenticated as @${user.login}\n`));

    return {
      token,
      username: user.login,
    };
  }

  /**
   * Test if a token is valid
   * @param token GitHub token
   * @returns Whether token is valid
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      const testOctokit = new Octokit({ auth: token });
      await testOctokit.rest.users.getAuthenticated();
      return true;
    } catch {
      return false;
    }
  }
}
