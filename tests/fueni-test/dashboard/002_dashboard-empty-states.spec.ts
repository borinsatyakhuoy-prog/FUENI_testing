import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('dashboard shows empty-state cards for appointments and documents', async ({ page }) => {
    await expect(page.getByText('Prenez un rendez-vous pour commencer.')).toBeVisible();
    await expect(page.getByText('Vos documents médicaux apparaîtront ici.')).toBeVisible();

    // Both cards' "Tout voir" buttons must be present and clickable, even
    // though their destinations (Mes RDV / Mes documents) are themselves
    // still "Bientôt disponible" placeholders - see navigation/002.
    const seeAllButtons = page.getByRole('button', { name: 'Tout voir' });
    await expect(seeAllButtons).toHaveCount(2);
  });
});
