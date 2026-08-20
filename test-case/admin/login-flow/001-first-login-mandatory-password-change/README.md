# 001 - First login — mandatory temporary password change

**Result:** ⚪ NOT TESTABLE this session (no screenshot)

## How to test
1. Have the DSI provision a brand-new admin account with a temporary password.
2. Log in with that temporary password for the first time.
3. Observe whether the app forces a password change before granting access.

## Expected
First login with a DSI-issued temporary password should force a mandatory password-change step
before reaching the console.

## Actual
**Not testable from this session's access level.** The Super Admin account available here
(`db022bd7b0284076@emalupe.com`) already has a permanent password and does not show this flow.
The admin console's own UI has no self-service way to provision a new admin account (checked the
full sidebar - "GESTION" only has Vérification des dossiers, Abonnements [disabled/"Bientôt"],
Journal d'audit; "CONFIGURATION" only has Plans and Tarification, both disabled) - per the
portal's own login-page copy, admin accounts are "provisionnés par le DSI Nazounki", which is
outside this session's access. Reaching this flow needs either DSI-side provisioning of a fresh
temporary-password account, or Keycloak realm-admin access to set a `UPDATE_PASSWORD` required
action on an existing account.

## Browser(s) tested
Not applicable - this test case was not reached.

## Improvement suggestion
This is the root blocker for test cases 001-005 as a group. See
`defects/improvement/test-account-provisioning.md` - request either a disposable
temporary-password admin account from the DSI, or realm-admin access to set a Keycloak
`UPDATE_PASSWORD` required action on a throwaway account, so this whole cluster can be verified
in one pass instead of staying open indefinitely.
