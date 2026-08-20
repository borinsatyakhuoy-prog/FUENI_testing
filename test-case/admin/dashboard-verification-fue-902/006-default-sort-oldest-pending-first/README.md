# 006 - Queue - default sort is oldest pending first

**Result:** ✅ PASS

## How to test
1. Open the unfiltered verification queue.
2. Read the "hours waiting" value on every card across all 3 pages, in list order.

## Expected
The default sort should show the longest-waiting (oldest) pending doctor first, descending to the
most recently submitted last.

## Actual
Matches expected. Waiting time descends monotonically across all 21 records and all 3 pages:
246h → 221h → 219h → 218h → 198h → 194h → 193h (×4) → 150h → 145h (×2) → 142h → 73h → 71h → 31h →
2h → 1h. The very last record (1h wait) is a doctor account this same session created minutes
earlier during earlier KYC-verification testing - strong confirmation that this is a genuine
chronological (creation-time) sort, not a coincidental static ordering in seed data.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
None needed - correct, verifiable default sort, confirmed continuous across pagination
boundaries.
