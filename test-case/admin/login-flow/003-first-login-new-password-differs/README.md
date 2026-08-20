# 003 - First login — new password must differ from the temporary password

**Result:** ⚪ NOT TESTABLE this session (no screenshot)

## How to test
1. Reach the mandatory password-change screen from test case 001.
2. Attempt to submit the same temporary password as the "new" password.
3. Observe whether this is rejected.

## Expected
Submitting the same password should be rejected with a clear message.

## Actual
**Not testable** - blocked on the same access limitation as test case 001.

## Browser(s) tested
Not applicable - this test case was not reached.

## Improvement suggestion
Same blocker as test case 001 - see `defects/improvement/test-account-provisioning.md`. No
separate action needed beyond resolving that.
