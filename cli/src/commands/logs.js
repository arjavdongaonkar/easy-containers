const chalk = require('chalk');
const ora = require('ora');
const { spawn } = require('child_process');
const { getServicePath } = require('../utils/config');
const fs = require('fs').promises;

async function logs(service, options = {}) {
  const spinner = ora(`Loading logs for ${service}...`).start();

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

    spinner.stop();

    // Build docker-compose logs command
    const args = ['logs'];
    
    if (options.follow) {
      args.push('-f');
    }
    
    if (options.tail) {
      args.push('--tail', options.tail);
    } else if (!options.follow) {
      args.push('--tail', '100'); // Default to last 100 lines
    }

    if (options.timestamps) {
      args.push('-t');
    }

    console.log(chalk.cyan(`\n Logs for ${service}:\n`));
    console.log(chalk.gray('─'.repeat(60)));

    // Spawn docker-compose logs process
    const logsProcess = spawn('docker-compose', args, {
      cwd: servicePath,
      stdio: 'inherit'
    });

    logsProcess.on('error', (error) => {
      console.error(chalk.red('\n❌ Failed to get logs'));
      if (error.code === 'ENOENT') {
        console.log(chalk.gray('\nDocker Compose is not installed or not in PATH.'));
      }
    });

    logsProcess.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.error(chalk.red(`\n❌ Logs command exited with code ${code}`));
      }
    });

    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n\n⚠️  Stopping log stream...'));
      logsProcess.kill('SIGINT');
      process.exit(0);
    });

  } catch (error) {
    spinner.fail(chalk.red(`Failed to get logs for ${service}`));
    throw error;
  }
}

module.exports = { logs };