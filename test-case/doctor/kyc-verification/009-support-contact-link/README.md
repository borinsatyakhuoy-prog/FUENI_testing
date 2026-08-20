# 009 - KYC screen - support contact link available

**Result:** 🟡 PARTIAL (present on one screen, absent on another)

## How to test
1. Open the KYC verification upload form (`/fr/kyc`, pre-submission) and look for a support
   contact link or button.
2. Submit a complete KYC dossier, then look at the resulting post-submission status screen for
   the same.

## Expected
A support contact link/button should be available on "the KYC screen".

## Actual
- **Upload form (pre-submission):** no support link/button present anywhere on the page - see
  `000-ui-kyc-verification/000-kyc-form-initial-state.png`.
- **Post-submission status modal ("Vérification en cours"):** a "Contacter le support" button
  **is** present - see `013-frozen-during-review/013-frozen-during-review.png`.

Result depends on which specific screen the test case means by "the KYC screen" - flagging both
observations rather than picking one.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.
