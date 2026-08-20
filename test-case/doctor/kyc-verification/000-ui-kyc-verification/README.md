# 000 - UI Doctor KYC Verification

**Result:** ✅ PASS

## How to test
1. Log in as a doctor with a PENDING_KYC account.
2. From the dashboard, click "Compléter mon dossier de vérification" (or navigate directly to
   `/fr/kyc`).
3. Observe the form that renders.

## Expected
The KYC verification form should render with: professional-info fields (specialty, medical
order number, national ID number, region/city, practice address), the two document upload
slots, the three declaration checkboxes, and submit/save-draft actions.

## Actual
Matches expected exactly - see `000-kyc-form-initial-state.png`. No missing sections, no broken
layout, no console errors observed.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation (not the automated
chromium/firefox/webkit suite runs used elsewhere in this project) - not yet cross-browser
tested.
