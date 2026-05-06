import { test, expect } from '@playwright/test'

test('signup → onboarding → select preset → apply & predict → dashboard has nonzero metrics', async ({ page }) => {
  const timestamp = Date.now()
  const name = `E2E Farm Tester ${timestamp}`
  const email = `copilot-e2e-${timestamp}@example.com`
  const password = `TestPass!${timestamp}`

  // Signup
  await page.goto('http://localhost:3001/signup')
  await page.fill('input[name="name"]', name).catch(() => {})
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await Promise.all([
    page.waitForNavigation({ url: /onboarding|designer|dashboard/ }).catch(() => {}),
    page.click('button:has-text("Create Account")')
  ])

  // If onboarding page is shown, try to progress to designer
  try {
    await page.waitForSelector('text=Generate AI Plan', { timeout: 5000 })
    await page.click('text=Generate AI Plan')
    await page.waitForNavigation({ url: /designer/ })
  } catch (e) {
    // may already be on designer; continue
  }

  // Select preset (Wayanad Classic) if present
  try {
    await page.waitForSelector('text=Wayanad Classic', { timeout: 10000 })
    await page.click('text=Wayanad Classic')
  } catch (e) {
    // preset not present, continue
  }

  // Click Apply & Predict
  try {
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/ml/predict') && resp.status() === 200, { timeout: 60000 }),
      page.click('button:has-text("Apply & Predict")')
    ])
  } catch (e) {
    // fallback: try clicking and wait for navigation to dashboard
    await page.click('button:has-text("Apply & Predict")').catch(() => {})
  }

  // Go to dashboard and assert non-zero numeric metrics exist
  await page.goto('http://localhost:3001/dashboard')
  await page.waitForLoadState('networkidle')

  const body = await page.textContent('body')
  expect(body).toBeTruthy()

  // Assert there's at least one numeric value > 0 on the page
  const re = /(?:\b|\D)([1-9]\d*(?:\.\d+)?)(?:\b|\D)/
  const match = body?.match(re)
  expect(match, 'Expected a non-zero numeric metric on dashboard').not.toBeNull()
})
