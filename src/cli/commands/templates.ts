import chalk from 'chalk';
import { TemplateRenderer } from '../../templates';

export interface TemplatesOptions {
  list?: boolean;
}

export async function templatesCommand() {
  console.log(chalk.blue('📋 Available Templates\n'));

  const renderer = new TemplateRenderer();
  const templates = renderer.listTemplates();

  if (templates.length === 0) {
    console.log(chalk.yellow('No templates found.'));
    return;
  }

  templates.forEach((template) => {
    console.log(chalk.green(`\n${template.name} (${template.id})`));
    console.log(chalk.white(`  ${template.description}`));
    console.log(chalk.gray(`  Version: ${template.version}`));
    
    if (template.features) {
      const features = [];
      if (template.features.showStats) features.push('Stats');
      if (template.features.showProjects) features.push('Projects');
      if (template.features.showAchievements) features.push('Achievements');
      console.log(chalk.gray(`  Features: ${features.join(', ')}`));
    }
  });

  console.log(chalk.blue('\nUsage:'));
  console.log(chalk.white('  profile-agent generate --theme <template-id>\n'));
}
