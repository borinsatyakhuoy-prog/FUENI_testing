# 036 - Sidebar badge shows the count of PENDING doctors

**Result:** ✅ PASS

## How to test
1. Log in and observe the "Vérification des dossiers" sidebar link.
2. Compare its badge value against the "En attente" metric on the queue page itself.
3. Re-check the badge value after navigating to other pages/filters.

## Expected
The sidebar badge should show the current count of PENDING doctors, staying in sync with the
queue's own pending metric.

## Actual
Matches expected. The sidebar badge reads "21", exactly matching the "21 En attente" metric card
on `/fr/verifications`. Confirmed consistent across every page/filter/search state visited this
session (unfiltered, status-filtered, all 3 search modes, all 3 pagination pages) - the badge
never changed value, correctly reflecting the true pending count rather than, say, the currently
filtered/visible count.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
None needed - correct, stable badge value that tracks the real pending count rather than the
current view's filtered count (the right behavior for a navigation badge).
