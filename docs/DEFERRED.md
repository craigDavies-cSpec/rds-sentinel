# rds-sentinel Backlog (DEFERRED.md)

A living backlog of deferred items, future roadmap features, and architectural improvements approved for later execution.

---

## 1. LocalStack E2E Testing Sandbox

* **Status**: Approved (Roadmap Candidate)
* **Goal**: Implement a fully local End-to-End infrastructure testing suite using **LocalStack** to simulate AWS services locally without deploying to real AWS environments or incurring API fees.
* **Architecture**:
  - **Docker Compose**: Set up a local container orchestrator launching LocalStack containing Kinesis, Lambda, API Gateway, CloudWatch, and IAM mocks.
  - **CDK Local Routing**: Use `aws-cdk-local` (`cdklocal`) to synthesize and deploy the `infra/` stacks directly to LocalStack.
  - **Telemetry Pipeline E2E Integration**: Route our outbox telemetry queue in `src/lib/dynamicTelemetry.ts` directly to the LocalStack API Gateway endpoint, verifying that logs are ingested, sanitizer Lambdas are triggered, and SQL parameter masking is verified in the Kinesis stream.

---

## 2. Layout State Persistence API

* **Status**: Deferred (Developer Agent Review)
* **Goal**: Save user-configured widget layouts and coordinates instead of resetting them on page refresh.
* **Approach**: Build a Next.js server action/route saving coordinate layout frames to a local SQLite config database (similar to `autoTrader` DB schema).

---

## 3. Visual Telemetry Enhancements

* **Status**: Deferred (UI/UX Agent Review)
* **Goal**: Improve the historical spark-line metrics cards.
* **Approach**: Add interactive tooltip details when hovering over historical samples, and render visual grid lines indicating critical CPU benchmarks (25%, 50%, 75%, and 100%).

---

## 4. Edge-Sanitizer Hook verification

* **Status**: Deferred (Security Agent Review)
* **Goal**: Enforce parameter masking on edge nodes prior to transportation.
* **Approach**: Verify that the log processor Lambda is deployed in the client’s private VPC, acting as an edge filter before streaming telemetry metrics to our public SaaS Function URL.
