# Ticket: Doctor-role automated test suite is blocked at account creation (Turnstile + manual KYC)

**Verdict:** **Partially resolved, 2026-08-20** - a fresh registration attempt (new
temp-mail-controlled account, password persisted correctly this time) completed **end-to-end
with no Turnstile block encountered at any step**, reaching the PENDING_KYC dashboard and a full
KYC submission successfully. See `test-case/doctor-kyc-verification/README.md` for the full
retest (16 items) this unblocked. The original Session 5 account (`FUENI_PRO_EMAIL`) is still
stuck at OTP for the reason below, but that account is no longer the only path forward - a fresh
account can now reach PENDING_KYC without hitting Turnstile. **Not fully closing this ticket**
since it's unclear whether the Turnstile pass was a genuine fix, an invisible/managed-mode silent
pass, or Issue 3's escalation having cooled down since the last heavy-traffic session - a single
successful attempt isn't proof the block can never recur. Original 2026-08-19 write-up preserved
below for context.

---

### Original write-up (2026-08-19, superseded above for the registration-blocker specifically)

Open, and as of 2026-08-19 more blocked than before - the durable Session 5 account is
now also stuck at OTP (its temp-mail login password was never persisted; see below), and the
ad-hoc KYC-approved account is no longer available. Blocked on either the Cloudflare test-key ask
(see `tickets/CLOUDFLARE-TURNSTILE-CI-testkey-request`) or someone with Keycloak/database access
resetting 2FA or re-provisioning a reachable account.

## Summary

Unlike the patient app (one long-lived shared test account, `FUENI_EMAIL`/`FUENI_PASSWORD` in
`.env`), the doctor ("Espace praticien") role currently has **no automatable way to reach a
logged-in, authenticated state**:

1. **Self-registering a new doctor account is blocked by Cloudflare Turnstile** at step 3
   ("Vérifiez votre adresse e-mail") of the 4-step wizard (Éligibilité → Inscription →
   Vérification → Choix du plan) - confirmed live 2026-08-19, same root cause as
   `tickets/CLOUDFLARE-TURNSTILE-CI-testkey-request`.
2. Even past Turnstile, a new doctor account requires **manual KYC review by the FUENI team**
   ("Votre dossier sera examiné... dans un délai de 1 à 2 jours ouvrables") before it can log in
   at all - so even a Turnstile bypass alone wouldn't immediately produce a usable account for
   same-session automated testing.
3. A KYC-approved doctor account **was** provided ad hoc during this session (email/password),
   but its login enforces a mandatory email-OTP two-factor step on every login, and the mailbox
   is not one this suite/Claude has standing access to read - so even that account can't be
   logged into unattended by an automated suite as currently provisioned.

Net effect: **zero automated test coverage of the authenticated doctor area** (dashboard,
navigation, profile - whatever exists there) as of 2026-08-19. Only the pre-login surface
(login-page structure, eligibility step, registration form validation) is currently automatable,
mirroring the patient suite's `auth/00x` non-authenticated tests.

## Recommendation

Either of these unblocks a real doctor-role suite:

- **Provision a durable, pre-verified (KYC-approved) doctor test account** whose 2FA can be
  satisfied automatically - e.g. a mailbox reachable via the `temp-mail` MCP server (so Claude
  can read the OTP the same way it already does for patient registration exploration), or a
  test-only flag that disables/relaxes the 2FA requirement for that specific account, mirroring
  how the patient suite has one long-lived shared account it can log into unattended.
- **Or** resolve the Cloudflare test-key ask first (see the linked ticket) so Claude can complete
  a fresh self-registration end-to-end using its own temp-mail inbox, independent of any account
  someone else has to hand-provision.

## New blocker found (2026-08-19, second look) - the Session 5 self-service account's own OTP mailbox is now unreachable too

