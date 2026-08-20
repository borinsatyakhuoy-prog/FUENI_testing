# 012 - KYC submission - complete file (documents + professional info)

**Result:** ✅ PASS

## How to test
1. Open the KYC verification form.
2. Fill in every required professional-info field with valid values.
3. Upload a valid PNG file to the mandatory document slot.
4. Check all three declaration checkboxes.
5. Click "Soumettre mon dossier".

## Expected
Submission should succeed, and the account should move into an "under review" state.

## Actual
Matches expected. The valid upload was accepted (`012-valid-upload-accepted.png`, showing
"Sélectionné — envoyé à l'enregistrement" with view/replace/delete controls), and submission
redirected to the dashboard with status "Vérification en cours" (`012-submission-success-dashboard.png`).

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
None needed - clean success path end-to-end.
