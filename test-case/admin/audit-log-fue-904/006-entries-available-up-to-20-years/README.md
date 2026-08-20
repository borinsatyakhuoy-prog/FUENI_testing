# 006 - Audit entries older than the current date remain available up to 20 years

**Result:** 🔴 CONTRADICTION RECONFIRMED (tracked as `defects/admin-audit-retention-policy-contradiction`)

## How to test
1. Read the login page's security-feature copy for its retention claim.
2. Log in, go to Journal d'audit (`/fr/audit-logs`), and read that page's own governance notice
   for its retention claim.
3. Compare the two.

## Expected
A single, consistent retention statement, ideally confirmed as exactly 20 years if that's the
real policy.

## Actual
Reconfirmed this session, matching the earlier finding exactly: the login page states
"conservation 20 ans" (20-year retention) as a settled fact, while the audit log page's own
governance notice states retention is **"à confirmer (DPO)"** (to be confirmed by the Data
Protection Officer) - directly contradicting the login page. Full write-up in
`defects/admin-audit-retention-policy-contradiction/README.md`. The literal 20-year duration
itself remains unverifiable in real time regardless of which claim is accurate.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
See `defects/admin-audit-retention-policy-contradiction/README.md` and
`defects/improvement/security-hardening-followups.md` for the existing fix recommendation and
priority order - no new recommendation needed, this is a stable, reproducible reconfirmation.
