import { test, expect } from '@playwright/test';

test('dashboard loads and shows metric cards', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.locator('.glass')).toHaveCount(2);
});

test('all existing metrics are visible', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.locator('text=AI/ML Tools')).toBeVisible();
});

test('navigation to other pages works from dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('text=Yield Prediction');
  await expect(page).toHaveURL(/predict/);
});
