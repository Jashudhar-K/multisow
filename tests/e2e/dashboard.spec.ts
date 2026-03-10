import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/);
  });

  test('shows AI/ML Tools section after login', async ({ page }) => {
    // Create account + login
    const email = `dash-test-${Date.now()}@example.com`;
    await page.goto('/signup');
    await page.fill('input[id="name"]', 'Dashboard Tester');
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/onboarding/, { timeout: 10000 });

    await page.goto('/dashboard');
    await expect(page.locator('text=AI/ML Tools')).toBeVisible({ timeout: 10000 });
  });

  test('quick action links are present', async ({ page }) => {
    const email = `dash-nav-${Date.now()}@example.com`;
    await page.goto('/signup');
    await page.fill('input[id="name"]', 'Nav Tester');
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/onboarding/, { timeout: 10000 });

    await page.goto('/dashboard');
    await expect(page.locator('a[href="/predict"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('a[href="/designer"]')).toBeVisible();
    await expect(page.locator('a[href="/crops"]')).toBeVisible();
  });
});
