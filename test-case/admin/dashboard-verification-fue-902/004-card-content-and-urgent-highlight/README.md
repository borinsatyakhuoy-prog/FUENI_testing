# 004 - Queue - file card content and 'urgent' highlight beyond waiting threshold

**Result:** ✅ PASS

## How to test
1. Open the verification queue's unfiltered list.
2. Inspect a card's content fields.
3. Page through to find both a long-waiting and a short-waiting record, and compare whether the
   overdue/urgent indicator appears on each.

## Expected
Each card should show complete doctor information, and an urgency/overdue indicator should
appear specifically for records that have waited beyond some threshold - not on every card
unconditionally.

## Actual
Matches expected on both points:
- **Card content:** avatar initials, full name, "Médecin" role badge, "En attente" status badge,
  email, specialty code, country flag, hours-waiting, and medical order number - consistently
  present on every card.
- **Threshold-based urgency badge:** the "— Dépassé" label appears on every record waiting 71h or
  more in this dataset, and is correctly **absent** on the two shortest-waiting records observed
  (31h and 2h) - see `004-page2-urgent-vs-not-urgent.png`. This confirms the badge is genuinely
  conditional on a real waiting-time threshold, not a static label shown on every card
  regardless of wait time.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
The exact threshold value (somewhere between 31h and 71h in this sample) isn't documented
anywhere in the UI. Worth confirming the exact SLA/threshold value with product so an automated
test can assert on the precise boundary rather than just "some threshold exists."
