import { test, expect } from "@playwright/test";

test.describe("RDS Sentinel Dual-Implementation Mode E2E Tests (SaaS WebApp vs AWS Extension)", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the local dashboard
    await page.goto("/");
  });

  test("should render Standalone SaaS WebApp (Mode A) by default and support multi-tenant SaaS features", async ({ page }) => {
    // 1. Verify Mode A is active by default (no extension banner)
    await expect(page.locator("#aws-extension-mode-banner")).not.toBeVisible();

    // 2. Open Developer Tools dropdown and check mode button text
    await page.locator("#dev-tools-dropdown-btn").click();
    await page.waitForTimeout(200);
    const modeBtn = page.locator("#toggle-app-mode-btn");
    await expect(modeBtn).toBeVisible();
    await expect(modeBtn).toHaveText(/Mode A: SaaS/);

    // Close dev tools dropdown by clicking header
    await page.locator("header").click();

    // 3. Confirm Standalone SaaS API Key Vault & Security controls are accessible
    await page.locator("#open-settings-modal-btn").click();
    await page.getByText("🛡️ Security & Vault").click();
    await page.waitForTimeout(200);
    await expect(page.locator("#generate-owasp-password-btn")).toBeVisible();
    await expect(page.locator("#new-api-key-name-input")).toBeVisible();
    await page.locator("#close-settings-modal-btn").click();
  });

  test("should switch to Integrated AWS Extension (Mode B) and render Cloudscape extension banner and features", async ({ page }) => {
    // 1. Open Dev Tools and toggle to Mode B (AWS Extension Mode)
    await page.locator("#dev-tools-dropdown-btn").click();
    await page.waitForTimeout(200);
    const modeBtn = page.locator("#toggle-app-mode-btn");
    await modeBtn.click();

    // 2. Verify AWS Extension Mode Banner renders prominently
    const extensionBanner = page.locator("#aws-extension-mode-banner");
    await expect(extensionBanner).toBeVisible();
    await expect(extensionBanner).toContainText("AWS Management Console Extension Mode Active");
    await expect(extensionBanner).toContainText("Cloudscape Native Frame");

    // 3. Re-open Dev Tools and confirm button state is Mode B
    await page.locator("#dev-tools-dropdown-btn").click();
    await page.waitForTimeout(200);
    await expect(page.locator("#toggle-app-mode-btn")).toHaveText(/Mode B: AWS Extension/);

    // Close dropdown
    await page.locator("header").click();

    // 4. Verify AWS Marketplace EDP Procurement Modal works in Extension Mode
    const marketplaceBtn = page.locator("#subscribe-aws-marketplace-btn");
    await expect(marketplaceBtn).toBeVisible();
    await marketplaceBtn.click();

    const edpModal = page.locator("#edp-procurement-modal");
    await expect(edpModal).toBeVisible();
    await expect(edpModal).toContainText("Enterprise Discount Program (EDP) Drawdown");

    // Close EDP modal
    await edpModal.locator("button").filter({ hasText: /^✕$/ }).click();
    await expect(edpModal).not.toBeVisible();
  });

  test("should verify visual snapshots for Mode A (SaaS WebApp) vs Mode B (AWS Extension)", async ({ page, browserName }) => {
    // Take visual snapshot of Standalone SaaS (Mode A)
    await expect(page).toHaveScreenshot(`app-mode-a-saas-${browserName}.png`);

    // Switch to Integrated AWS Extension (Mode B)
    await page.locator("#dev-tools-dropdown-btn").click();
    await page.waitForTimeout(200);
    await page.locator("#toggle-app-mode-btn").click();

    // Take visual snapshot of Integrated AWS Extension (Mode B)
    await expect(page).toHaveScreenshot(`app-mode-b-extension-${browserName}.png`);
  });
});
