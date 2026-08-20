# 010 - Session, logout & password-change invalidation

**Result:** 🟡 PARTIAL (logout confirmed; password-change invalidation not testable)

## How to test
1. Log in, then log out - confirm the session is truly ended (not just a client-side redirect).
2. Separately, change the account's password (or have it changed) while a session is active
   elsewhere, and confirm that other active session is invalidated.

## Expected
Both logout and a password change should fully invalidate the relevant session(s), not just the
current tab/client state.

## Actual
- **Logout:** confirmed thoroughly - see
  `app-shell-fue-815/007-logout-post-csrf-terminates-both-sessions/README.md` for the full
  evidence (a real `POST /api/v1/session/logout` with a CSRF token, and re-visiting the admin URL
  afterwards required full credentials again, proving the Keycloak SSO session was also
  terminated, not just the local app session).
- **Password-change invalidation:** **not testable this session.** There's no self-service
  password-change UI in the admin app (only the DSI can reset a password, per the login page's
  own "Mot de passe oublié ?" → mailto link), and this session only has one admin
  account/session to test with - see test case 020 for the same underlying limitation.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
The password-change-invalidation half is blocked on the same account-provisioning gap as test
case 020 - see `defects/improvement/test-account-provisioning.md`. Resolving that unblocks both
cases at once since they need the same thing: a second controllable admin session plus a way to
trigger a real password reset against it.
