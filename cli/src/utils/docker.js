const { spawn } = require('child_process');
const chalk = require('chalk');

/**
 * Run docker-compose command
 * @param {string} cwd - Working directory
 * @param {string} command - Docker compose command (up, down, etc)
 * @param {Array} args - Additional arguments
 * @returns {Promise}
 */
function runDockerCompose(cwd, command, args = []) {
  return new Promise((resolve, reject) => {
    const allArgs = [command, ...args];
    
    const process = spawn('docker-compose', allArgs, {
      cwd,
      stdio: 'pipe'
    });

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('error', (error) => {
      if (error.code === 'ENOENT') {
        reject(new Error('docker-compose is not installed or not in PATH'));
      } else {
        reject(error);
      }
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`docker-compose ${command} failed with code ${code}\n${stderr}`));
      }
    });
  });
}

/**
 * Check if Docker is running
 * @returns {Promise<boolean>}
 */
async function isDockerRunning() {
  return new Promise((resolve) => {
    const process = spawn('docker', ['ps']);
    
    process.on('error', () => {
      resolve(false);
    });

    process.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

/**
 * Check if docker-compose is installed
 * @returns {Promise<boolean>}
 */
async function isDockerComposeInstalled() {
  return new Promise((resolve) => {
    const process = spawn('docker-compose', ['--version']);
    
    process.on('error', () => {
      resolve(false);
    });

    process.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

/**
 * Get Docker version
 * @returns {Promise<string>}
 */
async function getDockerVersion() {
  return new Promise((resolve, reject) => {
    const process = spawn('docker', ['--version']);
    
    let output = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.on('error', (error) => {
      reject(error);
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error('Failed to get Docker version'));
      }
    });
  });
}

/**
 * Verify Docker environment
 */
async function verifyDockerEnvironment() {
  const dockerRunning = await isDockerRunning();
  const composeInstalled = await isDockerComposeInstalled();

  if (!dockerRunning) {
    console.error(chalk.red('\n❌ Docker is not running'));
    console.log(chalk.gray('Please start Docker Desktop or Docker daemon.\n'));
    process.exit(1);
  }

  if (!composeInstalled) {
    console.error(chalk.red('\n❌ docker-compose is not installed'));
    console.log(chalk.gray('Please install docker-compose to use easy-containers.\n'));
    console.log(chalk.cyan('Visit: https://docs.docker.com/compose/install/\n'));
    process.exit(1);
  }
}

module.exports = {
  runDockerCompose,
  isDockerRunning,
  isDockerComposeInstalled,
  getDockerVersion,
  verifyDockerEnvironment
};