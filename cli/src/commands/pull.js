const chalk = require('chalk');
const ora = require('ora');
const { runDockerCompose } = require('../utils/docker');
const { getServicePath } = require('../utils/config');
const fs = require('fs').promises;

async function pull(service, options = {}) {
  const spinner = ora(`Pulling images for ${service}...`).start();

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

    spinner.text = `Pulling latest images for ${service}...`;
    
    // Run docker-compose pull
    await runDockerCompose(servicePath, 'pull');
    
    spinner.succeed(chalk.green(`✓ Images for ${service} have been updated!`));
    
    console.log(chalk.cyan(`\nService: ${service}`));
    console.log(chalk.yellow(`\nTo apply updates: easy restart ${service}`));

  } catch (error) {
    spinner.fail(chalk.red(`Failed to pull images for ${service}`));
    throw error;
  }
}

module.exports = { pull };