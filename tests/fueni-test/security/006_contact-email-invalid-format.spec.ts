import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Connexion & Sécurité', () => {
  test('Modifier (e-mail) rejects a malformed address before any re-auth/save step', async ({
    page,
  }) => {
    await login(page);
    await page.goto('/fr/security');

    await page.getByRole('button', { name: 'Modifier Adresse e-mail' }).click();
    await page.getByRole('textbox').first().fill('not-an-email');
    await page.getByRole('button', { name: 'Enregistrer' }).click();

    // Confirmed live: caught by client-side format validation - the app
    // never gets as far as the "confirm your current password" step this
    // page's own copy warns about, so this is safe to actually submit.
    await expect(page.getByText('Saisissez une adresse e-mail valide.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Annuler' })).toBeVisible(); // still in edit mode

    // Real-data safety: cancel rather than risk any further state.
    await page.getByRole('button', { name: 'Annuler' }).click();
    await expect(page.getByRole('button', { name: 'Modifier Adresse e-mail' })).toBeVisible();
  });
});
