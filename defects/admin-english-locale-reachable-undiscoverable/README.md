# Defect (possible spec mismatch): Admin console's /en/ route is fully functional but undiscoverable

**Status:** CONFIRMED behavior via live retest, 2026-08-20 - see
`test-case/admin/app-shell-fue-815/005-french-only-no-language-selector/README.md`. Severity/
verdict depends on intent, which this session doesn't have visibility into.

**Severity: Low.** Not a security issue and not broken - the English version works correctly.
This is a mismatch against a specific requirement ("no reachable /en/ admin URL"), not a
functional bug.

**Environment:** `https://fueni-staging-preview-admin.allweb.cloud`, observed 2026-08-20.

## Description

The admin console has no language-selector control anywhere in its UI - confirmed by inspecting
every page visited this session. This matches an expectation that the admin console is
French-only by design (unlike the patient/doctor apps, which both expose an FR/EN toggle).

However, navigating directly to `https://fueni-staging-preview-admin.allweb.cloud/en` renders a
**complete, fully-translated English version** of the console - not a partial or broken
translation. Page title, sidebar labels, welcome text, and date formatting are all correctly
localized ("Overview", "Dashboard", "Management", "Verifications", "Audit log", "Subscriptions
(Soon)", "Configuration", "Plans", "Pricing", "Welcome to the Fueni admin portal.", "August 20,
2026").

So the requirement "no reachable /en/ admin URL" is not met: the route is reachable and fully
functional, it's just not linked from anywhere in the UI.

## Steps to Reproduce

1. Log into the admin console normally (lands on `/fr`).
2. In the same authenticated session, navigate directly to `/en`.
3. Observe the fully English-rendered console.

## Expected Result

Per the retested requirement, `/en` should not be a reachable/functional admin URL.

## Actual Result

`/en` is fully reachable and renders a complete English translation of the console.

## Evidence

`test-case/admin/app-shell-fue-815/005-french-only-no-language-selector/admin-en-url-reachable.png`

## Recommendation

Confirm intent with the FUENI team before treating this as something to fix:
- If French-only was a deliberate, hard requirement (e.g. regulatory or DSI policy reasons):
  the `/en` route should actively redirect to `/fr` (or 404) rather than silently serving a full
  English console that just isn't linked anywhere.
- If having an available-but-undiscoverable English option was actually fine (e.g. some FUENI
  staff are expected to type the URL directly): no code change needed, but the requirement
  wording should be corrected to reflect that "no reachable /en/" isn't actually the real policy.
