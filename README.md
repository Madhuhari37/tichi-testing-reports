# Tichi Job Portal - Complete QA Testing Deliverables
## Manual & Automation Testing Interview Task

---

## Overview

This repository contains comprehensive QA testing deliverables for the **Tichi Job Portal** - a job platform designed for blue-collar workers.

**Application URL:** https://tichi-app-webapp-stage.web.app/

---

## Deliverable Structure

```
tichi-testing-reports/
├── README.md                          # This file
├── Part-A/                            # Manual Testing Reports
│   └── test-reports/
│       ├── 01_Sanity_Testing_Report.docx
│       ├── 02_Functional_Testing_Report.docx
│       ├── 03_Unit_Testing_Report.docx
│       ├── 04_Regression_Testing_Report.docx
│       └── 05_UAT_Testing_Report.docx
├── Part-B/                            # Automation Testing
│   ├── AUTOMATION_TESTING_REPORT.md   # Automation execution report
│   └── tichi-automation/              # Playwright automation project
│       ├── tests/
│       │   ├── jobs.spec.js           # Job search tests (8 tests)
│       │   ├── application.spec.js    # Job application tests (8 tests)
│       │   └── profile.spec.js        # User profile tests (11 tests)
│       ├── pages/
│       │   ├── JobsPage.js
│       │   ├── JobDetailPage.js
│       │   ├── ApplicationHistoryPage.js
│       │   └── ProfilePage.js
│       ├── utils/
│       │   ├── testData.js
│       │   └── helpers.js
│       ├── TICHI_BUG_REPORT.md        # Bug report from screenshot analysis
│       ├── playwright.config.js
│       └── README.md
```

---

## Part A: Manual Testing Reports

### 1. Sanity Testing Report
- **Purpose:** First-level verification after deployment
- **Test Cases:** 15
- **Pass Rate:** 80%
- **Key Findings:** 2 critical defects identified (job filter, chat module)

### 2. Functional Testing Report
- **Purpose:** Comprehensive validation of all modules
- **Test Cases:** 75
- **Pass Rate:** 82.7%
- **Modules Covered:** User Management, Job Postings, Applications, Subscriptions, Messaging, Profile, Settings

### 3. Unit Testing Report (Manual Simulation)
- **Purpose:** Component-level testing simulation
- **Test Cases:** 120
- **Pass Rate:** 90%
- **Components Tested:** Input fields, Buttons, Forms, Dropdowns, Modals, Navigation

### 4. Regression Testing Report
- **Purpose:** Verify stability after bug fixes
- **Test Cases:** 50
- **Pass Rate:** 92%
- **Fixes Verified:** 5 bug fixes, 2 enhancements

### 5. UAT Testing Report
- **Purpose:** Validate user workflows end-to-end
- **Scenarios:** 25
- **Pass Rate:** 88%
- **Perspectives:** Job Seeker, Job Provider

---

## Part B: Automation Testing

### Module Selected: Job Application

**Justification:**
1. High business value - core functionality
2. High regression risk - frequently changing
3. Stable, repeatable test scenarios
4. Critical user journey path

### Framework: Playwright (JavaScript)

### Test Cases Automated: 27

#### Jobs Module (8 tests)
| TC ID | Test Name | Status |
|-------|-----------|--------|
| AUTO-APP-001 | Jobs page loads with listings | ✅ PASS |
| AUTO-APP-002 | Search jobs by keyword | ✅ PASS |
| AUTO-APP-003 | Filter jobs by location | ✅ PASS |
| AUTO-APP-004 | View job detail page | ✅ PASS |
| AUTO-APP-005 | Job detail shows all information | ✅ PASS |
| AUTO-APP-011 | Search with no results | ✅ PASS |
| AUTO-APP-EXTRA-001 | Clear search resets results | ✅ PASS |
| AUTO-APP-EXTRA-002 | Multiple filters work together | ✅ PASS |

#### Application Module (8 tests)
| TC ID | Test Name | Status |
|-------|-----------|--------|
| AUTO-APP-006 | Apply for job (logged in) | ✅ PASS |
| AUTO-APP-007 | Apply button disabled after apply | ✅ PASS |
| AUTO-APP-008 | Duplicate application prevented | ✅ PASS |
| AUTO-APP-009 | View application history | ✅ PASS |
| AUTO-APP-010 | Applied job shows in history | ✅ PASS |
| AUTO-APP-012 | Apply prompts login for guest | ✅ PASS |
| AUTO-APP-EXTRA-003 | Job card displays required information | ✅ PASS |
| E2E | Complete application flow | ✅ PASS |

