import { randomUUID } from 'node:crypto';

import { expect, test } from '@playwright/test';

function parseMetric(text: string | null): number {
  if (!text) return Number.NaN;
  return Number(text.replace(/[^0-9.\-]/g, ''));
}

test('complete farm flow keeps dashboard KPIs non-zero', async ({ page }) => {
  const email = `e2e-farm-${randomUUID()}@example.com`;

  await page.goto('/signup');
  await page.getByLabel('Name').fill('E2E Farm Tester');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('TestPass123!');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page).toHaveURL(/\/onboarding/, { timeout: 15_000 });

  // Wait for the onboarding form to be fully visible before interacting
  await page.getByPlaceholder("e.g. Krishnan's Homestead").waitFor({ state: 'visible', timeout: 15_000 });
  
  await page.getByPlaceholder("e.g. Krishnan's Homestead").fill('Wayanad Hills');
  await page.getByPlaceholder('e.g. Wayanad, Kerala').fill('Wayanad, Kerala');
  
  // Wait for and select region
  await page.locator('select').first().waitFor({ state: 'visible', timeout: 10_000 });
  await page.locator('select').first().selectOption('Kerala');
  await page.getByLabel('Farm Area (acres)').fill('2.5');
  await page.getByRole('button', { name: /Laterite/i }).waitFor({ state: 'visible', timeout: 5_000 });
  await page.getByRole('button', { name: /Laterite/i }).click();
  await page.getByLabel('Budget (INR)').fill('250000');
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByRole('button', { name: /Maximise Profit/i }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByRole('button', { name: /Beginner/i }).click();
  await page.getByRole('button', { name: 'Generate AI Plan' }).click();
  await expect(page).toHaveURL(/\/designer/, { timeout: 20_000 });

  await expect(page.getByRole('button', { name: 'Wayanad Classic' })).toBeVisible({ timeout: 10_000 });
  await page.getByRole('button', { name: 'Wayanad Classic' }).click();
  await expect(page.getByText('Total Plants')).toBeVisible({ timeout: 10_000 });

  await Promise.all([
    page.waitForResponse(response => response.url().includes('/ml/predict') && response.ok()),
    page.getByRole('button', { name: /Apply & Predict/i }).click(),
  ]);

  await page.goto('/dashboard');
  await expect(page.getByText('Latest Prediction')).toBeVisible({ timeout: 20_000 });

  const ler = page.getByTestId('metric-card-system-ler-value');
  const yieldValue = page.getByTestId('metric-card-predicted-yield-value');
  const revenueValue = page.getByTestId('metric-card-est-revenue-value');

  await expect.poll(async () => parseMetric(await ler.textContent())).toBeGreaterThan(0);
  await expect.poll(async () => parseMetric(await yieldValue.textContent())).toBeGreaterThan(0);
  await expect.poll(async () => parseMetric(await revenueValue.textContent())).toBeGreaterThan(0);
});
