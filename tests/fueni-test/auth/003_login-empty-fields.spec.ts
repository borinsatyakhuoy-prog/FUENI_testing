import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('submitting the login form empty shows one combined required-field alert', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('tab', { name: 'E-mail' }).click();

    await page.getByRole('button', { name: 'Connexion' }).click();

    await expect(
      page.getByText('Veuillez saisir votre identifiant et votre mot de passe.')
    ).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});
