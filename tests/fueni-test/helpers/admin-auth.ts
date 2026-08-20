import { Page, expect } from '@playwright/test';
import { loginTempMailAccount, waitForOtpCode } from './tempmail';

const FUENI_FROM_ADDRESS = 'noreply@fueni.com';

export function requireAdminCredentials() {
  const email = process.env.FUENI_ADMIN_EMAIL;
  const password = process.env.FUENI_ADMIN_PASSWORD;
  const tempMailPassword = process.env.FUENI_ADMIN_TEMPMAIL_PASSWORD;
  if (!email || !password || !tempMailPassword) {
    throw new Error(
      'FUENI_ADMIN_EMAIL, FUENI_ADMIN_PASSWORD, and FUENI_ADMIN_TEMPMAIL_PASSWORD must be set in a local .env file.'
    );
  }
  return { email, password, tempMailPassword };
}

/**
 * Logs the standing Super Admin account in, including the mandatory email-OTP step. Unlike the
 * doctor registration flow, admin login has no Turnstile challenge (confirmed live 2026-08-19/20)
 * and reuses one existing account rather than registering fresh ones, so repeated automated runs
 * don't risk the same anti-automation escalation documented for doctor registration.
 */
export async function loginAdmin(page: Page) {
  const { email, password, tempMailPassword } = requireAdminCredentials();

  await page.goto('/');
  await page.getByRole('textbox', { name: 'Email administrateur' }).fill(email);
  await page.getByRole('textbox', { name: 'Mot de passe' }).fill(password);
  await page.getByRole('button', { name: 'Connexion' }).click();

  await expect(page.getByRole('heading', { name: 'Vérification en deux étapes' })).toBeVisible();
  const token = await loginTempMailAccount(email, tempMailPassword);
  const code = await waitForOtpCode(token, FUENI_FROM_ADDRESS);
  await page.getByRole('textbox', { name: 'Code de vérification' }).fill(code);
  await page.getByRole('button', { name: 'Valider et accéder' }).click();

  await expect(page).toHaveURL(/\/fr$/);
}
