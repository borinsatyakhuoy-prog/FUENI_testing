# Connexion & Sécurité

[← index](README.md)

### 5. Connexion & Sécurité

**Seed:** `tests/seed.spec.ts`

IMPORTANT: this page can change the shared test account's password/e-mail/phone for real. Every
test below except 5.4 (GDPR export) stops at validating the dialog and Cancels - never submits.

#### 5.1. Coordonnées & connexion displays verified email/phone

**File:** `tests/fueni-test/security/001_contact-info-display.spec.ts`

**Steps:**
  1. Log in, navigate to `/fr/security`
    - expect: "Adresse e-mail" shows the account's e-mail with a "Vérifié" badge and a
      "Modifier" button
    - expect: "Téléphone" shows the account's phone with a "Vérifié" badge and a "Modifier"
      button

#### 5.2. Modifier (email/phone) - inline edit form opens and can be cancelled

**File:** `tests/fueni-test/security/002_contact-info-edit-cancel.spec.ts`

**Steps:**
  1. Click "Modifier" next to Adresse e-mail
    - expect: The section swaps in place to an edit form (confirmed live: not a modal `dialog`,
      same in-place pattern as Mon profil's sections), with "Annuler"/"Enregistrer" buttons -
      "Enregistrer" starts disabled since the field is unchanged
  2. Click "Annuler"
    - expect: The section reverts to display mode; the displayed e-mail is unchanged
  3. Repeat for "Modifier" next to Téléphone
    - expect: Same pattern, cancel leaves the displayed phone unchanged

#### 5.3. Changer (password) - edit form opens and can be cancelled

**File:** `tests/fueni-test/security/003_change-password-cancel.spec.ts`

**Steps:**
  1. Click "Changer" under "Mot de passe" (use an exact name match - a substring match on
     "Changer" also matches the unrelated "Changer de langue" top-bar button)
    - expect: A change-password form opens (with an "Annuler" button)
  2. Click "Annuler"
    - expect: Still on `/fr/security` with the "Changer" button back in view - a direct,
      same-page proof that cancelling was a true no-op. (An earlier version of this test
      proved the same thing indirectly by signing out and logging back in - that round-tripped
      through the app's delayed post-logout redirect, described in the Error Handling section
      above, and was flaky for reasons unrelated to what this test actually checks.)

#### 5.4. Export my data (GDPR) - safe real action, gated by a re-auth prompt

**File:** `tests/fueni-test/security/004_export-data.spec.ts`

**Steps:**
  1. Under "Mon compte & mes données", click "Exporter mes données"
    - expect: A "Confirmez votre identité" dialog appears first, requiring the current password
      before the export proceeds (confirmed live - not mentioned in the original exploratory
      pass; the "Continuer" button stays disabled until a password is entered)
  2. Enter the account's password and click "Continuer"
    - expect: A JSON file download starts/completes (read-only export once past the re-auth
      check - safe to run for real, per the plan's real-data-safety note)
    - expect: The downloaded file is valid JSON and does not error

#### 5.5. Account deletion is support-mediated, no self-service flow yet

**File:** `tests/fueni-test/security/005_delete-account-support-only.spec.ts`

**Steps:**
  1. Under "Mon compte & mes données", inspect the "Supprimer mon compte" area
    - expect: No in-app delete button/flow is present - only explanatory text plus a
      `mailto:support@fueni.com?subject=Suppression de mon compte FUENI` link
