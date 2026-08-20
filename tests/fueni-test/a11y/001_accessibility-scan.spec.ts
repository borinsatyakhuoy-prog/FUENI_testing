import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { login } from '../helpers/auth';

/**
 * `/fr/login` isn't a single static page - it goes through a redirect chain that ends on a
 * Keycloak-hosted login form (see security/011). Calling axe's analyze() immediately after
 * goto() can race that chain and throw "Execution context was destroyed, most likely because of
 * a navigation". Wait for a stable, real UI element first.
 */
async function gotoLoginAndSettle(page: import('@playwright/test').Page) {
  await page.goto('/fr/login');
  await page.getByRole('heading', { name: 'Bon retour' }).waitFor();
}

/**
 * First automated accessibility coverage for this suite (previously zero visibility into a11y -
 * see Session 11 recommendation in test-results/Report.md). Scoped to WCAG 2.1 A/AA rules via
 * axe-core's tag filter, on one pre-auth and one authenticated page. Not exhaustive (a full a11y
 * audit would cover every page), but establishes the pattern and a live regression check for the
 * two highest-traffic pages.
 *
 * Improvement note: extend this same pattern to the doctor and admin apps' equivalent pages next
 * (currently zero a11y coverage there too) - see defects/improvement/automated-suite-expansion.md.
 */
test.describe('Accessibility', () => {
  test('login page has no WCAG 2.1 A/AA violations', async ({ page }) => {
    await gotoLoginAndSettle(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(
      results.violations,
      results.violations.map((v) => `${v.id}: ${v.description} (${v.nodes.length} node(s))`).join('\n')
    ).toEqual([]);
  });

  test('dashboard has no WCAG 2.1 A/AA violations', async ({ page }) => {
    await login(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(
      results.violations,
      results.violations.map((v) => `${v.id}: ${v.description} (${v.nodes.length} node(s))`).join('\n')
    ).toEqual([]);
  });
});
