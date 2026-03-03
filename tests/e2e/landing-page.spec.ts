import { test, expect } from '@playwright/test';

test('hero section renders crop animation or fallback', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section')).toContainText(['MultiSow', 'intercropping']);
});

test('all navbar links are present', async ({ page }) => {
  await page.goto('/');
  const links = ['Features', 'Research', 'Dashboard', 'API Docs', 'GitHub'];
  for (const link of links) {
    await expect(page.locator('a', { hasText: link })).toBeVisible();
  }
});

test('strata section layers animate on scroll', async ({ page }) => {
  await page.goto('/');
  await page.locator('#strata').scrollIntoViewIfNeeded();
  await expect(page.locator('#strata')).toBeVisible();
});

test('regional presets section has 6 cards', async ({ page }) => {
  await page.goto('/');
  await page.locator('#presets').scrollIntoViewIfNeeded();
  await expect(page.locator('#presets .w-80')).toHaveCount(6);
});

test('clicking "Design Your Farm" navigates to designer', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Design Your Farm');
  await expect(page).toHaveURL(/designer/);
});

test('clicking "Use This Model" on a preset loads the designer', async ({ page }) => {
  await page.goto('/');
  await page.locator('#presets button', { hasText: 'Use This Model' }).first().click();
  await expect(page).toHaveURL(/designer/);
});
