# Security Policy

## Supported Versions

This repository contains Docker Compose configurations intended **only for local development**.

There are no versioned releases with long-term security support. The `main` branch reflects the latest state.

## Reporting a Vulnerability

If you discover a security issue related to:
- Insecure default configurations
- Exposed credentials
- Vulnerable images
- Unsafe networking or port exposure

please report it responsibly.

### How to report
- **Do not open a public issue**
- Report via GitHub Security Advisories if available
  OR
- Contact the maintainer directly via GitHub

Include:
- A clear description of the issue
- Affected service / compose file
- Steps to reproduce (if applicable)

## Scope

### In scope
- Docker Compose configuration issues
- Hardcoded secrets
- Unsafe defaults for local environments
- Incorrect documentation that may lead to insecure usage

### Out of scope
- Vulnerabilities in third-party Docker images
- Production security concerns
- Misuse of configurations outside local development

## Disclosure

Once a valid issue is confirmed, it will be fixed in a reasonable timeframe and documented via commit history or release notes.
