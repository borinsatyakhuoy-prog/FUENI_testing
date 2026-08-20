# 004 - First login — invalid password submission message

**Result:** ⚪ NOT TESTABLE this session (no screenshot)

## How to test
1. Reach the mandatory password-change screen from test case 001.
2. Submit a password that fails the complexity policy.
3. Observe the error message shown.

## Expected
A clear, specific message explaining why the password was rejected.

## Actual
**Not testable** - blocked on the same access limitation as test case 001.

## Browser(s) tested
Not applicable - this test case was not reached.

## Improvement suggestion
Same blocker as test case 001 - see `defects/improvement/test-account-provisioning.md`. No
separate action needed beyond resolving that.
