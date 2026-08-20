# 004 - Already-chosen plan skips the gate; re-selecting the same plan is idempotent

**Result:** ✅ PASS

## How to test
1. On an account that has already selected the Free plan (see test case 002), log out completely.
2. Log back in with the full credential + email-OTP flow (a fresh OTP, not a cached session).
3. Observe whether the plan gate reappears on dashboard load.
4. Separately, re-`POST` the same plan choice (`{"plan":"FREE"}`) the account already has, and
   compare the response's `planSelectedAt` timestamp against the original.

## Expected
Once a plan is chosen, it should be remembered - the gate should not reappear on subsequent
logins - and submitting the same plan again should succeed without error and without mutating
anything (a true no-op).

## Actual
Matches expected on both points:
- **Gate skipped on relogin:** after a full logout (via the "Se déconnecter" button) and a
  complete fresh login (password + a brand-new email-OTP code), the dashboard loads with **only**
  the separate KYC-completion gate showing - the plan-selection gate never reappears. See
  `004-plan-gate-skipped-after-relogin.png`.
- **Idempotent re-selection:** re-`POST`ing `{"plan":"FREE"}` returned `200 OK` with
  `{"selectedPlan":"FREE","planSelectedAt":"2026-08-20T08:37:04.636504Z"}` - the **exact same**
  timestamp as the original selection (not a newly bumped one), confirming this is a genuine no-op
  rather than merely "succeeds without erroring."

## Browser(s) tested
Chromium only, via interactive Playwright browser automation, including a full logout/fresh-OTP
login cycle and direct authenticated `fetch()` calls to compare response timestamps - not yet
cross-browser tested.

## Improvement suggestion
None needed - this is exactly the right behavior, and verifying it via the unchanged timestamp
(rather than just a 200 status) is a meaningfully stronger check than the test case's title alone
implies. Good candidate for an automated regression test given how cheap the timestamp-comparison
assertion is once an account already has a plan selected.
