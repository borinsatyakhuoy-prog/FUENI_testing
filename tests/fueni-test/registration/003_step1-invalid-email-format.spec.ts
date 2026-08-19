import { test, expect } from '@playwright/test';
import { fillAdultDateOfBirth, selectListboxOption } from '../helpers/registration';

test.describe('Registration', () => {
  test('step 1 rejects a malformed e-mail with a format-specific error', async ({ page }) => {
    await page.goto('/fr/register');
    await page.waitForLoadState('networkidle');

    await page.getByRole('textbox', { name: 'Ex : Aïssatou' }).fill('QA');
    await page.getByRole('textbox', { name: 'Ex : Diop' }).fill('Automation');
    await fillAdultDateOfBirth(page);
    await selectListboxOption(page, page.getByRole('combobox').filter({ hasText: 'Choisir...' }), 'Féminin');
    await page.getByRole('textbox', { name: 'Ex : aissatou.diop@example.com' }).fill('not-an-email');
    await page
      .getByRole('textbox', { name: 'Numéro de téléphone (partie nationale)' })
      .fill(`9${String(Date.now()).slice(-7)}`);
    const passwordField = page.getByRole('textbox', { name: '••••••••••••' });
    await passwordField.click();
    await passwordField.pressSequentially('TestAutomation123!');
    await page.getByRole('checkbox', { name: /Conditions Générales/ }).check();
    await page.getByRole('checkbox', { name: /traite mes données personnelles et médicales/ }).check();

    await page.getByRole('button', { name: 'Créer mon compte' }).click();

    // Same client-side format check as the login form (see
    // auth/012_login-malformed-email.spec.ts) - caught before any network
    // call, so no Turnstile wait needed here.
    await expect(page.getByText('Adresse e-mail invalide.')).toBeVisible();
    await expect(page.getByText('Étape 1 / 3')).toBeVisible();
  });
});
