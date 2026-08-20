# 005 - French only — no language selector, no reachable /en/ admin URL

**Result:** 🔴 MISMATCH, half confirmed / half contradicted

## How to test
1. Look for a language-selector control anywhere in the admin console UI.
2. Try navigating directly to `/en` on the admin domain.

## Expected
Per the test case title: no language selector should exist, and `/en/` should not be reachable
(the whole console should be French-only).

## Actual
**Split result:**
- **No language selector:** confirmed true - no FR/EN toggle button exists anywhere in the admin
  console (unlike the patient and doctor apps, which both have one).
- **`/en` is NOT unreachable - it fully works:** navigating directly to
  `https://fueni-staging-preview-admin.allweb.cloud/en` renders a **complete, fully-translated
  English version** of the console - page title "Overview", sidebar "Dashboard / Management /
  Verifications / Audit log / Subscriptions (Soon) / Configuration / Plans / Pricing", welcome
  text "Welcome to the Fueni admin portal.", date format "August 20, 2026". See
  `admin-en-url-reachable.png`.

So the test case's premise is half right: there's genuinely no way to *discover* the English
version through the UI, but it's fully reachable and functional if you know (or guess) the URL -
directly contradicting "no reachable /en/ admin URL".

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
Decide deliberately between two consistent options: either add a visible language selector (so
`/en` becomes discoverable, matching the patient/doctor apps), or actually block `/en` server-side
if French-only is the intended policy for admin. The current middle state - reachable but
undiscoverable - is the worst of both and reads as an oversight rather than a decision.
