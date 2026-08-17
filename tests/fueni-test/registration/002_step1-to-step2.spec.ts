import { test, expect } from '@playwright/test';
import { fillAdultDateOfBirth, selectListboxOption } from '../helpers/registration';

test.describe('Registration', () => {
  test('completing step 1 with a unique identity advances to step 2 (Profil de base)', async ({
    page,
  }) => {
    const uniqueSuffix = Date.now();

    await page.goto('/fr/register');

    await page.getByRole('textbox', { name: 'Ex : Aïssatou' }).fill('Test');
    await page.getByRole('textbox', { name: 'Ex : Diop' }).fill('Automation');
    await fillAdultDateOfBirth(page);
    await selectListboxOption(page, page.getByRole('combobox').filter({ hasText: 'Choisir...' }), 'Masculin');
    await page
      .getByRole('textbox', { name: 'Ex : aissatou.diop@example.com' })
      .fill(`qa-automation+${uniqueSuffix}@example.com`);
    await page
      .getByRole('textbox', { name: 'Numéro de téléphone (partie nationale)' })
      .fill(String(uniqueSuffix).slice(-8));

    const passwordField = page.getByRole('textbox', { name: '••••••••••••' });
    await passwordField.click();
    await passwordField.pressSequentially('TestAutomation123!');

    await page.getByRole('checkbox', { name: /Conditions Générales/ }).check();
    await page.getByRole('checkbox', { name: /traite mes données personnelles et médicales/ }).check();

    // Gated by a Cloudflare Turnstile check, same as the forgot-password wizard.
    const createAccount = page.getByRole('button', { name: 'Créer mon compte' });
    await expect(createAccount).toBeEnabled({ timeout: 60_000 });
    await createAccount.click();
    await expect(page.getByText('Étape 2 / 3')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Profil de base/ }).or(page.getByText('Profil de base'))).toBeVisible();

    // Régions/Villes cascade from the country - both must remain disabled
    // until "Pays de service" is chosen.
    await expect(page.getByRole('button', { name: 'Sélectionner ou ajouter…' }).first()).toBeDisabled();

    await selectListboxOption(
      page,
      page.getByRole('combobox', { name: 'Sélectionnez un pays…' }),
      'Bénin'
    );
    await selectListboxOption(
      page,
      page.getByRole('button', { name: 'Sélectionner ou ajouter…' }).first(),
      'Alibori'
    );
    await selectListboxOption(
      page,
      page.getByRole('button', { name: /Sélectionner ou ajouter…|Ajoutez la vôtre…/ }).nth(1),
      'Gogounou'
    );

    await page.getByRole('button', { name: 'Suivant' }).click();

    // Step 3 requires a real, receivable phone number - see 06-registration.md
    // §6.3. Confirm we reached it and stop here.
    await expect(page.getByText('Étape 3 / 3')).toBeVisible();
    await expect(page.getByText(/envoyé par SMS/)).toBeVisible();
  });
});
