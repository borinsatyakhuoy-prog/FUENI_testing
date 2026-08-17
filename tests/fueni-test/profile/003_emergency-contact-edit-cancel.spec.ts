import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Mon profil', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/fr/my-profile');
  });

  test('Contact d\'urgence - Modifier opens an edit form that can be cancelled without saving', async ({
    page,
  }) => {
    // "Contact d'urgence" is the second of the two bare-"Modifier" buttons on
    // this page (Localisation & langue is the first) - see 002 and
    // specs/planner/04-profile.md.
    await page.getByRole('button', { name: 'Modifier' }).nth(1).click();
    await expect(page.getByRole('button', { name: 'Annuler' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enregistrer' })).toBeVisible();

    // Real-data safety: never click Enregistrer against the shared account.
    await page.getByRole('button', { name: 'Annuler' }).click();
    await expect(page.getByRole('button', { name: 'Annuler' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Modifier' }).nth(1)).toBeVisible();
  });
});
