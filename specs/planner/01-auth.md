# Authentication

[← index](README.md)

### 1. Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. Successful login with valid credentials (e-mail)

**File:** `tests/fueni-test/auth/001_login-success.spec.ts`

**Steps:**
  1. Navigate to `/login`
    - expect: The login page shows "Bon retour", a Téléphone/E-mail tab pair (Téléphone
      selected by default), a Mot de passe field, "Mot de passe oublié ?" link, "Rester
      connecté" checkbox, and a "Connexion" button
  2. Click the "E-mail" tab
    - expect: The tabpanel switches to a single "Identifiant" textbox (placeholder
      "Adresse e-mail")
  3. Fill the Identifiant and Mot de passe fields with the valid test credentials from
     `user-stories/SCRUM.md` / `.env`
    - expect: Both fields accept the input; the password is masked by default (toggle button
      "Afficher/masquer le mot de passe" present)
  4. Click "Connexion"
    - expect: The user is redirected to `/fr/dashboard`
    - expect: The dashboard greets the user by first name ("Bonjour {name} 👋")

#### 1.2. Login fails with invalid credentials

**File:** `tests/fueni-test/auth/002_login-invalid-credentials.spec.ts`

**Steps:**
  1. On the login page, switch to the "E-mail" tab and enter a non-existent e-mail with any
     password
    - expect: Both fields accept the typed values
  2. Click "Connexion"
    - expect: The user remains on the login page
    - expect: An alert reading "Identifiant ou mot de passe incorrect." appears

#### 1.3. Required-field validation on empty login submit

**File:** `tests/fueni-test/auth/003_login-empty-fields.spec.ts`

**Steps:**
  1. On the login page ("E-mail" tab), without entering any values, click "Connexion"
    - expect: A single combined alert appears - "Veuillez saisir votre identifiant et votre mot
      de passe." - not two separate per-field messages
    - expect: The user stays on the login page

#### 1.4. Forgot password link starts the reset wizard

**File:** `tests/fueni-test/auth/004_forgot-password-wizard-start.spec.ts`

**Steps:**
  1. On the login page, click "Mot de passe oublié ?"
    - expect: The app navigates to `/fr/password/reset`, showing "Étape 1 / 3" with a 3-step
      indicator (Identifiant → Code → Mot de passe)
    - expect: A Téléphone/E-mail method tablist is shown for the identifier step
    - expect: The "Envoyer le code" button starts disabled while a Cloudflare Turnstile check
      ("Un instant — vérification de votre sécurité…") runs, and the test must wait for that
      check to clear rather than assuming the button is immediately interactive
  - Known CI-reliability caveat: passed reliably in isolation, but Turnstile was observed to
    stop clearing at all (not just slowly) after several consecutive automated runs in a short
    window - almost certainly bot-detection escalation, not a timing issue. See
    test-results/exploratory-findings.md.

#### 1.5. Sign out ends the session

**File:** `tests/fueni-test/auth/005_sign-out.spec.ts`

**Steps:**
  1. Log in, then click "Se déconnecter" in the sidebar
    - expect: The app redirects to the Keycloak login (the same branded FUENI login page)
  2. Navigate directly to `/fr/dashboard` after signing out
    - expect: The app redirects back to the login page rather than showing cached dashboard
      content

#### 1.6. Logout produces no console errors (regression for Issue 1)

**File:** `tests/fueni-test/auth/006_logout-no-console-errors.spec.ts`

**Steps:**
  1. Log in, attach `page.on('console')`/`page.on('pageerror')` listeners, then click
     "Se déconnecter"
    - expect: No `error`-level console messages or page errors fire during the redirect
    - **Known issue (2026-08-17):** this currently fails - a CORS-blocked fetch for a Next.js
      RSC payload during the post-logout redirect throws a caught console error before falling
      back to full navigation (see `test-results/exploratory-findings.md`, Issue 1). The
      end-user flow itself isn't broken (login page still loads), so this spec documents the
      known defect rather than blocking the suite - keep it in the suite (not `.skip`) so it
      flips to passing the moment the underlying issue is fixed.

#### 1.7. Login form defaults to the Téléphone tab

**File:** `tests/fueni-test/auth/007_login-defaults-to-phone-tab.spec.ts`

**Steps:**
  1. Navigate to `/login` fresh (no prior tab selection in this browser context)
    - expect: The "Téléphone" tab is selected by default, showing a country-code combobox
      (defaulting to "Cambodge (+855)" in this environment) and a national-number textbox
    - expect: Clicking "E-mail" switches to the single Identifiant textbox described in 1.1

#### 1.8. Forgot password - E-mail method sends a working OTP

**File:** `tests/fueni-test/auth/008_forgot-password-email-otp.spec.ts`

**Steps:**
  1. On `/fr/password/reset`, click the "E-mail" tab and enter the test account's e-mail, then
     click "Envoyer le code"
    - expect: Advances to "Étape 2 / 3 - Code" showing "Si un compte est associé à cet
      identifiant et que celui-ci est vérifié, un code à 6 chiffres a été envoyé à
      {masked e-mail}." (confirmed live: a genuine e-mail OTP dispatch, not a dead end), a
      one-time-passcode input, and a resend timer
  - Note: unlike the registration wizard (see 06-registration.md), this flow's "E-mail" method
    is a real, working alternative to SMS - this is what `user-stories/SCRUM.md`'s "SMS not
    available, only OTP from email" note actually refers to. Do not complete this test past
    step 2 against the shared account without a way to read that inbox and without intending to
    actually change its password - stop at asserting the "code sent" state.

#### 1.9. Phone tab login succeeds (AC1's "or phone/password" path)

**File:** `tests/fueni-test/auth/009_phone-login-success.spec.ts`

**Steps:**
  1. On the login page ("Téléphone" tab, the default), enter the shared test account's national
     phone number (`FUENI_PHONE_NATIONAL` - the "+855" country code is already the default) and
     the account password, then click "Connexion"
    - expect: Redirected to `/fr/dashboard`, same as the e-mail-tab path (1.1)
  - Confirmed live 2026-08-18: this path was previously documented in AC1 but never actually
    exercised by the suite - all other auth specs use the E-mail tab exclusively.

#### 1.10. Browser back button after logout does not restore cached protected content

**File:** `tests/fueni-test/auth/010_back-button-after-logout.spec.ts`

**Steps:**
  1. Log in, navigate to `/fr/security`, then click "Se déconnecter"
  2. Press the browser back button
    - expect: Does not show the cached "Connexion & Sécurité" page - a fresh Keycloak auth
      challenge is issued instead, and the login form is shown
  - Confirmed live 2026-08-18: addresses the `user-stories/SCRUM.md` Technical Notes item "test
    navigation flow and back button behavior", previously untested. No defect found.

#### 1.11. Password show/hide toggle actually unmasks and re-masks the field

**File:** `tests/fueni-test/auth/011_password-show-hide-toggle.spec.ts`

**Steps:**
  1. On the login page, type a value into "Mot de passe", then click "Afficher/masquer le mot
     de passe"
    - expect: The input's `type` attribute flips from `password` to `text`
  2. Click the toggle again
    - expect: Flips back to `type="password"`
  - Confirmed live 2026-08-18: previously only asserted the toggle button was present (1.1), not
    that it actually changes the field's masking. No defect found.
