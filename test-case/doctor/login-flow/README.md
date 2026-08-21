# Test Case Results: Doctor ("Espace praticien") login-flow pre-auth checks (2026-08-21)

**Context:** The doctor role has never had its login page's own validation/anti-enumeration
behavior checked before (only its structure - E-mail tab default, forgot-password link, register
link - was confirmed in `tickets/DOCTOR-ROLE-registration-blocked-by-turnstile`). Authenticated
doctor exploration was attempted this session but blocked again at email-OTP delivery (see that
same ticket's "Reconfirmed broken again, 2026-08-21" note) - these are the checks that don't need
an authenticated session, run instead while that path is blocked.

**Account used:** `FUENI_PRO_EMAIL` (the standing, OTP-mailbox-unreachable account) for the
anti-enumeration comparison only - a single deliberately-wrong-password attempt, same risk
posture as `test-case/admin/login-flow/009-anti-enumeration`. All other checks use fabricated,
never-registered identifiers.

## Results

| # | Test case | Result | Evidence |
|---|---|---|---|
| 1 | Anti-enumeration - does a real (registered) identifier with a wrong password produce the same generic error as a nonexistent one? | ✅ **PASS** | Nonexistent email + wrong password → "Identifiant ou mot de passe incorrect." Real `FUENI_PRO_EMAIL` + one deliberately wrong password → byte-for-byte the same message. No account-existence leak, same pattern already confirmed for the admin realm. |
| 2 | Empty-field validation on submit | ✅ **PASS** | Clicking "Connexion" with both fields empty shows a clear inline alert: "Veuillez saisir votre identifiant et votre mot de passe." - not a silent no-op, not a generic server round-trip. |
| 3 | Malformed email format validation | ✅ **PASS** | Typing `not-an-email` + any password and submitting shows "Adresse e-mail invalide." client-side, before any request that could otherwise be used for account-existence probing via response-timing. |

## Other notes

- Confirms the already-known cosmetic defect (browser tab title briefly shows "Fueni Patient"
  during the Keycloak OAuth redirect hop, settling on "Fueni Provider" moments later) is still
  present - not re-logged as a new defect, just re-observed in passing.
- The doctor realm's OAuth client is `fueni-auth-context` (same as the patient realm), not a
  distinct per-role client ID - consistent with `defects/keycloak-userinfo-cors-misconfiguration`'s
  finding that the underlying Keycloak/CORS layer is shared infrastructure across roles, not
  independently configured per app.

## Not yet automated

No `tests/fueni-test/` spec exists yet for the doctor login page at all (the only existing doctor
spec, `001_plan-selection-gate.spec.ts`, starts from registration, not login). These three are
clean, fast, no-OTP-required candidates for a first `tests/fueni-test/doctor/auth/` file whenever
the suite is expanded - see `defects/improvement/automated-suite-expansion.md`.
