# 000 - UI Admin Login

**Result:** ✅ PASS

## How to test
1. Navigate to `https://fueni-staging-preview-admin.allweb.cloud`.
2. Observe the login page that renders.

## Expected
A login page should render with an admin-specific email/password form, plus whatever
security-context messaging the product wants to show admins before they authenticate.

## Actual
Matches expected. The page renders a "Zone restreinte" / "Portail d'administration" panel
(access-restriction messaging, MFA/VPN/audit callouts, a `PRODUCTION · RGPD · HDS · ISO 27001`
badge) alongside the actual login form (email + password fields, "Mot de passe oublié ?" →
mailto DSI link, no signup link). See `admin-000-login-page-ui.png`.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.
