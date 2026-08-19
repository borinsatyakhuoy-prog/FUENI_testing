import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Authentication', () => {
  test('browser back button after logout does not reveal cached protected content', async ({
    page,
  }) => {
    await login(page);
    await page.goto('/fr/security');
    await expect(page.getByRole('heading', { name: 'Connexion & Sécurité' })).toBeVisible();

    await page.getByRole('button', { name: 'Se déconnecter' }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });

    await page.goBack();

    // Confirmed live 2026-08-18: going back re-issues a fresh Keycloak auth
    // challenge rather than restoring the bfcache'd security page - the
    // session is really gone, not just navigated away from.
    await expect(page.getByRole('heading', { name: 'Connexion & Sécurité' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Connexion' })).toBeVisible({ timeout: 15_000 });
  });
});
