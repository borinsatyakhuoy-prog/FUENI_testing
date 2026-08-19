# Defect: Login page wastes ~235px of empty vertical space at tablet width (768px), on both roles

**Status:** CONFIRMED, reproduced on both the patient and doctor login pages. Not yet covered by
an automated test.

**Severity: Low.** Cosmetic/layout only - the form itself remains fully usable (all fields
visible, nothing is cut off or blocked), just visually unfinished/wasteful at this width.

**Environment:** `https://fueni-staging-preview-patient.allweb.cloud/fr/login` and
`https://fueni-staging-preview-pro.allweb.cloud/fr/login`, viewport 768x1024 (a very common
tablet width, e.g. iPad portrait).

## Steps to Reproduce

1. Open either login page at a 768px-wide viewport (e.g. iPad portrait, or any browser resized
   to 768px).
2. Observe the top ~235px of the page: empty gray background, no content.
3. The "Bon retour"/"Welcome back" form itself sits left-aligned below that empty band, with
   noticeably more empty space on its right than its left - not properly centered either.

## Description

At the default desktop width (confirmed at 1600px in this suite's `playwright.config.ts`), the
login page shows a two-column layout: a left branded/marketing panel (headline, feature list,
compliance badges) and a right-hand login form. At mobile width (375px, confirmed clean), the
marketing panel is correctly hidden entirely and the form becomes a clean, tight single column
filling the viewport.

At 768px specifically, the marketing panel is ALSO hidden (same as mobile), but the form's own
top padding/margin does not collapse to match - it keeps whatever spacing was designed assuming
the (now-hidden) marketing panel would visually balance it. The result is a large empty band of
background with nothing in it, and a form that isn't recentered into the freed-up width either.

**Reproduced identically on both roles** - the patient and doctor login pages clearly share the
same layout component, so this is a single shared-component fix, not two separate bugs.

**Confirmed NOT present** on the registration wizards (patient and doctor both) - those use a
different, non-marketing-panel template that already handles 768px cleanly (centered card,
proper spacing) - see evidence screenshots for comparison.

## Expected Result

At 768px, either: (a) keep showing the marketing panel if there's room for a legible two-column
layout, or (b) if it stays hidden like mobile, the form's spacing/centering should adapt the same
way the mobile layout does, without leaving a large empty gap.

## Actual Result

Empty ~235px band at the top, form left-aligned with asymmetric empty space on either side.

## Evidence

- `patient-login-tablet-768-highlighted.png` - annotated with the empty region outlined
- `patient-login-tablet-768-plain.png` - unannotated, same viewport
- `doctor-login-tablet-768.png` - same issue reproduced on the doctor app, same viewport
- For comparison: `defects/../doctor-country-not-listed-english-text.png` and the patient/doctor
  registration pages (not attached here) render correctly at this same width - see session notes,
  2026-08-19.

## Recommendation

Fix the shared login-page layout component so its content spacing/centering responds to the same
breakpoint that hides the marketing panel, rather than only hiding the panel and leaving its
reserved space behind. Low priority given no functional impact, but a quick, high-visibility
polish item since 768px is an extremely common real device width.
