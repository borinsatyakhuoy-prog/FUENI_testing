import { test, expect } from '@playwright/test';
import { requireCredentials } from '../helpers/auth';

test.describe('Authentication', () => {
  test('successful login with valid credentials redirects to dashboard', async ({ page }) => {
    const { email, password } = requireCredentials();

    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Bon retour' })).toBeVisible();

    await page.getByRole('tab', { name: 'E-mail' }).click();
    await page.getByRole('textbox', { name: 'Identifiant' }).fill(email);
    await page.getByRole('textbox', { name: 'Mot de passe' }).fill(password);
    await page.getByRole('button', { name: 'Connexion' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /^Bonjour/ })).toBeVisible();
  });
});
