const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const fs = require('fs').promises;
const path = require('path');
const { getServicePath } = require('../utils/config');

/**
 * Manage service configuration and environment variables
 */
async function config(service, options = {}) {
  const spinner = ora(`Loading configuration for ${service}...`).start();

  try {
    const servicePath = getServicePath(service);
    
    // Check if service exists
    try {
      await fs.access(servicePath);
    } catch {
      spinner.fail(chalk.red(`Service "${service}" not found`));
      console.log(chalk.gray('\nUse "easy up <service>" to install the service first.\n'));
      return;
    }

    spinner.stop();

    // Check for env.sample or .env.example
    const envSamplePath = await findEnvSample(servicePath);
    const envPath = path.join(servicePath, '.env');

    if (options.edit) {
      // Edit existing .env file
      await editEnvFile(servicePath, envPath, envSamplePath);
    } else if (options.reset) {
      // Reset to sample
      await resetEnvFile(servicePath, envPath, envSamplePath);
    } else if (options.show) {
      // Show current configuration
      await showEnvFile(servicePath, envPath);
    } else {
      // Interactive configuration
      await interactiveConfig(service, servicePath, envPath, envSamplePath);
    }

  } catch (error) {
    spinner.fail(chalk.red(`Failed to manage configuration for ${service}`));
    throw error;
  }
}

/**
 * Find env sample file (env.sample, .env.sample, .env.example)
 */
async function findEnvSample(servicePath) {
  const possibleNames = ['env.sample', '.env.sample', '.env.example', 'env.example'];
  
  for (const name of possibleNames) {
    const filePath = path.join(servicePath, name);
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      continue;
    }
  }
  
  return null;
}

/**
 * Parse env file into key-value pairs with comments
 */
async function parseEnvFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split('\n');
    const config = [];
    let currentComment = '';

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Capture comments
      if (trimmed.startsWith('#')) {
        currentComment += trimmed.substring(1).trim() + ' ';
        continue;
      }
      
      // Parse key=value
      if (trimmed && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim();
        
        config.push({
          key: key.trim(),
          value: value.replace(/^["']|["']$/g, ''), // Remove quotes
          comment: currentComment.trim(),
          original: line
        });
        
        currentComment = '';
      } else if (trimmed === '') {
        currentComment = '';
      }
    }
    
    return config;
  } catch {
    return [];
  }
}

/**
 * Interactive configuration wizard
 */
async function interactiveConfig(service, servicePath, envPath, envSamplePath) {
  console.log(chalk.bold.cyan(`\n⚙️  Configure ${service}\n`));
  console.log(chalk.gray('─'.repeat(60)));

  // Check if .env already exists
  let existingConfig = [];
  try {
    await fs.access(envPath);
    existingConfig = await parseEnvFile(envPath);
    console.log(chalk.yellow('\n⚠️  Existing .env file found\n'));
    
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Edit existing configuration', value: 'edit' },
          { name: 'Reset to defaults (from sample)', value: 'reset' },
          { name: 'View current configuration', value: 'view' },
          { name: 'Cancel', value: 'cancel' }
        ]
      }
    ]);

    if (action === 'cancel') {
      console.log(chalk.gray('\nConfiguration cancelled.\n'));
      return;
    }

    if (action === 'view') {
      await showEnvFile(servicePath, envPath);
      return;
    }

    if (action === 'reset' && envSamplePath) {
      await resetEnvFile(servicePath, envPath, envSamplePath);
      return;
    }
  } catch {
    // No existing .env file
  }

  // Load sample configuration
  if (!envSamplePath) {
    console.log(chalk.yellow('\n⚠️  No env.sample file found for this service.\n'));
    console.log(chalk.gray('Creating a basic .env file...\n'));
    
    const { createBasic } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'createBasic',
        message: 'Create an empty .env file?',
        default: true
      }
    ]);

    if (createBasic) {
      await fs.writeFile(envPath, '# Environment configuration\n\n');
      console.log(chalk.green(`\n✓ Created ${envPath}\n`));
    }
    return;
  }

  const sampleConfig = await parseEnvFile(envSamplePath);
  
  if (sampleConfig.length === 0) {
    console.log(chalk.yellow('\n⚠️  Sample file is empty or invalid.\n'));
    return;
  }

  console.log(chalk.cyan(`\nFound ${sampleConfig.length} configuration option(s)\n`));
  console.log(chalk.gray('Press Enter to keep default values\n'));

  // Create a map of existing values
  const existingValues = {};
  existingConfig.forEach(item => {
    existingValues[item.key] = item.value;
  });

  // Prompt for each configuration
  const answers = {};
  for (const item of sampleConfig) {
    const defaultValue = existingValues[item.key] || item.value;
    
    let message = item.key;
    if (item.comment) {
      message = `${item.key} (${chalk.dim(item.comment)})`;
    }

    const { value } = await inquirer.prompt([
      {
        type: 'input',
        name: 'value',
        message: message,
        default: defaultValue
      }
    ]);

    answers[item.key] = value;
  }

  // Build .env content
  let envContent = `# ${service} configuration\n`;
  envContent += `# Generated by easy-containers on ${new Date().toISOString()}\n\n`;

  for (const item of sampleConfig) {
    if (item.comment) {
      envContent += `# ${item.comment}\n`;
    }
    envContent += `${item.key}=${answers[item.key]}\n\n`;
  }

  // Write .env file
  await fs.writeFile(envPath, envContent);

  console.log(chalk.green(`\n✓ Configuration saved to .env\n`));
  console.log(chalk.yellow('💡 Restart the service to apply changes:\n'));
  console.log(chalk.gray(`   easy restart ${service}\n`));
}

