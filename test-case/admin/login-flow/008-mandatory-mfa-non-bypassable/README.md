# 008 - Mandatory MFA — non-disableable, no skippable challenge, no bypassable token

**Result:** ✅ PASS

## How to test
1. Reach the OTP screen (see test case 007).
2. Look for any way to skip, disable, or bypass the challenge - a "remember this device"
   checkbox, a skip link, a way to submit without a code, etc.
3. Compare against the doctor-role app's own OTP screen, which does have a "remember this
   device for 30 days" option, to check whether the admin realm shares that same bypass.

## Expected
No skip/bypass mechanism should exist - MFA should be mandatory on every single login.

## Actual
Matches expected. The OTP screen offers exactly two actions: "Valider et accéder" (submit the
code) and "Retour" (restart the whole login from scratch - not a bypass, since restarting still
requires credentials + a fresh OTP). No "remember this device" checkbox exists on the admin OTP
screen, **unlike** the doctor-role app's equivalent screen (which does have a 30-day device-trust
option) - the admin realm is stricter here. There is also no way to submit the form without a
code, and no hidden/disabled "skip" affordance found in the DOM. See
`admin-otp-wrong-code-attempt-counted.png` (same screen used for test case 007).

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
None needed - the admin realm being stricter than the doctor realm here (no device-trust
bypass) is the right call for an admin surface. Worth calling out to product as a positive
finding, not just logging it as a pass.
