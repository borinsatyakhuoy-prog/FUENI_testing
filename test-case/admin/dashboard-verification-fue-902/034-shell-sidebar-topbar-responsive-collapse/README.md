# 034 - Dashboard shell - sidebar/topbar render and collapse responsively

**Result:** ✅ PASS

## How to test
1. Open the verification queue at desktop width (1600px).
2. Click the "Toggle Sidebar" button.
3. Observe the sidebar's before/after state.

## Expected
The sidebar should collapse to a narrower, icon-only rail while remaining fully functional (all
nav links/buttons still present and clickable).

## Actual
Matches expected. Before: full sidebar with logo, "ADMIN" label, section headings (TABLEAU DE
BORD/GESTION/CONFIGURATION), full nav-item text, and the account name/role text next to the
avatar. After clicking "Toggle Sidebar": the sidebar collapses to an icon-only rail - logo and
section-heading text disappear, nav items keep their icons only, and the account button shows
just the "TA" avatar with no name/role text. All nav links (Vue d'ensemble, Vérification des
dossiers, Journal d'audit) remain present in the DOM and clickable in the collapsed state. See
`034-sidebar-collapsed.png`.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
None needed - clean collapse behavior with no loss of functionality.
