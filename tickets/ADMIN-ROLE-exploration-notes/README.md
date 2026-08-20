# Ticket: Admin-role exploration notes and open questions (first pass, 2026-08-20)

**Verdict:** Open - informational/scoping ticket, not a blocker. No automated admin-role suite
exists yet; this captures what a first authenticated pass found and what would need resolving
before building one.

## Summary

The admin portal (`https://fueni-staging-preview-admin.allweb.cloud`, Keycloak realm
`fueni-platform-admin`, client `admin-web`) was not previously in this project's test plan
(`user-stories/SCRUM.md`, `specs/planner/`). A test account was provisioned
(`db022bd7b0284076@emalupe.com`, a temp-mail-controlled inbox so Claude can read the mandatory
email-OTP 2FA, same pattern as the doctor-role account - see
`tickets/DOCTOR-ROLE-registration-blocked-by-turnstile`) and used for a first exploratory,
read-only pass. Credentials are in the local `.env` only (`FUENI_ADMIN_EMAIL`/
`FUENI_ADMIN_PASSWORD`/`FUENI_ADMIN_TEMPMAIL_PASSWORD`), never committed - see `.env.example`.

**Important context noted before starting:** the login page's own copy describes this as a
`PRODUCTION · RGPD · HDS · ISO 27001` system with access "provisionnés par le DSI Nazounki",
despite the `staging-preview` hostname, a VPN requirement, and full action auditing (20-year
retention claimed - see `defects/admin-audit-retention-policy-contradiction`). Proceeding was
confirmed explicitly authorized before any login was attempted.

## Confirmed working (no defect)

- **Dedicated realm, email-only identification, no self-service registration/reset:** separate
  Keycloak realm from the patient/doctor apps; login form has only an email field (no phone
  tab); no "S'inscrire" link anywhere; "Mot de passe oublié ?" routes to a `mailto:` link to the
  DSI, not a self-service reset flow.
- **Generic errors / anti-enumeration:** a nonexistent email and a real-email-with-wrong-password
  both produce the identical `Identifiant ou mot de passe incorrect.` - no account-existence
  leak observed. (Wording not cross-checked against any internal spec reference - if there's a
  canonical "§9" source doc for exact required copy, diff against it separately.)
- **Audit logging is functionally active:** login/logout events are recorded in
  `/fr/audit-logs` within seconds, append-only per its own UI copy.
- **Tablet (768px) and desktop (1600px) layouts** render cleanly, no obvious overflow/breakage.

## Confirmed defects (see `defects/`)

- `admin-audit-retention-policy-contradiction` - login page claims 20-year retention; the audit
  log page itself says retention is unconfirmed.
- `admin-audit-log-generic-admin-identity` - audit log attributes actions to a reused generic
  seat label, not the real individual account.
- `admin-console-mobile-not-responsive` - mobile (375px) is fully blocked behind a static
  "switch to tablet/desktop" page rather than an adapted layout; tablet/desktop are fine. Whether
  this counts as a defect depends on the real "022" DoD wording, which this session couldn't
  access.

## Deliberately not tested / open questions

- **Anti-brute-force lockout threshold and IP/source rate limiting:** only one wrong-password
  attempt was tried (plus one against a nonexistent email), specifically to avoid risking a
  lockout on the only currently-working admin account. No "attempts remaining" indicator
  appeared after that single failure. Determining the real threshold, and whether both a
  per-user lockout AND an IP/source-based limit exist, needs either a second disposable admin
  account or explicit sign-off to intentionally trip the lockout on this one.
- **Password reset by the DSI invalidates all active admin sessions:** untestable from a single
  account/session - would need a second concurrent authenticated session plus someone actually
  triggering a real DSI-side password reset, neither reachable from here.
- **Success message on login:** the post-OTP redirect to the console works reliably every time;
  a distinct "success" toast/banner wasn't observed (only the redirect itself). Low priority,
  worth a second look with devtools/network open to confirm one isn't just missed.
- **20-year retention itself:** not independently verifiable in real time regardless of the
  contradiction above - can only confirm the *claim*, not the actual multi-year behavior.

## Recommendation

- Decide whether to build a real admin-role automated suite (mirroring the patient suite's
  structure) now that a reachable, OTP-capable account exists - unlike the doctor role, this one
  isn't currently blocked by Turnstile or manual KYC.
- Before locking in "022"-style responsive assertions or "009"/anti-enumeration wording checks
  as automated tests, get the actual DoD/spec text (the "§9" reference) so assertions match the
  real requirement rather than this session's best-effort interpretation.
- Resolve the three defects above with the FUENI/DSI team, particularly the audit-identity one
  given its direct relevance to this system's own compliance claims.
