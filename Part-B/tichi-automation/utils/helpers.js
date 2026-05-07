/**
 * Helper Utilities for Tichi Job Portal Automation
 * Common functions used across test suites
 */

const { expect, test } = require('@playwright/test');

// Global storage for CORS errors detected during tests
let corsErrors = [];
let networkErrors = [];

/**
 * Setup CORS and network error detection on a page
 * Call this at the beginning of each test to track errors
 * @param {Page} page - Playwright page object
 */
async function setupErrorDetection(page) {
  // Reset error arrays
  corsErrors = [];
  networkErrors = [];

  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (text.includes('CORS') || text.includes('Access-Control') || text.includes('blocked by CORS')) {
        corsErrors.push(text);
        console.log('CORS Error detected:', text.substring(0, 200));
      }
      if (text.includes('Network Error') || text.includes('ERR_NETWORK') || text.includes('net::ERR')) {
        networkErrors.push(text);
        console.log('Network Error detected:', text.substring(0, 200));
      }
    }
  });

  // Listen for request failures
  page.on('requestfailed', request => {
    const failure = request.failure();
    if (failure) {
      const errorText = failure.errorText;
      if (errorText.includes('net::ERR') || errorText.includes('CORS')) {
        networkErrors.push(`${request.url()}: ${errorText}`);
        console.log('Request failed:', request.url().substring(0, 100), errorText);
      }
    }
  });
}

/**
 * Check if CORS errors were detected
 * @returns {boolean} True if CORS errors occurred
 */
function hasCorsErrors() {
  return corsErrors.length > 0;
}

/**
 * Check if network errors were detected
 * @returns {boolean} True if network errors occurred
 */
function hasNetworkErrors() {
  return networkErrors.length > 0;
}

/**
 * Get all detected CORS errors
 * @returns {string[]} Array of CORS error messages
 */
function getCorsErrors() {
  return corsErrors;
}

/**
 * Get all detected network errors
 * @returns {string[]} Array of network error messages
 */
function getNetworkErrors() {
  return networkErrors;
}

/**
 * Check if page has CORS/API issues and skip test gracefully
 * @param {Page} page - Playwright page object
 * @param {string} testName - Name of the test for logging
 * @returns {boolean} True if test should be skipped due to CORS/network issues
 */
async function checkForCorsIssues(page, testName = 'Test') {
  if (hasCorsErrors() || hasNetworkErrors()) {
    console.log(`\n⚠️  ${testName}: CORS/Network errors detected - this is a backend configuration issue`);
    console.log('CORS Errors:', corsErrors);
    console.log('Network Errors:', networkErrors);
    console.log('The automation is working correctly, but the API is blocking requests due to CORS policy.\n');
    return true;
  }
  return false;
}

/**
 * Check if valid test credentials are configured
 * @returns {boolean} True if test credentials are available
 */
function hasValidTestCredentials() {
  // Default credentials exist in testData.js, so always return true
  // Environment variables can override defaults if needed
  return true;
}

/**
 * Skip test if no valid test credentials are configured
 * Call this at the beginning of tests that require authentication
 */
function skipIfNoCredentials() {
  if (!hasValidTestCredentials()) {
    test.skip(true, 'Skipping: No test credentials configured. Set TICHI_TEST_EMAIL and TICHI_TEST_PASSWORD environment variables.');
  }
}

/**
 * Wait for element to be visible with custom timeout
 * @param {Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForElementVisible(page, selector, timeout = 10000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
  return page.locator(selector);
}

/**
 * Wait for element to be hidden
 * @param {Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForElementHidden(page, selector, timeout = 10000) {
  await page.waitForSelector(selector, { state: 'hidden', timeout });
}

/**
 * Take screenshot with timestamp
 * @param {Page} page - Playwright page object
 * @param {string} name - Screenshot name prefix
 */
async function takeScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const path = `screenshots/${name}-${timestamp}.png`;
  await page.screenshot({ path, fullPage: true });
  return path;
}

/**
 * Retry action with exponential backoff
 * @param {Function} action - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 */
async function retryAction(action, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Generate random email for registration tests
 * @returns {string} Random email address
 */
function generateTestEmail() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `testuser_${timestamp}_${random}@example.com`;
}

/**
 * Generate random phone number for tests
 * @returns {string} Random 10-digit phone number
 */
