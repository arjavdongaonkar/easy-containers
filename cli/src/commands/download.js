const chalk = require('chalk');
const ora = require('ora');
const { downloadService } = require('../utils/downloader');

async function download(service) {
  const spinner = ora(`Downloading ${service} configuration...`).start();

  try {
    // Download service files
    const servicePath = await downloadService(service);
    
    spinner.succeed(chalk.green(`✓ ${service} downloaded successfully!`));
    
    console.log(chalk.cyan(`\nService: ${service}`));
    console.log(chalk.gray(`Location: ${servicePath}`));
    console.log(chalk.yellow(`\nTo start: easy ${service} up`));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to download ${service}`));
    throw error;
  }
}

module.exports = { download };
