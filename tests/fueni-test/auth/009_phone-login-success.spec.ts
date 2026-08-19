import { test, expect } from '@playwright/test';
import { requirePhoneCredentials } from '../helpers/auth';

test.describe('Authentication', () => {
  test('phone tab login succeeds with valid phone number and password', async ({ page }) => {
    const { nationalNumber, password } = requirePhoneCredentials();

    await page.goto('/login');
    // "Téléphone" is the default tab (see 007) - no tab switch needed.
    await page
      .getByRole('textbox', { name: 'Numéro de téléphone (partie nationale)' })
      .fill(nationalNumber);
    await page.getByRole('textbox', { name: 'Mot de passe' }).fill(password);
    await page.getByRole('button', { name: 'Connexion' }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: /Bonjour/ })).toBeVisible();
  });
});
