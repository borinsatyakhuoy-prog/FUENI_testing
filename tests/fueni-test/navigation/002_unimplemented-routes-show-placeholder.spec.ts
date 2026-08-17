import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  // Table-driven: all five routes render the identical generic placeholder as
  // of sprint SCRUM-10 (see specs/planner/07-future-features.md). Split into
  // per-feature specs once each route gets real content.
  const unimplementedRoutes = ['/fr/appointments', '/fr/book', '/fr/documents', '/fr/faq', '/fr/support'];

  for (const route of unimplementedRoutes) {
    test(`${route} shows the "coming soon" placeholder, not an error`, async ({ page }) => {
      await page.goto(route);
      await expect(page.getByRole('heading', { name: 'Bientôt disponible' })).toBeVisible();
      await expect(
        page.getByText('Cette fonctionnalité est en cours de développement. Revenez bientôt !')
      ).toBeVisible();
    });
  }
});
