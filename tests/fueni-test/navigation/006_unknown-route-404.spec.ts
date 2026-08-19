import { test, expect } from '@playwright/test';

test.describe('Sidebar Navigation', () => {
  test('an unknown route returns a real 404 instead of crashing', async ({ page }) => {
    const response = await page.goto('/fr/this-route-does-not-exist-xyz123');
    expect(response?.status()).toBe(404);
    await expect(page.getByText('404', { exact: true })).toBeVisible();
  });
});
