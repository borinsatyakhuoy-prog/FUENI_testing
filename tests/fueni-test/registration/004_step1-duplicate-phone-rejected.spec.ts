import { test, expect } from '@playwright/test';
import { fillAdultDateOfBirth, selectListboxOption } from '../helpers/registration';
import { requirePhoneCredentials } from '../helpers/auth';

test.describe('Registration', () => {
  test('step 1 rejects a phone number that already belongs to another account', async ({ page }) => {
    const { nationalNumber } = requirePhoneCredentials();

    await page.goto('/fr/register');
    await page.waitForLoadState('networkidle');

    await page.getByRole('textbox', { name: 'Ex : Aïssatou' }).fill('QA');
    await page.getByRole('textbox', { name: 'Ex : Diop' }).fill('Automation');
    await fillAdultDateOfBirth(page);
    await selectListboxOption(page, page.getByRole('combobox').filter({ hasText: 'Choisir...' }), 'Féminin');
    await page
      .getByRole('textbox', { name: 'Ex : aissatou.diop@example.com' })
      .fill(`qa-automation+${Date.now()}@example.com`);
    // The shared patient account's own verified phone number - guaranteed to
    // already be registered, so this is a deterministic duplicate check that
    // doesn't depend on any prior test run leaving state behind.
    await page
      .getByRole('textbox', { name: 'Numéro de téléphone (partie nationale)' })
      .fill(nationalNumber);
    const passwordField = page.getByRole('textbox', { name: '••••••••••••' });
    await passwordField.click();
    await passwordField.pressSequentially('TestAutomation123!');
    await page.getByRole('checkbox', { name: /Conditions Générales/ }).check();
    await page.getByRole('checkbox', { name: /traite mes données personnelles et médicales/ }).check();

    await page.getByRole('button', { name: 'Créer mon compte' }).click();

    // Confirmed live: this duplicate check resolves via a lightweight
    // availability call, not the Turnstile-gated account-creation request -
    // no long wait needed here (unlike 002_step1-to-step2.spec.ts).
    await expect(page.getByText('Ce numéro de téléphone est déjà enregistré.')).toBeVisible();
    await expect(page.getByText('Étape 1 / 3')).toBeVisible();
  });
});
