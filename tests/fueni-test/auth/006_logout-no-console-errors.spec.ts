import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Authentication', () => {
  test('logout produces no console/page errors', async ({ page }) => {
    await login(page);

    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.getByRole('button', { name: 'Se déconnecter' }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });

    // Known issue (2026-08-17, test-results/exploratory-findings.md Issue 1): a
    // CORS-blocked fetch for a Next.js RSC payload fires during the post-logout
    // redirect before the app falls back to full navigation. The end-user flow
    // isn't broken (login page still loads above), but this currently fails -
    // kept as a live regression check rather than skipped, so it starts passing
    // the moment the underlying issue is fixed.
    expect(errors, `Console/page errors during logout:\n${errors.join('\n')}`).toEqual([]);
  });
});
