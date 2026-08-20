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

## Improvement suggestion
The "Vérification en cours" status is currently only fully explained inside the dashboard modal.
Consider surfacing the expected review timeline (already shown as "Délai max : 2 jours ouvrés"
elsewhere) directly in the sidebar status label too, so it's visible without opening the modal.
