# Defect (possible spec mismatch): Doctor KYC form doesn't match two expected requirements

**Status:** CONFIRMED behavior via live retest, 2026-08-20 - see
`test-case/doctor-kyc-verification/README.md` items 001.5 and 008 for the full retest context.
Verdict on each sub-finding depends on the real KYC spec, which this session didn't have direct
access to - flagging both as observed mismatches against the requested test cases, not asserting
either is definitely wrong.

**Severity: Low-Medium (pending spec confirmation).** No functional breakage - the form works as
built - but if either requirement below was genuinely intended, this is a real gap in what
should be collected before a doctor's identity is verified.

**Environment:** `https://fueni-staging-preview-pro.allweb.cloud/fr/kyc`, doctor role, PENDING_KYC
account, observed 2026-08-20.

## Description

### 1. Only 1 of 2 upload slots is mandatory, not both

The KYC form's "Justificatifs" section has exactly two upload slots:
- "Pièce d'identité (CNI, passeport ou carte professionnelle)" - labeled **Facultatif**
  (optional)
- "Attestation ou carte d'inscription à l'Ordre des médecins (ou équivalent)" - labeled
  **Obligatoire** (mandatory)

The requested test case ("Upload slots render — 2 mandatory documents only") implies both should
be mandatory. As built, only one is. Either the test case's expectation doesn't match the real
requirement, or the identity-document slot should also be mandatory and currently isn't.

### 2. No professional liability insurance field exists

A requested test case ("Professional liability insurance - optional field") implies this form
should have a field or upload slot for professional liability insurance, marked optional. No such
field, label, or upload slot exists anywhere on the form (confirmed via full-page screenshot,
`test-case/doctor-kyc-verification/screenshots/000-kyc-form-initial-state.png`) - only the two
document slots above, plus professional-info fields (specialty, medical order number, national ID
number, region/city, practice address) and three declaration checkboxes.

## Steps to Reproduce

1. Log into the doctor app with a PENDING_KYC account.
2. Navigate to the KYC verification form (`/fr/kyc` or via the dashboard's "Compléter mon dossier
   de vérification" prompt).
3. Review the "Justificatifs" section's two upload slots and their mandatory/optional labels.
4. Search the full form for any insurance-related field - there is none.

## Expected Result

Per the requested test cases: both documents mandatory, and a present-but-optional professional
liability insurance field/upload slot.

## Actual Result

Only the "Attestation" document is mandatory; the ID document is optional. No insurance field
exists at all.

## Evidence

`test-case/doctor-kyc-verification/screenshots/000-kyc-form-initial-state.png` (full-page
screenshot of the complete, unmodified form).

## Recommendation

Confirm against the real KYC requirements document (not this session's second-hand summary of
test case titles) whether:
- the ID document should be upgraded from optional to mandatory, and
- a professional liability insurance field should be added (and if so, whether it's a text field,
  a document upload, or both).

Don't change either based on this write-up alone - it only establishes what's currently built
doesn't match the two test case titles as given.
