# Tichi Application - Bug Report

**Application:** Tichi Job Portal
**URL:** https://tichi-app-webapp-stage.web.app
**Testing Period:** April 27, 2026 - May 6, 2026
**Tested By:** QA Team
**Report Date:** May 6, 2026

---

## Executive Summary

During testing of the Tichi Job Portal staging environment, **15 bugs** were identified across multiple modules. The most critical issues involve **CORS configuration errors** blocking API requests, **chat server connection failures**, and **payment processing errors**. These issues significantly impact core functionality including user authentication, messaging, and subscription purchases.

---

## Bug Summary Table

| Bug ID | Severity | Module | Status | Title |
|--------|----------|--------|--------|-------|
| BUG-001 | Critical | API/Backend | Open | CORS Policy Blocking API Requests |
| BUG-002 | Critical | Chat | Open | Chat Server Connection Failure |
| BUG-003 | Critical | Authentication | Open | Login Failure - "Something went wrong" |
| BUG-004 | High | Subscription | Open | Payment Processing Error |
| BUG-005 | High | Subscription | Open | "Something went wrong" on Subscription Plans |
| BUG-006 | High | OTP | Open | OTP Verification API Returns 401 |
| BUG-007 | High | AI Feature | Open | AI Generation Service Unavailable |
| BUG-008 | Medium | Chat Bot | Open | Tichi Bot Network Error |
| BUG-009 | Medium | Documents | Open | Resume Image Not Loading |
| BUG-010 | Medium | Job Posts | Open | Spam/Invalid Job Post Data Displayed |
| BUG-011 | Medium | Navigation | Open | Blank Page on Initial Load |
| BUG-012 | Low | Profile | Open | Profile Incomplete Notification Overlap |
| BUG-013 | Low | Form | Open | Form Validation Message Positioning |
| BUG-014 | Low | UI | Open | Date Format Inconsistency |
| BUG-015 | Low | Chat | Open | Connection Status Shows "Connecting..." Indefinitely |

---

## Detailed Bug Reports

---

### BUG-001: CORS Policy Blocking API Requests

**Severity:** Critical
**Priority:** P1
**Module:** API/Backend Configuration
**Environment:** Staging

**Description:**
All API requests to the backend are being blocked by CORS policy. The server's `Access-Control-Allow-Headers` configuration does not include the `x-tenant-slug` header, causing preflight requests to fail.

**Steps to Reproduce:**
1. Open the Tichi application
2. Login with valid credentials
3. Navigate to any page (Jobs, Profile, My Requests)
4. Open browser DevTools > Network tab

**Expected Result:**
API requests should complete successfully.

**Actual Result:**
All API requests fail with error:
```
Access to XMLHttpRequest at 'https://o0guf45zb8.execute-api.ap-south-1.amazonaws.com/qa/users'
from origin 'https://tichi-app-webapp-stage.web.app' has been blocked by CORS policy:
Request header field x-tenant-slug is not allowed by Access-Control-Allow-Headers in preflight response.
```

**Screenshot Evidence:** Screenshot from 2026-05-06 16-16-53.png

**Recommended Fix:**
Add `x-tenant-slug` to the `Access-Control-Allow-Headers` response header in the API Gateway configuration.

---

### BUG-002: Chat Server Connection Failure

**Severity:** Critical
**Priority:** P1
**Module:** Chat/Messaging
**Environment:** Staging

**Description:**
Users cannot send or receive messages. The chat functionality displays "Connection Error - Failed to connect to chat server" repeatedly.

**Steps to Reproduce:**
1. Login to the application
2. Navigate to Chats page
3. Select any conversation (e.g., Allwin Martin, Paramesh)
4. Try to send a message

**Expected Result:**
Messages should be sent and received successfully.

**Actual Result:**
- Error popup: "Connection Error - Failed to connect to chat server. Please check your internet connection and try again."
- Status shows "Connecting..." indefinitely
- Messages cannot be sent

