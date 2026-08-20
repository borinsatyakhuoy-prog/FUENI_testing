# Defect: Shared "muted foreground" text color fails WCAG 2 AA contrast across the app

**Status:** CONFIRMED via automated axe-core scan (`@axe-core/playwright`), 2026-08-20. Live
regression test: `tests/fueni-test/a11y/001_accessibility-scan.spec.ts` (currently failing on
both pages scanned, by design).

**Severity: Medium.** Not a crash or blocking defect, but a real, systemic, automatically-detected
WCAG 2 AA failure (`color-contrast`, axe impact: **serious**) affecting a shared design-system
color token used throughout the app, not an isolated one-off.

**Environment:** `/fr/login` (patient login, Keycloak-hosted - see security/011) and
`/fr/dashboard` (authenticated patient app), both scanned with axe-core's `wcag2a`/`wcag2aa` tag
set, chromium, 2026-08-20.

## Description

Both pages scanned produce `color-contrast` violations (axe rule `color-contrast`, WCAG 1.4.3),
all traceable to the same root cause: the shared `text-muted-foreground` Tailwind/design-token
color, rendered as `#647a8b`, against various light backgrounds used across the app
(`#ffffff`, `#fafbfc`, `#f1f6f9`). Measured contrast ratios range **4.1-4.46:1**, all just under
the **4.5:1** minimum WCAG 2 AA requires for normal-weight text. This is a small, single-token
gap (not a wildly off color choice), but it recurs on both scanned pages across many distinct
elements - among those found:

- Login page: "Accueil" link, the "Connectez-vous avec votre e-mail..." subtitle, the login
  tab-list text, "Pas encore de compte ? S'inscrire", "Vous êtes un professionnel de santé ?"
- Dashboard: the "Prenez un rendez-vous pour commencer." and "Vos documents médicaux
  apparaîtront ici." empty-state captions

**A second, more severe instance found on the same login page:** the "Connexion chiffrée et
sécurisée" caption uses a different, lighter foreground color (`#91a1ad`) against `#fafbfc`,
measuring only **2.56:1** contrast - well below the 4.5:1 requirement, not a borderline case like
the others.

## Steps to Reproduce

1. Run `npx playwright test tests/fueni-test/a11y --project=chromium`, or manually run an
   axe-core scan (tags `wcag2a`, `wcag2aa`) against `/fr/login` or an authenticated `/fr/dashboard`.
2. Review the `color-contrast` violations returned.

## Expected Result

All text should meet at least a 4.5:1 contrast ratio against its background per WCAG 2 AA
(normal-weight text under 18pt/14pt-bold).

## Actual Result

Multiple elements across at least two pages measure 4.1-4.46:1 (the shared muted-text token) and
one measures 2.56:1 (a separate, lighter caption style) - all below the 4.5:1 minimum.

## Evidence

Captured via `tests/fueni-test/a11y/001_accessibility-scan.spec.ts`'s axe-core scan output,
2026-08-20 - full violation details (exact nodes, computed colors, contrast ratios) available in
the test's failure output/trace on any run.

## Recommendation

- Priority 1: fix the "Connexion chiffrée et sécurisée" caption's color (`#91a1ad`) - it's the
  most severe gap (2.56:1) and cheapest to isolate since it's a distinct style, not the shared
  token.
- Priority 2: darken the shared `text-muted-foreground` token (`#647a8b`) slightly - since it's a
  single design-system value, fixing it once should resolve most of the other flagged instances
  app-wide, not just the specific elements found in this first, non-exhaustive scan.
- This scan covered only 2 of the app's many pages - consider expanding
  `tests/fueni-test/a11y/` to more pages once these two known issues are triaged, so new
  violations aren't hidden behind already-known ones.
