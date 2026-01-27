import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import type { ProfileData } from '../../types/profile';

export interface EditOptions {
  file?: boolean;
}

export async function editCommand(options: EditOptions = {}) {
  const profileDataPath = path.join(process.cwd(), '.profile-agent', 'profile-data.json');

  if (!fs.existsSync(profileDataPath)) {
    console.log(chalk.red('Profile data not found. Run "profile-agent extract" first.'));
    return;
  }

  if (options.file) {
    // Open in external editor
    const editor = process.env.EDITOR || 'nano';
    console.log(chalk.blue(`Opening profile-data.json in ${editor}...`));
    console.log(chalk.white(`\nEdit the file and save when done.`));
    console.log(chalk.white(`File location: ${profileDataPath}\n`));
    
    const { spawn } = require('child_process');
    const child = spawn(editor, [profileDataPath], {
      stdio: 'inherit'
    });

    child.on('exit', () => {
      console.log(chalk.green('\n✔ File editor closed'));
    });
  } else {
    // Interactive terminal editor
    const profileData: ProfileData = JSON.parse(
      fs.readFileSync(profileDataPath, 'utf-8')
    );

    console.log(chalk.blue('📝 Interactive Profile Editor\n'));

    const { section } = await inquirer.prompt([
      {
        type: 'list',
        name: 'section',
        message: 'What would you like to edit?',
        choices: [
          { name: `Personal Info (Name, Bio)`, value: 'personal' },
          { name: `Skills (${profileData.skills.length} categories)`, value: 'skills' },
          { name: `Achievements (${profileData.achievements.length} items)`, value: 'achievements' },
          { name: `Projects (${profileData.projects.length} projects)`, value: 'projects' },
          { name: 'Template Settings', value: 'template' },
          { name: 'Save and Exit', value: 'exit' },
        ],
      },
    ]);

    if (section === 'exit') {
      console.log(chalk.green('No changes made.'));
      return;
    }

    switch (section) {
      case 'personal':
        await editPersonalInfo(profileData);
        break;
      case 'skills':
        console.log(chalk.yellow('Skills editing coming soon! Use --file for now.'));
        break;
      case 'achievements':
        await editAchievements(profileData);
        break;
      case 'projects':
        console.log(chalk.yellow('Project editing coming soon! Use --file for now.'));
        break;
      case 'template':
        await editTemplate(profileData);
        break;
    }

    // Save changes
    fs.writeFileSync(profileDataPath, JSON.stringify(profileData, null, 2));
    console.log(chalk.green('\n✔ Changes saved!'));
  }
}

async function editPersonalInfo(profileData: ProfileData) {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Name:',
      default: profileData.name,
    },
    {
      type: 'input',
      name: 'headline',
      message: 'Headline:',
      default: profileData.headline,
    },
    {
      type: 'editor',
      name: 'bio',
      message: 'Bio (opens editor):',
      default: profileData.bio,
    },
  ]);

  profileData.name = answers.name;
  profileData.headline = answers.headline;
  profileData.bio = answers.bio;
  profileData.lastEditedAt = new Date().toISOString();
}

async function editAchievements(profileData: ProfileData) {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Achievement actions:',
      choices: [
        'Toggle highlights',
        'Remove achievement',
        'Add new achievement',
        'Back',
      ],
    },
  ]);

  if (action === 'Back') return;

  if (action === 'Toggle highlights') {
    const { selected } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message: 'Select achievements to highlight:',
        choices: profileData.achievements.map((ach, i) => ({
          name: ach.text,
          value: i,
          checked: ach.isHighlighted,
        })),
      },
    ]);

    profileData.achievements.forEach((ach, i) => {
      ach.isHighlighted = selected.includes(i);
    });
  }
}

async function editTemplate(profileData: ProfileData) {
  const { templateId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'templateId',
      message: 'Select template:',
      choices: [
        'minimal-dark',
        'minimal-light',
        'portfolio-grid',
        'stats-heavy',
        'narrative',
      ],
      default: profileData.templateId,
    },
  ]);

  profileData.templateId = templateId;
  profileData.lastEditedAt = new Date().toISOString();
}
