const chalk = require('chalk');

async function help() {
  console.log(chalk.cyan.bold('\nEasy Containers CLI\n'));

  console.log(chalk.white('Usage:'));
  console.log(chalk.gray('  easy <command> [service] [options]'));
  console.log(chalk.gray('  easy list'));
  console.log(chalk.gray('  easy help\n'));

  console.log(chalk.white('Service commands:'));
  console.log(chalk.gray('  download <service>  Download service files from repository'));
  console.log(chalk.gray('  up <service>        Start a service'));
  console.log(chalk.gray('  down <service>      Stop a service'));
  console.log(chalk.gray('  restart <service>   Restart a service'));
  console.log(chalk.gray('  pull <service>      Pull latest container images'));
  console.log(chalk.gray('  logs <service>      View service logs'));
  console.log(chalk.gray('  show <service>      Show service details'));
  console.log(chalk.gray('  exec <service>      Execute command inside container'));
  console.log(chalk.gray('  config <service>    Manage .env configuration'));
  console.log(chalk.gray('  validate <service>  Validate docker-compose file\n'));

  console.log(chalk.white('Commands (global):'));
  console.log(chalk.gray('  list, ls             List installed services'));
  console.log(chalk.gray('  list --all           List all available services'));
  console.log(chalk.gray('  search <query>       Search available services'));
  console.log(chalk.gray('  status, ps           Show running containers status'));
  console.log(chalk.gray('  init <service>       Initialize a new service'));
  console.log(chalk.gray('  help                 Show this help message\n'));

  console.log(chalk.white('Examples:'));
  console.log(chalk.gray('  easy download postgres'));
  console.log(chalk.gray('  easy up postgres'));
  console.log(chalk.gray('  easy down postgres'));
  console.log(chalk.gray('  easy logs postgres'));
  console.log(chalk.gray('  easy validate postgres'));
  console.log(chalk.gray('  easy status'));
  console.log(chalk.gray('  easy config postgres --edit'));
  console.log(chalk.gray('  easy search mysql'));
  console.log(chalk.gray('  easy list'));
  console.log(chalk.gray('  easy help\n'));
}

module.exports = { help };
