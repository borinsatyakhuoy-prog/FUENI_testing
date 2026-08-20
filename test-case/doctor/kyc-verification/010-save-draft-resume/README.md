# 010 - KYC draft saved and resumed later (cross-device)

**Result:** 🟡 PARTIAL, not fully verified - no screenshot (nothing distinguishing to capture
for the untested part)

## How to test
1. Open the KYC verification form and partially fill it in (some fields, maybe one document).
2. Click "Enregistrer et reprendre plus tard" (save and resume later).
3. Log out.
4. Log back in - ideally from a different browser/device/session - and reopen the KYC form.
5. Confirm the previously-entered data and uploaded document are still there.

## Expected
The draft should persist server-side and reload correctly regardless of which device/session
resumes it.

## Actual
Confirmed structurally: the "Enregistrer et reprendre plus tard" button is **disabled** on a
completely empty form and becomes **enabled** once at least some data has been entered (observed
during the 011/012 test flow). This session did **not** verify the actual save → log out → log
back in (especially cross-device) → data-restored round trip - that would need a second, genuinely
separate browser context/session, which wasn't set up this pass.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested, and
the cross-device aspect specifically was not tested at all.
