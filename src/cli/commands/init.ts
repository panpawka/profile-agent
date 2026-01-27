import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export async function initCommand() {
  console.log(chalk.blue('Initializing ProfileAgent...'));

  const configDir = path.join(process.cwd(), '.profile-agent');

  if (fs.existsSync(configDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'ProfileAgent is already initialized. Overwrite configuration?',
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log('Aborted.');
      return;
    }
  } else {
    fs.mkdirSync(configDir);
  }

  // Create default config
  const defaultConfig = {
    aiProvider: 'gemini',
    updateFrequency: 'weekly',
    includeEmail: false,
    includeLocation: true,
  };

  fs.writeFileSync(
    path.join(configDir, 'config.json'),
    JSON.stringify(defaultConfig, null, 2)
  );

  console.log(chalk.green('✔ Initialized .profile-agent/ directory'));
  console.log(chalk.green('✔ Created default config.json'));
}
