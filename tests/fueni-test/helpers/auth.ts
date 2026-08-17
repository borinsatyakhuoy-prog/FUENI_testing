import { Page, expect } from '@playwright/test';

export function requireCredentials() {
  const email = process.env.FUENI_EMAIL;
  const password = process.env.FUENI_PASSWORD;
  if (!email || !password) {
    throw new Error(
      'FUENI_EMAIL and FUENI_PASSWORD must be set in a local .env file (see .env.example). Never hardcode real credentials in test source.'
    );
  }
  return { email, password };
}

/**
 * The login form defaults to the "Téléphone" tab, not "E-mail" - must switch
 * tabs explicitly before the email/password fields exist in the DOM.
 */
export async function login(page: Page) {
  const { email, password } = requireCredentials();
  await page.goto('/login');
  await page.getByRole('tab', { name: 'E-mail' }).click();
  await page.getByRole('textbox', { name: 'Identifiant' }).fill(email);
  await page.getByRole('textbox', { name: 'Mot de passe' }).fill(password);
  await page.getByRole('button', { name: 'Connexion' }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: 'Se déconnecter' }).click();
}
