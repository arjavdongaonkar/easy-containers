const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');
const tar = require('tar');
const { getServicePath, getServicesDir } = require('./config');
const chalk = require('chalk');

const GITHUB_API = 'https://api.github.com/repos/arjavdongaonkar/easy-containers';
const RAW_GITHUB = 'https://raw.githubusercontent.com/arjavdongaonkar/easy-containers/main';

async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function downloadFile(url, destination) {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  const content = await response.text();
  await fs.writeFile(destination, content);
}

async function downloadServiceFiles(service) {
  const servicePath = getServicePath(service);
  await ensureDirectoryExists(servicePath);

  // Get the list of files in the service directory
  const apiUrl = `${GITHUB_API}/contents/services/${service}`;
  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'easy-containers-cli'
    }
  });

  if (!response.ok) {
    throw new Error(`Service '${service}' not found`);
  }

  const files = await response.json();

  // Download each file
  for (const file of files) {
    if (file.type === 'file') {
      const fileUrl = `${RAW_GITHUB}/services/${service}/${file.name}`;
      const filePath = path.join(servicePath, file.name);
      await downloadFile(fileUrl, filePath);
    }
  }
}

async function downloadService(service) {
  const servicePath = getServicePath(service);
  
  // Check if service already exists
  try {
    await fs.access(servicePath);
    // Service exists, check if docker-compose.yml exists
    const composePath = path.join(servicePath, 'docker-compose.yml');
    await fs.access(composePath);
    return servicePath;
  } catch {
    // Service doesn't exist or is incomplete, download it
    console.log(chalk.gray(`Downloading ${service} configuration...`));
    await ensureDirectoryExists(getServicesDir());
    await downloadServiceFiles(service);
    return servicePath;
  }
}

module.exports = {
  downloadService,
};