**Screenshot Evidence:**
- Screenshot from 2026-05-06 14-11-49.png
- Screenshot from 2026-05-06 14-12-07.png
- Screenshot from 2026-05-06 17-49-52.png

**Impact:** Users cannot communicate with job posters or applicants, blocking core platform functionality.

---

### BUG-003: Login Failure - "Something went wrong"

**Severity:** Critical
**Priority:** P1
**Module:** Authentication
**Environment:** Staging

**Description:**
Login attempts fail with a generic error message. Console shows CORS errors and network failures during authentication.

**Steps to Reproduce:**
1. Navigate to https://tichi-app-webapp-stage.web.app/login
2. Enter valid email (e.g., hmadhu625@gmail.com)
3. Click "Continue"
4. Enter valid password
5. Click "Login"

**Expected Result:**
User should be logged in successfully.

**Actual Result:**
- Error message: "Something went wrong. Please try again."
- Console shows: `net::ERR_FAILED` errors
- CORS policy violations in network requests

**Screenshot Evidence:** Screenshot from 2026-05-04 17-47-29.png

---

### BUG-004: Payment Processing Error

**Severity:** High
**Priority:** P2
**Module:** Subscription/Payment
**Environment:** Staging

**Description:**
Payment transactions fail with error "Order amount less than minimum amount allowed."

**Steps to Reproduce:**
1. Login to the application
2. Navigate to Profile > Subscriptions
3. Select any subscription plan (e.g., Weekly Pass - ₹35)
4. Click "Buy Now"

**Expected Result:**
Payment gateway should open for transaction.

**Actual Result:**
Error: "Payment Failed - Order amount less than minimum amount allowed"

**Screenshot Evidence:** Screenshot from 2026-05-03 18-01-14.png

**Recommended Fix:**
Review payment gateway minimum amount configuration. Either increase plan prices or adjust gateway settings.

---

### BUG-005: "Something went wrong" Error on Subscription Plans

**Severity:** High
**Priority:** P2
**Module:** Subscription
**Environment:** Staging

**Description:**
Subscription Plans page intermittently shows generic error modal preventing users from viewing or purchasing plans.

**Steps to Reproduce:**
1. Login to the application
2. Navigate to Profile > Subscriptions
3. Wait for page to load

**Expected Result:**
Subscription plans should display correctly.

**Actual Result:**
Error modal appears: "Uh! oh! Something went wrong. We appreciate your patience. While we fix this, continue browsing on tichi-app-webapp-stage.web.app"

**Screenshot Evidence:**
- Screenshot from 2026-04-29 18-18-18.png
- Screenshot from 2026-05-03 18-01-14.png

---

### BUG-006: OTP Verification API Returns 401

**Severity:** High
**Priority:** P2
**Module:** OTP/Phone Verification
**Environment:** Staging

**Description:**
OTP send and verify API endpoints return 401 Unauthorized errors, preventing users from verifying their mobile numbers.

**Steps to Reproduce:**
1. Login to the application
2. Navigate to Profile > Personal Info
3. Click "Get Verified"
4. Enter phone number and request OTP

**Expected Result:**
OTP should be sent to the user's phone.

**Actual Result:**
- `send-otp` API returns 401 status
- `verify-otp` API returns 401 status
- Network tab shows multiple failed requests

**Screenshot Evidence:**
- Screenshot from 2026-04-29 16-13-31.png
- Screenshot from 2026-04-29 16-14-18.png

**Technical Details:**
- Endpoint: `https://o0guf45zb8.execute-api.ap-south-1.amazonaws.com/qa/users/send-otp`
- Status: 401 Unauthorized

---

### BUG-007: AI Generation Service Unavailable

**Severity:** High
**Priority:** P2
**Module:** AI Features
**Environment:** Staging

**Description:**
The AI Generate feature for job descriptions fails with service unavailable error.

**Steps to Reproduce:**
1. Login to the application
2. Navigate to Create New Post
3. Fill in basic details (Title, Type, etc.)
4. Click "AI Generate" button for Description

**Expected Result:**
AI should generate a job description based on the title and other inputs.

