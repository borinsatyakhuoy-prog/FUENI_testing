import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login with a too-short phone number shows a format-specific error', async ({ page }) => {
    await page.goto('/login');
    // Téléphone is already the default tab (see 007_login-defaults-to-phone-tab.spec.ts).

    await page
      .getByRole('textbox', { name: 'Numéro de téléphone (partie' })
      .fill('123');
    await page.getByRole('textbox', { name: 'Mot de passe' }).fill('SomePassword123!');
    await page.getByRole('button', { name: 'Connexion' }).click();

    await expect(page.getByText('Numéro de téléphone invalide.')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});
