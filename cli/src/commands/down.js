const chalk = require('chalk');
const ora = require('ora');
const { runDockerCompose } = require('../utils/docker');
const { getServicePath } = require('../utils/config');
const fs = require('fs').promises;

async function down(service) {
  const spinner = ora(`Stopping ${service}...`).start();

  try {
    const servicePath = getServicePath(service);
    
    // Check if service exists locally
    try {
      await fs.access(servicePath);
    } catch {
      spinner.warn(chalk.yellow(`Service ${service} is not running or not found`));
      return;
    }
    
    spinner.text = `Running docker-compose down for ${service}...`;
    
    // Run docker-compose down
    await runDockerCompose(servicePath, 'down');
    
    spinner.succeed(chalk.green(`✓ ${service} has been stopped!`));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to stop ${service}`));
    throw error;
  }
}

module.exports = { down };