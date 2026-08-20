# Test Case Plans: FUE-904 - Admin Audit Log Viewer

**Context:** These 6 items were requested for the admin console's "Journal d'audit"
(`/fr/audit-logs`) feature. **Not executed live this session** - the standing admin account
became unreachable partway through this session (credentials appear to have changed and/or the
account tripped its own strict single-session security lock - see
`defects/improvement/test-account-provisioning.md` for the single-session finding from the FUE-902
pass immediately before this one). Per the user's instruction, this is recorded as a **test plan**
(How to test / Expected, no Actual) rather than guessed-at results, so nothing here should be read
as a confirmed pass or fail.

**What's already known about this page from earlier exploration** (see
`test-case/admin/login-flow/021-audit-log-20-year-retention/README.md` and
`defects/admin-audit-retention-policy-contradiction/README.md`): the page carries a governance
notice reading "Registre inaltérable — ajout uniquement (append-only), non modifiable et non
supprimable. Comptes nommés individuels · conservation à confirmer (DPO)." - i.e. the audit log's
own retention period is explicitly unconfirmed, directly contradicting the login page's "20 ans"
claim. This is directly relevant to case 006 below.

## Plan

| # | Test case | Folder | Status |
|---|---|---|---|
| 000 | UI Admin Audit Log | [`000-ui-admin-audit-log/`](000-ui-admin-audit-log/) | ⚪ Plan only - not executed |
| 001 | Audit log page renders a read-only paginated table | [`001-read-only-paginated-table/`](001-read-only-paginated-table/) | ⚪ Plan only - not executed |
| 002 | Filtering by action, actor, or date range updates the list server-side | [`002-filter-action-actor-date-range-server-side/`](002-filter-action-actor-date-range-server-side/) | ⚪ Plan only - not executed |
| 003 | Export downloads a CSV of the currently filtered entries | [`003-export-csv-of-filtered-entries/`](003-export-csv-of-filtered-entries/) | ⚪ Plan only - not executed |
| 006 | Audit entries older than the current date remain available up to 20 years | [`006-entries-available-up-to-20-years/`](006-entries-available-up-to-20-years/) | ⚪ Plan only - not executed |
| 007 | Responsive layout across mobile / tablet / desktop (DoD) | [`007-responsive-layout/`](007-responsive-layout/) | ⚪ Plan only - not executed |

## Blocker

Admin access was unavailable for the remainder of this session. Once restored, retest in the same
order as FUE-902 was retested (case 000 first to establish ground truth on the page's actual
structure, since the "How to test" steps below describe *expected* UI based on the governance
notice already seen and on how the verification queue - the other admin list view - behaves, not
on having directly inspected this page's table/filter/export controls yet).
