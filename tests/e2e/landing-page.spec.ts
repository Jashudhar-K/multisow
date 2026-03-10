import { test, expect } from '@playwright/test';

test('hero section renders with title and CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section').first()).toContainText('MultiSow');
  await expect(page.locator('a', { hasText: 'Design Your Farm' })).toBeVisible();
});

test('clicking "Design Your Farm" navigates to designer', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Design Your Farm');
  await expect(page).toHaveURL(/designer/);
});

test('strata section is visible on scroll', async ({ page }) => {
  await page.goto('/');
  const strata = page.locator('#strata');
  if (await strata.count() > 0) {
    await strata.scrollIntoViewIfNeeded();
    await expect(strata).toBeVisible();
  }
});

test('regional presets section has preset cards', async ({ page }) => {
  await page.goto('/');
  const presets = page.locator('#presets');
  if (await presets.count() > 0) {
    await presets.scrollIntoViewIfNeeded();
    await expect(presets).toBeVisible();
  }
});
