# 002 - Queue - filter by status

**Result:** ✅ PASS

## How to test
1. Open the verification queue.
2. Click "Ajouter un filtre" → "Statut".
3. Select "Validé" and click "Appliquer le filtre".
4. Observe the URL, the active-filter chip, and the resulting list.

## Expected
Selecting a status filter should narrow the list to matching records, be visibly represented as
an active filter, and be removable.

## Actual
Matches expected. The filter dialog offers exactly the 4 statuses that match the metric cards (En
attente / À corriger / Validé / Rejeté). Applying "Validé" sets the URL to
`/fr/verifications?status=validated`, shows a "Statut: Validé" chip with its own remove button,
adds a "Tout effacer" button, and correctly returns 0 results (see test case 007 for the empty
state itself). Clearing via "Tout effacer" restores the full unfiltered list.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation (including network request
inspection to confirm the underlying API call) - not yet cross-browser tested.

## Improvement suggestion
None needed - clean, URL-reflected filter state (shareable/bookmarkable, which is a good pattern).
Good candidate for an automated test given the deterministic query-param behavior.
