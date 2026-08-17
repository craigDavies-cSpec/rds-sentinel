import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

test.describe("RDS Sentinel Dashboard Layout State Persistence", () => {
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
});
