# 001.5 - Upload slots render — 2 mandatory documents only

**Result:** 🔴 MISMATCH (tracked as `defects/doctor-kyc-form-field-mismatches`)

## How to test
1. Open the KYC verification form (`/fr/kyc`).
2. Inspect the "Justificatifs" section's two upload slots and read each one's
   Obligatoire/Facultatif (mandatory/optional) label.

## Expected
Per the test case title, both document slots should be marked mandatory.

## Actual
Only **one** of the two slots is mandatory:
- "Pièce d'identité (CNI, passeport ou carte professionnelle)" - **Facultatif**
- "Attestation ou carte d'inscription à l'Ordre des médecins (ou équivalent)" - **Obligatoire**

See `000-ui-kyc-verification/000-kyc-form-initial-state.png` for the full-page evidence (shared
with test case 000, since both are read from the same initial form state). Either this test
case's expectation doesn't match the real requirement, or the ID document should also be
mandatory - needs the real spec to resolve; not asserted as definitely wrong.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
Get an explicit product decision on whether the ID document should be mandatory. Whichever way
it's resolved, update either the app or this test case's own wording - leaving the mismatch open
means future QA passes will keep re-flagging the same ambiguity.
