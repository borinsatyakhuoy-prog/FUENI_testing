# Improvement: Get dedicated load-testing tooling before drawing capacity conclusions

**Priority: Low** (informational/tooling gap, not a product defect).

## The problem

`tests/fueni-test/load/001_concurrent-login-page-load.spec.ts` is a deliberately bounded probe
(max concurrency 15, pre-auth page only) built from inside this same Node/Playwright process -
not a real load-testing tool. Across multiple runs it shows degradation starting around
concurrency 5-10, worse on webkit than chromium, but **can't distinguish**:

- genuine server-side throttling / Cloudflare anti-automation escalation (see Issue 3 in
  `test-results/Report.md`), from
- local resource contention from running many browser contexts inside one Node process, which
  gets worse the longer that same process has already been running (see Session 13's note about
  the webkit result possibly being confounded by cumulative browser-process lifetime).

## Recommendation

If real concurrent-capacity numbers are ever needed for this staging environment (e.g. before a
launch), run a proper tool (k6, artillery, or similar) from a **separate process/machine**,
hitting only stateless/pre-auth endpoints to avoid the shared account's Turnstile/rate-limit
budget - same safety principle this suite's own probe already follows, just with tooling that
can actually isolate the variable this probe can't.
