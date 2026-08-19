# Defect: "Notifications" bell button is a dead UI element (Patient app)

**Status:** CONFIRMED, live regression test in place (currently passing - documents the current
broken no-op state; will start failing, prompting an update, the moment a real panel ships).

**Severity: Low/Medium.** Missing functionality, not a crash - no console/page error either, so it
fails silently rather than visibly.

**Environment:** `https://fueni-staging-preview-patient.allweb.cloud`, any authenticated page.

## Description

Clicking the bell icon in the top bar (next to the language switcher) does nothing at all - no
dropdown, panel, dialog, or badge appears, and no network request fires. Confirmed via
accessibility snapshot, a screenshot, and a `pageerror` listener (no error thrown either) - it's
a silent no-op, not a partial/broken implementation.

## Expected Result

Either a functioning notifications panel, or the button should be hidden/disabled until the
feature ships - consistent with how the sidebar's not-yet-built destinations (Mes RDV, Prendre
RDV, Mes documents, FAQ, Support) already show an explicit "Bientôt disponible" placeholder
instead of a silently-dead control.

## Actual Result

Button renders, gains focus/`[active]` state on click, and does nothing else.

## Evidence

- `test-results/exploratory-findings.md` (Session 2, Issue 4, 2026-08-18)
- `test-results/Report.md` Defects Log, Issue 4
- Live regression check: `tests/fueni-test/navigation/005_notifications-bell-is-inert.spec.ts`

## Recommendation

Either implement the notifications panel, or hide/disable the bell (or show an explicit
"Bientôt disponible" state) until it's ready - a silently-dead interactive control is worse UX
than an honestly-labeled placeholder.
