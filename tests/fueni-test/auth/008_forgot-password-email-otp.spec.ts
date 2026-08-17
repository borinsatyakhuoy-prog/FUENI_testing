import { test, expect } from '@playwright/test';
import { requireCredentials } from '../helpers/auth';

test.describe('Authentication', () => {
  test('forgot password - E-mail method dispatches a real OTP', async ({ page }) => {
    const { email } = requireCredentials();

    await page.goto('/fr/password/reset');
    await page.getByRole('tab', { name: 'E-mail' }).click();
    await page.getByRole('textbox', { name: 'Identifiant' }).fill(email);

    // Gated by Cloudflare Turnstile, same as 004_forgot-password-wizard-start
    // (including that file's known CI-reliability caveat).
    const sendCode = page.getByRole('button', { name: 'Envoyer le code' });
    await expect(sendCode).toBeEnabled({ timeout: 120_000 });
    await sendCode.click();

    // Confirms the e-mail OTP channel genuinely works (not a dead end) -
    // don't go further: this suite has no way to read the shared account's
    // real inbox, and this test must never actually change its password.
    await expect(page.getByText('Étape 2 / 3')).toBeVisible();
    await expect(
      page.getByText(/un code à 6 chiffres a été envoyé à/)
    ).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'One-time passcode' })).toBeVisible();
  });
});
