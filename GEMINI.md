# AWS RDS & Aurora Sentinel (rds-sentinel) — Project Brief & Rules

An ultra-modern, configurable database performance monitor and cost optimizer designed as an AWS Marketplace extension.

## Re-ground cheaply — read these first:
- `memory/STATE.md` — Current active mock databases, pricing tier status, and outbox state.
- `memory/LEARNINGS.md` — Accumulated daily lessons, environment constraints, and scripting gotchas.
- `docs/OPERATIONS.md` — Runbook (launching dev servers, running tests, executing CVE audits, and CDK synthesis).
- `docs/DEFERRED.md` — Living backlog (LocalStack E2E setup, custom layout API, visual sparkline improvements).

---

## Technical Stack & Compatibility Rules
To maintain compatibility with local Node.js `v18.12.0` and development guidelines, the project strictly sticks to the following versions:
- **Next.js**: `13.4.19` (App Router configuration)
- **Styling**: Tailwind CSS
- **Testing**: `jest@29.7.0` and `@types/jest@29.5.12` (running in `node` environment for utility suites)
- **AWS CDK**: `2.100.0` (Synthesizing CloudFormation v2 templates)
- **TypeScript**: `^5`

---

## Project Architecture

```
                       [ RDS / Aurora Clusters ]
                                   │ (Telemetry Logs / Metrics)
                                   ▼
                   [ Client Account: IAM Monitoring Role ]
                                   │ (AssumeRole via External ID)
                                   ▼
        [ Edge-Sanitization Engine (Lambda Log Subscription Filters) ]
                                   │ (Redacts SQL parameters/PII)
                                   ▼
       [ Telemetry Outbox Queue (Adaptive scrapers / Circuit-breaker) ]
                                   │ (Public Function URL Endpoint)
                                   ▼
                   [ SaaS Dashboard Client Console ]
```

---

## Key Files Map
* `src/app/page.tsx` — AWS-themed dashboard console. Includes sandbox simulator and tier controllers.
* `src/app/globals.css` — AWS console dark/light variables and scrollbar styling.
* `tailwind.config.ts` — AWS Cloudscape palette configurations.
* `src/lib/logSanitizer.ts` — SQL masking and email log sanitization rules (runs on Edge/Lambdas).
* `src/lib/dynamicTelemetry.ts` — Load-based interval timers and backpressure outbox queues.
* `src/lib/mockTelemetry.ts` — Seed data for databases, cost recommendations, and slow queries.
* `src/lib/__tests__/*` — Jest unit tests for sanitizers and queue managers.
* `infra/bin/rds-sentinel-infra.ts` — AWS CDK app entrypoint.
* `infra/lib/rds-monitoring-role-stack.ts` — Client cross-account IAM stack.
* `infra/lib/rds-ingestion-stack.ts` — SaaS ingestion resources stack (Kinesis, Sanitizer Lambda, Function URL).
* `scripts/cve-audit-all.ps1` — Cross-project dependency vulnerability scanning tool.
* `.agents/AGENTS.md` — Customized workspace agent configurations (Senior PO, AWS, Dev, QA, Security, UI/UX).

---

## Development Rules
- **Demo Mode**: Maintain the "Sandbox Demo Mode" mock telemetry toggles so users can test the dashboard instantly without entering AWS credentials.
- **Least Privilege IAM**: Never add wildcard (`"Resource": "*"`) permissions in CDK stacks for writing/modifying credentials. Keep all monitoring policies strictly read-only.
- **Edge Sanitization**: All log processing scripts must run SQL parameter masking *on the client's side* (the edge) before shipping logs to prevent PII leaks in transit.
- **Node v18 Compatibility**: Never upgrade Next.js to v14/15 or Jest to v30, as they are incompatible with the host Node.js version.
- **No Committed Secrets**: Environment variables must reside only in git-ignored `.env` files. Access keys must never be committed. The git hook in `.githooks/pre-commit` enforces this automatically.
- **Script-First Token Saving**: Utilize local scripts (`cve-audit-all.ps1`, unit tests, builds) instead of LLM-based evaluation to minimize token consumption.
- **100% Zero-Hardcoded-String Rule**: ALL UI text, card containers, settings forms, modal titles, recommendation reasons, and tour tooltips MUST be fully localized using `t(key, language)`. Agents must perform meticulous empirical verification across all 4 supported languages (`en`, `de`, `fr`, `ja`) before certifying production readiness.
- **Comprehensive Backlog & Docs Evaluation Rule**: Whenever asked for Next Steps, TODOs, or roadmap priorities, agents MUST systematically cross-reference and synthesize ALL project planning, audit, and memory documents (`docs/DEFERRED.md`, `docs/OPERATIONS.md`, `memory/STATE.md`, `pre_production_multidisciplinary_roundtable_audit.md`, `deep_penetration_testing_report.md`, and `implementation_plan.md`) to provide a prioritized, non-redundant action plan.
