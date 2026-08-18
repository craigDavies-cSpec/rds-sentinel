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
* **Phase 14 (Monolithic `page.tsx` Component Refactoring)**: ✅ **Completed & Verified** (`page.tsx` refactored from 2,861 lines to ~450 lines using 10 leaf components in `src/components/`, passing 140/140 unit and E2E tests).
* **Phase 15 (AWS Organizations Auto-Discovery & SCP Integration)**: ✅ **Completed & Verified** (Scans AWS Organizations Management Account ARNs, enforces SCP policies, auto-discovers sub-account child OUs, and imports discovered database instances, verified by 142/142 tests).
* **Phase 16 (AI Natural Language SQL EXPLAIN & DDL Optimizer)**: ✅ **Completed & Verified** (Translates execution plans into plain-English advice, zero-downtime production DDL `CREATE INDEX CONCURRENTLY`, and query rewrite suggestions in `SlowQueryInspector.tsx`, verified by 142/142 tests).
* **Phase 17 (Automated GitHub Actions CI/CD Pipeline)**: ✅ **Completed & Verified** (`.github/workflows/ci.yml` matrix pipeline running type check, Jest unit tests, high-severity CVE audit, and Playwright Chromium E2E testing, verified by 143/143 tests).
* **Phase 18 (Interactive Slack Block Kit & PagerDuty 1-Click DDL Action Buttons)**: ✅ **Completed & Verified** (Generates Slack Block Kit action button payloads carrying 1-click zero-downtime DDL execution triggers, alert muting, and PagerDuty remediation links in `webhookSimulator.ts`, verified by 143/143 tests).

* **Phase 19 (Touch Gesture Reordering & Drop-Zone Highlight Ring)**: ✅ **Completed & Verified** (Touch drag handlers `onTouchStart`, `onTouchMove`, `onTouchEnd` with `elementFromPoint` hit testing and animated pulsing drop-zone highlight ring `ring-2 ring-aws-orange bg-aws-orange/5 animate-pulse border-2 border-dashed border-aws-orange/60` on active drag target columns, verified by Playwright multi-device tests).
* **Phase 20 (Custom Role-Based Per-User Layout Presets)**: ✅ **Completed & Verified** (Added 1-click operational role preset buttons *Default Balanced*, *FinOps / Cost View*, *DBA / Telemetry View* inside Developer Tools dropdown menu, fully localized in EN, DE, FR, JA and persisted to SQLite via `saveLayoutAction`, verified by Playwright layout E2E tests).

---

## 6. v2.0 & v3.0 Post-Launch Feature Roadmap (Approved Post-v1.0 Launch)

* **Visual Sparkline Dynamic Canvas Resizing Animation** (Senior Dev): Add SVG/Canvas resize observer triggers to sparkline graphs to animate width changes upon column drops.
* **Enterprise Custom Role Preset Broadcast** (Senior Product Owner): Allow enterprise team admins to define custom role presets (e.g. *Security Compliance View*) and broadcast them across team IAM roles.
* **Mobile Drag Ghost Thumbnail Preview** (Senior UI/UX Designer): Render floating preview ghost thumbnail image during touch drag operations on mobile viewports.
* **AWS Cost Explorer Real-Time Anomaly Savings Tracker** (PO Agent): Graph daily cost savings trends in real-time as recommendations are implemented.
* **Multi-Cloud Database Monitoring (GCP Cloud SQL & Azure Database for PostgreSQL)** (Senior Dev): Expand RDS Sentinel into a unified multi-cloud database performance console.
* **Automated Zero-Downtime Index Creation Scheduler** (AWS Expert): Schedule suggested `CREATE INDEX CONCURRENTLY` DDL statements during low-traffic maintenance windows.
* **Custom Anomaly Detection ML Engine (Exponential Moving Average & Seasonality)** (Security Auditor): Train lightweight edge ML models to detect seasonal query load spikes.
