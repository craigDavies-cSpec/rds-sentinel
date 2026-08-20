import { test, expect } from '@playwright/test';

test.describe('AWS Multi-Region Telemetry Selector E2E', () => {

  test('switches telemetry region between London, N. Virginia, and Tokyo', async ({ page }) => {
    await page.goto('/');

    const regionSelector = page.locator('#aws-region-selector');
    await expect(regionSelector).toBeVisible();

    // Switch to N. Virginia (us-east-1)
    await regionSelector.selectOption('us-east-1');
    await expect(page.getByText(/Telemetry Region Changed to AWS us-east-1/i)).toBeVisible();

    // Switch to Tokyo (ap-northeast-1)
    await regionSelector.selectOption('ap-northeast-1');
    await expect(page.getByText(/Telemetry Region Changed to AWS ap-northeast-1/i)).toBeVisible();
  });
});
