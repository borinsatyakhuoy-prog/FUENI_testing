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
