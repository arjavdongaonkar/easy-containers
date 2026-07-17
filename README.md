# Easy Containers

Ready-to-run container setups for common development dependencies. Clone the repo, pick the service you need, and start it with Docker Compose—no local installs or version conflicts.

## Why

- Complex apps need services like Kafka, Redis, PostgreSQL, or Elasticsearch just to boot.
- Running multiple versions locally is painful and resource-heavy.
- Containers keep each project isolated and disposable.

## What’s included (by category)

**Databases**

- PostgreSQL, MySQL, MariaDB, MongoDB, Cassandra, Neo4j, ClickHouse, SQLite (with sqlite-web)
- CockroachDB (distributed SQL), ScyllaDB (Cassandra-compatible), TimescaleDB + InfluxDB (time-series)

**Caches**

- Redis, Valkey (Redis fork), Memcached

**Vector databases**

- Qdrant, Weaviate

**Message brokers / queues / streaming**

- Kafka + Zookeeper, RabbitMQ, NATS, ActiveMQ, Redpanda (Kafka-compatible), Apache Pulsar, Mosquitto (MQTT)

**Search / indexing**

- Elasticsearch, OpenSearch, Meilisearch, Typesense, Logstash, Kibana

**Observability**

- Prometheus, Grafana, Grafana Loki stack, Tempo, OpenTelemetry Collector, Jaeger, Zipkin

**Identity / workflow**

- Keycloak (OIDC/OAuth), Temporal (durable workflows)

**Dev tools / supporting services**

- MinIO, LocalStack, Mailpit, HashiCorp Vault, Consul, Etcd, SFTP

**Database admin UIs**

- Adminer, pgAdmin

**Web / reverse proxy**

- NGINX, Traefik, Caddy

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
- NGINX: `cd services/nginx && docker compose up -d`
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

New services:

- CockroachDB: `cd services/cockroachdb && docker compose up -d` (SQL `26257`, UI `localhost:8093`)
- ScyllaDB: `cd services/scylladb && docker compose up -d` (CQL `localhost:9043`)
- TimescaleDB: `cd services/timescaledb && cp env.sample .env && docker compose up -d` (`localhost:5433`)
- InfluxDB: `cd services/influxdb && cp env.sample .env && docker compose up -d` (UI `localhost:8086`)
- Valkey: `cd services/valkey && docker compose up -d` (`localhost:6380`)
- Memcached: `cd services/memcached && docker compose up -d` (`localhost:11211`)
- Qdrant: `cd services/qdrant && docker compose up -d` (HTTP `localhost:6333`)
- Weaviate: `cd services/weaviate && docker compose up -d` (`localhost:8087`)
- Pulsar: `cd services/pulsar && docker compose up -d` (broker `6650`, admin `localhost:8094`)
- Mosquitto (MQTT): `cd services/mosquitto && docker compose up -d` (`localhost:1883`)
- Grafana: `cd services/grafana && cp env.sample .env && docker compose up -d` (`localhost:3001`)
- Tempo: `cd services/tempo && docker compose up -d` (`localhost:3200`, OTLP `4317/4318`)
- OpenTelemetry Collector: `cd services/otel-collector && docker compose up -d` (OTLP `4317/4318`)
- Keycloak: `cd services/keycloak && cp env.sample .env && docker compose up -d` (`localhost:8085`, admin/admin)
- Temporal: `cd services/temporal && docker compose up -d` (gRPC `7233`, UI `localhost:8233`)
- SFTP: `cd services/sftp && cp env.sample .env && docker compose up -d` (`sftp -P 2222 devuser@localhost`)
- Adminer: `cd services/adminer && docker compose up -d` (`localhost:8088`)
- pgAdmin: `cd services/pgadmin && cp env.sample .env && docker compose up -d` (`localhost:8089`)
- Traefik: `cd services/traefik && docker compose up -d` (proxy `8090`, dashboard `localhost:8091`)
- Caddy: `cd services/caddy && docker compose up -d` (`localhost:8092`)

## Repo layout (not exhaustive)

- Databases: `services/postgres/`, `services/mysql/`, `services/mariadb/`, `services/mongodb/`, `services/cassandra/`, `services/neo4j/`, `services/clickhouse/`, `services/sqlite/`, `services/cockroachdb/`, `services/scylladb/`, `services/timescaledb/`, `services/influxdb/`
- Caches: `services/redis/`, `services/valkey/`, `services/memcached/`
- Vector DBs: `services/qdrant/`, `services/weaviate/`
- Messaging: `services/kafka/`, `services/redpanda/`, `services/rabbitmq/`, `services/nats/`, `services/activemq/`, `services/pulsar/`, `services/mosquitto/`
- Search: `services/elasticsearch/`, `services/opensearch/`, `services/meilisearch/`, `services/typesense/`, `services/logstash/`, `services/kibana/`
- Observability: `services/prometheus/`, `services/grafana/`, `services/loki/`, `services/tempo/`, `services/otel-collector/`, `services/jaeger/`, `services/zipkin/`
- Identity/workflow: `services/keycloak/`, `services/temporal/`
- Dev/support: `services/minio/`, `services/localstack/`, `services/mailpit/`, `services/vault/`, `services/consul/`, `services/etcd/`, `services/sftp/`
- DB admin UIs: `services/adminer/`, `services/pgadmin/`
- Web/proxy: `services/nginx/`, `services/traefik/`, `services/caddy/`
- Mocking: `services/wiremock/`, `services/mockserver/`, `services/json-server/`
- CI/runners: `services/jenkins/`, `services/gitlab-runner/`, `services/drone/`
- Security/scanners: `services/clair/`, `services/trivy/`, `services/grype/`, `services/sonarqube/`
- Docs: `docs/macOS.md`

## Contributing

- Add new services under `services/<name>/docker-compose.yml`.
- Include a short README or comments explaining ports, credentials, and default topics/databases as relevant.
- Keep defaults sane for local development and prefer official images.

## License

MIT
