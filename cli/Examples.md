# Easy Containers - Usage Examples

## Basic Scenarios

### 1. Quick Database Setup

Start a PostgreSQL database in seconds:

```bash
# Start PostgreSQL
easy up postgres

# Output:
# ✓ postgres is up and running!
# Service: postgres
# Location: ~/.easy-containers/services/postgres
# 
# To stop: easy down postgres
```

Connect to it:
```bash
psql -h localhost -U postgres
```

### 2. Development Environment

Set up a complete development stack:

```bash
# Initialize a web app
easy init myapp --template webapp

# This creates:
# - Node.js application container
# - PostgreSQL database
# - Nginx reverse proxy

# Start everything
easy up myapp

# View status
easy status

# Output:
# 🐳 Container Status:
# ┌─────────────┬───────────────┬────────────────┬─────────────┬────────────┐
# │ ID          │ Name          │ Image          │ Status      │ Ports      │
# ├─────────────┼───────────────┼────────────────┼─────────────┼────────────┤
# │ abc123def456│ myapp_app     │ node:18-alpine │ Up 2 mins   │ 3000:3000  │
# │ def456abc789│ myapp_db      │ postgres:15    │ Up 2 mins   │ 5432:5432  │
# │ ghi789jkl012│ myapp_nginx   │ nginx:alpine   │ Up 2 mins   │ 80:80      │
# └─────────────┴───────────────┴────────────────┴─────────────┴────────────┘
```

### 3. Working with Multiple Services

Run multiple isolated services:

```bash
# Start different databases
easy up postgres
easy up mysql
easy up redis
easy up mongodb

# List all services
easy list

# Output:
# 📦 Installed Services:
# 
# 🟢  postgres
#    ● Running
#    Path: postgres
# 
# 🟢  mysql
#    ● Running
#    Path: mysql
# 
# 🟢  redis
#    ● Running
#    Path: redis
# 
# 🟢  mongodb
#    ● Running
#    Path: mongodb
# 
# Total: 4 service(s)
```

## Advanced Scenarios

### 4. Custom Service Creation

Create a custom microservices architecture:

```bash
# Initialize services
easy init auth-service --template basic
easy init api-service --template basic
easy init cache --template basic

# Customize each service
cd ~/.easy-containers/services/auth-service
# Edit docker-compose.yml

# Start all services
easy up auth-service
easy up api-service
easy up cache
```

### 5. Database Migration Workflow

```bash
# Start database
easy up postgres

# Run migrations
easy exec postgres psql -U postgres -d mydb -f /path/to/migration.sql

# Or open interactive shell
easy exec postgres
# Inside container:
psql -U postgres
\c mydb
\dt  # List tables
```

### 6. Debugging and Troubleshooting

```bash
# Check service configuration
easy show myapp

# Output:
# 📦 MYAPP
# ─────────────────────────────────────────
# 
# 🔧 Configuration:
#    Location: ~/.easy-containers/services/myapp
#    Compose File: docker-compose.yml
# 
# 🐳 Containers:
#    app:
#       Image: node:18-alpine
#       Ports:
#         - 3000:3000
#       Environment:
#         - NODE_ENV=production
#         - DATABASE_URL=postgres://...

# Check container status
easy status

# View real-time logs
easy logs myapp --follow

# View last 50 lines
easy logs myapp --tail 50

# Validate configuration
easy validate myapp

# Output:
# ✓ Validation Results for myapp:
# ─────────────────────────────────────────
# ✓ Configuration is valid!
# No issues or warnings found.
```

### 7. Service Maintenance

```bash
# Update images
easy pull myapp

# Restart to apply updates
easy restart myapp

# Or do both at once
easy pull myapp && easy restart myapp
```

### 8. CI/CD Integration

Use in CI/CD pipelines:

```bash
#!/bin/bash
# ci-test.sh

# Start test database
easy up test-postgres

# Wait for it to be ready
sleep 5

# Run tests
npm test

# Cleanup
easy down test-postgres --volumes

# Exit with test status
exit $?
```

### 9. Team Collaboration

Share service configurations:

```bash
# Developer A: Create and configure service
easy init shared-db --template database
cd ~/.easy-containers/services/shared-db
# Customize docker-compose.yml
# Commit to Git

# Developer B: Use the same configuration
git clone <repo>
cd shared-db
easy up shared-db
```

