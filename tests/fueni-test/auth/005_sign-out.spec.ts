import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Authentication', () => {
  test('signing out ends the session and protected routes redirect back to login', async ({
    page,
  }) => {
    await login(page);

    await page.getByRole('button', { name: 'Se déconnecter' }).click();
    // The logout redirect involves a CORS-blocked fetch that falls back to a
    // full navigation (see Issue 1, test-results/exploratory-findings.md),
    // which takes longer than the default 5s assertion timeout.
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });

    // Confirm the session is really gone, not just the UI navigating away.
    await page.goto('/fr/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
