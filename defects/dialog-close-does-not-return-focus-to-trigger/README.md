# Defect: Closing a `/fr/security` inline form/dialog leaves focus on `<body>`, not the trigger button

**Status:** CONFIRMED on all 4 controls checked on `/fr/security`; confirmed **absent** on the 2
controls checked on `/fr/my-profile`. 2026-08-21. Not yet covered by an automated test.

**Severity: Low.** Accessibility/keyboard-navigation gap, not a functional one - the export
dialog's own focus trap (Tab cycling while open) works correctly; this is specifically about
where focus lands *after* closing.

**Scope precisely bounded to `/fr/security`, not app-wide:** swept every "Modifier"/"Changer"
control on both pages that have one. All 4 on `/fr/security` reproduce the gap identically -
"Exporter mes données" (Escape), "Changer" (password, via Annuler), "Modifier Adresse e-mail"
(via Annuler), "Modifier Téléphone" (via Annuler). Both controls on `/fr/my-profile` -
"Localisation & langue" and "Contact d'urgence" - correctly return focus to their own trigger
button after Annuler. This is a clean page-level split (`/fr/security`'s inline-edit component
vs. `/fr/my-profile`'s, despite `tests/fueni-test/security/002_contact-info-edit-cancel.spec.ts`'s
own comment describing them as "the same pattern") - not a single shared component with one
universal gap.

**Environment:** `https://fueni-staging-preview-patient.allweb.cloud/fr/security`, authenticated
session.

## Steps to Reproduce

1. Log in and go to "Connexion & Sécurité" (`/fr/security`).
2. Click any of: "Exporter mes données" (then press `Escape`), "Changer" (password, then
   "Annuler"), "Modifier Adresse e-mail" (then "Annuler"), or "Modifier Téléphone" (then
   "Annuler").
3. Check `document.activeElement`.

For contrast, the same steps on `/fr/my-profile`'s "Localisation & langue" or "Contact
d'urgence" Modifier controls correctly return focus - not reproducible there.

## Description

The dialog itself is well-built for keyboard use: it has a real focus trap (confirmed via 8
consecutive `Tab` presses cycling through exactly the dialog's own 4 focusable elements -
password show/hide toggle, "Annuler", the "Close" icon button, and the password input - never
escaping to the rest of the page), and `Escape` correctly cancels it without triggering an export
(confirmed: no `download` event fires).

However, once the dialog closes (via `Escape`), focus is not returned to the "Exporter mes
données" button that opened it. `document.activeElement` becomes `<body>` instead - confirmed
directly (`el === document.body` → `true`; `el === exportButton` → `false`). This is the
opposite of the standard dialog pattern (WAI-ARIA Authoring Practices Guide's Dialog pattern):
closing a dialog should return focus to whatever element triggered it, so keyboard and
screen-reader users don't lose their place in the page and have to re-navigate from the top.

## Expected Result

After closing the dialog (via Escape, the "Annuler" button, or the "Close" icon), focus should
return to the "Exporter mes données" button.

## Actual Result

Focus resets to `<body>` - effectively lost, requiring a keyboard user to tab through the page
from the beginning again to get back to where they were.

## Evidence

Confirmed live 2026-08-21 via Playwright, using a direct equality check
(`el === document.activeElement`) against each trigger button's element handle, not just an
inference from tag name:

| Control | Page | Focus returns to trigger? |
|---|---|---|
| "Exporter mes données" (closed via Escape) | `/fr/security` | ❌ No - `<body>` |
| "Changer" / password (closed via Annuler) | `/fr/security` | ❌ No - `<body>` |
| "Modifier Adresse e-mail" (closed via Annuler) | `/fr/security` | ❌ No - `<body>` |
| "Modifier Téléphone" (closed via Annuler) | `/fr/security` | ❌ No - `<body>` |
| "Localisation & langue" (closed via Annuler) | `/fr/my-profile` | ✅ Yes |
| "Contact d'urgence" (closed via Annuler) | `/fr/my-profile` | ✅ Yes |

## Recommendation

Have `/fr/security`'s inline-edit-form/dialog component store a reference to the triggering
element on open and call `.focus()` on it when it closes (via any close path - Escape, Annuler,
or the Close icon) - the standard fix for this class of issue, and the same pattern
`/fr/my-profile`'s equivalent component already implements correctly, so there's a working
reference implementation in the same codebase to copy from.
