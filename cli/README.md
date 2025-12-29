
# Easy Containers CLI

A simple CLI tool to run Docker containers for common development services without cloning the repository.

## Installation

```bash
npm install -g @easy-containers/cli
```

## Usage

### Start a service

```bash
easy redis up
easy postgres up
easy mongodb up
```

### Stop a service

```bash
easy redis down
easy postgres down
easy mongodb down
```

### List available services

```bash
easy list
# or
easy ls
```

## Available Services

Run `easy list` to see all available services.

## Requirements

- Docker Desktop or Docker Engine + Docker Compose must be installed
- Node.js 14 or higher

## How it works

The CLI automatically downloads the required docker-compose files from the repository and stores them in `~/.easy-containers/services/`. When you run a service, it executes docker-compose commands in the appropriate directory.

## Examples

```bash
# Start Redis
easy redis up

# Stop Redis
easy redis down

# List all services
easy list
```

## Configuration Files

Downloaded services are stored in: `~/.easy-containers/services/`

## Support

For issues and feature requests, visit: https://github.com/arjavdongaonkar/easy-containers/issues