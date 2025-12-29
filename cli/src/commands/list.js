const chalk = require('chalk');
const ora = require('ora');
const fetch = require('node-fetch');

const SERVICES_API = 'https://api.github.com/repos/arjavdongaonkar/easy-containers/contents/services';

async function list() {
  const spinner = ora('Fetching available services...').start();

  try {
    const response = await fetch(SERVICES_API, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'easy-containers-cli'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.statusText}`);
    }

    const services = await response.json();
    const serviceNames = services
      .filter(item => item.type === 'dir')
      .map(item => item.name);

    spinner.succeed(chalk.green('Available services:'));
    
    console.log();
    serviceNames.forEach(service => {
      console.log(chalk.cyan(`  • ${service}`));
    });
    
    console.log();
    console.log(chalk.gray('Usage:'));
    console.log(chalk.white('  easy  up   ') + chalk.gray('- Start a service'));
    console.log(chalk.white('  easy  down ') + chalk.gray('- Stop a service'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to fetch services'));
    throw error;
  }
}

module.exports = { list };