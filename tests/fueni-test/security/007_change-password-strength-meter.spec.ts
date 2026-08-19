import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Connexion & Sécurité', () => {
  test('Changer (password) shows the same live strength meter as registration', async ({
    page,
  }) => {
    await login(page);
    await page.goto('/fr/security');

    await page.getByRole('button', { name: 'Changer', exact: true }).click();
    const newPasswordField = page.getByRole('textbox', { name: 'Nouveau mot de passe' });

    await newPasswordField.click();
    await newPasswordField.pressSequentially('abc');
    await expect(page.getByRole('progressbar', { name: 'Faible' })).toBeVisible();

    await newPasswordField.fill('');
    await newPasswordField.pressSequentially('TestAutomation123!');
    await expect(page.getByRole('progressbar', { name: 'Très fort' })).toBeVisible();

    // Real-data safety: never submit - "Mot de passe actuel" is deliberately
    // left blank throughout, so this never risks changing the shared
    // account's real password.
    await page.getByRole('button', { name: 'Annuler' }).click();
  });

  test('Changer (password) keeps Enregistrer disabled until the current password is entered, regardless of new-password strength', async ({
    page,
  }) => {
    await login(page);
    await page.goto('/fr/security');

    await page.getByRole('button', { name: 'Changer', exact: true }).click();
    const newPasswordField = page.getByRole('textbox', { name: 'Nouveau mot de passe' });
    await newPasswordField.click();
    await newPasswordField.pressSequentially('TestAutomation123!');
    await expect(page.getByRole('progressbar', { name: 'Très fort' })).toBeVisible();

    // "Mot de passe actuel" is left empty on purpose - confirms the button
    // stays disabled on that basis alone, independent of the new password's
    // own validity. Never fill it in: that's the field that actually gates
    // the real write.
    await expect(page.getByRole('button', { name: 'Enregistrer' })).toBeDisabled();

    await page.getByRole('button', { name: 'Annuler' }).click();
  });
});
