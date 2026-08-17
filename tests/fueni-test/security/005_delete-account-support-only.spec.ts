import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Connexion & Sécurité', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/fr/security');
  });

  test('account deletion is support-mediated only, with no in-app delete flow', async ({ page }) => {
    await expect(page.getByText('Supprimer mon compte')).toBeVisible();

    const supportLink = page.getByRole('link', { name: 'support@fueni.com' });
    await expect(supportLink).toHaveAttribute(
      'href',
      /^mailto:support@fueni\.com\?subject=Suppression/
    );

    // No self-service delete button should exist yet.
    await expect(
      page.getByRole('button', { name: /^Supprimer mon compte$/ })
    ).toHaveCount(0);
  });
});
