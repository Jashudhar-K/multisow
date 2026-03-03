import { test, expect } from '@playwright/test';

test('crop database shows > 10 crops', async ({ page }) => {
  await page.goto('/crops');
  await expect(page.locator('.crop-card')).toHaveCountGreaterThan(10);
});

test('search input filters crops in real time', async ({ page }) => {
  await page.goto('/crops');
  await page.fill('input[type="search"]', 'banana');
  await expect(page.locator('.crop-card')).toContainText(['Banana']);
});

test('crops are grouped by stratum layer', async ({ page }) => {
  await page.goto('/crops');
  await expect(page.locator('.stratum-group')).toHaveCountGreaterThan(1);
});
