#!/usr/bin/env bash
# Start/stop/inspect an easy-containers service, applying env overrides.
#
# Usage:
#   run-service.sh <service> up   [KEY=VALUE ...]
#   run-service.sh <service> down
#   run-service.sh <service> restart [KEY=VALUE ...]
#   run-service.sh <service> logs
#   run-service.sh <service> status
#   run-service.sh <service> down --volumes   # down + wipe volumes

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
SERVICE="${1:-}"
ACTION="${2:-}"
shift 2 || true

if [[ -z "$SERVICE" || -z "$ACTION" ]]; then
  echo "Usage: run-service.sh <service> <up|down|restart|logs|status> [KEY=VALUE ...]" >&2
  exit 1
fi

SERVICE_DIR="$REPO_ROOT/services/$SERVICE"
if [[ ! -d "$SERVICE_DIR" ]]; then
  echo "Error: no such service '$SERVICE' under services/" >&2
  echo "Available: $(ls "$REPO_ROOT/services")" >&2
  exit 1
fi

cd "$SERVICE_DIR"

# Materialize .env on first run (from env.sample if present, else empty).
# docker compose auto-loads .env for ${VAR} substitution in docker-compose.yml
# even when the service has no env_file directive, so this works for every
# service, not just ones that ship an env.sample.
if [[ ! -f .env ]]; then
  if [[ -f env.sample ]]; then
    cp env.sample .env
    echo "Created .env from env.sample in services/$SERVICE"
  else
    touch .env
  fi
fi

# Apply KEY=VALUE overrides passed as remaining args, e.g. POSTGRES_PORT=5555.
# Any var name works here, even ones not listed in env.sample: if the key
# already has a line in .env it's updated in place, otherwise a new line is
# appended. New vars only take effect if docker-compose.yml actually
# references them (as ${VAR} or ${VAR:-default}) - add that reference to
# docker-compose.yml first if it's missing.
for kv in "$@"; do
  [[ "$kv" == --* ]] && continue
  key="${kv%%=*}"
  val="${kv#*=}"
  if grep -q "^${key}=" .env; then
    sed -i.bak "s|^${key}=.*|${key}=${val}|" .env && rm -f .env.bak
  else
    echo "${key}=${val}" >> .env
  fi
done

case "$ACTION" in
  up)
    docker compose up -d
    docker compose ps
    ;;
  down)
    if [[ " $* " == *" --volumes "* ]]; then
      docker compose down -v
    else
      docker compose down
    fi
    ;;
  restart)
    docker compose down
    docker compose up -d
    docker compose ps
    ;;
  logs)
    docker compose logs -f --tail=100
    ;;
  status|ps)
    docker compose ps
    ;;
  *)
    echo "Unknown action: $ACTION" >&2
    exit 1
    ;;
esac
