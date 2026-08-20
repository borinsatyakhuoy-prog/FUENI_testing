import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('forgot password link starts the 3-step reset wizard', async ({ page }) => {
    // Blocked by the live Cloudflare Turnstile anti-automation control, which reliably
    // detects this Playwright session and never clears the check (confirmed not a timing
    // issue - see tickets/CLOUDFLARE-TURNSTILE-CI-testkey-request and Issue 3 in
    // test-results/Report.md). Not actionable from the test side; skip rather than fail
    // until a test-mode key/IP allowlist is provisioned for staging.
    test.skip(true, 'Blocked by Cloudflare Turnstile in CI - see tickets/CLOUDFLARE-TURNSTILE-CI-testkey-request');

    await page.goto('/login');
    await page.getByRole('link', { name: 'Mot de passe oublié ?' }).click();

    await expect(page).toHaveURL(/\/password\/reset/);
    await expect(page.getByText('Étape 1 / 3')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Téléphone' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'E-mail' })).toBeVisible();

    // Gated by a Cloudflare Turnstile check - the button starts disabled and
    // enables once the check clears; don't assume it's immediately clickable.
    // Known CI-reliability caveat: Turnstile was observed to stop clearing at
    // all (not just slowly) after several consecutive automated runs in a
    // short window - likely bot-detection escalation, not a timing issue a
    // longer wait can fix. See test-results/exploratory-findings.md.
    await expect(page.getByRole('button', { name: 'Envoyer le code' })).toBeEnabled({
      timeout: 120_000,
    });
  });
});
