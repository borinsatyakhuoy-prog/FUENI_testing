import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('dashboard shows a personalized greeting and booking CTA', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /^Bonjour/ })).toBeVisible();
    await expect(page.getByText('Pour votre santé, le maximum sera fait.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Prendre un RDV' })).toBeVisible();
  });
});
