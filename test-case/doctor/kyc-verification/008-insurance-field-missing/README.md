# 008 - Professional liability insurance - optional field

**Result:** 🔴 NOT FOUND (tracked as `defects/doctor-kyc-form-field-mismatches`)

## How to test
1. Open the KYC verification form (`/fr/kyc`).
2. Search the entire form (professional-info section, Justificatifs section, and any other
   visible section) for a field or upload slot related to professional liability insurance.

## Expected
Per the test case title, a professional liability insurance field/upload slot should be present,
marked optional.

## Actual
No such field, label, or upload slot exists anywhere on the form. Only the two document slots
(identity document, Ordre des médecins attestation), the professional-info text/select fields,
and the three declaration checkboxes are present. See
`000-ui-kyc-verification/000-kyc-form-initial-state.png` (shared evidence with test case 000).
Either this field is planned but not yet built, or it lives somewhere else in the app not found
this session.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.
