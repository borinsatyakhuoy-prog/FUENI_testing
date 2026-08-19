import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

const PREFS_ENDPOINT = '/api/v1/patients/me/notification-preferences';

test.describe('Mon profil', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/fr/my-profile');
  });

  /**
   * Resolves the previously-deferred question from test-results/Report.md
   * ("no safe way to revert confirmed yet"): confirmed live 2026-08-18 that
   * toggling this switch is a real PUT to a persisted endpoint (survives a
   * reload) and that toggling it back is a true, safe revert - so this can
   * now be a real interaction test instead of display-only (see
   * profile/004_notification-preferences-display.spec.ts).
   */
  test('SMS appointment-reminder toggle is a real, persisted, and safely revertible mutation', async ({
    page,
  }) => {
    const smsSwitch = page.getByRole('switch', { name: 'Rappels de rendez-vous par SMS' });
    await expect(smsSwitch).toBeChecked();

    try {
      const [putResponse] = await Promise.all([
        page.waitForResponse(
          (res) => res.url().includes(PREFS_ENDPOINT) && res.request().method() === 'PUT'
        ),
        smsSwitch.click(),
      ]);
      expect(putResponse.ok()).toBeTruthy();
      await expect(smsSwitch).not.toBeChecked();

      // Confirm it's a real, persisted mutation, not just local UI state.
      await page.reload();
      await expect(
        page.getByRole('switch', { name: 'Rappels de rendez-vous par SMS' })
      ).not.toBeChecked();
    } finally {
      // Revert unconditionally, even on assertion failure above, so the
      // shared account's real state is never left mutated by this test.
      const currentSwitch = page.getByRole('switch', { name: 'Rappels de rendez-vous par SMS' });
      if (!(await currentSwitch.isChecked())) {
        await Promise.all([
          page.waitForResponse(
            (res) => res.url().includes(PREFS_ENDPOINT) && res.request().method() === 'PUT'
          ),
          currentSwitch.click(),
        ]);
      }
      await expect(
        page.getByRole('switch', { name: 'Rappels de rendez-vous par SMS' })
      ).toBeChecked();
    }
  });
});
