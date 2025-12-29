const os = require('os');
const path = require('path');

const HOME_DIR = os.homedir();
const EASY_CONTAINERS_DIR = path.join(HOME_DIR, '.easy-containers');
const SERVICES_DIR = path.join(EASY_CONTAINERS_DIR, 'services');

function getServicePath(service) {
  return path.join(SERVICES_DIR, service);
}

function getBaseDir() {
  return EASY_CONTAINERS_DIR;
}

function getServicesDir() {
  return SERVICES_DIR;
}

module.exports = {
  getServicePath,
  getBaseDir,
  getServicesDir,
  EASY_CONTAINERS_DIR,
  SERVICES_DIR,
};