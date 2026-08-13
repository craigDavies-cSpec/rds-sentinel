# rds-sentinel Lessons Learned Log

---

## 2026-08-13

* **React Hydration Error Elimination (Next.js SSR)**
  - *Problem*: Next.js threw `Error: Text content does not match server-rendered HTML` when loading the dashboard console in the browser.
  - *Learning*: Avoid non-deterministic function evaluations (`Math.random()`, dynamic `Date.now()` timestamps) during initial state declarations and mock data exports. Use fixed deterministic seed arrays for initial state and a static base timestamp for mock data exports. Apply `suppressHydrationWarning` to RootLayout tags for theme class toggles.

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
