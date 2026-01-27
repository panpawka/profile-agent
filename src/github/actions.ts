export interface GitHubActionConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'manual';
  aiProvider: 'gemini' | 'openai';
}

export class ActionsGenerator {
  /**
   * Generate GitHub Actions workflow YAML
   * @param config Action configuration
   * @returns YAML content
   */
  generate(config: GitHubActionConfig): string {
    const cronSchedule = this.getCronSchedule(config.frequency);
    
    return `name: Update Profile README

on:
${cronSchedule ? `  schedule:
    - cron: '${cronSchedule}'  # ${this.getFrequencyLabel(config.frequency)}
` : ''}  workflow_dispatch:      # Manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install ProfileAgent
        run: npm install -g profile-agent
      
      - name: Update Profile
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          ${config.aiProvider === 'gemini' ? 'GEMINI_API_KEY' : 'OPENAI_API_KEY'}: \${{ secrets.${config.aiProvider === 'gemini' ? 'GEMINI_API_KEY' : 'OPENAI_API_KEY'} }}
        run: |
          # Only refresh GitHub stats, skip AI re-extraction
          profile-agent add --github
          profile-agent generate
      
      - name: Commit Changes
        run: |
          git config user.name "ProfileAgent Bot"
          git config user.email "bot@profile-agent.dev"
          git add README.md
          git diff --quiet && git diff --staged --quiet || git commit -m "📊 Update profile stats [skip ci]"
          git push
`;
  }

  /**
   * Get cron schedule for frequency
   */
  private getCronSchedule(frequency: GitHubActionConfig['frequency']): string | null {
    switch (frequency) {
      case 'daily':
        return '0 0 * * *';
      case 'weekly':
        return '0 0 * * 0';
      case 'monthly':
        return '0 0 1 * *';
      case 'manual':
        return null;
      default:
        return '0 0 * * 0'; // Default to weekly
    }
  }

  /**
   * Get human-readable frequency label
   */
  private getFrequencyLabel(frequency: GitHubActionConfig['frequency']): string {
    switch (frequency) {
      case 'daily':
        return 'Daily at midnight UTC';
      case 'weekly':
        return 'Weekly on Sunday';
      case 'monthly':
        return 'Monthly on the 1st';
      case 'manual':
        return 'Manual only';
      default:
        return 'Weekly on Sunday';
    }
  }
}
