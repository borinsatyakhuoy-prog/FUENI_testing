# Defect: Console error on logout (CORS-blocked RSC fetch)

**Status:** CONFIRMED, live regression test in place (currently failing, as designed).

**Severity: Low.** No user-visible impact - the end-user flow isn't broken, the user still lands
on the login page correctly. Purely a console-level symptom.

**Environment:** `https://fueni-staging-preview-patient.allweb.cloud`.

## Description

On clicking "Se déconnecter", a Next.js RSC (React Server Component) prefetch for the
post-logout redirect target hits a cross-origin Keycloak URL that has no CORS headers set for
this origin. The resulting `TypeError: Failed to fetch` is thrown and caught, after which the
app falls back to a full browser navigation to the login page - so the user experience is
unaffected, but the error is real and visible in the console.

Confirmed live 2026-08-19: under heavier automated load against this shared staging host, the
CORS-blocked-fetch-then-fallback-navigation sequence was also observed taking noticeably longer
(>15s, previously always <15s) - the regression test's assertion timeout was raised from 15s to
30s to accommodate this, but the underlying root cause (and the console error itself) is
unchanged.

## Expected Result

No console/page errors during logout.

## Actual Result

A `TypeError: Failed to fetch` (CORS) is logged every time, immediately before the fallback
full-page navigation to the login page.

## Evidence

- `test-results/exploratory-findings.md` (Issue 1, 2026-08-17)
- `test-results/Report.md` Defects Log, Issue 1
- Live regression check: `tests/fueni-test/auth/006_logout-no-console-errors.spec.ts` (currently
  failing, as designed - will start passing automatically once fixed upstream)

## Recommendation

Either avoid an RSC-fetch-based navigation for a redirect target already known to be
cross-origin (Keycloak), or add the appropriate CORS headers on the Keycloak side so the
prefetch itself succeeds instead of failing and falling back.
