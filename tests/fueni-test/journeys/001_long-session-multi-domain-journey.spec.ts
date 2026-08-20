import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

const PREFS_ENDPOINT = '/api/v1/patients/me/notification-preferences';

/**
 * Every other spec in this suite deliberately tests one action in isolation (see the rest of
 * tests/fueni-test/). This file is the opposite on purpose: one continuous session that carries
 * a single authenticated context across every domain (dashboard, profile, security, navigation,
 * a real-and-reverted mutation, and logout), to catch bugs that only show up over a long session
 * - state that leaks between pages, auth that silently drops partway through, or a mutation on
 * one page affecting what a later, unrelated page renders. None of the per-action specs can
 * catch this class of bug, since each of them starts from a fresh login.
 */
test.describe('Long session - multi-domain journey', () => {
  test('a single session survives dashboard -> profile edit/cancel -> security -> full sidebar sweep -> a real reverted mutation -> logout', async ({
    page,
  }) => {
    test.slow(); // many sequential navigations/assertions in one test.

    await test.step('login lands on dashboard', async () => {
      await login(page);
      await expect(page.getByRole('heading', { name: /^Bonjour/ })).toBeVisible();
    });

    await test.step('Mon profil - open Localisation edit, cancel without saving', async () => {
      await page.goto('/fr/my-profile');
      await expect(page.getByRole('heading', { name: 'Identité' })).toBeVisible();
      await page.getByRole('button', { name: 'Modifier' }).first().click();
      await expect(page.getByRole('button', { name: 'Annuler' })).toBeVisible();
      // Real-data safety: never click Enregistrer against the shared account.
      await page.getByRole('button', { name: 'Annuler' }).click();
      await expect(page.getByRole('button', { name: 'Annuler' })).toHaveCount(0);
    });

    await test.step('Connexion & Sécurité - contact info still reflects the same account', async () => {
      await page.goto('/fr/security');
      await expect(page.getByRole('heading', { name: 'Coordonnées & connexion' })).toBeVisible();
      await expect(page.getByText('Vérifié').first()).toBeVisible();
    });

    await test.step('full sidebar sweep - every route reachable without the session dropping', async () => {
      const routes: Array<[string, RegExp]> = [
        ['Mes RDV', /\/appointments/],
        ['Prendre RDV', /\/book/],
        ['Mes documents', /\/documents/],
        ['FAQ', /\/faq/],
        ['Contacter le support', /\/support/],
        ['Tableau de bord', /\/dashboard/],
      ];
      for (const [linkName, urlPattern] of routes) {
        await page.getByRole('link', { name: linkName, exact: true }).click();
        await expect(page).toHaveURL(urlPattern);
      }
      // Back on the dashboard after the sweep - confirm auth genuinely never dropped mid-journey,
      // not just that each redirect happened to work in isolation.
      await expect(page.getByRole('heading', { name: /^Bonjour/ })).toBeVisible();
    });

    await test.step('Mon profil - a real, safely-revertible mutation survives everything above', async () => {
      await page.goto('/fr/my-profile');
      const smsSwitch = page.getByRole('switch', { name: 'Rappels de rendez-vous par SMS' });
      await expect(smsSwitch).toBeChecked();

      try {
        const [putResponse] = await Promise.all([
          page.waitForResponse(
            (res) => res.url().includes(PREFS_ENDPOINT) && res.request().method() === 'PUT'
          ),
          smsSwitch.click(),
        ]);
        expect(putResponse.ok()).toBeTruthy();
        await expect(smsSwitch).not.toBeChecked();
      } finally {
        // Revert unconditionally, even on assertion failure above, so the shared account's real
        // state is never left mutated by this test - same discipline as profile/005.
        const currentSwitch = page.getByRole('switch', { name: 'Rappels de rendez-vous par SMS' });
        if (!(await currentSwitch.isChecked())) {
          await Promise.all([
            page.waitForResponse(
              (res) => res.url().includes(PREFS_ENDPOINT) && res.request().method() === 'PUT'
            ),
            currentSwitch.click(),
          ]);
        }
        await expect(currentSwitch).toBeChecked();
      }
    });

    await test.step('logout ends the long session cleanly', async () => {
      await page.getByRole('button', { name: 'Se déconnecter' }).click();
      // Same generous timeout as auth/005 - the post-logout redirect involves a CORS-blocked
      // fetch that falls back to a full navigation (Issue 1), and can be slower still after a
      // long session with many prior navigations. See Issue 3 for why this isn't tightened.
      await expect(page).toHaveURL(/\/login/, { timeout: 30_000 });

      // Issue 1's CORS-fallback can still be mid-navigation (sometimes more than one
      // redirect deep) right after the URL first lands on /login - a `page.goto` issued too
      // early races it and gets cancelled (`net::ERR_ABORTED` / `NS_BINDING_ABORTED`).
      // `waitForLoadState('load')` alone isn't a reliable enough signal that the chain is
      // truly done (confirmed live: still flaked across all 3 browsers with just that wait),
      // so retry the navigation itself rather than guess a longer fixed delay.
      await expect(async () => {
        await page.goto('/fr/dashboard');
      }).toPass({ timeout: 15_000 });
      await expect(page).toHaveURL(/\/login/);
    });
  });
});
