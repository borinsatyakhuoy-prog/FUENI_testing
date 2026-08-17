import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('sign out is reachable from every main destination', async ({ page }) => {
    for (const route of ['/fr/dashboard', '/fr/my-profile', '/fr/security']) {
      await page.goto(route);
      await expect(page.getByRole('button', { name: 'Se déconnecter' })).toBeVisible();
    }
  });
});
