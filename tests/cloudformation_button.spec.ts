import { test, expect } from '@playwright/test';

test.describe('CloudFormation Quick Launch Stack E2E', () => {

  test('renders 1-Click AWS CloudFormation launch button', async ({ page }) => {
    await page.goto('/');

    const cfBtn = page.getByRole('button', { name: /1-Click AWS CloudFormation Launch Stack/i });
    await expect(cfBtn).toBeVisible();
  });
});
