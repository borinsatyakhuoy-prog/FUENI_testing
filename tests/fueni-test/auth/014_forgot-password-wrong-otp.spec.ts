import { test, expect } from '@playwright/test';
import { requireCredentials } from '../helpers/auth';

test.describe('Authentication', () => {
  test('forgot password - an incorrect OTP is rejected with a specific, attempt-counted error', async ({
    page,
  }) => {
    const { email } = requireCredentials();

    await page.goto('/fr/password/reset');
    await page.getByRole('tab', { name: 'E-mail' }).click();
    await page.getByRole('textbox', { name: 'Identifiant' }).fill(email);

    // Gated by Cloudflare Turnstile, same known CI-reliability caveat as
    // 004_forgot-password-wizard-start.spec.ts.
    const sendCode = page.getByRole('button', { name: 'Envoyer le code' });
    await expect(sendCode).toBeEnabled({ timeout: 120_000 });
    await sendCode.click();
    await expect(page.getByText('Étape 2 / 3')).toBeVisible();

    // A real OTP was just dispatched to the shared account's real inbox
    // (which this suite can't read), so any 6-digit code we type here is
    // guaranteed wrong - no need to actually know the real code to test
    // rejection of an incorrect one.
    await page.getByRole('textbox', { name: 'One-time passcode' }).fill('000000');
    await page.getByRole('button', { name: 'Vérifier' }).click();

    // Confirmed live: the API tracks remaining attempts and returns a
    // specific, non-generic error - not a silent failure or a full lockout
    // on the very first wrong guess. Deliberately submit only once: burning
    // further attempts risks locking this shared account out of password
    // reset entirely for later test runs.
    await expect(page.getByText(/Code incorrect\. Il vous reste \d tentative\(s\)\./)).toBeVisible();
    await expect(page).toHaveURL(/\/password\/reset/);
  });
});
