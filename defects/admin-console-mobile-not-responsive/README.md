# Defect (possible DoD gap): Admin console is not responsive on mobile - it's fully blocked instead

**Status:** CONFIRMED behavior, severity/verdict depends on the actual "022" Definition of Done
wording, which this session doesn't have the canonical source for - see Recommendation. Not yet
covered by an automated test (no admin-role automated suite exists yet).

**Severity: Low-Medium (pending DoD confirmation).** Not a crash or broken state - the block is
deliberate and clearly communicated. But if the accepted requirement was genuine responsive
rendering "across mobile / tablet / desktop", this doesn't meet it: mobile isn't adapted, it's
excluded.

**Environment:** `https://fueni-staging-preview-admin.allweb.cloud/fr/audit-logs` (and, by
redirect, every other admin route), tested at 375×812 (mobile), 768×1024 (tablet), and 1600×1000
(desktop), 2026-08-20.

## Description

At a 375px mobile viewport, every admin route redirects to `/fr/mobile-restricted`, a static page
titled "Non disponible sur cette taille d'écran" ("Not available at this screen size"):

> La console admin est conçue pour consulter des tableaux, des dossiers KYC et des rapports —
> elle a besoin de plus d'espace qu'un écran de téléphone. Passez sur une tablette ou un
> navigateur de bureau pour continuer.

("The admin console is designed to view tables, KYC files and reports — it needs more space than
a phone screen. Switch to a tablet or desktop browser to continue.")

Tablet (768px) and desktop (1600px) both render the full console cleanly with no observed
overflow or broken layout - double-checked specifically for the audit log table's rightmost
columns (Cible, Détail), which look visually cut off in a plain screenshot at 768px: confirmed
via `document.evaluate`/`scrollWidth` inspection that the table sits inside a proper
`overflow-auto` scroll container (`scrollWidth: 829` vs `clientWidth: 647`), so those columns are
genuinely reachable by scrolling, not clipped/inaccessible. Not a defect.

This is a well-designed, honest gate - not a bug in the sense of something breaking - but it is
categorically different from "responsive across mobile/tablet/desktop": mobile users get no
functional access at all, not an adapted layout. Whether this satisfies item "022" in the
requirements this session was given depends on wording this session doesn't have visibility into
(referenced only as "022 Responsive layout across mobile / tablet / desktop (DoD)").

## Steps to Reproduce

1. Log into the admin portal.
2. Resize the browser viewport to a phone width (e.g. 375×812).
3. Navigate to any admin route (e.g. `/fr/audit-logs`, `/fr` itself).
4. Observe the redirect to `/fr/mobile-restricted` and its message.
5. Compare against 768px and 1600px, where the full console renders normally.

## Expected Result

Depends on the real requirement:
- If "responsive across mobile/tablet/desktop" means the console should render an adapted,
  usable layout at all three sizes: mobile should show a working (if simplified) interface, not
  a full block.
- If a deliberate desktop/tablet-only restriction was an accepted design decision for this
  data-dense admin console: this behavior is correct as-is, and "022" should be understood/
  reworded as "graceful desktop/tablet-only gating", not literal cross-device responsiveness.

## Actual Result

Mobile viewports are entirely blocked behind a static explanatory page; only tablet and desktop
get the real console.

## Evidence

Screenshots captured live via Playwright, 2026-08-20, at all three breakpoints:
- `admin-audit-log-mobile-375.png` - the block page at 375px
- `admin-mobile-375-highlighted.png` - the same page with the message block outlined in red.
  Note: unlike this suite's other responsive defects (e.g.
  `defects/login-phone-placeholder-clipped-320`), there's no single clipped/overflowing element
  to circle here - the "wrong area" is that this block *is* the entire page's content, replacing
  all functional UI rather than adapting it. The highlight marks that block for reference, not a
  layout glitch within it.
- `admin-audit-log-tablet-768.png` - working audit-log table at 768px
- `admin-audit-log-desktop-1600.png` - working audit-log table at 1600px

## Recommendation

- Get the actual "022" DoD/acceptance-criteria text and compare it against this behavior directly
  - don't assume either interpretation without it.
- If mobile responsiveness truly was required: scope what a usable mobile admin experience would
  even look like for a data-table-heavy console (may not be worth building at all - many admin
  back-offices legitimately restrict themselves this way).
- If the block is the accepted design: update whatever wrote "across mobile/tablet/desktop" to
  instead describe the actual intended behavior (e.g. "desktop/tablet-only, with a clear
  explanatory gate on mobile"), so future QA passes don't re-flag this as a gap.
