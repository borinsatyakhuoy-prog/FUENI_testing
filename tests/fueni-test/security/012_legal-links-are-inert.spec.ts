import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Security page - legal document links', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/fr/security');
  });

  /**
   * Known issue (2026-08-20): "Politique de confidentialité" and "Conditions générales (CGU)"
   * under "Mon compte & mes données" are real buttons with no attached behavior - no dialog, no
   * navigation, no new tab, no network request, no console error. Third confirmed instance of
   * this "silently dead control" pattern in this app (after the notifications bell). This spec
   * documents the current (broken) state; it should start failing - and get rewritten to assert
   * real content - the moment these are wired up. See test-results/exploratory-findings.md
   * (Session 8) and defects/patient-security-page-legal-links-dead-buttons/README.md.
   */
  for (const label of ['Politique de confidentialité', 'Conditions générales (CGU)']) {
    test(`clicking "${label}" has no visible effect`, async ({ page }) => {
      const button = page.getByRole('button', { name: label, exact: true });
      await expect(button).toBeVisible();

      const pageErrors: string[] = [];
      page.on('pageerror', (e) => pageErrors.push(e.message));

      const urlBefore = page.url();
      await button.click();
      await page.waitForTimeout(500);

      expect(page.url()).toBe(urlBefore);
      await expect(page.getByRole('dialog')).toHaveCount(0);
      expect(pageErrors).toEqual([]);
    });
  }
});
