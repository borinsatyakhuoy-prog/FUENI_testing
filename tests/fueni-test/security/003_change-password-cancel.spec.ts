import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Connexion & Sécurité', () => {
  test('Changer (password) opens a form that can be cancelled as a true no-op', async ({
    page,
  }) => {
    await login(page);
    await page.goto('/fr/security');

    // exact: true - a substring match on "Changer" also hits the unrelated
    // "Français ... Changer de langue" button in the top bar.
    await page.getByRole('button', { name: 'Changer', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Annuler' })).toBeVisible();

    // Real-data safety: never submit this form - it would change the shared
    // account's password and break every other test's login. Assert the
    // cancel was a true no-op directly (still on /security, session intact)
    // rather than logging out and back in to "prove" it - that round trip
    // raced the app's own delayed post-logout redirect (see Issue 1,
    // test-results/exploratory-findings.md) and was a flaky way to check
    // something this direct assertion already covers.
    await page.getByRole('button', { name: 'Annuler' }).click();
    await expect(page.getByRole('button', { name: 'Annuler' })).toHaveCount(0);
    await expect(page).toHaveURL(/\/security/);
    await expect(page.getByRole('button', { name: 'Changer', exact: true })).toBeVisible();
  });
});
