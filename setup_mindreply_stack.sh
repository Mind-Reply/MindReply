#!/usr/bin/env bash
# setup_mindreply_stack.sh
# Auto-creates all infra / helm / observability / CI files for MindReply

set -e

echo "== Creating directories =="

mkdir -p infra/terraform
mkdir -p helm/mindreply/templates
mkdir -p ops/contracts
mkdir -p observability/otel
mkdir -p observability/clickhouse
mkdir -p .github/workflows

echo "== Writing infra/terraform/main.tf =="
cat > infra/terraform/main.tf << 'EOF'
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

resource "aws_eks_cluster" "mindreply" {
  name     = "mindreply-cluster"
  role_arn = var.eks_role_arn

  vpc_config {
    subnet_ids = var.private_subnets
  }
}
EOF

echo "== Writing infra/terraform/variables.tf =="
cat > infra/terraform/variables.tf << 'EOF'
variable "region" {
  type    = string
  default = "eu-central-1"
}

variable "eks_role_arn" {
  type = string
}

variable "private_subnets" {
  type = list(string)
}
EOF

echo "== Writing infra/terraform/outputs.tf =="
cat > infra/terraform/outputs.tf << 'EOF'
output "cluster_name" {
  value = aws_eks_cluster.mindreply.name
}
EOF

echo "== Writing helm/mindreply/Chart.yaml =="
cat > helm/mindreply/Chart.yaml << 'EOF'
apiVersion: v2
name: mindreply
version: 0.1.0
EOF

echo "== Writing helm/mindreply/values.yaml =="
cat > helm/mindreply/values.yaml << 'EOF'
global:
  environment: production

api:
  image: "ghcr.io/mind-reply/mindreply-api:latest"
  replicas: 2

otel:
  enabled: true

clickhouse:
  enabled: true

kafka:
  enabled: true
EOF

echo "== Writing helm/mindreply/templates/api-deployment.yaml =="
cat > helm/mindreply/templates/api-deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mindreply-api
spec:
  replicas: {{ .Values.api.replicas }}
  selector:
    matchLabels:
      app: mindreply-api
  template:
    metadata:
      labels:
        app: mindreply-api
    spec:
      containers:
        - name: api
          image: {{ .Values.api.image }}
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
            - name: OTEL_EXPORTER_OTLP_ENDPOINT
              value: "http://otel-collector:4317"
EOF

echo "== Writing helm/mindreply/templates/api-service.yaml =="
cat > helm/mindreply/templates/api-service.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: mindreply-api
spec:
  selector:
    app: mindreply-api
  ports:
    - port: 80
      targetPort: 3000
EOF

echo "== Writing helm/mindreply/templates/otel-collector.yaml =="
cat > helm/mindreply/templates/otel-collector.yaml << 'EOF'
apiVersion: v1
kind: ConfigMap
metadata:
  name: otel-collector-config
data:
  collector.yaml: |
    receivers:
      otlp:
        protocols:
          grpc:
          http:

    processors:
      batch:

    exporters:
      logging:
        loglevel: info

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: otel-collector
spec:
  replicas: 1
  selector:
    matchLabels:
      app: otel-collector
  template:
    metadata:
      labels:
        app: otel-collector
    spec:
      containers:
        - name: otel-collector
          image: otel/opentelemetry-collector
          args:
            - "--config=/etc/otel/collector.yaml"
          volumeMounts:
            - name: config
              mountPath: /etc/otel
      volumes:
        - name: config
          configMap:
            name: otel-collector-config
EOF

echo "== Writing helm/mindreply/templates/clickhouse.yaml =="
cat > helm/mindreply/templates/clickhouse.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: clickhouse
spec:
  replicas: 1
  selector:
    matchLabels:
      app: clickhouse
  template:
    metadata:
      labels:
        app: clickhouse
    spec:
      containers:
        - name: clickhouse
          image: clickhouse/clickhouse-server:latest
          ports:
            - containerPort: 8123
            - containerPort: 9000
---
apiVersion: v1
kind: Service
metadata:
  name: clickhouse
spec:
  selector:
    app: clickhouse
  ports:
    - name: http
      port: 8123
    - name: native
      port: 9000
EOF

