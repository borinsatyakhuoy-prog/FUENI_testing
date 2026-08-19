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
