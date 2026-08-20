import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('all sidebar links route to their documented destinations', { tag: '@smoke' }, async ({ page }) => {
    const routes: Array<[string, RegExp]> = [
      ['Tableau de bord', /\/dashboard/],
      ['Mes RDV', /\/appointments/],
      ['Prendre RDV', /\/book/],
      ['Mes documents', /\/documents/],
      ['Mon profil', /\/my-profile/],
      ['Connexion & Sécurité', /\/security/],
      ['FAQ', /\/faq/],
      ['Contacter le support', /\/support/],
    ];

    for (const [linkName, urlPattern] of routes) {
      await page.getByRole('link', { name: linkName, exact: true }).click();
      await expect(page).toHaveURL(urlPattern);
    }
  });
});
