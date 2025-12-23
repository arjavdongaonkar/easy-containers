# Node.js (Docker Compose)

- **Supported versions:** defaults to Node 20 (override with `NODE_VERSION`, e.g. `22`)
- **Default port:** 3000 exposed as `${NODE_PORT:-3000}:3000`
- **Mount:** `${NODE_APP_PATH:-./app}` → `/workspace` (named volume for `node_modules`)

## Quick start

```bash
cd services/node
cp env.sample .env             # optional: customize NODE_VERSION/PORT/APP_PATH
docker compose up -d           # starts a dev-ready container
docker compose exec node node -v
```

## Using with a local project

- Put your app in `services/node/app` **or** set `NODE_APP_PATH` to an absolute/relative path.
- Example (init a new app inside the mounted path):

```bash
docker compose run --rm node npm init -y
docker compose run --rm node npm install express
docker compose exec node node index.js
```

## Notes

- `node_modules` stay in a named volume (`node_modules_${NODE_VERSION}`) to avoid host/OS conflicts.
- Container stays up with `sleep infinity`; use `docker compose exec node ...` to run scripts.

