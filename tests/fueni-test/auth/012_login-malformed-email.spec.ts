import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login with a malformed e-mail shows a format-specific error, not the generic credentials one', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByRole('tab', { name: 'E-mail' }).click();

    await page.getByRole('textbox', { name: 'Identifiant' }).fill('not-an-email');
    await page.getByRole('textbox', { name: 'Mot de passe' }).fill('SomePassword123!');
    await page.getByRole('button', { name: 'Connexion' }).click();

    // Distinct from 002_login-invalid-credentials.spec.ts's "Identifiant ou mot
    // de passe incorrect." - this is caught client-side as a format error
    // before any credentials check happens.
    await expect(page.getByText('Adresse e-mail invalide.')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});
