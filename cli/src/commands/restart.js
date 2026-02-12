const chalk = require('chalk');
const ora = require('ora');
const { runDockerCompose } = require('../utils/docker');
const { getServicePath } = require('../utils/config');
const fs = require('fs').promises;

async function restart(service, options = {}) {
  const spinner = ora(`Restarting ${service}...`).start();

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

    // Stop the service
    spinner.text = `Stopping ${service}...`;
    await runDockerCompose(servicePath, 'down');
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Start the service
    spinner.text = `Starting ${service}...`;
    await runDockerCompose(servicePath, 'up', ['-d']);
    
    spinner.succeed(chalk.green(`✓ ${service} has been restarted!`));
    
    console.log(chalk.cyan(`\nService: ${service}`));
    console.log(chalk.gray(`Location: ${servicePath}`));
    console.log(chalk.yellow(`\nTo view logs: easy logs ${service}`));

  } catch (error) {
    spinner.fail(chalk.red(`Failed to restart ${service}`));
    throw error;
  }
}

module.exports = { restart };