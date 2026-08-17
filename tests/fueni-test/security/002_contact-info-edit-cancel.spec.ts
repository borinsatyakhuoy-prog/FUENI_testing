import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Connexion & Sécurité', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/fr/security');
  });

  test('Modifier (e-mail) opens an inline edit form that can be cancelled', async ({ page }) => {
    // Confirmed live: this swaps the section into edit mode in place, with
    // Annuler/Enregistrer buttons - not a modal <dialog>, same pattern as
    // Mon profil's "Localisation & langue"/"Contact d'urgence" sections.
    await page.getByRole('button', { name: 'Modifier Adresse e-mail' }).click();
    await expect(page.getByRole('button', { name: 'Annuler' })).toBeVisible();
    const enregistrer = page.getByRole('button', { name: 'Enregistrer' });
    await expect(enregistrer).toBeVisible();
    await expect(enregistrer).toBeDisabled(); // unchanged input - nothing to save yet

    await page.getByRole('button', { name: 'Annuler' }).click();
    await expect(page.getByRole('button', { name: 'Annuler' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Modifier Adresse e-mail' })).toBeVisible();
  });

  test('Modifier (téléphone) opens an inline edit form that can be cancelled', async ({ page }) => {
    await page.getByRole('button', { name: 'Modifier Téléphone' }).click();
    await expect(page.getByRole('button', { name: 'Annuler' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enregistrer' })).toBeVisible();

    await page.getByRole('button', { name: 'Annuler' }).click();
    await expect(page.getByRole('button', { name: 'Annuler' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Modifier Téléphone' })).toBeVisible();
  });
});
