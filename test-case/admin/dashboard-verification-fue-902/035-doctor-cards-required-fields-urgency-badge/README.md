# 035 - Doctor list cards show all required fields plus urgency badge

**Result:** ✅ PASS

## How to test
1. Open the verification queue's unfiltered list.
2. Inspect the field set shown on each card across multiple records.

## Expected
Every card should consistently show a complete, required field set, plus an urgency badge when
applicable.

## Actual
Matches expected. Every one of the 21 cards, without exception, consistently shows: avatar
initials, full name, "Médecin" role badge, "En attente" status badge, email address, specialty
code (e.g. CARSU, ANEST, NEURO), country flag + name, hours-waiting, and medical order number.
The "— Dépassé" urgency badge appears specifically on records past the waiting threshold (see
test case 004 for the threshold behavior itself) - not shown as a fixed field, correctly omitted
on short-wait records.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
None needed - complete, consistent field set across every record observed. The exact "required
fields" list isn't formally specified anywhere found this session; worth confirming against a
real spec document if one exists, to catch any field that might be silently optional rather than
always-present in this particular dataset by coincidence.