### 10. Production-like Local Environment

```bash
# Create production-like setup
easy init prod-api --template webapp

# Edit to use production settings
cd ~/.easy-containers/services/prod-api
# Update docker-compose.yml with:
# - Resource limits
# - Health checks
# - Production images
# - Proper networking

# Start with production config
easy up prod-api

# Monitor
easy logs prod-api --follow --timestamps
```

## Real-World Examples

### Full-Stack JavaScript Application

```bash
# 1. Initialize project
easy init myproject --template webapp

# 2. Customize configuration
cd ~/.easy-containers/services/myproject
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  frontend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./frontend:/app
    ports:
      - "3000:3000"
    command: npm run dev
    environment:
      - REACT_APP_API_URL=http://localhost:4000

  backend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./backend:/app
    ports:
      - "4000:4000"
    command: npm run dev
    environment:
      - DATABASE_URL=postgres://user:password@db:5432/mydb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_USER: user
      POSTGRES_DB: mydb
    volumes:
      - db_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  db_data:
  redis_data:
EOF

# 3. Create application directories
mkdir -p frontend backend

# 4. Start everything
easy up myproject

# 5. Check logs
easy logs myproject --follow

# 6. Run database migrations
easy exec myproject-backend npm run migrate

# 7. Access Redis CLI
easy exec myproject-redis redis-cli
```

### WordPress Site

```bash
# Initialize WordPress
easy init myblog --template basic

cd ~/.easy-containers/services/myblog
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - ./wordpress:/var/www/html

  db:
    image: mysql:8
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
      MYSQL_ROOT_PASSWORD: rootpassword
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
EOF

# Start WordPress
easy up myblog

# Access at http://localhost:8080
```

### Elasticsearch & Kibana Stack

```bash
easy init elastic-stack

cd ~/.easy-containers/services/elastic-stack
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data

  kibana:
    image: kibana:8.11.0
    ports:
      - "5601:5601"
    environment:
      ELASTICSEARCH_HOSTS: http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  es_data:
EOF

easy up elastic-stack

# Access Kibana at http://localhost:5601
```

## Tips and Tricks

### Quick Commands

```bash
# Alias for frequently used commands
alias eup='easy up'
alias edown='easy down'
alias els='easy list'
alias elogs='easy logs'
alias estatus='easy status'

# Now use:
eup postgres
estatus
elogs postgres -f
```

### One-liners

```bash
# Start service and immediately view logs
easy up myapp && easy logs myapp -f

# Restart and clear volumes
easy down myapp -v && easy up myapp

# Check if service is running
easy status | grep myapp

# Quick database backup
easy exec postgres pg_dump -U postgres mydb > backup.sql

# Restore database
cat backup.sql | easy exec postgres psql -U postgres mydb
```

### Environment-specific Configs

```bash
# Development
easy up myapp

# Production-like (with different compose file)
cd ~/.easy-containers/services/myapp
docker-compose -f docker-compose.prod.yml up -d
```

## Common Issues and Solutions

### Issue: Port Already in Use

```bash
# Find what's using the port
lsof -i :5432

# Stop conflicting service
easy down conflicting-service

# Or change port in docker-compose.yml
# "5433:5432" instead of "5432:5432"
```

### Issue: Service Won't Start

```bash
# Check configuration
easy validate myservice

# View detailed logs
easy logs myservice --tail 100

# Check Docker status
docker ps -a
```

### Issue: Out of Disk Space

```bash
# Clean up stopped containers
docker container prune -f

# Clean up unused volumes
docker volume prune -f

# Clean up everything
docker system prune -a --volumes -f
```

## Best Practices

1. **Always use version control** for your service configurations
2. **Document environment variables** in README files
3. **Use named volumes** for persistent data
4. **Set resource limits** in production-like environments
5. **Implement health checks** for critical services
6. **Use .env files** for sensitive configuration
7. **Tag images** with specific versions, not `:latest`
8. **Regular backups** of database volumes
9. **Monitor logs** regularly
10. **Clean up** unused services and volumes

---

For more examples, visit: https://github.com/arjavdongaonkar/easy-containers/tree/main/examples