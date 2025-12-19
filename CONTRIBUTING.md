# Contributing to easy-containers

Thanks for your interest in contributing!

## What this repository is

This repository is a collection of Docker Compose setups intended for **local development only**.

## How to contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b add-<service-name>`
3. Add your Docker Compose setup under an appropriate directory
4. Include a README explaining:

- What the service does
- Exposed ports
- Default credentials (if any)

5. Run: `docker compose up` to ensure it starts without errors
6. Open a Pull Request

## Guidelines

- Keep services **development-safe** (no production credentials)
- Avoid hardcoding secrets
- Use `.env.example` when environment variables are required
- Prefer official Docker images where possible

## Reporting issues

Please include:

- Docker version
- OS
- Exact error output
