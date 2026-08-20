# Improvement: Cluster of small security-hardening follow-ups

**Priority: Medium-High**, given this is a healthcare platform (RGPD/HDS/ISO 27001 claimed) -
no single item here is severe alone, but they compound, and several sit specifically in the
admin/audit surface that the platform's own marketing leans on for trust.

## The cluster

| Item | Defect | Severity |
|---|---|---|
| Session cookie missing `Secure` | `defects/http-security-header-gaps` (#1) | Medium |
| Login-page CSP has no `script-src` | `defects/http-security-header-gaps` (#3) | Low |
| Authenticated-app CSP allows `unsafe-inline`/`unsafe-eval` | `defects/http-security-header-gaps` (#5) | Low-Medium |
| Conflicting `Referrer-Policy` values | `defects/http-security-header-gaps` (#4) | Low |
| Audit log attributes actions to a generic seat label, not the real individual | `defects/admin-audit-log-generic-admin-identity` | Medium/High |
| Audit-retention claim ("20 ans") contradicts the audit page's own "à confirmer" notice | `defects/admin-audit-retention-policy-contradiction` | Medium |
| `/en` admin route fully functional despite "French only" intent | `defects/admin-english-locale-reachable-undiscoverable` | Low |

## Recommendation

Treat this as one prioritized sprint of hardening work rather than seven unrelated tickets:

1. **First:** the audit-log identity issue - it undermines the one feature (individual
   accountability) the platform's own compliance story depends on most directly.
2. **Then:** the `Secure` cookie flag - cheapest fix, clearest risk reduction.
3. **Then:** the CSP items together (both pages, one sprint) rather than separately, since
   they're the same class of fix (nonce/hash-based CSP).
4. **Then:** reconcile the retention-copy contradiction and the `/en` route, once someone
   confirms the actual intended policy for each.

None of these require new test automation to verify the fix - `tests/fueni-test/security/`
already has live regression checks for the header/cookie/CSP items that will flip green
automatically once fixed.
