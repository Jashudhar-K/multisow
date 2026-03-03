import { test, expect } from '@playwright/test';

// E2E test: LLM explanation is shown after prediction

test('YieldPredictionTool shows LLM explanation after prediction', async ({ page }) => {
  await page.goto('/predict');
  // Fill in farm ID and run prediction with default layers
  await page.fill('input[title="Farm ID"]', 'test-farm-llm');
  await page.click('button', { hasText: 'Run Prediction' });
  // Wait for results
  await expect(page.locator('.glass')).toContainText(['System LER']);
  // Check for AI Summary (LLM explanation)
  await expect(page.locator('.glass')).toContainText(['AI Summary']);
  // Check that the summary text is non-empty
  const summary = await page.locator('.glass').filter({ hasText: 'AI Summary' }).locator('p').textContent();
  expect(summary && summary.length > 20).toBeTruthy();
});
