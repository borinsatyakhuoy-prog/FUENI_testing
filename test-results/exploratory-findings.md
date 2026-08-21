# FUENI (Patient) - Exploratory Testing Findings

**Date:** 2026-08-17
**Tester:** Claude Code (Playwright MCP, headed Chromium)
**Environment:** `https://fueni-staging-preview-patient.allweb.cloud` (new staging), cross-checked
against `https://fueni-staging-patient.allweb.cloud` (old stable)
**Account:** shared patient test account from `user-stories/SCRUM.md` (Borin KHUOY, "Compte
vérifié")
**Sprint context:** project is at SCRUM-10 - several nav destinations are intentionally
unfinished placeholders, not bugs. Noted explicitly below so they aren't mistaken for defects.

Screenshots referenced below are saved locally under `test-results/screenshots/` (gitignored -
local evidence only, not committed).

## Summary

| Area | Status |
|---|---|
| Login (email/password) | Works |
| Login (phone/password) | Not exercised this pass (tab exists, not tested) |
| Invalid credentials | Works - clear error, stays on login |
| Empty-field submit | Works - single combined alert (not per-field) |
| Logout / session end | Works, but throws a caught console error (see Issue 1) |
| Forgot password wizard | Reaches step 1 correctly; Turnstile-gated, not completed end-to-end |
| Registration wizard | Structure confirmed; not completed end-to-end this pass |
| Dashboard | Works - empty states for appointments/documents |
| Mes RDV / Prendre RDV / Mes documents / FAQ / Support | **Not yet developed** - "Bientôt disponible" placeholder |
| Mon profil | Works - rich read + partially-editable page |
| Connexion & Sécurité | Works - rich account/security page |

## Issue 1 - Console error on logout (CORS-blocked RSC fetch), silently swallowed

**Severity:** Low (no user-visible impact observed) but worth fixing and regression-testing.

**Steps to reproduce:**
1. Log in with valid credentials, land on `/fr/dashboard`.
2. Click "Se déconnecter" in the sidebar.

**Actual result:** The browser console logs:
```
[ERROR] Access to fetch at 'https://fueni-staging-preview-auth.allweb.cloud/realms/.../auth?...&notice=logged-out...'
(redirected from '.../auth/api/v1/auth/login?redirect=%2Ffr%2Fdashboard&notice=logged-out...')
from origin 'https://fueni-staging-preview-patient.allweb.cloud' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin'
header is present on the requested resource.
[ERROR] Failed to load resource: net::ERR_FAILED
[ERROR] Failed to fetch RSC payload for .../auth/api/v1/auth/login?... Falling back to browser navigation.
```
The app catches this and falls back to a full browser navigation, so the user still lands
correctly on the login page - this is not user-visible breakage. It's a genuine error though:
the Next.js RSC (React Server Component) prefetch for the post-logout redirect hits a
cross-origin Keycloak URL that doesn't send CORS headers, and the fetch is blocked.

**Expected:** No uncaught/console errors during a normal sign-out flow.

**Recommendation:** Either avoid an RSC-fetch-based navigation for a redirect target that's
known to be cross-origin (use a full `window.location` navigation directly, as the fallback
already does), or add the necessary CORS headers on the Keycloak side if the RSC fetch is
supposed to succeed. Flagged as a defect for the dev team; not a test blocker since the
fallback works.

**Test coverage:** `tests/fueni-test/auth/006_logout-no-console-errors.spec.ts` asserts no
`console.error`/`pageerror` events fire during logout - this will fail against current
behavior (documenting the known issue) until fixed. See that spec's comment for how to
un-skip/assert once resolved.

## Issue 2 - AC1 "empty-field validation" description didn't match actual behavior

**Severity:** Documentation, not a product defect.

The original `user-stories/SCRUM.md` AC1 said empty-field submission shows "inline 'required'
validation for both Email and Password" (two separate messages). Actual behavior (confirmed
live): a single combined alert, "Veuillez saisir votre identifiant et votre mot de passe."
SCRUM.md AC1 has been corrected to describe the real behavior; no code fix needed, this was a
stale/assumed AC.

## Finding - Registration genuinely requires real SMS; the "email OTP only" note doesn't apply here

**Severity:** Blocks full test automation of the registration flow (not a product defect - the
product may simply require phone verification by design).

`user-stories/SCRUM.md` originally stated SMS isn't available in this environment and only
email OTP works. Tested live with a disposable e-mail (via the `temp-mail` MCP server,
`7cf73e868a63149c@emalupe.com`) and a fake Cambodian phone number (+855 98 765 432) through the
full 3-step wizard at `/fr/register`:

1. **Step 1 (Inscription):** filled Prénom/Nom/DOB (18+)/Sexe/E-mail/Téléphone/Mot de passe,
   checked both consents, clicked "Créer mon compte". First attempt with phone `+855 12345678`
   failed with a specific, well-behaved error - "Ce numéro de téléphone est déjà enregistré."
   (already registered by another account) - retried with `+855 98765432` and it accepted.
