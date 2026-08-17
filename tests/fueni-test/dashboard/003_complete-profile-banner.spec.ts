import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('"Compléter mon profil" banner links to My Profile', async ({ page }) => {
    // The enclosing link's accessible name concatenates unrelated sibling
    // text (a "Quelques informations complémentaires..." status message),
    // which made a role-based name match unreliable - target the visible
    // text directly instead.
    await page.getByText('Compléter mon profil →').click();
    await expect(page).toHaveURL(/\/my-profile/);
  });
});
