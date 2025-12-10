# macOS quickstart

## Install Docker tooling
- Option 1: Docker Desktop (simplest GUI).
- Option 2: Colima (lightweight) + Docker CLI:
  ```bash
  brew install docker colima
  colima start --cpu 2 --memory 4 --disk 20
  ```

Verify Docker is running:
```bash
docker info
docker compose version
```

## Performance tips
- Use Colima with `--arch x86_64` if you need Intel images on Apple Silicon:
  ```bash
  colima start --arch x86_64 --cpu 2 --memory 4 --disk 40
  ```
- Keep services isolated: run only what you need per project to reduce memory.
- For heavier stacks (Elasticsearch, LocalStack, Kafka), allocate more resources:
  ```bash
  colima start --cpu 4 --memory 8 --disk 40
  ```
- Very heavy combos (Kibana stack, SonarQube, Jenkins) may benefit from `--cpu 6 --memory 12`.

## Troubleshooting
- Port already in use: stop local services or change the published port in the compose file (left side of `HOST:CONTAINER` mapping).
- Volume permissions: if you see permission errors, recreate containers after cleaning volumes: `docker compose down -v && docker compose up -d`.

