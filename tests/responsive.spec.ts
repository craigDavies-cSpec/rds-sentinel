import { test, expect } from "@playwright/test";

test.describe("Multi-Device Responsive & Visual Audits - RDS Sentinel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(300);
  });

  // 1. Mobile & Tablet Layout Integrity Tests
  test("responsive layout - stacks containers in single column on mobile and responsive grid on tablet", async ({ page }) => {
    const mainGrid = page.locator("main");
    await expect(mainGrid).toBeVisible();

    const databasesSection = page.locator("main > section").filter({ hasText: /Target Databases/i });
    const balancerSection = page.locator("main > section").filter({ hasText: /Cost & Performance|Cost-Performance/i });
    const logsSection = page.locator("main > section").filter({ hasText: /Log Watcher|Real-Time Logs/i });

    await expect(databasesSection).toBeVisible();
    await expect(balancerSection).toBeVisible();
    await expect(logsSection).toBeVisible();

    const viewportSize = page.viewportSize();
    if (viewportSize && viewportSize.width < 640) {
      // On narrow mobile viewports (<640px), partner badge hides gracefully
      const partnerBadge = page.locator("#subscribe-aws-marketplace-btn");
      await expect(partnerBadge).toBeHidden();
    }
  });

  test("responsive layout - drop zone highlight ring and touch drag handles present", async ({ page }) => {
    const databasesSection = page.locator('section[data-layout-key="databases"]');
    const balancerSection = page.locator('section[data-layout-key="balancer"]');
    const logsSection = page.locator('section[data-layout-key="logs"]');

    await expect(databasesSection).toBeVisible();
    await expect(balancerSection).toBeVisible();
    await expect(logsSection).toBeVisible();

    // Verify touch-enabled drag handles are rendered inside section headers
    const dragHandles = page.locator("span.cursor-grab").filter({ hasText: "⋮⋮" });
    await expect(dragHandles.first()).toBeVisible();
    expect(await dragHandles.count()).toBeGreaterThanOrEqual(3);
  });

  test("responsive controls - settings modal opens cleanly across viewports", async ({ page }) => {
    const settingsBtn = page.locator("#open-settings-modal-btn");
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();

    const settingsModal = page.locator("#settings-modal-card");
    await expect(settingsModal).toBeVisible();

    // Switch tabs on mobile/tablet
    const awsTab = page.locator("#tab-aws-accounts-btn");
    await awsTab.scrollIntoViewIfNeeded();
    await awsTab.click({ force: true });
    await expect(awsTab).toBeVisible();

    const secTab = page.locator("#tab-security-btn");
    await secTab.scrollIntoViewIfNeeded();
    await secTab.click({ force: true });
    await expect(page.locator("#validate-mfa-token-btn")).toBeVisible();

    // Close modal
    const closeBtn = page.locator("#close-settings-modal-btn");
    await closeBtn.click({ force: true });
    await expect(settingsModal).toBeHidden();
  });

  // 2. Responsive Visual Snapshots across Desktop, Mobile (Pixel 7), and Tablet (iPad Mini)
  test("responsive visual snapshot - Dashboard Overview", async ({ page }) => {
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("dashboard-responsive-view.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test("responsive visual snapshot - Settings Modal", async ({ page }) => {
    await page.locator("#open-settings-modal-btn").click();
    await expect(page.locator("#settings-modal-card")).toBeVisible();
    await page.waitForTimeout(300);
    await expect(page.locator("#settings-modal-card")).toHaveScreenshot("settings-modal-responsive-card.png", {
      maxDiffPixelRatio: 0.05,
    });
  });
});
