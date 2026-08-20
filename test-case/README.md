# Test Case Results

Point-in-time retest write-ups against a specific, externally-provided list of test case IDs -
distinct from `defects/` (confirmed application bugs) and `tickets/` (forward-looking follow-up
items needing external action). Organized as `test-case/<role>/<retest-name>/`, grouped by role
so future retests for the same role land in one place. Each retest folder has its own top-level
`README.md` (a results table: test case # → PASS/FAIL/PARTIAL/NOT TESTABLE, each backed by
evidence) plus one subfolder per test case (`<#>-<short-name>/`), and each of *those* has its own
small `README.md` (how to test / expected / actual / browser(s) tested) alongside its
screenshot(s) - including test cases that turned out not testable this session, so the requested
list is fully accounted for even where no evidence could be captured. Findings that turn out to
be confirmed bugs are cross-referenced into `defects/`; findings needing follow-up are
cross-referenced into `tickets/` - this folder itself only records what was directly observed
against the given list.

## Index

| Retest | Scope | Result summary | Details |
|---|---|---|---|
| [doctor/kyc-verification](doctor/kyc-verification/README.md) | Doctor role KYC verification flow (16 requested items) | 10 pass, 2 mismatch/not-found, 2 partial, 2 not testable in real time. Also surfaced a major update to `tickets/DOCTOR-ROLE-registration-blocked-by-turnstile` (registration no longer Turnstile-blocked) | [README](doctor/kyc-verification/README.md) |
| [admin/login-flow](admin/login-flow/README.md) | Admin role login/session flow (16 requested items) | 6 pass (2 with caveats), 5 not testable (no path to a temp-password first-login state), 3 partial (deliberately limited to avoid lockout risk), 2 already-tracked defects (audit retention, mobile responsive) | [README](admin/login-flow/README.md) |
| [admin/app-shell-fue-815](admin/app-shell-fue-815/README.md) | Admin app shell architecture (FUE-815, 3 requested items, independent numbering from login-flow) | 2 pass, 1 mismatch (`/en` fully reachable despite no language selector) | [README](admin/app-shell-fue-815/README.md) |
