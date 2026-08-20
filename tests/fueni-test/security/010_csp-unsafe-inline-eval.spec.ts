import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

/**
 * Confirmed live 2026-08-20: `/fr/login` itself is actually hosted by Keycloak on the separate
 * auth domain (a custom-themed login form, not a page served by the FUENI Next.js app - see
 * security/011 for that page's own, different CSP gap). The authenticated FUENI SPA (dashboard
 * and the rest of the app behind login) is where the app's own CSP applies, and its
 * `script-src` includes `'self' 'unsafe-inline' 'unsafe-eval' blob: ...`. A CSP is present
 * (good - see security/008), but `'unsafe-inline'` and `'unsafe-eval'` are well-documented
 * anti-patterns that remove most of what a script-src CSP is meant to defend against: an
 * attacker who achieves HTML injection can still execute inline `<script>` /
 * `javascript:`/event-handler payloads, and `eval`/`new Function`-based execution isn't blocked
 * either. Confirmed live 2026-08-20 - this is a genuinely new finding, distinct from Session 4's
 * login-page CSP gap (security/011): the authenticated app has a CSP with a script-src, it's
 * just weakened by these two keywords. This is a live regression check, not skipped - it will
 * start passing once script-src drops both keywords (typically via a nonce/hash-based CSP
 * instead).
 */
test.describe('Content-Security-Policy hardening - authenticated app', () => {
  test('the authenticated app script-src does not allow unsafe-inline or unsafe-eval', async ({
    page,
  }) => {
    await login(page);
    const response = await page.goto('/fr/dashboard');
    expect(response).not.toBeNull();
    const csp = response!.headers()['content-security-policy'] ?? '';
    expect(csp.length, 'Content-Security-Policy header should be present').toBeGreaterThan(0);

    const scriptSrcMatch = csp.match(/script-src([^;]*)/);
    expect(scriptSrcMatch, 'expected a script-src directive in the CSP').toBeTruthy();
    const scriptSrc = scriptSrcMatch![1];

    expect(scriptSrc, "script-src should not include 'unsafe-inline'").not.toContain(
      "'unsafe-inline'"
    );
    expect(scriptSrc, "script-src should not include 'unsafe-eval'").not.toContain("'unsafe-eval'");
  });
});
