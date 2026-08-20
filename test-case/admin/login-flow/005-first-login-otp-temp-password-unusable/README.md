# 005 - First login — completion leads to OTP verification, temp password unusable afterwards

**Result:** ⚪ NOT TESTABLE this session (no screenshot)

## How to test
1. Complete the mandatory password change from test case 001.
2. Observe whether the flow continues into the normal email-OTP verification step.
3. Log out, then attempt to log back in using the **original temporary password**.
4. Confirm the temporary password no longer works.

## Expected
Password-change completion should flow into standard OTP verification, and the temporary
password should be permanently invalidated afterwards.

## Actual
**Not testable** - blocked on the same access limitation as test case 001 (no way to reach a
temporary-password first-login state at all this session).

## Browser(s) tested
Not applicable - this test case was not reached.
