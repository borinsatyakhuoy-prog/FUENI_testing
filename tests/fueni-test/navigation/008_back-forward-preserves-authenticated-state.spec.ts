import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Sidebar Navigation', () => {
  test('browser back/forward across authenticated pages renders the correct content each time, not stale or broken state', async ({
    page,
  }) => {
    await login(page);
    await page.goto('/fr/my-profile');
    await page.goto('/fr/security');

    // Distinct from 010_back-button-after-logout.spec.ts (auth folder), which
    // checks back-after-logout re-triggers a Keycloak challenge. This checks
    // the ordinary case: navigating back and forward while still logged in
    // should just render each page normally, not error, blank, or bounce to
    // login.
    await page.goBack();
    await expect(page).toHaveURL(/\/my-profile/);
    await expect(page.getByRole('heading', { name: 'Mon profil', level: 1 })).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goForward();
    await expect(page).toHaveURL(/\/my-profile/);
    await expect(page.getByRole('heading', { name: 'Mon profil', level: 1 })).toBeVisible();

    await page.goForward();
    await expect(page).toHaveURL(/\/security/);
    await expect(page.getByRole('heading', { name: 'Connexion & Sécurité', level: 1 })).toBeVisible();
  });
});
