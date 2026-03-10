import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  const testUser = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
  };

  test('signup page renders and validates inputs', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('h1')).toContainText('Create your account');
    await expect(page.locator('input[id="name"]')).toBeVisible();
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();
  });

  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Sign in to MultiSow');
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();
  });

  test('unauthenticated user is redirected from protected routes', async ({ page }) => {
    await page.goto('/dashboard');
    // Middleware should redirect to /login
    await expect(page).toHaveURL(/login/);
  });

  test('signup creates account and redirects', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('input[id="name"]', testUser.name);
    await page.fill('input[id="email"]', testUser.email);
    await page.fill('input[id="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Should redirect to onboarding after successful signup
    await expect(page).toHaveURL(/onboarding/, { timeout: 10000 });
  });

  test('login with valid credentials goes to dashboard', async ({ page }) => {
    // First create the user
    await page.goto('/signup');
    const email = `login-test-${Date.now()}@example.com`;
    await page.fill('input[id="name"]', 'Login Test');
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/onboarding/, { timeout: 10000 });

    // Sign out by clearing session
    await page.goto('/login');

    // Now login
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test('login with wrong password shows error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[id="email"]', 'wrong@example.com');
    await page.fill('input[id="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid email or password')).toBeVisible({ timeout: 5000 });
  });
});