/**
 * Edit .env file in default editor
 */
async function editEnvFile(servicePath, envPath, envSamplePath) {
  const { spawnSync } = require('child_process');
  
  // Create .env from sample if it doesn't exist
  try {
    await fs.access(envPath);
  } catch {
    if (envSamplePath) {
      console.log(chalk.gray('Creating .env from sample...\n'));
      await fs.copyFile(envSamplePath, envPath);
    } else {
      await fs.writeFile(envPath, '# Environment configuration\n\n');
    }
  }

  // Determine editor
  const editor = process.env.VISUAL || process.env.EDITOR || 'nano';
  
  console.log(chalk.cyan(`\n📝 Opening ${path.basename(envPath)} in ${editor}...\n`));
  
  // Open editor
  const result = spawnSync(editor, [envPath], {
    stdio: 'inherit'
  });

  if (result.status === 0) {
    console.log(chalk.green('\n✓ File saved\n'));
    console.log(chalk.yellow('💡 Restart the service to apply changes:\n'));
    console.log(chalk.gray(`   easy restart ${servicePath.split('/').pop()}\n`));
  } else {
    console.log(chalk.red('\n❌ Editor exited with error\n'));
  }
}

/**
 * Reset .env to sample defaults
 */
async function resetEnvFile(servicePath, envPath, envSamplePath) {
  if (!envSamplePath) {
    console.log(chalk.yellow('\n⚠️  No env.sample file found.\n'));
    return;
  }

  // Backup existing .env
  try {
    await fs.access(envPath);
    const backupPath = `${envPath}.backup-${Date.now()}`;
    await fs.copyFile(envPath, backupPath);
    console.log(chalk.gray(`\nBackup created: ${path.basename(backupPath)}\n`));
  } catch {
    // No existing .env
  }

  // Copy sample to .env
  await fs.copyFile(envSamplePath, envPath);
  
  console.log(chalk.green('✓ Configuration reset to defaults\n'));
  console.log(chalk.yellow('💡 Edit the configuration:\n'));
  console.log(chalk.gray(`   easy config ${servicePath.split('/').pop()} --edit\n`));
}

/**
 * Show current .env configuration
 */
async function showEnvFile(servicePath, envPath) {
  try {
    const content = await fs.readFile(envPath, 'utf8');
    const config = await parseEnvFile(envPath);

    console.log(chalk.bold.cyan(`\nCurrent Configuration:\n`));
    console.log(chalk.gray('─'.repeat(60)));

    if (config.length === 0) {
      console.log(chalk.yellow('\nNo configuration found\n'));
      return;
    }

    // Display as table
    console.log('');
    config.forEach(item => {
      console.log(chalk.bold(item.key));
      console.log(chalk.gray(`  Value: ${item.value || chalk.dim('(empty)')}`));
      if (item.comment) {
        console.log(chalk.dim(`  Note: ${item.comment}`));
      }
      console.log('');
    });

    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.cyan(`\nTotal: ${config.length} variable(s)\n`));
    console.log(chalk.gray(`File: ${envPath}\n`));

  } catch {
    console.log(chalk.yellow('\n⚠️  No .env file found\n'));
    console.log(chalk.gray('Use "easy config <service>" to create one.\n'));
  }
}

module.exports = { config };