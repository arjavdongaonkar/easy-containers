const chalk = require('chalk');
const ora = require('ora');
const { getServicePath, getServiceInfo } = require('../utils/config');
const fs = require('fs').promises;
const yaml = require('js-yaml');
const path = require('path');

async function show(service) {
  const spinner = ora(`Loading ${service} details...`).start();

  try {
    const servicePath = getServicePath(service);
    
    // Check if service exists
    try {
      await fs.access(servicePath);
    } catch {
      spinner.fail(chalk.red(`Service "${service}" not found`));
      console.log(chalk.gray('\nUse "easy list" to see available services.'));
      return;
    }

    // Read docker-compose file
    const composePath = path.join(servicePath, 'docker-compose.yml');
    let composeContent;
    
    try {
      const fileContent = await fs.readFile(composePath, 'utf8');
      composeContent = yaml.load(fileContent);
    } catch (error) {
      spinner.fail(chalk.red('Failed to read docker-compose.yml'));
      throw error;
    }

    spinner.stop();

    // Display service information
    console.log(chalk.bold.cyan(`\n ${service.toUpperCase()}\n`));
    console.log(chalk.gray('─'.repeat(60)));

    // Basic info
    console.log(chalk.bold('\n🔧 Configuration:'));
    console.log(chalk.gray(`   Location: ${servicePath}`));
    console.log(chalk.gray(`   Compose File: docker-compose.yml`));

    // Services
    if (composeContent.services) {
      console.log(chalk.bold('\n🐳 Containers:'));
      Object.entries(composeContent.services).forEach(([name, config]) => {
        console.log(chalk.cyan(`\n   ${name}:`));
        if (config.image) {
          console.log(chalk.gray(`      Image: ${config.image}`));
        }
        if (config.ports) {
          console.log(chalk.gray('      Ports:'));
          config.ports.forEach(port => {
            console.log(chalk.gray(`        - ${port}`));
          });
        }
        if (config.environment) {
          console.log(chalk.gray('      Environment:'));
          const envs = Array.isArray(config.environment) 
            ? config.environment 
            : Object.entries(config.environment).map(([k, v]) => `${k}=${v}`);
          envs.slice(0, 5).forEach(env => {
            console.log(chalk.gray(`        - ${env}`));
          });
          if (envs.length > 5) {
            console.log(chalk.gray(`        ... and ${envs.length - 5} more`));
          }
        }
        if (config.volumes) {
          console.log(chalk.gray('      Volumes:'));
          config.volumes.slice(0, 3).forEach(vol => {
            console.log(chalk.gray(`        - ${vol}`));
          });
          if (config.volumes.length > 3) {
            console.log(chalk.gray(`        ... and ${config.volumes.length - 3} more`));
          }
        }
      });
    }

    // Networks
    if (composeContent.networks) {
      console.log(chalk.bold('\n🌐 Networks:'));
      Object.keys(composeContent.networks).forEach(network => {
        console.log(chalk.gray(`   - ${network}`));
      });
    }

    // Volumes
    if (composeContent.volumes) {
      console.log(chalk.bold('\n💾 Volumes:'));
      Object.keys(composeContent.volumes).forEach(volume => {
        console.log(chalk.gray(`   - ${volume}`));
      });
    }

    console.log(chalk.gray('\n' + '─'.repeat(60)));
    console.log(chalk.bold.green('\n✓ Configuration loaded successfully\n'));

    // Usage hints
    console.log(chalk.yellow('💡 Quick commands:'));
    console.log(chalk.gray(`   easy up ${service}      - Start the service`));
    console.log(chalk.gray(`   easy down ${service}    - Stop the service`));
    console.log(chalk.gray(`   easy logs ${service}    - View logs`));
    console.log(chalk.gray(`   easy restart ${service} - Restart the service\n`));

  } catch (error) {
    spinner.fail(chalk.red(`Failed to show ${service} details`));
    throw error;
  }
}

module.exports = { show };