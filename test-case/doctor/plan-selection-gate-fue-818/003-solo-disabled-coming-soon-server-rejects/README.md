# 003 - Solo is disabled with a coming-soon toast; server also rejects it

**Result:** 🟡 PARTIAL

## How to test
1. Reach the plan-selection screen.
2. Inspect the "Choisir Solo" button's DOM state, and its surrounding card.
3. Click both the button and the card area, watching for any toast/notification.
4. Independently, attempt a direct authenticated `POST /api/v1/doctors/me/plan {"plan":"SOLO"}`
   (with a valid CSRF token) to check whether the server enforces the same restriction.

## Expected
The Solo plan option should be disabled in the UI, show a "coming soon" toast when interacted
with, and be independently rejected by the server if requested directly (defense in depth, not
just a UI-layer restriction).

## Actual
**Split result:**
- **UI disabled:** confirmed - "Choisir Solo" is a real `disabled` button (not just styled), with
  a static "Bientôt disponible" status badge next to the plan name.
- **Coming-soon toast: NOT found.** Clicking the disabled button directly, and clicking the
  surrounding card area, produced **no toast, no tooltip, no feedback of any kind** - just the
  static badge that was already visible before the click. See `003-solo-disabled-no-toast.png`.
- **Server-side rejection: confirmed.** A direct `fetch` call to
  `POST /api/v1/doctors/me/plan {"plan":"SOLO"}` (using the real `csrf` cookie value as the
  `x-csrf-token` header, matching the app's own CSRF pattern) returned **`422
  PLAN_NOT_AVAILABLE`** - `"This plan is not available."`. A follow-up `GET` confirmed the
  account's plan was unaffected (still `FREE`), so the rejected request had no side effect.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation, including direct authenticated
`fetch()` calls from the browser context (`page.evaluate`) to test server-side enforcement
independently of the UI - not yet cross-browser tested.

## Improvement suggestion
Either add the coming-soon toast the test case's title implies was intended, or update the test
case's expectation if a silent disabled state was the actual design decision - right now there's
a real gap between what's documented as expected and what a user experiences when they try to
interact with the disabled option.
