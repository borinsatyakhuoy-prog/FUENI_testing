# Mon profil

[← index](README.md)

### 4. Mon profil

**Seed:** `tests/seed.spec.ts`

IMPORTANT: this page's "Localisation & langue" and "Contact d'urgence" sections are editable via
real inline edit forms (confirmed live: "Modifier" swaps the section into edit mode in place,
with "Annuler"/"Enregistrer" buttons - not a modal dialog) against the **shared** patient test
account. Per the real-data-safety note in `specs/planner/README.md`, tests below stop at
validating the form and clicking "Annuler" - they must not click "Enregistrer".

#### 4.1. Identité section is read-only and routes corrections to support

**File:** `tests/fueni-test/profile/001_identity-read-only.spec.ts`

**Steps:**
  1. Log in, navigate to `/fr/my-profile`
    - expect: An "Identité" section shows Prénom, Nom, Date de naissance, and Sexe à la
      naissance as plain text (no edit control for this section)
    - expect: A note states this legal-identity info isn't editable online and links to
      `mailto:support@fueni.com?subject=Correction de mes informations personnelles`

#### 4.2. Localisation & langue - inline edit form opens and can be cancelled

**File:** `tests/fueni-test/profile/002_location-edit-cancel.spec.ts`

**Steps:**
  1. On `/fr/my-profile`, in "Localisation & langue", click "Modifier"
    - expect: The section swaps in place to an edit form (confirmed live: a country combobox,
      region/city "Sélectionner ou ajouter…" buttons, an account-language combobox, an
      "Ajouter une langue…" control, and an address textbox), with "Annuler"/"Enregistrer"
      buttons appearing below it
  2. Click "Annuler"
    - expect: The section reverts to display mode; the values (confirmed live: Bénin / Alibori
      / Gogounou / Français) remain unchanged

#### 4.3. Contact d'urgence - inline edit form opens and can be cancelled

**File:** `tests/fueni-test/profile/003_emergency-contact-edit-cancel.spec.ts`

**Steps:**
  1. On `/fr/my-profile`, in "Contact d'urgence", click "Modifier"
    - expect: The section swaps in place to an edit form showing the current name,
      relationship (lien de parenté), and emergency phone number, with "Annuler"/"Enregistrer"
      buttons
  2. Click "Annuler"
    - expect: The section reverts to display mode; the values remain unchanged

#### 4.4. Notification preference toggles reflect their current state

**File:** `tests/fueni-test/profile/004_notification-preferences-display.spec.ts`

**Steps:**
  1. On `/fr/my-profile`, inspect "Préférences de notification"
    - expect: Two switches are shown - "Rappels de rendez-vous par SMS" and "Rappels de
      rendez-vous par e-mail" - both confirmed "On" by default in this environment
    - expect: Explanatory text clarifies this only affects appointment reminders, not
      essential security/confirmation notifications
  - Note: toggling these is a real account-state mutation; a full toggle-and-revert test is
    deferred until confirmed idempotent/safe against the shared account - for now this test
    only asserts the displayed state, does not click the switches.

#### 4.5. SMS notification-reminder toggle is a real, persisted, safely revertible mutation

**File:** `tests/fueni-test/profile/005_notification-preference-toggle-persists.spec.ts`

**Steps:**
  1. On `/fr/my-profile`, click the "Rappels de rendez-vous par SMS" switch
    - expect: A `PUT /api/v1/patients/me/notification-preferences` request fires and returns
      200; the switch flips to "Off"
  2. Reload the page
    - expect: The switch is still "Off" - confirming this is a real persisted mutation, not just
      local UI state
  3. Click the switch again to revert it
    - expect: Flips back to "On" and stays "On" (wrapped in `try`/`finally` so the shared
      account's real state is restored even if an earlier assertion fails)
  - Confirmed live 2026-08-18, resolving 4.4's deferred question: this is safe to automate for
    real. No defect found; occasionally flaky on the first PUT response in CI (self-heals via
    the suite's global `retries: 2`) - see `test-results/Report.md`.

#### 4.6. Cancelling an edit dialog genuinely discards the typed change

**Files:** `tests/fueni-test/profile/006_location-cancel-discards-edits.spec.ts`,
`tests/fueni-test/profile/007_emergency-contact-cancel-discards-edits.spec.ts`

**Steps:**
  1. Open "Modifier" on "Localisation & langue" (or "Contact d'urgence"), type a new value into
     a field, then click "Annuler"
  2. Reopen the same "Modifier" dialog
    - expect: The field shows its original value, not the typed one
  - Confirmed live 2026-08-19: goes beyond 4.2/4.3 (which only check the dialog closes) to prove
    Annuler isn't just hiding the form with the edit still cached client-side. No defect found.
  - **Real-data-safety note:** a submit-based validation test (e.g. an invalid phone format,
    asserting a rejection message) was deliberately not added for these dialogs - there's no way
    to confirm in advance that `Enregistrer` would reject bad data rather than silently persist
    it to the shared account, and this suite never clicks Enregistrer here. See
    `test-results/Report.md` Session 6 for the same call made on the security page's edit forms.
