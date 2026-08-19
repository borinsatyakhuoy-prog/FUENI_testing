import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('password show/hide toggle actually unmasks and re-masks the input', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('tab', { name: 'E-mail' }).click();

    const passwordInput = page.getByRole('textbox', { name: 'Mot de passe' });
    await passwordInput.fill('SomeSampleValue1');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    const toggle = page.getByRole('button', { name: 'Afficher/masquer le mot de passe' });
    await toggle.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    await toggle.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
