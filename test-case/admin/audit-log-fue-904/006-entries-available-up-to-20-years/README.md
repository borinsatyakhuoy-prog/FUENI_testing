# 006 - Audit entries older than the current date remain available up to 20 years

**Result:** ⚪ NOT EXECUTED this session (plan only)

## How to test
1. This literal claim (entries remain available for up to 20 years) cannot be verified in real
   time within any single testing session - it would require either 20 years to actually pass,
   or direct access to a retention/deletion job's configuration or a seeded historical dataset.
2. The practical, same-session-feasible version of this test is a **documentation-consistency
   check**, already partly done in an earlier session: compare the login page's retention claim
   against the audit log page's own governance notice.

## Expected
A single, consistent retention statement, ideally confirmed as exactly 20 years if that's the
real, DPO-approved policy - and (separately, not verifiable here) actual entries genuinely
persisting that long once the policy is implemented.

## Actual
**Already known to be contradictory as of an earlier session** (not re-verified this session,
but not expected to have changed): the login page states "conservation 20 ans" as settled fact,
while the audit log page's own governance notice says retention is **"à confirmer (DPO)"** - see
`defects/admin-audit-retention-policy-contradiction/README.md` and
`test-case/admin/login-flow/021-audit-log-20-year-retention/README.md` for the full write-up.
The literal 20-year duration itself remains unverifiable in real time regardless of which claim
is accurate.

## Browser(s) tested
Not applicable this session - see the cross-referenced README for the session that did observe
this directly.

## Improvement suggestion
See `defects/admin-audit-retention-policy-contradiction/README.md`'s existing recommendation: get
DPO sign-off on the real retention period, then make both surfaces state the same thing.
