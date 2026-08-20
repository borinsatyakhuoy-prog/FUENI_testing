# 037 - Filter tabs and search update the list without a page reload

**Result:** ✅ PASS

## How to test
1. Open the verification queue and capture the network request log.
2. Apply a status filter, then a search term (multiple times), then paginate.
3. Inspect the network log for each interaction.

## Expected
Filtering, searching, and paginating should update the list via data fetches, not a full page
reload.

## Actual
Matches expected. Every interaction (status filter, all 3 search terms, page navigation) fires
exactly two requests: a Next.js RSC fetch (`GET /fr/verifications?_rsc=...`) and a scoped API call
(`GET /api/v1/admin/doctors/verifications?...` with the relevant `q`/`status`/`page`/`size`
params) - both are `fetch`-type requests, not a `document` navigation. The page title and the rest
of the shell (sidebar, topbar) never re-rendered from scratch during any of these interactions.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation (network request-type inspection) -
not yet cross-browser tested.

## Improvement suggestion
None needed - correct client-side data-fetching pattern, consistent with modern Next.js app-router
conventions.