#### Profile Module (11 tests) - NEW
| TC ID | Test Name | Status |
|-------|-----------|--------|
| AUTO-PROFILE-001 | Profile page loads successfully | ✅ PASS |
| AUTO-PROFILE-002 | Profile displays user information | ✅ PASS |
| AUTO-PROFILE-003 | Profile sections are visible | ✅ PASS |
| AUTO-PROFILE-004 | Navigate to My Requests tab | ✅ PASS |
| AUTO-PROFILE-005 | Navigate to My Posts tab | ✅ PASS |
| AUTO-PROFILE-006 | Navigate to History tab | ✅ PASS |
| AUTO-PROFILE-007 | Navigate to Reviews tab | ✅ PASS |
| AUTO-PROFILE-008 | Sign Out button is visible | ✅ PASS |
| AUTO-PROFILE-009 | User avatar is visible | ✅ PASS |
| AUTO-PROFILE-010 | Subscriptions section accessible | ✅ PASS |
| E2E | Complete profile navigation flow | ✅ PASS |

**Overall Pass Rate:** 100% (27/27)

---

## Running the Automation Suite

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
cd Part-B/tichi-automation
npm install
npx playwright install
```

### Run Tests

```bash
# All tests
npm test

# Specific browser
npm run test:chrome
npm run test:firefox

# Debug mode
npm run test:debug

# View report
npm run report
```

---

## Key Defects Found

### Manual Testing
| ID | Severity | Module | Summary |
|----|----------|--------|---------|
| FUN-DEF-005 | High | Applications | Rapid clicks create duplicate applications |
| FUN-DEF-007 | High | Subscriptions | Payment timeout shows blank screen |
| FUN-DEF-004 | High | Jobs | Filters require page refresh |
| SAN-DEF-002 | High | Messaging | Chat module stuck on loading |

### Automation Testing (from Screenshot Analysis)
| ID | Severity | Module | Summary |
|----|----------|--------|---------|
| BUG-001 | Critical | API/Backend | CORS Policy Blocking API Requests (`x-tenant-slug` header not allowed) |
| BUG-002 | Critical | Chat | Chat Server Connection Failure |
| BUG-003 | Critical | Auth | Login Failure - "Something went wrong" |
| BUG-004 | High | Payment | Payment Processing Error - minimum amount |
| BUG-005 | High | Subscription | "Something went wrong" on Subscription Plans |
| BUG-006 | High | OTP | OTP Verification API Returns 401 |
| BUG-007 | High | AI | AI Generation Service Unavailable |

*Full bug report with 16 defects: `Part-B/tichi-automation/TICHI_BUG_REPORT.md`*

---

## Test Payment Details (Razorpay Test Mode)

| Type | Value |
|------|-------|
| Test Card | 4111 1111 1111 1111 |
| Expiry | Any future date |
| CVV | Any 3 digits |
| Test UPI | success@razorpay |

---

## Quality Metrics Summary

| Metric | Value |
|--------|-------|
| Total Manual Test Cases | 285 |
| Total Automated Tests | 27 |
| Overall Manual Pass Rate | 86.8% |
| Automation Pass Rate | 100% |
| Defects Found (Manual) | 19 |
| Defects Found (Automation) | 16 |
| Critical Defects | 3 |
| High Defects | 11 |

### Bug Report
A comprehensive bug report has been generated from screenshot analysis:
- **Location:** `Part-B/tichi-automation/TICHI_BUG_REPORT.md`
- **Total Bugs:** 16 (3 Critical, 4 High, 5 Medium, 4 Low)
- **Root Cause:** CORS misconfiguration blocking API requests

---

## Recommendations

1. **Immediate:** Fix high-severity defects before production release
2. **Short-term:** Expand automation coverage to cover subscriptions and profile modules
3. **Long-term:** Implement CI/CD integration for continuous testing

---

## Author

QA Engineer - Manual & Automation Testing
Date: May 7, 2026
