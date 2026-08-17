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
