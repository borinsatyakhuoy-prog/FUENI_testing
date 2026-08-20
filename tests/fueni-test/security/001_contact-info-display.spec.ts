import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Connexion & Sécurité', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/fr/security');
  });

  test('displays verified e-mail and phone', { tag: '@smoke' }, async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Coordonnées & connexion' })).toBeVisible();
    await expect(page.getByText('Adresse e-mail')).toBeVisible();
    await expect(page.getByText('Téléphone', { exact: true })).toBeVisible();
    await expect(page.getByText('Vérifié').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Modifier Adresse e-mail' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Modifier Téléphone' })).toBeVisible();
  });
});
