# Improvement: Self-service test-account provisioning (admin + doctor)

**Priority: High.** This single gap directly blocks 5 requested admin test cases outright and
has already caused one doctor-role account to become permanently unreachable earlier in this
project.

## The problem

QA currently has no reliable way to provision a fresh account in a *specific, known* state:

- **Admin - temporary-password first login (items 001-005):** the Super Admin account available
  to this suite already has a permanent password. There is no "create admin user" feature in the
  admin console itself (checked the full sidebar - nothing under Gestion/Configuration). Reaching
  a temporary-password first-login state needs either DSI-side provisioning or Keycloak
  realm-admin access, neither available to this suite. Result: `test-case/admin/login-flow/001`
  through `005` are all marked NOT TESTABLE.
- **Doctor - the original `FUENI_PRO_EMAIL` account became unreachable** (see
  `tickets/DOCTOR-ROLE-registration-blocked-by-turnstile`) because only the FUENI app password
  was persisted for it, not the temp-mail inbox's own login password - a process gap, not a
  product bug, but one that cost real QA time to work around (had to provision two more fresh
  accounts this session alone).

## Reconfirmed 2026-08-20: single-session lock compounds the single-account problem

While building the first automated admin spec (`tests/fueni-test/admin/001_verification-queue.spec.ts`),
discovered that the admin realm enforces a **strict single-session policy** - a second login
attempt for the same account is rejected with "Une seule session à la fois... Déconnectez-vous
là-bas, ou patientez 15 minutes d'inactivité, puis réessayez." This is a real, correct security
feature (protects against concurrent unauthorized access to a shared super-admin account), not a
bug - but combined with there being only **one** admin account available to this suite, it means:

- An interactive exploratory session and an automated test run can never safely overlap on this
  account - whichever logs in second gets locked out for up to 15 minutes.
- A test file that logs in more than once per run (e.g. a naive `beforeEach` that logs in fresh
  for every `test()`, the pattern that works fine for the doctor role where every test gets its
  own fresh account) will trip this same lock against *itself* after the first test, since the
  previous test's session is still "active" from the server's point of view even after the
  Playwright browser context closes.
- The practical fix applied in that spec is to log in **once** per file (all assertions as
  `test.step()`s inside a single `test()`), but this doesn't solve the *interactive-vs-automated*
  overlap risk, and a live unattended run of that spec couldn't be green-verified this session
  because an earlier (buggy, multi-login) version of it had already tripped the lock.

**Additional recommendation:** a second, disposable admin account (even a lower-privilege one)
would let automated and interactive/manual admin testing happen concurrently without fighting
over the single session slot - this is a second, independent reason (beyond items 001-005) to
prioritize the medium-term ask below.

## Recommendation

1. **Short-term (process fix, this suite's own responsibility):** whenever a new test account is
   provisioned via temp-mail, persist *both* the app password and the temp-mail inbox's own login
   password in `.env` immediately - already applied for the admin account and the newest doctor
   accounts this session, should become a standing habit.
2. **Medium-term (product/infra ask):** request a lightweight way to provision a fresh admin
   account with a temporary, must-change password - either a real "add admin" feature (even
   DSI-only, not self-service for testers) or a documented Keycloak Admin Console procedure QA
   can be given time-boxed access to when needed.
3. Once available, items 001-005 in `test-case/admin/login-flow/` can be fully retested and
   likely converted into permanent automated specs.
