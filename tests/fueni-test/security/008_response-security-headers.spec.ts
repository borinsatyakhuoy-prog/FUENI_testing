import { test, expect } from '@playwright/test';

/**
 * Confirmed live 2026-08-20 (curl against every hop of the /fr/login redirect chain,
 * patient app through to Keycloak): HSTS, X-Content-Type-Options, X-Frame-Options, and a
 * real (non-empty) Content-Security-Policy are already present and consistent across the
 * whole chain - this suite's own OWASP-aligned pass (Session 4) never asserted on them
 * directly. This is a regression lock, not a gap-driven test: the goal is to catch an
 * accidental removal/weakening of these headers in a future deploy, not to fix anything
 * today - they're already solid.
 */
test.describe('Response security headers', () => {
  test('the login page response carries baseline security headers', async ({ page }) => {
    const response = await page.goto('/fr/login');
    expect(response).not.toBeNull();
    const headers = response!.headers();

    expect(headers['strict-transport-security'], 'HSTS header').toMatch(/max-age=\d+/);
    // Some layers in front of the app (proxy/CDN) can duplicate this header, which Playwright
    // exposes joined as e.g. "nosniff, nosniff" - assert on content, not exact equality.
    expect(headers['x-content-type-options'], 'X-Content-Type-Options header').toContain('nosniff');
    // Either a classic X-Frame-Options or a CSP frame-ancestors directive is an acceptable
    // clickjacking defense - don't hard-fail if the app migrates from one to the other.
    const hasFrameOptions = !!headers['x-frame-options'];
    const csp = headers['content-security-policy'] ?? '';
    const hasFrameAncestors = /frame-ancestors/.test(csp);
    expect(
      hasFrameOptions || hasFrameAncestors,
      'expected X-Frame-Options or a CSP frame-ancestors directive'
    ).toBeTruthy();
    expect(csp.length, 'Content-Security-Policy header should be present and non-empty').toBeGreaterThan(0);
  });
});
