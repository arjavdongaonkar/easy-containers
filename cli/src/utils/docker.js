const { spawn } = require('child_process');
const chalk = require('chalk');

function runDockerCompose(servicePath, command, args = []) {
  return new Promise((resolve, reject) => {
    const dockerCompose = spawn('docker-compose', [command, ...args], {
      cwd: servicePath,
      stdio: 'inherit'
    });

    dockerCompose.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`docker-compose ${command} exited with code ${code}`));
      }
    });

    dockerCompose.on('error', (error) => {
      if (error.code === 'ENOENT') {
        reject(new Error('docker-compose is not installed. Please install Docker Desktop or docker-compose.'));
      } else {
        reject(error);
      }
    });
  });
}

async function checkDockerInstalled() {
  return new Promise((resolve) => {
    const docker = spawn('docker', ['--version']);
    
    docker.on('close', (code) => {
      resolve(code === 0);
    });

    docker.on('error', () => {
      resolve(false);
    });
  });
}

module.exports = {
  runDockerCompose,
  checkDockerInstalled,
};