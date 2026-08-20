# 007 - Queue - no records message

**Result:** ✅ PASS

## How to test
1. Open the verification queue.
2. Apply the "Validé" status filter (0 matching records in this dataset).
3. Observe the list area.

## Expected
A clear, localized empty-state message should replace the list, rather than a blank area or a
broken/loading-forever state.

## Actual
Matches expected. The list area shows: "Aucun dossier ne correspond à ces filtres." - clear,
correctly localized French, unambiguous about why the list is empty (filters, not an error). See
`007-no-records-filtered-validated.png`.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
None needed - clear, correctly-localized empty state.
