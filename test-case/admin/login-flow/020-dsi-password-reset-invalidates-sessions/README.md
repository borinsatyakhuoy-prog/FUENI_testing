# 020 - Password reset by the DSI invalidates all active admin sessions

**Result:** ⚪ NOT TESTABLE this session (no screenshot)

## How to test
1. Open two concurrent authenticated sessions for the same admin account (e.g. two browser
   contexts).
2. Have the DSI trigger a real password reset for that account.
3. Confirm both sessions are immediately invalidated, not just blocked from future logins.

## Expected
A DSI-initiated password reset should immediately kill every existing active session for that
account, not just prevent future logins with the old password.

## Actual
**Not testable this session** - this needs a second concurrent authenticated session plus
someone with actual DSI-side access to trigger a real password reset, neither of which is
reachable from this single-account, single-session exploration.

## Browser(s) tested
Not applicable - this test case was not reached.

## Improvement suggestion
Same underlying gap as test case 010's second half - see
`defects/improvement/test-account-provisioning.md`. Needs a second controllable session plus
real DSI-side password-reset access; resolving the provisioning gap once unblocks both cases.
