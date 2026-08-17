# rds-sentinel Lessons Learned Log

---

## 2026-08-17

* **Accessibility & Non-English UI Design (Global Toolbar Language Selector)**
  - *Problem*: Burying language selection inside nested settings modals renders the app unusable for non-English speakers because they cannot read English to navigate to settings.
  - *Learning*: Elevate a small flag-based language selector dropdown (`🇺🇸 🇩🇪 🇫🇷 🇯🇵`) directly to the primary top header toolbar so users can switch display language on initial page load.

* **Web Crypto API Cross-Environment Polyfilling (AES-256-GCM)**
  - *Problem*: `crypto.subtle` is available in modern browsers and Node v18 (`require("crypto").webcrypto`). Base64 conversion using spread operators (`String.fromCharCode(...arr)`) throws TypeScript `TS2802` downlevel iteration errors under standard target settings.
  - *Learning*: Use safe array-from loop iteration `for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i])` for cross-platform Uint8Array base64 encoding.

* **GitHub Actions CI/CD Pipeline & Automated Playwright E2E Matrix**
  - *Problem*: Manual local test runs risk uncommitted regression bugs reaching main deployment branches.
  - *Learning*: Configure `.github/workflows/ci.yml` running Node.js 18 matrix with `--workers=1` on Playwright E2E tests and `actions/upload-artifact@v3` to preserve Playwright trace reports on build failure.

* **AI Natural Language SQL EXPLAIN & Zero-Downtime DDL Optimizer Engine**
  - *Problem*: Raw SQL EXPLAIN output (e.g. `Seq Scan on users (cost=0.00..4250.00)`) is cryptic for non-DBA developers, and naive `CREATE INDEX` statements can lock enterprise production tables during execution.
  - *Learning*: Parse query AST patterns to output plain-English diagnostic advice alongside non-blocking zero-downtime DDL (`CREATE INDEX CONCURRENTLY` for PostgreSQL / `ALGORITHM=INPLACE, LOCK=NONE` for MySQL) and optimized SQL query rewrites inside `SlowQueryInspector.tsx`.

* **AWS Organizations SCP & Cross-Account Auto-Discovery Engine**
  - *Problem*: Multi-account enterprise environments require individual manual IAM role configuration for every child account, adding high friction to customer onboarding.
  - *Learning*: Implement AWS Organizations Management Account ARN scanner (`arn:aws:organizations::...`) that validates active Service Control Policies (`SCP-DenyUnencryptedRDSStorage`) and auto-discovers child sub-account Aurora/RDS instances across OUs via `sts:AssumeRole`.

* **Monolithic Page Decomposition into Leaf Components (`src/components/`)**
  - *Problem*: `src/app/page.tsx` expanded to over 2,800 lines containing all inline modal structures, toolbar controls, circuit breaker UI, and topology graphs, making maintenance difficult and prone to state prop mismatches.
  - *Learning*: Extract self-contained UI blocks into 10 modular leaf components (`src/components/`). Pass reactive state down as typed interface props. Ensure elements keep unique DOM IDs (`#confirm-sandbox-tier-btn`, `#chaos-circuit-breaker-toggle`, `#revoke-key-btn-${id}`, `#live-account-active-banner`) to maintain 100% E2E Playwright test coverage.

---

## 2026-08-13

* **React Hydration Mismatch on Dynamic Date Formatting (`toLocaleTimeString`)**
  - *Problem*: Next.js threw `Error: Text content does not match server-rendered HTML. Server: "07:49:51" Client: "07:55:48"` because `toLocaleTimeString()` was invoked on dynamic date objects inside JSX.
  - *Learning*: `toLocaleTimeString()` relies on system wall-clock time which differs between server SSR execution and browser client hydration. Replace dynamic `toLocaleTimeString()` evaluations with static ISO/formatted timestamp strings (`log.timestamp`) and attach `suppressHydrationWarning={true}` to timestamp DOM nodes.

* **UX Header De-crowding (2-Tier Structured Header Architecture)**
  - *Problem*: Accumulating 12+ action buttons, dropdowns, and status badges into a single `<header>` bar caused severe line wrapping, overlapping text, and visually overcrowded UI on standard resolutions.
  - *Learning*: Implement a **2-Tier Header Architecture**:
    1. **Primary Top Bar**: Dedicated strictly to branding logo, partner badge, mode toggle (`🌐 SaaS` vs `⚡ AWS Extension`), primary CTA (`🎯 2-Min Tour`), export buttons, and settings modal trigger.
    2. **Sub-Header Context & Control Strip**: A semi-transparent backdrop bar (`bg-aws-lightBg/60 dark:bg-aws-dark/60 backdrop-blur-sm`) housing contextual filters (AWS account selector, cost center tag pills) and key status indicators (health score badge, identified savings badge, quick tier pills).

* **Docker Container Auto-Removal in LocalStack E2E Testing**
  - *Problem*: LocalStack accumulated hundreds of exited Lambda execution containers in Docker Desktop after multiple test runs.
  - *Learning*: Add `LAMBDA_DOCKER_FLAGS=--rm` and `LAMBDA_REMOVE_CONTAINERS=1` environment variables to `docker-compose.yml`, and invoke an explicit Docker container prune command during test teardown.

* **Playwright Strict Locator Disambiguation**
  - *Problem*: Playwright threw `strict mode violation: locator(...) resolved to 2 elements` when matching generic text badges (like `enterprise` or `RDS MySQL`).
  - *Learning*: Disambiguate Playwright locators using `getByRole("button", { name: "enterprise", exact: true })` or appending `.first()` to scoped container queries.

---

## 2026-08-11

* **Node.js Engine Version Boundaries (Technical Stack)**
  - *Problem*: Bootstrapping Next.js with the latest `create-next-app` installs Next.js 14/15 and Jest 30. These packages require Node.js >= v18.17.0 / v20.0.0, causing compiler crashes in our local Node `v18.12.0` environment.
  - *Learning*: Downgraded dependencies in `package.json` to **Next.js 13.4.19** and **Jest 29.7.0**. Adjusted ESLint config to use `"next/core-web-vitals"` instead of `"next/typescript"`. This ensures the project builds and runs unit tests successfully without requiring global Node version upgrades.

* **PowerShell Command Stream Capturing (Scripting)**
  - *Problem*: Running `Invoke-Expression` or assigning cmdlets directly (e.g. `$auditOutput = npm audit`) in PowerShell leaves variables empty when the executed CLI tool returns a non-zero exit code.
  - *Learning*: Use `& <command> 2>&1 | Out-String` to correctly merge standard output and error streams. This captures the full audit reports inside the generated `.md` files regardless of execution return codes.

* **Jest Fake Timers & Open Handles (Testing)**
  - *Problem*: Asynchronous timers (like our outbox circuit-breaker retry `setTimeout` loop) set handles that remain active in Node's event loop when Jest finishes.
  - *Learning*: Use `jest.useFakeTimers()` in the `beforeEach` block of test suites to virtualize timers. Fast-forward timelines using `jest.advanceTimersByTime(30000)` to test state recoveries, and restore them in `afterEach` using `jest.useRealTimers()`.