2. **Step 2 (Profil de base):** Pays de service confirmed to offer exactly the 9 MVP countries
   (Bénin, Burkina Faso, Cameroun, Côte d'Ivoire, Mali, Niger, RD Congo, Sénégal, Togo); Région
   and Ville are cascading creatable-comboboxes (disabled until their parent is chosen). Minor
   note: "Langue du compte" defaulted to **English** here, not French, even though the whole
   rest of the app/registration UI is in French - inconsistent default, worth a UI fix.
3. **Step 3 (Vérification SMS):** displayed "Un code à 6 chiffres a été envoyé par SMS au +855
   98 765 432. Votre code reste valide 5 minutes." with a one-time-passcode input, a resend
   timer ("disponible dans 00:57"), and a "Vérification et accès à mon compte" submit button.
   **No e-mail OTP option was offered anywhere in this wizard** - it's phone-SMS-only. Since the
   phone number used was fake, this pass could not go further (correctly stopped rather than
   guessing OTP digits).

**Conclusion (clarified with the user):** the "SMS not available, only e-mail OTP" note refers
to flows that offer an explicit Téléphone/E-mail method tab (login, password-reset) - confirmed
live that choosing "E-mail" on the password-reset wizard (`/fr/password/reset`, using the
shared account's real address) genuinely sends a working code: "Si un compte est associé à cet
identifiant et que celui-ci est vérifié, un code à 6 chiffres a été envoyé à l***@hutdot.com."
The registration wizard is simply a different flow with no such method choice - step 3 is
phone-SMS-only by design, not a bug or a doc error once read in that light.

**Practical implication for automation:** anywhere the app offers a Téléphone/E-mail tab
(login, password-reset), tests should select "E-mail" - it's the automatable channel via the
`temp-mail`/real-inbox route. Registration itself has no such choice, so
`tests/fueni-test/registration/002_full-signup-otp-email.spec.ts` still can't be completed
end-to-end without a real/receivable phone number and remains deferred; step-1
field/password-validation coverage (`001_step1-validation.spec.ts`) is unaffected and fully
automatable.

## Placeholder ("Bientôt disponible") destinations - confirmed, not defects

The following sidebar links all render the identical generic placeholder heading "Bientôt
disponible" / "Cette fonctionnalité est en cours de développement. Revenez bientôt !" - confirmed
intentional given the project is at sprint SCRUM-10:
- Mes RDV (`/fr/appointments`)
- Prendre RDV (`/fr/book`)
- Mes documents (`/fr/documents`)
- FAQ (`/fr/faq`)
- Contacter le support (`/fr/support`)

These are covered by a single shared placeholder test rather than one per route (see
`tests/fueni-test/navigation/002_unimplemented-routes-show-placeholder.spec.ts`), and should be
revisited/expanded into real feature tests as each ships in a later sprint.

## Login form defaults to "Téléphone" tab

Not a bug, but a gotcha for automation: the login page's tablist defaults to "Téléphone" with a
country-code combobox, not "E-mail". Every login-flow test must click the "E-mail" tab before
the `Identifiant`/`Mot de passe` fields the suite fills are even present as the expected
textboxes (see `tests/fueni-test/helpers/auth.ts`).

## Mon profil - real, mostly non-destructive content

- **Identité** (read-only): Prénom, Nom, Date de naissance, Sexe à la naissance - explicitly not
  self-editable; a `mailto:support@fueni.com?subject=Correction de mes informations personnelles`
  link is provided instead.
- **Localisation & langue** (editable via "Modifier"): country/region/city, account language,
  spoken languages (optional), address (optional).
- **Contact d'urgence** (editable via "Modifier"): name, relationship, phone.
- **Préférences de notification**: two toggles (SMS / email appointment reminders), both "On"
  by default.

Automated tests should open the "Modifier" dialogs to validate their fields/labels and then
Cancel, per the real-data-safety principle - not submit real changes to the shared test
account's location or emergency contact.

## Additional finding (during automated-test healing) - Cloudflare Turnstile blocks repeated automated runs

**Severity:** Environmental limitation, not a test bug - affects CI reliability of three specs.

During healing, every Turnstile-style security check in the app - the password-reset wizard
(`tests/fueni-test/auth/004_forgot-password-wizard-start.spec.ts`,
`008_forgot-password-email-otp.spec.ts`) and the registration wizard's own step-3 check
(`tests/fueni-test/registration/002_step1-to-step2.spec.ts`) - initially passed, then began
reliably failing after several consecutive automated runs against the same environment in a
short window: the gated button/message stayed stuck in its "checking" state for the full wait
(raised from 30s up to 120s in the password-reset case; confirmed via 200+ polls in the trace
that the button's `disabled` attribute never cleared). This is consistent with Cloudflare's
bot-detection escalating against repeated automated traffic from the same session/IP rather than
a slow-but-eventually-clearing challenge - increasing the timeout further did not help, which is
the key signal it's not a simple timing issue, and the fact that it now affects *every* such
check in the app (not just one) points at the traffic source, not any one flow.

**Practical implication:** all three specs are correct and did pass earlier in this same
session - they're left in the suite as-is (not skipped), but expect them to be flaky-to-failing
in CI or when re-run repeatedly in quick succession. If this becomes a recurring problem,
options to investigate: spacing out CI runs, a dedicated Turnstile bypass/test-mode token from
the FUENI team for staging, or moving these specific assertions to a manual/exploratory
checklist instead of automated CI. Not something a test-code fix can resolve on its own.

## Additional finding (during automated-test healing) - "Exporter mes données" is re-auth gated

Discovered while healing `tests/fueni-test/security/004_export-data.spec.ts`: clicking
"Exporter mes données" doesn't download immediately - it first opens a "Confirmez votre
identité" dialog requiring the current password ("Pour des raisons de sécurité, confirmez
votre identité avec votre mot de passe actuel."), with a disabled "Continuer" button until a
password is entered. Good security practice, just not visible from a first read-only pass -
`specs/planner/05-security-account.md` §5.4 has been updated to describe it. Also found: the
"Modifier" actions in "Coordonnées & connexion" (e-mail/téléphone) are inline edit forms, not
modal dialogs, same as Mon profil's sections - `specs/planner/05-security-account.md` §5.2/5.3
corrected accordingly.

## Connexion & Sécurité - real, one safe real-write action

- **Coordonnées & connexion**: verified e-mail and phone, each with a "Modifier" button.
- **Mot de passe**: a "Changer" button (do not complete - would break every other test's login).
- **Mon compte & mes données**: "Exporter mes données" (GDPR JSON export - read-only,
  **safe to execute for real**), account-deletion instructions (support-mediated only, no
  in-app flow yet), and Privacy Policy / Terms of Service buttons.

---

# Session 2 (2026-08-18) - Additional Exploratory Testing

**Goal:** re-explore the already-built patient app for test cases and defects not covered by the
first pass (2026-08-17) - targeting gaps flagged in `test-results/Report.md` (deferred items,
untested AC paths) plus areas never touched (top-bar controls, session/back-button behavior,
input edge cases, error routes). Same shared account and both staging hosts.

## Issue 4 (new) - "Notifications" bell button is a dead UI element

**Severity:** Low/Medium (missing functionality, not a crash).

**Steps to reproduce:** Log in, click the bell icon in the top bar (next to the language
switcher), on any page.

**Actual result:** Nothing happens - no dropdown, panel, dialog, badge, or toast appears, and no
network request fires. No console/page error either, so it fails silently rather than crashing.
Confirmed via accessibility snapshot and a screenshot (button gains focus/`[active]` state only).

**Expected:** Either a functioning notifications panel, or the button should be hidden/disabled
until the feature ships (consistent with how the sidebar's not-yet-built destinations show an
explicit "Bientôt disponible" placeholder instead of a silently-dead control).

**Test coverage:** `tests/fueni-test/navigation/005_notifications-bell-is-inert.spec.ts`
documents the current state; written to start failing (prompting an update) the moment a real
panel ships.

## Positive findings - previously untested AC/Technical-Notes paths, confirmed working

- **Phone/password login (AC1's "or phone/password" path):** logging in via the "Téléphone" tab
  with the shared account's verified national number + password succeeds and reaches
  `/fr/dashboard`, identically to the e-mail path. Previously documented in the AC but never
  exercised - every existing auth spec used the E-mail tab exclusively. Now covered by
  `auth/009_phone-login-success.spec.ts`.
- **Browser back-button after logout** (`user-stories/SCRUM.md` Technical Notes: "test
  navigation flow and back button behavior", previously untested): pressing back after signing
  out does not restore the cached "Connexion & Sécurité" page - it re-issues a fresh Keycloak
  auth challenge. Session termination is real, not just a client-side navigation. Now covered by
  `auth/010_back-button-after-logout.spec.ts`.
- **Direct URL access to more than just the dashboard while logged out:** `/fr/my-profile` and
  `/fr/security` both correctly redirect to login when accessed directly without a session,
  same as the already-tested `/fr/dashboard`. Now covered by
  `navigation/004_direct-url-protected-routes-redirect.spec.ts`.
- **Password show/hide toggle genuinely works:** clicking "Afficher/masquer le mot de passe"
  flips the input's `type` attribute between `password` and `text` (confirmed via
  `page.evaluate`), not just a decorative icon. Now covered by
  `auth/011_password-show-hide-toggle.spec.ts`.
- **Login-page language switcher is fully functional, not a stub:** clicking the "Français
  fr"/"English en" button in the top-left of the (pre-login) branded panel opens a real menu;
  choosing the other language fully translates the entire login page (heading, tab labels,
  placeholders, links, "Rester connecté"/"Keep me signed in", etc.) via a `kc_locale` query
  param round-trip through Keycloak. Upgrades the prior "toggle present but only fr seen"
  finding to a fully-confirmed, positive result. No new automated test added (out of scope for
  this pass - the assertion surface is large); a follow-up spec could assert a handful of
  translated strings per language.
- **Email login is case-insensitive:** logging in with the shared account's e-mail in all
  uppercase (`LECALAL288@HUTDOT.COM`) succeeded, same as the normal-cased address. No defect.
- **Notification-preference toggle is a real, persisted, and safely revertible mutation** -
  resolves the item previously marked deferred in `test-results/Report.md` ("no safe way to
  revert confirmed yet"). Clicking "Rappels de rendez-vous par SMS" fires
  `PUT /api/v1/patients/me/notification-preferences` (200 OK), the new state survives a page
  reload (confirming it's a real backend write, not just local UI state), and clicking it again
  is a true, clean revert back to "On". Now covered for real by
  `profile/005_notification-preference-toggle-persists.spec.ts` (wrapped in `try`/`finally` so
  the shared account is never left mutated even if an assertion fails mid-test). Observed one
  transient flake in this session where the first PUT response wasn't immediately `ok()` -
  passed on Playwright's built-in retry; not reproduced on a second full run, so treated as
  environmental noise rather than a product defect for now.

## Minor finding - unknown-route 404 page is generic and unbranded

Navigating to a nonexistent route (e.g. `/fr/this-route-does-not-exist-xyz123`) correctly returns
an HTTP 404 (not a crash, not a redirect loop), but the page itself is Next.js's default
"404 / This page could not be found." - plain text, English-only, no FUENI header/sidebar/footer,
no link back to the app. Every other page in the product is branded and French. Low severity
(doesn't block any user flow - a mistyped URL is rare and the browser back button recovers
fine), but worth a UI fix for consistency. Covered by
`navigation/006_unknown-route-404.spec.ts` (asserts the 404 status/heading only, not the
branding gap).

## Non-issue investigated - a one-off stale-error flash while switching languages mid-session

While manually toggling the login page between English and Français in the same browser
session, one interaction briefly showed an "Incorrect identifier or password." alert in English
on an otherwise-empty Téléphone tab, immediately after a language-menu click that hadn't touched
the login form at all. This did not reproduce on a fresh page load/navigation, and is most
likely an artifact of Keycloak's server-rendered authentication flow carrying over stale
execution/tab state from earlier form submissions in the same long-lived browser session/cookie
jar (this session performed many consecutive logins/logouts) rather than a genuine bug. Not
logged as a defect and not given a regression test; flagged here only so a future session
doesn't waste time rediscovering the same red herring. If it recurs from a **fresh** browser
context, it should be re-opened as a real Issue.

---

# Session 4 (2026-08-19) - OWASP-aligned security pass

**Goal:** a lightweight, passive OWASP Top 10 / API Security Top 10-aligned check - no
exploitation attempted, no brute-forcing of the shared account (too risky - would break every
other test depending on it), just configuration verification and header/response inspection.

## Positive findings - confirmed secure, no defect

- **Resource Owner Password Credentials (ROPC) grant is correctly disabled for this client.**
  The Keycloak realm's OIDC discovery document (`/.well-known/openid-configuration`) lists
  `"password"` as a realm-wide supported grant type, which raised the question of whether
  Cloudflare Turnstile's UI-only protection on the login form could be trivially bypassed via a
  direct POST to the token endpoint (`grant_type=password`) - a classic API-layer bypass of a
  UI-layer control. Tested directly against the token endpoint using the shared test account's
  own already-authorized credentials: the client `fueni-auth-context` correctly rejects it with
  `401 unauthorized_client` / "Invalid client or Invalid client credentials" - Direct Access
  Grants are disabled for this client, so this bypass path does not exist. No defect.
- **No exposed sensitive files.** Checked `/.git/config`, `/.env`, `/.env.local`,
  `/package.json`, `/.well-known/security.txt`, `/sitemap.xml` on the patient app's web root -
  all return a clean 404. No defect.

## Issue 5 (new) - Keycloak `userinfo` endpoint has a permissive CORS policy

See `defects/keycloak-userinfo-cors-misconfiguration/README.md` for the full write-up. Summary:
the endpoint reflects back any `Origin` (including a completely fabricated,
never-registered one) alongside `Access-Control-Allow-Credentials: true` - no origin allowlist at
all. Confirmed via a real cross-origin browser `fetch()` from the actual patient-app origin that
the response is genuinely exposed to JS (not blocked), not just via raw header inspection.
Severity kept at Low rather than higher because this specific endpoint separately requires a
Bearer token (cookies alone got a `401`), so it isn't currently chainable into an actual data
leak - but the policy itself has no scoping, so any other cookie-authenticated endpoint on the
same auth domain would be immediately exploitable by the same gap.

## Not tested (deliberately, risk-based decision)

- **Login brute-force/lockout behavior:** would require multiple failed attempts against the
  real shared test account, risking either a Keycloak brute-force lockout (breaking every other
  test relying on this account) or further Cloudflare escalation on top of what's already
  documented in Issue 3. Recommend testing this only against a dedicated, disposable account if
  ever prioritized.

---

# Session 5 (2026-08-19) - First authenticated doctor-role exploration + responsive pass

**Goal:** get past the doctor-role blocker (see `tickets/DOCTOR-ROLE-registration-blocked-by-turnstile`)
using a jointly-created account, explore the authenticated doctor area and KYC flow for the first
time, then run a responsive-viewport pass across both roles.

## Milestone - a durable, fully self-service doctor test account now exists

Registration itself still needs a human to clear Turnstile (confirmed again live - even a manual
click inside this session's automated browser window failed, same as before), but once an
account exists, this session confirmed **all future logins can be handled by Claude alone**:
using a `temp-mail`-MCP-controlled inbox (`FUENI_PRO_EMAIL`/`FUENI_PRO_PASSWORD`, now in `.env`),
Claude can read both the registration verification code and the mandatory login email-OTP
without any human relay. The "remember this device for 30 days" checkbox was also checked during
this session's login, confirmed live to skip the OTP step entirely on the next login from the
same browser context.

## First look at the authenticated doctor dashboard

Confirmed live: after login, a new (KYC-not-yet-submitted) doctor account lands on `/en/dashboard`
with a blocking "Finish your verification" dialog ("Your account is created. Complete your KYC
file to activate your practitioner space.") and a sidebar where Patients/Schedule/Medical records
are disabled until KYC is complete. Dashboard shows a greeting, 4 stat cards (all zero), and two
empty-state sections (Today's schedule, Recent patients) - structurally very similar to the
patient dashboard's empty states.

## KYC ("Verification file") form - thorough, no defects found in validation

Deliberately explored the form's validation/UI behavior only, without submitting real-looking
fake credentials - the form explicitly states "Our team reviews your file within 2 business days
and notifies you by e-mail," meaning submitted data would consume a real human reviewer's time,
unlike testing a fully-automated flow. Confirmed live:
- Every required field (Medical specialty, Medical board number, National ID, Region, City,
  Practice address, the one Required upload) shows a correct, specific validation message on an
  empty submit.
- Medical specialty offers ~38 real specialties (Cardiology, General Practice, etc.).
- Region/City correctly cascade from the country chosen back at registration step 1 (confirmed:
  this account's Burkina Faso choice produced Burkina Faso's real provinces in the Region list).
- File-type validation works: uploading a `.txt` file was correctly rejected ("Invalid file: PDF,
  JPEG or PNG, 5 MB max.").
- Minor wording nitpick, not written up as its own defect: the Medical board number field's empty
  submit shows a format-validation message ("Invalid board number...") rather than "This field is
  required." like every other empty field - inconsistent phrasing, no functional impact.

## Issue 6 (new) - authenticated doctor app defaults to English despite an all-French session

The entire authenticated doctor area (dashboard, KYC page, sidebar labels, greeting) rendered in
English by default, even though registration and login were both conducted with `kc_locale=fr`
throughout. This is a broader instance of the same class of bug already known from patient
registration step 2 ("Langue du compte" defaulting to English) - here it affects the whole
authenticated app, not just one form field. Not yet written up as its own `defects/` entry pending
confirmation of whether this is role-specific or would also reproduce on a from-scratch patient
account (patient's authenticated area was already confirmed to correctly stay in French
throughout every prior session, so this does appear doctor-specific).

## Responsive viewport pass (375px mobile, 768px tablet) across both roles

See `defects/responsive-tablet-empty-whitespace/README.md` for the one confirmed defect found:
both roles' login pages waste ~235px of empty space at 768px tablet width, with the form left-
aligned rather than recentered. Reproduced identically on patient and doctor login (shared
component). Registration wizards on both roles, and all authenticated sidebar-layout pages
checked (patient dashboard/profile/security), responded correctly at both widths - sidebar
correctly collapses to a working hamburger-toggle drawer on mobile, content reflows to single
column, no overlap or cut-off content found. One suspected mobile overlap (KYC form's sticky
"Submit"/"Save" footer appearing to cover the City field) was investigated and ruled out - it
was a `fullPage` screenshot stitching artifact plus a boundary scroll position, not a real
blocking defect; scrolling further reveals the field fully, confirmed live.

---

# Session 6 (2026-08-19) - Turnstile diagnostic, doctor-account credential gap, 320px pass

**Goal:** follow up on two open threads from Session 5 - (1) try to unblock doctor-role
registration/login, (2) extend the responsive pass with a narrower 320px viewport and a look at
small UI components specifically, not just full-page layout.

## Turnstile diagnostic - confirmed staging is not accidentally using a test key

Drove a fresh (throwaway, temp-mail-backed) doctor registration attempt through to step 3 and
inspected the live network request to `challenges.cloudflare.com`: the widget's sitekey is
`0x4AAAAAADhOODqZb40ZZn36` - a real production-style Turnstile key, not one of Cloudflare's
published test/sandbox keys. So the existing recommendation (ask FUENI/infra for a test key or IP
allowlist) is a genuine, necessary ask, not something already half-solved from this side.
`tickets/CLOUDFLARE-TURNSTILE-CI-testkey-request` now has a ready-to-send request drafted, and
evidence of the still-stuck challenge is at
`test-results/screenshots/doctor-registration-turnstile-stuck.png`. No technical bypass of the
anti-bot control itself was attempted - that's a legitimate Cloudflare-configuration ask, not
something scriptable from the test-automation side.

## New blocker - the Session 5 doctor account is now also unreachable

Attempted to log into `FUENI_PRO_EMAIL` (the durable account from Session 5) to check whether its
KYC had been approved since. Login correctly reached the mandatory email-OTP step, but reading
that OTP requires the temp-mail inbox's *own* login password - which was never saved anywhere
(`.env` only stored the FUENI app password). Without it, the OTP can't be read, so this account is
now stuck too. The ad-hoc KYC-approved account from Session 5 is also no longer available (per the
user, 2026-08-19). Full detail and the fix for next time (persist the temp-mail password too, not
just the address) is in `tickets/DOCTOR-ROLE-registration-blocked-by-turnstile`.

**Net effect:** doctor-role login/registration remains fully blocked via every credential
currently available to this suite.

## Responsive pass - 320px viewport + small components, both roles

Extended the 375px/768px pass with the narrowest common real device width (320px, e.g. iPhone
SE/5/original SE) and looked specifically at small components (form-input placeholders, icon
buttons, touch-target sizing) rather than only full-page layout. Two new defects found, both
specific to 320px (confirmed absent at 375px):

- **`defects/login-phone-placeholder-clipped-320`** - the shared login component's phone-number
  input placeholder clips mid-word ("Numéro de télépl") at 320px on both roles - the same
  component already known to waste space at 768px (`defects/responsive-tablet-empty-whitespace`),
  now confirmed to have more than one un-tuned breakpoint.
- **`defects/security-page-horizontal-overflow-320`** - the patient "Connexion & Sécurité" page's
  "Mot de passe" row (label + dots + "Changer" button, a `flex` row with no wrap) forces ~26px of
  genuine horizontal page scroll at 320px - a more disruptive class of bug than the
  wasted-space-only tablet finding, since it makes the whole page scroll sideways.

Everything else checked at 320px was clean: patient dashboard (top-bar icons, greeting card,
"Prendre un RDV" button all reflow correctly, no overlap), Mon profil, and both roles'
registration wizards (no horizontal overflow on any of them). Notifications-bell touch target
measured 36x36 CSS px - below the AAA 44x44 guideline but comfortably above the WCAG AA minimum
(24x24), so not written up as a defect.

---

# Session 7 (2026-08-19) - Full-suite headed run, Cloudflare escalation recurrence

**Goal:** run the full automated suite headed, chromium only (per explicit request), as a general
health check after the prior sessions' new spec additions.

## Full-suite chromium run - 54 passed, defects/Turnstile-only failures

A full headed run (`npx playwright test --headed`, all 3 projects queued) was stopped once
chromium's own 54 tests completed, before firefox/webkit progressed far - the user only wanted
chromium for this pass. Chromium results: 54 passed, plus the already-expected failing-by-design
regression tests and Turnstile-blocked tests, plus one genuinely new observation:

- **`auth/004`, `auth/008`, `auth/014` (new wrong-OTP test), `registration/002`:** all Turnstile-
  gated, all failed - the widget's button stayed `disabled` for the full timeout in every case
  (confirmed via trace on `auth/014`: ~190 polls over 120s, `disabled` attribute never cleared).
  This is `test-results/Report.md` Issue 3, recurring again.
- **`auth/005`, `auth/006` (plain, non-Turnstile post-logout redirect):** also failed - stuck on
  `/fr/dashboard` for the full 30s wait instead of completing the redirect to `/login`. Same
  "escalation beyond Turnstile-gated flows" sub-symptom of Issue 3, already documented from an
  earlier 2026-08-19 session.
- **`dashboard/003`:** correctly self-skipped (not a failure) - the shared account's profile is
  currently complete, so the "Compléter mon profil" banner is correctly absent; this test detects
  that state and skips itself by design, per its own header comment.
- **`auth/010`:** one flaky attempt, passed on Playwright's built-in retry - already a known
  occasional flake pattern in this suite, not investigated further.

## Attempted healing - confirmed environmental, not a code defect

Per the user's request to "heal" the repeatedly-failing Cloudflare-verification tests: investigated
whether this was a new regression or the already-documented Issue 3 recurring. Ran an isolated
retry of just `auth/005` + `auth/006` (2 tests, 3 attempts each) roughly 5 minutes after the large
run stopped, specifically to test whether a short gap/lower traffic volume would let the escalation
clear. **All 6 attempts still failed identically** - stuck on `/fr/dashboard`, same as during the
full run.

**Conclusion:** this is not something a test-code change can fix. The test assertions themselves
are correct (this is genuine expected app behavior - a logout should redirect to login) and
already generously timed (30-120s per assertion, well above normal); prior sessions already tried
extending timeouts further and confirmed that doesn't help. No test code was changed - loosening
these assertions to force a pass would hide a real environmental limitation rather than heal
anything. New evidence from this session: a ~5-minute gap between a heavy run and a "quiet"
isolated retry is **not sufficient** for Cloudflare's escalation to clear - the actual cool-down
window needed is longer than that (unmeasured). Further live retries of the Turnstile-gated tests
were deliberately not attempted in this same session, to avoid deepening the escalation further
and to avoid burning more of the shared account's limited password-reset attempts
(`auth/014`'s wrong-OTP test consumes one on every real run).

**Practical guidance for future sessions:** don't chain a full-suite run immediately into more
Turnstile-gated test attempts on the same day. The only real fix remains the Cloudflare
test-key/IP-allowlist ask already drafted in `tickets/CLOUDFLARE-TURNSTILE-CI-testkey-request`.

## New, distinct symptom - `registration/002`'s SMS-dispatch text didn't appear

Unlike the other three Turnstile-gated failures, `registration/002`'s Turnstile widget *did* clear
this time (the wizard genuinely reached "Étape 3 / 3"), but the SMS-dispatch confirmation text
(`/envoyé par SMS/`) never appeared within the following 30s wait. This is a different symptom
from the stuck-disabled-button pattern seen elsewhere - possibly the SMS provider/backend itself
being rate-limited or slow under heavy automated load, separate from the Turnstile widget. Not
enough evidence yet to call this a confirmed distinct root cause; flagged here so a future session
doesn't have to rediscover it, and so it's watched for separately from the Turnstile pattern going
forward.

---

# Session 8 (2026-08-20) - Targeted exploratory pass on previously-untouched areas

**Goal:** a general exploratory pass focused specifically on areas not yet covered across the
prior 7 sessions - the authenticated area's language switcher (only the pre-login switcher was
previously confirmed), the security page's legal-document links (never clicked), password-change
field-level validation (never exercised, even without submitting), and the GDPR data export
(previously only confirmed "safe to execute", never actually executed or content-inspected).

## Issue 7 (new) - "Politique de confidentialité" and "Conditions générales (CGU)" buttons are dead

See `defects/patient-security-page-legal-links-dead-buttons/README.md` for the full write-up.
Summary: both buttons on `/fr/security` under "Mon compte & mes données" are real `<button>`
elements with no attached behavior at all - no dialog, no navigation, no new tab, no network
request, no console error. Third confirmed instance of this exact "silently dead interactive
control" pattern in this app (after the notifications bell and, in the admin console, nothing
comparable found yet). Arguably higher-priority than the notifications bell given this is a
healthcare platform marketing RGPD/HDS compliance with no reachable Privacy Policy.

## Positive finding - authenticated-area language switcher fully works, not just pre-login

Session 2 only confirmed the *pre-login* login-page language switcher was fully functional and
explicitly left the authenticated-area switcher untested ("no new automated test added - out of
scope for this pass"). Confirmed live this session: clicking "Changer de langue" on the
authenticated dashboard opens the same real menu (Français/English), and choosing English fully
translates the entire authenticated shell - sidebar section headings, every nav-item label,
"Sign out", the greeting heading/subtext, empty-state copy, and the switcher's own button label -
via a `/fr/dashboard` → `/en/dashboard` URL swap. Switching back to Français worked identically.
No defect; upgrades the prior session's "not yet confirmed for the authenticated area" note to a
fully-confirmed positive result.

## Positive finding - password-change field validation is correct and safe to probe without submitting

Opening "Changer" under "Mot de passe" reveals an inline form (current password, new password
with a live strength meter and a 6-item requirement checklist, Annuler/Enregistrer). Typing a
strong new password (`Str0ng!Passw0rd`) correctly updated the live meter to "Très fort" in
real time - but "Enregistrer" correctly stayed disabled throughout, because the *current*
password field was still empty. This confirms the save gate checks for a non-empty current
password independently of new-password strength, not just an all-fields-present check that could
be satisfied by strength alone. Cancelled via "Annuler" without ever submitting - the shared
account's real password was never at risk.

## Positive finding - GDPR data export executed for real, content confirmed complete and correctly scoped

Previously (Session 2) only confirmed the export flow *reaches* a password-confirmation dialog and
is "safe to execute for real" - never actually executed. Executed it for real this session:
after re-entering the account password in the "Confirmez votre identité" dialog, a genuine file
download fired (`fueni-mes-donnees-<patientId>.json`). Contents inspected and confirmed complete,
accurate, and correctly scoped: `identity` (name, DOB, sex), `contact` (email + verified flag,
phone), `location` (country/region/city/address), `languages`, `emergencyContact`,
`notificationPreferences`, and `account` (patientId, status, language) - matching exactly what's
shown across Mon profil/Connexion & Sécurité, with **no** password hash, session token, or other
security-sensitive field included. No appointments/documents included either, consistent with
those features being genuinely empty for this account (not a scoping bug). The downloaded file
(containing real account PII, even if test data) was deleted after inspection rather than left in
the repo's scratch directory - no defect found, the feature works exactly as advertised.

## Minor note - "Rester connecté" checkbox now defaults to checked

Not previously documented either way. Confirmed this session: the login page's "Rester connecté"
("Keep me signed in") checkbox is checked by default on both the Téléphone and E-mail tabs. Not
investigated further (would require comparing session/cookie expiry with it unchecked, which
wasn't done this pass) - noting only the default state for a future session that wants to verify
the actual duration difference.

---

# Session 9 (2026-08-21) - Doctor login-flow pre-auth checks, "Rester connecté" mechanism closed out

**Goal:** with the doctor role's authenticated area still unreachable (see below), split effort
between the doctor login page's never-checked pre-auth validation behavior and a previously
flagged-but-unexplored gap: what "Rester connecté" actually does mechanically.

## Doctor registration confirmed broken again (not new, but newly reconfirmed)

4 fresh temp-mail doctor registrations this session, across two separate batches, **all 4 failed
identically** at the email-OTP wait - same root cause already tracked in
`tickets/DOCTOR-ROLE-registration-blocked-by-turnstile` and the cooldown mitigation in
`tests/fueni-test/doctor/001_plan-selection-gate.spec.ts`. Logged as a fresh "still broken"
data point in that ticket rather than re-diagnosed (root cause needs mail-log/Cloudflare-dashboard
access this suite doesn't have).

## Doctor login page pre-auth checks (new) - see `test-case/doctor/login-flow/README.md`

With the authenticated path blocked, checked the doctor login page's own validation instead
(never checked before - only its structure was). All three come back clean, no defects:
anti-enumeration (real identifier + wrong password gives the identical generic error as a
nonexistent one - same protection already confirmed on admin), empty-field validation ("Veuillez
saisir votre identifiant et votre mot de passe."), and malformed-email validation ("Adresse
e-mail invalide.").

## "Rester connecté" mechanism fully resolved (closes the Session 8 open note above)

Compared cookies from two independent fresh logins (checked vs. unchecked), then simulated an
actual browser restart for each by opening a brand-new browser context seeded with only the
*persistent* (non session-only) cookies from that login, and visiting `/fr/dashboard` directly:

- **Checked:** Keycloak's `KEYCLOAK_IDENTITY` and `KEYCLOAK_SESSION` cookies persist with a real
  expiry, plus a `KEYCLOAK_REMEMBER_ME` cookie appears (~365 days out). After the simulated
  restart, visiting `/fr/dashboard` landed straight on the dashboard - no login form, silent SSO
  re-authentication, no password re-entry needed.
- **Unchecked:** `KEYCLOAK_IDENTITY` is session-only instead, and `KEYCLOAK_REMEMBER_ME` is never
  set at all. After the same simulated restart, `/fr/dashboard` correctly bounced to a real
  Keycloak login form requiring credentials again.
- **Notable either way:** the patient app's *own* `SESSION` cookie (the actual BFF session,
  `defects/http-security-header-gaps` finding #1) is **always** session-only regardless of the
  checkbox - "Rester connecté" doesn't keep the app itself logged in across a browser restart:
  it lets Keycloak silently re-authenticate you (skip re-entering your password) when you revisit
  and go through the login redirect again, which then mints a fresh `SESSION` cookie. A real
  browser-close-and-reopen (not just a new context) would very likely behave the same, since
  cookie persistence is what's being tested here, not anything else browser-restart-specific -
  not separately re-verified with an actual OS-level browser restart.

No defect - this is the checkbox working exactly as intended, just not previously confirmed
mechanically. Ad-hoc Playwright scripts used for both checks were deleted after use, not added as
permanent specs.

---

# Session 10 (2026-08-21) - Patient app: unsaved-edit safety and a concurrency check

**Goal:** continued exploration of the patient app, staying inside the suite's established
real-data-safety boundary (never click "Enregistrer" on Location/Emergency-contact/Identity/
Contact-info forms against the shared account; the notification-preference toggle is the one
exception already treated as safe to mutate-and-revert).

## New defect - language switch silently discards an unsaved edit form

See `defects/language-switch-discards-unsaved-edit-silently/README.md`. Summary: opening the
"Contact d'urgence" edit form, typing a value, then switching language via the authenticated-area
switcher triggers a full page navigation (`/fr/my-profile` → `/en/my-profile`) that silently
closes the edit form and discards the typed input - no "unsaved changes" warning at any point.
Confirmed via direct DOM inspection that the typed probe string was gone after the switch. No
real data was at risk (the shared account's actual emergency-contact fields were never touched -
"Enregistrer" was never clicked), but a real user doing this with real input would lose it
silently.

## Positive finding - rapid double-toggle on the SMS reminder preference is race-free

Fired two clicks on the "Rappels de rendez-vous par SMS" switch back-to-back, without waiting for
the first PUT to resolve, to check for a lost-update race condition. Both `PUT
.../notification-preferences` requests fired and succeeded (bodies `{smsReminders:false,...}`
then `{smsReminders:true,...}`, i.e. two independent, correctly-ordered toggles rather than a
desync), and the final UI state matched the server state after a reload. Reverted to the
original baseline (checked) and reconfirmed after a final reload - the shared account was left
exactly as found. No defect.

## New defect - export-data dialog doesn't return focus to its trigger on close

See `defects/dialog-close-does-not-return-focus-to-trigger/README.md`. The dialog itself is
well-built for keyboard use - confirmed a real focus trap (8 consecutive `Tab` presses cycled
through exactly its own 4 focusable elements, never escaping to the page) and `Escape` correctly
cancels without triggering an export. But once closed, `document.activeElement` becomes `<body>`
rather than the "Exporter mes données" button that opened it (confirmed via direct equality
check, not just an inference) - a keyboard/screen-reader user loses their place and has to
re-navigate from the top of the page. Swept every other "Modifier"/"Changer" control that exists
on both `/fr/security` and `/fr/my-profile` to map the real scope: all 4 controls on
`/fr/security` (export, password, email, phone) share the identical gap, while both controls on
`/fr/my-profile` (Localisation & langue, Contact d'urgence) correctly return focus to their own
trigger - a clean page-level split, not one shared component with a universal gap. Useful side
effect: `/fr/my-profile`'s component is a working reference implementation already in the same
codebase for whoever fixes `/fr/security`'s.
