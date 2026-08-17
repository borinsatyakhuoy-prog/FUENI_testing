import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login form defaults to the Téléphone tab', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('tab', { name: 'Téléphone', selected: true })).toBeVisible();
    await expect(page.getByRole('combobox', { name: /Pays/ })).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: 'Numéro de téléphone (partie nationale)' })
    ).toBeVisible();

    await page.getByRole('tab', { name: 'E-mail' }).click();
    await expect(page.getByRole('textbox', { name: 'Identifiant' })).toBeVisible();
  });
});
