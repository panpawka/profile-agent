import chalk from 'chalk';
import inquirer from 'inquirer';
import { TemplateRenderer } from '../../templates';
import { ProfileAgent } from '../../index';
import * as dotenv from 'dotenv';

dotenv.config();

export async function previewCommand(options: { template?: string }) {
  try {
    console.log(chalk.blue('📋 Template Preview'));
    console.log();

    const renderer = new TemplateRenderer();
    const templates = renderer.listTemplates();

    // Get template ID
    let templateId = options.template;
    if (!templateId) {
      const { selectedTemplate } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedTemplate',
          message: 'Select a template to preview:',
          choices: templates.map((t) => ({
            name: `${t.id} - ${t.description}`,
            value: t.id,
          })),
        },
      ]);
      templateId = selectedTemplate;
    }

    // Check if template exists
    const templateExists = templates.some((t) => t.id === templateId);
    if (!templateExists) {
      console.log(chalk.red(`❌ Template "${templateId}" not found.`));
      console.log();
      console.log(chalk.yellow('Available templates:'));
      templates.forEach((t) => {
        console.log(chalk.cyan(`  - ${t.id}: ${t.description}`));
      });
      process.exit(1);
    }

    console.log(chalk.green(`\n✓ Previewing template: ${templateId}`));
    console.log(chalk.dim('Using sample profile data...\n'));

    // Initialize ProfileAgent with minimal config for preview
    const agent = new ProfileAgent({
      aiProvider: 'gemini',
      aiApiKey: process.env.GEMINI_API_KEY,
    });

    // Generate preview with sample data (templateId is guaranteed to be defined here)
    const preview = await agent.preview(templateId!, true);

    // Display preview
    console.log(chalk.gray('─'.repeat(80)));
    console.log(preview);
    console.log(chalk.gray('─'.repeat(80)));

    console.log();
    console.log(chalk.green('✓ Preview generated successfully!'));
    console.log();
    console.log(chalk.dim('To generate with your own data:'));
    console.log(chalk.dim('  1. Run: profile-agent add --cv resume.pdf --github'));
    console.log(chalk.dim('  2. Run: profile-agent extract'));
    console.log(chalk.dim(`  3. Run: profile-agent generate --theme ${templateId}`));
  } catch (error: any) {
    console.error(chalk.red('❌ Preview failed:'), error.message);
    process.exit(1);
  }
}
