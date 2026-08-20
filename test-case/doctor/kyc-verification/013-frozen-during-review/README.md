# 013 - Slot editable until submit, frozen during review — server-enforced edit-lock

**Result:** ✅ PASS

## How to test
1. Submit a complete KYC dossier successfully (see test case 012).
2. Navigate directly to `/fr/kyc` again (a fresh full-page navigation, not a client-side link
   click) to check whether the form is still reachable/editable.

## Expected
The KYC form should no longer be editable once submitted and under review, and this should be
enforced server-side (a direct navigation should not simply render the form again), not just a
client-side link being hidden.

## Actual
Matches expected. Navigating directly to `/fr/kyc` after submission **redirects to
`/fr/dashboard`** and shows a read-only "Vérification en cours" status modal instead of the
editable form. See `013-frozen-during-review.png`. Because this was a full page navigation (not
an in-app link), the redirect demonstrates server-side enforcement, not just a hidden UI
element.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.
