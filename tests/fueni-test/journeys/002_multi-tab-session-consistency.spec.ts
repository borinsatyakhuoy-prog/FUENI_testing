import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

const PREFS_ENDPOINT = '/api/v1/patients/me/notification-preferences';

/**
 * A different kind of long scenario than journeys/001: instead of one page carrying a long
 * sequence of actions, this opens a second tab in the *same* authenticated browser context (real
 * users routinely have the app open in two tabs) and checks that a real, server-persisted
 * mutation made in one tab is visible from the other after a reload - not just held in one tab's
 * local UI state. No existing spec checks cross-tab consistency; profile/005 only ever checks a
 * single page reloading itself.
 *
 * Improvement note: none needed - this is a clean, low-risk pattern (real mutation, reverted at
 * the end) worth reusing for other server-persisted toggles as they're found.
 */
test.describe('Long session - multi-tab consistency', () => {
  test('a real, persisted mutation made in one tab is visible from a second tab, and reverts cleanly in both', async ({
    page,
    context,
  }) => {
    test.slow();

    await test.step('tab 1: log in and confirm the baseline (checked) state', async () => {
      await login(page);
      await page.goto('/fr/my-profile');
      await expect(page.getByRole('switch', { name: 'Rappels de rendez-vous par SMS' })).toBeChecked();
    });

    const tab2 = await context.newPage();

    await test.step('tab 2: reusing the same authenticated session, no fresh login needed', async () => {
      await tab2.goto('/fr/my-profile');
      // If tab 2 weren't genuinely sharing the session, this would redirect to /login instead.
      await expect(tab2).toHaveURL(/\/my-profile/);
      await expect(tab2.getByRole('switch', { name: 'Rappels de rendez-vous par SMS' })).toBeChecked();
    });

    try {
      await test.step('tab 2: toggle the real, server-persisted preference off', async () => {
        const smsSwitch = tab2.getByRole('switch', { name: 'Rappels de rendez-vous par SMS' });
        const [putResponse] = await Promise.all([
          tab2.waitForResponse(
            (res) => res.url().includes(PREFS_ENDPOINT) && res.request().method() === 'PUT'
          ),
          smsSwitch.click(),
        ]);
        expect(putResponse.ok()).toBeTruthy();
        await expect(smsSwitch).not.toBeChecked();
      });

      await test.step('tab 1: reload and see the change made in tab 2, without touching tab 1 itself', async () => {
        await page.reload();
        await expect(page.getByRole('switch', { name: 'Rappels de rendez-vous par SMS' })).not.toBeChecked();
      });
    } finally {
      // Revert from tab 1 this time (the opposite tab from where the mutation happened) -
      // confirms the round-trip works in both directions, and leaves the shared account clean
      // regardless of which step above failed.
      await test.step('tab 1: revert, and confirm tab 2 sees the reverted state too', async () => {
        const smsSwitchTab1 = page.getByRole('switch', { name: 'Rappels de rendez-vous par SMS' });
        if (!(await smsSwitchTab1.isChecked())) {
          const [putResponse] = await Promise.all([
            page.waitForResponse(
              (res) => res.url().includes(PREFS_ENDPOINT) && res.request().method() === 'PUT'
            ),
            smsSwitchTab1.click(),
          ]);
          expect(putResponse.ok()).toBeTruthy();
        }
        await expect(smsSwitchTab1).toBeChecked();

        await tab2.reload();
        await expect(tab2.getByRole('switch', { name: 'Rappels de rendez-vous par SMS' })).toBeChecked();
      });
      await tab2.close();
    }
  });
});
