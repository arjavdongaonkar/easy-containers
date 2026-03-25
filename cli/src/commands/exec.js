const chalk = require('chalk');
const ora = require('ora');
const { spawn } = require('child_process');
const { getServicePath } = require('../utils/config');
const fs = require('fs').promises;
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function getServiceContainerName(service) {
  try {
    const { stdout } = await execAsync(
      `docker ps --filter "name=${service}" --format "{{.Names}}"`
    );
    const containers = stdout.trim().split('\n').filter(Boolean);
    return containers[0] || null;
  } catch {
    return null;
  }
}

async function execCommand(service, command, options = {}) {
  const spinner = ora(`Connecting to ${service}...`).start();

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

    // Get container name
    const containerName = await getServiceContainerName(service);
    
    if (!containerName) {
      spinner.fail(chalk.red(`No running container found for "${service}"`));
      console.log(chalk.gray(`\nStart the service first: easy up ${service}`));
      return;
    }

    spinner.stop();

    console.log(chalk.cyan(`\n🔧 Executing in ${service}:\n`));
    console.log(chalk.gray('─'.repeat(60)));

    // Build docker exec command
    const dockerArgs = ['exec'];
    
    if (options.interactive || !command.length) {
      dockerArgs.push('-it');
    }
    
    dockerArgs.push(containerName);

    // If no command provided, open shell
    if (!command || command.length === 0) {
      dockerArgs.push('/bin/sh');
      console.log(chalk.gray('Opening interactive shell...\n'));
    } else {
      dockerArgs.push(...command);
    }

    // Spawn docker exec process
    const execProcess = spawn('docker', dockerArgs, {
      stdio: 'inherit'
    });

    execProcess.on('error', (error) => {
      console.error(chalk.red('\n❌ Failed to execute command'));
      if (error.code === 'ENOENT') {
        console.log(chalk.gray('\nDocker is not installed or not in PATH.'));
      }
    });

    execProcess.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.error(chalk.red(`\n❌ Command exited with code ${code}`));
      }
    });

  } catch (error) {
    spinner.fail(chalk.red(`Failed to execute command in ${service}`));
    throw error;
  }
}

module.exports = { exec: execCommand };