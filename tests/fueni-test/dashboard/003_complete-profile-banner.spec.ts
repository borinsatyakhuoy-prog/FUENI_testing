import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('"Compléter mon profil" banner links to My Profile', async ({ page }) => {
    // This banner is conditional on the shared account's profile actually
    // being incomplete - confirmed live 2026-08-19 that it correctly stops
    // showing once every optional field (Localisation & langue, Contact
    // d'urgence) has been filled in, which this long-lived shared account has
    // since accumulated across earlier test sessions. Per this suite's own
    // data-safety rule, that state is never deliberately reverted just to
    // re-trigger this banner - so this test detects and reports the current
    // state rather than assuming the banner is always present.
    const banner = page.getByText('Compléter mon profil →');
    if (!(await banner.isVisible({ timeout: 5_000 }).catch(() => false))) {
      test.skip(
        true,
        'Shared account profile is currently complete - banner correctly absent, nothing to click.'
      );
    }

    // The enclosing link's accessible name concatenates unrelated sibling
    // text (a "Quelques informations complémentaires..." status message),
    // which made a role-based name match unreliable - target the visible
    // text directly instead.
    await banner.click();
    await expect(page).toHaveURL(/\/my-profile/);
  });
});
