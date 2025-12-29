const chalk = require('chalk');

async function help() {
  console.log(chalk.cyan.bold('\nEasy Containers CLI\n'));

  console.log(chalk.white('Usage:'));
  console.log(chalk.gray('  easy <service> <action>'));
  console.log(chalk.gray('  easy list'));
  console.log(chalk.gray('  easy help\n'));

  console.log(chalk.white('Actions (service-level):'));
  console.log(chalk.gray('  up        Start a service'));
  console.log(chalk.gray('  down      Stop a service'));
  console.log(chalk.gray('  download  Download service configuration'));
  console.log(chalk.gray('  show      Show docker-compose.yml for a service\n'));

  console.log(chalk.white('Commands (global):'));
  console.log(chalk.gray('  list, ls  List all available services'));
  console.log(chalk.gray('  help      Show this help message\n'));

  console.log(chalk.white('Examples:'));
  console.log(chalk.gray('  easy redis up'));
  console.log(chalk.gray('  easy redis down'));
  console.log(chalk.gray('  easy redis download'));
  console.log(chalk.gray('  easy redis show'));
  console.log(chalk.gray('  easy postgres up'));
  console.log(chalk.gray('  easy list'));
  console.log(chalk.gray('  easy help\n'));
}

module.exports = { help };
