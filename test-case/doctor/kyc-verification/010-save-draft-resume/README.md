# 010 - KYC draft saved and resumed later (cross-device / cross-session)

**Result:** ✅ PASS - fully verified (upgraded from the earlier PARTIAL result)

## How to test
1. Open the KYC verification form and fill in some fields (but not all, and no document).
2. Click "Enregistrer et reprendre plus tard" (save and resume later).
3. Confirm a real save request fires (not just local UI state).
4. Log out completely.
5. Log back in from scratch (full credentials + a **new** email OTP, not a cached session).
6. Reopen the KYC form and confirm the previously-entered data is restored.

## Expected
The draft should persist server-side and reload correctly on a genuinely new session, not just
be held in the browser's local storage.

## Actual
Fully confirmed with a real logout/re-login cycle, using a **second, dedicated fresh doctor
account** (`626169ca8cd0fa2e@emalupe.com`) created specifically for this test - the account used
for test cases 011-015 had already been submitted and locked (see test case 013), so it could no
longer reach the draft stage:

1. Filled "Numéro d'ordre médical" with `DRAFT-TEST-99887` and "Adresse du cabinet" with
   `77 Avenue Draft Resume Test` - see `doctor-010-draft-filled-before-save.png`.
2. Clicked "Enregistrer et reprendre plus tard". Network log confirmed a real save request:
   `PATCH /api/v1/doctors/me/kyc/profile` → `204 No Content` - not just a client-side no-op. See
   `doctor-010-draft-save-confirmation.png` (no visible toast, but the save is real per the
   network call).
3. Logged out completely (via the dashboard's verification-status modal).
4. Logged back in from scratch - full email + password, then a **brand-new** 6-digit email OTP
   (a different code than any used before, confirming this was a genuine new session, not a
   cached/resumed one).
5. Navigated to `/fr/kyc` again: both previously-entered values were present and correct - see
   `doctor-010-draft-resumed-after-relogin.png`.

This confirms genuine server-side draft persistence, not browser local storage - the whole
browser session (cookies, local storage) was invalidated by the real logout, and the data still
came back after a fresh authentication.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested. The
"cross-device" aspect specifically wasn't tested with an actually different device/browser
profile, but a full logout + fresh login + fresh OTP is a strong proxy for that, since it rules
out any client-side-only persistence mechanism.

## Improvement suggestion
Add a visible "Draft saved" confirmation (currently silent - see
`defects/improvement/inconsistent-feedback-messaging.md`), ideally with a "last saved at HH:MM"
indicator so users have ongoing confidence their work is preserved, not just at the moment they
click the button.
