# Easy Containers - Project Structure

## Directory Layout

```
easy-containers/
│
├── bin/                          # Executable files
│   └── cli.js                    # Main CLI entry point
│
├── src/                          # Source code
│   ├── commands/                 # Command implementations
│   │   ├── up.js                 # Start containers
│   │   ├── down.js               # Stop containers
│   │   ├── list.js               # List services
│   │   ├── show.js               # Show service details
│   │   ├── status.js             # Container status
│   │   ├── logs.js               # View logs
│   │   ├── restart.js            # Restart containers
│   │   ├── init.js               # Initialize service
│   │   ├── pull.js               # Pull images
│   │   ├── exec.js               # Execute commands
│   │   ├── search.js             # Search services
│   │   └── validate.js           # Validate config
│   │
│   └── utils/                    # Utility functions
│       ├── config.js             # Configuration management
│       ├── docker.js             # Docker operations
│       └── downloader.js         # Service downloader
│
├── services/                     # Service templates (repository)
│   ├── postgres/
│   │   ├── docker-compose.yml
│   │   └── README.md
│   ├── mysql/
│   │   ├── docker-compose.yml
│   │   └── README.md
│   ├── redis/
│   │   ├── docker-compose.yml
│   │   └── README.md
│   └── ...
│
├── tests/                        # Test files
│   ├── commands/
│   │   ├── up.test.js
│   │   └── ...
│   └── utils/
│       ├── config.test.js
│       └── ...
│
├── docs/                         # Documentation
│   ├── commands.md               # Command documentation
│   ├── contributing.md           # Contributing guide
│   └── examples.md               # Usage examples
│
├── .github/                      # GitHub specific files
│   └── workflows/
│       └── ci.yml                # CI/CD pipeline
│
├── package.json                  # Node.js dependencies
├── README.md                     # Project documentation
├── LICENSE                       # License file
└── .gitignore                    # Git ignore rules
```

## User Data Structure

When installed, easy-containers creates the following structure in the user's home directory:

```
~/.easy-containers/
│
├── services/                     # Installed services
│   ├── my-postgres/
│   │   ├── docker-compose.yml
│   │   ├── README.md
│   │   └── data/                 # Service-specific data
│   │
│   ├── my-app/
│   │   ├── docker-compose.yml
│   │   ├── README.md
│   │   ├── app/                  # Application files
│   │   └── nginx.conf
│   │
│   └── ...
│
├── config.json                   # Global configuration
└── cache/                        # Cached data
    └── available-services.json   # List of available services
```

## File Purposes

### Core Files

- **bin/cli.js**: Main entry point for the CLI. Defines all commands and options.
- **package.json**: Defines project metadata, dependencies, and npm scripts.
- **README.md**: User-facing documentation with installation and usage instructions.

### Command Files

Each command file in `src/commands/` implements a specific CLI command:

- **up.js**: Downloads (if needed) and starts a service using docker-compose
- **down.js**: Stops and removes containers for a service
- **list.js**: Shows installed services and their status
- **show.js**: Displays detailed information about a service
- **status.js**: Shows running container status across all services
- **logs.js**: Displays container logs with optional following
- **restart.js**: Restarts a service (down + up)
- **init.js**: Creates a new service from a template
- **pull.js**: Updates container images for a service
- **exec.js**: Executes commands inside running containers
- **search.js**: Searches available services in the repository
- **validate.js**: Validates docker-compose configuration files

### Utility Files

- **config.js**: Manages service paths, configuration, and file system operations
- **docker.js**: Handles Docker and Docker Compose operations
- **downloader.js**: Downloads services from the repository

## Command Flow Examples

### Starting a Service (`easy up postgres`)

1. CLI parses command and options
2. Verifies Docker environment
3. Calls `up.js` command
4. `downloader.js` checks if service exists locally
5. If not, downloads from repository/template
6. `docker.js` runs `docker-compose up -d`
7. Displays success message with service info

### Listing Services (`easy list`)

1. CLI calls `list.js` command
2. `config.js` reads installed services from `~/.easy-containers/services/`
3. Queries Docker for container status
4. Displays formatted table with service names and status

### Viewing Logs (`easy logs postgres -f`)

1. CLI parses command and options
2. Verifies service exists
3. `logs.js` spawns `docker-compose logs -f` process
4. Streams output to terminal
5. Handles Ctrl+C gracefully

## Adding a New Command

To add a new command:

1. Create command file in `src/commands/`:
   ```javascript
   // src/commands/mycommand.js
   async function myCommand(service, options) {
     // Implementation
   }
   module.exports = { myCommand };
   ```

2. Register in `bin/cli.js`:
   ```javascript
   const { myCommand } = require('../src/commands/mycommand');
   
   program
     .command('mycommand <service>')
     .description('Description of my command')
     .option('-f, --flag', 'Some flag')
     .action(async (service, options) => {
       await myCommand(service, options);
     });
   ```

3. Add tests in `tests/commands/mycommand.test.js`
4. Update documentation

## Configuration Management

### Global Config (`~/.easy-containers/config.json`)

```json
{
  "version": "1.0.0",
  "defaultRegistry": "docker.io",
  "servicesDir": "~/.easy-containers/services",
  "repositories": [
    {
      "name": "official",
      "url": "https://github.com/arjavdongaonkar/easy-containers.git"
    }
  ]
}
```

### Service Config (`~/.easy-containers/services/myapp/docker-compose.yml`)

Standard docker-compose.yml file with service configuration.

## Best Practices

1. **Error Handling**: All commands should have try-catch blocks and display user-friendly error messages
2. **Spinners**: Use ora spinners for long-running operations
3. **Colors**: Use chalk for consistent colored output
4. **Validation**: Validate inputs before executing Docker commands
5. **Documentation**: Each command should have clear help text and examples

## Development Workflow

1. Install dependencies: `npm install`
2. Link locally: `npm link`
3. Make changes to command files
4. Test: `easy <command>`
5. Run tests: `npm test`
6. Unlink: `npm unlink -g easy`

## Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- up.test.js

# Run with coverage
npm test -- --coverage
```

## Deployment

1. Update version in `package.json`
2. Build if necessary
3. Publish to npm: `npm publish`
4. Tag release in Git
5. Update documentation