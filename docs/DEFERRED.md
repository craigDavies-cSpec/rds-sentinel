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

## 5. Phase 9 Roadmap & Continuous Agent Review Pipeline

* **Phase 9A (Enterprise Localization & UX Personalization)**: ✅ **Completed & Verified** (English 🇺🇸, German 🇩🇪, French 🇫🇷, Japanese 🇯🇵 & 4 Custom Accent Palettes: AWS Amber, Emerald, Indigo, Cyber Cyan).
* **Phase 9B (Advanced AWS Governance & Security)**: ✅ **Completed & Verified** (AWS Control Tower Guardrail Validation `CT.RDS.PR.1-4`, SOC2 CC6.1/6.6 Monitor, and 6-digit TOTP MFA verification).
* **Phase 9C (Real-Time Stream Engine & Developer API)**: ⏳ **Active / Next Execution** (WebSockets Real-Time Stream Listener, GraphQL Telemetry Query Endpoint, Chaos Network Latency Injector).
