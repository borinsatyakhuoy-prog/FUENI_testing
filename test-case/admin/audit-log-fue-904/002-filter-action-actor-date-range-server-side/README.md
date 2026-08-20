# 002 - Filtering by action, actor, or date range updates the list server-side

**Result:** 🟡 PARTIAL - confirmed date-range filtering is server-side and URL-reflected; action/actor filters not yet exercised

## How to test
1. Open the audit log page and note the default date-range chip ("Période: ...") already
   applied.
2. Click "Ajouter un filtre" to see what filter types are offered (confirmed to exist: at least
   a date-range filter; the "Ajouter un filtre" menu itself wasn't opened long enough this
   session to confirm whether action/actor are separate filter types or covered by the search
   box).
3. Change the date range and observe the URL/network request.
4. Try the search box against a known action name or actor name and observe the request.

## Expected
Each filter type should narrow the list via a real server-side query, matching the pattern
already confirmed for the verification queue (FUE-902).

## Actual
**Partially confirmed.** The date-range filter is confirmed server-side and URL-reflected: the
default view loaded with `?dateRangeFrom=2026-05-20&dateRangeTo=2026-08-20` in the URL, matching
the visible "Période: 2026-05-20 - 2026-08-20" chip - a real, shareable/bookmarkable filter
state, same pattern as the verification queue's status filter. The search box
("Rechercher une action, un motif…") is present but wasn't exercised this session. Action/actor
filtering specifically wasn't confirmed - the session was interrupted (single-session lock,
concurrent team activity on the shared account) before "Ajouter un filtre" could be reopened and
explored.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
Retest by opening "Ajouter un filtre" specifically to enumerate every filter type offered (the
verification queue's equivalent only offered "Statut" - this page may offer more), then exercise
each one and capture the resulting request's query params, same as was done for FUE-902.
