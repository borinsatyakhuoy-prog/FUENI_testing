# Registration

[← index](README.md)

### 6. Registration

**Seed:** `tests/seed.spec.ts`

Confirmed live end-to-end through step 3 (2026-08-17, disposable inbox
`7cf73e868a63149c@emalupe.com` via the `temp-mail` MCP server, fake phone `+855 98765432`): the
registration wizard at `/fr/register` is a 3-step flow (Inscription → Profil de base →
Vérification SMS), Turnstile-gated. **Step 3 is phone-SMS-only** - "Un code à 6 chiffres a été
envoyé par SMS au {phone}", no e-mail fallback offered - so it cannot be completed end-to-end
without a real, receivable phone number. This is a different flow from login/password-reset,
which do offer an explicit Téléphone/E-mail method tab and were confirmed to genuinely send a
working e-mail OTP when "E-mail" is chosen (see 01-auth.md §1.4/§1.8) - don't confuse the two
when reading `user-stories/SCRUM.md`'s "SMS not available, only OTP from email" note.

#### 6.1. Registration form (step 1) required-field and password-strength validation

**File:** `tests/fueni-test/registration/001_step1-validation.spec.ts`

**Steps:**
  1. Navigate to `/fr/register`
    - expect: "Étape 1 / 3 - Inscription" is shown with Prénom, Nom, Date de naissance (18+
      required, a calendar picker that disables dates within 18 years of today), Sexe à la
      naissance, Adresse e-mail, Téléphone, and Mot de passe fields, plus two mandatory consent
      checkboxes and a "Créer mon compte" button
  2. Type a weak password (e.g. `abc`) into Mot de passe
    - expect: The live password-strength checklist (8-128 chars / uppercase / lowercase /
      digit / special char / no spaces) reflects which rules are unmet, and the strength meter
      shows "Faible" (Weak); a strong password (confirmed live: `TestAutomation123!`) shows
      "Très fort"
  3. Attempt to submit without checking the consent boxes
    - expect: Submission is blocked / a validation message appears (both consents are marked
      required with `*`)
  - Observed live (not asserted in the automated spec, since it depends on incidental data
    state rather than a designed fixture): submitting a phone number that's already registered
    to another account shows a specific alert - "Ce numéro de téléphone est déjà enregistré." -
    not a generic failure. Worth knowing about if 6.2 ever flakes on a phone-collision error.

#### 6.2. Step 1→2 happy path with a uniquely-generated test identity

**File:** `tests/fueni-test/registration/002_step1-to-step2.spec.ts`

Since step 3 (SMS verification) can't be completed by this suite anyway (see 6.3), this test
never needs to actually read the e-mail inbox it registers with - a per-run unique, clearly
non-real address (`qa-automation+{timestamp}@example.com`) is enough to avoid the "already
registered" collision confirmed in 6.1, without any dependency on the `temp-mail` MCP server
being reachable from the Playwright test runner itself (MCP tools are only callable from
Claude's own tool-use, not from Node code running inside a spec file - `temp-mail` was used
directly during the exploratory pass, not wired into this automated spec). If a future test
needs to actually read a registration confirmation e-mail, that would require either a real
mailbox-polling API called directly from the spec, or re-scoping to run through Claude/MCP as
an exploratory (not CI) step.

**Steps:**
  1. Generate a unique e-mail (`qa-automation+{Date.now()}@example.com`) and a unique national
     phone number for this run
  2. Complete step 1 (Inscription) with that identity, a fresh unused phone number, a
     valid strong password, and both consents checked, then click "Créer mon compte"
    - expect: Advances to "Étape 2 / 3 - Profil de base"
  3. Select a "Pays de service" (confirmed live: exactly the 9 MVP countries - Bénin, Burkina
     Faso, Cameroun, Côte d'Ivoire, Mali, Niger, RD Congo, Sénégal, Togo), then the now-enabled
     Région and Ville cascading comboboxes, then click "Suivant"
    - expect: Advances to "Étape 3 / 3 - Vérification SMS"
    - Note (minor UI bug worth flagging, not blocking): "Langue du compte" on this step
      defaulted to **English** in a French-language session - inconsistent with the rest of the
      app/wizard being in French.

#### 6.3. Step 3 (SMS verification) - confirmed not automatable without a real phone

**File:** none - intentionally not implemented as an automated spec.

Confirmed live: step 3 displays a one-time-passcode input, a "Renvoyer le code" resend timer,
and a "Vérification et accès à mon compte" button, after genuinely dispatching an SMS to the
phone number entered in step 1. Since this suite has no SMS-receiving capability (only
`temp-mail` for e-mail), full registration cannot be verified end-to-end here. If a real,
dedicated test phone number becomes available, extend 6.2 to enter the received code and assert
the new account can subsequently log in - until then, this is documented as a known gap rather
than left unautomated silently.
