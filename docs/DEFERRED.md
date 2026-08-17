# rds-sentinel Backlog (DEFERRED.md)

A living backlog of deferred items, future roadmap features, and architectural improvements approved for later execution.

---

## 1. LocalStack E2E Testing Sandbox

* **Status**: ✅ Completed & Verified (`npm run test:localstack` passed)
* **Goal**: Implement a fully local End-to-End infrastructure testing suite using **LocalStack** to simulate AWS services locally without deploying to real AWS environments or incurring API fees.
* **Architecture**:
  - **Docker Compose**: Local container orchestrator launching LocalStack containing Kinesis, Lambda, API Gateway, CloudWatch, and IAM mocks.
  - **CDK Local Routing**: Synthesizes and deploys `infra/` stacks directly to LocalStack via `cdklocal`.
  - **Telemetry Pipeline E2E Integration**: Outbox telemetry queue in `src/lib/dynamicTelemetry.ts` streams to LocalStack API Gateway function URL, executing sanitizer Lambdas and confirming records in Kinesis stream (`rds-sentinel-log-stream`).

---

## 2. Layout State Persistence API

* **Status**: ✅ Completed & Verified (`tests/layout.spec.ts` & `src/lib/__tests__/db.test.ts` passed)
* **Goal**: Save user-configured widget layouts and coordinates instead of resetting them on page refresh.
* **Approach**: Built Next.js Server Actions (`getLayoutAction`, `saveLayoutAction`) persisting panel grid order to local SQLite database (`rds-sentinel.db`).

---

## 3. Visual Telemetry Enhancements

* **Status**: ✅ Completed & Verified
* **Goal**: Improve the historical spark-line metrics cards.
* **Approach**: Added horizontal grid benchmark threshold overlays (25%, 50%, 75%, 100% CPU), hover highlights (`ring-2 ring-aws-orange z-10 scale-110`), and floating interactive tooltips displaying sample index, CPU %, and alert indicators in `src/app/page.tsx`.

---

## 4. Edge-Sanitizer Hook verification

* **Status**: Deferred (Security Agent Review)
* **Goal**: Enforce parameter masking on edge nodes prior to transportation.
* **Approach**: Verify that the log processor Lambda is deployed in the client’s private VPC, acting as an edge filter before streaming telemetry metrics to our public SaaS Function URL.

---

---

## 5. Completed v1.0 Roadmap Milestones

* **Phase 9A (Enterprise Localization & UX Personalization)**: ✅ **Completed & Verified** (EN, DE, FR, JP & 4 Accent Themes).
* **Phase 9B (Advanced AWS Governance & Security)**: ✅ **Completed & Verified** (AWS Control Tower `CT.RDS.PR.1-4`, SOC2 Monitor, MFA).
* **Phase 9C (Real-Time Stream Engine & Developer API)**: ✅ **Completed & Verified** (WebSockets Stream, GraphQL Endpoint, Chaos Injector).
* **Phase 10A (AWS Infrastructure Exporter)**: ✅ **Completed & Verified** (CloudFormation IAM Stack YAML & Service Catalog JSON exporter).
* **Phase 10B (API Key & Rate-Limiting Control Panel)**: ✅ **Completed & Verified** (Developer API Key Vault, Rate Limits, Secret Key Toggles).
* **Phase 10C (Automated SOC2 Type II Audit Evidence Package Downloader)**: ✅ **Completed & Verified** (1-Click JSON Evidence Package Exporter).
* **Phase 11A (Interactive Audit Evidence Inspector Drawer)**: ✅ **Completed & Verified** (Slide-Over Live Evidence Inspector & Proof Copying).
* **Phase 11B (Terraform HCL Provider & Infrastructure Exporter)**: ✅ **Completed & Verified** (HashiCorp HCL Exporter).
* **Phase 11C (Multi-Region Database Replication Engine)**: ✅ **Completed & Verified** (Cross-Region Lag Matrix & Failover Simulator).
* **Phase 12 (Enterprise Security Vault & Data Leak Protection)**: ✅ **Completed & Verified** (Web Crypto AES-256-GCM authenticated encryption, OWASP 28-char CSPRNG password generator with >120 bits entropy, deep parameter masking, and STS ExternalId protection).
* **Phase 13 (Global Toolbar Language Selector)**: ✅ **Completed & Verified** (Instant flag-based language switching 🇺🇸 🇩🇪 🇫🇷 🇯🇵 directly on main top header toolbar).

---

## 6. v2.0 & v3.0 Post-Launch Feature Roadmap (Approved Post-v1.0 Launch)

* **AWS Organizations Auto-Discovery (SCP Integration)** (AWS Expert): Link AWS Organizations Management Account ARN; automatically discover all child AWS accounts and RDS/Aurora databases across the entire AWS Org via `sts:AssumeRole`.
* **AI-Powered Natural Language SQL Query Optimizer** (Senior Dev): Local/edge LLM assistant translating slow query EXPLAIN plans into plain English architectural advice and rewrite suggestions.
* **Slack Block Kit & PagerDuty Interactive Response Buttons** (PO Agent): Approve suggested `CREATE INDEX` DDL statements directly from Slack or PagerDuty alerts with 1-click execution.
* **AWS Cost Explorer Real-Time Anomaly Savings Tracker** (PO Agent): Graph daily cost savings trends in real-time as recommendations (downsizing, Aurora Serverless conversion, Reserved Instance purchases) are implemented.
* **Multi-Cloud Database Monitoring (GCP Cloud SQL & Azure Database for PostgreSQL)** (Senior Dev): Expand RDS Sentinel into a unified multi-cloud database performance console.
* **Automated Zero-Downtime Index Creation Scheduler** (AWS Expert): Schedule suggested `CREATE INDEX CONCURRENTLY` DDL statements during low-traffic maintenance windows with automated CPU rollback safety guards.
* **Custom Anomaly Detection ML Engine (Exponential Moving Average & Seasonality)** (Security Auditor): Train lightweight edge ML models to detect seasonal query load spikes (e.g. Black Friday ecommerce surges) and prevent false-positive alerts.
* **Cryptographic SHA-256 Hash Verification Badge** (Security Auditor): Live SHA-256 checksum badge for evidence packages.
* **Evidence Search & Filter Input Bar** (Senior Dev): Live keyword filter inside the Evidence Inspector Drawer.
* **SOC2 Audit Evidence PDF Summary Generator** (PO Agent): Printable PDF executive audit summary exporter.
* **AWS Audit Manager Direct Integration Webhook** (AWS Expert): Webhook dispatch of evidence packages directly to AWS Audit Manager.
* **Multi-Region Active-Active Latency Visualizer** (AWS Expert): Topology graph overlay showing active-active Aurora Global DB latency vectors.
* **AWS Route 53 Application Recovery Controller (ARC) Integration** (PO Agent): Automatic DNS routing failover trigger.

