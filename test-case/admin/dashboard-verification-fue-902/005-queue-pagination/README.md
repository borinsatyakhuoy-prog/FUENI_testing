# 005 - Queue - pagination

**Result:** ✅ PASS

## How to test
1. Open the unfiltered verification queue (21 total records, 10 per page).
2. Click "Suivant" through to the last page, then "Première page"/"Précédent" back.
3. Observe the "Affichage X - Y sur Z éléments" text and button disabled-states at each boundary.

## Expected
Pagination should correctly reflect the current page's item range, and boundary buttons
(Première page/Précédent on page 1, Suivant/Dernière page on the last page) should be disabled
appropriately.

## Actual
Matches expected across all 3 pages:
- Page 1: "Affichage 1 - 10 sur 21 éléments", Première page/Précédent disabled, Suivant/Dernière
  page enabled.
- Page 2: "Affichage 11 - 20 sur 21 éléments", all 4 buttons enabled.
- Page 3 (last): "Affichage 21 - 21 sur 21 éléments", Suivant/Dernière page disabled, Première
  page/Précédent enabled.

A "Lignes par page" selector (currently 10) is also present. See `005-page2-pagination.png`.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
None needed - correct boundary handling at both ends. Good candidate for an automated test given
how deterministic the item counts and disabled-states are.
