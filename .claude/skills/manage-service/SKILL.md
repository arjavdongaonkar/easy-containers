---
name: manage-service
description: This skill should be used when the user asks to "start postgres", "spin up redis", "run kafka", "stop the service", "bring down mysql", "restart elasticsearch", "check status of a container", "start X with a custom port/password/etc", or otherwise wants to start, stop, restart, or configure any service under services/ in the easy-containers repo. Handles env.sample -> .env creation and applies custom env var overrides (port, credentials, version tag) before starting.
---

Manage the Docker Compose services defined under `services/<name>/` in this repo (postgres, redis, kafka, elasticsearch, etc.). Each service directory has a `docker-compose.yml` and, for services needing credentials/config, an `env.sample`.

## Core workflow

1. Identify the target service name. It must match a directory under `services/`. List them with `ls services/` if unsure.
2. Identify the action: start (`up`), stop (`down`), `restart`, `logs`, or `status`.
3. Identify any custom env vars the user wants (port, password, version tag, db name, etc.) by reading `services/<name>/env.sample` if it exists — that file lists every overridable variable and its default.
4. Run the bundled script instead of hand-rolling `docker compose` + `sed` commands:

```bash
.claude/skills/manage-service/scripts/run-service.sh <service> <action> [KEY=VALUE ...]
```

Examples:

```bash
# Start postgres with defaults
.claude/skills/manage-service/scripts/run-service.sh postgres up

# Start postgres on a custom port with a custom password
.claude/skills/manage-service/scripts/run-service.sh postgres up POSTGRES_PORT=5555 POSTGRES_PASSWORD=secret123

# Stop redis
.claude/skills/manage-service/scripts/run-service.sh redis down

# Restart kafka with a different tag
.claude/skills/manage-service/scripts/run-service.sh kafka restart KAFKA_TAG=3.7

# Wipe volumes too (destructive - confirm with user first)
.claude/skills/manage-service/scripts/run-service.sh postgres down --volumes

# Check running containers for a service
.claude/skills/manage-service/scripts/run-service.sh postgres status

# Tail logs
.claude/skills/manage-service/scripts/run-service.sh postgres logs
```

## What the script does

- Creates `.env` from `env.sample` on first run if `.env` doesn't exist yet (services without `env.sample`, e.g. redis/nginx/kafka, need no `.env`).
- For each `KEY=VALUE` argument, updates the existing line in `.env` if present, else appends it. This lets a service run with a non-default port, password, image tag, etc. without editing files by hand.
- Runs the matching `docker compose` subcommand from inside `services/<name>/` and prints `docker compose ps` after `up`/`restart` so the user sees exposed ports immediately.

## Guidance

- Before overriding a var, check `env.sample` (or the `${VAR:-default}` interpolations in `docker-compose.yml`) to confirm the exact variable name expected — names are inconsistent across services (e.g. `POSTGRES_PORT` vs `MONGO_PORT` vs `KAFKA_TAG`).
- `down --volumes` deletes persisted data (e.g. Postgres data volume) — confirm with the user before running it, per this repo's destructive-action norms.
- Multiple services can run simultaneously since each has isolated named volumes and configurable host ports — reuse this script per service if the user wants a multi-service stack (e.g. postgres + redis).
- If `docker compose` is not available, tell the user to start Docker Desktop or Colima (`colima start --cpu 2 --memory 4 --disk 20`) per `README.md`.

## If the requested var isn't in env.sample yet

`.env` accepts any `KEY=VALUE` line, but it only affects the container if `docker-compose.yml` actually references `${KEY}` somewhere (port mapping, `image: img:${KEY}`, `environment:`, `command:`, etc.).

- **Var name exists in docker-compose.yml but not in env.sample** (sample is just incomplete): the script's override still works — it appends the line to `.env`. Optionally also add it to `env.sample` with its default so future runs are documented.
- **Var doesn't appear in docker-compose.yml at all**: setting it in `.env` is a no-op. Edit `docker-compose.yml` first to reference `${NEW_VAR:-default}` in the right place (env var, port, image tag, volume path), add the same line to `env.sample`, then rerun the script with the override.
