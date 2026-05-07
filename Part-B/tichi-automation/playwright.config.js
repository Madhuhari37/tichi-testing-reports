const { defineConfig, devices } = require("@playwright/test");
const path = require("path");

// Load .env.test if dotenv is available
try {
  require("dotenv").config({ path: path.resolve(__dirname, "../../../.env.test") });
} catch (e) {
  // dotenv not installed, skip loading .env.test
}

const e2eBrowserChannel = process.env.PLAYWRIGHT_BROWSER_CHANNEL || undefined;

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 300000, // 5 minutes - optimized for CI/CD
  fullyParallel: false, // Run tests serially
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1, // Single worker as requested
  reporter: [["html"], ["list"]],
  use: {
    baseURL: "https://tichi-app-webapp-stage.web.app",
    trace: "on",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Add tenant context header for all requests
    extraHTTPHeaders: {
      "X-Tenant-Slug": process.env.DEFAULT_TENANT_SLUG || "tylertech",
    },
  },
  projects: [
    // Setup project
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
      testDir: "./tests",
      use: {
        // Add tenant context header for authentication
        extraHTTPHeaders: {
          "X-Tenant-Slug": process.env.DEFAULT_TENANT_SLUG || "tylertech",
        },
      },
    },

    // E2E tests that depend on setup
    {
      name: "foundry-e2e",
      testDir: "./tests/e2e",
      use: {
        // Extract what we need from Desktop Chrome but omit deviceScaleFactor
        browserName: "chromium",
        channel: e2eBrowserChannel,
        userAgent: devices["Desktop Chrome"].userAgent,
        defaultBrowserType: "chromium",
        // Use the shared authentication state
        storageState: "playwright/.auth/user.json",
        // In CI, use explicit large viewport since --start-maximized doesn't work in headless mode
        viewport: process.env.CI ? { width: 1920, height: 1080 } : null,
        launchOptions: {
          args: process.env.CI ? [] : ["--start-maximized"],
        },
        // Add tenant context header for all requests
        extraHTTPHeaders: {
          "X-Tenant-Slug": process.env.DEFAULT_TENANT_SLUG || "tylertech",
        },
      },
      fullyParallel: false,
      dependencies: ["setup"],
    },
    // Smoke tests that depend on setup
    {
      name: "foundry-smoke",
      testDir: "./tests/smoke_test",
      use: {
        ...devices["Desktop Chrome"],
        // Use the shared authentication state
        storageState: "playwright/.auth/user.json",
        // Add tenant context header for all requests
        extraHTTPHeaders: {
          "X-Tenant-Slug": process.env.DEFAULT_TENANT_SLUG || "tylertech",
        },
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        trace: "retain-on-failure",
      },
      fullyParallel: false,
      dependencies: ["setup"],
      retries: 0, // Override default - always use 0 retries for smoke tests
    },

    // Auth setup with Firefox - run first to save login state
    {
      name: "auth-setup",
      testDir: "./tests",
      testMatch: /auth\.setup\.js$/,
      use: {
        browserName: "firefox",
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Application tests in ./tests/ directory (default project)
    {
      name: "application-tests",
      testDir: "./tests",
      testMatch: /.*\.spec\.js$/,
      use: {
        browserName: "chromium",
        viewport: { width: 1920, height: 1080 },
        // Use saved auth state from capture-login.js
        storageState: "./playwright/.auth/user.json",
        ignoreHTTPSErrors: true,
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        trace: "on",
      },
      fullyParallel: false,
      retries: 0,
    },
  ],
  // WebServer disabled - ensure your application is running at baseURL before running tests
  // webServer: [
  //   {
  //     command: process.env.CI
  //       ? "cd ../../../ && NODE_ENV=production ENABLE_MULTI_TENANCY=true DEFAULT_TENANT_ID=00000000-0000-0000-0000-000000000001 DEFAULT_TENANT_SLUG=tylertech pnpm run foundry-start"
  //       : "cd ../../../ && ENABLE_MULTI_TENANCY=true DEFAULT_TENANT_ID=00000000-0000-0000-0000-000000000001 DEFAULT_TENANT_SLUG=tylertech pnpm run dev",
  //     port: 3001,
  //     reuseExistingServer: !process.env.CI,
  //     timeout: 120000,
  //     stdout: "pipe",
  //     stderr: "pipe",
  //   },
  // ],
});
