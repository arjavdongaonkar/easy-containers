const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const { getServicePath } = require('../utils/config');
const fs = require('fs').promises;
const path = require('path');

const templates = {
  basic: {
    name: 'Basic Container',
    description: 'Simple single-container setup',
    compose: `version: '3.8'

services:
  app:
    image: nginx:latest
    ports:
      - "8080:80"
    volumes:
      - ./data:/usr/share/nginx/html
    restart: unless-stopped
`
  },
  database: {
    name: 'Database Server',
    description: 'PostgreSQL or MySQL database',
    compose: (dbType) => `version: '3.8'

services:
  db:
    image: ${dbType === 'postgres' ? 'postgres:15' : 'mysql:8'}
    environment:
      ${dbType === 'postgres' ? 'POSTGRES_PASSWORD' : 'MYSQL_ROOT_PASSWORD'}: changeme
      ${dbType === 'postgres' ? 'POSTGRES_USER' : 'MYSQL_USER'}: user
      ${dbType === 'postgres' ? 'POSTGRES_DB' : 'MYSQL_DATABASE'}: mydb
    ports:
      - "${dbType === 'postgres' ? '5432' : '3306'}:${dbType === 'postgres' ? '5432' : '3306'}"
    volumes:
      - db_data:/var/lib/${dbType === 'postgres' ? 'postgresql' : 'mysql'}/data
    restart: unless-stopped

volumes:
  db_data:
`
  },
  webapp: {
    name: 'Web Application',
    description: 'Full stack with app, database, and reverse proxy',
    compose: `version: '3.8'

services:
  app:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./app:/app
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://user:password@db:5432/mydb
    command: npm start
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_USER: user
      POSTGRES_DB: mydb
    volumes:
      - db_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  db_data:
`
  }
};

async function init(service, options = {}) {
  const spinner = ora('Initializing service...').start();

  try {
    const servicePath = getServicePath(service);
    
    // Check if service already exists
    try {
      await fs.access(servicePath);
      spinner.stop();
      
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: chalk.yellow(`Service "${service}" already exists. Overwrite?`),
          default: false
        }
      ]);
      
      if (!overwrite) {
        console.log(chalk.gray('\nInitialization cancelled.'));
        return;
      }
    } catch {
      // Service doesn't exist, continue
    }

    spinner.stop();

    // Ask for template if not provided
    let template = options.template;
    
    if (!template) {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: 'Select a template:',
          choices: [
            { name: `${templates.basic.name} - ${templates.basic.description}`, value: 'basic' },
            { name: `${templates.database.name} - ${templates.database.description}`, value: 'database' },
            { name: `${templates.webapp.name} - ${templates.webapp.description}`, value: 'webapp' },
            { name: 'Empty (create from scratch)', value: 'empty' }
          ]
        }
      ]);
      template = answers.template;
    }

    spinner.start('Creating service configuration...');

    // Create service directory
    await fs.mkdir(servicePath, { recursive: true });

    let composeContent = '';

    if (template === 'database') {
      spinner.stop();
      const { dbType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'dbType',
          message: 'Select database type:',
          choices: ['postgres', 'mysql']
        }
      ]);
      spinner.start('Creating service configuration...');
      composeContent = templates.database.compose(dbType);
    } else if (template === 'empty') {
      composeContent = `version: '3.8'

services:
  # Add your services here
`;
    } else if (templates[template]) {
      composeContent = templates[template].compose;
    }

    // Write docker-compose.yml
    const composePath = path.join(servicePath, 'docker-compose.yml');
    await fs.writeFile(composePath, composeContent);

    // Create README
    const readmeContent = `# ${service}

## Quick Start

\`\`\`bash
# Start the service
easy up ${service}

# Stop the service
easy down ${service}

# View logs
easy logs ${service}

# Restart the service
easy restart ${service}
\`\`\`

## Configuration

Edit \`docker-compose.yml\` to customize your service configuration.

## Notes

- Created with easy-containers
- Template: ${template}
`;

    await fs.writeFile(path.join(servicePath, 'README.md'), readmeContent);

    spinner.succeed(chalk.green(`✓ Service "${service}" initialized successfully!`));
    
    console.log(chalk.cyan(`\nLocation: ${servicePath}`));
    console.log(chalk.gray('Files created:'));
    console.log(chalk.gray('  • docker-compose.yml'));
    console.log(chalk.gray('  • README.md'));
    
    console.log(chalk.yellow('\n💡 Next steps:'));
    console.log(chalk.gray(`  1. Edit ${path.join(servicePath, 'docker-compose.yml')}`));
    console.log(chalk.gray(`  2. Run: easy up ${service}`));
    console.log('');

  } catch (error) {
    spinner.fail(chalk.red('Failed to initialize service'));
    throw error;
  }
}

module.exports = { init };