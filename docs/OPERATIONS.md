# rds-sentinel Operations Runbook

A guide to starting the application, running tests, executing security audits, and synthesizing infrastructure templates.

---

## 1. Running the Next.js Frontend Console

To start the interactive sandbox dashboard locally:
```powershell
# From the root directory of rds-sentinel
npm run dev
```
Open **`http://localhost:3000`** in your browser. Toggle tiers, select active database instances, trigger simulated connection disconnects, and toggle SQL parameter masking to test the telemetry pipelines.

---

## 2. Running Jest Unit Tests

To run the unit tests for the edge log sanitizer and telemetry outbox queues:
```powershell
# From the root directory of rds-sentinel
npm run test
```
This runs the Jest test runner under Node.js, compiling and asserting logic inside `src/lib/__tests__/`.

---

## 3. Running the Centralized CVE Security Scan

To scan all workspaces (`autoTrader`, `cspec-solutions`, `rds-sentinel`) for dependency vulnerabilities:
```powershell
# From the root directory of rds-sentinel
powershell -ExecutionPolicy Bypass -File scripts/cve-audit-all.ps1
```
This script loops through packages on disk, runs `npm audit` and `pip-audit`, and compiles results to **`cve_audit_report.md`** in the parent directory (`C:\Users\craig\cSpec Projects\cve_audit_report.md`).

---

## 4. Compiling & Synthesizing AWS CDK Infrastructure

To verify the CloudFormation stacks generate correctly:
```powershell
# Navigate to the CDK infra directory
cd infra

# Compile the TypeScript stacks
npm run build

# Synthesize CloudFormation templates
npx cdk synth
```
The synthesized templates are written to `infra/cdk.out/` and can be deployed to AWS via `npx cdk deploy`.
- **`RDSMonitoringRoleStack`**: Client-side IAM stack.
- **`RDSIngestionStack`**: SaaS-side serverless ingestion resources stack.

---

## 5. Standard Mandatory Workspace Agent Review & Memory Protocol

To maintain world-class visual aesthetics, security compliance, and zero documentation drift:
1. **Post-Phase Agent Audits:** Upon completing every phase, all 6 workspace agent personas (Senior PO, Senior AWS Expert, Senior UI/UX Designer, Senior Developer, QA Agent, Safety & Security Auditor) conduct systematic post-implementation audits.
2. **Immediate Fix Application:** High-value recommendations, fixes, and visual refinements proposed by the agents are evaluated and applied immediately to the codebase.
3. **Memory & Docs Synchronization:** `memory/STATE.md`, `memory/LEARNINGS.md`, `agent_review_report.md`, and `implementation_plan.md` must be updated with zero stale entries before proceeding to subsequent phase executions.
4. **Mandatory Automated Test Suite Updating:** Unit test suites (in `src/lib/__tests__/`) and Playwright E2E integration test suites (in `tests/`) must be updated after every phase to maintain 100% test coverage of newly added features and guarantee zero regression failures.
