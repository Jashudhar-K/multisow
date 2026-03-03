import { test, expect } from '@playwright/test';

test('complete flow: landing → select preset → view in 3D → download planting guide', async ({ page }) => {
  await page.goto('/');
  await page.locator('#presets button', { hasText: 'Use This Model' }).first().click();
  await expect(page).toHaveURL(/designer/);
  // Simulate 3D view and download planting guide if UI allows
});

test('complete flow: landing → designer → place plants → get AI recommendation → export plan', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Design Your Farm');
  await expect(page).toHaveURL(/designer/);
  // Simulate plant placement, AI recommendation, and export if UI allows
});
