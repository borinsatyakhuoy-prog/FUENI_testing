# 007 - Step 2 — 6-digit OTP screen behavior

**Result:** ✅ PASS

## How to test
1. Log in with valid admin credentials to reach the "Vérification en deux étapes" (OTP) screen.
2. Inspect the 6-digit code input, the resend affordance, and the countdown timer.
3. Submit a deliberately wrong 6-digit code and observe the error handling.
4. Submit the correct code (read from the temp-mail inbox) and confirm it completes login.

## Expected
A standard 6-digit OTP entry screen: a resend option gated by a cooldown, clear feedback on a
wrong code (ideally attempt-counted), and successful completion with the right code.

## Actual
Matches expected on every point:
- Screen shows "Saisissez le code à 6 chiffres envoyé par e-mail à [masked email]".
- "Renvoyer le code" is disabled with a live countdown ("· disponible dans 00:54.") until the
  cooldown expires.
- Submitting `000000` produced: **"Code incorrect. Il vous reste 4 tentative(s)."** - specific,
  attempt-counted, matching the quality of the patient app's own OTP error handling. See
  `admin-otp-wrong-code-attempt-counted.png`.
- Submitting the real code from the temp-mail inbox completed login successfully.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.
