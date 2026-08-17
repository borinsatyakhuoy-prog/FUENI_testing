import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Connexion & Sécurité', () => {
  test('Changer (password) opens a dialog that can be cancelled without breaking login', async ({
    page,
  }) => {
    await login(page);
    await page.goto('/fr/security');

    // exact: true - a substring match on "Changer" also hits the unrelated
    // "Français ... Changer de langue" button in the top bar.
    await page.getByRole('button', { name: 'Changer', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Annuler' })).toBeVisible();

    // Real-data safety: never submit this form - it would change the shared
    // account's password and break every other test's login.
    await page.getByRole('button', { name: 'Annuler' }).click();
    await expect(page.getByRole('button', { name: 'Annuler' })).toHaveCount(0);

    // Guard: the existing .env credentials must still work after cancelling.
    // Wait for the logout redirect to fully settle first - navigating again
    // (inside login()) while it's still in flight aborts with net::ERR_ABORTED.
    await page.getByRole('button', { name: 'Se déconnecter' }).click();
    await page.waitForLoadState('load');
    await login(page);
  });
});
