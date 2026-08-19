import { test, expect } from '@playwright/test';

test.describe('Sidebar Navigation', () => {
  // Each test gets a fresh, unauthenticated browser context by default - no
  // explicit logout needed. auth/005 already covers /fr/dashboard after an
  // explicit logout; this extends direct-URL-while-logged-out coverage to
  // the other MON COMPTE protected routes.
  const protectedRoutes = ['/fr/dashboard', '/fr/my-profile', '/fr/security'];

  for (const route of protectedRoutes) {
    test(`${route} redirects to login when not authenticated`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
    });
  }
});
