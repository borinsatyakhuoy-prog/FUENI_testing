# User Story: FUENI

## Story Title
FUENI : FUENI is open to doctors practicing individually in one of our 9 covered countries.

## Story Description
FUENI is a digital health platform ("Plateforme santé digitale") serving Francophone Africa,
currently covering 9 countries (MVP). Its tagline: "Une plateforme. Tous vos soins." (One
platform. All your care.) - patients can book appointments, manage medical documents, and stay
connected with their care team; independently-practicing doctors get their own professional
space ("Espace professionnel"). The platform advertises AES-256 encryption at rest, GDPR/HDS
(Hébergeur de Données de Santé - the French health-data-hosting certification) compliance, and
ISO 27001. This story covers only the **patient role** ("Espace Patient").

As of this exploration (2026-08-17, project at sprint SCRUM-10), the patient app is early-stage:
authentication and account/profile management are fully built, but the core care features
(appointments, documents) are still placeholders ("Bientôt disponible" - Coming soon). See AC2
below for exactly what's live vs. anticipated.

## Application URL
## Old stable version
https://fueni-staging-patient.allweb.cloud
## Staging new ver
https://fueni-staging-preview-patient.allweb.cloud
(Note 2026-08-17: an earlier draft of this file listed `fueni-staging-preview-auth.allweb.cloud`
here, which is the bare Keycloak identity server - visiting it directly lands on the raw
Keycloak Administration Console, not the app. `preview-patient` is the correct host; it
redirects through that same Keycloak realm (`fueni-platform`) to the branded FUENI login, same
as the old stable version above. Both hosts were confirmed live and go through the same
Keycloak realm; the automated suite targets `preview-patient` as the "new" version per
`FUENI_BASE_URL`, with `FUENI_OLD_BASE_URL` kept for before/after comparison.)
(For now focus on exploring the patient role app)
(can create your own patient for now sms not available, only OTP from email is available -
CLARIFIED 2026-08-17: this refers to flows that offer an explicit Téléphone/E-mail method
choice - confirmed live that the password-reset wizard's "E-mail" tab genuinely sends a working
e-mail OTP ("un code à 6 chiffres a été envoyé à l***@hutdot.com"). The public self-registration
wizard at `/fr/register` is different: its step 3 ("Vérification SMS") is phone-SMS-only with no
method choice and no e-mail fallback - confirmed live with a disposable inbox + fake phone
number, which correctly could not complete past that step. So: wherever a Téléphone/E-mail tab
choice exists (login, password-reset), pick E-mail for automation; registration itself has no
such choice and needs a real/receivable phone number to complete end-to-end. See
test-results/exploratory-findings.md and specs/planner/06-registration.md.)
## Test Credentials
Credentials are not stored in this file. Copy `.env.example` to a local `.env`
(gitignored, never committed) and set `FUENI_EMAIL` / `FUENI_PASSWORD` there. The automated
suite in `tests/fueni-test/` reads these same variables.

This is a single shared patient test account (not a synthetic-per-test one) - see the
Business Rules / real-data-safety note below before writing any test that mutates it
(password, e-mail, phone, emergency contact, location).

## Acceptance Criteria

### AC1: Authentication
- A user can log in with a valid email/password (or phone/password) and is redirected to the
  Dashboard (`/fr/dashboard`).
- Invalid credentials show a single alert - "Identifiant ou mot de passe incorrect." - and keep
  the user on the login page.
- Submitting the login form with empty fields shows one combined alert - "Veuillez saisir votre
  identifiant et votre mot de passe." - rather than two separate per-field inline messages.
  (Confirmed live 2026-08-17; an earlier draft of this AC assumed separate inline "required"
  errors per field - corrected to match actual behavior.)
- A "Mot de passe oublié ?" (Forgot password?) link is available and navigates to a dedicated
  3-step reset wizard (Identifiant → Code → Mot de passe), gated by a Cloudflare Turnstile
  check before the "Envoyer le code" button enables.
- Signing out ("Se déconnecter") ends the session; protected routes then redirect back to the
  Keycloak login. Confirmed live: after sign-out, navigating directly to `/fr/dashboard`
  redirects to the login page rather than showing cached content.
- Login form defaults to the "Téléphone" tab, not "E-mail" - tests must explicitly switch tabs
  before filling the email/password fields.

### AC2: Navigation
Confirmed live via login with the credentials above. The patient app is a sidebar layout with
three grouped sections plus a top bar:

