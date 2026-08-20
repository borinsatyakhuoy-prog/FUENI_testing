# 002 - KYC documents - no date validation required

**Result:** ✅ PASS (by absence)

## How to test
1. Open the KYC verification form (`/fr/kyc`).
2. Inspect the "Justificatifs" section for any expiry-date, issue-date, or other date-related
   input fields attached to either document upload slot.

## Expected
Per the test case title, no date validation should be required for the uploaded documents.

## Actual
Confirmed - no date fields of any kind exist anywhere in the Justificatifs section, only the
file-upload controls themselves. See `000-ui-kyc-verification/000-kyc-form-initial-state.png`
(shared evidence with test case 000).

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.
