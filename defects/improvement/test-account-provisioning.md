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
