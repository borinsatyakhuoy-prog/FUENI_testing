import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  /**
   * Known issue (2026-08-18): the top-bar "Notifications" bell doesn't open a
   * panel, dialog, or menu, and fires no request - it's a dead UI element.
   * No console error either, so it fails silently rather than crashing. This
   * spec documents the current (broken) state; it should start failing - and
   * get rewritten to assert real panel content - the moment a notifications
   * feature ships. See test-results/exploratory-findings.md.
   */
  test('clicking the notifications bell has no visible effect', async ({ page }) => {
    const bell = page.getByRole('button', { name: 'Notifications' });
    await expect(bell).toBeVisible();

    const pageErrors: string[] = [];
    page.on('pageerror', (e) => pageErrors.push(e.message));

    await bell.click();
    await page.waitForTimeout(500);

    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  });
});
