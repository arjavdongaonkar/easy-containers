#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { up } = require('../src/commands/up');
const { down } = require('../src/commands/down');
const { list } = require('../src/commands/list');
const { download } = require('../src/commands/download');
const { show } = require('../src/commands/show');
const { help } = require('../src/commands/help');

program
  .command('help')
  .description('Show help information')
  .action(async () => {
    try {
      await help();
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .name('easy')
  .description('CLI tool to easily run Docker containers for development services')
  .version('1.0.0');

// Handle list command
program
  .command('list')
  .alias('ls')
  .description('List all available services')
  .action(async () => {
    try {
      await list();
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Handle <service> <action> pattern (e.g., easy redis up, easy redis download)
program
  .arguments('<service> <action>')
  .description('Manage a service (actions: up, down, download)')
  .action(async (service, action) => {
    try {
      if (action === 'up') {
        await up(service);
      } else if (action === 'down') {
        await down(service);
      } else if (action === 'download') {
        await download(service);
      } else if (action === 'show') {
        await show(service);
      } else {
        console.error(chalk.red(`Error: Unknown action '${action}'. Use 'up', 'down', 'download', or 'show'.`));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  help();
}
