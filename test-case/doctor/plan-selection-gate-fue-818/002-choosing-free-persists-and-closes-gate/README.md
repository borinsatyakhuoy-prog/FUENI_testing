# 002 - Choosing Free persists the plan and closes the gate

**Result:** ✅ PASS

## How to test
1. Reach the plan-selection gate (see test case 001).
2. Click "Choisir une formule" to open the plan-selection screen, then click "Commencer
   gratuitement" under the Free plan.
3. Observe the resulting network request and the app's state afterward.

## Expected
Choosing Free should persist the selection server-side and close the gate, granting access to the
dashboard (or handing off to whatever the next onboarding step is).

## Actual
Matches expected. Clicking "Commencer gratuitement" fires `POST
https://fueni-staging-preview-pro.allweb.cloud/api/v1/doctors/me/plan` with body `{"plan":"FREE"}`,
which returns `200 OK` with `{"selectedPlan":"FREE","planSelectedAt":"2026-08-20T08:37:04...Z"}`.
The app then redirects to `/fr/dashboard`, and the plan gate is gone - replaced by a **separate,
unrelated** "Finalisez votre vérification" (KYC) gate, confirming the plan gate specifically
closed rather than the whole gating system being coincidentally bypassed. See
`002-free-selected-plan-gate-closed.png`.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation (network request inspected via the
browser tool's request log, including request/response bodies) - not yet cross-browser tested.

## Improvement suggestion
None needed - clean, well-instrumented success path (a real 200 with the persisted state visible
in the response body, not just an optimistic client-side redirect).
