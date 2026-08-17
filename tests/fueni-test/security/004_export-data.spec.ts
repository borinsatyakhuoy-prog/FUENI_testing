import { test, expect } from '@playwright/test';
import { login, requireCredentials } from '../helpers/auth';

test.describe('Connexion & Sécurité', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/fr/security');
  });

  test('Exporter mes données downloads a valid JSON file (read-only, safe to run for real)', async ({
    page,
  }) => {
    const { password } = requireCredentials();

    await page.getByRole('button', { name: 'Exporter mes données' }).click();

    // Confirmed live: this action is gated by a "Confirmez votre identité"
    // re-auth dialog (current password required) before the export actually
    // triggers - not documented in the original exploratory pass.
    await expect(page.getByRole('heading', { name: 'Confirmez votre identité' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Mot de passe' }).fill(password);
    const continueButton = page.getByRole('button', { name: 'Continuer' });
    await expect(continueButton).toBeEnabled();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      continueButton.click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/\.json$/i);

    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream!) chunks.push(chunk as Buffer);
    const contents = Buffer.concat(chunks).toString('utf-8');

    expect(() => JSON.parse(contents)).not.toThrow();
  });
});
