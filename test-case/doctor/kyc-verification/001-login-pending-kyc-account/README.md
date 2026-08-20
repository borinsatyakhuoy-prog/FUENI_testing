# 001 - Login - PENDING_KYC account

**Result:** ✅ PASS

## How to test
1. Log in with a doctor account whose KYC has not yet been approved (a freshly-registered
   account, before any KYC submission).
2. Observe whether login succeeds and what the dashboard shows.

## Expected
Login should succeed (KYC pending shouldn't block login itself); the dashboard should clearly
indicate the account is in a pending-verification state, and medical-record features should be
locked rather than the whole account being unusable.

## Actual
Matches expected. Login succeeds; sidebar shows "Vérification en cours" under the account name;
dashboard loads normally with all stat cards at zero - see `001-pending-kyc-dashboard.png`.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.
