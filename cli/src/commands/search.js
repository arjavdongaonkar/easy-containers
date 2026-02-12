const chalk = require('chalk');
const ora = require('ora');
const { getAvailableServices } = require('../utils/config');

async function search(query, options = {}) {
  const spinner = ora('Searching services...').start();

  try {
    const availableServices = await getAvailableServices();
    
    if (!query || query.trim() === '') {
      spinner.stop();
      console.log(chalk.yellow('\n⚠️  Please provide a search query.\n'));
      console.log(chalk.gray('Example: easy search postgres\n'));
      return;
    }

    // Filter services based on query
    const results = availableServices.filter(service => 
      service.toLowerCase().includes(query.toLowerCase())
    );

    spinner.stop();

    if (results.length === 0) {
      console.log(chalk.yellow(`\n⚠️  No services found matching "${query}"\n`));
      console.log(chalk.gray('Try a different search term or use "easy list --all" to see all services.\n'));
      return;
    }

    console.log(chalk.bold.cyan(`\n🔍 Search Results for "${query}":\n`));
    console.log(chalk.gray('─'.repeat(60)));

    results.forEach((service, index) => {
      console.log(chalk.green(`\n${index + 1}. ${chalk.bold(service)}`));
      
      // Add service descriptions if available
      const descriptions = {
        'postgres': 'PostgreSQL database server',
        'mysql': 'MySQL database server',
        'mongodb': 'MongoDB NoSQL database',
        'redis': 'Redis in-memory data store',
        'nginx': 'NGINX web server',
        'apache': 'Apache HTTP Server',
        'elasticsearch': 'Elasticsearch search engine',
        'rabbitmq': 'RabbitMQ message broker',
        'kafka': 'Apache Kafka streaming platform',
        'jenkins': 'Jenkins automation server'
      };

      const description = descriptions[service.toLowerCase()];
      if (description) {
        console.log(chalk.gray(`   ${description}`));
      }
      
      console.log(chalk.gray(`   To install: easy up ${service}`));
    });

    console.log(chalk.gray('\n' + '─'.repeat(60)));
    console.log(chalk.cyan(`\nFound ${results.length} service(s)\n`));

  } catch (error) {
    spinner.fail(chalk.red('Failed to search services'));
    throw error;
  }
}

module.exports = { search };