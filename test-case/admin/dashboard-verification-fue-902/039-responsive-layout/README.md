# 039 - Responsive layout across mobile / tablet / desktop (DoD)

**Result:** 🔴 MISMATCH, consistent with existing defect

## How to test
1. Load the verification queue at 375×812 (mobile), 768×1024 (tablet), and 1600×1000 (desktop)
   viewport widths.
2. Check each for a working, adapted layout vs. overflow, clipping, or being blocked entirely.

## Expected
A working, adapted layout at all three breakpoints.

## Actual
Tablet (768px) and desktop (1600px) render cleanly - metrics, search/filter bar, and the doctor
card list all adapt without overflow or clipping. **Mobile (375px) is fully blocked**: navigating
to `/fr/verifications` at that width redirects to `/fr/mobile-restricted`, the same static
"needs more space" page already documented for every other admin screen in
`defects/admin-console-mobile-not-responsive`. Not filed as a new/separate defect - this is the
same existing, already-tracked limitation, just reconfirmed on this specific screen.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
See `defects/admin-console-mobile-not-responsive` and
`defects/improvement/responsive-design-policy.md` - same recommendation applies: get an explicit,
documented decision on whether mobile-blocking is the intended policy for the whole admin
console, this screen included.
