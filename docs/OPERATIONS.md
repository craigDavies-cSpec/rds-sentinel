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
