# 003 - Export downloads a CSV of the currently filtered entries

**Result:** ⚪ NOT EXECUTED this session

## How to test
1. Open the audit log page and apply at least one filter (e.g. narrow the date range) so the
   visible list is a strict subset of all entries.
2. Click the "Exporter (CSV)" button (confirmed present, top-right of the page header, next to
   the "Journal d'audit" heading).
3. Confirm a CSV file downloads, and that its contents match the *currently filtered* list, not
   the full unfiltered dataset.
4. Spot-check the CSV's row count against the "Affichage X - Y sur Z éléments" total shown on
   screen at the time of export.

## Expected
The export should respect whatever filters are currently applied.

## Actual
Not executed - the "Exporter (CSV)" control's existence and location were confirmed, but it
wasn't clicked before the session was interrupted (single-session lock, concurrent team activity
on the shared account).

## Browser(s) tested
Not applicable - button located but not exercised this session.

## Improvement suggestion
Still the single highest-value case to get right first once retested - see the reasoning in the
previous version of this file (an export silently ignoring filters would be a genuine
data-handling defect for compliance-review workflows).
