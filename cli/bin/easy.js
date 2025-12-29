#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { up } = require('../src/commands/up');
const { down } = require('../src/commands/down');
const { list } = require('../src/commands/list');

program
  .name('easy')
  .description('CLI tool to easily run Docker containers for development services')
  .version('1.0.0');

program
  .command('up <service>')
  .description('Start a service')
  .action(async (service) => {
    try {
      await up(service);
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('down <service>')
  .description('Stop a service')
  .action(async (service) => {
    try {
      await down(service);
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

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

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
