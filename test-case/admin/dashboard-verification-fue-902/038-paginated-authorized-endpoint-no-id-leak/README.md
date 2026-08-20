# 038 - Paginated, authorized read endpoint - no doctor id exposed in the request

**Result:** ✅ PASS

## How to test
1. Capture the network log across every list interaction this session (default view, status
   filter, all 3 search modes, all pagination pages).
2. Inspect the request URL/params for the underlying list endpoint each time.

## Expected
The list-reading endpoint should be paginated, require authentication, and never need/expose a
doctor's id in the request itself (URL, query params, or headers).

## Actual
Matches expected. Every single request to `/api/v1/admin/doctors/verifications` across this
entire session only ever carried `page`, `size`, and optionally `q` or `status` as query params -
never a doctor id in any form. The endpoint is session-cookie-authenticated like every other
admin endpoint tested in this suite (no requests succeeded before login; the SESSION cookie is
present on every authenticated call).

## Browser(s) tested
Chromium only, via interactive Playwright browser automation (network request URL/param
inspection across every list interaction) - not yet cross-browser tested.

## Improvement suggestion
None needed - the list endpoint's request shape never leaks a doctor id, and pagination/auth are
both correctly enforced.
