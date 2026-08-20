# 014 - Locked nav items are truly non-navigable, not just greyed out

**Result:** ✅ PASS

## How to test
1. While logged in with a PENDING_KYC account, inspect the sidebar's "Mes patients", "Mon
   planning", and "Dossiers médicaux" entries.
2. Attempt to click them.
3. Inspect the underlying DOM to check whether they are real disabled controls or just
   CSS-dimmed active links.

## Expected
These nav items should be genuinely non-interactive (e.g. a real `disabled` control), not merely
styled to look inactive while still being clickable/navigable.

## Actual
Matches expected. DOM inspection confirms all three are real `<button disabled>` elements (not
`<a>` tags with an active `href`), so browsers natively block all interaction (click, keyboard
activation) regardless of any CSS styling. See
`014-locked-nav-items-highlighted-PASS.png` (highlighted in red for evidence).

## Browser(s) tested
Chromium only, via interactive Playwright browser automation (including direct DOM/JS
inspection via `page.evaluate`) - not yet cross-browser tested.

## Improvement suggestion
None needed - real `disabled` controls are exactly the right implementation. Good reference
pattern for any other locked/restricted UI elsewhere in the app.
