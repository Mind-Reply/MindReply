#!/usr/bin/env python3
import os
from pathlib import Path

root = Path(".")

def write(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")

print("== MindReply Full Stack Setup (Python) ==")

# -------------------------
# Terraform
# -------------------------
write(root / "infra/terraform/main.tf", """terraform {
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
""")

write(root / "infra/terraform/variables.tf", """variable "region" {
  type    = string
  default = "eu-central-1"
}

variable "eks_role_arn" {
  type = string
}

variable "private_subnets" {
  type = list(string)
}
""")

write(root / "infra/terraform/outputs.tf", """output "cluster_name" {
  value = aws_eks_cluster.mindreply.name
}
""")

# -------------------------
# Helm
# -------------------------
write(root / "helm/mindreply/Chart.yaml", """apiVersion: v2
name: mindreply
version: 0.1.0
""")

write(root / "helm/mindreply/values.yaml", """global:
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
""")

write(root / "helm/mindreply/templates/api-deployment.yaml", """apiVersion: apps/v1
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
""")

write(root / "helm/mindreply/templates/api-service.yaml", """apiVersion: v1
kind: Service
metadata:
  name: mindreply-api
spec:
  selector:
    app: mindreply-api
  ports:
    - port: 80
      targetPort: 3000
""")

write(root / "helm/mindreply/templates/otel-collector.yaml", """apiVersion: v1
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
      kafka:
        brokers: ["kafka:9092"]
        topic: "otel-traces"
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
""")

write(root / "helm/mindreply/templates/clickhouse.yaml", """apiVersion: apps/v1
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
""")

write(root / "helm/mindreply/templates/kafka.yaml", """apiVersion: apps/v1
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
""")

# -------------------------
# Contracts
# -------------------------
write(root / "ops/contracts/api-contracts.json", """{
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
""")

write(root / "ops/contracts/validate-contracts.js", """const fs = require("fs");
const path = require("path");

const contracts = JSON.parse(
  fs.readFileSync(path.join(__dirname, "api-contracts.json"), "utf8")
);

function resolveApiPaths() {
  const candidates = [
    ["src", "backend", "api"],
    ["src", "frontend", "api"],
    ["apps", "api"],
    ["apps", "web", "api"],
    ["server", "api"],
    ["client", "api"]
  ];

  const existing = candidates
    .map(parts => path.join(process.cwd(), ...parts))
    .filter(p => fs.existsSync(p));

  return existing;
}

function main() {
  const apiPaths = resolveApiPaths();

  if (apiPaths.length === 0) {
    console.error("No API folders found. Checked common locations.");
    process.exit(1);
  }

  console.log("Detected API paths:");
  apiPaths.forEach(p => console.log(" -", p));

  console.log("Contracts loaded:", contracts.endpoints.length);
  console.log("Extend this script to deeply validate schemas against handlers and frontend calls.");
}

main();
""")

# -------------------------
# Observability
# -------------------------
write(root / "observability/otel/tracing.js", """const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start().then(() => {
  console.log("OpenTelemetry tracing enabled for MindReply API");
}).catch(err => {
  console.error("Failed to start OpenTelemetry SDK:", err);
});
""")

write(root / "observability/otel/collector.yaml", """receivers:
  otlp:
    protocols:
      grpc:
      http:

processors:
  batch:

exporters:
  kafka:
    brokers: ["kafka:9092"]
    topic: "otel-traces"
  logging:
    loglevel: info

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [kafka, logging]
""")

write(root / "observability/clickhouse/init.sql", """CREATE TABLE IF NOT EXISTS traces (
  timestamp     DateTime,
  service       String,
  trace_id      String,
  span_id       String,
  duration_ms   Float64,
  status_code   Int32
) ENGINE = MergeTree()
ORDER BY timestamp;
""")

write(root / "observability/clickhouse/kafka-consumer.js", """const { Kafka } = require("kafkajs");
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
""")

write(root / "observability/clickhouse/Dockerfile", """FROM node:20-alpine

WORKDIR /app

COPY kafka-consumer.js package.json package-lock.json ./

RUN npm install --only=production

CMD ["node", "kafka-consumer.js"]
""")

write(root / "observability/clickhouse/package.json", """{
  "name": "otel-processor",
  "version": "1.0.0",
  "main": "kafka-consumer.js",
  "dependencies": {
    "kafkajs": "^2.2.4",
    "@clickhouse/client": "^0.2.5"
  }
}
""")

write(root / "observability/clickhouse/package-lock.json", """{
  "name": "otel-processor",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {}
}
""")

# -------------------------
# Docker + docker-compose
# -------------------------
write(root / "Dockerfile", """FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "start.js"]
""")

write(root / "docker-compose.yml", """version: "3.9"

services:
  api:
    build: .
    container_name: mindreply-api
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4317
    depends_on:
      - otel-collector

  otel-collector:
    image: otel/opentelemetry-collector
    container_name: otel-collector
    volumes:
      - ./observability/otel/collector.yaml:/etc/otel/collector.yaml
    command: ["--config=/etc/otel/collector.yaml"]

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    container_name: kafka
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    ports:
      - "9092:9092"
    depends_on:
      - zookeeper

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    container_name: zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"

  clickhouse:
    image: clickhouse/clickhouse-server:latest
    container_name: clickhouse
    ports:
      - "8123:8123"
      - "9000:9000"
    volumes:
      - ./observability/clickhouse/init.sql:/docker-entrypoint-initdb.d/init.sql

  otel-processor:
    build: ./observability/clickhouse
    container_name: otel-processor
    environment:
      KAFKA_BROKER: kafka:9092
      CLICKHOUSE_URL: http://clickhouse:8123
    depends_on:
      - kafka
      - clickhouse
""")

# -------------------------
# Render config
# -------------------------
write(root / "render.yaml", """services:
  - type: web
    name: mind-reply
    env: node
    plan: starter
    buildCommand: "./build.sh"
    startCommand: "./start.sh"
    autoDeploy: true
""")

# -------------------------
# Start + Build scripts
# -------------------------
write(root / "start.sh", """#!/usr/bin/env bash
set -e

echo "[start.sh] Starting MindReply API with tracing and healthcheck"

if [ ! -d node_modules ]; then
  echo "[start.sh] node_modules missing, running npm install"
  npm install --only=production || npm install
fi

node start.js
""")
os.chmod(root / "start.sh", 0o755)

write(root / "build.sh", """#!/usr/bin/env bash
set -e

echo "[build.sh] Building MindReply"

if [ -f package.json ]; then
  if npm run | grep -q "build"; then
    echo "[build.sh] Found build script, running npm run build"
    npm run build
  else:
    echo "[build.sh] No build script, running npm install only"
    npm install
  fi
else
  echo "[build.sh] No package.json found, skipping build"
fi
""")
os.chmod(root / "build.sh", 0o755)

# -------------------------
# start.js
# -------------------------
write(root / "start.js", """require("./observability/otel/tracing");

const express = require("express");
const app = express();

app.use(express.json());

app.post("/api/v1/messages", (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: "userId and message required" });
  }

  const id = Date.now().toString();
  const createdAt = new Date().toISOString();

  res.json({ id, createdAt, message });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "mindreply-api" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("MindReply API listening on port", port);
});
""")

# -------------------------
# package.json (root)
# -------------------------
pkg = root / "package.json"
if not pkg.exists():
    write(pkg, """{
  "name": "mindreply",
  "version": "1.0.0",
  "main": "start.js",
  "scripts": {
    "start": "node start.js",
    "build": "echo \\"No build step defined yet\\"",
    "test": "echo \\"No tests defined yet\\" && exit 0",
    "contracts": "node ops/contracts/validate-contracts.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "@opentelemetry/sdk-node": "^0.55.0",
    "@opentelemetry/auto-instrumentations-node": "^0.55.0"
  }
}
""")

# -------------------------
# CI workflows
# -------------------------
write(root / ".github/workflows/ci-contracts.yml", """name: API Contract Check

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
        run: npm run contracts
""")

write(root / ".github/workflows/ci-tests.yml", """name: CI Tests

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
""")

print("== Done. Now run: git add . && git commit && git push, then redeploy on Render ==")
