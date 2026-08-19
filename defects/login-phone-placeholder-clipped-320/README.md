# Defect: Phone-number placeholder text is clipped mid-word at 320px width, on both roles

**Status:** CONFIRMED, reproduced on both the patient and doctor login pages. Not yet covered by
an automated test.

**Severity: Low.** Cosmetic only - the field itself is fully usable (clicking in and typing works
normally; the placeholder simply disappears once you type), just visually broken at this width.

**Environment:** `https://fueni-staging-preview-patient.allweb.cloud/fr/login` and
`https://fueni-staging-preview-pro.allweb.cloud/fr/login`, "Téléphone" tab, viewport 320x568 (the
narrowest common phone width, e.g. iPhone SE/5/original SE, many older/budget Android devices).

## Steps to Reproduce

1. Open either login page at a 320px-wide viewport.
2. Select the "Téléphone" tab (already the default on the patient app; click it explicitly on the
   doctor app, which defaults to "E-mail").
3. Look at the phone-number input's placeholder text.

## Actual Result

The placeholder reads "Numéro de télép" / "Numéro de télépl" - visibly cut off mid-word, with no
ellipsis or other truncation indicator. Confirmed via computed styles that the input's
`text-overflow` is `clip` (not `ellipsis`) and the field's rendered width at this breakpoint is
only ~150px, too narrow for the full string "Numéro de téléphone".

**Reproduced identically on both roles** - same shared login-page/phone-input component as the
already-documented `defects/responsive-tablet-empty-whitespace` (768px) issue, confirming this
component has more than one un-tuned breakpoint.

## Expected Result

Either a shorter placeholder string at narrow widths, or `text-overflow: ellipsis` so the text
truncates cleanly (e.g. "Numéro de té…") instead of being clipped mid-word.

## Confirmed NOT present at 375px

At 375px width the same input renders at ~205px and displays the full placeholder text with no
clipping - see `patient-login-375-not-clipped.png` for comparison. This is specifically a
320px-and-narrower issue.

## Evidence

- `patient-login-320-highlighted.png` - patient login, Téléphone tab, 320px, the clipped input
  outlined and labelled
- `patient-login-320-clipped.png` - same view, unannotated
- `patient-login-375-not-clipped.png` - same field at 375px, full text displays correctly
- `doctor-login-320-clipped.png` - same issue reproduced on the doctor app, same viewport

## Recommendation

Either shorten the placeholder copy so it fits comfortably at 320px, or add
`text-overflow: ellipsis` (plus `overflow: hidden` / `white-space: nowrap`, likely already present
given the clipping behavior) to the input's style so any future overflow degrades gracefully
instead of clipping mid-character. Low priority given no functional impact, but a cheap,
high-visibility polish item since 320px is still a real, if shrinking, device width.
