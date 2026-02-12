# Easy Containers

Ready-to-run container setups for common development dependencies. Clone the repo, pick the service you need, and start it with Docker Compose—no local installs or version conflicts.

## Why

- Complex apps need services like Kafka, Redis, PostgreSQL, or Elasticsearch just to boot.
- Running multiple versions locally is painful and resource-heavy.
- Containers keep each project isolated and disposable.

## What’s included (by category)

**Databases**

- PostgreSQL, MySQL, MariaDB, MongoDB, Redis, Cassandra, Neo4j, ClickHouse, SQLite (with sqlite-web)

**Message brokers / queues**

- Kafka + Zookeeper, RabbitMQ, NATS, ActiveMQ, Redpanda (Kafka-compatible)

**Search / indexing / analytics**

- Elasticsearch, OpenSearch, Meilisearch, Typesense, Logstash, Kibana, Grafana Loki stack, Prometheus

**Dev tools / supporting services**

- MinIO, LocalStack, Mailpit, HashiCorp Vault, Consul, Etcd, Jaeger, Zipkin

**Frontend / API mocking**

- WireMock, MockServer, JSON Server

**CI / Git / runners**

- Jenkins, GitLab Runner, Drone CI

**Security / SBOM / scanners**

- Clair, Trivy, Grype, SonarQube

## Prerequisites (macOS focus)

- Docker Desktop **or** Colima + Docker CLI.
- Docker Compose v2 (bundled with modern Docker builds).

If you use Colima (recommended on macOS):

```bash
colima start --cpu 2 --memory 4 --disk 20
```

## Usage

Each service lives under `services/<name>/docker-compose.yml`.

Start a service (example: Redis):

```bash
cd services/redis
docker compose up -d
```

Stop and remove containers:

```bash
docker compose down
```

For services with credentials, copy the sample env file first:

```bash
cp env.sample .env  # run inside the service directory
```

### Service quickstarts (selected)

- PostgreSQL: `cd services/postgres && cp env.sample .env && docker compose up -d`
- MySQL: `cd services/mysql && cp env.sample .env && docker compose up -d`
- MariaDB: `cd services/mariadb && cp env.sample .env && docker compose up -d`
- MongoDB: `cd services/mongodb && cp env.sample .env && docker compose up -d`
- Redis: `cd services/redis && docker compose up -d`
- Kafka: `cd services/kafka && docker compose up -d`
- Redpanda: `cd services/redpanda && docker compose up -d`
- RabbitMQ: `cd services/rabbitmq && cp env.sample .env && docker compose up -d` (UI `localhost:15672`)
- NATS: `cd services/nats && docker compose up -d`
- ActiveMQ: `cd services/activemq && docker compose up -d`
- Elasticsearch: `cd services/elasticsearch && docker compose up -d` (needs ~2GB RAM)
- OpenSearch: `cd services/opensearch && docker compose up -d` (needs ~2GB RAM)
- Typesense: `cd services/typesense && cp env.sample .env && docker compose up -d`
- Meilisearch: `cd services/meilisearch && docker compose up -d`
- Kibana stack: `cd services/kibana && docker compose up -d` (includes its own Elasticsearch)
- Loki stack: `cd services/loki && docker compose up -d` (Grafana+Loki+Promtail)
- Prometheus: `cd services/prometheus && docker compose up -d`
- MinIO: `cd services/minio && cp env.sample .env && docker compose up -d` (console `localhost:9001`)
- LocalStack: `cd services/localstack && docker compose up -d` (multiple AWS ports)
- Mailpit: `cd services/mailpit && docker compose up -d` (UI `localhost:8025`)
- Vault: `cd services/vault && docker compose up -d` (dev mode, token `root`)
- Consul: `cd services/consul && docker compose up -d`
- Etcd: `cd services/etcd && docker compose up -d`
- Jaeger: `cd services/jaeger && docker compose up -d`
- Zipkin: `cd services/zipkin && docker compose up -d`
- WireMock: `cd services/wiremock && docker compose up -d`
- MockServer: `cd services/mockserver && docker compose up -d`
- JSON Server: `cd services/json-server && docker compose up -d`
- Jenkins: `cd services/jenkins && docker compose up -d`
- GitLab Runner: `cd services/gitlab-runner && cp env.sample .env && docker compose up -d` (requires registration token)
- Drone CI: `cd services/drone && cp env.sample .env && docker compose up -d`
- Clair: `cd services/clair && docker compose up -d`
- Trivy: `cd services/trivy && docker compose up -d`
- Grype: `cd services/grype && docker compose up -d`
- SonarQube: `cd services/sonarqube && docker compose up -d`

## Repo layout (not exhaustive)

- Databases: `services/postgres/`, `services/mysql/`, `services/mariadb/`, `services/mongodb/`, `services/redis/`, `services/cassandra/`, `services/neo4j/`, `services/clickhouse/`, `services/sqlite/`
- Messaging: `services/kafka/`, `services/redpanda/`, `services/rabbitmq/`, `services/nats/`, `services/activemq/`
- Search/analytics: `services/elasticsearch/`, `services/opensearch/`, `services/meilisearch/`, `services/typesense/`, `services/logstash/`, `services/kibana/`, `services/loki/`, `services/prometheus/`
- Dev/support: `services/minio/`, `services/localstack/`, `services/mailpit/`, `services/vault/`, `services/consul/`, `services/etcd/`, `services/jaeger/`, `services/zipkin/`
- Mocking: `services/wiremock/`, `services/mockserver/`, `services/json-server/`
- CI/runners: `services/jenkins/`, `services/gitlab-runner/`, `services/drone/`
- Security/scanners: `services/clair/`, `services/trivy/`, `services/grype/`, `services/sonarqube/`
- Docs: `docs/macOS.md`


## CLI Usage

You can now use Easy Containers without cloning the repository!

### Installation

```bash
npm install -g easy-containers
```


### Quick Start

```bash
# Start a service
easy up redis

# Stop a service
easy down redis 

# List all services
easy list
```

For more information, see the [CLI documentation](./cli/README.md).

## Contributing

- Add new services under `services/<name>/docker-compose.yml`.
- Include a short README or comments explaining ports, credentials, and default topics/databases as relevant.
- Keep defaults sane for local development and prefer official images.

## License

MIT
