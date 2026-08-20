# 002 - Filtering by action, actor, or date range updates the list server-side

**Result:** ⚪ NOT EXECUTED this session (plan only)

## How to test
1. Open the audit log page and capture the network request log.
2. Apply a filter by action type (if available), observe the resulting list and the network
   request(s) fired.
3. Apply a filter by actor (admin user), observe the same.
4. Apply a date-range filter, observe the same.
5. For each, confirm the request is a scoped API call with the filter as a query
   parameter/request body field (server-side filtering), not a full page reload, and not a
   client-side-only filter of an already-fully-loaded dataset.

## Expected
Each filter type should narrow the list via a real server-side query (matching the pattern
already confirmed for the verification queue's status filter and search box - see
`test-case/admin/dashboard-verification-fue-902/002-queue-filter-by-status/README.md` and
`.../037-filter-search-no-reload/README.md`), not a client-side reload or a purely
cosmetic/non-functional filter control.

## Actual
Not executed - admin access was unavailable for the rest of this session.

## Browser(s) tested
Not applicable - not reached this session.

## Improvement suggestion
None yet - when retesting, capture the exact query-param/request-body shape for each filter type
(similar to how FUE-902's `q`/`status`/`page`/`size` params were documented) so an automated spec
can assert on it directly.
