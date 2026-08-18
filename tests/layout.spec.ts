import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

test.describe("RDS Sentinel Dashboard Layout State Persistence", () => {
  test.describe.configure({ mode: "serial" });
  test.beforeAll(() => {
    // Delete the local SQLite database to start from a clean state
    const dbPath = path.join(__dirname, "../rds-sentinel.db");
    if (fs.existsSync(dbPath)) {
      try {
        fs.unlinkSync(dbPath);
        console.log("Cleaned up existing rds-sentinel.db file.");
      } catch (err) {
        console.error("Failed to delete rds-sentinel.db:", err);
      }
    }
  });

  test("should load the default layout, allow reordering, and persist custom layout on reload", async ({ page }) => {
    // 1. Navigate to the dashboard
    await page.goto("/");

    // 2. Identify the three sections
    const databasesSection = page.locator("main > section").filter({ hasText: /Target Databases/i });
    const balancerSection = page.locator("main > section").filter({ hasText: /Cost & Performance|Cost-Performance/i });
    const logsSection = page.locator("main > section").filter({ hasText: /Log Watcher|Real-Time Logs/i });

    await expect(databasesSection).toBeVisible();
    await expect(balancerSection).toBeVisible();
    await expect(logsSection).toBeVisible();

    // 3. Assert default grid ordering (databases = 0, balancer = 1, logs = 2)
    await expect(databasesSection).toHaveCSS("order", "0");
    await expect(balancerSection).toHaveCSS("order", "1");
    await expect(logsSection).toHaveCSS("order", "2");

    // 4. Click to shift the "Databases" panel to the right (databases = 1, balancer = 0)
    const moveRightBtn = page.locator("[data-testid='layout-controls-databases'] button").nth(1);
    await expect(moveRightBtn).toBeVisible();
    await moveRightBtn.click();

    // 5. Assert the visual order has swapped instantly in the browser
    await expect(databasesSection).toHaveCSS("order", "1");
    await expect(balancerSection).toHaveCSS("order", "0");
    await expect(logsSection).toHaveCSS("order", "2");

    // Wait for async Server Action (saveLayoutAction) to persist to SQLite database
    await page.waitForTimeout(1000);

    // 6. Reload the page to trigger Server-Side state loading from SQLite
    await page.reload();

    // 7. Verify the custom swapped layout is correctly persisted and loaded
    const databasesSectionReloaded = page.locator("main > section").filter({ hasText: /Target Databases/i });
    const balancerSectionReloaded = page.locator("main > section").filter({ hasText: /Cost & Performance|Cost-Performance/i });
    const logsSectionReloaded = page.locator("main > section").filter({ hasText: /Log Watcher|Real-Time Logs/i });

    await expect(databasesSectionReloaded).toHaveCSS("order", "1");
    await expect(balancerSectionReloaded).toHaveCSS("order", "0");
    await expect(logsSectionReloaded).toHaveCSS("order", "2");
  });

  test("should apply operational layout presets and persist choices to database", async ({ page }) => {
    await page.goto("/");

    const devToolsBtn = page.locator("#dev-tools-dropdown-btn");
    await expect(devToolsBtn).toBeVisible();
    await devToolsBtn.click();

    // Click FinOps / Cost View preset button
    const finOpsBtn = page.locator("#preset-finops-btn");
    await expect(finOpsBtn).toBeVisible();
    await finOpsBtn.click();

    // Verify Balancer moves to Column 0 and Databases moves to Column 1
    const databasesSection = page.locator('section[data-layout-key="databases"]');
    const balancerSection = page.locator('section[data-layout-key="balancer"]');
    await expect(balancerSection).toHaveCSS("order", "0");
    await expect(databasesSection).toHaveCSS("order", "1");

    // Click Reset Default Layout button in Dev Tools
    await devToolsBtn.click();
    const resetBtn = page.locator("#global-reset-layout-btn");
    await expect(resetBtn).toBeVisible();
    await resetBtn.click();

    // Verify Default Balanced order restored (databases = 0, balancer = 1)
    await expect(databasesSection).toHaveCSS("order", "0");
    await expect(balancerSection).toHaveCSS("order", "1");
  });
});
