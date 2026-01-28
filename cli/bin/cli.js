#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { up } = require('../src/commands/up');
const { down } = require('../src/commands/down');
const { list } = require('../src/commands/list.js');
const { show } = require('../src/commands/show');
const { status } = require('../src/commands/status');
const { logs } = require('../src/commands/logs');
const { restart } = require('../src/commands/restart');
const { init } = require('../src/commands/init');
const { pull } = require('../src/commands/pull');
const { exec } = require('../src/commands/exec');
const { search } = require('../src/commands/search');
const { validate } = require('../src/commands/validate');
const { verifyDockerEnvironment } = require('../src/utils/docker.js');

// Package info
const packageJson = require('../package.json');

// ASCII Art Banner
const banner = `
${chalk.cyan('╔═══════════════════════════════════════╗')}
${chalk.cyan('║')}     ${chalk.bold.white('🐳 Easy Containers CLI')}            ${chalk.cyan('║')}
${chalk.cyan('║')}     ${chalk.gray('Simplify Docker Management')}        ${chalk.cyan('║')}
${chalk.cyan('╚═══════════════════════════════════════╝')}
`;

// Show banner
console.log(banner);

// Configure CLI
program
  .name('easy')
  .description('CLI tool for managing Docker containers easily')
  .version(packageJson.version, '-v, --version', 'Output the current version')
  .helpOption('-h, --help', 'Display help for command');

// Up command - Start containers
program
  .command('up <service>')
  .description('Start a container service')
  .option('-d, --detach', 'Run containers in detached mode (default)', true)
  .option('-f, --file <file>', 'Specify an alternate compose file')
  .action(async (service, options) => {
    try {
      await verifyDockerEnvironment();
      await up(service, options);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

// Down command - Stop containers
program
  .command('down <service>')
  .description('Stop and remove containers')
  .option('-v, --volumes', 'Remove named volumes')
  .action(async (service, options) => {
    try {
      await verifyDockerEnvironment();
      await down(service, options);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

// List command - List services
program
  .command('list')
  .alias('ls')
  .description('List installed container services')
  .option('-a, --all', 'Show all available services from repository')
  .action(async (options) => {
    try {
      await list(options);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

// Show command - Show service details
program
  .command('show <service>')
  .description('Display detailed information about a service')
  .action(async (service) => {
    try {
      await show(service);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

// Status command - Container status
program
  .command('status')
  .alias('ps')
  .description('Show status of running containers')
  .option('-v, --verbose', 'Show additional information')
  .action(async (options) => {
    try {
      await verifyDockerEnvironment();
      await status(options);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

// Logs command - View logs
program
  .command('logs <service>')
  .description('View container logs')
  .option('-f, --follow', 'Follow log output')
  .option('-n, --tail <lines>', 'Number of lines to show from the end', '100')
  .option('-t, --timestamps', 'Show timestamps')
  .action(async (service, options) => {
    try {
      await verifyDockerEnvironment();
      await logs(service, options);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

// Restart command - Restart containers
program
  .command('restart <service>')
  .description('Restart a container service')
  .action(async (service, options) => {
    try {
      await verifyDockerEnvironment();
      await restart(service, options);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

// Init command - Initialize new service
program
  .command('init <service>')
  .description('Initialize a new container service')
  .option('-t, --template <template>', 'Use a template (basic, database, webapp)')
  .action(async (service, options) => {
    try {
      await init(service, options);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

// Pull command - Pull images
program
  .command('pull <service>')
  .description('Pull/update container images for a service')
  .action(async (service, options) => {
    try {
      await verifyDockerEnvironment();
      await pull(service, options);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

// Exec command - Execute command in container
program
  .command('exec <service> [command...]')
  .description('Execute a command in a running container')
  .option('-i, --interactive', 'Keep STDIN open (interactive mode)', true)
  .action(async (service, command, options) => {
    try {
      await verifyDockerEnvironment();
      await exec(service, command, options);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

// Search command - Search services
program
  .command('search <query>')
  .description('Search for available container services')
  .action(async (query) => {
    try {
      await search(query);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

// Validate command - Validate configuration
program
  .command('validate <service>')
  .description('Validate docker-compose configuration')
  .action(async (service) => {
    try {
      await validate(service);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
  
  console.log(chalk.cyan('\n📚 Quick Start:\n'));
  console.log(chalk.gray('  easy up postgres       # Start PostgreSQL'));
  console.log(chalk.gray('  easy status            # Check running containers'));
  console.log(chalk.gray('  easy logs postgres     # View logs'));
  console.log(chalk.gray('  easy down postgres     # Stop PostgreSQL'));
  console.log(chalk.gray('\n  easy init myapp        # Create new service'));
  console.log(chalk.gray('  easy search mysql      # Search services'));
  console.log(chalk.gray('  easy list              # List installed services\n'));
}