- **MON ESPACE** (My Space)
  - Tableau de bord (`/fr/dashboard`) - **built.** Greeting ("Bonjour {first name}"), a
    "Prendre un RDV" CTA button, an empty-state appointments card ("Prenez un rendez-vous pour
    commencer.") and an empty-state documents card ("Vos documents médicaux apparaîtront ici."),
    each with a "Tout voir" (see all) button, and a "Compléter mon profil" banner.
  - Mes RDV (`/fr/appointments`) - **not yet developed.** Shows a generic "Bientôt disponible"
    placeholder.
  - Prendre RDV (`/fr/book`) - **not yet developed.** Same placeholder.
  - Mes documents (`/fr/documents`) - **not yet developed.** Same placeholder.
- **MON COMPTE** (My Account)
  - Mon profil (`/fr/my-profile`) - **built.** Read-only "Identité" section (first/last name,
    DOB, sex at birth - not self-editable; a mailto link routes corrections to
    support@fueni.com), an editable "Localisation & langue" section (country/region/city,
    account language, spoken languages, address), an editable "Contact d'urgence" section
    (name, relationship, phone), and "Préférences de notification" toggles (SMS/email
    appointment reminders).
  - Connexion & Sécurité (`/fr/security`) - **built.** Shows verified email/phone with
    "Modifier" buttons, a "Changer" password action, a GDPR JSON data export
    ("Exporter mes données" - read-only, safe to automate for real), account-deletion
    instructions (support-mediated only, no self-service yet), and links to Privacy
    Policy / Terms of Service.
- **AIDE** (Help)
  - FAQ (`/fr/faq`) - **not yet developed.** Placeholder.
  - Contacter le support (`/fr/support`) - **not yet developed.** Placeholder.
- Bottom of sidebar: "Se déconnecter" (sign out).
- Top bar: sidebar toggle, language switcher (French confirmed; toggle present but only "fr"
  seen so far), and a "Notifications" bell button.

Anticipated next (not yet buildable as real automated tests, only documented as pending scope):
booking a real appointment end-to-end, viewing/uploading medical documents, FAQ content, and a
live support contact flow. These should be revisited each time SCRUM advances past sprint 10.

### Error Handling
- Invalid login and empty-field submission both produce a visible, specific alert rather than a
  silent failure (confirmed above).
- Found during exploration: signing out triggers a caught-but-real client-side error - a
  CORS-blocked fetch for a Next.js RSC payload during the post-logout redirect (`Access to
  fetch ... blocked by CORS policy`), which the app silently falls back from to a full browser
  navigation. The end-user experience is unaffected (login page still loads correctly), but it's
  a genuine console error worth fixing upstream and worth a regression test that asserts no
  uncaught console errors survive logout. See test-results/exploratory-findings.md.
- Real-data safety: this suite logs into a **single shared patient account**, not an isolated
  per-test one. Tests must not actually submit account-mutating actions - changing password,
  email, phone, or the profile's Localisation/Emergency-contact fields - since that would break
  every other test relying on these credentials. Where a test needs to open one of those edit
  dialogs, it must stop at validating the form/disabled-state and then Cancel, the same
  principle used for FAPA's Add Client/Add User dialogs. The GDPR "Exporter mes données" export
  and the registration wizard (using a disposable inbox via the temp-mail MCP server) are the
  two safe real-write exceptions, since they don't touch the shared login account.

## Business Rules
- FUENI is a paid-subscription platform for independently-practicing doctors across 9 (MVP)
  Francophone African countries; this story's scope is the **patient**-role app only, not the
  doctor ("Espace professionnel") or admin sides.
- Legal identity fields (first/last name, DOB, sex at birth) are not self-editable by the
  patient once set - corrections must go through support@fueni.com.
- Account deletion is support-mediated only ("self-service deletion coming later" per the UI's
  own copy) - there is no in-app delete-account flow to test yet.
- The platform claims AES-256 encryption at rest, GDPR + HDS (French health-data-hosting
  certification) compliance, and ISO 27001 - no direct test coverage for these claims is
  planned here (out of scope for UI/E2E testing), but the GDPR data-export feature is in scope
  as a functional test.
- Registration requires accepting two separate consents (general T&Cs, and a
  medical-data/GDPR-specific one) - both are mandatory checkboxes.

## Technical Notes
- Use Playwright for test automation.
- Test across Chrome, Firefox, and Safari browsers.
- Validate all form validation messages.
- Test navigation flow and back button behavior.
- The registration and password-reset wizards are gated by a Cloudflare Turnstile challenge
  ("Un instant - vérification de votre sécurité…" while the submit button is disabled) -
  automated tests exercising these flows must wait for that check to clear rather than assuming
  the submit button is immediately interactive.
- Where a real end-to-end signup/OTP-email test is wanted, use the `temp-mail` MCP server to
  generate a disposable inbox rather than a real address - this keeps registration tests
  self-contained and repeatable without depending on a fixed synthetic account.

## Definition of Done
- [x] All acceptance criteria have test cases (for currently-built features; not-yet-built
      features tracked in specs/planner/07-future-features.md instead, per project convention)
- [x] Manual exploratory testing completed (for currently-built features; placeholders noted)
- [x] Automated test scripts created and passing (29/32 reliably; 1 fails by design pending a
      real fix, 2 blocked by Cloudflare bot-detection - see test-results/Report.md)
- [x] Test results documented (test-results/Report.md, test-results/exploratory-findings.md)
- [x] Bugs logged for any failures (see test-results/Report.md, Defects Log)
- [x] Code committed to repository
