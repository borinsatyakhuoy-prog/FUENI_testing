import { test, expect } from '@playwright/test';

/**
 * Originally found manually in Session 4's OWASP-aligned pass (2026-08-19) - see
 * `defects/http-security-header-gaps/README.md` finding #3 - which explicitly flagged this as
 * "not yet covered by an automated test". This is that automation, not a new discovery:
 * `/fr/login` is actually hosted by Keycloak on a separate auth domain (a custom-themed login
 * form - the page users type their real password into), and its Content-Security-Policy is
 * `frame-src 'self'; frame-ancestors 'self'; object-src 'none';` - it defines neither
 * `script-src` nor a `default-src` fallback. Per the CSP spec, an omitted `script-src` falls
 * back to `default-src`; with both absent, this page's CSP places **no restriction on script
 * execution at all**. This is arguably a more significant gap than security/010's
 * `unsafe-inline`/`unsafe-eval` finding on the authenticated app (a separate, newer finding) -
 * this is the credential-entry page itself, the highest-value target for a script-injection
 * attack, with even less CSP coverage than the app pages behind login. This is a live
 * regression check, not skipped - it will start passing once the Keycloak theme's CSP adds an
 * explicit script-src or default-src directive.
 */
test.describe('Content-Security-Policy hardening - login page', () => {
  test('the login page CSP restricts script execution (script-src or default-src present)', async ({
    page,
  }) => {
    const response = await page.goto('/fr/login');
    expect(response).not.toBeNull();
    const csp = response!.headers()['content-security-policy'] ?? '';
    expect(csp.length, 'Content-Security-Policy header should be present').toBeGreaterThan(0);

    const hasScriptSrc = /script-src/.test(csp);
    const hasDefaultSrc = /default-src/.test(csp);
    expect(
      hasScriptSrc || hasDefaultSrc,
      'expected the login page CSP to define script-src or a default-src fallback that restricts script execution'
    ).toBeTruthy();
  });
});
