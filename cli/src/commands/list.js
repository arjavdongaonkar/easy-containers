const chalk = require('chalk');
const ora = require('ora');
const { exec } = require('child_process');
const { promisify } = require('util');

const {
  getInstalledServices,
  getAvailableServices,
  SERVICES_DIR
} = require('../utils/config');

const execAsync = promisify(exec);

/**
 * Strip ANSI color codes so padding works correctly
 */
const stripAnsi = str => str.replace(/\x1B\[[0-9;]*m/g, '');

/**
 * Pad text to a fixed width, ANSI-safe
 */
const pad = (text, width) => {
  const len = stripAnsi(text).length;
  return text + ' '.repeat(Math.max(width - len, 0));
};

/**
 * Get running docker containers
 */
async function getRunningContainers() {
  try {
    const { stdout } = await execAsync('docker ps --format "{{.Names}}"');
    return stdout.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

async function list(options = {}) {
  const spinner = ora('Loading services...').start();

  try {
    const installedServices = await getInstalledServices();
    const runningContainers = await getRunningContainers();

    spinner.stop();

    if (installedServices.length === 0) {
      console.log(chalk.yellow('\nNo services installed yet.'));
      console.log(
        chalk.gray('Use "easy up <service>" to start a service.\n')
      );
      return;
    }

    /**
     * ---- Dynamic column sizing ----
     */
    const SERVICE_MIN = 15;
    const STATUS_MIN = 10;
    const PATH_MIN = 30;

    const serviceWidth = Math.max(
      SERVICE_MIN,
      ...installedServices.map(s => s.length)
    );

    const statusWidth = STATUS_MIN;

    const pathWidth = Math.max(
      PATH_MIN,
      ...installedServices.map(
        s => `${SERVICES_DIR}/${s}`.length
      )
    );

    const tableWidth = serviceWidth + statusWidth + pathWidth;

    /**
     * ---- Table header ----
     */
    console.log(chalk.cyan.bold('\nInstalled Services'));
    console.log(chalk.gray('─'.repeat(tableWidth)));

    console.log(
      chalk.bold(
        pad('SERVICE', serviceWidth) +
        pad('STATUS', statusWidth) +
        pad('PATH', pathWidth)
      )
    );

    console.log(chalk.gray('─'.repeat(tableWidth)));

    /**
     * ---- Table rows ----
     */
    for (const service of installedServices) {
      const isRunning = runningContainers.some(container =>
        container.toLowerCase().includes(service.toLowerCase())
      );

      const statusText = isRunning ? 'RUNNING' : 'STOPPED';
      const statusColored = isRunning
        ? chalk.green(statusText)
        : chalk.gray(statusText);

      const serviceCol = pad(service, serviceWidth);
      const statusCol = pad(statusColored, statusWidth);
      const pathCol = pad(
        `${SERVICES_DIR}/${service}`,
        pathWidth
      );

      console.log(serviceCol + statusCol + pathCol);
    }

    console.log(chalk.gray('─'.repeat(tableWidth)));
    console.log(
      chalk.cyan(`\nTotal: ${installedServices.length} service(s)\n`)
    );

    /**
     * ---- Optional: available services ----
     */
    if (options.all) {
      console.log(chalk.bold.cyan('Available Services:\n'));

      const availableServices = await getAvailableServices();
      availableServices.forEach(service => {
        if (!installedServices.includes(service)) {
          console.log(chalk.gray(`  • ${service}`));
        }
      });

      console.log('');
    }
  } catch (error) {
    spinner.fail(chalk.red('Failed to list services'));
    throw error;
  }
}

module.exports = { list };