**Actual Result:**
Toast notification: "AI Generation Failed - AI service is temporarily unavailable. Please try again later."

**Screenshot Evidence:** Screenshot from 2026-04-29 16-42-17.png

---

### BUG-008: Tichi Bot Network Error

**Severity:** Medium
**Priority:** P3
**Module:** Chat Bot
**Environment:** Staging

**Description:**
The Tichi Bot chatbot widget shows "Network Error" when users try to interact with it.

**Steps to Reproduce:**
1. Login to the application
2. Navigate to Chats page
3. Open Tichi Bot widget (bottom right corner)
4. Type a message and send

**Expected Result:**
Bot should respond to user queries.

**Actual Result:**
Error message: "Network Error" displayed in the chat widget.

**Screenshot Evidence:** Screenshot from 2026-05-04 12-10-46.png

---

### BUG-009: Resume Image Not Loading

**Severity:** Medium
**Priority:** P3
**Module:** Documents
**Environment:** Staging

**Description:**
Uploaded resume/document images show broken image placeholder instead of actual preview.

**Steps to Reproduce:**
1. Login to the application
2. Navigate to Profile > Details > Documents
3. View uploaded Resume

**Expected Result:**
Document preview/thumbnail should display correctly.

**Actual Result:**
Broken image icon displayed with alt text ":Resume"

**Screenshot Evidence:** Screenshot from 2026-05-04 12-00-59.png

**Recommended Fix:**
Check image URL paths and CDN configuration. Verify CORS settings for document storage.

---

### BUG-010: Spam/Invalid Job Post Data Displayed

**Severity:** Medium
**Priority:** P3
**Module:** Job Posts
**Environment:** Staging

**Description:**
Job listings display spam/gibberish content indicating insufficient input validation.

**Steps to Reproduce:**
1. Login to the application
2. Navigate to Jobs page
3. Search or browse job listings

**Expected Result:**
Only valid, meaningful job posts should be displayed.

**Actual Result:**
Job posts with gibberish data are visible:
- Title: "adfadfafadfadfafadfafadfafadfafadfafad..." (repeated characters)
- Description: "ASDWSSAD"

**Screenshot Evidence:** Screenshot from 2026-05-05 12-24-44.png

**Recommended Fix:**
1. Implement content moderation for job posts
2. Add input validation to reject gibberish/spam content
3. Consider implementing profanity and spam filters

---

### BUG-011: Blank Page on Initial Load

**Severity:** Medium
**Priority:** P3
**Module:** Navigation
**Environment:** Staging

**Description:**
Application occasionally shows blank page (about:blank) instead of loading the intended content.

**Steps to Reproduce:**
1. Open new browser tab
2. Navigate to Tichi application URL
3. Observe page load

**Expected Result:**
Application should load with home/landing page.

**Actual Result:**
Browser shows "about:blank" with completely white/empty page.

**Screenshot Evidence:** Screenshot from 2026-04-27 10-43-35.png

---

### BUG-012: Profile Incomplete Notification Overlap

**Severity:** Low
**Priority:** P4
**Module:** Profile/UI
**Environment:** Staging

**Description:**
The "Profile Incomplete" notification card overlaps with the chatbot icon, affecting readability.

**Steps to Reproduce:**
1. Login with an incomplete profile
2. Navigate to any page
3. Observe the notification in bottom right corner

**Expected Result:**
Notification should not overlap with other UI elements.

**Actual Result:**
Notification partially overlaps with the chatbot floating button.

**Screenshot Evidence:** Screenshot from 2026-04-29 14-25-38.png

---

### BUG-013: Form Validation Message Positioning

**Severity:** Low
**Priority:** P4
**Module:** Forms
**Environment:** Staging

**Description:**
Form validation tooltip "Please fill out this field" appears in an unusual position within the Description textarea.

**Steps to Reproduce:**
1. Navigate to Create New Post
2. Leave Description field empty
3. Click "Create Post"

**Expected Result:**
Validation message should appear below or near the field border.

