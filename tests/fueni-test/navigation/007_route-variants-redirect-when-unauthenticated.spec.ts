import { test, expect } from '@playwright/test';

test.describe('Sidebar Navigation', () => {
  // Extends 004_direct-url-protected-routes-redirect.spec.ts's bare-path
  // coverage to two common URL variants a real user (or a bookmarked/shared
  // link) might hit - a trailing slash, and extra query params.

  test('a protected route with a trailing slash still redirects to login when logged out', async ({
    page,
  }) => {
    await page.goto('/fr/dashboard/');
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
  });

  test('a protected route with query params still redirects to login when logged out', async ({
    page,
  }) => {
    await page.goto('/fr/my-profile?foo=bar&x=1');
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
  });
});
