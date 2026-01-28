const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { getServicePath, ensureServicesDir } = require('./config');

const execAsync = promisify(exec);

// Repository configuration
const REPO_URL = 'https://github.com/arjavdongaonkar/easy-containers.git';
const REPO_BRANCH = 'main';
const SERVICES_BASE_PATH = 'services'; // Path in repo where services are stored

/**
 * Download service from repository
 * @param {string} service - Service name
 * @returns {Promise<string>} - Path to downloaded service
 */
async function downloadService(service) {
  const servicePath = getServicePath(service);
  
  // Check if service already exists
  try {
    await fs.access(servicePath);
    console.log(chalk.gray(`Service ${service} already exists locally`));
    return servicePath;
  } catch {
    // Service doesn't exist, need to download
  }

  await ensureServicesDir();

  const spinner = ora(`Downloading ${service} from repository...`).start();

  try {
    // Try to download from GitHub repo
    await downloadFromGitRepo(service, servicePath, spinner);
    spinner.succeed(chalk.green(`Downloaded ${service} successfully`));
    return servicePath;
  } catch (error) {
    spinner.warn(chalk.yellow(`Could not download from repository: ${error.message}`));
    
    // Fallback to template creation
    spinner.start(`Creating ${service} from template...`);
    try {
      await createServiceFromTemplate(service, servicePath);
      spinner.succeed(chalk.green(`Created ${service} from template`));
      return servicePath;
    } catch (templateError) {
      spinner.fail(chalk.red(`Failed to create service`));
      throw new Error(`Failed to create service ${service}: ${templateError.message}`);
    }
  }
}

/**
 * Download service from Git repository using sparse checkout
 */
async function downloadFromGitRepo(service, servicePath, spinner) {
  const tempDir = path.join(servicePath, '..', `.tmp-${service}-${Date.now()}`);
  
  try {
    // Create temp directory
    await fs.mkdir(tempDir, { recursive: true });
    
    spinner.text = 'Initializing Git repository...';
    
    // Initialize git repo
    await execAsync('git init', { cwd: tempDir });
    
    // Add remote
    await execAsync(`git remote add origin ${REPO_URL}`, { cwd: tempDir });
    
    // Enable sparse checkout
    await execAsync('git config core.sparseCheckout true', { cwd: tempDir });
    
    spinner.text = 'Configuring sparse checkout...';
    
    // Specify which directory to checkout
    const sparseCheckoutPath = path.join(tempDir, '.git', 'info', 'sparse-checkout');
    await fs.writeFile(sparseCheckoutPath, `${SERVICES_BASE_PATH}/${service}/\n`);
    
    spinner.text = `Downloading ${service}...`;
    
    // Pull only the specified directory with depth 1 for speed
    await execAsync(`git pull --depth=1 origin ${REPO_BRANCH}`, { cwd: tempDir });
    
    spinner.text = 'Moving service files...';
    
    // Check if service exists in repo
    const sourceServicePath = path.join(tempDir, SERVICES_BASE_PATH, service);
    try {
      await fs.access(sourceServicePath);
    } catch {
      throw new Error(`Service "${service}" not found in repository`);
    }
    
    // Move service to final location
    await fs.rename(sourceServicePath, servicePath);
    
    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });
    
  } catch (error) {
    // Clean up temp directory on error
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {}
    
    throw error;
  }
}

/**
 * Create service from built-in template
 * This is a fallback when the service is not in the repository
 */
