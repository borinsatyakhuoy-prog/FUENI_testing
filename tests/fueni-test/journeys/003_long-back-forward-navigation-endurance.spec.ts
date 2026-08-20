import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

/**
 * navigation/008 checks a short (4-hop) back/forward sequence. This is the same idea stretched
 * much further - a long, winding back/forward chain across 10+ transitions in one session,
 * mixing real pages and "coming soon" placeholders - to catch bugs that only show up after
 * sustained client-side routing (stale cache, a memory leak surfacing as broken state, or auth
 * silently dropping partway through a long chain) rather than a handful of hops. Read-only
 * throughout - safe to run alongside anything else touching this account.
 *
 * Improvement note: none needed - read-only and safe to run freely. Could be extended with a
 * couple of tab-close/reopen hops if a real bug report ever points at session state surviving
 * that specific transition.
 */
test.describe('Long session - back/forward navigation endurance', () => {
  test('a long, winding back/forward chain across real and placeholder pages never renders stale or broken content', async ({
    page,
  }) => {
    test.slow();

    await login(page);
    await page.goto('/fr/my-profile');
    await page.goto('/fr/security');
    await page.goto('/fr/appointments');
    await page.goto('/fr/documents');
    await page.goto('/fr/faq');
    await page.goto('/fr/support');

    const expectAt = async (urlPattern: RegExp, headingName: string) => {
      await expect(page).toHaveURL(urlPattern);
      await expect(page.getByRole('heading', { name: headingName })).toBeVisible();
    };

    // History stack at this point: dashboard(0) -> my-profile(1) -> security(2) ->
    // appointments(3) -> documents(4) -> faq(5) -> support(6, current). Walk all the way back
    // to the dashboard, one hop at a time, checking every stop - not just the start and end.
    await page.goBack(); // -> faq(5)
    await expectAt(/\/faq/, 'Bientôt disponible');
    await page.goBack(); // -> documents(4)
    await expectAt(/\/documents/, 'Bientôt disponible');
    await page.goBack(); // -> appointments(3)
    await expectAt(/\/appointments/, 'Bientôt disponible');
    await page.goBack(); // -> security(2)
    await expectAt(/\/security/, 'Connexion & Sécurité');
    await page.goBack(); // -> my-profile(1)
    await expectAt(/\/my-profile/, 'Mon profil');
    await page.goBack(); // -> dashboard(0)
    await expectAt(/\/dashboard/, /^Bonjour/);

    // Now forward again, past where we started back-tracking, then jump around rather than
    // walking in a single direction - real users don't navigate in neat straight lines.
    await page.goForward(); // my-profile
    await expectAt(/\/my-profile/, 'Mon profil');
    await page.goForward(); // security
    await expectAt(/\/security/, 'Connexion & Sécurité');
    await page.goForward(); // appointments
    await expectAt(/\/appointments/, 'Bientôt disponible');
    await page.goBack(); // security again
    await expectAt(/\/security/, 'Connexion & Sécurité');
    await page.goForward(); // appointments again
    await expectAt(/\/appointments/, 'Bientôt disponible');
    await page.goForward(); // documents
    await expectAt(/\/documents/, 'Bientôt disponible');
    await page.goForward(); // faq
    await expectAt(/\/faq/, 'Bientôt disponible');
    await page.goForward(); // support
    await expectAt(/\/support/, 'Bientôt disponible');

    // End back on the dashboard via a fresh navigation (not back/forward) - confirms the
    // session is still fully intact after the whole chain, not just that individual hops
    // rendered correctly in isolation.
    await page.goto('/fr/dashboard');
    await expect(page.getByRole('heading', { name: /^Bonjour/ })).toBeVisible();
  });
});
