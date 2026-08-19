# Defect: Unknown-route 404 page is generic and unbranded (Patient app)

**Status:** CONFIRMED, live regression test in place (covers the functional 404 status/heading
only, not the branding gap - see Recommendation).

**Severity: Low.** Cosmetic/consistency only - the 404 itself works correctly: real HTTP 404, no
crash, no redirect loop. Doesn't block any user flow.

**Environment:** `https://fueni-staging-preview-patient.allweb.cloud`.

## Description

Navigating to a nonexistent route (e.g. `/fr/this-route-does-not-exist-xyz123`) correctly
returns an HTTP 404, but the page itself is Next.js's default "404 / This page could not be
found." - plain text, English-only, no FUENI header/sidebar/footer, no link back into the app.
Every other page in the product is branded and in French.

## Expected Result

A branded, localized 404 page consistent with the rest of the app, with a link back to the
dashboard/home.

## Actual Result

Next.js's default unstyled English 404 page.

## Evidence

- `test-results/exploratory-findings.md` (Session 2, 2026-08-18)
- `test-results/Report.md` Defects Log
- Live regression check (functional only): `tests/fueni-test/navigation/006_unknown-route-404.spec.ts`

## Recommendation

Add a branded, French, in-app 404 page with a link back to the dashboard - low priority, cosmetic
quick win.
