/**
 * Authentication Setup Script
 * Attempts automated login with human-like behavior
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

const AUTH_FILE = path.join(__dirname, '../playwright/.auth/user.json');

test('Save authentication state', async ({ page }) => {
  const email = 'hmadhu625@gmail.com';
  const password = 'Madhu@9047799007';

  // Navigate to login page
  await page.goto('https://tichi-app-webapp-stage.web.app/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  console.log('Attempting automated login...');

  // Step 1: Find and fill email with human-like typing
  const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]');
  await emailInput.waitFor({ state: 'visible', timeout: 10000 });
  await emailInput.click();
  await page.waitForTimeout(500);

  // Type slowly like a human
  for (const char of email) {
    await emailInput.type(char, { delay: 100 });
  }
  await page.waitForTimeout(1000);

  // Step 2: Click Continue
  const continueBtn = page.locator('button:has-text("Continue")');
  await continueBtn.click();
  console.log('Clicked Continue, waiting for password field...');
  await page.waitForTimeout(5000);

  // Check for error
  const error = await page.locator('text=Something went wrong').isVisible().catch(() => false);
  if (error) {
    console.log('ERROR: "Something went wrong" - This is a server-side issue, not automation.');
    console.log('The staging server may be blocking automated requests.');
    console.log('');
    console.log('WORKAROUND: Manually login in this browser window now.');
    await page.pause();
  }

  // Step 3: Fill password
  const passwordInput = page.locator('input[type="password"]');
  const passwordVisible = await passwordInput.isVisible().catch(() => false);

  if (passwordVisible) {
    await passwordInput.click();
    await page.waitForTimeout(500);
    for (const char of password) {
      await passwordInput.type(char, { delay: 80 });
    }
    await page.waitForTimeout(1000);

    // Step 4: Click Sign In
    const signInBtn = page.locator('button:has-text("Sign"), button:has-text("Login"), button[type="submit"]');
    await signInBtn.click();
    console.log('Clicked Sign In...');
    await page.waitForTimeout(5000);
  }

  // Wait for navigation
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  const currentUrl = page.url();
  console.log('Current URL:', currentUrl);

  if (!currentUrl.includes('/login')) {
    console.log('SUCCESS: Logged in!');
  } else {
    console.log('Login may have failed. Pausing for manual intervention...');
    await page.pause();
  }

  // Save state
  await page.context().storageState({ path: AUTH_FILE });
  console.log('Auth state saved to:', AUTH_FILE);
});
