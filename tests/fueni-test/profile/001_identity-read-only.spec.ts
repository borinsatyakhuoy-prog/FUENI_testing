import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Mon profil', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/fr/my-profile');
  });

  test('Identité section is read-only and routes corrections to support', { tag: '@smoke' }, async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Identité' })).toBeVisible();
    await expect(page.getByText('Prénom')).toBeVisible();
    // "Nom" also labels a field in the separate Contact d'urgence section
    // further down the page - Identité's copy renders first in the DOM.
    await expect(page.getByText('Nom', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Date de naissance')).toBeVisible();
    await expect(page.getByText('Sexe à la naissance')).toBeVisible();

    const supportLink = page.getByRole('link', { name: 'support@fueni.com' });
    await expect(supportLink).toHaveAttribute(
      'href',
      /^mailto:support@fueni\.com\?subject=Correction/
    );
  });
});
