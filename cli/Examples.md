# Easy Containers CLI Examples

## 1. Start and stop a service

```bash
easy up postgres
easy status
easy down postgres
```

## 2. Download first, then run

```bash
easy download redis
easy up redis
```

## 3. List installed and available services

```bash
easy list
easy list --all
```

## 4. Search services

```bash
easy search kafka
easy search sql
```

## 5. View logs

```bash
# Last lines
easy logs postgres

# Follow live
easy logs postgres --follow

# Last 20 lines
easy logs postgres --tail 20
```

## 6. Check and inspect configuration

```bash
easy show postgres
easy validate postgres
```

## 7. Manage environment values

```bash
# Interactive config
easy config postgres

# Edit .env in editor
easy config postgres --edit

# Show current values
easy config postgres --show

# Reset from sample
easy config postgres --reset
```

## 8. Run command inside container

```bash
# Open shell
easy exec postgres

# Run direct command
easy exec postgres psql -U postgres
```

## 9. Update and restart

```bash
easy pull postgres
easy restart postgres
```

## 10. Create a new local service template

```bash
easy init myapp
easy init mydb --template database
easy up myapp
```

## 11. Useful flow for daily use

```bash
easy list
easy up redis
easy logs redis --follow
# Ctrl+C to stop log stream
easy down redis
```
