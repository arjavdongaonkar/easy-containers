const path = require('path');
const os = require('os');
const fs = require('fs').promises;

// Base directory for all services
const SERVICES_DIR = path.join(os.homedir(), '.easy-containers', 'services');

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
 * This should be replaced with actual API call or repository check
 */
async function getAvailableServices() {
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