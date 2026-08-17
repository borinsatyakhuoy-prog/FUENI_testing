import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('forgot password link starts the 3-step reset wizard', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Mot de passe oublié ?' }).click();

    await expect(page).toHaveURL(/\/password\/reset/);
    await expect(page.getByText('Étape 1 / 3')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Téléphone' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'E-mail' })).toBeVisible();

    // Gated by a Cloudflare Turnstile check - the button starts disabled and
    // enables once the check clears; don't assume it's immediately clickable.
    await expect(page.getByRole('button', { name: 'Envoyer le code' })).toBeEnabled({
      timeout: 60_000,
    });
  });
});
