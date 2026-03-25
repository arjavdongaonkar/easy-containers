const chalk = require('chalk');
const ora = require('ora');
const { exec } = require('child_process');
const { promisify } = require('util');
const Table = require('cli-table3');

const execAsync = promisify(exec);

async function status(options = {}) {
  const spinner = ora('Checking container status...').start();

  try {
    // Get all running containers
    const { stdout } = await execAsync(
      'docker ps --format "{{.ID}}|{{.Names}}|{{.Image}}|{{.Status}}|{{.Ports}}"'
    );

    spinner.stop();

    if (!stdout.trim()) {
      console.log(chalk.yellow('\n⚠️  No containers are currently running.\n'));
      console.log(chalk.gray('Use "easy up <service>" to start a service.\n'));
      return;
    }

    const containers = stdout.trim().split('\n').map(line => {
      const [id, name, image, status, ports] = line.split('|');
      return { id, name, image, status, ports };
    });

    // Create table
    const table = new Table({
      head: [
        chalk.cyan.bold('ID'),
        chalk.cyan.bold('Name'),
        chalk.cyan.bold('Image'),
        chalk.cyan.bold('Status'),
        chalk.cyan.bold('Ports')
      ],
      colWidths: [15, 25, 30, 20, 30],
      wordWrap: true,
      style: {
        head: [],
        border: ['gray']
      }
    });

    containers.forEach(container => {
      const statusColor = container.status.toLowerCase().includes('up') 
        ? chalk.green 
        : chalk.red;
      
      table.push([
        chalk.gray(container.id.substring(0, 12)),
        chalk.bold(container.name),
        chalk.gray(container.image),
        statusColor(container.status),
        chalk.yellow(container.ports || 'N/A')
      ]);
    });

    console.log(chalk.bold.cyan('\n🐳 Container Status:\n'));
    console.log(table.toString());
    console.log(chalk.cyan(`\nTotal: ${containers.length} container(s) running\n`));

    if (options.verbose) {
      console.log(chalk.gray('\n💡 Tip: Use "easy logs <service>" to view container logs\n'));
    }

  } catch (error) {
    spinner.fail(chalk.red('Failed to get container status'));
    
    if (error.message.includes('docker')) {
      console.log(chalk.red('\n❌ Docker is not running or not installed.\n'));
      console.log(chalk.gray('Please make sure Docker is installed and running.\n'));
    } else {
      throw error;
    }
  }
}

module.exports = { status };