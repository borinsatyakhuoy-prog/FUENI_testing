# 021 - Admin audit log entries are retained for 20 years

**Result:** 🔴 CONTRADICTION FOUND (tracked as `defects/admin-audit-retention-policy-contradiction`)

## How to test
1. Read the login page's security-feature copy for its retention claim.
2. Log in, go to Journal d'audit (`/fr/audit-logs`), and read that page's own governance notice
   for its retention claim.
3. Compare the two.

## Expected
A single, consistent retention statement, ideally confirmed as exactly 20 years if that's the
real policy.

## Actual
The login page states "conservation 20 ans" (20-year retention) as a settled fact. The audit log
page itself - the actual feature this claim is about - states retention is
**"à confirmer (DPO)"** (to be confirmed by the Data Protection Officer). These directly
contradict each other. Full write-up, evidence, and recommendation in
`defects/admin-audit-retention-policy-contradiction/README.md`. Separately, the literal 20-year
duration can't be verified in real time regardless of which claim is accurate.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.
