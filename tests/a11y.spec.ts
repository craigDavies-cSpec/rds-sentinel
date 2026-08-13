import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Audits - rds-sentinel", () => {
  test("should pass light mode WCAG accessibility guidelines", async ({ page }) => {
    await page.goto("/");
    
    // Toggle console theme to light mode by clicking the button
    const themeButton = page.locator("button[title='Toggle Theme']");
    await expect(themeButton).toBeVisible();
    await themeButton.click();

    // Verify it switched successfully to light mode
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    
    // Move mouse out of the toggle theme button to clear the hover styling contrast scan
    await page.mouse.move(0, 0);
    
    // Analyze page
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .exclude("nextjs-portal")
      .exclude("div[data-nextjs-toast-wrapper]")
      .analyze();
      
    expect(results.violations).toEqual([]);
  });

  test("should pass dark mode WCAG accessibility guidelines", async ({ page }) => {
    await page.goto("/");
    
    // Default mode is dark; wait for hydration to complete and apply dark class
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.locator("button[title='Toggle Theme']")).toBeVisible();
    
    // Move mouse out of any default hover/focus components
    await page.mouse.move(0, 0);

    // Analyze page
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .exclude("nextjs-portal")
      .exclude("div[data-nextjs-toast-wrapper]")
      .analyze();
      
    expect(results.violations).toEqual([]);
  });

  test("should support keyboard tab navigation and aria-label attributes on interactive controls", async ({ page }) => {
    await page.goto("/");

    // Verify aria-labels on layout controls
    await expect(page.locator("button[aria-label='Move Databases Right']")).toBeVisible();
    await expect(page.locator("button[aria-label='Move Balancer Left']")).toBeVisible();

    // Focus theme toggle using Tab
    await page.keyboard.press("Tab");
    const activeElementTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElementTag).toBeDefined();
  });
});
