# 016 - Automatic deletion - no documents within 14 days, including exact reminder wording

**Result:** ⚪ NOT TESTABLE in real time (no screenshot - nothing could be captured)

## How to test
1. Create a doctor account and leave it with zero KYC documents uploaded.
2. Wait 14 real calendar days.
3. Observe whether the account/draft is automatically deleted, and capture the exact wording of
   any reminder notification(s) sent before that deletion.

## Expected
Unknown without the real specification/copy for this reminder and deletion behavior - this
session doesn't have access to that source document.

## Actual
**Not testable within a single session.** This is the same class of limitation as the admin
portal's 20-year audit-retention claim (`defects/admin-audit-retention-policy-contradiction`) -
verifying a 14-day time-based behavior requires either 14 real days to actually pass, or direct
access to the reminder-email template/copy from the FUENI team. Neither was available this
session, so nothing was guessed at or fabricated.

## Browser(s) tested
Not applicable - this test case was not reached.
