import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { TemplateRenderer } from '../../templates';
import type { ProfileData } from '../../types/profile';

export interface GenerateOptions {
  theme?: string;
  preview?: boolean;
}

export async function generateCommand(options: GenerateOptions = {}) {
  console.log(chalk.blue('📝 Generating README...\n'));

  const profileDataPath = path.join(process.cwd(), '.profile-agent', 'profile-data.json');

  if (!fs.existsSync(profileDataPath)) {
    console.log(chalk.red('Profile data not found. Run "profile-agent extract" first.'));
    return;
  }

  // Load profile data
  const profileData: ProfileData = JSON.parse(
    fs.readFileSync(profileDataPath, 'utf-8')
  );

  // Determine template
  const templateId = options.theme || profileData.templateId || 'minimal-dark';

  // Render template
  const renderer = new TemplateRenderer();

  try {
    console.log(chalk.blue(`Using template: ${templateId}`));
    const readme = await renderer.render(templateId, profileData);

    if (options.preview) {
      // Just show preview, don't save
      console.log(chalk.blue('\n--- README Preview ---\n'));
      console.log(readme);
      console.log(chalk.blue('\n--- End Preview ---'));
      return;
    }

    // Save README
    const readmePath = path.join(process.cwd(), 'README.md');
    fs.writeFileSync(readmePath, readme);

    console.log(chalk.green(`\n✔ README.md generated successfully!`));
    console.log(chalk.white(`   ${readme.length} characters written`));
    console.log(chalk.blue('\nNext step: Review your README.md and commit it to your repository'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log(chalk.red(`\nGeneration failed: ${message}`));
  }
}
