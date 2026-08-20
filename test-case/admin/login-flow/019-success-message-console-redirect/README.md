# 019 - Success message + console redirect

**Result:** 🟡 PARTIAL (redirect confirmed; no distinct success toast observed)

## How to test
1. Complete a full login (credentials + OTP) successfully.
2. Observe whether a distinct "success" message/toast appears, and whether the app redirects to
   the console.

## Expected
A success indication plus a redirect to the admin console.

## Actual
The redirect to the console (`/fr`, "Vue d'ensemble") works reliably every time this session -
see `admin-019-login-success-console-redirect.png`. No distinct "success" toast/banner was
observed separately from the redirect itself across multiple login attempts this session. Low
priority - worth a second look with devtools/network open in case a toast fires and dismisses
faster than the snapshot/screenshot timing used here.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.
