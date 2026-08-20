# Ticket: Request a Cloudflare Turnstile test-mode key for CI/automated testing

**Verdict:** Open - blocked on the FUENI team/infra owner, not actionable from this side alone.

## Summary

Both the patient and doctor staging apps put a live Cloudflare Turnstile challenge in front of
several flows (patient: forgot-password wizard, registration step 3; doctor: registration step
3 email verification). This is expected and correct behavior for real users, but it structurally
blocks unattended/CI automation of those flows - Turnstile is designed specifically to
distinguish humans from automated browsers, and Playwright-driven sessions are reliably detected
regardless of whether a human or a script performs the click (confirmed live 2026-08-19 on the
doctor app: even a manual click inside the same Playwright-controlled browser window failed,
while the identical flow completed instantly in a separate, non-automated browser).

Two related symptoms observed so far, both attributable to this:

1. **Turnstile itself never clears** for `auth/004`, `auth/008`, `registration/002` (patient) and
   the entire doctor registration step 3 - these tests are blocked in CI, not broken in the
   product (see `test-results/Report.md` Issue 3).
2. **Escalation beyond Turnstile-gated flows** - confirmed live 2026-08-19, after an unusually
   heavy volume of automated traffic in one session, even a plain non-Turnstile flow (patient
   logout redirect) started failing to complete from the automated test runner's specific browser
   fingerprint, while a separate interactive session on the same account worked normally at the
   same time. This suggests Cloudflare's anti-automation posture can widen beyond the
   specifically-gated flows once a fingerprint is flagged heavily enough.

## Reconfirmed 2026-08-20, from automated (not interactive) traffic

While building `tests/fueni-test/doctor/001_plan-selection-gate.spec.ts` - the first real
automated doctor-role spec, using a scripted mail.tm-backed OTP helper (see
`tests/fueni-test/helpers/tempmail.ts`) so no manual mailbox reading was involved - repeated
fresh registration attempts against `fueni-staging-preview-pro.allweb.cloud` started returning a
degraded verification screen ("Veuillez compléter la vérification de sécurité pour continuer.",
no OTP input rendered at all) instead of the normal OTP-entry screen. No verification email was
ever sent for these attempts. This happened after roughly 8 registrations in one session
(3 interactive + 5 automated, run back-to-back), and did **not** clear on a single retry a few
minutes later. Consistent with the "escalation beyond Turnstile-gated flows" symptom above, except
this time triggered by genuinely automated (not merely Playwright-driven-but-manual) traffic,
which strengthens the case that this is IP/fingerprint-based rather than about human-vs-script
detection specifically. Deliberately stopped retrying at this point rather than pushing further,
per this suite's own policy of not trying to fight a shared staging host's anti-automation posture
(see `tests/fueni-test/load/001_concurrent-login-page-load.spec.ts`'s header for the same
principle applied to load testing).

**Practical consequence:** the new doctor spec's assertions are all backed by manually-confirmed
live evidence (see `test-case/doctor/plan-selection-gate-fue-818/README.md`), but a fully green,
unattended CI run of that spec cannot be verified from this session - it depends on this ticket
being resolved (or on enough real cooldown time passing) before the registration step reliably
clears.

## Sitekey diagnostic (2026-08-19)

Checked whether staging might already be using one of Cloudflare's published test/sandbox
sitekeys by mistake (which would mean this ticket is moot). Confirmed it is **not**: driving a
fresh doctor registration attempt through to step 3 and inspecting the actual network request to
`challenges.cloudflare.com`, the widget's sitekey is `0x4AAAAAADhOODqZb40ZZn36` - a real
production-style Turnstile sitekey, not one of Cloudflare's documented always-pass/always-block/
force-interactive test keys (those follow a distinct `1x0000...`/`2x0000...`/`3x0000...` pattern,
see the testing docs link above). So the ask below is a genuine, necessary configuration change,
not something already half-solved. (Same live attempt reconfirmed the challenge never clears -
screenshot at `test-results/screenshots/doctor-registration-turnstile-stuck.png`.)

## Ready-to-send request (draft - fill in the recipient)

> Subject: Cloudflare Turnstile test key for FUENI staging QA automation
>
> Hi team,
>
> QA automation (Playwright-driven) is structurally blocked by the live Cloudflare Turnstile
> challenge on both staging apps - specifically the patient forgot-password wizard, patient
> registration step 3, and the doctor registration step-3 email verification. This is expected,
> correct behavior for real traffic; Turnstile is designed to detect exactly this kind of
> automated session, and it does so reliably regardless of whether a human or a script performs
> the click.
>
> Could we get one of the following for the staging environment(s) used by QA automation only
> (production keeps the real key)?
>
> 1. One of Cloudflare's own published test-mode Turnstile sitekeys
>    (https://developers.cloudflare.com/turnstile/troubleshooting/testing/), swapped in behind an
>    env flag for staging, or
> 2. An IP allowlist / dedicated bypass header-cookie for the automation's known source in the
>    Cloudflare zone's Turnstile/WAF configuration.
>
> Currently confirmed staging sitekey (doctor registration): `0x4AAAAAADhOODqZb40ZZn36` - this
> is a real key, not already a sandbox one, so this needs an actual config change on your end
> rather than anything fixable from the test-automation side.
>
> This unblocks full CI coverage of the patient forgot-password/registration flows and is a hard
> prerequisite for building any automated doctor-role test suite at all (see
> `tickets/DOCTOR-ROLE-registration-blocked-by-turnstile`).

## Why this matters

As this suite grows (and as a doctor-role suite gets built), more of it will be
un-runnable in unattended CI without either accepting permanently-flaky/blocked tests for these
paths, or a sanctioned way around the challenge.

## Recommendation

Ask the FUENI engineering team to either:
- Swap in one of **Cloudflare's own published Turnstile test/sandbox site keys**
  (https://developers.cloudflare.com/turnstile/troubleshooting/testing/ - e.g. an "always-pass"
  key) for the staging environment(s) used by QA automation, ideally behind an env flag so
  production keeps the real key; or
- Allowlist the CI/automation's known IP range or a dedicated header/cookie in Cloudflare's
  WAF/Turnstile configuration for that zone.

This is the standard, Cloudflare-sanctioned way to make Turnstile-gated flows testable in CI - it
does not involve defeating or evading the anti-bot control, only configuring it differently for a
known, trusted testing context. Not something this suite can action unilaterally - requires
access to the Cloudflare zone/dashboard or the app's deployment config for the staging
environments.