**Actual Result:**
Browser default tooltip appears inside the textarea area.

**Screenshot Evidence:** Screenshot from 2026-04-29 16-42-53.png

---

### BUG-014: Date Format Inconsistency

**Severity:** Low
**Priority:** P4
**Module:** UI/Forms
**Environment:** Staging

**Description:**
Date field shows placeholder "dd-mm-yyyy" but accepts dates in "yyyy-mm-dd" format.

**Steps to Reproduce:**
1. Navigate to Create New Post
2. Click on Requirement Date field
3. Select a date

**Expected Result:**
Consistent date format throughout.

**Actual Result:**
- Placeholder shows: "dd-mm-yyyy"
- Selected date shows: "2026-05-05" (yyyy-mm-dd format)

**Screenshot Evidence:**
- Screenshot from 2026-05-05 17-49-59.png
- Screenshot from 2026-05-05 17-50-18.png

---

### BUG-015: Chat Connection Status Stuck on "Connecting..."

**Severity:** Low
**Priority:** P4
**Module:** Chat
**Environment:** Staging

**Description:**
User connection status in chat shows "Connecting..." indefinitely even when connection has failed.

**Steps to Reproduce:**
1. Navigate to Chats
2. Select a conversation
3. Observe user status below name

**Expected Result:**
Should show actual status (Online/Offline/Last seen)

**Actual Result:**
Shows "Connecting..." with red indicator dot indefinitely.

**Screenshot Evidence:**
- Screenshot from 2026-05-06 14-11-49.png
- Screenshot from 2026-05-06 17-49-52.png

---

## Bugs by Severity

| Severity | Count |
|----------|-------|
| Critical | 3 |
| High | 4 |
| Medium | 5 |
| Low | 4 |
| **Total** | **16** |

---

## Bugs by Module

| Module | Count |
|--------|-------|
| Chat/Messaging | 4 |
| Subscription/Payment | 2 |
| Authentication | 1 |
| API/Backend | 1 |
| OTP Verification | 1 |
| AI Features | 1 |
| Documents | 1 |
| Job Posts | 1 |
| Navigation | 1 |
| Profile/UI | 1 |
| Forms | 2 |

---

## Root Cause Analysis

### Primary Issue: CORS Misconfiguration
The majority of functional issues stem from **CORS policy misconfiguration** on the backend API. The `x-tenant-slug` header is not whitelisted in `Access-Control-Allow-Headers`, causing all authenticated API requests to fail.

**Affected Endpoints:**
- `/qa/users`
- `/qa/jobs/v2/new`
- `/qa/notifications`
- `/qa/auth/refresh`

### Secondary Issues:
1. **Chat WebSocket Server** - Connection issues independent of CORS
2. **Payment Gateway** - Minimum amount configuration mismatch
3. **AI Service** - External AI service availability

---

## Recommendations

### Immediate Actions (P1):
1. **Fix CORS Configuration** - Add `x-tenant-slug` to allowed headers
2. **Investigate Chat Server** - Check WebSocket server health and configuration
3. **Review Authentication Flow** - Ensure token refresh mechanism works correctly

### Short-term Actions (P2):
1. **Fix Payment Gateway** - Adjust minimum amount thresholds
2. **Restore OTP Service** - Fix authorization issues in OTP endpoints
3. **Check AI Service Integration** - Verify API keys and service availability

### Long-term Actions (P3/P4):
1. **Implement Content Moderation** - Add spam/gibberish detection for job posts
2. **Improve Error Handling** - Replace generic errors with specific messages
3. **UI/UX Improvements** - Fix notification overlaps and form validation styling

---

## Test Environment Details

- **Browser:** Chrome 147.0.0.0
- **OS:** Linux
- **Screen Resolution:** 1920x1080
- **Network:** Stable broadband connection
- **Test Account:** hmadhu625@gmail.com

---

## Attachments

All screenshots are available in: `/home/karthick/Pictures/Screenshots/`

---

*Report generated by QA Automation Team*
