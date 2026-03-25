const chalk = require('chalk');
const ora = require('ora');
const { runDockerCompose } = require('../utils/docker');
const { getServicePath } = require('../utils/config');
const fs = require('fs').promises;
const yaml = require('js-yaml');
const path = require('path');

async function validate(service, options = {}) {
  const spinner = ora(`Validating ${service} configuration...`).start();

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

    const composePath = path.join(servicePath, 'docker-compose.yml');
    let issues = [];
    let warnings = [];

    // Check 1: File exists
    try {
      await fs.access(composePath);
    } catch {
      spinner.fail(chalk.red('docker-compose.yml not found'));
      return;
    }

    // Check 2: Valid YAML syntax
    spinner.text = 'Checking YAML syntax...';
    let composeContent;
    try {
      const fileContent = await fs.readFile(composePath, 'utf8');
      composeContent = yaml.load(fileContent);
    } catch (error) {
      issues.push(`Invalid YAML syntax: ${error.message}`);
    }

    if (composeContent) {
      // Check 3: Version specified
      if (!composeContent.version) {
        warnings.push('No version specified in docker-compose.yml');
      }

      // Check 4: Services defined
      if (!composeContent.services || Object.keys(composeContent.services).length === 0) {
        issues.push('No services defined');
      } else {
        // Check 5: Each service has an image or build
        Object.entries(composeContent.services).forEach(([name, config]) => {
          if (!config.image && !config.build) {
            issues.push(`Service "${name}" has no image or build configuration`);
          }

          // Check 6: Port format
          if (config.ports) {
            config.ports.forEach(port => {
              if (typeof port === 'string' && !port.match(/^\d+:\d+$/)) {
                warnings.push(`Service "${name}": Port "${port}" may have invalid format`);
              }
            });
          }

          // Check 7: Environment variables
          if (config.environment && Array.isArray(config.environment)) {
            config.environment.forEach(env => {
              if (typeof env === 'string' && !env.includes('=')) {
                warnings.push(`Service "${name}": Environment variable "${env}" missing value`);
              }
            });
          }
        });
      }

      // Check 8: Volume references
      if (composeContent.services) {
        Object.entries(composeContent.services).forEach(([name, config]) => {
          if (config.volumes) {
            config.volumes.forEach(vol => {
              if (typeof vol === 'string' && vol.includes(':')) {
                const [source] = vol.split(':');
                // Named volume should be defined in top-level volumes
                if (!source.startsWith('.') && !source.startsWith('/') && !source.startsWith('~')) {
                  if (!composeContent.volumes || !composeContent.volumes[source]) {
                    warnings.push(`Service "${name}": Volume "${source}" not defined in top-level volumes`);
                  }
                }
              }
            });
          }
        });
      }
    }

    // Check 9: Docker Compose validation
    spinner.text = 'Running docker-compose config...';
    try {
      await runDockerCompose(servicePath, 'config', ['--quiet']);
    } catch (error) {
      issues.push('Docker Compose validation failed');
    }

    spinner.stop();

    // Display results
    console.log(chalk.bold.cyan(`\n✓ Validation Results for ${service}:\n`));
    console.log(chalk.gray('─'.repeat(60)));

    if (issues.length === 0 && warnings.length === 0) {
      console.log(chalk.green('\n✓ Configuration is valid!\n'));
      console.log(chalk.gray('No issues or warnings found.\n'));
    } else {
      if (issues.length > 0) {
        console.log(chalk.red.bold('\n❌ Issues Found:\n'));
        issues.forEach((issue, index) => {
          console.log(chalk.red(`  ${index + 1}. ${issue}`));
        });
        console.log('');
      }

      if (warnings.length > 0) {
        console.log(chalk.yellow.bold('\n⚠️  Warnings:\n'));
        warnings.forEach((warning, index) => {
          console.log(chalk.yellow(`  ${index + 1}. ${warning}`));
        });
        console.log('');
      }
    }

    console.log(chalk.gray('─'.repeat(60)));

    if (issues.length === 0) {
      console.log(chalk.green('\n✓ Configuration is valid and ready to use!\n'));
    } else {
      console.log(chalk.red('\n❌ Please fix the issues before deploying.\n'));
    }

  } catch (error) {
    spinner.fail(chalk.red('Validation failed'));
    throw error;
  }
}

module.exports = { validate };