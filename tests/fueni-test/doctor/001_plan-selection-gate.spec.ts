import { test, expect } from '@playwright/test';
import { registerFreshDoctorToPlanStep, loginDoctor, FreshDoctor } from '../helpers/doctor-registration';

/**
 * First automated coverage for the doctor app (previously zero - see
 * test-case/doctor/plan-selection-gate-fue-818/README.md for the manual/scripted retest this
 * automates). Runs against the doctor ("Espace praticien") app, not the patient app the rest of
 * this suite's baseURL points at - every test here overrides baseURL via FUENI_PRO_BASE_URL.
 *
 * OTP retrieval is fully scripted (see ../helpers/tempmail.ts) - the disposable inboxes this
 * suite uses are backed by the public mail.tm API, discovered live 2026-08-20, which means this
 * spec runs unattended with no manual mailbox-reading step. That finding also resolves a chunk
 * of the account-provisioning gap tracked in defects/improvement/test-account-provisioning.md
 * for any FUENI role gated by mandatory email-OTP.
 *
 * Each test registers its own fresh doctor account rather than sharing one, since the plan gate
 * can only be observed in its "not yet chosen" state once per account.
 *
 * Known CI caveat (2026-08-20): repeated registrations against this shared staging host can trip
 * Cloudflare's anti-automation escalation, which silently withholds the OTP email instead of
 * erroring - see tickets/CLOUDFLARE-TURNSTILE-CI-testkey-request for the reconfirmation and
 * defects/improvement/test-account-provisioning.md. Every assertion below is backed by
 * manually-confirmed live evidence (test-case/doctor/plan-selection-gate-fue-818/README.md) even
 * though a fully green unattended run couldn't be verified from this session for that reason.
 *
 * Reconfirmed 2026-08-21: two consecutive unattended runs (5 registrations each, back-to-back)
 * both came back 5/5 failed on the OTP wait with no spacing between registrations. A fixed
 * cooldown between this file's registrations is a best-effort mitigation, not a confirmed fix -
 * bump REGISTRATION_COOLDOWN_MS if OTPs still don't land.
 */
test.use({ baseURL: process.env.FUENI_PRO_BASE_URL });

const REGISTRATION_COOLDOWN_MS = 45_000;
let registrationCount = 0;

test.describe('FUE-818 - Doctor plan-selection gate', () => {
  test.beforeEach(async () => {
    if (registrationCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, REGISTRATION_COOLDOWN_MS));
    }
    registrationCount++;
  });

  test('the plan gate blocks the dashboard and cannot be dismissed until a plan is chosen', async ({
    page,
  }) => {
    test.slow();
    await registerFreshDoctorToPlanStep(page);

    await page.goto('/fr/dashboard');
    const gate = page.getByRole('dialog').filter({ hasText: 'Choisissez votre formule' });
    await expect(gate).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(gate).toBeVisible();

    // The backdrop must genuinely intercept pointer events, not just visually cover the page -
    // confirmed live: a real click on a sidebar link times out against the backdrop.
    await expect(
      page.getByRole('link', { name: 'Tableau de bord' }).click({ timeout: 3_000 })
    ).rejects.toThrow(/intercepts pointer events/);
  });

  test('choosing Free persists the plan and closes the gate', async ({ page }) => {
    test.slow();
    await registerFreshDoctorToPlanStep(page);

    const planResponse = page.waitForResponse(
      (res) => res.url().includes('/api/v1/doctors/me/plan') && res.request().method() === 'POST'
    );
    await page.getByRole('button', { name: 'Commencer gratuitement' }).click();
    const response = await planResponse;
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.selectedPlan).toBe('FREE');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('dialog').filter({ hasText: 'Choisissez votre formule' })).toHaveCount(0);
  });

  test('Solo is disabled in the UI and independently rejected by the server', async ({ page }) => {
    test.slow();
    await registerFreshDoctorToPlanStep(page);

    const soloButton = page.getByRole('button', { name: 'Choisir Solo' });
    await expect(soloButton).toBeDisabled();

    // Choose Free first so we have a valid authenticated session/CSRF token to attack the
    // endpoint with - the rejection must come from the server's own plan validation, not from
    // being unauthenticated.
    await page.getByRole('button', { name: 'Commencer gratuitement' }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    const csrf = (await page.context().cookies()).find((c) => c.name === 'csrf')?.value;
    expect(csrf, 'expected a csrf cookie after authenticating').toBeTruthy();

    const rejection = await page.evaluate(
      async (csrfToken) => {
        const res = await fetch('/api/v1/doctors/me/plan', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-csrf-token': csrfToken as string },
          body: JSON.stringify({ plan: 'SOLO' }),
          credentials: 'include',
        });
        return { status: res.status, body: await res.json() };
      },
      csrf
    );
    expect(rejection.status).toBe(422);
    expect(rejection.body.code).toBe('PLAN_NOT_AVAILABLE');
  });

  test('an already-chosen plan skips the gate on a fresh login, and re-selecting it is idempotent', async ({
    page,
  }) => {
    test.slow();
    const doctor: FreshDoctor = await registerFreshDoctorToPlanStep(page);
    await page.getByRole('button', { name: 'Commencer gratuitement' }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    const firstSelection = await page.evaluate(async () => {
      const res = await fetch('/api/v1/doctors/me/plan', { credentials: 'include' });
      return res.json();
    });

    await page.getByRole('button', { name: 'Se déconnecter' }).click();
    await loginDoctor(page, doctor);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('dialog').filter({ hasText: 'Choisissez votre formule' })).toHaveCount(0);

    const csrf = (await page.context().cookies()).find((c) => c.name === 'csrf')?.value;
    const secondSelection = await page.evaluate(
      async (csrfToken) => {
        const res = await fetch('/api/v1/doctors/me/plan', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-csrf-token': csrfToken as string },
          body: JSON.stringify({ plan: 'FREE' }),
          credentials: 'include',
        });
        return res.json();
      },
      csrf
    );
    expect(secondSelection.planSelectedAt).toBe(firstSelection.planSelectedAt);
  });

  test('no payment/billing request fires for either plan choice', async ({ page }) => {
    test.slow();
    const paymentRequests: string[] = [];
    page.on('request', (req) => {
      if (/stripe|payment|checkout|billing|invoice/i.test(req.url())) {
        paymentRequests.push(req.url());
      }
    });

    await registerFreshDoctorToPlanStep(page);
    await page.getByRole('button', { name: 'Commencer gratuitement' }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    expect(paymentRequests).toEqual([]);
  });
});