echo "== Writing helm/mindreply/templates/kafka.yaml =="
cat > helm/mindreply/templates/kafka.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kafka
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kafka
  template:
    metadata:
      labels:
        app: kafka
    spec:
      containers:
        - name: kafka
          image: confluentinc/cp-kafka:7.5.0
          ports:
            - containerPort: 9092
EOF

echo "== Writing ops/contracts/api-contracts.json =="
cat > ops/contracts/api-contracts.json << 'EOF'
{
  "endpoints": [
    {
      "path": "/api/v1/messages",
      "method": "POST",
      "request": {
        "contentType": "application/json",
        "schema": {
          "type": "object",
          "properties": {
            "userId": { "type": "string" },
            "message": { "type": "string" }
          },
          "required": ["userId", "message"]
        }
      },
      "response": {
        "status": 200,
        "schema": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "createdAt": { "type": "string" },
            "message": { "type": "string" }
          },
          "required": ["id", "createdAt", "message"]
        }
      }
    }
  ]
}
EOF

echo "== Writing ops/contracts/validate-contracts.js =="
cat > ops/contracts/validate-contracts.js << 'EOF'
const fs = require("fs");
const path = require("path");

const contracts = JSON.parse(
  fs.readFileSync(path.join(__dirname, "api-contracts.json"), "utf8")
);

function main() {
  const backendApiPath = path.join(process.cwd(), "src", "backend", "api");
  const frontendApiPath = path.join(process.cwd(), "src", "frontend", "api");

  if (!fs.existsSync(backendApiPath)) {
    console.error("Missing backend API folder:", backendApiPath);
    process.exit(1);
  }

  if (!fs.existsSync(frontendApiPath)) {
    console.error("Missing frontend API folder:", frontendApiPath);
    process.exit(1);
  }

  console.log("Contracts loaded:", contracts.endpoints.length);
  console.log("Backend & frontend API folders exist. Extend this script to do deep schema checks.");
}

main();
EOF

echo "== Writing observability/otel/tracing.js =="
cat > observability/otel/tracing.js << 'EOF'
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start().then(() => {
  console.log("OpenTelemetry tracing enabled for MindReply API");
});
EOF

echo "== Writing observability/clickhouse/init.sql =="
cat > observability/clickhouse/init.sql << 'EOF'
CREATE TABLE IF NOT EXISTS traces (
  timestamp     DateTime,
  service       String,
  trace_id      String,
  span_id       String,
  duration_ms   Float64,
  status_code   Int32
) ENGINE = MergeTree()
ORDER BY timestamp;
EOF

echo "== Writing observability/clickhouse/kafka-consumer.js =="
cat > observability/clickhouse/kafka-consumer.js << 'EOF'
const { Kafka } = require("kafkajs");
const { createClient } = require("@clickhouse/client");

const kafka = new Kafka({
  clientId: "otel-processor",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"]
});

const consumer = kafka.consumer({ groupId: "otel-group" });

const clickhouse = createClient({
  host: process.env.CLICKHOUSE_URL || "http://clickhouse:8123"
});

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: "otel-traces" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const trace = JSON.parse(message.value.toString());

        await clickhouse.insert({
          table: "traces",
          values: [
            {
              timestamp: new Date(),
              service: trace.service || "mindreply",
              trace_id: trace.traceId || "",
              span_id: trace.spanId || "",
              duration_ms: trace.duration || 0,
              status_code: trace.status || 200
            }
          ]
        });
      } catch (err) {
        console.error("Failed to process trace:", err);
      }
    }
  });
}

run().catch(err => {
  console.error("Kafka consumer failed:", err);
  process.exit(1);
});
EOF

echo "== Writing .github/workflows/ci-contracts.yml =="
cat > .github/workflows/ci-contracts.yml << 'EOF'
name: API Contract Check

on:
  push:
    branches: [ main, ops/* ]
  pull_request:

jobs:
  contracts:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install deps
        run: npm install

      - name: Validate contracts
        run: node ops/contracts/validate-contracts.js
EOF

echo "== Writing .github/workflows/ci-tests.yml =="
cat > .github/workflows/ci-tests.yml << 'EOF'
name: CI Tests

on:
  push:
    branches: [ main, ops/* ]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install deps
        run: npm install

      - name: Run tests
        run: npm test
EOF

echo "== Done. Commit and push this branch =="
