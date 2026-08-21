import { test, expect } from '@playwright/test';

/**
 * See `defects/keycloak-userinfo-cors-misconfiguration/README.md`. Originally found on the
 * patient (`fueni-platform`) realm only; this session (2026-08-21) confirmed the same
 * reflect-any-origin + credentials-allowed CORS policy on all three realms (patient, doctor,
 * admin), via a raw HTTP request setting a fabricated `Origin` header directly - something a
 * real browser can't do, which is why `request` (not `page`) is used here rather than
 * in-browser `fetch()`. This is a live regression check, not skipped - it will start passing
 * automatically once the Keycloak CORS/Web-Origins policy is scoped to a real allowlist.
 */
const AUTH_ORIGIN = 'https://fueni-staging-preview-auth.allweb.cloud';
const FABRICATED_ORIGIN = 'https://evil-attacker-site.example.com';
const REALMS = ['fueni-platform', 'fueni-professional', 'fueni-platform-admin'];

test.describe('Keycloak userinfo CORS policy', () => {
  for (const realm of REALMS) {
    test(`${realm} realm's userinfo endpoint should not reflect an arbitrary Origin`, async ({
      request,
    }) => {
      const response = await request.get(
        `${AUTH_ORIGIN}/realms/${realm}/protocol/openid-connect/userinfo`,
        { headers: { Origin: FABRICATED_ORIGIN } }
      );

      expect(response.status(), 'unauthenticated userinfo request should be rejected').toBe(401);

      const acao = response.headers()['access-control-allow-origin'];
      const acac = response.headers()['access-control-allow-credentials'];
      expect(
        acao,
        `expected no Access-Control-Allow-Origin for a never-registered origin (got "${acao}")`
      ).not.toBe(FABRICATED_ORIGIN);
      expect(
        acac,
        'expected Access-Control-Allow-Credentials to not be "true" alongside a reflected origin'
      ).not.toBe('true');
    });
  }
});
