# rds-sentinel Lessons Learned Log

---

## 2026-08-11

* **Node.js Engine Version Boundaries (Technical Stack)**
  - *Problem*: Bootstrapping Next.js with the latest `create-next-app` installs Next.js 14/15 and Jest 30. These packages require Node.js >= v18.17.0 / v20.0.0, causing compiler crashes in our local Node `v18.12.0` environment.
  - *Learning*: Downgraded dependencies in `package.json` to **Next.js 13.4.19** and **Jest 29.7.0**. Adjusted ESLint config to use `"next/core-web-vitals"` instead of `"next/typescript"`. This ensures the project builds and runs unit tests successfully without requiring global Node version upgrades.

* **PowerShell Command Stream Capturing (Scripting)**
  - *Problem*: Running `Invoke-Expression` or assigning cmdlets directly (e.g. `$auditOutput = npm audit`) in PowerShell leaves variables empty when the executed CLI tool returns a non-zero exit code (which `npm audit` and `pip-audit` do when security vulnerabilities are detected).
  - *Learning*: Use `& <command> 2>&1 | Out-String` to correctly merge standard output and error streams. This captures the full audit reports inside the generated `.md` files regardless of execution return codes.

* **Jest Fake Timers & Open Handles (Testing)**
  - *Problem*: Asynchronous timers (like our outbox circuit-breaker retry `setTimeout` loop) set handles that remain active in Node's event loop when Jest finishes, triggering the warning: *"A worker process has failed to exit gracefully... try running with --detectOpenHandles"*.
  - *Learning*: Use `jest.useFakeTimers()` in the `beforeEach` block of test suites to virtualize timers. Fast-forward timelines using `jest.advanceTimersByTime(30000)` to test state recoveries, and restore them in `afterEach` using `jest.useRealTimers()`. This resolves leaks and accelerates test runs.

* **Script-First Token Saving (Efficiency)**
  - *Learning*: Keep compilation, type checking, security scanning, and unit testing logic off the LLM context. Running local scripts (like `npm run build`, `npm run test`, and `cve-audit-all.ps1`) saves huge token amounts compared to asking the LLM to inspect files manually.
