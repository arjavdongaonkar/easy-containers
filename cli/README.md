# 🐳 Easy Containers

A powerful yet simple CLI tool for managing Docker containers. Simplify your Docker workflow with intuitive commands.

## ✨ Features

- 🚀 **Quick Start** - Start containers with a single command
- 📦 **Template Support** - Initialize projects from templates
- 🔍 **Service Discovery** - Search and browse available services
- 📊 **Status Monitoring** - Real-time container status
- 📝 **Log Viewing** - Easy access to container logs
- ✅ **Configuration Validation** - Validate docker-compose files
- 🎯 **Interactive CLI** - Beautiful, user-friendly interface

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0 or higher)
- [Node.js](https://nodejs.org/) (v14 or higher)

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/arjavdongaonkar/easy-containers.git
cd easy-containers

# Install dependencies
npm install

# Link globally (optional)
npm link
```

## 📖 Usage

### Basic Commands

#### Start a Service
```bash
easy up <service>

# Example
easy up postgres
easy up redis
```

#### Stop a Service
```bash
easy down <service>

# Example
easy down postgres

# Remove volumes too
easy down postgres --volumes
```

#### List Services
```bash
# List installed services
easy list

# Show all available services
easy list --all
```

#### Show Service Details
```bash
easy show <service>

# Example
easy show postgres
```

### Container Management

#### Check Status
```bash
# Show running containers
easy status

# Verbose output
easy status --verbose
```

#### View Logs
```bash
# View last 100 lines
easy logs <service>

# Follow logs in real-time
easy logs <service> --follow

# Show last N lines
easy logs <service> --tail 50

# Show timestamps
easy logs <service> --timestamps
```

#### Restart Service
```bash
easy restart <service>

# Example
easy restart nginx
```

### Service Creation

#### Initialize New Service
```bash
easy init <service>

# With template
easy init myapp --template webapp
easy init mydb --template database

# Available templates:
# - basic: Simple single-container setup
# - database: PostgreSQL or MySQL database
# - webapp: Full stack with app, database, and nginx
```

### Advanced Commands

#### Pull/Update Images
```bash
easy pull <service>

# Example
easy pull postgres
```

#### Execute Commands in Container
```bash
# Open interactive shell
easy exec <service>

# Run specific command
easy exec postgres psql -U postgres

# Example
easy exec redis redis-cli
```

#### Search Services
```bash
easy search <query>

# Example
easy search postgres
easy search database
```

#### Validate Configuration
```bash
easy validate <service>

# Example
easy validate myapp
```

## 📁 Project Structure

```
easy-containers/
├── bin/
│   └── cli.js              # Main CLI entry point
├── src/
│   ├── commands/           # Command implementations
│   │   ├── up.js
│   │   ├── down.js
│   │   ├── list.js
│   │   ├── show.js
│   │   ├── status.js
│   │   ├── logs.js
│   │   ├── restart.js
│   │   ├── init.js
│   │   ├── pull.js
│   │   ├── exec.js
│   │   ├── search.js
│   │   └── validate.js
│   └── utils/              # Utility functions
│       ├── config.js
│       └── docker.js
├── package.json
└── README.md
```

## 🎨 Command Reference

| Command | Alias | Description |
|---------|-------|-------------|
| `easy up <service>` | - | Start a service |
| `easy down <service>` | - | Stop and remove containers |
| `easy list` | `ls` | List installed services |
| `easy show <service>` | - | Show service details |
| `easy status` | `ps` | Show running containers |
| `easy logs <service>` | - | View container logs |
| `easy restart <service>` | - | Restart a service |
| `easy init <service>` | - | Initialize new service |
| `easy pull <service>` | - | Pull/update images |
| `easy exec <service> [cmd]` | - | Execute command in container |
| `easy search <query>` | - | Search available services |
| `easy validate <service>` | - | Validate configuration |

## 🔧 Configuration

Services are stored in `~/.easy-containers/services/`. Each service has its own directory with:
- `docker-compose.yml` - Docker Compose configuration
- `README.md` - Service documentation
- Additional configuration files as needed

## 💡 Examples

### Start PostgreSQL database
```bash
easy up postgres
# Access at localhost:5432
```

### Create and start a web application
```bash
# Initialize from template
easy init myapp --template webapp

# Edit configuration
cd ~/.easy-containers/services/myapp
# Edit docker-compose.yml

# Start the service
easy up myapp
```

### Monitor a running service
```bash
# Check status
easy status

# View logs
easy logs myapp --follow

# Execute commands
easy exec myapp npm run migrate
```

### Search and install a service
```bash
# Search for Redis
easy search redis

# Start Redis
easy up redis

# Verify it's running
easy status
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Commander.js](https://github.com/tj/commander.js/)
- Styled with [Chalk](https://github.com/chalk/chalk)
- Spinners by [Ora](https://github.com/sindresorhus/ora)

## 📧 Contact

Arjav Dongaonkar - [@arjavdongaonkar](https://github.com/arjavdongaonkar)

Project Link: [https://github.com/arjavdongaonkar/easy-containers](https://github.com/arjavdongaonkar/easy-containers)

---

Made with ❤️ by [Arjav Dongaonkar](https://github.com/arjavdongaonkar)