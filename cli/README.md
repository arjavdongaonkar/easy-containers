# Easy Containers CLI

Easy Containers is a command line tool to manage Docker services quickly.

## Requirements

- Docker running on your machine
- Docker Compose available in your PATH
- Node.js 14+

## Install

Install globally (recommended):

```bash
npm install -g easy-containers
```

Install in current project:

```bash
npm install easy-containers
```

## Basic usage

```bash
easy <command> [service] [options]
```

Run help anytime:

```bash
easy help
```

## Commands

### Service commands

- `easy download <service>`: Download service files from repository
- `easy up <service>`: Start a service
- `easy down <service>`: Stop a service
- `easy restart <service>`: Restart a service
- `easy pull <service>`: Pull latest image updates
- `easy logs <service>`: Show logs for a service
- `easy show <service>`: Show service details from compose file
- `easy exec <service> [command...]`: Run a command inside running container
- `easy config <service>`: Manage `.env` values
- `easy validate <service>`: Validate compose configuration

### Global commands

- `easy list`: Show installed services
- `easy list --all`: Show all available services from repository
- `easy search <query>`: Search available services
- `easy status` (alias: `easy ps`): Show running containers
- `easy init <service>`: Create a new local service template
- `easy help`: Show help

## Quick examples

```bash
# Start PostgreSQL
easy up postgres

# See what's installed
easy list

# See all available services
easy list --all

# Follow logs
easy logs postgres --follow

# Validate compose file
easy validate postgres

# Open shell in container
easy exec postgres
```

## Where services are stored

Installed services are stored in:

```text
~/.easy-containers/services/
```

Each service directory usually contains:

- `docker-compose.yml`
- `env.sample` (if provided)
- `.env` (created/managed locally)

## Notes

- If a service is not installed, `easy up <service>` will try to download it first.
- Use `easy config <service>` to create/edit `.env` values safely.
- Use `easy down <service> --volumes` if you want to remove volumes too.
