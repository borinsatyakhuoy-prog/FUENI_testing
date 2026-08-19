# Defect: "Connexion & Sécurité" page overflows horizontally by ~26px at 320px width

**Status:** CONFIRMED, reproduced on the patient app. Not yet covered by an automated test.
Doctor-app equivalent page not checked this pass (authenticated doctor pages are currently
unreachable - see `tickets/DOCTOR-ROLE-registration-blocked-by-turnstile`), but the "Mot de
passe" row uses the same generic label+value+action layout pattern seen elsewhere in the app, so
it's worth re-checking once the doctor role is reachable again.

**Severity: Low.** Cosmetic/layout only - the page remains usable (the "Changer" button still
works once scrolled to), but it's the first page in this suite's responsive testing found to
force real horizontal scrolling of the whole page, which is normally considered a hard responsive
bug (unlike the merely-wasteful-space finding in `defects/responsive-tablet-empty-whitespace`).

**Environment:** `https://fueni-staging-preview-patient.allweb.cloud/fr/security`, viewport
320x568.

## Steps to Reproduce

1. Log in and navigate to "Connexion & Sécurité" (`/fr/security`) at a 320px-wide viewport.
2. Scroll to the "Mot de passe" section.
3. Observe the page has a horizontal scrollbar, and the "Changer" button's label is clipped to
   "Chang" at the right edge of the viewport.

## Actual Result

`document.documentElement.scrollWidth` is 331px against a 320px viewport (~26px of horizontal
overflow) - `patient-security-320-overflow.png` shows the clipped button and the horizontal
scrollbar/arrows at the bottom of the page. Scrolling ~26px right reveals the full, correctly
rendered button (`patient-security-320-scrolled-into-view.png`).

**Root cause (confirmed via DOM inspection):** the "Mot de passe" row is a
`flex items-center gap-4` container holding the label, the password-dots placeholder, and the
"Changer" button. At 320px there isn't enough room for all three inline, but the row has no
`flex-wrap` and the button doesn't shrink - so instead of wrapping to a second line or truncating,
the button is pushed past its own flex container's right edge, and that overflow propagates all
the way up to the document, forcing the whole page into horizontal-scroll mode.

## Confirmed NOT present at 375px

At 375px, `document.documentElement.scrollWidth` is 360px (less than the 375px viewport) - no
overflow. This is specifically a 320px-and-narrower issue, same pattern as the sibling defect
`defects/login-phone-placeholder-clipped-320`.

## Expected Result

No page should ever force horizontal scrolling on its own account at a supported breakpoint. The
"Mot de passe" row should wrap onto two lines (label+value above, button below) or shrink the
button, the way other rows on the same page (e.g. "Adresse e-mail" / "Modifier") appear to already
handle correctly at this width.

## Evidence

- `patient-security-320-highlighted.png` - default scroll position, the 320px viewport edge drawn
  in and labelled right where the "Changer" button gets cut off
- `patient-security-320-overflow.png` - same view, unannotated; horizontal scrollbar visible
- `patient-security-320-scrolled-into-view.png` - scrolled ~26px right, full button visible

## Recommendation

Add `flex-wrap: wrap` (or switch to a stacked/column layout below a breakpoint) to the "Mot de
passe" row's container so it degrades the same way the rest of the page already does, rather than
overflowing the document. Should be quick to fix and worth doing before 320px-class devices are
considered supported, since document-level horizontal scroll is a more disruptive class of bug
than the wasted-space finding already on file.
