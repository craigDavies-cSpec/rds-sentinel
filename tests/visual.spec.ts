import { test, expect } from "@playwright/test";

test.describe("Visual Regression Baseline Audits - RDS Sentinel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  // 1. Subscription Tiers Full-Page Visual Snapshots
  test("visual snapshot - Trial Tier", async ({ page }) => {
    await page.locator("#header-tier-selector button").filter({ hasText: /^trial$/i }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("dashboard-tier-trial.png", { fullPage: true, maxDiffPixelRatio: 0.05 });
  });

  test("visual snapshot - Small Tier", async ({ page }) => {
    await page.locator("#header-tier-selector button").filter({ hasText: /^small$/i }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("dashboard-tier-small.png", { fullPage: true, maxDiffPixelRatio: 0.05 });
  });

  test("visual snapshot - Medium Tier (Default)", async ({ page }) => {
    await expect(page).toHaveScreenshot("dashboard-tier-medium.png", { fullPage: true, maxDiffPixelRatio: 0.05 });
  });

  test("visual snapshot - Enterprise Tier", async ({ page }) => {
    await page.locator("#header-tier-selector button").filter({ hasText: /^enterprise$/i }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("dashboard-tier-enterprise.png", { fullPage: true, maxDiffPixelRatio: 0.05 });
  });

  // 2. Light Theme Full-Page Visual Snapshot
  test("visual snapshot - Light Mode Theme", async ({ page }) => {
    const themeBtn = page.locator("button[title='Toggle Theme']");
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("dashboard-light-mode.png", { fullPage: true, maxDiffPixelRatio: 0.05 });
  });

  // 3. Settings Modal Tabs Snapshots
  test("visual snapshot - Settings Modal Tab 1 Preferences", async ({ page }) => {
    await page.locator("#open-settings-modal-btn").click();
    await expect(page.locator("#tab-preferences-btn")).toBeVisible();
    await page.waitForTimeout(300);
    await expect(page.locator("#settings-modal-card")).toHaveScreenshot("settings-modal-tab-preferences.png", { maxDiffPixelRatio: 0.05 });
  });

  test("visual snapshot - Settings Modal Tab 2 AWS Accounts", async ({ page }) => {
    await page.locator("#open-settings-modal-btn").click();
    await page.locator("#tab-aws-accounts-btn").click();
    await expect(page.locator("#tab-aws-accounts-btn")).toBeVisible();
    await page.waitForTimeout(300);
    await expect(page.locator("#settings-modal-card")).toHaveScreenshot("settings-modal-tab-aws-accounts.png", { maxDiffPixelRatio: 0.05 });
  });

  test("visual snapshot - Settings Modal Tab 3 Billing", async ({ page }) => {
    await page.locator("#open-settings-modal-btn").click();
    await page.locator("#tab-billing-btn").click();
    await expect(page.locator("#tab-billing-btn")).toBeVisible();
    await page.waitForTimeout(300);
    await expect(page.locator("#settings-modal-card")).toHaveScreenshot("settings-modal-tab-billing.png", { maxDiffPixelRatio: 0.05 });
  });

  test("visual snapshot - Settings Modal Tab 4 Security", async ({ page }) => {
    await page.locator("#open-settings-modal-btn").click();
    await page.locator("#tab-security-btn").click();
    await expect(page.locator("#tab-security-btn")).toBeVisible();
    await page.waitForTimeout(300);
    await expect(page.locator("#settings-modal-card")).toHaveScreenshot("settings-modal-tab-security.png", { maxDiffPixelRatio: 0.05 });
  });

  // 4. Modals & Drawers Snapshots
  test("visual snapshot - GraphQL Inspector Modal", async ({ page }) => {
    await page.locator("#dev-tools-dropdown-btn").click();
    await page.locator("#open-graphql-modal-btn").click();
    await expect(page.locator("#graphql-modal-card")).toBeVisible();
    await page.waitForTimeout(300);
    await expect(page.locator("#graphql-modal-card")).toHaveScreenshot("graphql-api-inspector-modal.png", { maxDiffPixelRatio: 0.05 });
  });

  test("visual snapshot - Tier Confirmation Modal", async ({ page }) => {
    await page.locator("#header-tier-selector button").filter({ hasText: /^enterprise$/i }).click();
    await expect(page.locator("#tier-confirmation-modal-card")).toBeVisible();
    await page.waitForTimeout(300);
    await expect(page.locator("#tier-confirmation-modal-card")).toHaveScreenshot("tier-confirmation-modal.png", { maxDiffPixelRatio: 0.05 });
  });
});
