# 013 - Dedicated realm, email-only identification, no self-service registration/reset

**Result:** ✅ PASS

## How to test
1. Inspect the login flow's redirect URL for which Keycloak realm/client it uses.
2. Check the login form for a phone-number option (patient/doctor apps default to a phone tab).
3. Search the page for any "sign up"/"create account" link.
4. Check the "forgot password" link's destination.

## Expected
A realm dedicated to admin (separate from patient/doctor), email-only login, and no self-service
account creation or password reset.

## Actual
Matches expected on all four points:
- Realm: `fueni-platform-admin` (client `admin-web`) - distinct from the patient app's
  `fueni-platform` and the doctor app's `fueni-professional`.
- Login form has only an "Email administrateur" field - no phone tab at all.
- No "S'inscrire"/sign-up link anywhere on the page.
- "Mot de passe oublié ?" links to `mailto:dsi@nazounki.com?subject=Fueni%20Admin%20access` -
  routes to the DSI by email, not a self-service reset form.

See `admin-000-login-page-ui.png`.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
None needed - clean, unambiguous pass. Good candidate for a permanent automated smoke test since
it's a static-content check (realm name, absence of links) with no OTP/timing dependency.
