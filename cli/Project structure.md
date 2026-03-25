# Easy Containers CLI Project Structure

This file explains what each main folder does.

## CLI folder layout

```text
cli/
├── bin/
│   └── cli.js
├── src/
│   ├── commands/
│   ├── constants/
│   └── utils/
├── README.md
├── Examples.md
├── Project structure.md
└── package.json
```

## Folder details

### `bin/`

- `cli.js`: Program entry point.
- Defines all command routes using Commander.

### `src/commands/`

Each file maps to one CLI command.

- `up.js`: start service
- `down.js`: stop service
- `list.js`: list installed services (and available with `--all`)
- `download.js`: download service files
- `show.js`: show service details
- `status.js`: show running containers
- `logs.js`: show service logs
- `restart.js`: restart service
- `pull.js`: pull updated images
- `exec.js`: run command in container
- `config.js`: manage `.env`
- `validate.js`: validate compose config
- `search.js`: search available services
- `init.js`: create new local template
- `help.js`: custom help output
- `index.js`: exports all command handlers

### `src/utils/`

Shared helper logic used by commands.

- `docker.js`: runs docker and docker-compose commands, docker checks
- `config.js`: service paths and available-services lookup
- `downloader.js`: downloads service folder from repository

### `src/constants/`

- `repository.js`: repository URL, branch, and services path constants

## Runtime location

When the CLI runs, service files are stored in:

```text
~/.easy-containers/services/
```

## Typical command flow

For `easy up postgres`:

1. `bin/cli.js` receives command
2. `src/commands/up.js` runs
3. `src/utils/downloader.js` ensures service exists locally
4. `src/utils/docker.js` runs `docker-compose up -d`

For `easy list --all`:

1. `src/commands/list.js` runs
2. Installed services are read from local path
3. Available services are fetched via `src/utils/config.js`
