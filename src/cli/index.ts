#!/usr/bin/env node
import { Command } from 'commander';
import dotenv from 'dotenv';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { extractCommand } from './commands/extract';
import { generateCommand } from './commands/generate';
import { deployCommand } from './commands/deploy';
import { editCommand } from './commands/edit';
import { templatesCommand } from './commands/templates';
import { updateCommand } from './commands/update';

dotenv.config();

const program = new Command();

program
  .name('profile-agent')
  .description('AI-powered GitHub Profile README generator')
  .version('0.5.0');

program
  .command('init')
  .description('Initialize ProfileAgent in the current directory')
  .action(initCommand);

program
  .command('add')
  .description('Add context sources (CV, LinkedIn, GitHub, Text)')
  .option('--cv <path>', 'Path to CV (PDF/DOCX)')
  .option('--linkedin <path>', 'Path to LinkedIn export (PDF)')
  .option('--github', 'Use connected GitHub account')
  .option('--text <content>', 'Custom text content')
  .action(addCommand);

program
  .command('extract')
  .description('Run AI extraction on added sources')
  .option('--refresh', 'Force re-extraction')
  .option('--edit', 'Open editor after extraction')
  .action(extractCommand);

program
  .command('edit')
  .description('Edit extracted profile data')
  .option('--file', 'Open profile-data.json in $EDITOR')
  .action(editCommand);

program
  .command('templates')
  .description('List available templates')
  .action(templatesCommand);

program
  .command('generate')
  .description('Generate README from profile data')
  .option('--theme <id>', 'Template theme ID')
  .option('--preview', 'Show preview without saving')
  .action(generateCommand);

program
  .command('deploy')
  .description('Deploy README to GitHub')
  .option('--setup-action', 'Setup GitHub Actions for auto-updates')
  .option('--no-action', 'Skip GitHub Actions setup')
  .action(deployCommand);

program
  .command('update')
  .description('Update GitHub stats in profile data')
  .option('--full', 'Re-run full AI extraction')
  .action(updateCommand);

program.parse(process.argv);
