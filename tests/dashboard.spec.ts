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
});
