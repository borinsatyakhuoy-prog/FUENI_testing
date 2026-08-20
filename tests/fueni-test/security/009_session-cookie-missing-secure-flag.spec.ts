import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

/**
 * Originally found manually in Session 4's OWASP-aligned pass (2026-08-19) - see
 * `defects/http-security-header-gaps/README.md` finding #1 - which explicitly flagged this as
 * "not yet covered by an automated test" and a candidate for exactly this spec. This is that
 * automation, not a new discovery: after a real login, this app's own SESSION cookie (the one
 * that identifies the authenticated patient session on fueni-staging-preview-patient.allweb.cloud
 * itself, distinct from Keycloak's cookies on the separate auth domain) is missing the `Secure`
 * attribute - every Keycloak-issued cookie (AUTH_SESSION_ID, KC_AUTH_SESSION_HASH,
 * KEYCLOAK_IDENTITY, KEYCLOAK_SESSION) correctly sets `Secure: true`, making this an
 * inconsistency within the same system rather than a blanket policy choice. In practice this
 * site enforces HTTPS everywhere (HSTS `max-age=31536000; includeSubDomains` is present - see
 * security/008), so this isn't currently exploitable through ordinary use, but it removes a
 * defense-in-depth layer: without `Secure`, the browser doesn't refuse to send this cookie over
 * a plain-HTTP connection if one were ever reachable (e.g. a HSTS-bypass edge case, a
 * misconfigured subdomain, or a user's very first request before HSTS is cached). This is a live
 * regression check, not skipped - it will start passing automatically once the cookie is set
 * with `Secure`.
 *
 * Improvement note: see defects/improvement/security-hardening-followups.md for where this sits
 * in the recommended fix order (grouped with the CSP gaps below, after the audit-identity issue).
 */
test.describe('Session cookie hardening', () => {
  test('the patient app SESSION cookie is marked Secure', async ({ page, context }) => {
    await login(page);

    const cookies = await context.cookies();
    const sessionCookie = cookies.find(
      (c) => c.name === 'SESSION' && c.domain.includes('fueni-staging')
    );
    expect(sessionCookie, 'expected a SESSION cookie for the patient app domain').toBeTruthy();
    expect(sessionCookie!.httpOnly, 'SESSION cookie should be HttpOnly (it already is)').toBe(true);
    expect(sessionCookie!.secure, 'SESSION cookie should be marked Secure').toBe(true);
  });
});