Attempted to log into `FUENI_PRO_EMAIL` (the durable, temp-mail-controlled account created in
Session 5) to check whether its KYC has since been approved. Login correctly reached the
mandatory email-OTP step, but reading that OTP requires logging into the temp-mail provider
itself with **that mailbox's own password** - which was never persisted anywhere (`.env` only
ever stored the FUENI app password, not the temp-mail inbox's login password). Without it, the
inbox can't be re-authenticated into from a fresh session, so the OTP can't be read and this
account is now just as unreachable as the old ad-hoc one, despite being "temp-mail-controlled."
The ad-hoc KYC-approved account from the original write-up below is also no longer available
(confirmed with the user, 2026-08-19).

**Root cause:** "reachable via temp-mail" was necessary but not sufficient - it also needs the
temp-mail account's own credentials saved durably, not just its address. `create_one_account`
returns both an address and a password; only the address made it into `.env`.

**Fix for next time a doctor account is (re-)provisioned:** persist both the FUENI app password
**and** the temp-mail inbox's own password (e.g. `FUENI_PRO_EMAIL_TEMPMAIL_PASSWORD`) in `.env`,
so any future session can call the temp-mail MCP's `login` tool directly instead of assuming a
prior session's in-memory login carries over.

**Net effect, updated:** doctor-role login is unreachable via every credential currently in this
project (the durable Session 5 account is now stuck at OTP; the ad-hoc KYC-approved account is
gone; fresh self-registration is still Turnstile-blocked - see the sitekey diagnostic in
`tickets/CLOUDFLARE-TURNSTILE-CI-testkey-request`). Unblocking this now needs either the infra
ask above, or asking whoever has console/database access to the FUENI staging Keycloak realm to
manually clear/reset the 2FA requirement or re-send a readable OTP for `FUENI_PRO_EMAIL`.

## Reconfirmed broken again, 2026-08-21

4 fresh temp-mail-controlled registration attempts this session, spread across two separate
batches (not a single rapid-fire loop), **all 4 failed identically**: registration form
submission succeeds, the "Vérifiez votre adresse e-mail" OTP screen appears, but no OTP email
from `noreply@fueni.com` ever arrives in the temp-mail inbox within 30s. This matches the
2026-08-20 write-up's original blocker (Cloudflare escalation silently withholding the OTP email)
and the two 5/5-failed batches already noted in `tests/fueni-test/doctor/001_plan-selection-gate.spec.ts`'s
header comment - so as of this session, the "partially resolved" status above does **not**
currently hold; every fresh-registration attempt is blocked again at the same OTP-delivery step,
regardless of spacing between attempts. Not re-diagnosed further (root cause is either Cloudflare
or the FUENI mail-sending path, not something this suite can distinguish from the outside) - flag
for whoever has access to the actual mail-sending logs/Cloudflare dashboard.

## Current doctor-role coverage (as of 2026-08-19)

Confirmed live, no defects found besides `defects/doctor-country-not-listed-untranslated-english`:

- Login page structure (E-mail/Téléphone tabs, defaults to **E-mail** - notably different from
  the patient app's Téléphone default), forgot-password link, "Créer un compte praticien" link,
  cross-link to "Espace patient".
- Registration step 1 (Éligibilité): profession gate (only "Médecin(e)" enabled; Pharmacien/
  Paramédicaux show "Bientôt"), 9-country list matching the "9 pays" claim, required-documents
  panel revealed after country selection, "Mon pays n'est pas dans la liste" waitlist branch.
- Registration step 2 (Inscription): full field validation, password-strength meter, submits
  successfully and reaches step 3.
- Unauthenticated direct access to a protected doctor route (`/fr/dashboard`) correctly redirects
  to the `fueni-professional` Keycloak realm login, same pattern as the patient app.
- Minor/cosmetic, reproducible: the browser tab title briefly flashes "Fueni Patient" during the
  Keycloak OAuth redirect hop before settling on "Fueni Provider" - not written up as its own
  defect (very low severity, cosmetic only), but worth knowing about if this suite spins up.
