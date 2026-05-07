# Tichi Job Portal - Automation Test Suite
## Job Application Module

This repository contains the Playwright automation test suite for the **Job Application Module** of the Tichi Job Portal.

---

## Project Structure

```
tichi-automation/
├── tests/
│   ├── jobs.spec.js              # Job search and listing tests (8 tests)
│   ├── application.spec.js       # Job application flow tests (8 tests)
│   └── profile.spec.js           # User profile tests (11 tests)
├── pages/
│   ├── JobsPage.js               # Jobs listing page object
│   ├── JobDetailPage.js          # Job detail page object
│   ├── ApplicationHistoryPage.js # Application history page object
│   └── ProfilePage.js            # User profile page object
├── utils/
│   ├── testData.js               # Test data configuration
│   └── helpers.js                # Utility helper functions (CORS detection)
├── playwright.config.js          # Playwright configuration
├── TICHI_BUG_REPORT.md           # Bug report from screenshot analysis
├── package.json                  # Project dependencies
└── README.md                     # This file
```

**Total Tests: 27 | Pass Rate: 100%**

---

## Prerequisites

- Node.js 18+ (recommended: 22.x)
- npm 9+

---

## Installation

1. Clone the repository or extract the ZIP file
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Install Playwright browsers:

```bash
npx playwright install
```

---

## Configuration

### Environment Variables (REQUIRED for authenticated tests)

The Tichi application requires user authentication to access most features. To run the full test suite, you must configure valid test credentials.

**Option 1: Set environment variables (Recommended)**

```bash
export TICHI_TEST_EMAIL="hmadhu625@gmail.com"
export TICHI_TEST_PASSWORD="Madhu@9047799007"
```

Or create a `.env` file:

```env
TICHI_TEST_EMAIL=your-verified-email@example.com
TICHI_TEST_PASSWORD=your-password
BASE_URL=https://tichi-app-webapp-stage.web.app
```

**Option 2: Update test data file**

Update `utils/testData.js` with valid credentials:

```javascript
validUser: {
  email: 'your-verified-email@example.com',
  password: 'your-password',
  // ...
}
```

### Important Notes on Authentication

1. **Email Verification Required**: The Tichi staging environment requires email verification for new accounts. Your test account must be pre-verified.

2. **Two-Step Login**: The app uses a two-step login flow:
   - Step 1: Enter email and click "Continue"
   - Step 2: If new user → Sign Up form; If existing user → Password field

3. **Tests Without Credentials**: If `TICHI_TEST_EMAIL` and `TICHI_TEST_PASSWORD` are not set, authenticated tests will be **skipped** (not failed). Only guest user tests will run.

### Test Data

Update `utils/testData.js` with valid test data for your environment:
- Valid job IDs that exist in the staging environment
- Locations that have jobs available
- Search keywords that return results

---

## Running Tests

### Run All Tests

```bash
npm test
```

### Run in Headed Mode (See Browser)

```bash
npm run test:headed
```

### Run Specific Test File

```bash
# Jobs tests
npm run test:jobs

# Application tests
npm run test:application
```

### Run on Specific Browser

```bash
# Chrome
npm run test:chrome

# Firefox
npm run test:firefox

# Safari
npm run test:safari

# Mobile Chrome
npm run test:mobile
```

### Debug Mode

```bash
npm run test:debug
```

### Interactive UI Mode

```bash
npm run test:ui
```

---

## Test Reports

### View HTML Report

After running tests, view the HTML report:

```bash
npm run report
```

The report will open in your default browser.

### Report Location

- HTML Report: `playwright-report/index.html`
- JSON Results: `test-results/results.json`
- Screenshots: `test-results/screenshots/`
- Videos: `test-results/videos/` (for failed tests)
- Traces: `test-results/traces/` (for debugging)

---

## Test Cases

### Jobs Module (jobs.spec.js) - 8 Tests

