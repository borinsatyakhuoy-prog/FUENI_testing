# 003 - Export downloads a CSV of the currently filtered entries

**Result:** ⚪ NOT EXECUTED this session (plan only)

## How to test
1. Open the audit log page and apply at least one filter (action/actor/date range) so the
   visible list is a strict subset of all entries.
2. Locate and click the export control.
3. Confirm a CSV file downloads, and that its contents match the *currently filtered* list, not
   the full unfiltered dataset.
4. Spot-check the CSV's row count against the "Affichage X - Y sur Z éléments" total shown on
   screen at the time of export.

## Expected
The export should respect whatever filters are currently applied - exporting the filtered subset,
not silently exporting everything regardless of the UI's filtered state.

## Actual
Not executed - admin access was unavailable for the rest of this session.

## Browser(s) tested
Not applicable - not reached this session.

## Improvement suggestion
None yet - when retesting, this is the single highest-value case to get right first, since an
export silently ignoring filters would be a genuine data-handling defect (an admin exporting "just
this actor's actions for compliance review" who unknowingly gets everyone's data instead).
