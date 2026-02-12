const path = require('path');
const os = require('os');
const https = require('https');
const fs = require('fs').promises;
const { GITHUB_SERVICES_API_URL } = require('../constants/repository');

// Base directory for all services
const SERVICES_DIR = path.join(os.homedir(), '.easy-containers', 'services');
const REPO_SERVICES_DIR = path.resolve(__dirname, '../../../services');
/**
 * Fetch available services from GitHub repository
 */
function fetchAvailableServicesFromGitHub() {
  return new Promise((resolve, reject) => {
    const request = https.get(
      GITHUB_SERVICES_API_URL,
      {
        headers: {
          'User-Agent': 'easy-containers-cli',
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      },
      response => {
        let body = '';

        response.on('data', chunk => {
          body += chunk;
        });

        response.on('end', () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            return reject(
              new Error(`GitHub API responded with ${response.statusCode}`)
            );
          }

          try {
            const payload = JSON.parse(body);

            if (!Array.isArray(payload)) {
              return reject(new Error('Invalid GitHub API response format'));
            }
          
            const services = payload
              .filter(item => item.type === 'dir' && item.name && !item.name.startsWith('.'))
              .map(item => item.name)
              .sort();

            resolve(services);
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    request.on('error', reject);
  });
}

/**
 * Get the path for a specific service
 */
function getServicePath(service) {
  return path.join(SERVICES_DIR, service);
}

/**
 * Get list of installed services
 */
async function getInstalledServices() {
  try {
    await fs.access(SERVICES_DIR);
    const entries = await fs.readdir(SERVICES_DIR, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort();
  } catch {
    return [];
  }
}

/**
 * Get list of available services from repository
 */
async function getAvailableServices() {
  try {
    return await fetchAvailableServicesFromGitHub();
  } catch {
    try {
      // Fallback to local repository clone for offline / rate-limited scenarios.
      const entries = await fs.readdir(REPO_SERVICES_DIR, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
        .map(entry => entry.name)
        .sort();
    } catch {
      return [];
    }
  }
}

/**
 * Get service information
 */
async function getServiceInfo(service) {
  const servicePath = getServicePath(service);
  const composePath = path.join(servicePath, 'docker-compose.yml');
  
  try {
    await fs.access(composePath);
    const stats = await fs.stat(composePath);
    
    return {
      name: service,
      path: servicePath,
      composePath,
      exists: true,
      modified: stats.mtime
    };
  } catch {
    return {
      name: service,
      path: servicePath,
      composePath,
      exists: false,
      modified: null
    };
  }
}

/**
 * Ensure services directory exists
 */
async function ensureServicesDir() {
  await fs.mkdir(SERVICES_DIR, { recursive: true });
}

module.exports = {
  SERVICES_DIR,
  getServicePath,
  getInstalledServices,
  getAvailableServices,
  getServiceInfo,
  ensureServicesDir
};
