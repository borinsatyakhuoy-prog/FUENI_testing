import { test, expect } from '@playwright/test';
import { fillAdultDateOfBirth, selectListboxOption } from '../helpers/registration';

test.describe('Registration', () => {
  test('completing step 1 with a unique identity advances to step 2 (Profil de base)', async ({
    page,
  }) => {
    const uniqueSuffix = Date.now();

    await page.goto('/fr/register');
    // Confirmed live: filling the very first field (Prénom) too early - before
    // this SPA finishes hydrating - can silently no-op (see 001_step1-validation.spec.ts).
    await page.waitForLoadState('networkidle');

    await page.getByRole('textbox', { name: 'Ex : Aïssatou' }).fill('Test');
    await page.getByRole('textbox', { name: 'Ex : Diop' }).fill('Automation');
    await fillAdultDateOfBirth(page);
    await selectListboxOption(page, page.getByRole('combobox').filter({ hasText: 'Choisir...' }), 'Masculin');
    await page
      .getByRole('textbox', { name: 'Ex : aissatou.diop@example.com' })
      .fill(`qa-automation+${uniqueSuffix}@example.com`);
    // Leading digit matters: Cambodian mobile numbers (+855) must start with
    // a valid mobile prefix - a fully random 8-digit string (e.g. starting
    // with 4) was rejected live with a generic "certains champs sont
    // invalides" error. Force a "9..." prefix, confirmed valid during
    // exploratory testing, and vary only the trailing digits for uniqueness.
    await page
      .getByRole('textbox', { name: 'Numéro de téléphone (partie nationale)' })
      .fill(`9${String(uniqueSuffix).slice(-7)}`);

    const passwordField = page.getByRole('textbox', { name: '••••••••••••' });
    await passwordField.click();
    await passwordField.pressSequentially('TestAutomation123!');

    await page.getByRole('checkbox', { name: /Conditions Générales/ }).check();
    await page.getByRole('checkbox', { name: /traite mes données personnelles et médicales/ }).check();

    // Gated by a Cloudflare Turnstile check, same as the forgot-password wizard.
    const createAccount = page.getByRole('button', { name: 'Créer mon compte' });
    await expect(createAccount).toBeEnabled({ timeout: 120_000 });
    await createAccount.click();
    // "Étape 2 / 3" alone is already an unambiguous confirmation of which
    // step we're on - a follow-up check against "Profil de base" text was
    // dropped: it labels three separate elements on this step, and was also
    // observed briefly "hidden" during the step-transition animation,
    // making it a redundant and flakier version of the same assertion.
    await expect(page.getByText('Étape 2 / 3')).toBeVisible();

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
    // §6.3. Confirm we reached it and stop here. It runs its own brief
    // Cloudflare-style security check first ("Veuillez compléter le contrôle
    // de sécurité pour recevoir votre code.") before showing the "code sent"
    // message - same known CI-reliability caveat as auth/004 and auth/008
    // (see test-results/exploratory-findings.md): this cleared quickly in
    // isolation but stopped clearing at all after several consecutive
    // automated runs in a short window.
    await expect(page.getByText('Étape 3 / 3')).toBeVisible();
    await expect(page.getByText(/envoyé par SMS/)).toBeVisible({ timeout: 30_000 });
  });
});
