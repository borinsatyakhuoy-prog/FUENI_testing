import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Mon profil', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/fr/my-profile');
  });

  test('notification preference switches reflect their current state', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Préférences de notification' })).toBeVisible();

    // Display-only: toggling these mutates real shared-account state, so this
    // test asserts the current state rather than clicking the switches.
    await expect(
      page.getByRole('switch', { name: 'Rappels de rendez-vous par SMS' })
    ).toBeChecked();
    await expect(
      page.getByRole('switch', { name: 'Rappels de rendez-vous par e-mail' })
    ).toBeChecked();
  });
});
