import { test, expect } from '@playwright/test';

test.describe('Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fr/register');
  });

  test('step 1 shows all required fields and a live password-strength check', async ({ page }) => {
    await expect(page.getByText('Étape 1 / 3')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Ex : Aïssatou' })).toBeVisible(); // Prénom
    await expect(page.getByRole('textbox', { name: 'Ex : Diop' })).toBeVisible(); // Nom
    await expect(page.getByRole('button', { name: 'Sélectionner votre date de naissance' })).toBeVisible();
    await expect(page.getByText('Vous devez avoir 18 ans ou plus')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Ex : aissatou.diop@example.com' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: /Conditions Générales/ })).toBeVisible();
    await expect(
      page.getByRole('checkbox', { name: /traite mes données personnelles et médicales/ })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Créer mon compte' })).toBeVisible();
  });

  test('weak password shows "Faible", strong password shows "Très fort"', async ({ page }) => {
    const passwordField = page.getByRole('textbox', { name: '••••••••••••' });
    await passwordField.click();
    await passwordField.pressSequentially('abc');
    await expect(page.getByRole('progressbar', { name: 'Faible' })).toBeVisible();

    await passwordField.fill('');
    await passwordField.pressSequentially('TestAutomation123!');
    await expect(page.getByRole('progressbar', { name: 'Très fort' })).toBeVisible();
  });

  test('submitting without checking either consent box does not advance past step 1', async ({
    page,
  }) => {
    await page.getByRole('textbox', { name: 'Ex : Aïssatou' }).fill('Test');
    await page.getByRole('textbox', { name: 'Ex : Diop' }).fill('Automation');
    await page
      .getByRole('textbox', { name: 'Ex : aissatou.diop@example.com' })
      .fill(`qa-automation+${Date.now()}@example.com`);
    await page
      .getByRole('textbox', { name: 'Numéro de téléphone (partie nationale)' })
      .fill(String(Date.now()).slice(-8));
    const passwordField = page.getByRole('textbox', { name: '••••••••••••' });
    await passwordField.click();
    await passwordField.pressSequentially('TestAutomation123!');

    await page.getByRole('button', { name: 'Créer mon compte' }).click();

    // Both consent checkboxes are marked required (`*`) and left unchecked -
    // the wizard must not advance to step 2.
    await expect(page.getByText('Étape 1 / 3')).toBeVisible();
  });
});
