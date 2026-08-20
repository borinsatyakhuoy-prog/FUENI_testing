# Defect: "Politique de confidentialité" and "Conditions générales (CGU)" buttons are dead UI elements (Patient app)

**Status:** CONFIRMED, reproduced live 2026-08-20. Not yet covered by an automated test.

**Severity: Low/Medium.** Missing functionality, not a crash - no console/page error either, so
it fails silently rather than visibly. Same class of defect as
`defects/notifications-bell-dead-control`, now confirmed in a second location.

**Environment:** `https://fueni-staging-preview-patient.allweb.cloud/fr/security`, "Mon compte &
mes données" section, authenticated session.

## Steps to Reproduce

1. Log in and navigate to "Connexion & Sécurité" (`/fr/security`).
2. Scroll to "Mon compte & mes données".
3. Click "Politique de confidentialité".
4. Separately, click "Conditions générales (CGU)".

## Description

Both controls render as real `<button type="button">` elements (not links - no `href`, so they
can't even be opened in a new tab via ctrl-click or "open in new tab"). Clicking either one does
nothing at all: no dialog, no modal, no navigation, no new tab, no network request, and no
console/page error. Confirmed via a direct DOM inspection (`outerHTML` shows no attached
navigation target) and a post-click check for `[role="dialog"]` elements and `window.location`
changes - both came back empty/unchanged both times.

## Expected Result

Clicking either button should show the actual Privacy Policy or Terms of Service content -
either by opening it in a new tab, navigating to a dedicated page, or opening a modal/dialog with
the text.

## Actual Result

Both buttons are inert no-ops. A user trying to read either legal document from this screen has
no way to do so.

## Evidence

Confirmed live 2026-08-20 via accessibility snapshot, `outerHTML` inspection, and a
post-click `document.querySelectorAll('[role="dialog"]')` / `window.location.href` check (no
dialog, same URL) for both buttons independently.
Screenshot: `test-results/screenshots/patient-legal-links-dead-buttons.png`.

## Recommendation

Same fix pattern as `defects/notifications-bell-dead-control`: either wire these buttons up to
the real Privacy Policy / Terms of Service content (a new page, an external link, or a modal),
or replace them with an honest "Bientôt disponible" state until the content exists - a silently
dead control that looks clickable (`hover:underline` styling) is worse than an explicit
placeholder. Given this is a healthcare platform explicitly marketing RGPD/HDS compliance, having
no reachable Privacy Policy from the account page is a real gap worth prioritizing over the
notifications bell.
