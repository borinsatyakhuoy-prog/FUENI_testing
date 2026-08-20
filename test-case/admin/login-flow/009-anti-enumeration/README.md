# 009 - Generic errors / anti-enumeration — verbatim §9 messages

**Result:** 🟡 PASS on behavior, wording not cross-checked against source spec

## How to test
1. Attempt to log in with a nonexistent email + a wrong password.
2. Attempt to log in with a real, valid email + a wrong password.
3. Compare the two error messages - they should be identical, so an attacker can't tell whether
   a given email is a real admin account.

## Expected
Both cases should produce the exact same generic error message, matching whatever exact wording
is specified in the requirements ("§9" reference, not available to this session).

## Actual
Both cases produced the identical message: **"Identifiant ou mot de passe incorrect."** - no
account-existence leak observed. See `admin-009-anti-enumeration-generic-error.png` (this run
used a second nonexistent email to reproduce the finding independently from the first
exploration pass). The exact wording was **not cross-checked against the real "§9" source
document** - this session doesn't have access to it, so the behavior is confirmed but the exact
copy match is not.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.
