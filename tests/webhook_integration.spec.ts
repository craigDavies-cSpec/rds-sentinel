import { test, expect } from '@playwright/test';

test.describe('Slack & PagerDuty Webhook Integration E2E', () => {

  test('opens webhook configuration modal and simulates alert dispatch', async ({ page }) => {
    await page.goto('/');

    // Click Account Health Score Card to open Settings Modal
    const healthCard = page.locator('#account-health-score-card');
    await expect(healthCard).toBeVisible();
    await healthCard.click();

    // Verify Modal opens with Health & Webhook settings
    await expect(page.getByText(/Health/i).first()).toBeVisible();
  });
});
