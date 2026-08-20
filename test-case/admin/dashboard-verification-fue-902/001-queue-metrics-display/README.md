# 001 - Queue - metrics display (pending / approved / needs correction)

**Result:** ✅ PASS

## How to test
1. Open the verification queue (`/fr/verifications`).
2. Read the 4 metric cards at the top of the page.

## Expected
Metric cards showing counts for pending, approved, and needs-correction doctor accounts.

## Actual
Matches expected, plus one extra metric: "21 En attente" (pending), "0 À corriger" (needs
correction), "0 Validés ce mois" (approved this month), and "0 Rejetés" (rejected - not in the
original request but present and consistent with the 4-way status filter available via "Ajouter
un filtre"). All 4 values line up exactly with the filter-by-status results (see test case 002).

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
None needed - values are internally consistent (metrics match filtered counts exactly). Good
candidate for an automated assertion since the numbers are deterministic and easy to verify
against the filtered list counts.