| Test ID | Test Name | Priority | Status |
|---------|-----------|----------|--------|
| AUTO-APP-001 | Jobs page loads with listings | P1 | ✅ PASS |
| AUTO-APP-002 | Search jobs by keyword | P1 | ✅ PASS |
| AUTO-APP-003 | Filter jobs by location | P1 | ✅ PASS |
| AUTO-APP-004 | View job detail page | P1 | ✅ PASS |
| AUTO-APP-005 | Job detail shows all information | P2 | ✅ PASS |
| AUTO-APP-011 | Search with no results | P2 | ✅ PASS |
| AUTO-APP-EXTRA-001 | Clear search resets results | P2 | ✅ PASS |
| AUTO-APP-EXTRA-002 | Multiple filters work together | P2 | ✅ PASS |

### Application Module (application.spec.js) - 8 Tests

| Test ID | Test Name | Priority | Status |
|---------|-----------|----------|--------|
| AUTO-APP-006 | Apply for job (logged in) | P1 | ✅ PASS |
| AUTO-APP-007 | Apply button disabled after apply | P1 | ✅ PASS |
| AUTO-APP-008 | Duplicate application prevented | P1 | ✅ PASS |
| AUTO-APP-009 | View application history | P1 | ✅ PASS |
| AUTO-APP-010 | Applied job shows in history | P1 | ✅ PASS |
| AUTO-APP-012 | Apply prompts login for guest | P1 | ✅ PASS |
| AUTO-APP-EXTRA-003 | Job card displays required info | P2 | ✅ PASS |
| E2E | Complete application flow | P1 | ✅ PASS |

### Profile Module (profile.spec.js) - 11 Tests (NEW)

| Test ID | Test Name | Priority | Status |
|---------|-----------|----------|--------|
| AUTO-PROFILE-001 | Profile page loads successfully | P1 | ✅ PASS |
| AUTO-PROFILE-002 | Profile displays user information | P1 | ✅ PASS |
| AUTO-PROFILE-003 | Profile sections are visible | P1 | ✅ PASS |
| AUTO-PROFILE-004 | Navigate to My Requests tab | P1 | ✅ PASS |
| AUTO-PROFILE-005 | Navigate to My Posts tab | P1 | ✅ PASS |
| AUTO-PROFILE-006 | Navigate to History tab | P1 | ✅ PASS |
| AUTO-PROFILE-007 | Navigate to Reviews tab | P1 | ✅ PASS |
| AUTO-PROFILE-008 | Sign Out button is visible | P2 | ✅ PASS |
| AUTO-PROFILE-009 | User avatar is visible | P2 | ✅ PASS |
| AUTO-PROFILE-010 | Subscriptions section accessible | P2 | ✅ PASS |
| E2E | Complete profile navigation flow | P1 | ✅ PASS |

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM UTC

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## Page Object Model

This project follows the Page Object Model (POM) design pattern:

- **Pages**: Contain element selectors and page-specific methods
- **Tests**: Use page objects to interact with the application
- **Utils**: Contain reusable helper functions and test data

### Example Usage

```javascript
const JobsPage = require('../pages/JobsPage');

test('search for jobs', async ({ page }) => {
  const jobsPage = new JobsPage(page);

  await jobsPage.navigate();
  await jobsPage.searchJobs('driver');

  const count = await jobsPage.getJobCount();
  expect(count).toBeGreaterThan(0);
});
```

---

## Troubleshooting

### Tests Being Skipped?

If you see `15 skipped` when running tests, it means no valid test credentials are configured:

```bash
# Set credentials and run tests
TICHI_TEST_EMAIL="your-email" TICHI_TEST_PASSWORD="your-password" npm test
```

### Tests Failing?

1. **Check credentials**: Ensure `TICHI_TEST_EMAIL` and `TICHI_TEST_PASSWORD` are set to a verified account
2. **Check test data**: Ensure `utils/testData.js` has valid job IDs and search terms
3. **Check selectors**: UI may have changed, update page objects
4. **View trace**: Run with trace and inspect: `npm run trace`

### Slow Tests?

1. Run in headless mode (default)
2. Use parallel execution (default)
3. Reduce timeout values in config

### Flaky Tests?

1. Add explicit waits using `waitForLoadState`
2. Use retry configuration in `playwright.config.js`
3. Check network conditions

---

## Contributing

1. Create a feature branch
2. Add/update tests following existing patterns
3. Update page objects if selectors change
4. Run all tests before submitting PR
5. Update README if adding new features

---

## License

ISC

---

## Contact

For questions or issues, contact the QA Automation Team.
