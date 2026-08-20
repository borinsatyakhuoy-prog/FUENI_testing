# 001 - Non-dismissable plan gate blocks the dashboard when no plan is selected

**Result:** ✅ PASS

## How to test
1. Complete doctor registration through the email-OTP step, but do **not** complete the "Choix du
   plan" step (no plan selected yet).
2. Navigate directly to `/fr/dashboard` (a fresh full-page navigation).
3. Try to dismiss whatever appears: press Escape, click outside it, and attempt a real click on a
   sidebar link/heading underneath it.

## Expected
The dashboard should be blocked behind a gate that cannot be dismissed by any of the standard
escape hatches (Escape key, outside click, or clicking through to content behind it) until a plan
is chosen.

## Actual
Matches expected. Navigating to `/fr/dashboard` renders the full dashboard **underneath** a modal
dialog ("Choisissez votre formule") with only two actions: "Choisir une formule" and
"Se déconnecter" - no close/X button exists. Pressing Escape had no effect (dialog remained).
Attempting a real Playwright click on the "Tableau de bord" sidebar link **timed out after ~1.6s
of retries**, with the tool reporting a `<div ... class="fixed inset-0 z-50 bg-black/50">
intercepts pointer events` - i.e. the backdrop is a genuine pointer-event blocker, not just a
visual overlay. See `001-gate-blocks-dashboard.png`.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation (including a direct Playwright
`click()` action to test real pointer-event blocking, not just DOM presence) - not yet
cross-browser tested.

## Improvement suggestion
None needed - this is a solid, genuinely non-dismissable implementation. Good candidate for an
early automated regression test given how cheap it is to assert (navigate + expect the dialog +
expect a blocked click), no OTP dependency once an account already exists at this state.
