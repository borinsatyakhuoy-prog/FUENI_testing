# 007 - Logout — POST + CSRF, never a bare GET link, terminates both sessions

**Result:** ✅ PASS on all three criteria

## How to test
1. Inspect the "Se déconnecter" control's underlying DOM element (is it a real `<a href>` link,
   or a JS-handled control?).
2. Click it and capture the actual network request(s) fired, including method and headers.
3. After logout, navigate back to the admin URL and check whether it silently re-authenticates
   (only the local session died) or requires full credentials again (both the local and the
   Keycloak SSO session died).

## Expected
Logout should be a real POST request carrying CSRF protection, never a bare GET-able link
(which could be triggered by CSRF via a plain `<img>`/`<a>` from another site), and it should
terminate both the app's own session and the underlying Keycloak SSO session.

## Actual
Matches expected on all three points:
- **Not a bare link:** DOM inspection shows "Se déconnecter" is a `<div role="menuitem">` with no
  `href` at all - a JS click handler, not a navigable link.
- **Real POST + CSRF:** clicking it fires `POST https://fueni-staging-preview-admin.allweb.cloud/api/v1/session/logout`
  → `204 No Content`, and the request headers include `x-csrf-token: <uuid>`.
- **Terminates both sessions:** after logout, navigating back to the admin URL required the
  **full email + password + OTP flow again** - it did not silently re-authenticate via a
  lingering Keycloak SSO session. See `admin-019-login-success-console-redirect.png` for what a
  fresh, successful re-login looks like after this full logout/re-auth cycle.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation (network request inspection via the
browser tool's request log, including headers) - not yet cross-browser tested.
