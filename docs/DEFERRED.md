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

## 5. Completed Roadmap Milestones & Agent Pipeline

* **Phase 9A (Enterprise Localization & UX Personalization)**: ✅ **Completed & Verified** (EN, DE, FR, JP & 4 Accent Themes).
* **Phase 9B (Advanced AWS Governance & Security)**: ✅ **Completed & Verified** (AWS Control Tower `CT.RDS.PR.1-4`, SOC2 Monitor, MFA).
* **Phase 9C (Real-Time Stream Engine & Developer API)**: ✅ **Completed & Verified** (WebSockets Stream, GraphQL Endpoint, Chaos Injector).
* **Phase 10A (AWS Infrastructure Exporter)**: ✅ **Completed & Verified** (CloudFormation IAM Stack YAML & Service Catalog JSON exporter).
* **Phase 10B (API Key & Rate-Limiting Control Panel)**: ✅ **Completed & Verified** (Developer API Key Vault, Rate Limits, Secret Key Toggles).
* **Phase 10C (Automated SOC2 Type II Audit Evidence Package Downloader)**: ✅ **Completed & Verified** (1-Click JSON Evidence Package Exporter).
* **Phase 11A (Interactive Audit Evidence Inspector Drawer)**: ✅ **Completed & Verified** (Slide-Over Live Evidence Inspector & Proof Copying).

---

## 6. Future Roadmap Candidates (Recorded Post-Phase 11A)

* **Keyboard `Escape` Key Listener for Drawers** (QA Agent): Global `Esc` key listener for closing slide-over panels.
* **Animated Drawer Entry/Exit Backdrop Blur Transitions** (UI/UX Agent): CSS transition animations for drawer panels.
* **Cryptographic SHA-256 Hash Verification Badge** (Security Auditor): Live SHA-256 checksum badge for evidence packages.
* **Evidence Search & Filter Input Bar** (Senior Dev): Live keyword filter inside the Evidence Inspector Drawer.
* **SOC2 Audit Evidence PDF Summary Generator** (PO Agent): Printable PDF executive audit summary exporter.
* **AWS Audit Manager Direct Integration Webhook** (AWS Expert): Webhook dispatch of evidence packages directly to AWS Audit Manager.

