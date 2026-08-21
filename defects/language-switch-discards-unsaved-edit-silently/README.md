# Defect: Switching language while a profile edit form is open silently discards unsaved input

**Status:** CONFIRMED, reproduced 2026-08-21. Not yet covered by an automated test.

**Severity: Low.** No server-side data loss (nothing was ever saved, so the real account is
unaffected either way), but genuine user-facing data loss risk: a real user's unsaved edits to
their own profile are silently destroyed by an unrelated control, with zero warning.

**Environment:** `https://fueni-staging-preview-patient.allweb.cloud/fr/my-profile`,
authenticated session, "Contact d'urgence" edit form.

## Steps to Reproduce

1. Log in and go to "Mon profil" (`/fr/my-profile`).
2. Click "Modifier" on "Contact d'urgence" to open its inline edit form.
3. Type a new value into the "Nom" (or any) field - do **not** click "Enregistrer".
4. Click the language switcher and select "English".

## Description

Opening any of this page's inline edit forms (confirmed with "Contact d'urgence"; "Localisation
& langue" likely behaves the same, though that one's fields are dropdowns rather than free text)
and typing a value, then switching language via the authenticated-area language switcher, causes
a full page navigation (`/fr/my-profile` → `/en/my-profile` in this case - locale switching is
implemented as a full route change, not a client-side state update). This closes the edit form
and discards the typed value completely, with no confirmation prompt ("You have unsaved changes -
discard them?") of any kind beforehand.

Confirmed via direct DOM inspection: a distinctive probe string typed into the "Nom" field was
completely absent from the page's HTML immediately after the language switch completed.

## Expected Result

Either the language switcher should not trigger a full navigation while an edit form has unsaved
changes, or - more realistically, given locale switching is a routing-level concern - the app
should show a confirmation prompt before discarding unsaved edits, the same way most form-heavy
apps warn before navigating away from a dirty form.

## Actual Result

Unsaved input is silently and immediately discarded with no warning, triggered by a control
(the language switcher) that has nothing to do with the form being edited.

## Evidence

Confirmed live 2026-08-21 via Playwright: typed a timestamped probe string into the emergency-
contact "Nom" field, confirmed it was present (`toHaveValue`), triggered the language switch,
then confirmed via `page.content()` that the probe string no longer appeared anywhere in the
DOM. No confirmation/warning dialog appeared at any point in the sequence. The shared account's
real emergency-contact data was never at risk, since "Enregistrer" was never clicked - this
defect is about the missing warning, not actual persisted data loss.

## Recommendation

Add a standard "discard unsaved changes?" confirmation before any navigation (language switch,
sidebar link, browser back/forward) while a profile edit form is dirty. Low priority given no
real data loss occurs today, but worth fixing before any of these forms are extended to hold
more effort-intensive input (e.g. a longer address form) where losing typed work would be more
frustrating.
