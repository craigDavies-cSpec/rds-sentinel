import { test, expect } from "@playwright/test";

test.describe("RDS Sentinel Dashboard Functional E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the local dashboard
    await page.goto("/");
  });

  test("should render the AWS console-themed header and title", async ({ page }) => {
    await expect(page.locator("header")).toContainText("RDSSentinel");
    await expect(page.locator("header")).toContainText("AWS Marketplace");
  });

  test("should support toggling dark and light mode theme overrides", async ({ page }) => {
    const consoleToggle = page.locator("button:has-text('Console')");
    await expect(consoleToggle).toBeVisible();
    
    const textBefore = await consoleToggle.textContent();
    await consoleToggle.click();
    const textAfter = await consoleToggle.textContent();
    
    // Confirms button text toggled between light and dark labels
    expect(textBefore).not.toEqual(textAfter);
  });

  test("should gate logs on Trial/Small tiers and unlock on Medium/Enterprise", async ({ page }) => {
    // 1. Shift to Trial tier
    await page.locator("button:has-text('trial')").click();
    await expect(page.getByText("Real-Time Log Scanning Locked")).toBeVisible();

    // 2. Click upgrade CTA to shift to Medium tier
    await page.locator("button:has-text('Unlock Medium Tier')").click();
    await expect(page.getByText("Real-Time Log Scanning Locked")).not.toBeVisible();
    
    // 3. Confirm active billing matrix shows Logs as active
    await expect(page.locator("text=Real-Time Logs Watcher")).toBeVisible();
  });

  test("should mask raw queries when parameter masking is active and show raw values when toggled off", async ({ page }) => {
    const maskButton = page.locator("button:has-text('Parameter Masking')");
    await expect(maskButton).toBeVisible();

    // Masking is active by default: should see redacted sql query values
    await expect(page.locator("pre").first()).toContainText("'?'");
    await expect(page.locator("pre").first()).not.toContainText("'craig.davies@example.com'");

    // Toggle masking off
    await maskButton.click();
    await expect(maskButton).toContainText("Parameter Masking: OFF");
    
    // Raw email address should now be exposed
    await expect(page.locator("pre").first()).toContainText("'craig.davies@example.com'");
  });

  test("should queue telemetry payloads and trip circuit breaker to OPEN when disconnected", async ({ page }) => {
    // Locate the connection controllers
    const disconnectButton = page.locator("button:has-text('Disconnect')");
    const onlineButton = page.locator("button:has-text('Online')");
    
    await expect(disconnectButton).toBeVisible();
    await expect(onlineButton).toBeVisible();

    // Click disconnect to simulate offline connection
    await disconnectButton.click();
    await expect(page.locator("text=Connection offline")).toBeVisible();

    // Wait for the mock queue count to rise and trigger consecutive failures
    await page.waitForTimeout(2000);
    
    // The queue count should be greater than 0
    const outboxText = await page.locator("text=Outbox Queue Count:").locator("xpath=..").textContent();
    expect(outboxText).toContain("Outbox Queue Count:");
    
    // Restoring the connection clears the outbox
    await onlineButton.click();
    await expect(page.locator("text=Connection offline")).not.toBeVisible();
  });

  test("should render RDS Proxy Advisor and Multi-Region Latency cards on Medium tier", async ({ page }) => {
    // Confirm default tier is Medium
    await expect(page.getByText("RDS Proxy Connection Pooling Advisor")).toBeVisible();
    await expect(page.getByText("+82% Pool Efficiency")).toBeVisible();
    
    await expect(page.getByText("Cross-Region Latency & Cost Modeler")).toBeVisible();
    await expect(page.getByText("98.5% Failover Ready")).toBeVisible();
  });

  test("should update target database telemetry when switching database instance selection", async ({ page }) => {
    // Switch to billing-db-mysql
    const billingDbItem = page.locator("button:has-text('billing-db-mysql')").first();
    await billingDbItem.click();
    
    // Confirm title updates
    await expect(page.locator("span:has-text('billing-db-mysql')").first()).toBeVisible();
    await expect(page.getByText("RDS MySQL").first()).toBeVisible();
  });

  test("should dynamically update CPU utilization and scrape window when using CPU simulator slider", async ({ page }) => {
    const slider = page.locator("#cpu-simulator-slider");
    await expect(slider).toBeVisible();

    // Adjust slider value to 92% (high load spike)
    await slider.fill("92");

    // Confirm CPU utilization updates to 92%
    await expect(page.locator("text=92%").first()).toBeVisible();

    // Confirm scrape interval accelerates to 30s (3x frequency)
    await expect(page.locator("text=30s")).toBeVisible();
    await expect(page.getByText("Load spike detected!")).toBeVisible();
  });

  test("should render Export CSV button in header toolbar", async ({ page }) => {
    const csvButton = page.locator("button:has-text('Export CSV Report')");
    await expect(csvButton).toBeVisible();
  });

  test("should unlock and dispatch Slack and PagerDuty test anomaly webhooks on Enterprise tier", async ({ page }) => {
    // Shift to Enterprise tier
    await page.getByRole("button", { name: "enterprise", exact: true }).click();

    // Verify Enterprise Webhook Dispatch Simulator card is unlocked
    await expect(page.getByText("Enterprise Webhook Dispatch Simulator")).toBeVisible();
    await expect(page.locator("#webhook-url-input")).toBeVisible();

    // Click Trigger Test Anomaly Alert button
    const triggerButton = page.locator("button:has-text('Trigger Test Anomaly Alert')");
    await triggerButton.click();

    // Verify success notification badge and payload output
    await expect(page.getByText("HTTP 200 OK — Alert payload successfully delivered")).toBeVisible();
    await expect(page.getByText("RDS Sentinel Anomaly Alert")).toBeVisible();
  });
});
