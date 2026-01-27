import { Octokit } from 'octokit';

export interface GitHubRepository {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  pushedAt: string | null;
}

export interface GitHubProfile {
  username: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  blog: string | null;
  twitterUsername: string | null;
  company: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
}

export interface GitHubStats {
  username: string;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  topLanguages: { language: string; count: number }[];
  featuredRepos: GitHubRepository[];
  lastUpdated?: string;
}

export class GitHubClient {
  private octokit: Octokit;

  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token || process.env.GITHUB_TOKEN,
    });
  }

  /**
   * Fetch user profile information
   * @param username GitHub username
   * @returns User profile data
   */
  async fetchProfile(username: string): Promise<GitHubProfile> {
    try {
      const { data } = await this.octokit.rest.users.getByUsername({
        username,
      });

      return {
        username: data.login,
        name: data.name,
        bio: data.bio,
        location: data.location,
        email: data.email,
        blog: data.blog,
        twitterUsername: data.twitter_username,
        company: data.company,
        publicRepos: data.public_repos,
        followers: data.followers,
        following: data.following,
        createdAt: data.created_at,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch GitHub profile for ${username}: ${message}`);
    }
  }

  /**
   * Fetch all public repositories for a user
   * @param username GitHub username
   * @returns Array of repositories
   */
  async fetchRepositories(username: string): Promise<GitHubRepository[]> {
    try {
      const repos: GitHubRepository[] = [];
      let page = 1;
      const perPage = 100;

      while (true) {
        const { data } = await this.octokit.rest.repos.listForUser({
          username,
          type: 'owner',
          sort: 'updated',
          per_page: perPage,
          page,
        });

        if (data.length === 0) break;

        repos.push(
          ...data.map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            homepage: repo.homepage,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            topics: repo.topics || [],
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            pushedAt: repo.pushed_at,
          }))
        );

        if (data.length < perPage) break;
        page++;
      }

      return repos;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch repositories for ${username}: ${message}`);
    }
  }

  /**
   * Calculate GitHub statistics from repositories
   * @param username GitHub username
   * @returns Aggregated stats
   */
  async calculateStats(username: string): Promise<GitHubStats> {
    const repos = await this.fetchRepositories(username);

    const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks, 0);

    // Calculate top languages
    const languageCounts: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languageCounts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get featured repos (most stars, recent activity)
    const featuredRepos = repos
      .filter((repo) => !repo.name.startsWith('.')) // Filter out hidden repos
      .sort((a, b) => {
        // Prioritize repos with stars and recent updates
        const scoreA = a.stars * 10 + (a.pushedAt ? 1 : 0);
        const scoreB = b.stars * 10 + (b.pushedAt ? 1 : 0);
        return scoreB - scoreA;
      })
      .slice(0, 6);

    return {
      username,
      totalRepos: repos.length,
      totalStars,
      totalForks,
      topLanguages,
      featuredRepos,
    };
  }

  /**
   * Fetch README content from a repository
   * @param username Repository owner
   * @param repo Repository name
   * @returns README content as markdown
   */
  async fetchReadme(username: string, repo: string): Promise<string | null> {
    try {
      const { data } = await this.octokit.rest.repos.getReadme({
        owner: username,
        repo,
      });

      // Decode base64 content
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return content;
    } catch (error) {
      // README might not exist
      return null;
    }
  }
}
