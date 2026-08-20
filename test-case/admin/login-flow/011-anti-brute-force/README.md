# 011 - Layered anti-brute-force — per-user lockout AND IP/source rate limiting

**Result:** 🟡 PARTIAL, deliberately limited testing

## How to test
1. Submit several wrong passwords in a row against the same account and observe whether/when a
   lockout kicks in.
2. Submit several wrong OTP codes in a row and observe the same for the OTP step.
3. Ideally, also test from a different source IP to check whether rate limiting is per-account,
   per-IP, or both ("layered").

## Expected
Both a per-user lockout and an independent IP/source-based rate limit should exist.

## Actual
**Deliberately not pushed to find the actual thresholds**, to avoid locking the only working
admin account this session has access to:
- **Password step:** only 1 wrong-password attempt was tried (against a nonexistent email and,
  separately, a real email) - both produced the generic error with no "attempts remaining"
  indicator visible at that stage.
- **OTP step:** 1 wrong OTP attempt was tried, which **did** show attempt-counting -
  "Code incorrect. Il vous reste 4 tentative(s)." (see test case 007) - confirming a per-attempt
  limit of (at least) 5 exists at the OTP layer.
- **IP/source-based rate limiting:** not tested at all - this session has one consistent
  source IP throughout and no way to test from a second one.

Determining the real per-account lockout threshold and whether IP-based limiting exists
separately needs either a disposable second admin account, or explicit sign-off to intentionally
trip the lockout on this one.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.
