# Improvement Plan (post-regression)

Forward-looking improvement recommendations synthesized after the full-suite regression reruns
(Sessions 8-13) and the admin/doctor retests - distinct from `defects/` (confirmed bugs) and
`tickets/` (single, narrow external asks). This folder groups *themes* that recur across
multiple findings, each with its own priority and rationale, so the team can plan work by theme
rather than by individual bug.

Each individual `defects/<name>/README.md` and `test-case/<role>/<retest>/<case>/README.md` also
carries its own short "## Improvement suggestion" note where relevant - this index is the
rolled-up, cross-cutting view.

## Index

| Theme | Priority | Summary | Details |
|---|---|---|---|
| [test-account-provisioning](test-account-provisioning.md) | High | No self-service way to provision fresh admin/doctor test accounts with known states (temp-password, KYC-pending, etc.) - blocks 5+ test cases outright | [README](test-account-provisioning.md) |
| [inconsistent-feedback-messaging](inconsistent-feedback-messaging.md) | Medium | Several flows (wrong-file-type upload, KYC draft save, admin login success) complete correctly but give the user no visible confirmation/error toast | [README](inconsistent-feedback-messaging.md) |
| [responsive-design-policy](responsive-design-policy.md) | Medium | Three different responsive strategies exist across patient/doctor/admin apps with no documented policy, causing QA to repeatedly flag intentional design choices as defects | [README](responsive-design-policy.md) |
| [security-hardening-followups](security-hardening-followups.md) | Medium-High | A cluster of small, independently-low-severity security gaps (cookie flags, CSP weaknesses, audit-log identity resolution, retention-copy accuracy) that compound given this is a healthcare platform | [README](security-hardening-followups.md) |
| [automated-suite-expansion](automated-suite-expansion.md) | Medium | Doctor and admin roles are now reachable (Turnstile no longer blocks doctor registration; admin account is stable) but have zero permanent automated coverage - only manual/scripted retests exist | [README](automated-suite-expansion.md) |
| [load-testing-tooling-gap](load-testing-tooling-gap.md) | Low | The bounded load probe can't distinguish server-side throttling from local browser-process contention - real capacity questions need dedicated tooling (k6/artillery) run from a separate process | [README](load-testing-tooling-gap.md) |
