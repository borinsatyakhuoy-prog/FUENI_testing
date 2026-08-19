import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Mon profil', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/fr/my-profile');
  });

  test('Contact d\'urgence - cancelling after typing a change leaves the original phone number intact', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Modifier' }).nth(1).click();
    const phoneField = page.getByRole('textbox', { name: 'Numéro de téléphone (partie nationale)' });
    const originalValue = await phoneField.inputValue();

    // Same "does Annuler really discard, not just hide" check as
    // 006_location-cancel-discards-edits.spec.ts, on the other edit dialog.
    await phoneField.fill('12');
    await page.getByRole('button', { name: 'Annuler' }).click();
    await expect(page.getByRole('button', { name: 'Annuler' })).toHaveCount(0);

    await page.getByRole('button', { name: 'Modifier' }).nth(1).click();
    await expect(
      page.getByRole('textbox', { name: 'Numéro de téléphone (partie nationale)' })
    ).toHaveValue(originalValue);
    await page.getByRole('button', { name: 'Annuler' }).click();
  });
});
