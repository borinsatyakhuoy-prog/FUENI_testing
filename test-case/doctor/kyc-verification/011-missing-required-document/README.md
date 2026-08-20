# 011 - KYC submission - missing required document

**Result:** ✅ PASS

## How to test
1. Open the KYC verification form.
2. Fill in every professional-info field (specialty, medical order number, national ID number,
   region, city, practice address) with valid values.
3. Check all three declaration checkboxes.
4. Do **not** upload the mandatory document ("Attestation ou carte d'inscription à l'Ordre des
   médecins").
5. Click "Soumettre mon dossier".

## Expected
Submission should be blocked, with the missing mandatory document clearly flagged as the reason.

## Actual
Matches expected, cleanly isolated: every other field/checkbox shows valid (green), and the only
error shown is on the missing document slot: "Ce champ est obligatoire." See
`011-missing-document-only-highlighted.png`.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.
