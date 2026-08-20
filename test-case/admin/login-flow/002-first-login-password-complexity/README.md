# 002 - First login — real-time password complexity policy

**Result:** ⚪ NOT TESTABLE this session (no screenshot)

## How to test
1. Reach the mandatory password-change screen from test case 001.
2. Type a new password and observe whether complexity rules (length, character classes, etc.)
   are validated live as you type, not just on submit.

## Expected
Real-time complexity feedback while typing the new password.

## Actual
**Not testable** - blocked on the same access limitation as test case 001: there is no reachable
password-change screen with the current account/access level.

## Browser(s) tested
Not applicable - this test case was not reached.

## Improvement suggestion
Same blocker as test case 001 - see `defects/improvement/test-account-provisioning.md`. No
separate action needed beyond resolving that.
