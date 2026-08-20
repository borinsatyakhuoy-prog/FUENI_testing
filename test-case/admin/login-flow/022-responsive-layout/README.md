# 022 - Responsive layout across mobile / tablet / desktop (DoD)

**Result:** 🔴 MISMATCH (tracked as `defects/admin-console-mobile-not-responsive`)

## How to test
1. Load the admin console at 375×812 (mobile), 768×1024 (tablet), and 1600×1000 (desktop)
   viewport widths.
2. Check each for adapted, working layout vs. overflow, clipping, or being blocked entirely.

## Expected
A working, adapted layout at all three breakpoints.

## Actual
Tablet (768px) and desktop (1600px) render cleanly - the audit log table even uses a proper
`overflow-auto` scroll container for its wider columns rather than clipping them (verified via
`scrollWidth`/`clientWidth` inspection, not just a screenshot). **Mobile (375px) is fully
blocked**: every admin route redirects to `/fr/mobile-restricted`, a static page explaining the
console needs more space than a phone screen. Deliberate and clearly communicated, not broken -
but it doesn't meet a literal "responsive across mobile/tablet/desktop" bar if that was the
actual requirement. Full write-up and screenshots (including a highlighted version of the mobile
block message) in `defects/admin-console-mobile-not-responsive/README.md`; the same three
screenshots are duplicated here for convenience.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
Get an explicit, documented decision on whether mobile-blocking is the intended policy for the
admin console. See `defects/improvement/responsive-design-policy.md` - the current behavior may
be entirely correct, but nothing today distinguishes "intentional" from "not yet built."
