import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login fails with invalid credentials and shows a specific error', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('tab', { name: 'E-mail' }).click();

    await page.getByRole('textbox', { name: 'Identifiant' }).fill('nonexistent-user@example.com');
    await page.getByRole('textbox', { name: 'Mot de passe' }).fill('WrongPassword123!');
    await page.getByRole('button', { name: 'Connexion' }).click();

    await expect(page.getByText('Identifiant ou mot de passe incorrect.')).toBeVisible();
    await expect(page).not.toHaveURL(/\/dashboard/);
  });
});
