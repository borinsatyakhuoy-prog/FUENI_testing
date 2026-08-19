import { test, expect } from '@playwright/test';
import { fillAdultDateOfBirth, selectListboxOption } from '../helpers/registration';
import { requireCredentials } from '../helpers/auth';

test.describe('Registration', () => {
  test('step 1 rejects an e-mail address that already belongs to another account', async ({
    page,
  }) => {
    const { email } = requireCredentials();

    await page.goto('/fr/register');
    await page.waitForLoadState('networkidle');

    await page.getByRole('textbox', { name: 'Ex : Aïssatou' }).fill('QA');
    await page.getByRole('textbox', { name: 'Ex : Diop' }).fill('Automation');
    await fillAdultDateOfBirth(page);
    await selectListboxOption(page, page.getByRole('combobox').filter({ hasText: 'Choisir...' }), 'Féminin');
    // The shared patient account's own e-mail - guaranteed to already be
    // registered, so this is a deterministic duplicate check.
    await page.getByRole('textbox', { name: 'Ex : aissatou.diop@example.com' }).fill(email);
    await page
      .getByRole('textbox', { name: 'Numéro de téléphone (partie nationale)' })
      .fill(`9${String(Date.now()).slice(-7)}`);
    const passwordField = page.getByRole('textbox', { name: '••••••••••••' });
    await passwordField.click();
    await passwordField.pressSequentially('TestAutomation123!');
    await page.getByRole('checkbox', { name: /Conditions Générales/ }).check();
    await page.getByRole('checkbox', { name: /traite mes données personnelles et médicales/ }).check();

    await page.getByRole('button', { name: 'Créer mon compte' }).click();

    // Same lightweight availability check as
    // 004_step1-duplicate-phone-rejected.spec.ts - no Turnstile wait needed.
    await expect(page.getByText('Cette adresse e-mail est déjà enregistrée.')).toBeVisible();
    await expect(page.getByText('Étape 1 / 3')).toBeVisible();
  });
});