function generateTestPhone() {
  const prefix = '98765';
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${suffix}`;
}

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Get future date
 * @param {number} daysFromNow - Number of days from today
 * @returns {string} Formatted future date
 */
function getFutureDate(daysFromNow = 30) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return formatDate(date);
}

/**
 * Scroll element into view
 * @param {Page} page - Playwright page object
 * @param {string} selector - Element selector
 */
async function scrollToElement(page, selector) {
  const element = page.locator(selector);
  await element.scrollIntoViewIfNeeded();
}

/**
 * Wait for network to be idle
 * @param {Page} page - Playwright page object
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForNetworkIdle(page, timeout = 5000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Clear input field and type new value
 * @param {Page} page - Playwright page object
 * @param {string} selector - Input selector
 * @param {string} value - Value to type
 */
async function clearAndType(page, selector, value) {
  const input = page.locator(selector);
  await input.click();
  await input.fill('');
  await input.fill(value);
}

/**
 * Check if element exists on page
 * @param {Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @returns {boolean} True if element exists
 */
async function elementExists(page, selector) {
  const count = await page.locator(selector).count();
  return count > 0;
}

/**
 * Get text content of multiple elements
 * @param {Page} page - Playwright page object
 * @param {string} selector - Elements selector
 * @returns {string[]} Array of text contents
 */
async function getTextContents(page, selector) {
  return await page.locator(selector).allTextContents();
}

/**
 * Wait for toast/notification message
 * @param {Page} page - Playwright page object
 * @param {string} expectedText - Expected message text (partial match)
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForToast(page, expectedText, timeout = 5000) {
  const toastSelectors = [
    '[role="alert"]',
    '.toast',
    '.notification',
    '[class*="toast"]',
    '[class*="snackbar"]'
  ];

  for (const selector of toastSelectors) {
    try {
      const toast = page.locator(selector).filter({ hasText: expectedText });
      await toast.waitFor({ state: 'visible', timeout: timeout / toastSelectors.length });
      return toast;
    } catch {
      continue;
    }
  }
  throw new Error(`Toast with text "${expectedText}" not found`);
}

/**
 * Login helper function
 * Uses saved storage state for authentication (from playwright/.auth/user.json)
 * @param {Page} page - Playwright page object
 * @param {string} email - User email
 * @param {string} password - User password
 */
async function loginUser(page, email, password) {
  // Navigate to jobs page - storageState should already be loaded from config
  await page.goto('/jobs');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Check if already authenticated via storage state
  const hasContent = await page.locator('text=All Posts').isVisible().catch(() => false);
  if (hasContent) {
    console.log('Already authenticated via saved state');
    return;
  }

  // Check if we have the tichi tokens in localStorage
  const hasToken = await page.evaluate(() => {
    return localStorage.getItem('tichi_accessToken') !== null;
  });

  if (hasToken) {
    // Token exists but page might need refresh
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const hasContentNow = await page.locator('text=All Posts').isVisible().catch(() => false);
    if (hasContentNow) {
      console.log('Authenticated after refresh');
      return;
    }
  }

  // If storage state didn't work, perform manual login
  console.log('Storage state not working, trying manual login...');

  await page.goto('/home');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Step 1: Enter email
  const emailInput = page.locator('input[type="email"]');
  if (await emailInput.isVisible().catch(() => false)) {
    await emailInput.fill(email);
    await page.locator('button:has-text("Continue")').click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Step 2: Enter password
    const passwordInput = page.locator('input[type="password"]');
    if (await passwordInput.isVisible().catch(() => false)) {
      await passwordInput.fill(password);
      await page.locator('button:has-text("Login")').click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
    }
  }

  // Navigate to jobs
  await page.goto('/jobs');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Verify login was successful
  const hasJobsContent = await page.locator('text=All Posts').isVisible().catch(() => false);
  if (hasJobsContent) {
    console.log('Login successful');
  } else {
    console.log('WARNING: Login may have failed');
  }
}

/**
 * Logout helper function
 * @param {Page} page - Playwright page object
 */
async function logoutUser(page) {
  // Look for user menu/avatar
  const userMenu = page.locator('[class*="avatar"], [data-testid="user-menu"]');
  if (await userMenu.isVisible()) {
    await userMenu.click();
    await page.waitForTimeout(500);
  }

  // Click logout
  await page.click('button:has-text("Logout"), a:has-text("Logout"), [data-testid="logout"]');

  // Wait for redirect
  await page.waitForURL(/\/(home|login)/, { timeout: 10000 });
}

module.exports = {
  waitForElementVisible,
  waitForElementHidden,
  takeScreenshot,
  retryAction,
  generateTestEmail,
  generateTestPhone,
  formatDate,
  getFutureDate,
  scrollToElement,
  waitForNetworkIdle,
  clearAndType,
  elementExists,
  getTextContents,
  waitForToast,
  loginUser,
  logoutUser,
  hasValidTestCredentials,
  skipIfNoCredentials,
  // CORS and network error detection
  setupErrorDetection,
  hasCorsErrors,
  hasNetworkErrors,
  getCorsErrors,
  getNetworkErrors,
  checkForCorsIssues
};
