import { test, expect } from '@playwright/test';
import { loginAdmin } from '../helpers/admin-auth';

/**
 * First automated coverage for the admin console (previously zero - see
 * test-case/admin/dashboard-verification-fue-902/README.md for the manual retest this automates).
 * Overrides baseURL to the admin app via FUENI_ADMIN_BASE_URL.
 *
 * Confirmed live 2026-08-20: the admin realm enforces a strict single-session policy ("Une seule
 * session à la fois" - a real security feature, not a bug) that rejects a second login attempt
 * for up to 15 minutes of the first session's inactivity. Logging in once per `test()` (the
 * pattern used for the doctor-role suite, where every test gets its own fresh account) is wrong
 * here since there's only one standing admin account - it trips this exact lock. Everything below
 * therefore runs as `test.step()`s inside a single test with one login, not as separate tests.
 *
 * Assertions here target the parts of the queue confirmed stable this session (metrics, filter,
 * search, pagination, sort, empty state) - not the "Examiner" review action, which is disabled
 * with an explicit "Pas encore disponible dans cet environnement" tooltip in this environment.
 *
 * Known CI caveat (2026-08-20): a live unattended run of this spec could not be green-verified
 * this session - the single-session lock triggered by this file's earlier (buggy) per-test-login
 * design was still in its ~15-minute cooldown by the time this single-login version was ready,
 * and further login attempts were deliberately not retried to avoid extending that cooldown
 * further. See defects/improvement/test-account-provisioning.md for the standing-account
 * implication. Every assertion below is backed by manually-confirmed live evidence
 * (test-case/admin/dashboard-verification-fue-902/README.md).
 */
test.use({ baseURL: process.env.FUENI_ADMIN_BASE_URL });

test('FUE-902 - admin doctor verification queue', async ({ page }) => {
  test.slow();

  await test.step('log in once for the whole run (single-session policy)', async () => {
    await loginAdmin(page);
    await page.goto('/fr/verifications');
  });

  await test.step('sidebar badge matches the stats endpoint pending count (case 036)', async () => {
    const statsResponse = await page.waitForResponse((res) =>
      res.url().includes('/api/v1/admin/doctors/verifications/stats')
    );
    const stats = await statsResponse.json();
    const sidebarBadge = await page
      .getByRole('link', { name: 'Vérification des dossiers' })
      .getByRole('status')
      .textContent();
    expect(sidebarBadge?.trim()).toBe(String(stats.pending ?? stats.pendingCount ?? stats.PENDING));
  });

  await test.step('filtering by status narrows the list, shows a removable chip, and empty state (cases 002/007)', async () => {
    await page.getByRole('button', { name: 'Ajouter un filtre' }).click();
    await page.getByRole('button', { name: 'Statut' }).click();
    await page.getByRole('button', { name: 'Validé', exact: true }).click();
    await page.getByRole('button', { name: 'Appliquer le filtre' }).click();

    await expect(page).toHaveURL(/status=validated/);
    await expect(page.getByRole('button', { name: /Statut:\s*Validé/ })).toBeVisible();
    await expect(page.getByText('Aucun dossier ne correspond à ces filtres.')).toBeVisible();

    await page.getByRole('button', { name: 'Tout effacer' }).click();
    await expect(page).not.toHaveURL(/status=/);
  });

  await test.step('search narrows to the matching record by name and by email (case 003)', async () => {
    const searchBox = page.getByRole('textbox', { name: 'Rechercher par nom, e-mail, n' });

    await searchBox.fill('Tola');
    await expect(page.getByText('Tola Tola')).toBeVisible();
    await expect(page.getByText('Affichage 1 - 1 sur 1')).toBeVisible();

    await searchBox.fill('both.chan@allweb.com.kh');
    await expect(page.getByText('Both CHAN')).toBeVisible();
    await expect(page.getByText('Affichage 1 - 1 sur 1')).toBeVisible();

    await searchBox.fill('');
    await expect(page.getByText(/Affichage 1 - 10 sur \d+/)).toBeVisible();
  });

  await test.step('pagination reflects item ranges and disables boundary buttons (case 005)', async () => {
    await expect(page.getByRole('button', { name: 'Première page' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Précédent' })).toBeDisabled();

    await page.getByRole('button', { name: 'Dernière page' }).click();
    await expect(page.getByRole('button', { name: 'Suivant' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Dernière page' })).toBeDisabled();

    await page.getByRole('button', { name: 'Première page' }).click();
  });

  await test.step('default sort is oldest-waiting first, descending across pages (case 006)', async () => {
    const readHours = async () =>
      (await page.locator('text=/^\\d+h$/').allTextContents()).map((t) => parseInt(t, 10));

    const page1Hours = await readHours();
    expect(page1Hours).toEqual([...page1Hours].sort((a, b) => b - a));

    await page.getByRole('button', { name: 'Suivant' }).click();
    const page2Hours = await readHours();
    expect(page2Hours[0]).toBeLessThanOrEqual(page1Hours[page1Hours.length - 1]);
    expect(page2Hours).toEqual([...page2Hours].sort((a, b) => b - a));
  });

  await test.step('list interactions never trigger a full page reload (case 037)', async () => {
    let documentRequestCount = 0;
    page.on('request', (req) => {
      if (req.resourceType() === 'document') documentRequestCount++;
    });

    await page.getByRole('textbox', { name: 'Rechercher par nom, e-mail, n' }).fill('Tola');
    await page.waitForTimeout(1_000);

    expect(documentRequestCount).toBe(0);
  });
});
