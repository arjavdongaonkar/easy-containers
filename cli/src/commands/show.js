const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { getServicePath } = require('../utils/config');

async function show(service) {
  const spinner = ora(`Fetching compose file for ${service}...`).start();

  try {
    const servicePath = getServicePath(service);
    const composePath = path.join(servicePath, 'docker-compose.yml');

    if (!fs.existsSync(composePath)) {
      spinner.fail();
      throw new Error(`docker-compose.yml not found for service '${service}'. Have you downloaded it?`);
    }

    const composeContent = fs.readFileSync(composePath, 'utf-8');

    spinner.succeed(chalk.green(`✓ docker-compose.yml loaded for ${service}\n`));

    console.log(chalk.cyan(`Service: ${service}`));
    console.log(chalk.gray(`Path: ${composePath}\n`));
    console.log(chalk.yellow('--- docker-compose.yml ---\n'));
    console.log(chalk.white(composeContent));
    console.log(chalk.yellow('\n--- end of file ---'));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to show compose file for ${service}`));
    throw error;
  }
}

module.exports = { show };
