# Improvement: Build permanent automated suites for doctor and admin roles

**Priority: Medium.** Both roles are now reachable and stable enough to automate, but every
finding in `test-case/doctor/` and `test-case/admin/` so far came from manual/scripted
browser-tool exploration, not a permanent Playwright suite - meaning none of it will be caught
automatically if it regresses.

## Why this is newly realistic

- **Doctor role:** a fresh registration attempt completed end-to-end with **no Turnstile block**
  this session (see the major update in
  `tickets/DOCTOR-ROLE-registration-blocked-by-turnstile`) - previously the entire doctor-role
  suite was blocked at account creation.
- **Admin role:** the Super Admin account is stable, OTP-reachable via temp-mail, and has now
  been exercised thoroughly enough (`test-case/admin/`) to know which flows are safe to automate.

## Recommendation

Prioritize converting the cleanest, most unambiguous PASS results into real specs first (lowest
risk, highest confidence):

- **Doctor:** `tests/fueni-test/doctor/` covering KYC test cases 011 (missing document), 012
  (complete submission), 013 (frozen during review), 014 (locked nav items), 015 (zero requests
  while pending) - all had clean, isolated evidence this session.
- **Admin:** `tests/fueni-test/admin/` covering login-flow items 007 (OTP screen), 008 (mandatory
  MFA), 009 (anti-enumeration), 013 (dedicated realm), and the app-shell FUE-815 items 007
  (logout POST+CSRF) - same reasoning.

Leave the NOT TESTABLE items (temp-password first-login, DSI-triggered session invalidation,
14-day/1-month auto-deletion reminders) as manual-only or scheduled long-running checks, since
they can't be meaningfully automated without infra this suite doesn't have access to yet (see
`defects/improvement/test-account-provisioning.md`).

Each new spec should reuse this session's `test-case/` write-ups as its "confirmed live before
writing" baseline, matching this project's existing convention.
