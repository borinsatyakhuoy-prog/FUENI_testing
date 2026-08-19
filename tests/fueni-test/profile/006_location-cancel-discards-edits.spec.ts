import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Mon profil', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/fr/my-profile');
  });

  test('Localisation & langue - cancelling after typing a change leaves the original value intact', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Modifier' }).first().click();
    const addressField = page.getByRole('textbox', { name: 'Ex : Sacré-Cœur 3, Villa 12...' });
    const originalValue = await addressField.inputValue();

    // Beyond 002_location-edit-cancel.spec.ts (which only checks the dialog
    // closes): confirm Annuler actually discards the typed change rather than
    // just hiding the form with the edit still cached client-side.
    await addressField.fill('Changed By Automated Test - should never persist');
    await page.getByRole('button', { name: 'Annuler' }).click();
    await expect(page.getByRole('button', { name: 'Annuler' })).toHaveCount(0);

    // Reopen and verify the displayed value is the original, not the typed one.
    await page.getByRole('button', { name: 'Modifier' }).first().click();
    await expect(page.getByRole('textbox', { name: 'Ex : Sacré-Cœur 3, Villa 12...' })).toHaveValue(
      originalValue
    );
    await page.getByRole('button', { name: 'Annuler' }).click();
  });
});