async function createServiceFromTemplate(service, servicePath) {
  await fs.mkdir(servicePath, { recursive: true });

  // Define common service templates
  const templates = {
    postgres: {
      compose: `version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: ${service}_postgres
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_USER: postgres
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
`,
      readme: `# PostgreSQL Database

PostgreSQL 15 with persistent storage.

## Default Credentials
- Username: postgres
- Password: postgres
- Database: mydb
- Port: 5432

## Connect
\`\`\`bash
psql -h localhost -U postgres -d mydb
\`\`\`
`
    },
    mysql: {
      compose: `version: '3.8'

services:
  mysql:
    image: mysql:8
    container_name: ${service}_mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: mydb
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mysql_data:
`,
      readme: `# MySQL Database

MySQL 8 with persistent storage.

## Default Credentials
- Root Password: rootpassword
- User: user
- Password: password
- Database: mydb
- Port: 3306

## Connect
\`\`\`bash
mysql -h localhost -u user -p mydb
\`\`\`
`
    },
    redis: {
      compose: `version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: ${service}_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  redis_data:
`,
      readme: `# Redis Cache

Redis 7 with AOF persistence.

## Connection
- Host: localhost
- Port: 6379

## Connect
\`\`\`bash
redis-cli
\`\`\`
`
    },
    mongodb: {
      compose: `version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: ${service}_mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mongodb_data:
`,
      readme: `# MongoDB Database

MongoDB 7 with authentication.

## Default Credentials
- Username: admin
- Password: password
- Port: 27017

## Connect
\`\`\`bash
mongosh mongodb://admin:password@localhost:27017
\`\`\`
`
    },
    nginx: {
      compose: `version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: ${service}_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./html:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost"]
      interval: 10s
      timeout: 5s
      retries: 3
`,
      readme: `# NGINX Web Server

NGINX Alpine with custom configuration support.

## Ports
- HTTP: 80
- HTTPS: 443

## Files
- HTML: ./html/
- Config: ./nginx.conf

## Access
http://localhost
`
    }
  };

  // Get template or create a generic one
  const templateData = templates[service.toLowerCase()];
  
  if (templateData) {
    // Use predefined template
    await fs.writeFile(
      path.join(servicePath, 'docker-compose.yml'),
      templateData.compose
    );
    await fs.writeFile(
      path.join(servicePath, 'README.md'),
      templateData.readme
    );
    
    // Create additional files for NGINX
    if (service.toLowerCase() === 'nginx') {
      await fs.mkdir(path.join(servicePath, 'html'), { recursive: true });
      await fs.writeFile(
        path.join(servicePath, 'html', 'index.html'),
        '<html><body><h1>Welcome to NGINX</h1></body></html>'
      );
    }
  } else {
    // Create generic template
    const genericCompose = `version: '3.8'

services:
  ${service}:
    image: # Specify your image here
    container_name: ${service}
    ports:
      - "8080:80"
    restart: unless-stopped
`;
    
    const genericReadme = `# ${service}

Service created with easy-containers.

## Usage

\`\`\`bash
# Start service
easy up ${service}

# Stop service
easy down ${service}

# View logs
easy logs ${service}
\`\`\`

## Configuration

Edit \`docker-compose.yml\` to customize the service configuration.
`;

    await fs.writeFile(
      path.join(servicePath, 'docker-compose.yml'),
      genericCompose
    );
    await fs.writeFile(
      path.join(servicePath, 'README.md'),
      genericReadme
    );
  }
}

/**
 * List available services in the repository
 */
async function listAvailableServices() {
  const tempDir = path.join(require('os').tmpdir(), `.easy-containers-list-${Date.now()}`);
  
  try {
    await fs.mkdir(tempDir, { recursive: true });
    
    // Clone only the services directory listing
    await execAsync('git init', { cwd: tempDir });
    await execAsync(`git remote add origin ${REPO_URL}`, { cwd: tempDir });
    await execAsync('git config core.sparseCheckout true', { cwd: tempDir });
    
    const sparseCheckoutPath = path.join(tempDir, '.git', 'info', 'sparse-checkout');
    await fs.writeFile(sparseCheckoutPath, `${SERVICES_BASE_PATH}/\n`);
    
    await execAsync(`git pull --depth=1 origin ${REPO_BRANCH}`, { cwd: tempDir });
    
    // Read services directory
    const servicesDir = path.join(tempDir, SERVICES_BASE_PATH);
    const entries = await fs.readdir(servicesDir, { withFileTypes: true });
    const services = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    
    // Clean up
    await fs.rm(tempDir, { recursive: true, force: true });
    
    return services;
  } catch (error) {
    // Clean up on error
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {}
    
    // Return built-in templates as fallback
    return ['postgres', 'mysql', 'redis', 'mongodb', 'nginx'];
  }
}

/**
 * Update service from repository
 */
async function updateService(service) {
  const servicePath = getServicePath(service);
  
  try {
    await fs.access(servicePath);
    
    // Backup current configuration
    const backupPath = `${servicePath}.backup-${Date.now()}`;
    await fs.cp(servicePath, backupPath, { recursive: true });
    
    console.log(chalk.gray(`Backup created at: ${backupPath}`));
    
    // Remove old service
    await fs.rm(servicePath, { recursive: true });
    
    // Download new version
    await downloadService(service);
    
    console.log(chalk.green(`✓ Service ${service} updated successfully`));
    console.log(chalk.yellow(`\nTo restore backup: mv ${backupPath} ${servicePath}`));
    
  } catch (error) {
    throw new Error(`Failed to update service: ${error.message}`);
  }
}

/**
 * Check if a service exists in the repository
 */
async function serviceExistsInRepo(service) {
  try {
    const services = await listAvailableServices();
    return services.includes(service);
  } catch {
    return false;
  }
}

module.exports = {
  downloadService,
  updateService,
  createServiceFromTemplate,
  listAvailableServices,
  serviceExistsInRepo
};
